import type { Editor } from '@tiptap/core'
import { onBeforeUnmount, onMounted, ref, type Ref } from 'vue'

/**
 * Reactive mirror of `editor.isEditable` for use inside node views.
 *
 * Subscribes to the editor's `update` and `transaction` events in `onMounted`
 * and detaches both listeners on unmount (`editor.off`). This replaces the
 * hand-rolled `editor.on('update', ...)` blocks scattered across the node views,
 * which never cleaned up their listeners and leaked across editor instances.
 *
 * @param editor The node view's TipTap editor (`props.editor`).
 * @returns A ref that tracks `editor.isEditable`.
 */
export function useNodeViewEditable(editor: Editor): Ref<boolean> {
  const isEditable = ref(editor.isEditable)

  const sync = () => {
    isEditable.value = editor.isEditable
  }

  onMounted(() => {
    // Re-read on mount in case editability changed between setup and mount.
    sync()
    editor.on('update', sync)
    editor.on('transaction', sync)
  })

  onBeforeUnmount(() => {
    editor.off('update', sync)
    editor.off('transaction', sync)
  })

  return isEditable
}
