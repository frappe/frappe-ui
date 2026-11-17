import { documentDir } from '../../../../charts/utils'

export interface ImageViewerKeymapActions {
  /** Whether the viewer is open; when false the handler is a no-op. */
  isOpen: () => boolean
  /** Whether a pan/drag is in progress (arrow keys are suppressed). */
  isPanning: () => boolean
  onActivity: () => void
  next: () => void
  previous: () => void
  zoomIn: () => void
  zoomOut: () => void
  toggleFullscreen: () => void
  close: () => void
}

/**
 * Build a `keydown` handler for the image viewer.
 *
 * Pure factory: takes callbacks, returns a handler. The handler no-ops when the
 * viewer is closed, reports activity (to keep controls visible) on any key, and
 * routes navigation / zoom / fullscreen / close. Returns `true` when it handled
 * the event (caller may call `preventDefault`); the handler itself also calls
 * `preventDefault` for handled keys.
 */
export function createImageViewerKeydown(
  actions: ImageViewerKeymapActions,
): (event: KeyboardEvent) => void {
  return (event: KeyboardEvent) => {
    if (!actions.isOpen()) return

    actions.onActivity()

    // Images run right to left on an RTL page, so ArrowLeft shows the next one.
    const [previousKey, nextKey] =
      documentDir() === 'rtl'
        ? ['ArrowRight', 'ArrowLeft']
        : ['ArrowLeft', 'ArrowRight']

    switch (event.key) {
      case previousKey:
        if (!actions.isPanning()) actions.previous()
        event.preventDefault()
        break
      case nextKey:
        if (!actions.isPanning()) actions.next()
        event.preventDefault()
        break
      case '+':
      case '=':
        actions.zoomIn()
        event.preventDefault()
        break
      case '-':
        actions.zoomOut()
        event.preventDefault()
        break
      case 'Escape':
        actions.close()
        event.preventDefault()
        break
      case 'f':
      case 'F':
        actions.toggleFullscreen()
        event.preventDefault()
        break
    }
  }
}
