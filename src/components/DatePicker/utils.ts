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

/** Text that starts like an ISO date (`2026-11-03`), which a loose parse reads right. */
export const ISO_DATE = /^\d{4}-\d{1,2}-\d{1,2}/

const typedFormatCache = new Map<string, string[]>()

/**
 * The formats a person may type a date in under a display `format`, in its
 * day-month-year order: a day, month or hour with no leading zero, a two-digit
 * year, `-`, `/` or `.` between the date parts, no seconds, or no time.
 * `DD-MM-YYYY HH:mm:ss` takes `3/11/26 9:15` and `03-11-2026`.
 */
export function typedFormats(format: string): string[] {
  const cached = typedFormatCache.get(format)
  if (cached) return cached
  let formats = [format]
  const vary = (change: (f: string) => string) => {
    formats = [...new Set(formats.flatMap((f) => [f, change(f)]))]
  }
  vary((f) => f.replace(/(?<!D)DD(?!D)/, 'D'))
  vary((f) => f.replace(/(?<!M)MM(?!M)/, 'M'))
  vary((f) => f.replace(/(?<!Y)YYYY(?!Y)/, 'YY'))
  vary((f) => f.replace(/(?<![Hh])(HH|hh)(?![Hh])/, (t) => t[0]))
  vary((f) => f.replace(/:ss/, ''))
  vary((f) => f.replace(/\s+[Hh].*$/, ''))
  for (const separator of ['-', '/', '.']) {
    vary((f) => f.replace(/(?<=[DMY])[-/.](?=[DMY])/g, separator))
  }
  typedFormatCache.set(format, formats)
  return formats
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
