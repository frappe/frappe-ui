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
  })
})
