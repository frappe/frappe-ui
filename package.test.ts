/**
 * The published package manifest.
 *
 * These assert what `npm publish` puts in the tarball and what a consumer's
 * resolver sees: the files list, the `exports` conditions, the bins, and the
 * rule that every bare import in shipped code is a declared dependency.
 */
import { describe, expect, it } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import { builtinModules } from 'node:module'
import { fileURLToPath } from 'node:url'

const root = path.dirname(fileURLToPath(import.meta.url))
const pkg = JSON.parse(
  fs.readFileSync(path.join(root, 'package.json'), 'utf8'),
) as {
  bin: Record<string, string>
  files: string[]
  imports: Record<string, string[]>
  exports: Record<string, Record<string, string>>
  dependencies: Record<string, string>
  peerDependencies: Record<string, string>
  devDependencies: Record<string, string>
}

/** The negation patterns that keep development files out of the tarball. */
const EXCLUSIONS = [
  '!**/*.test.ts',
  '!**/*.test.js',
  '!**/*.spec.ts',
  '!**/*.cy.ts',
  '!**/*.story.vue',
  '!**/*.playground.vue',
  '!**/stories',
  '!**/test-helpers.ts',
  '!src/mocks',
]

describe('files', () => {
  it('excludes tests, specs, stories, playgrounds and the msw mocks', () => {
    expect(pkg.files).toEqual(expect.arrayContaining(EXCLUSIONS))
  })

  it('lists every exclusion after every inclusion', () => {
    // npm applies the list in order, so an inclusion after a negation would
    // put the excluded files back.
    const firstExclusion = pkg.files.findIndex((entry) => entry.startsWith('!'))
    expect(firstExclusion).toBeGreaterThan(0)
    expect(
      pkg.files.slice(firstExclusion).every((e) => e.startsWith('!')),
    ).toBe(true)
  })

  it('ships every bin target', () => {
    const included = pkg.files.filter((entry) => !entry.startsWith('!'))
    for (const target of Object.values(pkg.bin)) {
      const relative = target.replace(/^\.\//, '')
      const shipped = included.some(
        (entry) => entry === relative || relative.startsWith(`${entry}/`),
      )
      expect(shipped, `${relative} is not in "files"`).toBe(true)
      expect(fs.existsSync(path.join(root, relative))).toBe(true)
    }
  })

  it('makes every bin executable from the package root', () => {
    for (const target of Object.values(pkg.bin)) {
      const source = fs.readFileSync(
        path.join(root, target.replace(/^\.\//, '')),
        'utf8',
      )
      expect(source.startsWith('#!')).toBe(true)
    }
  })
})

describe('exports', () => {
  it('gives every code subpath a types condition', () => {
    for (const [subpath, conditions] of Object.entries(pkg.exports)) {
      if (subpath.endsWith('.css') || subpath.endsWith('.json')) continue
      expect(
        Object.keys(conditions),
        `${subpath} has no "types" condition`,
      ).toContain('types')
    }
  })

  it('points every condition at a file that exists', () => {
    for (const conditions of Object.values(pkg.exports)) {
      for (const target of Object.values(conditions)) {
        expect(fs.existsSync(path.join(root, target)), target).toBe(true)
      }
    }
  })

  it('has no wildcard subpath, so `frappe-ui/src/...` stays blocked', () => {
    expect(Object.keys(pkg.exports).some((s) => s.includes('*'))).toBe(false)
  })

  /**
   * `frappe-ui/vite` is hand-written JavaScript with a hand-written `.d.ts`,
   * so the two can drift. A runtime export the declaration file omits is
   * invisible to a TypeScript consumer.
   */
  it('declares every named export of `frappe-ui/vite`', () => {
    const js = fs.readFileSync(path.join(root, 'vite/index.js'), 'utf8')
    const dts = fs.readFileSync(path.join(root, 'vite/index.d.ts'), 'utf8')
    const named = (source: string) => {
      const names = new Set<string>()
      for (const match of source.matchAll(/export\s*\{([^}]*)\}/g)) {
        for (const part of match[1].split(',')) {
          const name = part.trim().split(/\s+as\s+/).pop()?.trim()
          if (name) names.add(name)
        }
      }
      for (const match of source.matchAll(
        /export\s+declare\s+function\s+(\w+)/g,
      ))
        names.add(match[1])
      return names
    }
    const missing = [...named(js)].filter((name) => !named(dts).has(name))
    expect(missing).toEqual([])
  })
})

describe('peer dependencies', () => {
  it('pins Tailwind to v3.4 or later, below v4', () => {
    // The preset is a v3 config object, and the spacing scale relies on v3.4
    // reading `theme('spacing')` for minWidth/maxWidth/minHeight.
    expect(pkg.peerDependencies.tailwindcss).toBe('>=3.4.0 <4')
  })

  /**
   * CI installs the dev range, so a dev floor below the peer floor means the
   * suite proves nothing about the version consumers are told to use. On
   * Tailwind 3.3 the sizing families lose the generated scale silently,
   * because 3.3 does not read `theme('spacing')` for them.
   */
  it('keeps the dev Tailwind floor at or above the peer floor', () => {
    const floor = (range: string) => {
      const match = range.match(/(\d+)\.(\d+)\.(\d+)/)
      if (!match) throw new Error(`no version in range: ${range}`)
      return [Number(match[1]), Number(match[2]), Number(match[3])]
    }
    const dev = floor(pkg.devDependencies.tailwindcss)
    const peer = floor(pkg.peerDependencies.tailwindcss)
    expect(
      dev[0] > peer[0] ||
        (dev[0] === peer[0] &&
          (dev[1] > peer[1] || (dev[1] === peer[1] && dev[2] >= peer[2]))),
      `dev ${pkg.devDependencies.tailwindcss} is below peer ${pkg.peerDependencies.tailwindcss}`,
    ).toBe(true)
    // And still inside the peer's upper bound.
    expect(pkg.devDependencies.tailwindcss.startsWith('^3.')).toBe(true)
  })

  it('declares vite and vitepress as optional peers', () => {
    expect(pkg.peerDependencies.vite).toBeDefined()
    expect(pkg.peerDependencies.vitepress).toBeDefined()
    expect(
      (pkg as unknown as { peerDependenciesMeta: Record<string, unknown> })
        .peerDependenciesMeta,
    ).toMatchObject({ vite: { optional: true }, vitepress: { optional: true } })
  })
})

// ---------------------------------------------------------------------------
// Every bare import in shipped code resolves from a declared dependency.
// ---------------------------------------------------------------------------

const SHIPPED_ROOTS = [
  'src',
  'vite',
  'icons',
  'tailwind',
  'vitepress',
  'experimental',
  'scripts',
]

const NOT_SHIPPED =
  /(\.test\.|\.spec\.|\.cy\.|\.story\.vue|\.playground\.vue|\/stories\/|\/mocks\/)/

/**
 * Packages a shipped file may import without declaring: each one is installed
 * by a declared peer, so it resolves wherever that peer does.
 */
const VIA_PEER: Record<string, string> = {
  shiki: 'vitepress',
  '@shikijs/transformers': 'vitepress',
  'markdown-it': 'vitepress',
  '@vue/compiler-dom': 'vue',
}

function shippedFiles(): string[] {
  const out: string[] = []
  const walk = (dir: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name)
      const relative = full.slice(root.length + 1)
      if (entry.isDirectory()) walk(full)
      else if (
        /\.(ts|js|vue|mjs|cjs)$/.test(entry.name) &&
        !NOT_SHIPPED.test(`/${relative}`)
      )
        out.push(relative)
    }
  }
  for (const dir of SHIPPED_ROOTS) walk(path.join(root, dir))
  out.push('experimental.ts')
  return out
}

const IMPORT_PATTERNS = [
  /^\s*import\s[^'"]*?from\s*['"]([^'"]+)['"]/gm,
  /^\s*import\s*['"]([^'"]+)['"]/gm,
  /^\s*export\s[^'"]*?from\s*['"]([^'"]+)['"]/gm,
  /\bimport\(\s*['"]([^'"]+)['"]\s*\)/g,
]

const BUILTINS = new Set(builtinModules)

function packageName(specifier: string): string | null {
  if (/^[.\/#~]/.test(specifier)) return null
  if (specifier.startsWith('node:') || specifier.startsWith('virtual:'))
    return null
  const parts = specifier.split('/')
  const name = specifier.startsWith('@')
    ? parts.slice(0, 2).join('/')
    : parts[0]
  // Node builtins written without the `node:` prefix, and the package's own
  // name (a self-reference, which the `exports` map resolves).
  if (BUILTINS.has(name) || name === 'frappe-ui') return null
  return name
}

/**
 * Resolve a `#` specifier the way a consumer's resolver does: match a pattern
 * key, then try each target in order and take the first file that exists.
 */
function resolveSelfImport(specifier: string): string | null {
  for (const [pattern, targets] of Object.entries(pkg.imports)) {
    const [prefix, suffix] = pattern.split('*')
    if (suffix !== '' || !specifier.startsWith(prefix)) continue
    const rest = specifier.slice(prefix.length)
    for (const target of targets) {
      const file = path.join(root, target.replace('*', rest))
      if (fs.existsSync(file) && fs.statSync(file).isFile()) return file
    }
  }
  return null
}

describe('shipped imports', () => {
  it('imports only declared dependencies', () => {
    const declared = new Set([
      ...Object.keys(pkg.dependencies),
      ...Object.keys(pkg.peerDependencies),
      ...Object.keys(VIA_PEER),
    ])
    const undeclared = new Map<string, string>()

    for (const file of shippedFiles()) {
      const source = fs.readFileSync(path.join(root, file), 'utf8')
      for (const pattern of IMPORT_PATTERNS) {
        pattern.lastIndex = 0
        let match: RegExpExecArray | null
        while ((match = pattern.exec(source))) {
          const name = packageName(match[1])
          if (name && !declared.has(name) && !undeclared.has(name))
            undeclared.set(name, file)
        }
      }
    }

    expect(Object.fromEntries(undeclared)).toEqual({})
  })

  it('resolves every `#` self-import through the imports map', () => {
    // The package ships TypeScript source, so a consumer's compiler resolves
    // these specifiers itself. It reads `imports` (the repo's own tsconfig
    // `paths` is not published), and it does not add an extension or an
    // `index` segment on its own, so each pattern lists those forms.
    const unresolved = new Map<string, string>()

    for (const file of shippedFiles()) {
      const source = fs.readFileSync(path.join(root, file), 'utf8')
      for (const pattern of IMPORT_PATTERNS) {
        pattern.lastIndex = 0
        let match: RegExpExecArray | null
        while ((match = pattern.exec(source))) {
          const specifier = match[1]
          if (!specifier.startsWith('#')) continue
          if (resolveSelfImport(specifier)) continue
          if (!unresolved.has(specifier)) unresolved.set(specifier, file)
        }
      }
    }

    expect(Object.fromEntries(unresolved)).toEqual({})
  })

  it('lists the plain path first in every imports pattern', () => {
    // Node and Vite take the first entry in the array and do not check that the
    // file exists, so the plain path has to lead or `#components/Button/Button.vue`
    // resolves to `Button.vue.ts`. TypeScript does check, and falls through to
    // the `.ts` and `index.ts` forms it needs.
    for (const [pattern, targets] of Object.entries(pkg.imports)) {
      expect([pattern, targets[0]]).toEqual([
        pattern,
        pattern.replace('#', './src/'),
      ])
    }
  })

  it('keeps the packages it only imports at build time out of dependencies', () => {
    for (const name of ['vite', 'vitepress', 'tailwindcss']) {
      expect(pkg.dependencies[name]).toBeUndefined()
    }
  })
})
