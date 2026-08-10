import { computed, ref, watch, type ComputedRef, type Ref } from 'vue'

export type PlotKeyboardArgs<T> = {
  /**
   * The marks the plot draws right now, in the order the arrows walk them.
   * None, and there is no tab stop. The list is what the cursor follows: a new
   * one, and the mark under the cursor is read again, so a plot that redraws
   * under a reader does not leave an old value standing.
   */
  marks: () => readonly T[]
  /**
   * What names a mark across a redraw: its place in the data, as a value — the
   * category on the axis, the pair of categories on a cell. A value rather than
   * the row object, because a refetch answers with rows that are equal and not
   * the same, and the cursor has to survive that as much as a re-sort.
   *
   * The cursor holds the name and looks for it again, so a plot that filters,
   * sorts or grows keeps the reader on the mark they were on. A name that is
   * gone falls back to the slot, which is read out like any other move.
   *
   * Return a string or a number. Names are compared with `===`, so a Date or
   * any other object would only ever match itself and never survive a refetch.
   */
  key: (mark: T) => string | number | undefined
  /**
   * Puts the cursor on a mark: highlight it, open its tooltip, read it out.
   * `previous` is the mark the cursor came off, for the plot to downplay, and
   * is null when the cursor lands from outside.
   */
  move: (index: number, previous: number | null) => void
  /** Enter or Space on the mark under the cursor, i.e. the click event. */
  activate: (index: number) => void
  /**
   * The cursor left the plot, or Escape dismissed it. `previous` is the mark it
   * was on, which the index no longer holds by the time this runs.
   */
  clear: (previous: number | null) => void
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
  /**
   * Puts the cursor on a mark, for a chart that works out its own target — a
   * grid walking a column, say. Clamped to the marks that exist.
   */
  goTo: (index: number) => void
  /**
   * Reads the mark under the cursor again, for state the mark list does not
   * carry — which series a legend has hidden, say. No cursor, nothing to do.
   */
  refresh: () => void
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
export function usePlotKeyboard<T>(
  args: PlotKeyboardArgs<T>,
): PlotKeyboardReturn {
  const index = ref<number | null>(null)

  // A press on the plot focuses it too. Landing the cursor on the first mark
  // there would pull the tooltip off the mark under the pointer, so a focus
  // that a pointer caused is left alone.
  let fromPointer = false

  const marks = computed(() => args.marks())
  const count = computed(() => marks.value.length)

  // What the cursor is on, as the plot names it. Kept beside the index so a
  // redraw can put the cursor back on the same mark, wherever it has moved to.
  let held: string | number | undefined

  const keyOf = (mark: T) => args.key(mark)

  /**
   * Where the held mark is now: the match nearest the slot it was in. Nearest
   * rather than first, because a name is not always unique — two rows can carry
   * the same category — and the one beside the old slot is the one the reader
   * was on. -1 when the name has gone.
   */
  function findHeld(from: number) {
    if (held === undefined) return -1
    let at = -1
    let gap = Infinity
    marks.value.forEach((mark, i) => {
      if (keyOf(mark) !== held) return
      if (Math.abs(i - from) >= gap) return
      at = i
      gap = Math.abs(i - from)
    })
    return at
  }

  function place(next: number) {
    const previous = index.value
    index.value = next
    held = keyOf(marks.value[next])
    args.move(next, previous)
  }

  function step(delta: number) {
    if (!count.value) return
    const from = index.value ?? (delta > 0 ? -1 : count.value)
    place(Math.min(count.value - 1, Math.max(0, from + delta)))
  }

  function goTo(next: number) {
    if (!count.value) return
    place(Math.min(count.value - 1, Math.max(0, next)))
  }

  /**
   * The perpendicular arrows. With no cursor there is no mark to cross from —
   * after Escape, say — so they step like the other keys rather than crossing
   * from nothing, and one key answers the same whether the chart crosses.
   */
  function cross(delta: number) {
    if (!args.cross || index.value === null) return step(delta)
    args.cross(delta)
  }

  function refresh() {
    if (index.value === null) return
    if (!count.value) return leave()
    // The same mark first, wherever the redraw has put it. Gone, and the cursor
    // holds its place in the order instead.
    const found = findHeld(index.value)
    goTo(found >= 0 ? found : index.value)
  }

  function leave() {
    const previous = index.value
    index.value = null
    held = undefined
    fromPointer = false
    args.clear(previous)
  }

  // The plot redraws under a reader who is still on it: new data, or a legend
  // toggle. The cursor follows the marks that remain and reads its own again,
  // rather than pointing past the end or announcing a value that has gone.
  // After the render, so the plot it points at is the one on screen.
  watch(marks, refresh, { flush: 'post' })

  function onKeydown(event: KeyboardEvent) {
    if (!count.value) return
    // A held modifier makes the key someone else's: Alt or Cmd with an arrow is
    // browser back, Ctrl with Home or End is the top or the bottom of the page.
    if (event.ctrlKey || event.metaKey || event.altKey) return

    switch (event.key) {
      case 'ArrowRight':
        step(1)
        break
      case 'ArrowLeft':
        step(-1)
        break
      case 'ArrowDown':
        cross(1)
        break
      case 'ArrowUp':
        cross(-1)
        break
      case 'Home':
        goTo(0)
        break
      case 'End':
        goTo(count.value - 1)
        break
      case 'Enter':
      case ' ':
        if (index.value === null) step(1)
        else args.activate(index.value)
        break
      // With no cursor there is nothing to dismiss, and the key belongs to
      // whatever is around the plot — a dialog closes on the Escape that a
      // prevented event would otherwise swallow.
      case 'Escape':
        if (index.value === null) return
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
    tabindex: count.value ? 0 : undefined,
    onKeydown,
    onPointerdown: () => {
      fromPointer = true
    },
    onPointerup: () => {
      fromPointer = false
    },
    // Landing on the plot puts the cursor on the first mark, so the first
    // arrow press moves rather than announcing what focus already did.
    onFocus: () => {
      const pointer = fromPointer
      fromPointer = false
      if (!pointer && index.value === null) step(1)
    },
    onBlur: leave,
  }))

  return { index, goTo, refresh, attrs }
}
