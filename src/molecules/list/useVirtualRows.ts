import { computed, ref, toValue, watchEffect, type MaybeRefOrGetter } from 'vue'
import { useElementSize, useEventListener } from '@vueuse/core'

export interface UseVirtualRowsOptions {
  /** Enables DOM scroll-container lookup and scroll listener registration. */
  enabled?: MaybeRefOrGetter<boolean>

  /** Row height in px. */
  rowHeight: MaybeRefOrGetter<number>

  /** Rows rendered beyond the visible window on each side. */
  overscan?: MaybeRefOrGetter<number>

  /** Explicit scroll container. Defaults to the nearest scrollable ancestor of `anchor`. */
  scrollContainer?: MaybeRefOrGetter<HTMLElement | null | undefined>
}

/**
 * Windowing for list rows whose scroll container is an ancestor the app owns
 * (a settings body, the page itself) rather than an element the virtualizer
 * renders. The app keeps its own scroll container and styled scrollbar.
 *
 * Bind `anchor` to the element wrapping the windowed rows (`wrapperProps`
 * carries the height/offset styles vueuse computes for it).
 */
export function useVirtualRows<T>(
  items: MaybeRefOrGetter<T[]>,
  options: UseVirtualRowsOptions,
) {
  const source = computed(() => toValue(items))
  const anchor = ref<HTMLElement | null>(null)
  const container = ref<HTMLElement | null>(null)
  const scrollTop = ref(0)
  const { height: viewportHeight } = useElementSize(container)

  watchEffect(() => {
    if (!toValue(options.enabled ?? true)) {
      container.value = null
      scrollTop.value = 0
      return
    }
    const explicit = toValue(options.scrollContainer)
    container.value = explicit ?? findScrollContainer(anchor.value)
    scrollTop.value = container.value?.scrollTop ?? 0
  })
  useEventListener(
    () => (toValue(options.enabled ?? true) ? container.value : null),
    'scroll',
    () => (scrollTop.value = container.value?.scrollTop ?? 0),
  )

  const range = computed(() => {
    const rowHeight = Math.max(1, toValue(options.rowHeight))
    const overscan = Math.max(0, Math.floor(toValue(options.overscan ?? 6)))
    const offset = Math.floor(scrollTop.value / rowHeight) + 1
    const capacity = Math.ceil(viewportHeight.value / rowHeight)
    const start = Math.max(0, offset - overscan)
    const end = Math.min(source.value.length, offset + capacity + overscan)
    return { start, end, rowHeight }
  })

  const rows = computed(() =>
    source.value
      .slice(range.value.start, range.value.end)
      .map((data, index) => ({ data, index: index + range.value.start })),
  )

  const wrapperProps = computed(() => {
    const offset = range.value.start * range.value.rowHeight
    const total = source.value.length * range.value.rowHeight
    return {
      style: {
        width: '100%',
        height: `${total - offset}px`,
        marginTop: `${offset}px`,
      },
    }
  })

  return { rows, wrapperProps, anchor }
}

function findScrollContainer(el: HTMLElement | null): HTMLElement | null {
  let node = el?.parentElement ?? null
  while (node) {
    const { overflowY } = getComputedStyle(node)
    if (
      overflowY === 'auto' ||
      overflowY === 'scroll' ||
      overflowY === 'overlay'
    ) {
      return node
    }
    node = node.parentElement
  }
  return null
}
