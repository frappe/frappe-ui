import { dayjs, dayjsLocal } from '../../utils/dayjs'
import type { Dayjs } from 'dayjs/esm'
import type { CalendarPanelCell, DatePickerDateObj as DateObj } from './types'

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
 * Build a weeks grid decorated for a range selection. While the end date is
 * still open, `preview` (the hovered or keyboard-focused date) stands in for
 * it, so the cells between the start and the preview read as in-range without
 * getting the committed-endpoint treatment.
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

/**
 * Apply one endpoint click to a range, the way a calendar cell click does: the
 * first click opens a range, the second closes it, and a click on a settled
 * range starts a new one. Endpoints come back in order, so picking the end
 * before the start reads the same as picking them the other way round.
 */
export function stepRange(
  range: [string, string],
  date: Dayjs,
): [string, string] {
  const [from, to] = range
  const value = date.format('YYYY-MM-DD')
  if (!from || to) return [value, '']
  return from <= value ? [from, value] : [value, from]
}
