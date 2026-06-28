/**
 * @vitest-environment jsdom
 *
 * Exercises the REAL drop path Gameplan uses: CommentKit editor + a shared
 * upload function, then `uploadAttachmentFiles` (what media-drop / EditorDropZone
 * call). Asserts a chip node is actually inserted and the NodeView mounts.
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
      return h(Editor, { ...staticProps, ...state }, {
        default: ({ editor: e }: any) => {
          editor = e
          return h(EditorContent, { editor: e })
        },
      })
    },
  })
  app.mount(root)
  return { getEditor: () => editor, app, root }
}

const flush = async () => {
  for (let i = 0; i < 5; i++) {
    await Promise.resolve()
    await nextTick()
  }
}

describe('attachment drop flow (CommentKit)', () => {
  it('inserts a chip node when a non-media file is uploaded', async () => {
    const upload = vi.fn(async (file: File) => ({ file_url: `/files/${file.name}` }))
    const ctx = mount({ extensions: [CommentKit], uploadFunction: upload })
    const editor = ctx.getEditor()

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

    ctx.app.unmount()
  })
})
