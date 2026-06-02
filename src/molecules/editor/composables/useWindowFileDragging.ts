import { onBeforeUnmount, onMounted, ref, type Ref } from 'vue'

/**
 * Shared, reference-counted signal that is `true` while the user is dragging
 * file(s) anywhere over the window.
 *
 * Editor drop zones use it to reveal themselves the moment a file enters the
 * page — not only once it is over the editor — so the drop targets are
 * discoverable instead of invisible until hovered.
 *
 * Listeners are bound in the CAPTURE phase so the `drop`/`dragend` resets still
 * fire when an inner handler (the media ProseMirror plugin, a scoped drop zone)
 * calls `stopPropagation()` on the bubbling event. A single set of listeners is
 * shared across all callers via the ref count.
 *
 * Detection only — it never calls `preventDefault`, so it does not turn the
 * window into a drop target or otherwise change drop handling.
 */
const isWindowFileDragging = ref(false)
let refCount = 0
// Depth counter: dragenter on a child fires before dragleave on its parent, so
// the count stays > 0 while the pointer is anywhere inside the window and only
// hits 0 when the drag truly leaves it.
let depth = 0

const hasFiles = (event: DragEvent): boolean =>
  !!event.dataTransfer && Array.from(event.dataTransfer.types).includes('Files')

const reset = () => {
  depth = 0
  isWindowFileDragging.value = false
}

const onDragEnter = (event: DragEvent) => {
  if (!hasFiles(event)) return
  depth += 1
  isWindowFileDragging.value = true
}

const onDragLeave = () => {
  depth = Math.max(0, depth - 1)
  if (depth === 0) isWindowFileDragging.value = false
}

export function useWindowFileDragging(): Ref<boolean> {
  onMounted(() => {
    if (refCount === 0) {
      window.addEventListener('dragenter', onDragEnter, true)
      window.addEventListener('dragleave', onDragLeave, true)
      window.addEventListener('drop', reset, true)
      window.addEventListener('dragend', reset, true)
    }
    refCount += 1
  })

  onBeforeUnmount(() => {
    refCount = Math.max(0, refCount - 1)
    if (refCount === 0) {
      window.removeEventListener('dragenter', onDragEnter, true)
      window.removeEventListener('dragleave', onDragLeave, true)
      window.removeEventListener('drop', reset, true)
      window.removeEventListener('dragend', reset, true)
      reset()
    }
  })

  return isWindowFileDragging
}
