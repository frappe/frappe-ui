import { monthList } from './calendarUtils'

/**
 * The Month view is a strip of week rows, each as tall as it needs to be.
 * These helpers describe that strip: which weeks make up a month and what a
 * row is called. Which events land on a day is not strip geometry — that lives
 * in `eventSpan`, with the rest of the "where does an event sit" questions.
 */

function addDays(date: Date, days: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days)
}

/**
 * The first day of the week holding `date`. `firstDay` is that weekday's
 * index, `0` for Sunday.
 */
export function weekStart(date: Date, firstDay = 0): Date {
  return addDays(date, -((date.getDay() - firstDay + 7) % 7))
}

/**
 * The week rows of a month: seven dates each, from the week holding the first
 * of the month to the week holding its last day.
 */
export function stripWeeks(
  month: number,
  year: number,
  firstDay = 0,
): Date[][] {
  const first = weekStart(new Date(year, month, 1), firstDay)
  const last = weekStart(new Date(year, month + 1, 0), firstDay)
  const weeks: Date[][] = []
  for (let d = first; d <= last; d = addDays(d, 7)) {
    weeks.push(Array.from({ length: 7 }, (_, i) => addDays(d, i)))
  }
  return weeks
}

/** First and last day the strip of a month shows, padding days included. */
export function stripRange(month: number, year: number, firstDay = 0) {
  const weeks = stripWeeks(month, year, firstDay)
  const lastWeek = weeks[weeks.length - 1]!
  return { start: weeks[0]![0]!, end: lastWeek[lastWeek.length - 1]! }
}

export function shortMonth(date: Date): string {
  return monthList[date.getMonth()]!.slice(0, 3)
}
