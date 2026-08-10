/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi } from 'vitest'
import { Editor, Extension } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { OrderedList } from '@tiptap/extension-list'
import { ref, nextTick, createApp, defineComponent } from 'vue'
import { RichTextKit } from '../../kits'
import { StarterKit } from '../../extensions'
import { useEditor } from '../../useEditor'
import { ListJoin } from './list-join'

const listItemJSON = (text: string) => ({
  type: 'listItem',
  content: [{ type: 'paragraph', content: [{ type: 'text', text }] }],
})

/** Mount `useEditor` the way a consumer does, without rendering EditorContent. */
function mountUseEditor(
  content: ReturnType<typeof ref<string>>,
  options: Record<string, unknown> = {},
) {
  let editor: ReturnType<typeof useEditor> | null = null
  createApp(
    defineComponent({
      setup() {
        editor = useEditor({ content, extensions: [StarterKit], ...options })
        return () => null
      },
    }),
  ).mount(document.createElement('div'))
  return editor!
}

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

  it('repairs a document that arrives already split', () => {
    // Initial content is parsed without a transaction, so only the view-init
    // pass can fix a document saved back when the bug was live.
    const editor = editorWith(
      '<ol><li><p>a</p></li></ol><ol><li><p>b</p></li></ol>',
    )
    const lists = editor
      .getJSON()
      .content!.filter((n) => n.type === 'orderedList')
    expect(lists).toHaveLength(1)
    expect(lists[0].content).toHaveLength(2)
  })

  it('does not mark a document dirty when repairing it on load', () => {
    const onUpdate = vi.fn()
    new Editor({
      extensions: [StarterKit],
      content: '<ol><li><p>a</p></li></ol><ol><li><p>b</p></li></ol>',
      onUpdate,
    })
    expect(onUpdate).not.toHaveBeenCalled()
  })

  it('repairs an unmounted editor through the command', () => {
    // `useEditor` builds with `element: null`, so there is no view — and until
    // it mounts, no ProseMirror plugins either. The command is the only path.
    const editor = new Editor({
      extensions: [StarterKit],
      element: null,
      content: '<ol><li><p>a</p></li></ol><ol><li><p>b</p></li></ol>',
    })
    expect(editor.state.plugins).toHaveLength(0)

    editor.commands.joinAdjacentLists()

    const lists = editor
      .getJSON()
      .content!.filter((n) => n.type === 'orderedList')
    expect(lists).toHaveLength(1)
    expect(lists[0].content).toHaveLength(2)
  })

  it('reports nothing to do when the document has no split list', () => {
    const editor = new Editor({
      extensions: [StarterKit],
      element: null,
      content: '<ol><li><p>a</p></li></ol>',
    })
    expect(editor.commands.joinAdjacentLists()).toBe(false)
  })

  it('repairs content handed to useEditor at construction, still unmounted', () => {
    // What the comment in useEditor promises: a headless caller reading back
    // before <EditorContent> mounts gets the repaired document.
    const editor = mountUseEditor(
      ref('<ol><li><p>a</p></li></ol><ol><li><p>b</p></li></ol>'),
    )
    expect(editor.value!.state.plugins).toHaveLength(0)
    expect(editor.value!.getHTML()).toBe(
      '<ol><li><p>a</p></li><li><p>b</p></li></ol>',
    )
  })

  it('fires no transaction when useEditor has nothing to join', () => {
    const onTransaction = vi.fn()
    // A chain dispatches even when its command returns false, so useEditor
    // probes with can() first — otherwise every editor built, and every
    // external content write, would push an empty transaction at consumers.
    mountUseEditor(ref('<ol><li><p>a</p></li></ol>'), { onTransaction })
    expect(onTransaction).not.toHaveBeenCalled()
  })

  it('leaves a remote collaboration change to the peer that made it', () => {
    // Stand-in for y-prosemirror's plugin: the real one is pulled in by a
    // consumer's Collaboration extension, so it cannot be imported here.
    const ySyncKey = new PluginKey('y-sync')
    const YSync = Extension.create({
      name: 'ySyncStandIn',
      addProseMirrorPlugins: () => [new Plugin({ key: ySyncKey })],
    })
    const editor = new Editor({
      extensions: [StarterKit.configure({ listJoin: false }), ListJoin, YSync],
      content: '<p>x</p>',
    })

    // Apply a split-list document the way a remote peer's update arrives.
    const remote = editor.state.tr
    remote.replaceWith(
      0,
      editor.state.doc.content.size,
      editor.schema.nodeFromJSON({
        type: 'doc',
        content: [
          { type: 'orderedList', content: [listItemJSON('a')] },
          { type: 'orderedList', content: [listItemJSON('b')] },
        ],
      }).content,
    )
    editor.view.dispatch(remote.setMeta(ySyncKey, { isChangeOrigin: true }))

    // Untouched: that peer's own join replicates on its own.
    expect(
      editor.getJSON().content!.filter((n) => n.type === 'orderedList'),
    ).toHaveLength(2)

    // A local edit still joins.
    editor.commands.insertContentAt(editor.state.doc.content.size - 1, 'z')
    expect(
      editor.getJSON().content!.filter((n) => n.type === 'orderedList'),
    ).toHaveLength(1)
  })

  it('can be turned off through the kit', () => {
    const editor = new Editor({
      extensions: [StarterKit.configure({ listJoin: false })],
      element: null,
      content: '<ol><li><p>a</p></li></ol><ol><li><p>b</p></li></ol>',
    })
    expect(
      editor.getJSON().content!.filter((n) => n.type === 'orderedList'),
    ).toHaveLength(2)
  })

  it('repairs content written through the useEditor ref, still unmounted', async () => {
    const split = '<ol><li><p>a</p></li></ol><ol><li><p>b</p></li></ol>'
    const content = ref('<p>start</p>')
    const editor = mountUseEditor(content)
    expect(editor.value!.state.plugins).toHaveLength(0)

    content.value = split
    await nextTick()

    const lists = editor
      .value!.getJSON()
      .content!.filter((n) => n.type === 'orderedList')
    expect(lists).toHaveLength(1)
    expect(lists[0].content).toHaveLength(2)
  })

  it('leaves the document alone when the command is only probed', () => {
    const editor = new Editor({
      extensions: [StarterKit],
      element: null,
      content: '<ol><li><p>a</p></li></ol><ol><li><p>b</p></li></ol>',
    })
    expect(editor.can().joinAdjacentLists()).toBe(true)
    // A probe shares its transaction with the rest of a can().chain(), so it
    // must not join: later commands would be tested against the merged doc.
    expect(
      editor.getJSON().content!.filter((n) => n.type === 'orderedList'),
    ).toHaveLength(2)
  })

  it('sets no metadata of its own, so it composes in a chain', () => {
    const editor = editorWith(
      '<p>keep</p><ol><li><p>a</p></li></ol><p>gone</p><ol><li><p>b</p></li></ol>',
    )
    // Settle TrailingNode first: it appends its paragraph on the first
    // transaction, and undo does not take that back out.
    editor.view.dispatch(editor.state.tr)
    const before = editor.getJSON()
    const onUpdate = vi.fn()
    editor.on('update', onUpdate)

    // Delete the paragraph between the lists and join, in one chain.
    let from = -1
    editor.state.doc.descendants((node, pos) => {
      if (node.isText && node.text === 'gone') from = pos
    })
    editor
      .chain()
      .deleteRange({ from: from - 1, to: from + 5 })
      .joinAdjacentLists()
      .run()

    // The chain is the user's edit: it reports an update and takes one undo.
    expect(onUpdate).toHaveBeenCalledTimes(1)
    editor.commands.undo()
    expect(editor.getJSON()).toEqual(before)
  })

  it('merges list nodes whose attributes are deep-equal objects', () => {
    const ListWithObjectAttr = OrderedList.extend({
      addAttributes() {
        return {
          ...this.parent?.(),
          meta: {
            default: null,
            parseHTML: (element: HTMLElement) => {
              const raw = element.getAttribute('data-meta')
              return raw ? JSON.parse(raw) : null
            },
            renderHTML: (attributes: { meta?: unknown }) =>
              attributes.meta
                ? { 'data-meta': JSON.stringify(attributes.meta) }
                : {},
          },
        }
      },
    })
    const list = '<ol data-meta=\'{"a":1}\'><li><p>x</p></li></ol>'
    const editor = new Editor({
      extensions: [
        StarterKit.configure({ orderedList: false }),
        ListWithObjectAttr,
      ],
      element: null,
      content: list + list,
    })
    editor.commands.joinAdjacentLists()

    const lists = editor
      .getJSON()
      .content!.filter((n) => n.type === 'orderedList')
    expect(lists).toHaveLength(1)
    expect(lists[0].attrs!.meta).toEqual({ a: 1 })
  })

  it('finds list nodes by their schema group, not by name', () => {
    const editor = editorWith('<p>x</p>')
    const groupOf = (name: string) =>
      String(editor.schema.nodes[name].spec.group ?? '').split(' ')
    expect(groupOf('orderedList')).toContain('list')
    expect(groupOf('bulletList')).toContain('list')
    expect(groupOf('paragraph')).not.toContain('list')
  })

  it('merges adjacent task lists, which only RichTextKit enables', () => {
    const taskList = (text: string) =>
      `<ul data-type="taskList"><li data-type="taskItem" data-checked="false"><p>${text}</p></li></ul>`
    const editor = new Editor({
      extensions: [RichTextKit],
      content: taskList('a') + taskList('b'),
    })
    const lists = editor.getJSON().content!.filter((n) => n.type === 'taskList')
    expect(lists).toHaveLength(1)
    expect(lists[0].content).toHaveLength(2)
  })

  it('reverts the join and the edit together on a single undo', () => {
    const editor = editorWith(
      '<ol><li><p>a</p></li></ol><p></p><ol><li><p>b</p></li></ol>',
    )
    const pos = emptyParagraphPos(editor)
    editor.commands.deleteRange({ from: pos - 1, to: pos + 1 })
    expect(
      editor.getJSON().content!.filter((n) => n.type === 'orderedList'),
    ).toHaveLength(1)

    // One undo, not two: the join rides on the user's own history entry.
    editor.commands.undo()
    const lists = editor
      .getJSON()
      .content!.filter((n) => n.type === 'orderedList')
    expect(lists).toHaveLength(2)
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
