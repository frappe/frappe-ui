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
const MAXIMIZED_MARGIN = 24
// Gap from the viewport edge when parked in the bottom-right corner.
const EDGE_MARGIN = 24

// While any window is detached it sits at a fixed, positive z-index and would
// otherwise cover popovers (reka-ui teleports them to <body> at z-index:auto).
// A body class lets a global rule lift the popover layer above the window only
// while one is open. Reference-counted so concurrent windows behave.
const BODY_CLASS = 'has-floating-window'
let detachedWindowCount = 0

function setWindowDetached(active: boolean) {
  detachedWindowCount = Math.max(0, detachedWindowCount + (active ? 1 : -1))
  document.body.classList.toggle(BODY_CLASS, detachedWindowCount > 0)
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
  const {
    initialMode = 'docked',
    initialWidth = 460,
    initialHeight = 520,
    minWidth = 380,
    minHeight = 300,
    storageKey = null,
  } = options

  const { width: viewportWidth, height: viewportHeight } = useWindowSize()

  const fallback: Rect = {
    x: Math.max(0, viewportWidth.value - initialWidth - EDGE_MARGIN),
    y: Math.max(0, viewportHeight.value - initialHeight - EDGE_MARGIN),
    width: initialWidth,
    height: initialHeight,
  }
  const saved = storageKey
    ? useStorage(storageKey, { mode: initialMode, rect: fallback })
    : ref({ mode: initialMode, rect: fallback })

  const mode = ref<WindowMode>(saved.value.mode)
  const width = ref(saved.value.rect.width)
  const height = ref(saved.value.rect.height)
  const isResizing = ref(false)
  // Rect to return to when un-maximizing.
  let restoreRect: Rect | null = null

  const isFloating = computed(() => mode.value === 'floating')

  // Track whether this window is detached so the popover layer can clear it.
  let isContributingDetached = false
  watch(
    () => mode.value !== 'docked',
    (detached) => {
      if (detached === isContributingDetached) return
      isContributingDetached = detached
      setWindowDetached(detached)
    },
    { immediate: true },
  )
  onScopeDispose(() => {
    if (isContributingDetached) setWindowDetached(false)
  })

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
        right: '24px',
        bottom: '0px',
        width: `${TRAY_WIDTH}px`,
        zIndex: 50,
      }
    if (mode.value === 'maximized')
      return { position: 'fixed', inset: `${MAXIMIZED_MARGIN}px`, zIndex: 50 }
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

  function float() {
    if (restoreRect) {
      ;({
        x: x.value,
        y: y.value,
        width: width.value,
        height: height.value,
      } = restoreRect)
      restoreRect = null
      clampPosition()
      setMode('floating')
      return
    }
    // Pop out at the configured default size, parked in the bottom-right.
    anchorBottomRight()
    setMode('floating')
  }

  function maximize() {
    restoreRect = {
      x: x.value,
      y: y.value,
      width: width.value,
      height: height.value,
    }
    setMode('maximized')
  }

  const dock = () => setMode('docked')
  const minimize = () => setMode('minimized')

  function expandFromTray() {
    anchorBottomRight()
    setMode('floating')
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
        minWidth,
        viewportWidth.value,
      )
      height.value = clamp(
        origin.height + e.clientY - origin.y,
        minHeight,
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
    maximize,
    expandFromTray,
    setMode,
    startResize,
  }
}
