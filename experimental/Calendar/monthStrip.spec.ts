import { describe, expect, it } from 'vitest'
import { parseDate } from './calendarUtils'
import {
  dayEvents,
  eventsOn,
  isSpan,
  sortByStart,
  stripRange,
  stripWeeks,
  weekStart,
} from './monthStrip'
import type { CalendarEvent } from './types'

const d = (iso: string) => new Date(iso + 'T00:00:00')

describe('weekStart', () => {
  it('goes back to the Sunday of the week', () => {
    expect(parseDate(weekStart(d('2026-08-27')))).toBe('2026-08-23')
    expect(parseDate(weekStart(d('2026-08-23')))).toBe('2026-08-23')
  })
})

describe('stripWeeks', () => {
  // August 2026 runs Saturday the 1st to Monday the 31st.
  const weeks = stripWeeks(7, 2026)

  it('starts on the Sunday before the first and ends on the Saturday after the last', () => {
    expect(weeks).toHaveLength(6)
    expect(parseDate(weeks[0]![0]!)).toBe('2026-07-26')
    expect(parseDate(weeks[weeks.length - 1]![6]!)).toBe('2026-09-05')
  })

  it('runs in whole weeks without gaps', () => {
    expect(weeks.every((week) => week.length === 7)).toBe(true)
    for (let i = 1; i < weeks.length; i++) {
      const prevEnd = weeks[i - 1]![6]!.getTime()
      const nextStart = weeks[i]![0]!.getTime()
      expect(nextStart - prevEnd).toBe(24 * 60 * 60 * 1000)
    }
  })

  it('pads across a year boundary', () => {
    const jan = stripWeeks(0, 2027)
    expect(parseDate(jan[0]![0]!)).toBe('2026-12-27')
    expect(parseDate(jan[jan.length - 1]![6]!)).toBe('2027-02-06')
  })

  it('stripRange reports the same first and last day', () => {
    const range = stripRange(7, 2026)
    expect(parseDate(range.start)).toBe('2026-07-26')
    expect(parseDate(range.end)).toBe('2026-09-05')
  })
})

describe('events on the strip', () => {
  const events: CalendarEvent[] = [
    {
      id: 'late',
      title: 'Late',
      fromDate: '2026-08-27',
      toDate: '2026-08-27',
      fromTime: '15:00',
      toTime: '16:00',
    },
    {
      id: 'early',
      title: 'Early',
      fromDate: '2026-08-27',
      toDate: '2026-08-27',
      fromTime: '09:30',
      toTime: '10:00',
    },
    {
      id: 'allday',
      title: 'All day',
      fromDate: '2026-08-27',
      toDate: '2026-08-27',
      isFullDay: true,
    },
    {
      id: 'stay',
      title: 'Stay',
      fromDate: '2026-08-31',
      toDate: '2026-09-02',
      isFullDay: true,
    },
  ]

  it('tells spans from single days', () => {
    expect(isSpan(events[3]!)).toBe(true)
    expect(isSpan(events[0]!)).toBe(false)
  })

  it('orders a day full-day first, then by start time', () => {
    expect(sortByStart(events.slice(0, 3)).map((e) => e.id)).toEqual([
      'allday',
      'early',
      'late',
    ])
    expect(dayEvents(events, d('2026-08-27')).map((e) => e.id)).toEqual([
      'allday',
      'early',
      'late',
    ])
  })

  it('leaves spans out of a day and puts them in eventsOn', () => {
    expect(dayEvents(events, d('2026-09-01'))).toEqual([])
    expect(eventsOn(events, d('2026-09-01')).map((e) => e.id)).toEqual(['stay'])
  })
})
