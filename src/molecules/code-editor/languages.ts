import type { Extension } from '@codemirror/state'

/**
 * The language keys `loadLanguage` understands. Anything else resolves to
 * `null` (plain text, no highlighting).
 *
 * The list stays because two consumers already wrote this key-to-language
 * switch by hand: framework-ui's `Fields/fieldtypeToLanguage.ts` and Builder's
 * `createCodeMirrorState.ts`.
 */
export type LanguageKey =
  | 'json'
  | 'html'
  | 'javascript'
  | 'python'
  | 'sql'
  | 'markdown'
  | 'css'
  | 'scss'
  | 'yaml'
  | 'xml'

/**
 * The package each key needs. Doubles as the key list, and names the package in
 * the install hint below. `scss` maps to `@codemirror/lang-sass`; there is no
 * `@codemirror/lang-scss`.
 */
const PACKAGES: Record<LanguageKey, string> = {
  json: '@codemirror/lang-json',
  html: '@codemirror/lang-html',
  javascript: '@codemirror/lang-javascript',
  python: '@codemirror/lang-python',
  sql: '@codemirror/lang-sql',
  markdown: '@codemirror/lang-markdown',
  css: '@codemirror/lang-css',
  scss: '@codemirror/lang-sass',
  yaml: '@codemirror/lang-yaml',
  xml: '@codemirror/lang-xml',
}

async function build(key: LanguageKey): Promise<Extension> {
  switch (key) {
    case 'json':
      return (await import('@codemirror/lang-json')).json()
    case 'html':
      return (await import('@codemirror/lang-html')).html()
    case 'javascript':
      return (await import('@codemirror/lang-javascript')).javascript()
    case 'python':
      return (await import('@codemirror/lang-python')).python()
    case 'sql':
      return (await import('@codemirror/lang-sql')).sql()
    case 'markdown':
      return (await import('@codemirror/lang-markdown')).markdown()
    case 'css':
      return (await import('@codemirror/lang-css')).css()
    case 'scss':
      // `lang-sass` covers both — `indented: false` selects SCSS (brace) syntax.
      return (await import('@codemirror/lang-sass')).sass({ indented: false })
    case 'yaml':
      return (await import('@codemirror/lang-yaml')).yaml()
    case 'xml':
      return (await import('@codemirror/lang-xml')).xml()
  }
}

/**
 * Dynamically import the CodeMirror language extension for `key`.
 *
 * The ten `@codemirror/lang-*` packages are optional peer dependencies, so an
 * app installs only the ones it renders. A missing package throws an error that
 * names the one to install; an unknown key resolves to `null`.
 *
 * The import is dynamic even though the engine's CodeMirror is static: ten
 * grammars is a real cost, and the key is usually only known at runtime (Desk
 * reads it off `df.options`).
 */
export async function loadLanguage(key?: string): Promise<Extension | null> {
  // `Object.hasOwn`, not `key in PACKAGES`: `in` walks the prototype chain, so
  // `constructor` and `toString` would pass the guard, match no `case` in
  // `build`, and resolve to `undefined` instead of the promised `null`. Desk
  // hands `df.options` over unnormalized.
  if (!key || !Object.hasOwn(PACKAGES, key)) return null
  const languageKey = key as LanguageKey
  try {
    return await build(languageKey)
  } catch (error) {
    const pkg = PACKAGES[languageKey]
    // The reason rides in the message, not only in `cause`: most error
    // reporters log `message` alone, and a lazy chunk that 404s after a deploy
    // would otherwise read as a package that was never installed.
    const reason = error instanceof Error ? error.message : String(error)
    throw new Error(
      `[frappe-ui] loadLanguage('${languageKey}') could not load ${pkg}: ${reason}. ` +
        `If it is not installed: yarn add ${pkg}`,
      { cause: error },
    )
  }
}
