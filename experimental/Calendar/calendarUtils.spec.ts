import { describe, expect, it } from 'vitest'
import { findOverlappingEventsCount, paintedEventHeight } from './calendarUtils'
import type { CalendarEvent } from './types'

/** The grid's default: 50px an hour. */
const minuteHeight = 50 / 60

const minutes = (time: string) => {
  const [hours, mins] = time.split(':').map(Number)
  return hours * 60 + mins
}

const at = (id: string, fromTime: string, toTime: string): CalendarEvent => ({
  id,
  fromDate: '2026-08-20',
  toDate: '2026-08-20',
  fromTime,
  toTime,
  startTime: minutes(fromTime),
  endTime: minutes(toTime),
})

const laidOut = (events: CalendarEvent[]) =>
  Object.fromEntries(
    findOverlappingEventsCount(events).map((event) => [event.id, event]),
  )

describe('paintedEventHeight', () => {
  it('draws an event as long as it runs', () => {
    expect(paintedEventHeight(60, minuteHeight)).toBe(50)
  })

  it('holds an event too short to draw at the floor', () => {
    expect(paintedEventHeight(15, minuteHeight)).toBe(32.5)
  })
})

describe('findOverlappingEventsCount', () => {
  it('puts overlapping events in halls of their own', () => {
    const events = laidOut([
      at('a', '10:00', '11:00'),
      at('b', '10:30', '11:30'),
    ])
    expect(events.a.hallNumber).toBe(0)
    expect(events.b.hallNumber).toBe(1)
  })

  it('keeps events that follow each other in one hall', () => {
    const events = laidOut([
      at('a', '09:00', '10:00'),
      at('b', '10:00', '11:00'),
    ])
    expect(events.b.hallNumber).toBe(0)
    expect(events.b.idx).toBe(1)
    expect(events.b.over).toEqual([])
  })

  const laidOutOnGrid = (events: CalendarEvent[]) =>
    Object.fromEntries(
      findOverlappingEventsCount(events, minuteHeight).map((event) => [
        event.id,
        event,
      ]),
    )
  const overIds = (event: CalendarEvent) =>
    (event.over as CalendarEvent[]).map((other) => other.id)

  // A quarter of an hour is painted at the floor, 32.5px, which at 50px an
  // hour is 39 minutes on the grid: the event that starts a quarter of an hour
  // later starts under it, and the one that starts an hour later does not.
  it('says when an event starts under the painted tail of the one before', () => {
    const events = laidOutOnGrid([
      at('a', '09:00', '09:15'),
      at('b', '09:15', '10:00'),
      at('c', '10:00', '11:00'),
    ])
    expect(overIds(events.b)).toEqual(['a'])
    expect(overIds(events.c)).toEqual([])
  })

  // Laid over a longer event, a short one is on it; the one beneath is on
  // nothing. The event beneath comes with its own place in the layout, which
  // is what the pill draws the cut from.
  it('names the events a pill is drawn on, with where they sit', () => {
    const events = laidOutOnGrid([
      at('coffee', '17:00', '18:00'),
      at('school', '17:00', '17:15'),
    ])
    expect(events.school.hallNumber).toBe(1)
    expect(overIds(events.school)).toEqual(['coffee'])
    expect((events.school.over as CalendarEvent[])[0].hallNumber).toBe(0)
    expect(overIds(events.coffee)).toEqual([])
  })

  // An event in a later column is on every earlier one its height crosses,
  // and not on the ones it clears.
  it('is on each earlier event it crosses and none it clears', () => {
    const events = laidOutOnGrid([
      at('a', '10:00', '11:00'),
      at('b', '11:00', '12:00'),
      at('c', '10:30', '11:30'),
    ])
    expect(events.c.hallNumber).toBe(1)
    expect(overIds(events.c)).toEqual(['a', 'b'])
    expect(overIds(events.b)).toEqual([])
  })
})
