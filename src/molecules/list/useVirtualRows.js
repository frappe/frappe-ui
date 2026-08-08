import { computed, ref, toValue, watchEffect, } from 'vue';
import { useEventListener, useVirtualList } from '@vueuse/core';
/**
 * Windowing for list rows whose scroll container is an ancestor the app owns
 * (a settings body, the page itself) rather than an element the virtualizer
 * renders. Wraps vueuse's useVirtualList: points its container ref at the
 * discovered ancestor and forwards that element's scroll events, so the
 * app keeps its own scroll container and styled scrollbar.
 *
 * Bind `anchor` to the element wrapping the windowed rows (`wrapperProps`
 * carries the height/offset styles vueuse computes for it).
 */
export function useVirtualRows(items, options) {
    const source = computed(() => toValue(items));
    const { list, containerProps, wrapperProps } = useVirtualList(source, {
        itemHeight: () => toValue(options.itemHeight),
        overscan: options.overscan ?? 6,
    });
    const anchor = ref(null);
    watchEffect(() => {
        if (!toValue(options.enabled ?? true)) {
            containerProps.ref.value = null;
            return;
        }
        const explicit = toValue(options.scrollContainer);
        containerProps.ref.value = explicit ?? findScrollContainer(anchor.value);
    });
    useEventListener(() => (toValue(options.enabled ?? true) ? containerProps.ref.value : null), 'scroll', () => containerProps.onScroll());
    return { rows: list, wrapperProps, anchor };
}
function findScrollContainer(el) {
    let node = el?.parentElement ?? null;
    while (node) {
        const { overflowY } = getComputedStyle(node);
        if (overflowY === 'auto' ||
            overflowY === 'scroll' ||
            overflowY === 'overlay') {
            return node;
        }
        node = node.parentElement;
    }
    return null;
}
