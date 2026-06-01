import { onUnmounted, ref, type Ref } from 'vue'

export interface UseControlsAutoHideOptions {
  /** Inactivity delay before controls hide. Defaults to 3000ms. */
  delayMs?: number
  /**
   * Optional predicate; while it returns `true` the auto-hide timer keeps
   * re-arming instead of hiding (e.g. while a gesture is in progress).
   */
  isPaused?: () => boolean
}

export interface UseControlsAutoHide {
  isControlsVisible: Ref<boolean>
  /** Mark user activity: shows controls and (re)arms the hide timer. */
  handleActivity: () => void
  /** Force controls visible and arm the hide timer. */
  showAndReset: () => void
}

/**
 * Auto-hiding overlay controls.
 *
 * Controls become visible on activity and hide after `delayMs` of inactivity,
 * unless `isPaused()` is `true` (in which case the timer re-arms). The single
 * timer is always cleared on unmount, so no stray timeout leaks across the
 * modal's open/close lifecycle.
 */
export function useControlsAutoHide(
  opts: UseControlsAutoHideOptions = {},
): UseControlsAutoHide {
  const delayMs = opts.delayMs ?? 3000
  const isPaused = opts.isPaused ?? (() => false)

  const isControlsVisible = ref(true)
  let timer: ReturnType<typeof setTimeout> | null = null

  function clear() {
    if (timer !== null) {
      clearTimeout(timer)
      timer = null
    }
  }

  function showAndReset() {
    isControlsVisible.value = true
    clear()
    timer = setTimeout(function tick() {
      if (isPaused()) {
        // Re-arm while paused so controls don't vanish mid-gesture.
        timer = setTimeout(tick, delayMs)
      } else {
        isControlsVisible.value = false
        timer = null
      }
    }, delayMs)
  }

  function handleActivity() {
    showAndReset()
  }

  onUnmounted(clear)

  return { isControlsVisible, handleActivity, showAndReset }
}
