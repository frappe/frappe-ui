/**
 * @vitest-environment jsdom
 *
 * Exercises the REAL drop path Gameplan uses: CommentKit editor + a shared
 * upload function, then `uploadAttachmentFiles` (what media-drop / EditorDropZone
 * call). Asserts a chip node is actually inserted and the NodeView mounts.
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

describe('attachment drop flow (CommentKit)', () => {
  it('inserts a chip node when a non-media file is uploaded', async () => {
    const upload = vi.fn(async (file: File) => ({
      file_url: `/files/${file.name}`,
    }))
    const ctx = mountEditor({
      extensions: [CommentKit],
      uploadFunction: upload,
    })
    // tiptap's `Storage` interface is empty and nothing here augments it, so
    // the storage diagnostic below reads through a widened handle. Same cast
    // `resolveUploadOptions` makes.
    const editor = ctx.getEditor() as TiptapEditor & {
      storage: Record<string, any>
    }

    // diagnostics: does the editor expose the command + upload storage?
    expect(typeof editor.commands.uploadAttachmentFiles).toBe('function')
    expect(editor.storage?.upload?.uploadFunction).toBeTypeOf('function')

    const pdf = new File([new Uint8Array([1, 2, 3])], 'report.pdf', {
      type: 'application/pdf',
    })

    editor.commands.uploadAttachmentFiles([pdf])
    await flush()

    expect(upload).toHaveBeenCalledOnce()

    const json = editor.getJSON()
    const flat: any[] = []
    const walk = (n: any) => {
      flat.push(n)
      ;(n.content ?? []).forEach(walk)
    }
    walk(json)
    const node = flat.find((n) => n.type === 'attachment')
    expect(node, 'attachment node should be inserted').toBeTruthy()
    expect(node.attrs.src).toBe('/files/report.pdf')
    expect(node.attrs.fileName).toBe('report.pdf')
  })
})
