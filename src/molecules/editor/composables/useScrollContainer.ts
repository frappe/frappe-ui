import { onMounted, nextTick, ref, type Ref } from 'vue'

const DEFAULT_SELECTOR = '#editor-scroll-container'

/**
 * Lazily resolve the editor scroll container.
 *
 * The container is queried in `onMounted` / `nextTick` (NOT at module top level,
 * which the legacy view did — capturing `null` before the DOM existed and never
 * re-querying). If the first lookup misses, it is retried on demand via the
 * exposed ref getter pattern.
 *
 * @returns A ref to the resolved container element (or `null` until found).
 */
export function useScrollContainer(
  selector: string = DEFAULT_SELECTOR,
): Ref<HTMLElement | null> {
  const container = ref<HTMLElement | null>(null)

  const resolve = () => {
    if (container.value && container.value.isConnected) return
    container.value = document.querySelector<HTMLElement>(selector)
  }

  onMounted(() => {
    resolve()
    if (!container.value) {
      // The container can mount after this node view; retry on the next tick.
      nextTick(resolve)
    }
  })

  return container
}
