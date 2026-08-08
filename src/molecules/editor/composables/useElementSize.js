import { onMounted, onUnmounted, ref, watch } from 'vue';
/**
 * Track the `offsetWidth` / `offsetHeight` of a reactive element ref via a
 * single `ResizeObserver`.
 *
 * The observer is created once and disconnected in a TOP-LEVEL `onUnmounted`
 * (never inside a `watch` callback, which would re-register a new disconnect
 * hook on every target change and leak). A `watch` only re-targets the existing
 * observer when the element ref swaps.
 */
export function useElementSize(target) {
    const width = ref(0);
    const height = ref(0);
    const observer = new ResizeObserver(() => {
        const el = target.value;
        if (el) {
            width.value = el.offsetWidth;
            height.value = el.offsetHeight;
        }
    });
    function observe(el) {
        observer.disconnect();
        if (el) {
            observer.observe(el);
            width.value = el.offsetWidth;
            height.value = el.offsetHeight;
        }
        else {
            width.value = 0;
            height.value = 0;
        }
    }
    onMounted(() => observe(target.value));
    watch(target, (el) => observe(el));
    onUnmounted(() => observer.disconnect());
    return { width, height };
}
