import { onBeforeUnmount, ref, watch, type Ref } from 'vue'
import { useWindowFileDragging } from './useWindowFileDragging'

/**
 * File drop tracking for a single editor drop zone.
 *
 * Exposes two signals so the zone can show a two-stage affordance:
 *  - `isWindowDragging` — a file is being dragged anywhere over the window; the
 *    zone reveals itself as a hint so the user can see where to drop.
 *  - `isOverZone` — the file is over THIS zone specifically; the zone emphasises
 *    itself as the active target.
 *
 * `onFiles` fires only for file drops that land inside `root` (the surrounding
 * editor chrome). Drops on the prose itself are handled by the media ProseMirror
 * plugin, which stop-propagates them — so our drop handler never runs for those,
 * and `isOverZone` is instead cleared by watching the window signal (which flips
 * false on any drop, captured before the inner `stopPropagation`).
 *
 * @param root  Ref to the zone element. May be null until mounted.
 * @param onFiles Called with dropped `File[]` for drops inside `root`.
 */
export function useEditorFileDrop(
  root: Ref<HTMLElement | null>,
  onFiles: (files: File[]) => void,
): { isWindowDragging: Ref<boolean>; isOverZone: Ref<boolean> } {
  const isWindowDragging = useWindowFileDragging()
  const isOverZone = ref(false)
  let depth = 0

  const hasFiles = (event: DragEvent): boolean =>
    !!event.dataTransfer && Array.from(event.dataTransfer.types).includes('Files')

  const reset = () => {
    depth = 0
    isOverZone.value = false
  }

  const onDragEnter = (event: DragEvent) => {
    if (!hasFiles(event)) return
    depth += 1
    isOverZone.value = true
  }

  const onDragOver = (event: DragEvent) => {
    if (!hasFiles(event)) return
    event.preventDefault()
  }

  const onDragLeave = () => {
    depth = Math.max(0, depth - 1)
    if (depth === 0) isOverZone.value = false
  }

  const onDrop = (event: DragEvent) => {
    reset()
    const files = Array.from(event.dataTransfer?.files ?? [])
    if (files.length === 0) return
    event.preventDefault()
    event.stopPropagation()
    onFiles(files)
  }

  // The window signal flips false on any drop (capture phase) or when the drag
  // leaves the window. Mirror that here so a prose drop — whose event never
  // reaches our handler — can't leave the zone stuck highlighted.
  watch(isWindowDragging, (dragging) => {
    if (!dragging) reset()
  })

  const bind = (el: HTMLElement) => {
    el.addEventListener('dragenter', onDragEnter)
    el.addEventListener('dragover', onDragOver)
    el.addEventListener('dragleave', onDragLeave)
    el.addEventListener('drop', onDrop)
  }

  const unbind = (el: HTMLElement) => {
    el.removeEventListener('dragenter', onDragEnter)
    el.removeEventListener('dragover', onDragOver)
    el.removeEventListener('dragleave', onDragLeave)
    el.removeEventListener('drop', onDrop)
  }

  watch(
    root,
    (el, prev) => {
      if (prev) unbind(prev)
      reset()
      if (el) bind(el)
    },
    { immediate: true },
  )

  onBeforeUnmount(() => {
    if (root.value) unbind(root.value)
  })

  return { isWindowDragging, isOverZone }
}
