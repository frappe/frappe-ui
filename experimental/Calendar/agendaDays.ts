import { getWeekendDays, parseDate } from './calendarUtils'
import { eventsOn } from './eventSpan'
import { shortMonth, weekStart } from './monthStrip'
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
  /** The day after today, which reads "Tomorrow". */
  isTomorrow: boolean
  /** The day before it, which reads "Yesterday". */
  isYesterday: boolean
  /**
   * The day is behind the reader. The rows of such a day already dim
   * themselves; the day's header says it too, so a day spent reads as spent
   * from its heading rather than only from the events under it.
   */
  isPast: boolean
  isWeekend: boolean
}

/** The three months the view is anchored on, from the 1st to the last day. */
export function agendaMonths(anchor: Date): { start: Date; end: Date } {
  const year = anchor.getFullYear()
  const month = anchor.getMonth()

  return {
    start: new Date(year, month, 1),
    // Day 0 of the month after the last is that last month's final day.
    end: new Date(year, month + AGENDA_MONTHS, 0),
  }
}

/**
 * The span the view lists: the anchor's month and the two after it, padded out
 * to whole weeks at both ends — the same padding the Month view's strip does,
 * for the same reason.
 *
 * The list groups its days under the week they fall in, and a week label names
 * seven days. Ending the span at a month boundary left the first and last of
 * those labels naming days the list had never been given: "Last week ·
 * Aug 30 – Sep 5" over a card list that began on the 1st, with the Sunday and
 * Monday of that week missing rather than empty. A week is either listed or it
 * is not.
 *
 * The month under way used to start at today, which kept days already spent out
 * of the way but made the header lie: "Sep – Nov" over a list whose September
 * began on the 7th, with that month's earlier events nowhere to be found. The
 * view scrolls to today instead, so what is ahead still leads and what is behind
 * is a scroll away rather than gone.
 *
 * `Calendar` reports this same span as its visible range, so a consumer's fetch
 * window and its `+ Event` anchor agree with what is on screen. Its *title*
 * comes from `agendaMonths` instead — the reader chose three months, and the
 * days either side are how the view draws them, not what it is showing.
 */
export function agendaRange(anchor: Date): { start: Date; end: Date } {
  const { start, end } = agendaMonths(anchor)
  return { start: weekStart(start), end: addDays(weekStart(end), 6) }
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
  const { start, end } = agendaRange(anchor)
  const todayKey = parseDate(today)
  const tomorrowKey = parseDate(addDays(today, 1))
  const yesterdayKey = parseDate(addDays(today, -1))
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
      isTomorrow: key === tomorrowKey,
      isYesterday: key === yesterdayKey,
      isPast: key < todayKey,
      isWeekend: weekendDays.includes(date.getDay()),
    })
  }

  return rows
}

/**
 * The list is not a flat run of days: a week is a card, and the days that have
 * something on them are its sections. `agendaWeeks` is that nesting — the view
 * walks the weeks and, inside each, its days.
 */
export interface AgendaWeek {
  /** The Sunday the week starts on, as `YYYY-MM-DD`. */
  key: string
  /** Sunday to Saturday, the same week the Month view draws as a row. */
  start: Date
  end: Date
  /** The week today falls in — the one that reads "This week". */
  isCurrent: boolean
  /** The week after it, which reads "Next week". */
  isNext: boolean
  /** The week before it, which reads "Last week". */
  isPrevious: boolean
  /**
   * The week ended before today. Its label fades with the day headers under it,
   * so a run of spent days is spent from its heading down rather than reading
   * as a live week of faded days.
   */
  isPast: boolean
  /** The days of the week with something on them; never empty. */
  days: AgendaRow[]
}

function addDays(date: Date, days: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days)
}

/**
 * The list as the view draws it: the weeks that have anything in them, each
 * carrying its own days.
 *
 * Days with nothing on them are not drawn at all, not even as a line saying how
 * many there were — the dates on the sections either side of a quiet stretch
 * already say how long it ran. A week with no such day is not drawn either: an
 * empty card under a label is a week saying nothing at more length than the
 * dates either side of it already do.
 */
export function agendaWeeks(
  events: CalendarEvent[],
  anchor: Date,
  config?: WeekendConfig,
  today: Date = new Date(),
): AgendaWeek[] {
  const rows = agendaRows(events, anchor, config, today)
  const currentWeek = parseDate(weekStart(today))
  const nextWeek = parseDate(addDays(weekStart(today), 7))
  const lastWeek = parseDate(addDays(weekStart(today), -7))
  const weeks: AgendaWeek[] = []

  for (const row of rows) {
    const start = weekStart(row.date)
    const key = parseDate(start)
    let week = weeks[weeks.length - 1]

    if (week?.key !== key) {
      const end = addDays(start, 6)
      week = {
        key,
        start,
        end,
        isCurrent: key === currentWeek,
        isNext: key === nextWeek,
        isPrevious: key === lastWeek,
        isPast: parseDate(end) < parseDate(today),
        days: [],
      }
      weeks.push(week)
    }

    week.days.push(row)
  }

  return weeks
}

/**
 * "Sep 6 – 12", or "Sep 27 – Oct 3" where the range crosses a month end. The
 * month is named once when both ends share it: the second is the same word the
 * reader just read.
 */
export function agendaRangeLabel(start: Date, end: Date): string {
  const from = `${shortMonth(start)} ${start.getDate()}`
  const to =
    start.getMonth() === end.getMonth()
      ? `${end.getDate()}`
      : `${shortMonth(end)} ${end.getDate()}`
  return `${from} – ${to}`
}
