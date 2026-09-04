import {
  calculateMinutes,
  formatTime,
  formattedDuration,
  parseDate,
} from './calendarUtils'
import { daysBetween, eventDays, isAllDayLike, isOvernight } from './eventSpan'
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
  // Only an event with no clock of its own owns the day outright. A timed one
  // running from six on Friday to seven on Saturday is drawn as a bar in the
  // all-day row, but it still starts and ends at a time, and a row saying "All
  // day" of it is telling the reader something untrue.
  if (event.isFullDay) return 'All day'

  const key = date ? parseDate(date) : null
  const { start, end } = key ? eventDays(event) : { start: '', end: '' }
  if (key && (start < key || end > key)) {
    if (start < key && end > key) return 'All day'
    if (start < key) {
      const ends = String(event.segToTime || event.toTime || '')
      return ends ? `Ends ${formatTime(ends, format)}` : 'All day'
    }
    // An event under a day long reads as a range even across midnight — "11 pm
    // – 2 am" is a night out. A longer one does not: "6 pm – 7 pm" over
    // twenty-five hours describes an hour that isn't there.
    if (isOvernight(event)) return spanLabel(event, format)
    const begins = String(event.segFromTime || event.fromTime || '')
    return begins ? `From ${formatTime(begins, format)}` : 'All day'
  }

  return spanLabel(event, format)
}

/** The event's own times, as a range — or just the one when it has no length. */
function spanLabel(event: CalendarEvent, format: CalendarTimeFormat): string {
  const from = String(event.segFromTime || event.fromTime || '00:00')
  const to = String(event.segToTime || event.toTime || '')
  if (!to || to === from) return formatTime(from, format)
  return formattedDuration(from, to, format)
}

/**
 * "Day 1/3" for an event that occupies more than one day, counting `date`'s
 * place in it; null for an ordinary one.
 *
 * Which day of the stay you are looking at is the thing a reader wants from a
 * row of a multi-day event — more than the date it happens to end on, which
 * the row can only state and not place them within.
 */
export function daySpan(event: CalendarEvent, date: Date): string | null {
  const { start, end } = eventDays(event)
  const total = daysBetween(start, end) + 1
  if (total < 2) return null
  const day = daysBetween(start, parseDate(date)) + 1
  if (day < 1 || day > total) return null
  return `Day ${day}/${total}`
}

/**
 * The library's own one-line description of a row: where it is, and which day
 * of a stay it is, when the event covers more than one. A consumer's `#event-description` slot
 * receives this as its default, so filling the slot extends this rather than
 * replacing knowledge the row already had.
 */
export function rowDescription(event: CalendarEvent, date: Date): string {
  const parts: string[] = []
  if (event.venue) parts.push(String(event.venue))
  if (event.participant) parts.push(String(event.participant))
  const span = daySpan(event, date)
  if (span) parts.push(span)
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
 * How close is close enough to be worth saying.
 *
 * The hour before, not the several the row could count: the time is written
 * beside the tag, the list is in order, and a red rule marks the present, so
 * the distance to an event is already on the page. What is not is the moment
 * it stops being something later and becomes something now.
 */
const SOON_MINUTES = 60

/**
 * The tags the library derives itself. A consumer adds its own — an RSVP it is
 * waiting on, say — through `#event-suffix`, which receives these as its
 * default.
 */
export function rowTags(
  event: CalendarEvent,
  _date: Date,
  _now: Date,
): CalendarRowTag[] {
  const tags: CalendarRowTag[] = []
  if (event.isDraft) tags.push({ label: 'Draft' })
  return tags
}

/**
 * Whether the event is behind the reader on the day it is listed under.
 *
 * A day already spent is over whatever is on it; on today, a timed event is
 * over once it has ended, and an all-day one is not — it is still the day you
 * are in. Nothing on a later day is over.
 */
export function hasEnded(event: CalendarEvent, date: Date, now: Date): boolean {
  const day = parseDate(date)
  const today = parseDate(now)
  if (day < today) return true
  if (day > today) return false
  if (event.isFullDay) return false
  // An event that began earlier and runs on through today has not ended here.
  if (eventDays(event).end > day) return false
  const to =
    calculateMinutes(String(event.segToTime || event.toTime || '00:00')) ||
    24 * 60
  return to <= now.getHours() * 60 + now.getMinutes()
}

/**
 * Where the event stands against the clock: under way, or near enough to start
 * to be worth saying. One tag, never two — under way and about to start are the
 * same kind of fact, the thing on the day that wants you now — and it reads
 * beside the time rather than after the title, which is where a reader scanning
 * for "when" is already looking.
 *
 * Two states, not a countdown: blue while it runs, amber in the half hour
 * before it. An hour count would only restate the time written beside it, on
 * every row within reach of it, which is how the two that change what a reader
 * does stop standing out.
 */
export function rowTiming(
  event: CalendarEvent,
  date: Date,
  now: Date,
): CalendarRowTag | null {
  if (isUnderWay(event, date, now)) return { label: 'Now', theme: 'blue' }

  const until = minutesUntil(event, date, now)
  if (until > 0 && until <= SOON_MINUTES)
    return { label: 'Soon', theme: 'amber' }

  return null
}

/**
 * Whether the event has started and not yet finished, on the day it is listed
 * under.
 *
 * Only a full-day event is off the clock. A timed one spanning two days is
 * drawn as an all-day bar but is under way from six on Friday to seven on
 * Saturday, so it is measured by the part of it that falls on this day: from
 * midnight if it began earlier, to midnight if it runs on.
 */
function isUnderWay(event: CalendarEvent, date: Date, now: Date): boolean {
  if (event.isFullDay) return false
  const key = parseDate(date)
  if (parseDate(now) !== key) return false

  const { start, end } = eventDays(event)
  if (key < start || key > end) return false

  const minutes = now.getHours() * 60 + now.getMinutes()
  const from =
    key > start
      ? 0
      : calculateMinutes(String(event.segFromTime || event.fromTime || '00:00'))
  const to =
    key < end
      ? 24 * 60
      : calculateMinutes(String(event.segToTime || event.toTime || '00:00')) ||
        24 * 60
  return from <= minutes && minutes < to
}
