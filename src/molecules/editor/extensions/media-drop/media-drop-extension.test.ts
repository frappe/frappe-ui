/**
 * @vitest-environment jsdom
 *
 * ProseMirror runs `props.handleDOMEvents` before its own editable check
 * (`runCustomHandler` in prosemirror-view's input.ts), so the drop handler fires
 * on a read-only editor too. Unguarded, dropping an image on a post you can only
 * read uploads the file and inserts it into the document you are reading.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createApp, h, nextTick, reactive } from 'vue'

let Editor: any
let EditorContent: any
let CommentKit: any

beforeEach(async () => {
  ;({ default: Editor } = await import('../../Editor.vue'))
  ;({ default: EditorContent } = await import('../../EditorContent.vue'))
  ;({ CommentKit } = await import('../../kits'))
})

function mount(staticProps: Record<string, any>) {
  const state = reactive<Record<string, any>>({ modelValue: '' })
  let editor: any = null
  const root = document.createElement('div')
  document.body.appendChild(root)
  const app = createApp({
    render() {
      return h(
        Editor,
        { ...staticProps, ...state },
        {
          default: ({ editor: e }: any) => {
            editor = e
            return h(EditorContent, { editor: e })
          },
        },
      )
    },
  })
  app.mount(root)
  return { getEditor: () => editor, app }
}

const flush = async () => {
  for (let i = 0; i < 5; i++) {
    await Promise.resolve()
    await nextTick()
  }
}

const image = () =>
  new File([new Uint8Array([1, 2, 3])], 'shot.png', { type: 'image/png' })

// Attachments, not images, carry the "did it upload?" assertions: `uploadImage`
// probes the file's dimensions first, which jsdom cannot decode, so an image
// never reaches `uploadFunction` here either way.
const pdf = () =>
  new File([new Uint8Array([1, 2, 3])], 'report.pdf', {
    type: 'application/pdf',
  })

/** jsdom has no DataTransfer, and `collectFiles` only reads `items`. */
function drop(editor: any, file: File) {
  const event: any = new Event('drop', { bubbles: true, cancelable: true })
  event.dataTransfer = { items: [{ kind: 'file', getAsFile: () => file }] }
  event.clientX = 0
  event.clientY = 0
  editor.view.dom.dispatchEvent(event)
  return event
}

function nodeCount(editor: any, typeName: string): number {
  let count = 0
  editor.state.doc.descendants((node: any) => {
    if (node.type.name === typeName) count++
  })
  return count
}

describe('MediaDrop on a read-only editor', () => {
  it('does not upload or insert a dropped file', async () => {
    const upload = vi.fn(async (file: File) => ({
      file_url: `/files/${file.name}`,
    }))
    const ctx = mount({
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

    ctx.app.unmount()
  })

  it('claims the drop so the browser does not navigate to the file', async () => {
    const upload = vi.fn(async (file: File) => ({
      file_url: `/files/${file.name}`,
    }))
    const ctx = mount({
      extensions: [CommentKit],
      uploadFunction: upload,
      editable: false,
    })

    const event = drop(ctx.getEditor(), image())
    await flush()

    expect(event.defaultPrevented).toBe(true)

    ctx.app.unmount()
  })

  it('rejects dropFiles called directly, whatever the entry point', async () => {
    const upload = vi.fn(async (file: File) => ({
      file_url: `/files/${file.name}`,
    }))
    const ctx = mount({
      extensions: [CommentKit],
      uploadFunction: upload,
      editable: false,
    })
    const editor = ctx.getEditor()

    expect(editor.commands.dropFiles([pdf()])).toBe(false)
    await flush()

    expect(upload).not.toHaveBeenCalled()
    expect(nodeCount(editor, 'attachment')).toBe(0)

    ctx.app.unmount()
  })
})

describe('MediaDrop on an editable editor', () => {
  it('still uploads and inserts a dropped file', async () => {
    const upload = vi.fn(async (file: File) => ({
      file_url: `/files/${file.name}`,
    }))
    const ctx = mount({ extensions: [CommentKit], uploadFunction: upload })
    const editor = ctx.getEditor()
    expect(editor.isEditable).toBe(true)

    drop(editor, pdf())
    await flush()

    expect(upload).toHaveBeenCalledOnce()
    expect(nodeCount(editor, 'attachment')).toBe(1)

    ctx.app.unmount()
  })
})
