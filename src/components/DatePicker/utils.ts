import { dayjs, dayjsLocal } from '../../utils/dayjs'
import type { Dayjs } from 'dayjs/esm'
import type { DatePickerDateObj as DateObj } from './types'

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
