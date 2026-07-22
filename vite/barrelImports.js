import fs from 'node:fs'
import path from 'node:path'
import MagicString from 'magic-string'
import { init, parse } from 'es-module-lexer'

/**
 * Rewrites `import { Button } from 'frappe-ui'` into a deep import of the
 * module that actually declares `Button`.
 *
 * `frappe-ui`'s entry is a pure re-export barrel (~100 `export *` / `export {}`
 * lines, no side effects). In dev that is expensive: Vite serves unbundled ESM,
 * so pulling one component makes the browser request the barrel *and* every
 * module it re-exports — echarts, TipTap, CodeMirror, socket.io included. Vite's
 * dep optimizer then discovers those packages mid-crawl and issues a full
 * "optimized dependencies changed. reloading" round trip.
 *
 * Deep imports in source would fix it but cost the ergonomics of a single
 * import specifier, so this plugin does the rewrite at transform time instead.
 * Authors keep writing `from 'frappe-ui'`.
 *
 * Only named imports are rewritten. Namespace (`import * as`) and side-effect
 * imports are left alone, as is any named import this plugin cannot map — an
 * unknown name falls back to a residual barrel import so behaviour never
 * silently changes.
 */
export function barrelImports(options = {}) {
  const {
    // Bare specifiers to rewrite. Each must resolve to a pure re-export barrel.
    packages = ['frappe-ui'],
    // Extensions whose source may contain rewritable imports.
    include = /\.(vue|ts|tsx|js|jsx|mts|mjs)($|\?)/,
    exclude = /[\\/]node_modules[\\/](?!frappe-ui)/,
    // Only rewrite when the package resolves to a working copy rather than an
    // installed dependency. See `isWorkingCopy` — rewriting an installed package
    // is a net loss, so this defaults on. Set false to force the rewrite.
    linkedOnly = true,
  } = options

  // bare specifier -> Map<exportName, { module, imported }>
  const maps = new Map()
  let ready = null
  // The barrel entry files themselves — rewriting those would be circular.
  const barrelFiles = new Set()
  let resolver

  const RESOLVE_EXTS = ['.ts', '.tsx', '.vue', '.js', '.jsx', '.mts', '.mjs']

  /**
   * Is this barrel a working copy (the library's own source, or a directory
   * symlinked into node_modules) rather than an installed dependency?
   *
   * The distinction decides whether rewriting helps or hurts. Vite pre-bundles
   * *bare* specifiers, so an installed `frappe-ui` is served as one optimized
   * chunk; rewriting to an absolute deep path opts out of that and makes the
   * browser fetch every source module instead. When the package is a working
   * copy Vite cannot pre-bundle it anyway (that would freeze HMR), so the whole
   * barrel gets crawled and the rewrite is a large win.
   *
   * Resolving symlinks first is what makes this safe under pnpm, whose
   * `node_modules/<pkg>` is always a symlink into its content-addressed store —
   * a naive `isSymbolicLink()` check would misread every pnpm install as linked.
   * A real working copy resolves to a path outside any `node_modules`.
   */
  function isWorkingCopy(barrelFile) {
    const NM = `${path.sep}node_modules${path.sep}`
    if (!barrelFile.includes(NM)) return true
    try {
      return !fs.realpathSync(barrelFile).includes(NM)
    } catch {
      return false
    }
  }

  function resolveFile(spec, fromFile) {
    const base = path.resolve(path.dirname(fromFile), spec)
    const candidates = [
      ...(path.extname(base) ? [base] : []),
      ...RESOLVE_EXTS.map((e) => base + e),
      ...RESOLVE_EXTS.map((e) => path.join(base, 'index' + e)),
    ]
    return candidates.find((c) => fs.existsSync(c) && fs.statSync(c).isFile())
  }

  /**
   * Split an import/export clause body (`A, B as C, type D`) into specifiers.
   * Shared by both sides of the rewrite: the barrel's `export { ... } from`
   * clauses and the author's `import { ... } from` clauses have identical
   * grammar. Type-only specifiers are dropped — they are erased before runtime,
   * so mapping them to a real module would emit an import of a binding that
   * does not exist there.
   */
  function parseClause(clause) {
    const out = []
    for (const raw of clause.split(',')) {
      const part = raw.trim()
      if (!part || /^type\s/.test(part)) continue
      const [imported, local = imported] = part
        .split(/\s+as\s+/)
        .map((s) => s.trim())
      if (imported) out.push({ imported, local })
    }
    return out
  }

  /**
   * Read one module's export surface.
   *
   * es-module-lexer does the parsing, which buys two things a regex cannot:
   * type-only statements (`export type { T } from './t'`) are skipped outright,
   * and every export name carries a source offset. Correlating that offset with
   * the enclosing statement's range is what attributes a name to its module —
   * no scanning, and no chance of matching an import that appears inside a
   * string (the docs render import statements as sample code).
   */
  function parseModule(file) {
    const src = fs.readFileSync(file, 'utf8')
    const [imports, exports] = parse(src)

    // Statements with a specifier that begin with `export` are re-exports;
    // a plain `import ... from` is not part of the module's export surface.
    const stmts = imports.filter((i) => i.n && src.startsWith('export', i.ss))
    const owned = new Map(stmts.map((s) => [s, []]))
    const locals = []

    for (const e of exports) {
      const stmt = stmts.find((s) => e.s >= s.ss && e.s <= s.se)
      if (stmt) owned.get(stmt).push(e.n)
      else locals.push(e.n)
    }

    const stars = []
    const named = []
    for (const stmt of stmts) {
      const open = src.indexOf('{', stmt.ss)
      // `export * from './x'` owns no names and has no clause. `export * as ns`
      // does own a name but is left unmapped, falling back to the barrel.
      if (open === -1 || open > stmt.se) {
        if (!owned.get(stmt).length) stars.push(stmt.n)
        continue
      }
      const close = src.lastIndexOf('}', stmt.se)
      for (const spec of parseClause(src.slice(open + 1, close))) {
        named.push({ ...spec, spec: stmt.n })
      }
    }

    return { stars, named, locals }
  }

  /**
   * Every name a module exposes, following its own `export *` chains. Used to
   * attribute a barrel's `export * from './x'` names to `./x` itself — that is
   * the granularity we want, since it preserves each module's public API and is
   * already small enough to serve directly.
   */
  function collectNames(file, depth, seen) {
    if (depth > 3 || seen.has(file)) return []
    seen.add(file)
    let parsed
    try {
      parsed = parseModule(file)
    } catch {
      return []
    }
    const names = [...parsed.locals, ...parsed.named.map((n) => n.local)]
    for (const spec of parsed.stars) {
      const next = resolveFile(spec, file)
      if (next) names.push(...collectNames(next, depth + 1, seen))
    }
    return names
  }

  /** Walk a barrel, mapping every re-exported name to its providing module. */
  function buildMap(barrelFile) {
    const map = new Map()
    let parsed
    try {
      parsed = parseModule(barrelFile)
    } catch {
      return map
    }

    for (const n of parsed.named) {
      const target = resolveFile(n.spec, barrelFile)
      if (!target || map.has(n.local)) continue
      map.set(n.local, { module: target, imported: n.imported })
    }

    for (const spec of parsed.stars) {
      const target = resolveFile(spec, barrelFile)
      if (!target) continue
      for (const name of collectNames(target, 0, new Set())) {
        if (!map.has(name)) map.set(name, { module: target, imported: name })
      }
    }

    return map
  }

  return {
    name: 'frappeui-barrel-imports',
    enforce: 'pre',

    async configResolved(config) {
      resolver = config.createResolver({ ssr: false })
      ready = null
    },

    async transform(code, id) {
      const file = id.split('?')[0]
      if (!include.test(file) || exclude.test(file)) return
      if (!packages.some((pkg) => code.includes(pkg))) return

      // Built on first use rather than in buildStart: Vite runs buildStart per
      // environment (client/ssr), and a module transformed before the hook
      // completes would silently fall back to the barrel.
      ready ||= (async () => {
        await init
        for (const pkg of packages) {
          const resolved = await resolver(pkg, undefined, false)
          if (!resolved) continue
          const barrel = resolved.split('?')[0]
          if (linkedOnly && !isWorkingCopy(barrel)) {
            if (process.env.FRAPPEUI_BARREL_DEBUG) {
              console.log(
                `[barrel-imports] ${pkg} -> installed dependency, leaving it to Vite's dep pre-bundling`,
              )
            }
            continue
          }
          maps.set(pkg, buildMap(barrel))
          // Only the barrel itself is off-limits. The library's own components
          // import the public specifier too (200+ files, stories included), and
          // rewriting those is the single biggest win — it also breaks the
          // component -> barrel -> component import cycle.
          barrelFiles.add(barrel)
          if (process.env.FRAPPEUI_BARREL_DEBUG) {
            console.log(
              `[barrel-imports] ${pkg} -> ${barrel}: ${maps.get(pkg).size} names mapped`,
            )
          }
        }
      })()
      await ready

      if (barrelFiles.has(file)) return

      let s
      for (const [pkg, map] of maps) {
        if (!map.size || !code.includes(pkg)) continue

        const stmtRe = new RegExp(
          // group 1: `type ` when the whole statement is type-only
          // group 2: the `{ ... }` clause   group 3: quote style
          //
          // `[^}]` (not `[\s\S]*?`) is load-bearing: a lazy any-char clause
          // happily spans several statements to reach a later `} from
          // 'frappe-ui'`, swallowing unrelated imports into the clause.
          // Import clauses never contain a brace, so this cannot over-match.
          // Anchored to line start so import statements quoted *inside* source
          // (the docs render `"import { X } from 'frappe-ui'"` as sample code)
          // are left alone — rewriting those produces invalid syntax.
          String.raw`^[ \t]*import\s+(type\s+)?\{([^}]*)\}\s*from\s*(['"])` +
            pkg.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') +
            String.raw`\3`,
          'gm',
        )

        for (const m of [...code.matchAll(stmtRe)]) {
          // Type-only statements are erased before runtime; leave them be so
          // editors keep resolving them against the package's public types.
          if (m[1]) continue

          // Keep the raw clause too: parseClause drops type-only specifiers,
          // which must still be re-emitted on the residual barrel import.
          const specs = parseClause(m[2])
          if (!specs.length) continue
          const kept = new Set(specs.map((sp) => sp.local))
          const dropped = m[2]
            .split(',')
            .map((raw) => raw.trim())
            .filter((part) => part && !kept.has(part.split(/\s+as\s+/).pop().trim()))

          const byModule = new Map()
          const residual = []
          for (const spec of specs) {
            const hit = map.get(spec.imported)
            // A module that reaches its own export through the barrel would
            // become a self-import; leave those on the barrel.
            if (!hit || hit.module === file) {
              residual.push(`${spec.imported}${spec.local === spec.imported ? '' : ` as ${spec.local}`}`)
              continue
            }
            if (!byModule.has(hit.module)) byModule.set(hit.module, [])
            byModule.get(hit.module).push({ ...spec, hit })
          }
          if (!byModule.size) continue

          const lines = []
          for (const [module, items] of byModule) {
            // The barrel may rename (`export { default as Tabs }`); import the
            // module's own name and alias back to what the author wrote.
            const only = items.length === 1 ? items[0] : null
            if (only && only.hit.imported === 'default') {
              lines.push(`import ${only.local} from ${JSON.stringify(module)}`)
              continue
            }
            const names = items.map(({ local, hit }) =>
              hit.imported === local ? local : `${hit.imported} as ${local}`,
            )
            lines.push(
              `import { ${names.join(', ')} } from ${JSON.stringify(module)}`,
            )
          }
          const leftover = [...residual, ...dropped]
          if (leftover.length) {
            lines.push(`import { ${leftover.join(', ')} } from '${pkg}'`)
          }

          s ||= new MagicString(code)
          s.overwrite(m.index, m.index + m[0].length, lines.join('\n'))
        }
      }

      if (!s) return
      return { code: s.toString(), map: s.generateMap({ hires: true }) }
    },
  }
}

export default barrelImports
