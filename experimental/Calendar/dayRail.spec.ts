import { describe, expect, it } from 'vitest'
import {
  busyIntervals,
  clearBand,
  daySummary,
  formatSpan,
  freeGaps,
  gapLabel,
  scheduledMinutes,
} from './dayRail'
import type { CalendarEvent } from './types'

const at = (
  from: string,
  to: string,
  extra: Partial<CalendarEvent> = {},
): CalendarEvent => {
  const mins = (t: string) =>
    Number(t.split(':')[0]) * 60 + Number(t.split(':')[1])
  return {
    fromDate: '2026-08-17',
    toDate: '2026-08-17',
    fromTime: from,
    toTime: to,
    startTime: mins(from),
    endTime: mins(to),
    ...extra,
  }
}

describe('busyIntervals', () => {
  it('merges overlapping and touching events into one stretch', () => {
    expect(
      busyIntervals([
        at('09:00', '10:00'),
        at('09:30', '11:00'),
        at('11:00', '12:00'),
      ]),
    ).toEqual([{ from: 540, to: 720 }])
  })

  it('leaves a real break between stretches', () => {
    expect(busyIntervals([at('09:00', '10:00'), at('14:00', '15:00')])).toEqual(
      [
        { from: 540, to: 600 },
        { from: 840, to: 900 },
      ],
    )
  })

  it('ignores all-day and declined events', () => {
    const events = [
      at('09:00', '10:00'),
      { fromDate: '2026-08-17', toDate: '2026-08-17', isFullDay: true },
      at('11:00', '12:00', { isDeclined: true }),
    ]
    expect(busyIntervals(events)).toEqual([{ from: 540, to: 600 }])
  })
})

describe('scheduledMinutes', () => {
  it('counts overlapping time once', () => {
    expect(scheduledMinutes([at('09:00', '11:00'), at('10:00', '12:00')])).toBe(
      180,
    )
  })
})

describe('freeGaps', () => {
  it('reports only the gaps inside the occupied span', () => {
    // Nothing before 9 or after 5 counts — those are the day's edges.
    expect(freeGaps([at('09:00', '10:00'), at('16:00', '17:00')])).toEqual([
      { from: 600, to: 960 },
    ])
  })

  it('drops gaps shorter than the threshold', () => {
    expect(freeGaps([at('09:00', '10:00'), at('11:00', '12:00')])).toEqual([])
    expect(freeGaps([at('09:00', '10:00'), at('11:00', '12:00')], 30)).toEqual([
      { from: 600, to: 660 },
    ])
  })
})

describe('clearBand', () => {
  it('names the afternoon when nothing is booked in it', () => {
    expect(clearBand([at('09:00', '11:00')])).toBe('afternoon')
  })

  it('prefers the earliest clear band', () => {
    expect(clearBand([at('13:00', '14:00')])).toBe('morning')
  })

  it('says nothing when every band is touched', () => {
    expect(clearBand([at('09:00', '13:00'), at('17:00', '19:00')])).toBe(null)
  })
})

describe('formatSpan', () => {
  it('spells hours and minutes', () => {
    expect(formatSpan(180)).toBe('3 h')
    expect(formatSpan(150)).toBe('2 h 30 m')
    expect(formatSpan(45)).toBe('45 m')
  })
})

describe('daySummary', () => {
  it('reads a day in one line', () => {
    expect(daySummary([at('09:00', '11:00'), at('11:00', '12:00')])).toBe(
      '2 events · 3 h scheduled · afternoon clear',
    )
  })

  it('says so when there is nothing', () => {
    expect(daySummary([])).toBe('Nothing scheduled')
  })

  it('counts a lone event in the singular', () => {
    expect(daySummary([at('09:00', '10:00')])).toMatch(/^1 event · /)
  })
})

describe('gapLabel', () => {
  it('rounds to whole hours', () => {
    expect(gapLabel({ from: 600, to: 1200 })).toBe('10 hours free')
    expect(gapLabel({ from: 600, to: 660 })).toBe('1 hour free')
    expect(gapLabel({ from: 600, to: 630 })).toBe('30 minutes free')
  })
})
