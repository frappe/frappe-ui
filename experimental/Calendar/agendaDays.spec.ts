import { describe, expect, it } from 'vitest'
import { agendaRange, agendaRows } from './agendaDays'
import { parseDate } from './calendarUtils'
import type { CalendarEvent } from './types'

const d = (iso: string) => new Date(iso + 'T00:00:00')

const events: CalendarEvent[] = [
  {
    id: 'standup',
    fromDate: '2026-08-20',
    toDate: '2026-08-20',
    fromTime: '14:30',
    toTime: '15:30',
  },
  {
    id: 'av',
    fromDate: '2026-08-20',
    toDate: '2026-08-20',
    fromTime: '12:00',
    toTime: '13:00',
  },
  {
    id: 'faris',
    fromDate: '2026-08-21',
    toDate: '2026-08-21',
    fromTime: '16:00',
    toTime: '16:30',
  },
  {
    id: 'sprint',
    fromDate: '2026-08-24',
    toDate: '2026-08-26',
    isFullDay: true,
  },
  {
    id: 'market',
    fromDate: '2026-08-22',
    toDate: '2026-08-23',
    isFullDay: true,
  },
]

/** Anchored on the day it is read, which is how the view uses it. */
const rowsFrom = (today: string) =>
  agendaRows(events, d(today), undefined, d(today))

describe('agendaRange', () => {
  it('runs to the end of the third month, starting at today', () => {
    const { start, end } = agendaRange(d('2026-08-20'), d('2026-08-20'))
    expect(parseDate(start)).toBe('2026-08-20')
    expect(parseDate(end)).toBe('2026-10-31')
  })

  it('runs a month it is not in whole, from the 1st', () => {
    const { start, end } = agendaRange(d('2026-08-20'), d('2026-07-15'))
    expect(parseDate(start)).toBe('2026-08-01')
    expect(parseDate(end)).toBe('2026-10-31')
  })

  it('carries the window over a year end', () => {
    const { end } = agendaRange(d('2026-12-01'), d('2026-12-01'))
    expect(parseDate(end)).toBe('2027-02-28')
  })
})

describe('agendaRows', () => {
  it('starts at the first day with something on it', () => {
    const rows = rowsFrom('2026-08-20')
    expect(rows[0]!.key).toBe('2026-08-20')
    expect(rows[0]!.isToday).toBe(true)
  })

  it('marks no row today when the window does not reach it', () => {
    const rows = agendaRows(events, d('2026-08-01'), undefined, d('2026-06-15'))
    expect(rows[0]!.key).toBe('2026-08-20')
    expect(rows.some((r) => r.isToday)).toBe(false)
  })

  it('leaves out the days with nothing on them', () => {
    const rows = rowsFrom('2026-08-20')
    // The 27th onwards is empty, and the window runs to the end of October.
    expect(rows.every((r) => r.events.length)).toBe(true)
    expect(rows.some((r) => r.key === '2026-08-27')).toBe(false)
    expect(rows[rows.length - 1]!.key).toBe('2026-08-26')
  })

  it('puts a multi-day event on every day it covers', () => {
    const covered = rowsFrom('2026-08-20')
      .filter((r) => r.events.some((e) => e.id === 'sprint'))
      .map((r) => r.key)
    expect(covered).toEqual(['2026-08-24', '2026-08-25', '2026-08-26'])
  })

  it('reaches events in the months after the anchor month', () => {
    const october: CalendarEvent = {
      id: 'later',
      fromDate: '2026-10-30',
      toDate: '2026-10-30',
      fromTime: '09:00',
      toTime: '10:00',
    }
    const rows = agendaRows(
      [...events, october],
      d('2026-08-20'),
      undefined,
      d('2026-08-20'),
    )
    expect(rows[rows.length - 1]!.key).toBe('2026-10-30')
  })

  it('marks the first row of each month it lists', () => {
    const october: CalendarEvent = {
      id: 'later',
      fromDate: '2026-10-02',
      toDate: '2026-10-02',
      fromTime: '09:00',
      toTime: '10:00',
    }
    const rows = agendaRows(
      [...events, october],
      d('2026-08-20'),
      undefined,
      d('2026-08-20'),
    )
    const opens = rows.filter((r) => r.opensMonth).map((r) => r.key)
    // The first row of the list opens its own month; September has nothing on
    // it at all, so the next is October's.
    expect(opens).toEqual(['2026-08-20', '2026-10-02'])
  })

  // The library's default weekend is Sunday alone; Saturday only counts when
  // the config says so.
  it('marks weekends the config names', () => {
    const rows = rowsFrom('2026-08-20')
    expect(rows.find((r) => r.key === '2026-08-23')!.isWeekend).toBe(true)
    expect(rows.find((r) => r.key === '2026-08-22')!.isWeekend).toBe(false)

    const both = agendaRows(
      events,
      d('2026-08-20'),
      { weekends: ['sunday', 'saturday'] },
      d('2026-08-20'),
    )
    expect(both.find((r) => r.key === '2026-08-22')!.isWeekend).toBe(true)
    expect(both.find((r) => r.key === '2026-08-21')!.isWeekend).toBe(false)
  })
})
