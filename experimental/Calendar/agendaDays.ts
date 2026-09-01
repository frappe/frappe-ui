import { getWeekendDays, parseDate } from './calendarUtils'
import { eventsOn } from './eventSpan'
import type { CalendarEvent } from './types'

/** Whatever names the weekend — the view hands it the whole config. */
type WeekendConfig = Parameters<typeof getWeekendDays>[0]

/**
 * The Agenda view is the month as a list of days.
 *
 * Two things make it a list rather than a grid. Days with nothing on them
 * collapse into their neighbours — a quiet weekend is one line, not two empty
 * ones — and the current month starts at today rather than at the 1st, because
 * a list of what is coming has no use for the days already spent.
 */

export interface AgendaRow {
  /** The day this row is headed by. */
  date: Date
  /** `date` as `YYYY-MM-DD`. */
  key: string
  /** Everything occupying the day, spans included; empty on a collapsed run. */
  events: CalendarEvent[]
  /**
   * Set only on a row standing in for days with nothing on them: the last day
   * of the run. Equal to `date` when the run is a single day.
   */
  emptyThrough?: Date
  isToday: boolean
  isWeekend: boolean
}

/**
 * The span the view lists: the anchor month, but starting at today when the
 * anchor is the month already under way — a list of what is coming has no use
 * for the days already spent. Any other month runs whole, a past one included,
 * which reads as a plain record of it.
 *
 * `Calendar` reports this same span as its visible range, so a consumer's fetch
 * window and its `+ Event` anchor agree with what is on screen. That is why it
 * lives here rather than inside the view.
 */
export function agendaRange(
  month: number,
  year: number,
  today: Date = new Date(),
): { start: Date; end: Date } {
  const underWay = today.getFullYear() === year && today.getMonth() === month
  return {
    start: new Date(year, month, underWay ? today.getDate() : 1),
    end: new Date(year, month + 1, 0),
  }
}

/**
 * The rows of one month. `today` is injectable so the view can be tested at a
 * fixed date, and so a re-render at midnight moves the boundary.
 */
export function agendaRows(
  events: CalendarEvent[],
  month: number,
  year: number,
  config?: WeekendConfig,
  today: Date = new Date(),
): AgendaRow[] {
  const { start, end } = agendaRange(month, year, today)
  const todayKey = parseDate(today)
  const weekendDays = getWeekendDays(config)
  const rows: AgendaRow[] = []

  for (let day = start.getDate(); day <= end.getDate(); day++) {
    const date = new Date(year, month, day)
    const key = parseDate(date)
    const onThisDay = eventsOn(events, date)

    // A run of empty days extends the row that opened it rather than adding
    // one of its own.
    const previous = rows[rows.length - 1]
    if (!onThisDay.length && previous && !previous.events.length) {
      previous.emptyThrough = date
      continue
    }

    rows.push({
      date,
      key,
      events: onThisDay,
      ...(onThisDay.length ? {} : { emptyThrough: date }),
      isToday: key === todayKey,
      isWeekend: weekendDays.includes(date.getDay()),
    })
  }

  return rows
}
