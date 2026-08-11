/**
 * @vitest-environment jsdom
 */
import { afterEach, describe, expect, it } from 'vitest'
import { Editor } from '@tiptap/core'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import { LinkExtension } from './link-extension'

const openEditors: Editor[] = []

afterEach(() => {
  // An undestroyed view keeps a DOM observer timer alive past teardown.
  while (openEditors.length) openEditors.pop()?.destroy()
})

function editorWith(content: string) {
  const editor = new Editor({
    extensions: [Document, Paragraph, Text, LinkExtension],
    content,
  })
  openEditors.push(editor)
  return editor
}

/** The document's inline HTML, with the link's boilerplate attributes dropped. */
function inlineHTML(editor: Editor): string {
  return editor
    .getHTML()
    .replace(/ target="_blank" rel="noopener noreferrer nofollow"/g, '')
    .replace(/^<p>|<\/p>$/g, '')
}

/** Type `text` at the cursor the way the view does, one character at a time. */
function type(editor: Editor, text: string) {
  for (const char of text) {
    editor.view.dispatch(editor.state.tr.insertText(char))
  }
}

/** Put the cursor at the end of the link in `<p>…<a>link</a>…</p>`. */
function cursorAtLinkEnd(editor: Editor, linkText: string) {
  const text = editor.state.doc.textContent
  editor.commands.setTextSelection(
    text.indexOf(linkText) + linkText.length + 1, // +1 for the paragraph open token
  )
}

describe('exitLinkOnSpacePlugin', () => {
  it('leaves a space typed at the end of a link outside the link', () => {
    const editor = editorWith(
      '<p>see <a href="https://example.com">docs</a></p>',
    )
    cursorAtLinkEnd(editor, 'docs')

    type(editor, ' ')

    expect(inlineHTML(editor)).toBe(
      'see <a href="https://example.com">docs</a> ',
    )
  })

  it('ends the link, so text typed after the space is not linked', () => {
    const editor = editorWith(
      '<p>see <a href="https://example.com">docs</a></p>',
    )
    cursorAtLinkEnd(editor, 'docs')

    type(editor, ' and more')

    expect(inlineHTML(editor)).toBe(
      'see <a href="https://example.com">docs</a> and more',
    )
  })

  it('handles a run of spaces', () => {
    const editor = editorWith(
      '<p>see <a href="https://example.com">docs</a></p>',
    )
    cursorAtLinkEnd(editor, 'docs')

    type(editor, '   x')

    expect(inlineHTML(editor)).toBe(
      'see <a href="https://example.com">docs</a>   x',
    )
  })

  it('ends the link when the space is typed between the link and later text', () => {
    const editor = editorWith(
      '<p><a href="https://example.com">docs</a>tail</p>',
    )
    cursorAtLinkEnd(editor, 'docs')

    type(editor, ' ')

    expect(inlineHTML(editor)).toBe(
      '<a href="https://example.com">docs</a> tail',
    )
  })

  it('keeps a space typed inside link text linked', () => {
    const editor = editorWith(
      '<p><a href="https://example.com">clickme</a></p>',
    )
    editor.commands.setTextSelection(1 + 'click'.length)

    type(editor, ' ')

    expect(inlineHTML(editor)).toBe(
      '<a href="https://example.com">click me</a>',
    )
  })

  it('leaves non-whitespace typed at the end of a link alone', () => {
    // The mark is inclusive on purpose: a URL still being typed keeps growing.
    const editor = editorWith('<p><a href="https://example.com">docs</a></p>')
    cursorAtLinkEnd(editor, 'docs')

    type(editor, '/api')

    expect(inlineHTML(editor)).toBe(
      '<a href="https://example.com">docs/api</a>',
    )
  })

  it('does not relink an autolinked URL onto the space that triggered it', () => {
    const editor = editorWith('<p></p>')

    type(editor, 'see https://example.com/a then')

    expect(inlineHTML(editor)).toBe(
      'see <a href="https://example.com/a">https://example.com/a</a> then',
    )
  })

  it('stays out of the way when the editor is not editable', () => {
    const editor = editorWith('<p><a href="https://example.com">docs</a></p>')
    editor.setEditable(false)
    cursorAtLinkEnd(editor, 'docs')

    type(editor, ' x')

    expect(inlineHTML(editor)).toBe('<a href="https://example.com">docs x</a>')
  })
})
