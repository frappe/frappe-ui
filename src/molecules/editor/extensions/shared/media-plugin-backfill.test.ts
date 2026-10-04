/**
 * @vitest-environment jsdom
 */

import { afterEach, describe, it, expect, vi } from 'vitest'
import { Editor, Extension, Node } from '@tiptap/core'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import { UndoRedo } from '@tiptap/extensions'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { createMediaPlugin } from '#molecules/editor/extensions/shared/media-plugin'

const probeDimensions = vi.fn(async () => ({ width: 100, height: 50 }))

const Image = Node.create({
  name: 'image',
  group: 'block',
  atom: true,
  addAttributes: () => ({
    src: { default: null },
    width: { default: null },
    height: { default: null },
    loading: { default: false },
  }),
  parseHTML: () => [{ tag: 'img' }],
  renderHTML: ({ HTMLAttributes }) => ['img', HTMLAttributes],
  addProseMirrorPlugins() {
    const host = { editor: this.editor, options: {} }
    return [
      createMediaPlugin(
        {} as never,
        {
          nodeName: 'image',
          accept: /image/i,
          storeBase64: true,
          probeDimensions,
        },
        host,
      ),
    ]
  },
})

// y-prosemirror's plugin key, which frappe-ui cannot import
const ySyncKey = new PluginKey('y-sync')
const YSync = Extension.create({
  name: 'ySyncStandIn',
  addProseMirrorPlugins: () => [new Plugin({ key: ySyncKey })],
})

const editors: Editor[] = []
afterEach(() => {
  editors.splice(0).forEach((editor) => editor.destroy())
  probeDimensions.mockClear()
})

function makeEditor(content: string) {
  const editor = new Editor({
    extensions: [
      Document,
      Paragraph,
      Text,
      Image,
      YSync,
      UndoRedo.configure({ newGroupDelay: 0 }),
    ],
    content,
  })
  editors.push(editor)
  return editor
}

const settle = () => new Promise((resolve) => setTimeout(resolve, 0))

const sizes = (editor: Editor) => {
  const found: [unknown, unknown][] = []
  editor.state.doc.descendants((node) => {
    if (node.type.name === 'image')
      found.push([node.attrs.width, node.attrs.height])
  })
  return found
}

describe('media dimension back-fill', () => {
  it('sizes an image the person inserts', async () => {
    const editor = makeEditor('<p>x</p>')
    editor.commands.insertContentAt(0, {
      type: 'image',
      attrs: { src: '/files/new.png' },
    })
    await settle()

    expect(sizes(editor)).toEqual([[100, 50]])
  })

  it('leaves an image that arrives from a collaborator as it came', async () => {
    const editor = makeEditor('<p>x</p>')
    const remote = editor.state.tr.insert(
      0,
      editor.schema.nodes.image.create({ src: '/files/theirs.png' }),
    )
    editor.view.dispatch(remote.setMeta(ySyncKey, { isChangeOrigin: true }))
    await settle()

    expect(sizes(editor)).toEqual([[null, null]])
    expect(probeDimensions).not.toHaveBeenCalled()
  })

  it('leaves an image loaded without an update event as it came', async () => {
    const editor = makeEditor('<p>x</p>')
    editor.commands.setContent('<img src="/files/loaded.png">', {
      emitUpdate: false,
    })
    await settle()

    expect(sizes(editor)).toEqual([[null, null]])
    expect(probeDimensions).not.toHaveBeenCalled()
  })

  it('sizes an image set with an update event', async () => {
    const editor = makeEditor('<p>x</p>')
    editor.commands.setContent('<img src="/files/set.png">', {
      emitUpdate: true,
    })
    await settle()

    expect(sizes(editor)).toEqual([[100, 50]])
  })

  it('does not size an image whose source changed while it was measured', async () => {
    let measured = (_dims: { width: number; height: number }) => {}
    probeDimensions.mockImplementationOnce(
      () => new Promise((resolve) => (measured = resolve)),
    )
    const editor = makeEditor('<p>x</p>')
    editor.commands.insertContentAt(0, {
      type: 'image',
      attrs: { src: '/files/old.png' },
    })
    editor.view.dispatch(
      editor.state.tr
        .setNodeAttribute(0, 'src', '/files/new.png')
        .setMeta(ySyncKey, { isChangeOrigin: true }),
    )
    measured({ width: 100, height: 50 })
    await settle()

    expect(probeDimensions).toHaveBeenCalledWith('/files/old.png')
    expect(sizes(editor)).toEqual([[null, null]])
  })

  it('lets the person undo an edit after other media was left unsized', async () => {
    const editor = makeEditor('<img src="/files/old.png"><p>x</p>')
    editor.commands.insertContentAt(editor.state.doc.content.size - 1, 'y')
    await settle()
    editor.commands.undo()
    await settle()

    expect(editor.state.doc.textContent).toBe('x')
    expect(sizes(editor)).toEqual([[null, null]])
  })

  it('leaves an unsized image as it was when undo brings it back', async () => {
    const editor = makeEditor('<img src="/files/old.png"><p>x</p>')
    editor.commands.deleteRange({ from: 0, to: 1 })
    editor.commands.undo()
    await settle()

    expect(sizes(editor)).toEqual([[null, null]])
    expect(probeDimensions).not.toHaveBeenCalled()
  })
})
