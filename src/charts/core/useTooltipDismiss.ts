import { onBeforeUnmount, onMounted, watch, type Ref } from 'vue'

export type TooltipDismissArgs = {
  plot: Ref<HTMLElement | undefined>
  /** The marks the reading was taken from. A new list voids the reading. */
  data: () => unknown
  close: () => void
}

/**
 * The reading sits at viewport coordinates taken from the pointer. Everything
 * here moves the page, the plot or the data under a pointer that did not move,
 * so echarts reports nothing and the reading hangs over what took its place.
 * One rule covers them all: an invalid reading goes.
 */
export function useTooltipDismiss({ plot, data, close }: TooltipDismissArgs) {
  const dismiss = () => close()
  const onVisibility = () => document.hidden && close()

  // Capture phase, because a scroll event does not bubble: a listener on
  // `window` sees a nested container's scroll only on the way down.
  onMounted(() => {
    window.addEventListener('scroll', dismiss, { capture: true, passive: true })
    window.addEventListener('resize', dismiss)
    window.addEventListener('blur', dismiss)
    document.addEventListener('visibilitychange', onVisibility)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('scroll', dismiss, { capture: true })
    window.removeEventListener('resize', dismiss)
    window.removeEventListener('blur', dismiss)
    document.removeEventListener('visibilitychange', onVisibility)
  })

  // The plot arrives after the chart has mounted, and again whenever the
  // container swaps its loading, error or empty state back out for the plot.
  watch(
    plot,
    (el, previous) => {
      previous?.removeEventListener('pointerleave', dismiss)
      el?.addEventListener('pointerleave', dismiss)
    },
    { immediate: true },
  )

  watch(data, dismiss)
}
