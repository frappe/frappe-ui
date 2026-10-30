import { dayjs, dayjsLocal } from '../../utils/dayjs'
import type { Dayjs } from 'dayjs/esm'
import type { DatePickerDateObj as DateObj, DateRangeValue } from './types'
import type { CalendarPanelCell } from './calendarTypes'

// Constant list of month labels
export const months: string[] = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

// Start of given month (0-indexed month)
export function monthStart(year: number, monthIndex: number): Dayjs {
  return dayjs(`${year}-${monthIndex + 1}-01`)
}

// Build weeks grid for the calendar
export function generateWeeks(
  year: number,
  monthIndex: number,
  selected: string,
): DateObj[][] {
  // Always emit 6 rows × 7 days so the calendar height stays constant — both
  // across months in a single pane (no jiggle when navigating) and between
  // panes in dual-pane mode (where one month may span 5 weeks and the other 6).
  const start = monthStart(year, monthIndex).startOf('week')
  const days: DateObj[] = []
  let d: Dayjs = start
  const sel = dayjs(selected)
  const today = dayjsLocal().format('YYYY-MM-DD')
  for (let i = 0; i < 42; i++) {
    days.push({
      date: d,
      key: d.format('YYYY-MM-DD'),
      inMonth: d.month() === monthIndex,
      isToday: d.isSame(today, 'day'),
      isSelected: sel.isValid() && d.isSame(sel, 'day'),
    })
    d = d.add(1, 'day')
  }
  const chunked: DateObj[][] = []
  for (let i = 0; i < days.length; i += 7) chunked.push(days.slice(i, i + 7))
  return chunked
}

export function getDateValue(date: Date | string) {
  if (!date || date.toString() === 'Invalid Date') return ''

  return dayjs(date)
    .set('hour', 0)
    .set('minute', 0)
    .set('second', 0)
    .set('millisecond', 0)
    .format('YYYY-MM-DD')
}

/**
 * Build the weeks grid for a range. Until the end is picked, `preview` (the
 * hovered or focused date) stands in for it: cells between the start and the
 * preview render as in-range, not as selected.
 */
export function generateRangeWeeks(options: {
  year: number
  monthIndex: number
  from: string
  to: string
  preview?: Dayjs | null
  isUnavailable: (date: Dayjs) => boolean
}): CalendarPanelCell[][] {
  const { year, monthIndex, from, to, preview, isUnavailable } = options
  const raw = generateWeeks(year, monthIndex, '')
  const f = from ? dayjs(from) : null
  const t = to ? dayjs(to) : null
  const hovering = !t && f && preview ? preview : null
  const hoverEnd = hovering && hovering.isAfter(f!, 'day') ? hovering : null
  const hoverStart = hovering && hovering.isBefore(f!, 'day') ? hovering : null
  return raw.map((week) =>
    week.map((d) => {
      const isRangeStart = !!(f && d.date.isSame(f, 'day'))
      const isRangeEnd = !!(t && d.date.isSame(t, 'day'))
      let inRange = false
      if (f && t) {
        inRange = d.date.isAfter(f, 'day') && d.date.isBefore(t, 'day')
      } else if (hoverEnd && f) {
        inRange = d.date.isAfter(f, 'day') && !d.date.isAfter(hoverEnd, 'day')
      } else if (hoverStart && f) {
        inRange =
          !d.date.isBefore(hoverStart, 'day') && d.date.isBefore(f, 'day')
      }
      return {
        ...d,
        isSelected: false,
        isUnavailable: isUnavailable(d.date),
        isRangeStart,
        isRangeEnd,
        inRange,
      }
    }),
  )
}

/** Put a range's endpoints in order, so picking the end first gives the same result. */
export function orderRange(range: [string, string]): [string, string] {
  const [from, to] = range
  return from && to && from > to ? [to, from] : [from, to]
}

/** A range as one string, for comparing two ranges. */
export function rangeKey(range: DateRangeValue | [string, string]): string {
  return `${range[0] ?? ''},${range[1] ?? ''}`
}

/**
 * Apply one click to a range: the first click starts a range, the second
 * completes it, and a click on a completed range starts a new one.
 */
export function stepRange(
  range: [string, string],
  date: Dayjs,
): [string, string] {
  const [from, to] = range
  const value = date.format('YYYY-MM-DD')
  if (!from || to) return [value, '']
  return orderRange([from, value])
}

/**
 * Split what a user typed into a range input into its two date texts and
 * parse each one with `coerce`. The ends are separated by "to" or " - ". A
 * comma only separates them when the text is not itself one date, because a
 * date format can contain a comma ("Oct 03, 2025").
 */
export function parseRangeInput(
  raw: string,
  coerce: (text?: string | null) => Dayjs | null,
): [Dayjs | null, Dayjs | null] {
  const text = raw.trim()
  if (!text) return [null, null]
  const parts = splitRangeText(text, coerce)
  if (!parts.length) return [null, null]
  return [coerce(parts[0]), coerce(parts[1])]
}

function splitRangeText(
  text: string,
  coerce: (text?: string | null) => Dayjs | null,
): string[] {
  const toParts = (list: string[]) => list.map((p) => p.trim()).filter(Boolean)
  const byWord = toParts(text.split(/\s+to\s+/i))
  if (byWord.length > 1) return byWord
  const byDash = toParts(text.split(/\s+-\s+/))
  if (byDash.length > 1) return byDash
  if (coerce(text)) return [text]
  return toParts(text.split(','))
}
