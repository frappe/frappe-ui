import { describe, expect, it } from 'vitest'
import {
  agendaBlocks,
  agendaMonths,
  agendaRange,
  agendaRangeLabel,
  agendaRows,
} from './agendaDays'
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
  // Aug 1 2026 is a Saturday, so its week opens on Jul 26; Oct 31 is a
  // Saturday, which closes its own.
  it('runs three months padded out to whole weeks', () => {
    const { start, end } = agendaRange(d('2026-08-20'))
    expect(parseDate(start)).toBe('2026-07-26')
    expect(parseDate(end)).toBe('2026-10-31')
  })

  // The months are what the reader asked for; the padding is how the list
  // draws them, and the header says the former.
  it('names three whole months whatever the padding reaches', () => {
    const { start, end } = agendaMonths(d('2026-08-20'))
    expect(parseDate(start)).toBe('2026-08-01')
    expect(parseDate(end)).toBe('2026-10-31')
  })

  // Every day the list can group is inside the span, so no week label names a
  // day the list was never given.
  it('covers whole weeks at both ends', () => {
    for (const iso of [
      '2026-08-20',
      '2026-09-01',
      '2026-11-15',
      '2027-02-03',
    ]) {
      const { start, end } = agendaRange(d(iso))
      expect(start.getDay()).toBe(0)
      expect(end.getDay()).toBe(6)
    }
  })

  // The month under way used to start at today, which hid that month's earlier
  // events under a header naming the whole month. The view scrolls to today
  // instead; the span itself no longer depends on when it is read.
  it('starts at the 1st wherever in the month it is read', () => {
    const early = agendaRange(d('2026-08-01'))
    const late = agendaRange(d('2026-08-20'))
    expect(parseDate(early.start)).toBe(parseDate(late.start))
    expect(parseDate(early.end)).toBe(parseDate(late.end))
  })

  it('carries the window over a year end', () => {
    expect(parseDate(agendaMonths(d('2026-12-01')).end)).toBe('2027-02-28')
    // Feb 28 2027 is a Sunday, so the week holding it runs on into March.
    expect(parseDate(agendaRange(d('2026-12-01')).end)).toBe('2027-03-06')
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

  it('names the day either side of today', () => {
    // Read on Aug 21: the 20th is yesterday, the 22nd tomorrow, and the 23rd
    // onwards are dates and nothing more.
    const rows = rowsFrom('2026-08-21')
    const named = rows.map((r) => [
      r.key,
      r.isYesterday,
      r.isToday,
      r.isTomorrow,
    ])
    expect(named).toEqual([
      ['2026-08-20', true, false, false],
      ['2026-08-21', false, true, false],
      ['2026-08-22', false, false, true],
      ['2026-08-23', false, false, false],
      ['2026-08-24', false, false, false],
      ['2026-08-25', false, false, false],
      ['2026-08-26', false, false, false],
    ])
  })

  it('marks the days already behind the reader', () => {
    // Read on the 24th: the 20th to the 23rd are spent, the 24th is today, and
    // the sprint runs on past it.
    const rows = rowsFrom('2026-08-24')
    const past = rows.filter((r) => r.isPast).map((r) => r.key)
    expect(past).toEqual([
      '2026-08-20',
      '2026-08-21',
      '2026-08-22',
      '2026-08-23',
    ])
    expect(rows.find((r) => r.key === '2026-08-24')!.isPast).toBe(false)
    expect(rows.find((r) => r.key === '2026-08-26')!.isPast).toBe(false)
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

describe('agendaBlocks', () => {
  /** The blocks as `kind:key` pairs, which is all the ordering questions need. */
  const shape = (today: string) =>
    agendaBlocks(events, d(today), undefined, d(today)).map(
      (b) => `${b.kind}:${b.key.split(':')[1]}`,
    )

  it('opens a week label above the first card of each week', () => {
    // Aug 20, 21 and 22 are the Thursday, Friday and Saturday of the week
    // starting Sunday the 16th; the 23rd onwards run into the next.
    expect(shape('2026-08-20')).toEqual([
      'week:2026-08-16',
      'day:2026-08-20',
      'day:2026-08-21',
      'day:2026-08-22',
      'week:2026-08-23',
      'day:2026-08-23',
      'day:2026-08-24',
      'day:2026-08-25',
      'day:2026-08-26',
    ])
  })

  it('names the week under way and the one either side of it', () => {
    // Read on Aug 27, a Thursday: the events run over the weeks of the 16th,
    // 23rd and 30th, so the list holds last week, this week and next.
    const weeks = agendaBlocks(
      [
        ...events,
        {
          id: 'later',
          fromDate: '2026-09-01',
          toDate: '2026-09-01',
          fromTime: '09:00',
          toTime: '10:00',
        },
      ],
      d('2026-08-27'),
      undefined,
      d('2026-08-27'),
    ).filter((b) => b.kind === 'week')
    expect(
      weeks.map((w) =>
        w.kind === 'week' ? [w.key, w.isPrevious, w.isCurrent, w.isNext] : null,
      ),
    ).toEqual([
      ['week:2026-08-16', true, false, false],
      ['week:2026-08-23', false, true, false],
      ['week:2026-08-30', false, false, true],
    ])
  })

  it('marks the weeks that are wholly behind the reader', () => {
    // Read on Aug 24, a Monday: the week of the 16th ended on Saturday the
    // 22nd, and the week the 24th falls in has not.
    const weeks = agendaBlocks(
      events,
      d('2026-08-24'),
      undefined,
      d('2026-08-24'),
    ).filter((b) => b.kind === 'week')
    expect(
      weeks.map((w) =>
        w.kind === 'week' ? [w.key, w.isPast, w.isCurrent] : null,
      ),
    ).toEqual([
      ['week:2026-08-16', true, false],
      ['week:2026-08-23', false, true],
    ])
  })

  it('has nothing to draw when no day is listed', () => {
    expect(
      agendaBlocks([], d('2026-08-20'), undefined, d('2026-08-20')),
    ).toEqual([])
  })
})

describe('agendaRangeLabel', () => {
  it('names the month once when both ends share it', () => {
    expect(agendaRangeLabel(d('2026-09-06'), d('2026-09-12'))).toBe(
      'Sep 6 – 12',
    )
  })

  it('names both when the range crosses a month end', () => {
    expect(agendaRangeLabel(d('2026-09-27'), d('2026-10-03'))).toBe(
      'Sep 27 – Oct 3',
    )
  })
})
