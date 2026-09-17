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
 */

import { dirname, join } from 'node:path'

/** The ten packages `loadLanguage` can reach, and nothing else. */
const OPTIONAL_LANGUAGES = new Set([
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

  return {
    name: 'frappeui-code-languages',
    // `pre`, so the hook runs before Vite's resolver and can ask for it by
    // hand. `this.resolve` reports the absence instead of throwing it.
    enforce: 'pre',

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
      const pkg = id.slice(VIRTUAL_PREFIX.length)
      // The message matches Node's and Vite's own wording for a module that is
      // not there, because that is what happened.
      return `throw new Error(${JSON.stringify(
        `Cannot find module '${pkg}'`,
      )})\n`
    },
  }
}
