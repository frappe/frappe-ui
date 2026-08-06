import {
  onBeforeUnmount,
  readonly,
  ref,
  toValue,
  watch,
  type MaybeRefOrGetter,
  type Ref,
} from 'vue'

/** Movement (px) a gesture must cover before it is classified. */
const SLOP = 6
/** Dismiss when the drag passes this fraction of the surface's own height... */
const CLOSE_HEIGHT_RATIO = 0.25
/** ...or when it is released with at least this downward speed (px per ms). */
const CLOSE_VELOCITY = 0.5
/** How long the dismiss fling runs before `onDismiss` fires. */
const CLOSE_DURATION = 260
/** How long the spring back to rest runs. */
const SETTLE_DURATION = 200
/** Release velocity is measured over the last slice of the gesture only. */
const VELOCITY_WINDOW = 100

const CLOSE_EASING = 'cubic-bezier(0.32, 0.72, 0, 1)'

/**
 * Elements that own the gesture themselves. A drag starting on one of these
 * would fight text editing, native scrubbing, or a consumer's own gesture.
 */
const NON_DRAGGABLE =
  'input, textarea, select, [contenteditable=""], [contenteditable="true"], [data-no-sheet-drag]'

type Phase = 'idle' | 'undecided' | 'dragging' | 'scrolling'

export interface UseSheetDragOptions {
  /**
   * The surface that moves. Every listener binds here, which is what lets a
   * gesture anywhere inside the surface drag it.
   */
  target: MaybeRefOrGetter<HTMLElement | null | undefined>
  /**
   * Optional grab handle inside `target`. A gesture starting here always
   * drags: it skips the scroll-position and direction checks.
   */
  handle?: MaybeRefOrGetter<HTMLElement | null | undefined>
  /** When false the surface never drags. Default `true`. */
  enabled?: MaybeRefOrGetter<boolean>
  /** Called once the dismiss fling has finished. Unmount the surface here. */
  onDismiss: () => void
}

export interface UseSheetDrag {
  /** True only while a gesture owns the surface and is moving it. */
  dragging: Readonly<Ref<boolean>>
}

/**
 * iOS-style resistance for the upward overscroll: the further you pull past the
 * resting position, the less the surface follows, asymptotically. `overscroll`
 * is a positive distance; returns the (negative) damped offset.
 */
function rubberband(overscroll: number, dimension: number, constant = 0.55) {
  const d = dimension || window.innerHeight
  return -((overscroll * d * constant) / (d + constant * overscroll))
}

/**
 * The nearest scrollable ancestor of `from`, searching up to and including
 * `root`. Returns null when nothing between the two can scroll.
 */
function findScroller(from: Element | null, root: HTMLElement) {
  let el: Element | null = from
  while (el) {
    if (el instanceof HTMLElement && el.scrollHeight > el.clientHeight) {
      const overflowY = getComputedStyle(el).overflowY
      if (overflowY === 'auto' || overflowY === 'scroll') return el
    }
    if (el === root) break
    el = el.parentElement
  }
  return null
}

/**
 * Drag-to-dismiss for a surface that also scrolls, such as a bottom sheet.
 *
 * The hard part is deciding, once per gesture, whether the finger belongs to
 * the surface or to a scroller inside it. Pointer events alone cannot do that
 * on touch: once `touch-action` permits scrolling the browser starts a native
 * scroll and fires `pointercancel`, and `pointermove` is not cancelable. So
 * touch runs on `touchstart`/`touchmove`/`touchend`, where the first
 * `touchmove` is cancelable and is the one place the decision can be made and
 * enforced. Mouse and pen keep the simpler pointer path.
 *
 * The decision is taken at most once per gesture and then locked, so a scroller
 * reaching or leaving its top mid-gesture cannot hand ownership over.
 */
export function useSheetDrag(options: UseSheetDragOptions): UseSheetDrag {
  const { target, handle, enabled = true, onDismiss } = options

  const dragging = ref(false)

  let phase: Phase = 'idle'
  /** True from the moment a dismiss fling starts until the surface unmounts. */
  let closing = false
  let startX = 0
  let startY = 0
  let fromHandle = false
  /** Nearest scrollable ancestor of the gesture's start point, if any. */
  let scroller: HTMLElement | null = null
  /**
   * Its `scrollTop` at gesture start. Snapshotted on purpose. A live read
   * re-crosses 0 while the browser rubber-bands at the top of a fling, which
   * would flip an already-decided gesture halfway through.
   */
  let scrollTopAtStart = 0
  /** Surface height, measured once per gesture rather than on every move. */
  let height = 0
  /** Live offset. Deliberately not reactive: it changes on every frame. */
  let offset = 0
  /** Recent (offset, timestamp) pairs, trimmed to the velocity window. */
  let samples: { y: number; t: number }[] = []
  let frame: number | null = null
  let closeTimer: number | null = null
  let settleTimer: number | null = null
  /** Pointer id of the in-flight mouse/pen gesture, if any. */
  let pointerId: number | null = null
  /** True only while the surface holds pointer capture for `pointerId`. */
  let captured = false
  /**
   * True while a touch gesture owns the surface. Touch never captures, so it
   * has to be told apart from an uncaptured mouse gesture. See `onPointerDown`.
   */
  let touchGesture = false

  function clearTimers() {
    if (frame !== null) {
      cancelAnimationFrame(frame)
      frame = null
    }
    if (closeTimer !== null) {
      clearTimeout(closeTimer)
      closeTimer = null
    }
    if (settleTimer !== null) {
      clearTimeout(settleTimer)
      settleTimer = null
    }
  }

  /**
   * Hold the pointer stream on the surface so the drag survives the cursor
   * leaving it. Captured on the surface, not on `e.target`: the deepest node
   * under the cursor may be unmounted by an animating child part-way through
   * the drag, which silently drops the rest of the stream.
   *
   * Deliberately not called on pointerdown. Capture retargets the legacy mouse
   * events too, so a plain click on a button inside the surface would have its
   * `click` delivered to the surface instead of the button.
   */
  function capturePointer() {
    const el = toValue(target)
    if (captured || pointerId === null || !el?.setPointerCapture) return
    try {
      el.setPointerCapture(pointerId)
      captured = true
    } catch {
      // A pointer that ended between the event and this call.
    }
  }

  function releasePointer() {
    const el = toValue(target)
    if (captured && el?.releasePointerCapture) {
      try {
        el.releasePointerCapture(pointerId as number)
      } catch {
        // Already released, by pointerup or by the element going away.
      }
    }
    captured = false
    pointerId = null
  }

  /** Downward speed (px/ms) over the last `VELOCITY_WINDOW`; positive = down. */
  function flickVelocity() {
    if (samples.length < 2) return 0
    const latest = samples[samples.length - 1]
    const oldest = samples[0]
    const dt = latest.t - oldest.t
    return dt > 0 ? (latest.y - oldest.y) / dt : 0
  }

  function paint() {
    if (frame !== null) return
    frame = requestAnimationFrame(() => {
      frame = null
      const el = toValue(target)
      if (el && phase === 'dragging')
        el.style.transform = `translateY(${offset}px)`
    })
  }

  /** Decide whether this gesture may be considered at all. */
  function begin(x: number, y: number, from: EventTarget | null): boolean {
    const el = toValue(target)
    if (!el || closing || !toValue(enabled)) return false

    const origin = from instanceof Element ? from : null
    if (origin?.closest(NON_DRAGGABLE)) return false
    // Dragging away from a live text selection is the user extending it.
    const selection = window.getSelection?.()
    if (selection && !selection.isCollapsed) return false

    startX = x
    startY = y
    offset = 0
    samples = [{ y: 0, t: performance.now() }]
    height = el.offsetHeight || window.innerHeight
    fromHandle = !!(origin && toValue(handle)?.contains(origin))
    scroller = fromHandle ? null : findScroller(origin, el)
    scrollTopAtStart = scroller ? scroller.scrollTop : 0
    phase = 'undecided'
    return true
  }

  /**
   * Feed a move into the state machine. Returns true when the surface owns the
   * gesture, which is the caller's cue to `preventDefault()` the touch move.
   */
  function move(x: number, y: number): boolean {
    if (phase !== 'undecided' && phase !== 'dragging') return false

    const dx = x - startX
    const dy = y - startY

    if (phase === 'undecided') {
      if (Math.abs(dx) < SLOP && Math.abs(dy) < SLOP) return false
      // A gesture on the handle is unambiguous, so it skips these checks.
      if (!fromHandle) {
        // Mostly sideways: leave it to whatever paginates horizontally.
        if (Math.abs(dx) > Math.abs(dy)) return reject()
        // Upward, or downward from a scroller that is not already at its top:
        // the content should scroll instead.
        if (dy <= 0) return reject()
        if (scroller && scrollTopAtStart > 0) return reject()
      }
      phase = 'dragging'
      dragging.value = true
      capturePointer()
      const el = toValue(target)
      if (el) {
        // Take the surface out of any transition or entry keyframe before the
        // first frame is written, so the drag tracks the finger immediately
        // instead of easing towards it or being outranked by the animation.
        el.dataset.dragged = ''
        el.style.transition = 'none'
        el.style.willChange = 'transform'
        el.style.transform = `translateY(${Math.max(dy, 0)}px)`
      }
    }

    // Down tracks the finger 1:1; up gets resistance and springs back.
    offset = dy >= 0 ? dy : rubberband(-dy, height)
    const now = performance.now()
    samples.push({ y: offset, t: now })
    while (samples.length > 2 && now - samples[0].t > VELOCITY_WINDOW) {
      samples.shift()
    }
    paint()
    return true
  }

  function reject() {
    phase = 'scrolling'
    return false
  }

  /**
   * Settle the gesture. A cancelled gesture always springs back: the user did
   * not release it, so it should not be read as an intent to dismiss.
   */
  function finish(cancelled = false) {
    const wasDragging = phase === 'dragging'
    phase = 'idle'
    dragging.value = false
    touchGesture = false
    releasePointer()
    if (frame !== null) {
      cancelAnimationFrame(frame)
      frame = null
    }
    const el = toValue(target)
    if (!el || !wasDragging) return

    const shouldClose =
      !cancelled &&
      offset > 0 &&
      (offset > height * CLOSE_HEIGHT_RATIO || flickVelocity() > CLOSE_VELOCITY)

    if (shouldClose) {
      closing = true
      // Suppress the exit keyframe so it cannot restart the slide from
      // translateY(0), which reads as the sheet jumping back up first.
      el.style.animation = 'none'
      el.style.transition = `transform ${CLOSE_DURATION}ms ${CLOSE_EASING}`
      el.style.transform = 'translateY(100%)'
      closeTimer = window.setTimeout(() => {
        closeTimer = null
        onDismiss()
      }, CLOSE_DURATION + 20)
      return
    }

    el.style.transition = `transform ${SETTLE_DURATION}ms ease-out`
    el.style.transform = 'translateY(0px)'
    offset = 0
    settleTimer = window.setTimeout(() => {
      settleTimer = null
      el.style.transition = ''
      el.style.transform = ''
      el.style.willChange = ''
    }, SETTLE_DURATION + 20)
  }

  function onTouchStart(e: TouchEvent) {
    if (phase !== 'idle' || e.touches.length !== 1) return
    if (begin(e.touches[0].clientX, e.touches[0].clientY, e.target)) {
      touchGesture = true
    }
  }

  function onTouchMove(e: TouchEvent) {
    // Kept first so a gesture that already went to the scroller costs nothing.
    if (phase === 'scrolling' || phase === 'idle') return
    if (e.touches.length !== 1) {
      finish(true)
      return
    }
    if (move(e.touches[0].clientX, e.touches[0].clientY) && e.cancelable) {
      e.preventDefault()
    }
  }

  function onTouchEnd(e: TouchEvent) {
    finish(e.type === 'touchcancel')
  }

  function onPointerDown(e: PointerEvent) {
    // Touch runs on the touch listeners, which can actually stop a native
    // scroll; letting it through here would decide the gesture twice.
    if (e.pointerType === 'touch' || e.button !== 0) return
    // An uncaptured gesture can end outside the surface, so its pointerup goes
    // elsewhere and the phase is never cleared. A fresh press supersedes that
    // leftover. Capture is the test, not `dragging`: `capturePointer()` bails
    // when the browser has no `setPointerCapture` or the pointer has already
    // ended, which leaves a committed drag holding nothing. Keying on
    // `dragging` would refuse to supersede that drag and wedge the surface for
    // good.
    // Touch is excluded because it never captures, yet its touchend always
    // reaches the surface, so it needs no recovery. On a device with both
    // inputs a stray mouse press must not cancel a live finger drag.
    if (phase !== 'idle' && !captured && !touchGesture) phase = 'idle'
    if (phase !== 'idle') return
    if (!begin(e.clientX, e.clientY, e.target)) return
    pointerId = e.pointerId
  }

  function onPointerMove(e: PointerEvent) {
    if (e.pointerType === 'touch') return
    move(e.clientX, e.clientY)
  }

  function onPointerUp(e: PointerEvent) {
    if (e.pointerType === 'touch') return
    finish(e.type === 'pointercancel')
  }

  function bind(el: HTMLElement) {
    el.addEventListener('touchstart', onTouchStart, { passive: true })
    // Non-passive: the first move of a downward drag must be preventable.
    el.addEventListener('touchmove', onTouchMove, { passive: false })
    el.addEventListener('touchend', onTouchEnd, { passive: true })
    el.addEventListener('touchcancel', onTouchEnd, { passive: true })
    el.addEventListener('pointerdown', onPointerDown)
    el.addEventListener('pointermove', onPointerMove)
    el.addEventListener('pointerup', onPointerUp)
    el.addEventListener('pointercancel', onPointerUp)
  }

  function unbind(el: HTMLElement) {
    el.removeEventListener('touchstart', onTouchStart)
    el.removeEventListener('touchmove', onTouchMove)
    el.removeEventListener('touchend', onTouchEnd)
    el.removeEventListener('touchcancel', onTouchEnd)
    el.removeEventListener('pointerdown', onPointerDown)
    el.removeEventListener('pointermove', onPointerMove)
    el.removeEventListener('pointerup', onPointerUp)
    el.removeEventListener('pointercancel', onPointerUp)
  }

  watch(
    // Wrapped rather than passed straight through: `target` may be a getter or
    // a plain element, neither of which `watch` accepts as a source.
    () => toValue(target),
    (el, previous) => {
      if (previous) unbind(previous)
      // A new element means a fresh surface, so no gesture is in flight and
      // none of the old element's inline state carries over.
      clearTimers()
      phase = 'idle'
      closing = false
      dragging.value = false
      captured = false
      touchGesture = false
      pointerId = null
      offset = 0
      if (el) bind(el)
    },
    { immediate: true, flush: 'post' },
  )

  onBeforeUnmount(() => {
    clearTimers()
    const el = toValue(target)
    if (el) unbind(el)
  })

  return { dragging: readonly(dragging) }
}
