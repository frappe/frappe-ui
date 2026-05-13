import { watch, nextTick, toValue, type MaybeRefOrGetter } from 'vue'

/**
 * Focus the first `[autofocus]` descendant inside a container each time
 * `isOpen` flips to `true`.
 *
 * Why this exists, rather than relying on the browser's native `autofocus`
 * attribute or a UI library's `auto-focus-on-open` event:
 *
 * - The HTML `autofocus` algorithm runs at most **once per document**. The
 *   first time a dialog opens, the browser focuses the marked element; on
 *   subsequent opens it logs "Autofocus processing was blocked because a
 *   document already has a focused element" and does nothing.
 * - Reka UI's `FocusScope` emits `mountAutoFocus` only when
 *   `previouslyFocusedElement` is **not** inside the container. The browser
 *   autofocus on first open puts focus inside the container, which causes
 *   Reka to suppress its event — so consumers can't rely on it either.
 * - The same `FocusScope`, when `trap-focus` is on, runs a `MutationObserver`
 *   that can re-focus the container on reopens because its
 *   `lastFocusedElementRef` still points to the previous instance's element.
 *
 * Driving autofocus from app reactivity sidesteps all three: we own the
 * "focus on every open" semantic and don't fight the library or browser.
 *
 * Implementation notes:
 *
 * - We wait for `nextTick` so the new content is committed to the DOM, then
 *   one `requestAnimationFrame` so any pending microtasks (notably Reka's
 *   `MutationObserver` callback) drain first — our focus is the last word.
 * - The container lookup is scoped via `getContainer()` so nested dialogs
 *   each focus their own `[autofocus]`, not the first one in document order.
 * - If `[autofocus]` is set on a non-focusable wrapper, we walk into it and
 *   focus the first focusable descendant. Inputs and textareas also get
 *   their value selected (matches the browser's native autofocus behavior).
 *
 * @example
 * const contentRef = ref<ComponentPublicInstance | null>(null)
 * useAutofocusOnOpen(isOpen, () => contentRef.value?.$el)
 */
export function useAutofocusOnOpen(
  isOpen: MaybeRefOrGetter<boolean>,
  getContainer: () => HTMLElement | null | undefined,
) {
  watch(
    () => toValue(isOpen),
    async (open) => {
      if (!open) return
      await nextTick()
      requestAnimationFrame(() => {
        const root = getContainer()
        if (!root) return
        const marker = root.querySelector<HTMLElement>('[autofocus]')
        if (!marker) return
        const target = marker.matches(FOCUSABLE_SELECTOR)
          ? marker
          : marker.querySelector<HTMLElement>(FOCUSABLE_SELECTOR)
        if (!target) return
        target.focus()
        if (
          target instanceof HTMLInputElement ||
          target instanceof HTMLTextAreaElement
        ) {
          try {
            target.select()
          } catch {}
        }
      })
    },
    { immediate: true },
  )
}

const FOCUSABLE_SELECTOR = [
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'button:not([disabled])',
  'a[href]',
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable="true"]',
  '[contenteditable=""]',
].join(',')
