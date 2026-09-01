import { describe, expect, it } from 'vitest'
import { agendaRows } from './agendaDays'
import { parseDate } from './calendarUtils'
import type { CalendarEvent } from './types'

const d = (iso: string) => new Date(iso + 'T00:00:00')

/** August 2026: the 1st is a Saturday, the month ends on Monday the 31st. */
const AUG = { month: 7, year: 2026 }

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
]

const rowsFrom = (today: string) =>
  agendaRows(events, AUG.month, AUG.year, undefined, d(today))

describe('agendaRows', () => {
  it('starts the current month at today, not at the 1st', () => {
    const rows = rowsFrom('2026-08-20')
    expect(rows[0]!.key).toBe('2026-08-20')
    expect(rows[0]!.isToday).toBe(true)
  })

  it('starts any other month at its 1st', () => {
    const rows = agendaRows(
      events,
      AUG.month,
      AUG.year,
      undefined,
      d('2026-07-15'),
    )
    expect(rows[0]!.key).toBe('2026-08-01')
    expect(rows.some((r) => r.isToday)).toBe(false)
  })

  it('collapses a run of empty days into the row that opened it', () => {
    const rows = rowsFrom('2026-08-20')
    // 22 and 23 are empty, so the 22nd's row stands for both.
    const empty = rows.find((r) => r.key === '2026-08-22')!
    expect(empty.events).toEqual([])
    expect(parseDate(empty.emptyThrough!)).toBe('2026-08-23')
    expect(rows.some((r) => r.key === '2026-08-23')).toBe(false)
  })

  it('puts a multi-day event on every day it covers', () => {
    const covered = rowsFrom('2026-08-20')
      .filter((r) => r.events.some((e) => e.id === 'sprint'))
      .map((r) => r.key)
    expect(covered).toEqual(['2026-08-24', '2026-08-25', '2026-08-26'])
  })

  it('runs to the end of the month and no further', () => {
    const rows = rowsFrom('2026-08-20')
    const last = rows[rows.length - 1]!
    expect(parseDate(last.emptyThrough ?? last.date)).toBe('2026-08-31')
  })

  // The library's default weekend is Sunday alone; Saturday only counts when
  // the config says so.
  it('marks weekends the config names', () => {
    const rows = rowsFrom('2026-08-20')
    expect(rows.find((r) => r.key === '2026-08-22')!.isWeekend).toBe(false)

    const both = agendaRows(
      events,
      AUG.month,
      AUG.year,
      { weekends: ['sunday', 'saturday'] },
      d('2026-08-20'),
    )
    expect(both.find((r) => r.key === '2026-08-22')!.isWeekend).toBe(true)
    expect(both.find((r) => r.key === '2026-08-21')!.isWeekend).toBe(false)
  })
})
