/**
 * @vitest-environment jsdom
 */
import { afterEach, describe, expect, it } from 'vitest'
import { Editor, Extension, type Extensions } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import { UndoRedo } from '@tiptap/extensions'
import { LinkExtension } from './link-extension'

const openEditors: Editor[] = []

afterEach(() => {
  // An undestroyed view keeps a DOM observer timer alive past teardown.
  while (openEditors.length) openEditors.pop()?.destroy()
})

function editorWith(content: string, extensions: Extensions = []) {
  const editor = new Editor({
    extensions: [Document, Paragraph, Text, LinkExtension, ...extensions],
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

  it('leaves a trailing space outside a link applied over it', () => {
    // A mark-only change: no text moves, so the plugin has to read the changed
    // range off the AddMarkStep itself.
    const editor = editorWith('<p>see docs tail</p>')

    editor
      .chain()
      .setTextSelection({ from: 5, to: 10 }) // "docs "
      .setLink({ href: 'https://example.com' })
      .setTextSelection(10)
      .run()

    expect(inlineHTML(editor)).toBe(
      'see <a href="https://example.com">docs</a> tail',
    )
  })

  it('keeps a link whose text is only whitespace', () => {
    // Ending the link would delete it outright, which is not this plugin's job.
    const editor = editorWith('<p>a b</p>')

    editor
      .chain()
      .setTextSelection({ from: 2, to: 3 })
      .setLink({ href: 'https://example.com' })
      .setTextSelection(3)
      .run()

    expect(inlineHTML(editor)).toBe('a<a href="https://example.com"> </a>b')
  })

  it('ignores a change made elsewhere in the document', () => {
    // A collaborator's keystroke (or an undo) must not rewrite marks the user
    // never touched, even with the cursor resting after an already-linked space.
    const editor = editorWith(
      '<p>see <a href="https://example.com">docs </a>tail</p>',
    )
    editor.commands.setTextSelection(10) // just after the linked space

    const tr = editor.state.tr.insertText('Z', 1, 1)
    tr.setSelection(editor.state.selection.map(tr.doc, tr.mapping))
    editor.view.dispatch(tr)

    expect(inlineHTML(editor)).toBe(
      'Zsee <a href="https://example.com">docs </a>tail',
    )
  })

  it('leaves a remote collaboration change to the peer that made it', () => {
    // Stand-in for y-prosemirror's plugin: the real one is pulled in by a
    // consumer's Collaboration extension, so it cannot be imported here.
    const ySyncKey = new PluginKey('y-sync')
    const YSync = Extension.create({
      name: 'ySyncStandIn',
      addProseMirrorPlugins: () => [new Plugin({ key: ySyncKey })],
    })
    const editor = editorWith(
      '<p>see <a href="https://example.com">docs</a></p>',
      [YSync],
    )
    cursorAtLinkEnd(editor, 'docs')

    // That peer runs this same plugin; its result replicates on its own.
    editor.view.dispatch(editor.state.tr.insertText(' ').setMeta(ySyncKey, {}))

    expect(inlineHTML(editor)).toBe(
      'see <a href="https://example.com">docs </a>',
    )
  })

  it('undoes the space and the mark change as one step', () => {
    const editor = editorWith(
      '<p>see <a href="https://example.com">docs</a></p>',
      [UndoRedo],
    )
    cursorAtLinkEnd(editor, 'docs')
    type(editor, ' ')

    editor.commands.undo()

    expect(inlineHTML(editor)).toBe(
      'see <a href="https://example.com">docs</a>',
    )
  })

  it('stays out of the way when the editor is not editable', () => {
    // A read-only user cannot type, so this drives the guard through
    // `view.dispatch` instead: it pins the guard rather than the user path,
    // which matters for a programmatic write into a read-only editor.
    const editor = editorWith('<p><a href="https://example.com">docs</a></p>')
    editor.setEditable(false)
    cursorAtLinkEnd(editor, 'docs')

    type(editor, ' x')

    expect(inlineHTML(editor)).toBe('<a href="https://example.com">docs x</a>')
  })
})
