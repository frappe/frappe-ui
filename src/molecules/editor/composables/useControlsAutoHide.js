import { onUnmounted, ref } from 'vue';
/**
 * Auto-hiding overlay controls.
 *
 * Controls become visible on activity and hide after `delayMs` of inactivity,
 * unless `isPaused()` is `true` (in which case the timer re-arms). The single
 * timer is always cleared on unmount, so no stray timeout leaks across the
 * modal's open/close lifecycle.
 */
export function useControlsAutoHide(opts = {}) {
    const delayMs = opts.delayMs ?? 3000;
    const isPaused = opts.isPaused ?? (() => false);
    const isControlsVisible = ref(true);
    let timer = null;
    function clear() {
        if (timer !== null) {
            clearTimeout(timer);
            timer = null;
        }
    }
    function showAndReset() {
        isControlsVisible.value = true;
        clear();
        timer = setTimeout(function tick() {
            if (isPaused()) {
                // Re-arm while paused so controls don't vanish mid-gesture.
                timer = setTimeout(tick, delayMs);
            }
            else {
                isControlsVisible.value = false;
                timer = null;
            }
        }, delayMs);
    }
    function handleActivity() {
        showAndReset();
    }
    onUnmounted(clear);
    return { isControlsVisible, handleActivity, showAndReset };
}
