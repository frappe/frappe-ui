import { onMounted, onUnmounted, ref, type Ref } from 'vue'

export interface UseFullscreen {
  isFullscreen: Ref<boolean>
  /** Request fullscreen on `el`, or exit if already fullscreen. */
  toggleFullscreen: (el: HTMLElement) => void
}

/**
 * Fullscreen state derived solely from the `fullscreenchange` event.
 *
 * We never write `isFullscreen` optimistically: `requestFullscreen` /
 * `exitFullscreen` are async and may be rejected (e.g. no user gesture, or the
 * user presses Esc). Deriving state only from the browser event keeps the ref
 * in sync with reality. Both `toggle` promises are `.catch()`-guarded so a
 * rejected request never produces an unhandled rejection.
 */
export function useFullscreen(): UseFullscreen {
  const isFullscreen = ref(false)

  function handleChange() {
    isFullscreen.value = Boolean(document.fullscreenElement)
  }

  function toggleFullscreen(el: HTMLElement) {
    if (!document.fullscreenElement) {
      void el.requestFullscreen?.()?.catch(() => {})
    } else {
      void document.exitFullscreen?.()?.catch(() => {})
    }
  }

  onMounted(() => {
    document.addEventListener('fullscreenchange', handleChange)
    // Sync once in case we mounted while already fullscreen.
    handleChange()
  })

  onUnmounted(() => {
    document.removeEventListener('fullscreenchange', handleChange)
    if (document.fullscreenElement) {
      void document.exitFullscreen?.()?.catch(() => {})
    }
  })

  return { isFullscreen, toggleFullscreen }
}
