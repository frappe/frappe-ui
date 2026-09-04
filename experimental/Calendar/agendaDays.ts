import { getWeekendDays, parseDate } from './calendarUtils'
import { eventsOn } from './eventSpan'
import type { CalendarEvent } from './types'

/** Whatever names the weekend — the view hands it the whole config. */
type WeekendConfig = Parameters<typeof getWeekendDays>[0]

/**
 * The Agenda view is three months as a list of days.
 *
 * Two things make it a list rather than a grid. A day with nothing on it is not
 * listed at all — an empty row says nothing a reader cannot see from the dates
 * either side of it — and the month under way starts at today, because a list
 * of what is coming has no use for the days already spent.
 *
 * Three months rather than the one it started as: a single month is 31 days on
 * the 1st and one day on the 31st, and the day it is least worth asking what is
 * coming is the day the answer is mostly next month. The window rolls a month
 * at a time, so each step keeps two thirds of what you were just reading.
 */

/** Months the list covers, the anchor's own month included. */
export const AGENDA_MONTHS = 3

export interface AgendaRow {
  /** The day this row is headed by. */
  date: Date
  /** `date` as `YYYY-MM-DD`. */
  key: string
  /** Everything occupying the day, spans included; never empty. */
  events: CalendarEvent[]
  /**
   * The first row of its month. The window spans three, and a list that runs
   * 24, 1, 8 with nothing between them has crossed one without saying so.
   */
  opensMonth: boolean
  isToday: boolean
  isWeekend: boolean
}

/**
 * The span the view lists: the anchor's month and the two after it, ending on
 * the last day of the third. The month already under way starts at today
 * instead of its 1st; any other month runs whole, a past one included, which
 * reads as a plain record of it.
 *
 * `Calendar` reports this same span as its visible range, so a consumer's fetch
 * window and its `+ Event` anchor agree with what is on screen. That is why it
 * lives here rather than inside the view.
 */
export function agendaRange(
  anchor: Date,
  today: Date = new Date(),
): { start: Date; end: Date } {
  const year = anchor.getFullYear()
  const month = anchor.getMonth()
  const underWay = today.getFullYear() === year && today.getMonth() === month

  return {
    start: new Date(year, month, underWay ? today.getDate() : 1),
    // Day 0 of the month after the last is that last month's final day.
    end: new Date(year, month + AGENDA_MONTHS, 0),
  }
}

/**
 * The rows the list draws — one per day that has something on it. `today` is
 * injectable so the view can be tested at a fixed date, and so a re-render at
 * midnight moves which row is marked.
 */
export function agendaRows(
  events: CalendarEvent[],
  anchor: Date,
  config?: WeekendConfig,
  today: Date = new Date(),
): AgendaRow[] {
  const { start, end } = agendaRange(anchor, today)
  const todayKey = parseDate(today)
  const weekendDays = getWeekendDays(config)
  const rows: AgendaRow[] = []

  // Walked date by date rather than by day-of-month: the window spans three
  // months of differing lengths, and `Date` rolls each end over for us.
  for (
    let date = start;
    date <= end;
    date = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)
  ) {
    const onThisDay = eventsOn(events, date)
    if (!onThisDay.length) continue

    const key = parseDate(date)
    const previous = rows[rows.length - 1]
    rows.push({
      date,
      key,
      events: onThisDay,
      opensMonth: !previous || previous.date.getMonth() !== date.getMonth(),
      isToday: key === todayKey,
      isWeekend: weekendDays.includes(date.getDay()),
    })
  }

  return rows
}
