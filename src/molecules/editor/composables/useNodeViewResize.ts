/**
 * Aspect-ratio-locked resize-drag for media / embed node views.
 *
 * Behavior preserved from `MediaNodeView.vue` + `IframeNodeView.vue`:
 * - `startResize` (on the handle's `pointerdown`) records the start X and the
 *   element's current `offsetWidth`, locks the aspect ratio, and registers
 *   `mousemove` / `mouseup` listeners on `window` plus an `ew-resize` body cursor.
 * - `mousemove` applies temporary inline `width`/`height` to the element for
 *   live visual feedback, clamping width between `minWidth` and the editor's
 *   content width (minus `maxWidthPadding`).
 * - `mouseup` reads the final rendered size, clears the temporary inline styles,
 *   and commits via `onCommit` — guarded by `safeGetPos` so a stale node view
 *   never writes back into the document.
 *
 * Window listeners are removed on stop AND on `onUnmounted`, fixing the leak
 * where a drag interrupted by unmount left handlers attached to `window`.
 */
import { ref, onUnmounted, type Ref } from 'vue'
import type { Editor } from '@tiptap/core'
import { safeGetPos } from '#molecules/editor/extensions/shared/node-view'

export interface ResizeArgs {
  /** The element being resized (image / video / iframe). May be null pre-mount. */
  mediaEl: () => HTMLElement | null
  /**
   * The wrapping element that carries the committed pixel width and clips
   * with `overflow-hidden`. Sized in lockstep with `mediaEl` during the drag so
   * growing the media past the committed width isn't clipped until mouseup.
   * Optional — omit when there is no clipping wrapper.
   */
  containerEl?: () => HTMLElement | null
  /** Aspect ratio expressed as height / width; multiplied by the new width. */
  getAspectRatio: () => number
  /** TipTap v3 node-view `getPos`; the commit is skipped when it is invalid. */
  getPos: () => number | undefined
  /** Persist the committed size (e.g. via `updateAttributes`). */
  onCommit: (size: { width: number; height: number }) => void
  /** Minimum width in px. Default 50 (matches the image node view). */
  minWidth?: number
  /** Reserved px subtracted from the editor width as the max. Default 0. */
  maxWidthPadding?: number
}

export function useNodeViewResize(
  editor: Editor,
  args: ResizeArgs,
): {
  isResizing: Ref<boolean>
  startResize: (event: PointerEvent | MouseEvent) => void
} {
  const isResizing = ref(false)
  const minWidth = args.minWidth ?? 50
  const maxWidthPadding = args.maxWidthPadding ?? 0

  let startDragX = 0
  let startWidth = 0
  let aspectRatio = 1

  function startResize(event: PointerEvent | MouseEvent): void {
    if (!editor.isEditable) return
    const el = args.mediaEl()
    if (!el) return

    isResizing.value = true
    startDragX = event.clientX
    startWidth = el.offsetWidth
    aspectRatio = args.getAspectRatio() || 1

    window.addEventListener('pointermove', handleResize)
    window.addEventListener('pointerup', stopResize)
    window.addEventListener('pointercancel', stopResize)
    document.body.style.cursor = 'ew-resize'
  }

  function handleResize(event: PointerEvent): void {
    if (!isResizing.value) return
    const el = args.mediaEl()
    if (!el) return

    const editorWidth = editor.view.dom.clientWidth
    const deltaX = event.clientX - startDragX
    const newWidth = Math.max(
      minWidth,
      Math.min(startWidth + deltaX, editorWidth - maxWidthPadding),
    )
    const newHeight = newWidth * aspectRatio

    el.style.width = `${newWidth}px`
    el.style.height = `${newHeight}px`

    // Grow the clipping wrapper in lockstep so the live drag isn't clipped.
    const container = args.containerEl?.()
    if (container) container.style.width = `${newWidth}px`
  }

  function stopResize(): void {
    if (!isResizing.value) return
    isResizing.value = false
    removeWindowListeners()
    document.body.style.cursor = ''

    const el = args.mediaEl()
    if (!el) return

    // Capture final dimensions while the temporary inline styles still apply.
    const width = el.offsetWidth
    const height = el.offsetHeight

    const clearInlineStyles = () => {
      el.style.width = ''
      el.style.height = ''
      const container = args.containerEl?.()
      if (container) container.style.width = ''
    }

    if (safeGetPos(args.getPos) === null) {
      clearInlineStyles()
      return
    }
    onCommitGuarded(width, height)
    // Keep the inline drag styles through the commit re-render. Clearing them
    // synchronously made the node render at its OLD committed size for one
    // frame (the attr update lands a microtask later) — a visible page jump
    // proportional to the media's height. After the next frame the committed
    // attrs render the same size the inline styles held, so clearing is a no-op
    // visually.
    requestAnimationFrame(clearInlineStyles)
  }

  function onCommitGuarded(width: number, height: number): void {
    args.onCommit({ width, height })
  }

  function removeWindowListeners(): void {
    window.removeEventListener('pointermove', handleResize)
    window.removeEventListener('pointerup', stopResize)
    window.removeEventListener('pointercancel', stopResize)
  }

  onUnmounted(() => {
    removeWindowListeners()
    if (isResizing.value) document.body.style.cursor = ''
  })

  return { isResizing, startResize }
}
