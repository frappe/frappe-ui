import { type ObjectDirective, type DirectiveBinding, nextTick } from 'vue'

interface FocusDirective extends ObjectDirective<HTMLElement> {
  mounted(el: HTMLElement, binding: DirectiveBinding<boolean>): void
}

/**
 * Focuses the first focusable descendant on mount. `v-focus:autoselect` also
 * selects the text of an input or textarea.
 *
 * Named `vFocus` because `<script setup>` auto-registers only `vFoo`-shaped
 * bindings — anything else has to be aliased by hand at every call site.
 */
export const vFocus: FocusDirective = {
  async mounted(el, binding) {
    if (binding.value === false) {
      return
    }
    const firstFocusableElement = getFirstFocusableElement(el)
    if (firstFocusableElement) {
      await nextTick()
      firstFocusableElement.focus()
      if (
        binding.arg === 'autoselect' &&
        (firstFocusableElement instanceof HTMLInputElement ||
          firstFocusableElement instanceof HTMLTextAreaElement)
      ) {
        firstFocusableElement.select()
      }
    } else {
      await nextTick()
      ;(document.activeElement as HTMLElement | null)?.blur()
    }
  },
}

function getFirstFocusableElement(parent: HTMLElement): HTMLElement | null {
  if (!parent) {
    return null
  }
  const focusableSelector =
    'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

  if (parent.matches(focusableSelector)) {
    return parent
  }

  const focusableElements =
    parent.querySelectorAll<HTMLElement>(focusableSelector)
  return focusableElements.length > 0 ? focusableElements[0] : null
}
