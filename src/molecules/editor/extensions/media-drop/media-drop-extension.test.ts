/**
 * @vitest-environment jsdom
 *
 * ProseMirror runs `props.handleDOMEvents` before its own editable check
 * (`runCustomHandler` in prosemirror-view's input.ts), so the drop handler fires
 * on a read-only editor too. Unguarded, dropping an image on a post you can only
 * read uploads the file and inserts it into the document you are reading.
 */
import { describe, it, expect, vi, afterEach } from 'vitest'
import { CommentKit } from '../../kits'
import { flush, mount } from '../../test-helpers'
import type { Editor as TiptapEditor } from '../../useEditor'

type Teardown = () => void
const teardowns: Teardown[] = []

/** Mounts through the shared helper and records how to take it back down. */
function mountEditor(props: Parameters<typeof mount>[0]) {
  const ctx = mount(props)
  teardowns.push(() => ctx.app.unmount())
  return ctx
}

afterEach(() => {
  // Cleanup lives here, not at the end of a test body: a failed assertion
  // skips the rest of the test and would leak a mounted editor into the next.
  while (teardowns.length) teardowns.pop()!()
})

const image = () =>
  new File([new Uint8Array([1, 2, 3])], 'shot.png', { type: 'image/png' })

// Attachments, not images, carry the "did it upload?" assertions: `uploadImage`
// probes the file's dimensions first, which jsdom cannot decode, so an image
// never reaches `uploadFunction` here either way.
const pdf = () =>
  new File([new Uint8Array([1, 2, 3])], 'report.pdf', {
    type: 'application/pdf',
  })

// One spy per test, so call counts stay isolated.
const uploadSpy = () =>
  vi.fn(async (file: File) => ({ file_url: `/files/${file.name}` }))

/** jsdom has no DataTransfer, and `collectFiles` only reads `items`. */
function drop(editor: TiptapEditor, file: File) {
  const event: any = new Event('drop', { bubbles: true, cancelable: true })
  event.dataTransfer = { items: [{ kind: 'file', getAsFile: () => file }] }
  event.clientX = 0
  event.clientY = 0
  editor.view.dom.dispatchEvent(event)
  return event
}

function nodeCount(editor: TiptapEditor, typeName: string): number {
  let count = 0
  editor.state.doc.descendants((node) => {
    if (node.type.name === typeName) count++
  })
  return count
}

describe('MediaDrop on a read-only editor', () => {
  it('does not upload or insert a dropped file', async () => {
    const upload = uploadSpy()
    const ctx = mountEditor({
      extensions: [CommentKit],
      uploadFunction: upload,
      editable: false,
    })
    const editor = ctx.getEditor()
    expect(editor.isEditable).toBe(false)

    drop(editor, pdf())
    await flush()

    expect(upload).not.toHaveBeenCalled()
    expect(nodeCount(editor, 'attachment')).toBe(0)
  })

  it('claims the drop so the browser does not navigate to the file', async () => {
    const upload = uploadSpy()
    const ctx = mountEditor({
      extensions: [CommentKit],
      uploadFunction: upload,
      editable: false,
    })

    const event = drop(ctx.getEditor(), image())
    await flush()

    expect(event.defaultPrevented).toBe(true)
  })

  it('rejects dropFiles called directly, whatever the entry point', async () => {
    const upload = uploadSpy()
    const ctx = mountEditor({
      extensions: [CommentKit],
      uploadFunction: upload,
      editable: false,
    })
    const editor = ctx.getEditor()

    expect(editor.commands.dropFiles([pdf()])).toBe(false)
    await flush()

    expect(upload).not.toHaveBeenCalled()
    expect(nodeCount(editor, 'attachment')).toBe(0)
  })
})

describe('MediaDrop on an editable editor', () => {
  it('still uploads and inserts a dropped file', async () => {
    const upload = uploadSpy()
    const ctx = mountEditor({
      extensions: [CommentKit],
      uploadFunction: upload,
    })
    const editor = ctx.getEditor()
    expect(editor.isEditable).toBe(true)

    drop(editor, pdf())
    await flush()

    expect(upload).toHaveBeenCalledOnce()
    expect(nodeCount(editor, 'attachment')).toBe(1)
  })
})
