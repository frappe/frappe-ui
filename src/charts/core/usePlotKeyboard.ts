import { computed, ref, type ComputedRef, type Ref } from 'vue'

export type PlotKeyboardArgs = {
  /** How many marks the plot draws right now. None, and there is no tab stop. */
  count: () => number
  /** Puts the cursor on a mark: highlight it, open its tooltip, read it out. */
  move: (index: number) => void
  /** Enter or Space on the mark under the cursor, i.e. the click event. */
  activate: (index: number) => void
  /** The cursor left the plot, or Escape dismissed it. */
  clear: () => void
  /**
   * The perpendicular arrows, where the chart has a second dimension to walk —
   * the series inside a category. Left out, they step the cursor like the
   * others, so a plot with one dimension answers to all four keys.
   */
  cross?: (delta: number) => void
}

export type PlotKeyboardReturn = {
  /** Mark under the cursor, or null while the plot is not being walked. */
  index: Ref<number | null>
  /** `v-bind` this onto the plot element. */
  attrs: ComputedRef<Record<string, unknown>>
}

/**
 * A keyboard path to the marks of an echarts plot.
 *
 * echarts draws into one element, so there are no per-mark DOM nodes to tab
 * through — `FunnelChart`, which draws its own HTML, has those. The plot takes
 * one tab stop instead and the arrow keys walk a cursor along it, which is also
 * what keeps a 400-point scatter from becoming 400 tab stops. Enter and Space
 * fire the same event a click does, so nothing is reachable by mouse alone.
 */
export function usePlotKeyboard(args: PlotKeyboardArgs): PlotKeyboardReturn {
  const index = ref<number | null>(null)

  function step(delta: number) {
    const count = args.count()
    if (!count) return
    const from = index.value ?? (delta > 0 ? -1 : count)
    const next = Math.min(count - 1, Math.max(0, from + delta))
    index.value = next
    args.move(next)
  }

  function goTo(next: number) {
    if (!args.count()) return
    index.value = next
    args.move(next)
  }

  function leave() {
    index.value = null
    args.clear()
  }

  function onKeydown(event: KeyboardEvent) {
    if (!args.count()) return

    switch (event.key) {
      case 'ArrowRight':
        step(1)
        break
      case 'ArrowLeft':
        step(-1)
        break
      case 'ArrowDown':
        args.cross ? args.cross(1) : step(1)
        break
      case 'ArrowUp':
        args.cross ? args.cross(-1) : step(-1)
        break
      case 'Home':
        goTo(0)
        break
      case 'End':
        goTo(args.count() - 1)
        break
      case 'Enter':
      case ' ':
        if (index.value === null) step(1)
        else args.activate(index.value)
        break
      case 'Escape':
        leave()
        break
      default:
        return
    }
    // Only for a key the plot answered: Tab and everything else stays the
    // browser's, so the plot is never a focus trap.
    event.preventDefault()
  }

  const attrs = computed(() => ({
    // No marks, nothing to walk: an empty or failed plot drops out of the tab
    // order rather than taking a stop that does nothing.
    tabindex: args.count() ? 0 : undefined,
    onKeydown,
    // Landing on the plot puts the cursor on the first mark, so the first
    // arrow press moves rather than announcing what focus already did.
    onFocus: () => {
      if (index.value === null) step(1)
    },
    onBlur: leave,
  }))

  return { index, attrs }
}
