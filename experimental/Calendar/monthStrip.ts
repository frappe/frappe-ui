import { monthList, parseDate } from './calendarUtils'
import { eventDayCount, eventDays } from './eventSpan'
import type { CalendarEvent } from './types'

/**
 * The Month view is a strip of week rows, each as tall as it needs to be.
 * These helpers describe that strip: which weeks make up a month, what a row
 * is called, and which events land where.
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

/** Whether the event covers more than one day, and so draws as a bar. */
export function isSpan(event: CalendarEvent): boolean {
  return eventDayCount(event) > 1
}

function minutes(time?: string): number {
  if (!time) return 0
  const [h, m] = time.split(':')
  return parseInt(h!) * 60 + parseInt(m || '0')
}

/** Full-day events first, then by start time, then a stable tiebreak. */
export function sortByStart(events: CalendarEvent[]): CalendarEvent[] {
  return [...events].sort((a, b) => {
    const fullA = a.isFullDay ? 0 : 1
    const fullB = b.isFullDay ? 0 : 1
    if (fullA !== fullB) return fullA - fullB
    const timeA = minutes(a.fromTime)
    const timeB = minutes(b.fromTime)
    if (timeA !== timeB) return timeA - timeB
    return String(a.id ?? '').localeCompare(String(b.id ?? ''))
  })
}

/** Single-day events that fall on `date`. */
export function dayEvents(
  events: CalendarEvent[],
  date: Date,
): CalendarEvent[] {
  const key = parseDate(date)
  return sortByStart(
    events.filter((e) => !isSpan(e) && eventDays(e).start === key),
  )
}

/** Every event that occupies `date`, spans included. */
export function eventsOn(events: CalendarEvent[], date: Date): CalendarEvent[] {
  const key = parseDate(date)
  return sortByStart(
    events.filter((e) => {
      const { start, end } = eventDays(e)
      return start <= key && key <= end
    }),
  )
}
