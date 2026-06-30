import {
  computed,
  onScopeDispose,
  ref,
  watch,
  type CSSProperties,
  type Ref,
} from 'vue'
import { useEventListener, useStorage, useWindowSize } from '@vueuse/core'
import type {
  FloatingWindowOptions,
  Rect,
  ResizeDir,
  WindowMode,
} from './types'

const TRAY_WIDTH = 320
const EDGE_MARGIN = 24
const DEFAULT_WIDTH = 460
const DEFAULT_HEIGHT = 520
const MIN_WIDTH = 380
const MIN_HEIGHT = 300

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
 * clamping and persistence. Drag and resize both use raw pointer events with
 * `setPointerCapture` so the pointer never escapes to background images or
 * links — no jank, no native drag interference.
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
  const x = ref(saved.value.rect.x)
  const y = ref(saved.value.rect.y)
  const width = ref(saved.value.rect.width)
  const height = ref(saved.value.rect.height)
  const isDragging = ref(false)
  const isResizing = ref(false)

  const isFloating = computed(() => mode.value === 'floating')

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
      rect: { x: x.value, y: y.value, width: width.value, height: height.value },
    }
  }

  function setMode(next: WindowMode) {
    mode.value = next
    persist()
  }

  function anchorBottomRight() {
    x.value = viewportWidth.value - width.value - EDGE_MARGIN
    y.value = viewportHeight.value - height.value - EDGE_MARGIN
    x.value = clamp(x.value, 0, viewportWidth.value - 80)
    y.value = clamp(y.value, 0, viewportHeight.value - 40)
  }

  const dock = () => setMode('docked')
  const minimize = () => setMode('minimized')

  function float() {
    anchorBottomRight()
    setMode('floating')
  }
  const expandFromTray = float

  /**
   * Begin a pointer drag from the title-bar handle. `setPointerCapture` routes
   * all subsequent pointer events to the handle element, so the pointer never
   * reaches background images or links — no native drag interference or jank.
   */
  function startDrag(event: PointerEvent) {
    if (!isFloating.value) return
    // Bail if the click originated on an interactive element inside the header
    // (button, link, input…) so their own click handlers still fire.
    if ((event.target as HTMLElement).closest('button, a, input, select, textarea, [role="button"]')) return
    event.preventDefault()
    ;(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId)
    isDragging.value = true
    const origin = { pointerX: event.clientX, pointerY: event.clientY, x: x.value, y: y.value }
    const stopMove = useEventListener('pointermove', (e: PointerEvent) => {
      x.value = clamp(origin.x + e.clientX - origin.pointerX, 0, viewportWidth.value - 80)
      y.value = clamp(origin.y + e.clientY - origin.pointerY, 0, viewportHeight.value - 40)
    })
    const stopUp = useEventListener('pointerup', () => {
      isDragging.value = false
      persist()
      stopMove()
      stopUp()
    })
  }

  /**
   * Begin a pointer resize from an edge or corner. `dir` says which edges move;
   * dragging a top/left edge also shifts the panel's origin so the opposite
   * edge stays anchored. Uses the same `setPointerCapture` pattern as `startDrag`.
   */
  function startResize(event: PointerEvent, dir: ResizeDir = { x: 1, y: 1 }) {
    isResizing.value = true
    event.preventDefault()
    ;(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId)
    const origin = {
      pointerX: event.clientX,
      pointerY: event.clientY,
      x: x.value,
      y: y.value,
      width: width.value,
      height: height.value,
    }
    const stopMove = useEventListener('pointermove', (e: PointerEvent) => {
      const dx = e.clientX - origin.pointerX
      const dy = e.clientY - origin.pointerY
      if (dir.x === 1) {
        width.value = clamp(origin.width + dx, MIN_WIDTH, viewportWidth.value)
      } else if (dir.x === -1) {
        width.value = clamp(origin.width - dx, MIN_WIDTH, viewportWidth.value)
        x.value = origin.x + origin.width - width.value
      }
      if (dir.y === 1) {
        height.value = clamp(origin.height + dy, MIN_HEIGHT, viewportHeight.value)
      } else if (dir.y === -1) {
        height.value = clamp(origin.height - dy, MIN_HEIGHT, viewportHeight.value)
        y.value = origin.y + origin.height - height.value
      }
    })
    const stopUp = useEventListener('pointerup', () => {
      isResizing.value = false
      persist()
      stopMove()
      stopUp()
    })
  }

  /** Resize by a fixed delta — the keyboard path on the bottom-right corner. */
  function resizeBy(dx: number, dy: number) {
    width.value = clamp(width.value + dx, MIN_WIDTH, viewportWidth.value)
    height.value = clamp(height.value + dy, MIN_HEIGHT, viewportHeight.value)
    persist()
  }

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
    startDrag,
    startResize,
    resizeBy,
  }
}
