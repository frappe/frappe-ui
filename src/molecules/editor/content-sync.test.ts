/**
 * @vitest-environment jsdom
 */
import { afterEach, describe, expect, it } from 'vitest'
import { createApp, h, ref } from 'vue'
import type { JSONContent } from '@tiptap/core'
import Editor from './Editor.vue'
import EditorContent from './EditorContent.vue'
import { StarterKit } from './extensions'
import { cleanupMounted, flush, registerCleanup } from './test-helpers'
import type { Editor as TiptapEditor } from './useEditor'

afterEach(cleanupMounted)

/** Mounts a controlled editor whose `v-model` the test can write from outside. */
function mountControlled() {
  const content = ref<string | JSONContent | null | undefined>('')
  let editor: TiptapEditor | null = null
  const root = document.createElement('div')
  document.body.appendChild(root)
  const app = createApp({
    render: () =>
      h(
        Editor,
        {
          extensions: [StarterKit],
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

describe('external content sync', () => {
  it('is not undone by the first undo', async () => {
    const { content, getEditor } = mountControlled()
    await flush()

    // A saved draft that loads after the editor has mounted.
    content.value = '<p>Long draft</p>'
    await flush()
    getEditor().commands.undo()
    await flush()

    expect(getEditor().getHTML()).toBe('<p>Long draft</p>')
    expect(content.value).toBe('<p>Long draft</p>')
  })

  it('leaves edits made after the sync undoable', async () => {
    const { content, getEditor } = mountControlled()
    await flush()

    content.value = '<p>Long draft</p>'
    await flush()
    const editor = getEditor()
    editor.commands.insertContentAt(editor.state.doc.content.size - 1, '!')
    await flush()
    expect(content.value).toBe('<p>Long draft!</p>')

    editor.commands.undo()
    await flush()
    expect(editor.getHTML()).toBe('<p>Long draft</p>')
    expect(editor.can().undo()).toBe(false)
  })
})
