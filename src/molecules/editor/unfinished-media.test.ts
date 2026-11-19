/**
 * @vitest-environment jsdom
 */
import { afterEach, describe, expect, it } from 'vitest'
import { createApp, h, ref } from 'vue'
import type { JSONContent } from '@tiptap/core'
import Editor from './Editor.vue'
import EditorContent from './EditorContent.vue'
import { Image, StarterKit, Video } from './extensions'
import { cleanupMounted, flush, registerCleanup } from './test-helpers'
import type { Editor as TiptapEditor } from './useEditor'

afterEach(cleanupMounted)

/** A v-model editor, as an app binds it to a draft. */
function mountControlled(initial = '') {
  const content = ref<string | JSONContent | null | undefined>(initial)
  let editor: TiptapEditor | null = null
  const root = document.createElement('div')
  document.body.appendChild(root)
  const app = createApp({
    render: () =>
      h(
        Editor,
        {
          extensions: [StarterKit, Image, Video],
          modelValue: content.value,
          'onUpdate:modelValue': (value: typeof content.value) =>
            (content.value = value),
        },
        {
          default: ({ editor: e }: { editor: TiptapEditor | null }) => {
            editor = e
            return h(EditorContent, { editor: e })
          },
        },
      ),
  })
  app.mount(root)
  registerCleanup(() => {
    app.unmount()
    root.remove()
  })
  return { content, getEditor: () => editor! }
}

function mediaNodes(editor: TiptapEditor) {
  const nodes: string[] = []
  editor.state.doc.descendants((node) => {
    if (node.type.name === 'image' || node.type.name === 'video') {
      nodes.push(node.type.name)
    }
  })
  return nodes
}

describe('unfinished media uploads', () => {
  it('stay in the editor but out of the saved HTML', async () => {
    const { content, getEditor } = mountControlled('<p>Intro</p>')
    await flush()

    getEditor()
      .chain()
      .focus('end')
      .insertContent([
        { type: 'video', attrs: { uploadId: 'v1', loading: true } },
        {
          type: 'paragraph',
          content: [
            {
              type: 'image',
              attrs: { uploadId: 'i1', error: 'Upload failed' },
            },
          ],
        },
      ])
      .run()
    await flush()

    expect(String(content.value)).not.toMatch(/<video|<img/)
    // The v-model round trip must not reset the editor and lose the upload.
    expect(mediaNodes(getEditor())).toEqual(['video', 'image'])
  })

  it('do not load back from HTML saved before this fix', async () => {
    const { content, getEditor } = mountControlled()
    await flush()

    content.value =
      '<p>Intro</p><video controls="" data-align="center"></video><p><img data-align="left"></p>'
    await flush()

    expect(mediaNodes(getEditor())).toEqual([])
    expect(getEditor().getHTML()).toBe('<p>Intro</p><p></p>')
  })

  it('leave uploaded media unchanged', async () => {
    const saved =
      '<video src="/files/demo.mp4" data-align="center" controls=""></video><p><img src="/files/a.png" data-align="left"></p>'
    const { getEditor } = mountControlled(saved)
    await flush()

    expect(mediaNodes(getEditor())).toEqual(['video', 'image'])
    expect(getEditor().getHTML()).toContain('src="/files/demo.mp4"')
    expect(getEditor().getHTML()).toContain('src="/files/a.png"')
  })
})
