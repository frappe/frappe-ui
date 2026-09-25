/**
 * Lets an app build `frappe-ui/code-editor` with only the language packages it
 * installed.
 *
 * `loadLanguage(key)` picks one of ten `@codemirror/lang-*` packages behind a
 * literal `await import()`. The ten are optional peers, so most apps install
 * two or three. A literal specifier is statically analyzable, though: Rollup
 * resolves every arm of that switch while it builds the graph, and one absent
 * package ends the build with
 *
 *     [vite]: Rollup failed to resolve import "@codemirror/lang-sql"
 *
 * before `loadLanguage` can report anything. The failure names neither the
 * caller nor the install command.
 *
 * This plugin resolves an absent one to a module that throws
 * `Cannot find module '<pkg>'` when it is evaluated. The build then succeeds,
 * the chunk is a few bytes, and `loadLanguage`'s own catch turns the throw into
 * its install hint — the same message a missing package produces at runtime.
 *
 * Only frappe-ui's own `languages` module is stubbed, and it is identified by
 * resolving `frappe-ui/code-editor` in the app rather than by its path. An app
 * that imports `@codemirror/lang-sql` itself still fails its build, which is the
 * honest answer: nothing guards that import.
 *
 * The same job has to be done twice. `resolveId` covers the Rollup graph, which
 * is the production build and every dev request the server transforms.
 * Dependency pre-bundling needs its own plugin registration: an esbuild
 * adapter for Vite 7, or the same hooks registered with Rolldown for Vite 8.
 * `frappe-ui/code-editor` is a bare specifier, so it is pre-bundled, and an absent
 * language there does not degrade — esbuild fails the optimize step and the dev
 * server exits:
 *
 *     Error during dependency optimization:
 *     ✘ [ERROR] Could not resolve "@codemirror/lang-json"
 *
 * Register the esbuild adapter through `optimizeDeps.esbuildOptions.plugins`
 * for Vite 7, and the shared hooks through `optimizeDeps.rolldownOptions.plugins`
 * for Vite 8.
 */

import { dirname, join } from 'node:path'

/**
 * The ten packages `loadLanguage` can reach, and nothing else. A language added
 * to `languages.ts` and not added here leaves the plugin silently short, and
 * this repo would not notice: it carries all ten as devDependencies. The test
 * reads the set out of `languages.ts` and compares it, which is why this is
 * exported.
 */
export const OPTIONAL_LANGUAGES = new Set([
  '@codemirror/lang-css',
  '@codemirror/lang-html',
  '@codemirror/lang-javascript',
  '@codemirror/lang-json',
  '@codemirror/lang-markdown',
  '@codemirror/lang-python',
  '@codemirror/lang-sass',
  '@codemirror/lang-sql',
  '@codemirror/lang-xml',
  '@codemirror/lang-yaml',
])

const VIRTUAL_PREFIX = '\0frappe-ui:absent-language:'

/** esbuild has no `\0` convention; it separates virtual modules by namespace. */
const NAMESPACE = 'frappe-ui-absent-language'

/** Marks a `build.resolve` call as ours, so the hook does not re-enter itself. */
const SKIP = 'frappeuiCodeLanguages'

/** The module body a stub gets. Evaluating it is the missing package. */
function stub(pkg) {
  // The message matches Node's and Vite's own wording for a module that is not
  // there, because that is what happened.
  return `throw new Error(${JSON.stringify(`Cannot find module '${pkg}'`)})\n`
}

/** Drop the query Vite appends, the extension, and Windows separators. */
function moduleKey(id) {
  return id
    .split('?')[0]
    .replace(/\\/g, '/')
    .replace(/\.[^./]+$/, '')
}

export function codeLanguages() {
  // `frappe-ui/code-editor`'s own directory, resolved once per build. A path
  // test would be wrong: an app is free to keep its own
  // `src/code-editor/languages.ts`, and stubbing a package that file needs
  // would turn a missing dependency into a runtime error.
  let languagesModule

  function resolveLanguagesModule(context) {
    if (!languagesModule) {
      languagesModule = context
        .resolve('frappe-ui/code-editor', undefined, { skipSelf: true })
        .then((resolved) =>
          resolved
            ? join(dirname(moduleKey(resolved.id)), 'languages').replace(
                /\\/g,
                '/',
              )
            : null,
        )
        // An app without frappe-ui installed has nothing to stub.
        .catch(() => null)
    }
    return languagesModule
  }

  const hooks = {
    buildStart() {
      languagesModule = null
    },

    async resolveId(source, importer, options) {
      if (!OPTIONAL_LANGUAGES.has(source) || !importer) return null
      if (moduleKey(importer) !== (await resolveLanguagesModule(this))) {
        return null
      }

      const resolved = await this.resolve(source, importer, {
        ...options,
        skipSelf: true,
      })
      if (resolved) return null

      return VIRTUAL_PREFIX + source
    },

    load(id) {
      if (!id.startsWith(VIRTUAL_PREFIX)) return null
      return stub(id.slice(VIRTUAL_PREFIX.length))
    },
  }

  return {
    name: 'frappeui-code-languages',
    // Check optional languages before Vite reports an unresolved import.
    enforce: 'pre',
    ...hooks,

    config() {
      // Reuse the hooks for Rolldown pre-bundling. Vite 8's esbuild adapter
      // lacks `build.resolve` and `initialOptions.absWorkingDir`.
      if (this?.meta?.rolldownVersion) {
        return {
          optimizeDeps: {
            rolldownOptions: {
              plugins: [{ name: 'frappeui-code-languages', ...hooks }],
            },
          },
        }
      }
      return { optimizeDeps: { esbuildOptions: { plugins: [esbuildTwin()] } } }
    },
  }
}

/**
 * Pre-bundling support for Vite versions that use esbuild.
 */
function esbuildTwin() {
  return {
    name: 'frappeui-code-languages',
    setup(build) {
      let languagesModule

      /** frappe-ui's `languages` module, or `null` if frappe-ui is absent. */
      async function resolveLanguagesModule() {
        if (!languagesModule) {
          languagesModule = build
            .resolve('frappe-ui/code-editor', {
              kind: 'import-statement',
              resolveDir: build.initialOptions.absWorkingDir ?? process.cwd(),
              pluginData: { [SKIP]: true },
            })
            .then(({ path, errors }) =>
              path && errors.length === 0
                ? join(dirname(moduleKey(path)), 'languages').replace(
                    /\\/g,
                    '/',
                  )
                : null,
            )
            .catch(() => null)
        }
        return languagesModule
      }

      build.onResolve({ filter: /^@codemirror\/lang-/ }, async (args) => {
        if (args.pluginData?.[SKIP]) return null
        if (!OPTIONAL_LANGUAGES.has(args.path) || !args.importer) return null
        if (moduleKey(args.importer) !== (await resolveLanguagesModule())) {
          return null
        }

        // `build.resolve` reports the absence in `errors` and does not raise
        // it, so asking is safe. Its errors are ours to report or drop.
        const resolved = await build.resolve(args.path, {
          kind: args.kind,
          importer: args.importer,
          resolveDir: dirname(args.importer),
          pluginData: { [SKIP]: true },
        })
        if (resolved.path && resolved.errors.length === 0) return null

        return { path: args.path, namespace: NAMESPACE }
      })

      build.onLoad({ filter: /.*/, namespace: NAMESPACE }, (args) => ({
        contents: stub(args.path),
        loader: 'js',
      }))
    },
  }
}
