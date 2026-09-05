/**
 * Shared mount helpers for the editor's jsdom tests.
 *
 * Not part of the public API: nothing re-exports it from `index.ts`, so it is
 * neither bundled nor documented. It stays extension-agnostic: each test
 * passes its own kit through `extensions`.
 */
import { createApp, h, nextTick, reactive } from 'vue'
import Editor from './Editor.vue'
import EditorContent from './EditorContent.vue'
import type { Editor as TiptapEditor } from './useEditor'

type EditorProps = InstanceType<typeof Editor>['$props']

/**
 * Mounts `Editor` with `EditorContent` in its default slot and hands back the
 * tiptap instance the slot receives. `modelValue` is reactive so the editor
 * behaves like a controlled one; everything else is passed through as static.
 */
export function mount(staticProps: EditorProps) {
  const state = reactive({ modelValue: '' })
  let editor: TiptapEditor | null = null
  const root = document.createElement('div')
  document.body.appendChild(root)
  const app = createApp({
    render() {
      return h(
        Editor,
        { ...staticProps, ...state },
        {
          default: ({ editor: e }: { editor: TiptapEditor | null }) => {
            editor = e
            return h(EditorContent, { editor: e })
          },
        },
      )
    },
  })
  app.mount(root)
  return { getEditor: () => editor!, app, root }
}

/** Drains the microtask queue and Vue's render queue a few times over. */
export const flush = async () => {
  for (let i = 0; i < 5; i++) {
    await Promise.resolve()
    await nextTick()
  }
}
