/**
 * Aspect-ratio-locked resize-drag for media / embed node views.
 *
 * The drag math follows the handle that started it (`MediaResizeHandle.vue`):
 * a corner grip reads BOTH axes — the pointer's travel projected onto the
 * aspect-locked diagonal, the width that puts the corner as close to the
 * cursor as the ratio lock allows — while an edge pill reads X alone and
 * inverts it for the left edge.
 *
 * - `startResize` (on the handle's `pointerdown`) records the start point and
 *   the element's current `offsetWidth`, locks the aspect ratio, and registers
 *   `mousemove` / `mouseup` listeners on `window` plus the matching body cursor.
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
  /**
   * Fallback aspect ratio (height / width) used only when the element has no
   * measurable rendered size at drag start. The drag normally locks the ratio
   * from the element's live `offsetHeight / offsetWidth` so the shape on screen
   * is preserved exactly — `getAspectRatio` can disagree with what's painted
   * when a node stores only one dimension (the other coming from CSS
   * `height: auto`), which used to distort the media mid-drag.
   */
  getAspectRatio: () => number
  /** TipTap v3 node-view `getPos`; the commit is skipped when it is invalid. */
  getPos: () => number | undefined
  /** Persist the committed size (e.g. via `updateAttributes`). */
  onCommit: (size: { width: number; height: number }) => void
  /**
   * How the node view renders the media element's COMMITTED size:
   * - 'attribute' (default): `width=`/`height=` attributes (img / video). The
   *   drag's inline styles are cleared after commit — they'd otherwise mask
   *   future attribute updates (keyboard resize, collab).
   * - 'style': a Vue `:style` binding (e.g. the iframe's frameStyle). The
   *   drag's inline styles are LEFT IN PLACE: they already equal the committed
   *   size, and clearing them would wipe the binding's write (Vue only
   *   re-writes a style property when its bound VALUE changes).
   */
  mediaSizing?: 'attribute' | 'style'
  /** Minimum width in px. Default 50 (matches the image node view). */
  minWidth?: number
  /** Reserved px subtracted from the editor width as the max. Default 0. */
  maxWidthPadding?: number
}

/** Which handle started the drag; each one has its own delta math. */
export type ResizeEdge = 'left' | 'right' | 'corner'

export function useNodeViewResize(
  editor: Editor,
  args: ResizeArgs,
): {
  isResizing: Ref<boolean>
  startResize: (event: PointerEvent | MouseEvent, edge?: ResizeEdge) => void
} {
  const isResizing = ref(false)
  const minWidth = args.minWidth ?? 50
  const maxWidthPadding = args.maxWidthPadding ?? 0

  let startDragX = 0
  let startDragY = 0
  let startWidth = 0
  let aspectRatio = 1
  let dragFrom: ResizeEdge = 'corner'

  function startResize(
    event: PointerEvent | MouseEvent,
    edge: ResizeEdge = 'corner',
  ): void {
    if (!editor.isEditable) return
    const el = args.mediaEl()
    if (!el) return

    isResizing.value = true
    startDragX = event.clientX
    startDragY = event.clientY
    startWidth = el.offsetWidth
    // Lock the ratio to the element's painted box so the drag preserves the
    // exact shape on screen. Falls back to the supplied aspect only when the
    // element isn't laid out yet (offsetWidth 0). Reading the rendered size
    // avoids the stored-attrs mismatch (e.g. a node with width but no height,
    // whose true height comes from CSS `height: auto`) that distorted media
    // mid-drag — it became "wide" while dragging, then snapped back on release.
    const renderedAspect = el.offsetWidth ? el.offsetHeight / el.offsetWidth : 0
    aspectRatio = renderedAspect || args.getAspectRatio() || 1
    dragFrom = edge

    window.addEventListener('pointermove', handleResize)
    window.addEventListener('pointerup', stopResize)
    window.addEventListener('pointercancel', stopResize)
    document.body.style.cursor = edge === 'corner' ? 'nwse-resize' : 'ew-resize'
  }

  function handleResize(event: PointerEvent): void {
    if (!isResizing.value) return
    const el = args.mediaEl()
    if (!el) return

    const editorWidth = editor.view.dom.clientWidth
    const deltaX = event.clientX - startDragX
    const deltaY = event.clientY - startDragY
    // A corner can only travel along the line (1, aspectRatio) — the ratio is
    // locked — so project the pointer's travel onto it instead of reading X
    // alone. Dragging straight down grows the media (an edge pill cannot), and
    // on a diagonal drag the corner lands as near the cursor as the lock
    // permits rather than racing ahead of it on one axis.
    //
    // The gain per axis is therefore the aspect ratio's, not 1:1, and on tall
    // media a purely horizontal drag is slow: measured on a 1:2 portrait,
    // 150px right grows the width 30px, where 150px down grows the height
    // 120px and a diagonal tracks the pointer outright. That is the cost of
    // keeping the grip under the cursor — boosting the horizontal gain would
    // send it sliding away from the pointer down the locked diagonal — and the
    // gestures a corner invites are the ones that pay well.
    //
    // An edge pill has no vertical gesture to read, and dragging the LEFT one
    // outward moves the pointer left (negative delta) while growing the node,
    // so its delta is inverted.
    const deltaWidth =
      dragFrom === 'corner'
        ? (deltaX + deltaY * aspectRatio) / (1 + aspectRatio * aspectRatio)
        : deltaX * (dragFrom === 'left' ? -1 : 1)
    const newWidth = Math.max(
      minWidth,
      Math.min(startWidth + deltaWidth, editorWidth - maxWidthPadding),
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

    if (safeGetPos(args.getPos) === null) {
      // No commit happened — drop the drag styles so the (possibly stale)
      // view falls back to its bound size.
      el.style.width = ''
      el.style.height = ''
      const container = args.containerEl?.()
      if (container) container.style.width = ''
      return
    }
    onCommitGuarded(width, height)
    // Container width and a 'style'-sized media element are owned by Vue
    // `:style` bindings on the SAME properties the drag wrote. Their inline
    // values already equal the committed size, so leave them in place — the
    // next binding VALUE change overwrites them. Clearing them here used to
    // race the commit re-render: Vue wrote the committed width first, the
    // deferred clear wiped it, and Vue never re-writes an unchanged value —
    // leaving the block container at full editor width until some later
    // value-changing render (the "huge ring around a small image" bug).
    //
    // Only an 'attribute'-sized media element (img/video, width=/height=)
    // needs its inline styles cleared, or they'd mask future attribute
    // updates. rAF defers that past the commit re-render so the old attribute
    // size never paints (clearing synchronously flashed a page jump).
    if ((args.mediaSizing ?? 'attribute') === 'attribute') {
      requestAnimationFrame(() => {
        el.style.width = ''
        el.style.height = ''
      })
    }
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
