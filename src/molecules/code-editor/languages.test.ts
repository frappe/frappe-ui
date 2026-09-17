/**
 * @vitest-environment jsdom
 *
 * `loadLanguage` is the one public member whose whole job is a mapping: ten
 * keys, one special case, and an error message the docs and the migration guide
 * quote word for word. All three are pinned here.
 */
import { EditorState } from '@codemirror/state'
import { ensureSyntaxTree } from '@codemirror/language'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { loadLanguage, type LanguageKey } from './index'

/** Number of nodes the parser marked as an error in the whole document. */
function errorCount(state: EditorState) {
  let errors = 0
  ensureSyntaxTree(state, state.doc.length, 5000)?.iterate({
    enter: (node) => {
      if (node.type.isError) errors += 1
    },
  })
  return errors
}

const KEYS: LanguageKey[] = [
  'json',
  'html',
  'javascript',
  'python',
  'sql',
  'markdown',
  'css',
  'scss',
  'yaml',
  'xml',
]

afterEach(() => {
  vi.resetModules()
  vi.doUnmock('@codemirror/lang-sql')
})

describe('loadLanguage', () => {
  it.each(KEYS)('loads %s into a state that parses', async (key) => {
    const extension = await loadLanguage(key)

    expect(extension).not.toBeNull()
    // The real check is that the value is a usable extension, not that it is
    // truthy: a language that fails to resolve its parser throws here.
    const state = EditorState.create({ doc: 'a', extensions: [extension!] })
    expect(state.doc.toString()).toBe('a')
  })

  // `constructor` and `toString` come off `Object.prototype`: a `key in PACKAGES`
  // guard lets them through, and they resolve to `undefined` rather than `null`.
  it.each([
    'plain',
    'plaintext',
    'rust',
    '',
    undefined,
    'JSON',
    'constructor',
    'toString',
    'valueOf',
    'hasOwnProperty',
  ])('resolves %s to null rather than guessing', async (key) => {
    // Unknown keys are plain text, and the match is case-sensitive: Desk
    // hands over `df.options` unnormalized.
    await expect(loadLanguage(key)).resolves.toBeNull()
  })

  it('maps scss to lang-sass in brace mode', async () => {
    // There is no `@codemirror/lang-scss`. `indented: false` is what selects
    // SCSS syntax over the indented Sass dialect, and the two dialects disagree
    // about the same two documents, so parse both and read the answer off the
    // error counts.
    const extension = (await loadLanguage('scss'))!
    const parse = (doc: string) =>
      errorCount(EditorState.create({ doc, extensions: [extension] }))

    expect(parse('a {\n  color: red;\n}\n')).toBe(0)
    // The indented dialect accepts this one and the brace dialect does not.
    expect(parse('a\n  color: red\n')).toBeGreaterThan(0)
  })

  it('names the package to install when it is not there', async () => {
    // The optional peer is the whole point: an app installs the languages it
    // renders, and the ones it does not are a missing module at runtime.
    vi.doMock('@codemirror/lang-sql', () => {
      throw new Error("Cannot find module '@codemirror/lang-sql'")
    })
    const { loadLanguage: load } = await import('./languages')

    const error = await load('sql').catch((thrown: unknown) => thrown)

    expect((error as Error).message).toBe(
      "[frappe-ui] loadLanguage('sql') needs @codemirror/lang-sql. " +
        'Install it: yarn add @codemirror/lang-sql',
    )
    // Replacing the message without keeping the cause would hide a real failure
    // inside the language package behind an install hint that is not it.
    expect((error as Error).cause).toBeInstanceOf(Error)
  })
})
