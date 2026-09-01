import { formatTime } from './calendarUtils'
import { isAllDayLike } from './eventSpan'
import type { CalendarEvent, CalendarTimeFormat } from './types'

/**
 * What the Day view's rail says about a day as a whole.
 *
 * The grid can only show time that is on screen. The rail reads the day
 * instead: how much of it is spoken for, which stretches are still free, and
 * what runs past the bottom of the scroll.
 */

export interface Interval {
  /** Minutes from midnight. */
  from: number
  to: number
}

const minutesOf = (event: CalendarEvent, key: 'startTime' | 'endTime') =>
  typeof event[key] === 'number' ? (event[key] as number) : 0

/** A day's timed events as merged, non-overlapping busy stretches. */
export function busyIntervals(events: CalendarEvent[]): Interval[] {
  const timed = events
    .filter((event) => !isAllDayLike(event) && !event.isDeclined)
    .map((event) => ({
      from: minutesOf(event, 'startTime'),
      to: minutesOf(event, 'endTime'),
    }))
    .filter((i) => i.to > i.from)
    .sort((a, b) => a.from - b.from)

  const merged: Interval[] = []
  for (const interval of timed) {
    const last = merged[merged.length - 1]
    // Touching counts as continuous: back-to-back meetings are not a gap.
    if (last && interval.from <= last.to)
      last.to = Math.max(last.to, interval.to)
    else merged.push({ ...interval })
  }
  return merged
}

/** Minutes of the day actually spoken for, overlaps counted once. */
export function scheduledMinutes(events: CalendarEvent[]): number {
  return busyIntervals(events).reduce((total, i) => total + (i.to - i.from), 0)
}

/** Gaps shorter than this are not worth drawing a line for. */
export const MIN_GAP_MINUTES = 120

/**
 * The free stretches between busy ones. Only the gaps *inside* the day's
 * occupied span count — the hours before the first event and after the last
 * are not a gap in the day, they are its edges.
 */
export function freeGaps(
  events: CalendarEvent[],
  minMinutes: number = MIN_GAP_MINUTES,
): Interval[] {
  const busy = busyIntervals(events)
  const gaps: Interval[] = []

  for (let i = 1; i < busy.length; i++) {
    const from = busy[i - 1]!.to
    const to = busy[i]!.from
    if (to - from >= minMinutes) gaps.push({ from, to })
  }

  return gaps
}

/** The bands a day is read in, for "afternoon clear". */
const BANDS: Array<{ name: string; from: number; to: number }> = [
  { name: 'morning', from: 6 * 60, to: 12 * 60 },
  { name: 'afternoon', from: 12 * 60, to: 18 * 60 },
  { name: 'evening', from: 18 * 60, to: 23 * 60 },
]

/** The first band nothing is booked in, if there is one. */
export function clearBand(events: CalendarEvent[]): string | null {
  const busy = busyIntervals(events)
  const band = BANDS.find((b) =>
    busy.every((i) => i.to <= b.from || i.from >= b.to),
  )
  return band ? band.name : null
}

/** "2 h 30 m", "45 m", "3 h". */
export function formatSpan(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  if (!hours) return `${rest} m`
  return rest ? `${hours} h ${rest} m` : `${hours} h`
}

/**
 * The line under the rail's heading: "3 events · 3 h scheduled · afternoon
 * clear". Each part is dropped when it has nothing to say, so an empty day is
 * "Nothing scheduled" rather than a string of zeroes.
 */
export function daySummary(events: CalendarEvent[]): string {
  const counted = events.filter((event) => !event.isDeclined)
  if (!counted.length) return 'Nothing scheduled'

  const parts = [`${counted.length} event${counted.length === 1 ? '' : 's'}`]

  const scheduled = scheduledMinutes(counted)
  if (scheduled) parts.push(`${formatSpan(scheduled)} scheduled`)

  const clear = clearBand(counted)
  if (clear) parts.push(`${clear} clear`)

  return parts.join(' · ')
}

/** "10 hours free" — the label on a gap marker. */
export function gapLabel(gap: Interval): string {
  const minutes = gap.to - gap.from
  const hours = Math.round(minutes / 60)
  if (minutes < 60) return `${minutes} minutes free`
  return `${hours} hour${hours === 1 ? '' : 's'} free`
}

/** "1 pm – 3 pm", the range a gap covers. */
export function gapRange(gap: Interval, format: CalendarTimeFormat): string {
  const clock = (m: number) =>
    formatTime(
      `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`,
      format,
    )
  return `${clock(gap.from)} – ${clock(gap.to)}`
}
