import {
  computed,
  onScopeDispose,
  ref,
  watch,
  type CSSProperties,
  type Ref,
} from 'vue'
import {
  useDraggable,
  useEventListener,
  useStorage,
  useWindowSize,
} from '@vueuse/core'
import type { FloatingWindowOptions, Rect, WindowMode } from './types'

const TRAY_WIDTH = 320
// Gap from the viewport edge when parked in the bottom-right corner.
const EDGE_MARGIN = 24
// Default floating size when a window pops out, absent any saved rect. Resizable
// from there; the docked footprint is set by the host container, not these.
const DEFAULT_WIDTH = 460
const DEFAULT_HEIGHT = 520
// Smallest the panel can be resized to.
const MIN_WIDTH = 380
const MIN_HEIGHT = 300

// Only one window may be detached (floating or minimized) at a time. Opening a
// new one pins the previous, like a single chat / mail composer. The active
// window registers its `dock()` here so a newcomer can pin it; a global rule
// keyed off `BODY_CLASS` lifts the popover layer above the detached window
// (reka-ui teleports popovers to <body> at z-index:auto, which would otherwise
// sit behind it).
const BODY_CLASS = 'has-floating-window'
let activeDocker: (() => void) | null = null

function setActiveDocker(docker: (() => void) | null) {
  activeDocker = docker
  document.body.classList.toggle(BODY_CLASS, activeDocker !== null)
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

/**
 * Headless drag + resize + window-state engine for FloatingWindow.
 *
 * Owns the geometry (x/y/width/height), the `mode` state machine, viewport
 * clamping and persistence. The shell component renders chrome and binds
 * `style`; this composable holds no markup. Drag is delegated to VueUse's
 * `useDraggable` and is only enabled while floating. Resize is a small custom
 * pointer loop, since VueUse has no resize composable.
 */
export function useFloatingWindow(
  panel: Ref<HTMLElement | null>,
  handle: Ref<HTMLElement | null>,
  options: FloatingWindowOptions = {},
) {
  const { initialMode = 'docked', storageKey = null } = options

  const { width: viewportWidth, height: viewportHeight } = useWindowSize()

  const fallback: Rect = {
    x: Math.max(0, viewportWidth.value - DEFAULT_WIDTH - EDGE_MARGIN),
    y: Math.max(0, viewportHeight.value - DEFAULT_HEIGHT - EDGE_MARGIN),
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT,
  }
  const saved = storageKey
    ? useStorage(storageKey, { mode: initialMode, rect: fallback })
    : ref({ mode: initialMode, rect: fallback })

  const mode = ref<WindowMode>(saved.value.mode)
  const width = ref(saved.value.rect.width)
  const height = ref(saved.value.rect.height)
  const isResizing = ref(false)

  const isFloating = computed(() => mode.value === 'floating')

  function clampPosition() {
    x.value = clamp(x.value, 0, viewportWidth.value - 80)
    y.value = clamp(y.value, 0, viewportHeight.value - 40)
  }

  const { x, y, isDragging } = useDraggable(panel, {
    handle,
    initialValue: { x: saved.value.rect.x, y: saved.value.rect.y },
    disabled: computed(() => !isFloating.value),
    preventDefault: true,
    onMove: clampPosition,
    onEnd: persist,
  })

  const style = computed<CSSProperties>(() => {
    if (mode.value === 'docked') return {}
    if (mode.value === 'minimized')
      return {
        position: 'fixed',
        right: `${EDGE_MARGIN}px`,
        bottom: `${EDGE_MARGIN}px`,
        width: `${TRAY_WIDTH}px`,
        zIndex: 50,
      }
    return {
      position: 'fixed',
      left: `${x.value}px`,
      top: `${y.value}px`,
      width: `${width.value}px`,
      height: `${height.value}px`,
      zIndex: 50,
    }
  })

  function persist() {
    if (!storageKey) return
    saved.value = {
      mode: mode.value,
      rect: {
        x: x.value,
        y: y.value,
        width: width.value,
        height: height.value,
      },
    }
  }

  function setMode(next: WindowMode) {
    mode.value = next
    persist()
  }

  /** Park the window in the bottom-right corner, like a chat / mail composer. */
  function anchorBottomRight() {
    x.value = viewportWidth.value - width.value - EDGE_MARGIN
    y.value = viewportHeight.value - height.value - EDGE_MARGIN
    clampPosition()
  }

  const dock = () => setMode('docked')
  const minimize = () => setMode('minimized')

  /** Pop the window out, parked in the bottom-right at its floating size. */
  function float() {
    anchorBottomRight()
    setMode('floating')
  }
  const expandFromTray = float

  // Single detached window: when this one detaches it pins whichever window was
  // detached before; when it docks it clears itself from the active slot.
  watch(
    () => mode.value !== 'docked',
    (detached) => {
      if (detached) {
        if (activeDocker && activeDocker !== dock) activeDocker()
        setActiveDocker(dock)
      } else if (activeDocker === dock) {
        setActiveDocker(null)
      }
    },
    { immediate: true },
  )
  onScopeDispose(() => {
    if (activeDocker === dock) setActiveDocker(null)
  })

  /** Resize by a fixed delta, for the keyboard path on the resize grip. */
  function resizeBy(dx: number, dy: number) {
    width.value = clamp(width.value + dx, MIN_WIDTH, viewportWidth.value)
    height.value = clamp(height.value + dy, MIN_HEIGHT, viewportHeight.value)
    persist()
  }

  function startResize(event: PointerEvent) {
    isResizing.value = true
    const origin = {
      x: event.clientX,
      y: event.clientY,
      width: width.value,
      height: height.value,
    }
    const stopMove = useEventListener('pointermove', (e: PointerEvent) => {
      width.value = clamp(
        origin.width + e.clientX - origin.x,
        MIN_WIDTH,
        viewportWidth.value,
      )
      height.value = clamp(
        origin.height + e.clientY - origin.y,
        MIN_HEIGHT,
        viewportHeight.value,
      )
    })
    const stopUp = useEventListener('pointerup', () => {
      isResizing.value = false
      persist()
      stopMove()
      stopUp()
    })
  }

  return {
    mode,
    x,
    y,
    width,
    height,
    style,
    isDragging,
    isResizing,
    dock,
    float,
    minimize,
    expandFromTray,
    setMode,
    startResize,
    resizeBy,
  }
}
