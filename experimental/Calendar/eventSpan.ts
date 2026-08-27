import { parseDate } from './calendarUtils'
import type { CalendarEvent, CalendarRowBar, CalendarDaySegment } from './types'

/**
 * Where an event sits on the day grid.
 *
 * An event runs from `fromDate fromTime` to `toDate toTime`, dates inclusive.
 * The one wrinkle is a timed event whose `toTime` is midnight: it ends as the
 * next day begins, so that day is not one it occupies. Full-day events ignore
 * their times and cover `fromDate`..`toDate` whole.
 */

const DAY_MS = 24 * 60 * 60 * 1000
const DAY_MINUTES = 24 * 60

/** Height of one all-day bar and the pitch between lanes, in pixels. */
export const LANE_HEIGHT = 30
export const LANE_PITCH = LANE_HEIGHT + 4

export function addDays(date: string, days: number): string {
  const d = toDate(date)
  return parseDate(new Date(d.getFullYear(), d.getMonth(), d.getDate() + days))
}

/** Whole days from `from` to `to` (negative when `to` is earlier). */
export function daysBetween(from: string, to: string): number {
  return Math.round((toDate(to).getTime() - toDate(from).getTime()) / DAY_MS)
}

function toDate(date: string): Date {
  const [y, m, d] = date.split('-').map(Number)
  return new Date(y, m - 1, d)
}

function minutes(time?: string): number {
  if (!time) return 0
  const [h, m] = time.split(':')
  return parseInt(h) * 60 + parseInt(m || '0')
}

const isMidnight = (time?: string) => minutes(time) === 0

/** Inclusive first and last day an event occupies, as `YYYY-MM-DD` strings. */
export function eventDays(event: CalendarEvent): {
  start: string
  end: string
} {
  const start = event.fromDate || event.date || ''
  let end = event.toDate || start
  if (end < start) end = start
  if (!event.isFullDay && end > start && isMidnight(event.toTime)) {
    end = addDays(end, -1)
  }
  return { start, end }
}

/** Days the event occupies, inclusive of both ends. */
export function eventDayCount(event: CalendarEvent): number {
  const { start, end } = eventDays(event)
  return daysBetween(start, end) + 1
}

/**
 * A timed event that crosses midnight but is shorter than a day: an evening
 * that runs late rather than a stay. It belongs in the time grid, clipped at
 * midnight on each side, not in the all-day row.
 */
export function isOvernight(event: CalendarEvent): boolean {
  if (event.isFullDay) return false
  const { start, end } = eventDays(event)
  if (end === start) return false
  const total =
    daysBetween(start, event.toDate || end) * 24 * 60 +
    minutes(event.toTime) -
    minutes(event.fromTime)
  return total < 24 * 60
}

/**
 * Whether the event belongs in the all-day row: full-day events, and timed
 * ones long enough that a time slot would misrepresent them.
 */
export function isAllDayLike(event: CalendarEvent): boolean {
  if (event.isFullDay) return true
  return eventDayCount(event) > 1 && !isOvernight(event)
}

/**
 * The time-grid pieces of an event, one per day it occupies. A single-day
 * event yields itself; an overnight one is cut at midnight, with the first
 * piece running to `24:00` and the last starting at `00:00`. `segFromTime`
 * and `segToTime` position the piece; the event's own times stay untouched
 * so edits still write back the whole event.
 */
export function daySegments(event: CalendarEvent): CalendarDaySegment[] {
  const { start, end } = eventDays(event)
  const count = daysBetween(start, end) + 1
  // An event that stops at midnight on the day after its last occupied one
  // runs to the end of that last day, not to its start.
  const endsAtMidnight =
    !event.isFullDay &&
    (event.toDate || start) > end &&
    isMidnight(event.toTime)
  const segments: CalendarDaySegment[] = []
  for (let i = 0; i < count; i++) {
    const segIsStart = i === 0
    const segIsEnd = i === count - 1
    segments.push({
      ...event,
      date: addDays(start, i),
      segFromTime: segIsStart ? event.fromTime || '00:00' : '00:00',
      segToTime:
        segIsEnd && !endsAtMidnight ? event.toTime || '00:00' : '24:00',
      segIsStart,
      segIsEnd,
    })
  }
  return segments
}

/**
 * Packs events into lanes across one row of dates so a bar keeps the same
 * vertical slot on every day it covers. Bars are clipped to the row;
 * `isStart`/`isEnd` say whether the event actually begins or ends inside it.
 *
 * Bars are placed in order of their first day, and among those starting on
 * the same day the longer one goes first: a stay that begins on Monday takes
 * the top lane before Monday's single-day events, so they tuck in beneath
 * it, which is how the eye expects a spanning bar to read.
 */
export function layoutRow(
  events: CalendarEvent[],
  rowDates: Date[],
): { bars: CalendarRowBar[]; laneCount: number } {
  if (!rowDates.length) return { bars: [], laneCount: 0 }
  const rowStart = parseDate(rowDates[0])
  const rowEnd = parseDate(rowDates[rowDates.length - 1])
  const columns = rowDates.length

  const clipped = events
    .map((event) => {
      const { start, end } = eventDays(event)
      if (end < rowStart || start > rowEnd) return null
      const startCol = Math.max(0, daysBetween(rowStart, start))
      const endCol = Math.min(columns - 1, daysBetween(rowStart, end))
      return {
        event,
        startCol,
        endCol,
        isStart: start >= rowStart,
        isEnd: end <= rowEnd,
        lane: 0,
      }
    })
    .filter((bar): bar is CalendarRowBar => bar !== null)

  clipped.sort((a, b) => {
    if (a.startCol !== b.startCol) return a.startCol - b.startCol
    const spanA = a.endCol - a.startCol
    const spanB = b.endCol - b.startCol
    if (spanA !== spanB) return spanB - spanA
    // Full-day before timed, then by start time, then a stable tiebreak.
    const fullA = a.event.isFullDay ? 0 : 1
    const fullB = b.event.isFullDay ? 0 : 1
    if (fullA !== fullB) return fullA - fullB
    const timeA = minutes(a.event.fromTime)
    const timeB = minutes(b.event.fromTime)
    if (timeA !== timeB) return timeA - timeB
    return String(a.event.id ?? '').localeCompare(String(b.event.id ?? ''))
  })

  // lanes[lane][col] is true once a bar occupies that cell.
  const lanes: boolean[][] = []
  for (const bar of clipped) {
    let lane = 0
    while (true) {
      const row = lanes[lane] || (lanes[lane] = Array(columns).fill(false))
      let free = true
      for (let c = bar.startCol; c <= bar.endCol; c++) {
        if (row[c]) {
          free = false
          break
        }
      }
      if (free) {
        for (let c = bar.startCol; c <= bar.endCol; c++) row[c] = true
        bar.lane = lane
        break
      }
      lane++
    }
  }

  return { bars: clipped, laneCount: lanes.length }
}

/** Bars in a row that touch a given column. */
export function barsInColumn(bars: CalendarRowBar[], col: number) {
  return bars.filter((bar) => bar.startCol <= col && col <= bar.endCol)
}

/**
 * Moves an event by whole days, keeping its length. Used by every drag that
 * lands a bar on a different day: the grab point and the drop point give the
 * shift, and both ends follow.
 */
export function shiftEventDays(event: CalendarEvent, days: number) {
  const fromDate = addDays(event.fromDate || event.date || '', days)
  const toDate = addDays(
    event.toDate || event.fromDate || event.date || '',
    days,
  )
  event.date = fromDate
  event.fromDate = fromDate
  event.toDate = toDate
  event.fromDateTime = fromDate + ' ' + (event.fromTime || '')
  event.toDateTime = toDate + ' ' + (event.toTime || '')
  return event
}

function toClock(totalMinutes: number): string {
  const h = String(Math.floor(totalMinutes / 60)).padStart(2, '0')
  const m = String(totalMinutes % 60).padStart(2, '0')
  return `${h}:${m}:00`
}

/**
 * Moves a timed event by minutes, keeping its length. Either end may roll
 * over midnight, in which case its date follows: dragging the tail of an
 * overnight event later can turn it into a same-day one, and the reverse.
 */
export function shiftEventMinutes(event: CalendarEvent, delta: number) {
  const fromDate = event.fromDate || event.date || ''
  const toDate = event.toDate || fromDate
  let start = minutes(event.fromTime) + delta
  let end =
    daysBetween(fromDate, toDate) * DAY_MINUTES + minutes(event.toTime) + delta
  const startDays = Math.floor(start / DAY_MINUTES)
  const endDays = Math.floor(end / DAY_MINUTES)
  start -= startDays * DAY_MINUTES
  end -= endDays * DAY_MINUTES
  event.fromDate = addDays(fromDate, startDays)
  event.toDate = addDays(fromDate, endDays)
  event.date = event.fromDate
  event.fromTime = toClock(start)
  event.toTime = toClock(end)
  event.fromDateTime = event.fromDate + ' ' + event.fromTime
  event.toDateTime = event.toDate + ' ' + event.toTime
  return event
}

/**
 * Drops the placement-only fields a view attaches (`segFromTime`, lane data,
 * and so on) before an event leaves the calendar through an emit.
 */
export function stripPlacement(event: CalendarEvent): CalendarEvent {
  const { segFromTime, segToTime, segIsStart, segIsEnd, ...rest } = event
  return rest
}
