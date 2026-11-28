import { onBeforeUnmount, onMounted, watch, type Ref } from 'vue'

export type TooltipDismissArgs = {
  plot: Ref<HTMLElement | undefined>
  /** The marks the reading was taken from. A new list voids the reading. */
  data: () => unknown
  close: () => void
  /**
   * Takes the hover off the plot: the emphasised mark, the axis pointer. A
   * mouse leaving does that, and a finger never leaves, so this runs when the
   * reading closes after a tap, before `close`.
   */
  clearHover?: () => void
}

/**
 * The reading sits at viewport coordinates taken from the pointer. Everything
 * here moves the page, the plot or the data under a pointer that did not move,
 * so echarts reports nothing and the reading hangs over what took its place.
 * One rule covers them all: an invalid reading goes.
 */
export function useTooltipDismiss({
  plot,
  data,
  close,
  clearHover,
}: TooltipDismissArgs) {
  // Whether the hover on the plot is a finger's, which only `clearHover` takes
  // off. It stays a finger's until a mouse moves over the plot: a finger that
  // scrolls the page from the plot hovers the marks again as it goes.
  let touched = false
  const dismiss = () => {
    if (touched) clearHover?.()
    close()
  }
  const onVisibility = () => document.hidden && dismiss()

  // A finger leaves the plot when it lifts, so a touch's leave is the end of
  // the tap that opened the reading, not a move off it. The reading stays
  // until the next touch lands somewhere else.
  const onLeave = (event: PointerEvent) => {
    if (event.pointerType === 'touch') return
    touched = false
    close()
  }
  const onMouse = (event: PointerEvent) => {
    if (event.pointerType !== 'touch') touched = false
  }
  const onTouchDown = (event: PointerEvent) => {
    if (event.pointerType !== 'touch') return
    if (plot.value?.contains(event.target as Node)) touched = true
    else dismiss()
  }

  // Capture phase, because a scroll event does not bubble: a listener on
  // `window` sees a nested container's scroll only on the way down.
  onMounted(() => {
    window.addEventListener('scroll', dismiss, { capture: true, passive: true })
    window.addEventListener('resize', dismiss)
    window.addEventListener('blur', dismiss)
    document.addEventListener('visibilitychange', onVisibility)
    document.addEventListener('pointerdown', onTouchDown, {
      capture: true,
      passive: true,
    })
  })

  onBeforeUnmount(() => {
    window.removeEventListener('scroll', dismiss, { capture: true })
    window.removeEventListener('resize', dismiss)
    window.removeEventListener('blur', dismiss)
    document.removeEventListener('visibilitychange', onVisibility)
    document.removeEventListener('pointerdown', onTouchDown, { capture: true })
  })

  // The plot arrives after the chart has mounted, and again whenever the
  // container swaps its loading, error or empty state back out for the plot.
  watch(
    plot,
    (el, previous) => {
      previous?.removeEventListener('pointerleave', onLeave)
      previous?.removeEventListener('pointermove', onMouse)
      el?.addEventListener('pointerleave', onLeave)
      el?.addEventListener('pointermove', onMouse)
    },
    { immediate: true },
  )

  watch(data, dismiss)
}
