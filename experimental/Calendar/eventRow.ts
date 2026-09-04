import {
  calculateMinutes,
  daysList,
  formatTime,
  formattedDuration,
  parseDate,
} from './calendarUtils'
import { eventDays, isAllDayLike } from './eventSpan'
import type { CalendarEvent, CalendarRowTag, CalendarTimeFormat } from './types'

/**
 * What a listed event says about itself.
 *
 * The Agenda view reads an event as a row rather than a pill, and a row has
 * room for more than a title. These are the parts
 * the library can work out on its own — the time, the day it runs on to, the
 * state it is in. Anything that needs the consumer's own data model (who is
 * coming, where, whether you have replied) arrives through the
 * `#event-description` and `#event-suffix` slots instead.
 */

/**
 * "11 am – 1 pm", or "All day" for an event that owns the whole of it.
 *
 * A row says what the event does on the day it is listed under, not what it
 * does in general: an event that began before `date` has no start to give that
 * day, so it reports the end it is running towards, or owns the day outright if
 * it does not end on it either.
 */
export function rowTimeLabel(
  event: CalendarEvent,
  format: CalendarTimeFormat,
  date?: Date,
): string {
  if (isAllDayLike(event)) return 'All day'

  const key = date ? parseDate(date) : null
  if (key && eventDays(event).start < key) {
    if (eventDays(event).end > key) return 'All day'
    const ends = String(event.segToTime || event.toTime || '')
    return ends ? `Ends ${formatTime(ends, format)}` : 'All day'
  }

  const from = String(event.segFromTime || event.fromTime || '00:00')
  const to = String(event.segToTime || event.toTime || '')
  if (!to || to === from) return formatTime(from, format)
  return formattedDuration(from, to, format)
}

/** "Tue 18" when the event runs past `date`, else null. */
export function continuesTo(event: CalendarEvent, date: Date): string | null {
  const end = eventDays(event).end
  if (end <= parseDate(date)) return null
  const endDate = new Date(end + 'T00:00:00')
  return `${daysList[endDate.getDay()]} ${endDate.getDate()}`
}

/**
 * The library's own one-line description of a row: where it is, and whether it
 * outlives the day you are looking at. A consumer's `#event-description` slot
 * receives this as its default, so filling the slot extends this rather than
 * replacing knowledge the row already had.
 */
export function rowDescription(event: CalendarEvent, date: Date): string {
  const parts: string[] = []
  if (event.venue) parts.push(String(event.venue))
  if (event.participant) parts.push(String(event.participant))
  const ends = continuesTo(event, date)
  if (ends) parts.push(`Ends ${ends}`)
  return parts.join(' · ')
}

/** Minutes from `now` until the event starts; negative once it has. */
function minutesUntil(event: CalendarEvent, date: Date, now: Date): number {
  if (parseDate(now) !== parseDate(date)) return Infinity
  const start = calculateMinutes(
    String(event.segFromTime || event.fromTime || '00:00'),
  )
  return start - (now.getHours() * 60 + now.getMinutes())
}

/**
 * Where the now-marker sits in a day's list of rows: the index of the first
 * event still to start, or the end of the list once they all have.
 *
 * The list is ordered by start, so the line reads as the clock's own place in
 * that order — an event under way sits above it, having started, and says so
 * itself with a `Now` tag rather than by where the line falls.
 *
 * All-day events are not on the clock, so the line never lands above one — it
 * marks the point in the day the reader has got to, and an all-day event is not
 * at any point in particular.
 */
const SOON_MINUTES = 60

/**
 * The tags the library derives itself. A consumer adds its own — an RSVP it is
 * waiting on, say — through `#event-suffix`, which receives these as its
 * default.
 */
export function rowTags(
  event: CalendarEvent,
  date: Date,
  now: Date,
): CalendarRowTag[] {
  const tags: CalendarRowTag[] = []
  if (event.isDraft) tags.push({ label: 'Draft' })

  // Under way and about to start are the same kind of fact — the thing on the
  // day that wants you now — so they wear one colour and never both at once.
  if (isUnderWay(event, date, now)) {
    tags.push({ label: 'Now', theme: 'amber' })
    return tags
  }

  const until = minutesUntil(event, date, now)
  if (until > 0 && until <= SOON_MINUTES) {
    const hours = Math.round(until / 60)
    tags.push({ label: hours < 1 ? 'Soon' : `In ${hours} h`, theme: 'amber' })
  }

  return tags
}

/** Whether the event has started and not yet finished. */
function isUnderWay(event: CalendarEvent, date: Date, now: Date): boolean {
  if (isAllDayLike(event)) return false
  if (parseDate(now) !== parseDate(date)) return false
  const minutes = now.getHours() * 60 + now.getMinutes()
  const from = calculateMinutes(
    String(event.segFromTime || event.fromTime || '00:00'),
  )
  const to =
    calculateMinutes(String(event.segToTime || event.toTime || '00:00')) ||
    24 * 60
  return from <= minutes && minutes < to
}
