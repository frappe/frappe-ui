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

/** The Sunday that starts the week holding `date`. */
export function weekStart(date: Date): Date {
  return addDays(date, -date.getDay())
}

/**
 * The week rows of a month: seven dates each, Sunday to Saturday, from the
 * week holding the first of the month to the week holding its last day.
 */
export function stripWeeks(month: number, year: number): Date[][] {
  const first = weekStart(new Date(year, month, 1))
  const last = weekStart(new Date(year, month + 1, 0))
  const weeks: Date[][] = []
  for (let d = first; d <= last; d = addDays(d, 7)) {
    weeks.push(Array.from({ length: 7 }, (_, i) => addDays(d, i)))
  }
  return weeks
}

/** First and last day the strip of a month shows, padding days included. */
export function stripRange(month: number, year: number) {
  const weeks = stripWeeks(month, year)
  const lastWeek = weeks[weeks.length - 1]!
  return { start: weeks[0]![0]!, end: lastWeek[lastWeek.length - 1]! }
}

export function shortMonth(date: Date): string {
  return monthList[date.getMonth()]!.slice(0, 3)
}
