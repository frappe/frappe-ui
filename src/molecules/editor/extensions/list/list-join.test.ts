/**
 * @vitest-environment jsdom
 */
import { describe, it, expect } from 'vitest'
import { Editor } from '@tiptap/core'
import { StarterKit } from '../../extensions'

function editorWith(content: string) {
  return new Editor({ extensions: [StarterKit], content })
}

/** Position just inside the first empty top-level paragraph. */
function emptyParagraphPos(editor: Editor): number {
  let found = -1
  editor.state.doc.forEach((node, offset) => {
    if (
      found === -1 &&
      node.type.name === 'paragraph' &&
      node.content.size === 0
    )
      found = offset
  })
  return found + 1
}

describe('ListJoin', () => {
  it('merges two adjacent ordered lists so numbering continues', () => {
    const editor = editorWith(
      '<ol><li><p>hello</p></li></ol><p></p><ol><li><p>world</p></li></ol>',
    )
    // Deleting the paragraph between the lists leaves them touching.
    const pos = emptyParagraphPos(editor)
    editor.commands.deleteRange({ from: pos - 1, to: pos + 1 })

    const lists = editor
      .getJSON()
      .content!.filter((n) => n.type === 'orderedList')
    expect(lists).toHaveLength(1)
    expect(lists[0].content).toHaveLength(2)
  })

  it('merges adjacent bullet lists', () => {
    const editor = editorWith(
      '<ul><li><p>a</p></li></ul><p></p><ul><li><p>b</p></li></ul>',
    )
    const pos = emptyParagraphPos(editor)
    editor.commands.deleteRange({ from: pos - 1, to: pos + 1 })

    const lists = editor
      .getJSON()
      .content!.filter((n) => n.type === 'bulletList')
    expect(lists).toHaveLength(1)
    expect(lists[0].content).toHaveLength(2)
  })

  it('leaves lists of different kinds alone', () => {
    const editor = editorWith(
      '<ol><li><p>a</p></li></ol><p></p><ul><li><p>b</p></li></ul>',
    )
    const pos = emptyParagraphPos(editor)
    editor.commands.deleteRange({ from: pos - 1, to: pos + 1 })

    const types = editor.getJSON().content!.map((n) => n.type)
    expect(types).toContain('orderedList')
    expect(types).toContain('bulletList')
  })

  it('keeps a list that was deliberately renumbered separate', () => {
    const editor = editorWith(
      '<ol><li><p>a</p></li></ol><p></p><ol start="7"><li><p>b</p></li></ol>',
    )
    const pos = emptyParagraphPos(editor)
    editor.commands.deleteRange({ from: pos - 1, to: pos + 1 })

    const lists = editor
      .getJSON()
      .content!.filter((n) => n.type === 'orderedList')
    expect(lists).toHaveLength(2)
    expect(lists[1].attrs!.start).toBe(7)
  })

  it('keeps a list with its own marker style separate', () => {
    const editor = editorWith(
      '<ol><li><p>a</p></li></ol><p></p><ol type="a"><li><p>b</p></li></ol>',
    )
    const pos = emptyParagraphPos(editor)
    editor.commands.deleteRange({ from: pos - 1, to: pos + 1 })

    const lists = editor
      .getJSON()
      .content!.filter((n) => n.type === 'orderedList')
    expect(lists).toHaveLength(2)
    expect(lists[1].attrs!.type).toBe('a')
  })

  it('merges a chain of three adjacent lists in one pass', () => {
    const editor = editorWith(
      '<ol><li><p>a</p></li></ol><ol><li><p>b</p></li></ol><ol><li><p>c</p></li></ol><p>x</p>',
    )
    editor.commands.insertContentAt(editor.state.doc.content.size - 1, 'y')

    const lists = editor
      .getJSON()
      .content!.filter((n) => n.type === 'orderedList')
    expect(lists).toHaveLength(1)
    expect(lists[0].content).toHaveLength(3)
  })

  it('carries a non-default start across a split', () => {
    const editor = editorWith(
      '<ol start="5"><li><p>a</p></li><li><p>b</p></li><li><p>c</p></li></ol>',
    )
    let bPos = -1
    editor.state.doc.descendants((node, pos) => {
      if (node.isText && node.text === 'b') bPos = pos
    })
    editor.commands.setTextSelection(bPos + 1)
    editor.commands.deleteRange({ from: bPos, to: bPos + 1 })
    editor.commands.liftListItem('listItem')
    // Remove the paragraph the lifted item left behind.
    const pos = emptyParagraphPos(editor)
    editor.commands.deleteRange({ from: pos - 1, to: pos + 1 })

    const lists = editor
      .getJSON()
      .content!.filter((n) => n.type === 'orderedList')
    expect(lists).toHaveLength(1)
    expect(lists[0].attrs!.start).toBe(5)
    expect(lists[0].content).toHaveLength(2)
  })

  it('merges nested lists split inside a list item', () => {
    const editor = editorWith(
      '<ul><li><p>parent</p><ol><li><p>a</p></li></ol><ol><li><p>b</p></li></ol></li></ul>',
    )
    // A no-op edit is enough to trigger the append transaction.
    editor.commands.insertContentAt(editor.state.doc.content.size - 1, ' ')

    let nested = 0
    editor.state.doc.descendants((node) => {
      if (node.type.name === 'orderedList') nested++
    })
    expect(nested).toBe(1)
  })
})
