import { nextTick } from 'vue';
/**
 * Focuses the first focusable descendant on mount. `v-focus:autoselect` also
 * selects the text of an input or textarea.
 *
 * Named `vFocus` because `<script setup>` auto-registers only `vFoo`-shaped
 * bindings — anything else has to be aliased by hand at every call site.
 */
export const vFocus = {
    async mounted(el, binding) {
        if (binding.value === false) {
            return;
        }
        const firstFocusableElement = getFirstFocusableElement(el);
        if (firstFocusableElement) {
            await nextTick();
            firstFocusableElement.focus();
            if (binding.arg === 'autoselect' &&
                (firstFocusableElement instanceof HTMLInputElement ||
                    firstFocusableElement instanceof HTMLTextAreaElement)) {
                firstFocusableElement.select();
            }
        }
        else {
            await nextTick();
            document.activeElement?.blur();
        }
    },
};
function getFirstFocusableElement(parent) {
    if (!parent) {
        return null;
    }
    const focusableSelector = 'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
    if (parent.matches(focusableSelector)) {
        return parent;
    }
    const focusableElements = parent.querySelectorAll(focusableSelector);
    return focusableElements.length > 0 ? focusableElements[0] : null;
}
