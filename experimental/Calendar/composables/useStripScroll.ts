import {
  nextTick,
  onBeforeUpdate,
  onScopeDispose,
  onUpdated,
  ref,
  watch,
  type Ref,
} from 'vue'
import { parseDate } from '../calendarUtils'

/**
 * Keeps a scrolling strip of dated rows in step with the calendar's
 * navigation.
 *
 * Rows carry `data-strip-date`, their first day as `YYYY-MM-DD`. When the
 * calendar's date changes — the arrows, Today, the month picker — the strip
 * scrolls to the row holding the new `target`. Whenever the rows re-render
 * (the strip's window moving with the month, or events arriving), the row
 * that was at the top stays where it was. Scrolling itself changes nothing
 * in the calendar; it only reports which row is at the top.
 */
export function useStripScroll(
  scroller: Ref<HTMLElement | null>,
  opts: {
    /** The date to scroll to when navigation changes it. */
    target: () => Date | undefined
    /** A second date that jumps the strip whenever it is set, even to the same day. */
    jump?: () => Date | undefined
  },
) {
  /** First day of the row at the top of the viewport. */
  const topDate = ref<string>()

  let anchor: { date: string; offset: number } | null = null

  const rows = () =>
    Array.from(
      scroller.value?.querySelectorAll<HTMLElement>('[data-strip-date]') ?? [],
    )

  function topRow(): HTMLElement | undefined {
    const el = scroller.value
    if (!el) return
    const top = el.scrollTop + 1
    return rows().find((row) => row.offsetTop + row.offsetHeight > top)
  }

  /**
   * The row holding `date`: the first that starts on it, or else the last
   * that starts before it.
   */
  function rowFor(date: string): HTMLElement | undefined {
    let found: HTMLElement | undefined
    for (const row of rows()) {
      const start = row.dataset.stripDate!
      if (start === date) return row
      if (start < date) found = row
      else break
    }
    return found
  }

  function scrollToDate(date: Date | string) {
    const row = rowFor(parseDate(date))
    const el = scroller.value
    if (row && el) el.scrollTop = row.offsetTop
  }

  let frame = 0
  function onScroll() {
    if (frame) return
    frame = requestAnimationFrame(() => {
      frame = 0
      topDate.value = topRow()?.dataset.stripDate
    })
  }

  onBeforeUpdate(() => {
    const el = scroller.value
    const row = topRow()
    if (!el || !row) return
    anchor = {
      date: row.dataset.stripDate!,
      offset: row.offsetTop - el.scrollTop,
    }
  })

  onUpdated(() => {
    const el = scroller.value
    if (!el || !anchor) return
    const row =
      rows().find((r) => r.dataset.stripDate === anchor!.date) ??
      rowFor(anchor.date)
    if (row) el.scrollTop = row.offsetTop - anchor.offset
    anchor = null
  })

  async function follow(date?: Date) {
    if (!date) return
    await nextTick()
    scrollToDate(date)
  }

  watch(() => opts.target(), follow)
  if (opts.jump) watch(() => opts.jump!(), follow)

  // The scroller may not exist at mount — the narrow layout has none — and
  // appear later when the viewport widens, so it is watched rather than read
  // once.
  watch(
    scroller,
    (el, previous) => {
      previous?.removeEventListener('scroll', onScroll)
      if (!el) return
      el.addEventListener('scroll', onScroll, { passive: true })
      scrollToDate(opts.target() ?? new Date())
      topDate.value = topRow()?.dataset.stripDate
    },
    { immediate: true, flush: 'post' },
  )

  onScopeDispose(() => {
    scroller.value?.removeEventListener('scroll', onScroll)
    if (frame) cancelAnimationFrame(frame)
  })

  return { topDate, scrollToDate }
}
