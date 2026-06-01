import { createApp, h, type App } from 'vue'
import ImageViewerModal from '../../components/ImageViewerModal.vue'
import type { ViewableImage } from './collectImages'

/**
 * Imperative mount/unmount of the image viewer modal.
 *
 * Guarded against rapid reopen: a single Vue app + container is reused for the
 * lifetime of the page. Opening again while one is mounted tears the previous
 * instance down first (so we never stack multiple modals or leak containers),
 * then mounts a fresh one. Unmount is deferred a tick so the leave transition
 * can play before the DOM is removed.
 */

let app: App | null = null
let container: HTMLDivElement | null = null
// Bumped on every open. A deferred teardown captures the value at close time
// and no-ops if a newer open has since occurred, so a freshly reopened modal
// is never torn down by the previous instance's pending timeout.
let generation = 0
let pendingTeardown: ReturnType<typeof setTimeout> | null = null

function teardown() {
  if (app) {
    app.unmount()
    app = null
  }
  if (container && container.parentNode) {
    container.parentNode.removeChild(container)
  }
  container = null
}

export function openImageViewerModal(
  images: ViewableImage[],
  initialIndex: number,
): void {
  // Cancel any teardown scheduled by a closing modal before it can fire.
  if (pendingTeardown !== null) {
    clearTimeout(pendingTeardown)
    pendingTeardown = null
  }
  // Reuse a single instance: tear down any existing modal before reopening.
  teardown()

  const openGeneration = ++generation

  container = document.createElement('div')
  document.body.appendChild(container)

  app = createApp({
    render() {
      return h(ImageViewerModal, {
        show: true,
        images,
        initialIndex,
        'onUpdate:show': (value: boolean) => {
          if (!value) {
            // Defer so the close transition can finish before removal, but
            // skip if a newer open has superseded this instance.
            pendingTeardown = setTimeout(() => {
              pendingTeardown = null
              if (openGeneration !== generation) return
              teardown()
            }, 0)
          }
        },
      })
    },
  })

  app.mount(container)
}
