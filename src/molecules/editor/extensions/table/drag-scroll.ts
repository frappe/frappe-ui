/**
 * Shared scaffolding for pointer drags over tables (cell drag-select, grip
 * drags): pointer capture so a release outside the window still ends the drag,
 * and edge auto-scroll so dragging past the visible boundary keeps selecting —
 * horizontally inside the `.tableWrapper` (overflow-x: auto) and vertically in
 * the nearest scrollable ancestor (or the page).
 */

const EDGE = 28
const MAX_STEP = 16

/** Scroll velocity for one axis given the pointer and the visible range. */
function axisStep(pos: number, start: number, end: number): number {
  if (end - start < EDGE * 3) return 0
  if (pos < start + EDGE) {
    return -Math.ceil(((start + EDGE - pos) / EDGE) * MAX_STEP)
  }
  if (pos > end - EDGE) {
    return Math.ceil(((pos - (end - EDGE)) / EDGE) * MAX_STEP)
  }
  return 0
}

/** Nearest ancestor that can scroll vertically, else the page scroller. */
export function verticalScrollParent(el: Element): HTMLElement {
  for (let cur = el.parentElement; cur; cur = cur.parentElement) {
    const style = getComputedStyle(cur)
    if (
      /(auto|scroll)/.test(style.overflowY) &&
      cur.scrollHeight > cur.clientHeight
    ) {
      return cur
    }
  }
  return (
    (document.scrollingElement as HTMLElement | null) ??
    document.documentElement
  )
}

interface DragScroller {
  update(x: number, y: number): void
  stop(): void
}

function createDragScroller(
  area: HTMLElement,
  onScrolled: () => void,
): DragScroller {
  const page =
    (document.scrollingElement as HTMLElement | null) ??
    document.documentElement
  const vertical = verticalScrollParent(area)
  let raf = 0
  let px = 0
  let py = 0

  const tick = () => {
    raf = 0
    let moved = false

    if (area.scrollWidth > area.clientWidth) {
      const rect = area.getBoundingClientRect()
      const dx = axisStep(
        px,
        Math.max(rect.left, 0),
        Math.min(rect.right, window.innerWidth),
      )
      if (dx) {
        const before = area.scrollLeft
        area.scrollLeft += dx
        moved = moved || area.scrollLeft !== before
      }
    }

    const bounds =
      vertical === page
        ? { top: 0, bottom: window.innerHeight }
        : (() => {
            const rect = vertical.getBoundingClientRect()
            return {
              top: Math.max(rect.top, 0),
              bottom: Math.min(rect.bottom, window.innerHeight),
            }
          })()
    const dy = axisStep(py, bounds.top, bounds.bottom)
    if (dy) {
      const before = vertical.scrollTop
      vertical.scrollTop += dy
      moved = moved || vertical.scrollTop !== before
    }

    if (moved) {
      onScrolled()
      raf = requestAnimationFrame(tick)
    }
  }

  return {
    update(x, y) {
      px = x
      py = y
      if (!raf) raf = requestAnimationFrame(tick)
    },
    stop() {
      if (raf) cancelAnimationFrame(raf)
      raf = 0
    },
  }
}

/**
 * Run a pointer drag from `event` until pointerup/pointercancel, reporting the
 * latest pointer position through `onPoint` — on every move and again on every
 * auto-scroll step (so the selection keeps growing while the pointer idles in
 * the edge zone).
 */
export function trackPointerDrag(options: {
  event: PointerEvent
  /** Horizontal auto-scroll container (the table's `.tableWrapper`), if any. */
  area: HTMLElement | null
  onPoint: (x: number, y: number) => void
}): void {
  const { event, area, onPoint } = options
  const pointerId = event.pointerId
  const target = event.target instanceof Element ? event.target : null
  try {
    target?.setPointerCapture(pointerId)
  } catch {
    // Detached or capture-incapable target; document listeners still cover us.
  }

  let x = event.clientX
  let y = event.clientY
  const scroller = area ? createDragScroller(area, () => onPoint(x, y)) : null

  const onMove = (e: PointerEvent) => {
    if (e.pointerId !== pointerId) return
    x = e.clientX
    y = e.clientY
    onPoint(x, y)
    scroller?.update(x, y)
  }
  const stop = (e: PointerEvent) => {
    if (e.pointerId !== pointerId) return
    scroller?.stop()
    document.removeEventListener('pointermove', onMove)
    document.removeEventListener('pointerup', stop, true)
    document.removeEventListener('pointercancel', stop, true)
  }
  document.addEventListener('pointermove', onMove)
  document.addEventListener('pointerup', stop, true)
  document.addEventListener('pointercancel', stop, true)
}
