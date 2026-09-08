/**
 * @vitest-environment jsdom
 *
 * TipTap only opens `@` after a space by default. Mentions also have to fire
 * after opening brackets and quotes (`(@jane`) without matching emails
 * (`jane@example.com`). Typography rewrites straight quotes to curly ones, so
 * those prefixes are covered too.
 */
import { describe, it, expect, afterEach } from 'vitest'
import { Editor, type AnyExtension } from '@tiptap/core'
import { Document } from '@tiptap/extension-document'
import { Paragraph } from '@tiptap/extension-paragraph'
import { Text } from '@tiptap/extension-text'
import { PluginKey } from '@tiptap/pm/state'
import { Typography } from '../../extensions'
import { MentionExtension } from './mention-extension'

const openEditors: Editor[] = []

function makeEditor(extra: AnyExtension[] = []) {
  const editor = new Editor({
    extensions: [
      Document,
      Paragraph,
      Text,
      MentionExtension.configure({
        items: [{ id: 'jane', label: 'Jane' }],
      }),
      ...extra,
    ],
    content: '<p></p>',
  })
  openEditors.push(editor)
  return editor
}

function mentionActive(editor: Editor) {
  const ext = editor.extensionManager.extensions.find(
    (e) => e.name === 'mentionSuggestion',
  )
  const key = ext?.options.suggestion.pluginKey as PluginKey | undefined
  return Boolean(
    key && (key.getState(editor.state) as { active?: boolean })?.active,
  )
}

/** Type one character at a time so Typography input rules can fire. */
function type(editor: Editor, text: string) {
  for (const char of text) {
    const { from, to } = editor.state.selection
    const handled = editor.view.someProp('handleTextInput', (handler) =>
      handler(editor.view, from, to, char, () =>
        editor.state.tr.insertText(char),
      ),
    )
    if (!handled) editor.view.dispatch(editor.state.tr.insertText(char))
  }
}

describe('Mention allowedPrefixes', () => {
  afterEach(() => {
    while (openEditors.length) openEditors.pop()?.destroy()
  })

  it('opens at the start of a paragraph and after a space', () => {
    const editor = makeEditor()
    editor.commands.insertContent('@')
    expect(mentionActive(editor)).toBe(true)

    editor.commands.setContent('<p></p>')
    editor.commands.insertContent('hello @')
    expect(mentionActive(editor)).toBe(true)
  })

  it.each([
    '(',
    '[',
    '{',
    '<',
    '（',
    '【',
    '《',
    '「',
    '『',
    '«',
    '‹',
    '"',
    "'",
    '“',
    '”',
    '‘',
    '’',
    '」',
    '』',
    '»',
    '›',
  ])('opens immediately after %s', (prefix) => {
    const editor = makeEditor()
    editor.commands.insertContent(`${prefix}@`)
    expect(mentionActive(editor)).toBe(true)
  })

  it('opens the toolbar mention after a bracket without inserting a space', () => {
    const editor = makeEditor()
    editor.commands.insertContent('(')
    expect(editor.commands.openSuggestionMenu('mentionSuggestion')).toBe(true)
    expect(editor.state.doc.textContent).toBe('(@')
    expect(mentionActive(editor)).toBe(true)
  })

  it('opens after a quote that Typography has already curled', () => {
    const editor = makeEditor([Typography])
    type(editor, '"@')
    expect(editor.state.doc.textContent.startsWith('“')).toBe(true)
    expect(mentionActive(editor)).toBe(true)

    editor.commands.setContent('<p></p>')
    type(editor, "'@")
    expect(editor.state.doc.textContent.startsWith('‘')).toBe(true)
    expect(mentionActive(editor)).toBe(true)
  })

  it('opens after a pasted non-breaking space', () => {
    const editor = makeEditor()
    editor.commands.insertContent('\u00a0@')
    expect(mentionActive(editor)).toBe(true)
  })

  it('does not open in the middle of an email address', () => {
    const editor = makeEditor()
    editor.commands.insertContent('jane@')
    expect(mentionActive(editor)).toBe(false)
  })
})
