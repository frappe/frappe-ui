const instanceMap = new Map();
function onDocumentClick(e, el, fn) {
    const target = e.target;
    if (el !== target && !el.contains(target)) {
        fn?.(e);
    }
}
/**
 * Calls the bound handler when a click lands outside the element.
 *
 * Named `vOnOutsideClick` because `<script setup>` auto-registers only
 * `vFoo`-shaped bindings — anything else has to be aliased by hand at every
 * call site.
 */
export const vOnOutsideClick = {
    beforeMount(el, binding, vnode) {
        const fn = binding.value;
        const clickHandler = function (e) {
            onDocumentClick(e, el, fn);
        };
        removeHandlerIfPresent(el);
        instanceMap.set(el, clickHandler);
        document.addEventListener('click', clickHandler);
    },
    unmounted(el) {
        removeHandlerIfPresent(el);
    },
};
function removeHandlerIfPresent(el) {
    const clickHandler = instanceMap.get(el);
    if (!clickHandler) {
        return;
    }
    instanceMap.delete(el);
    document.removeEventListener('click', clickHandler);
}
