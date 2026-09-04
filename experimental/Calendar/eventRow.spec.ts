import { describe, expect, it } from 'vitest'
import {
  daySpan,
  hasEnded,
  rowTags,
  rowTimeLabel,
  rowTiming,
} from './eventRow'
import type { CalendarEvent } from './types'

const at = (id: string, fromTime: string, toTime: string): CalendarEvent => ({
  id,
  fromDate: '2026-08-20',
  toDate: '2026-08-20',
  fromTime,
  toTime,
})

const allDay: CalendarEvent = {
  id: 'mural',
  fromDate: '2026-08-20',
  toDate: '2026-08-20',
  isFullDay: true,
}

const now = (time: string) => new Date(`2026-08-20T${time}:00`)

describe('rowTiming', () => {
  const date = new Date('2026-08-20T00:00:00')
  const standup = at('standup', '10:00', '11:00')

  it('marks an event under way', () => {
    expect(rowTags(standup, date, now('10:30'))).toEqual([
      { label: 'Now', theme: 'amber' },
    ])
  })

  it('marks one about to start in the same colour', () => {
    expect(rowTags(standup, date, now('09:45'))).toEqual([
      { label: 'Soon', theme: 'amber' },
    ])
  })

  // Two ways of saying "this one, now" would be one too many.
  it('never says both at once', () => {
    const tags = rowTags(standup, date, now('10:30'))
    expect(tags.filter((t) => t.theme === 'amber')).toHaveLength(1)
  })

  it('says nothing about an event already over', () => {
    expect(rowTags(standup, date, now('12:00'))).toEqual([])
  })

  // An all-day event is not at any point in the day, so it is never under way.
  it('leaves an all-day event alone', () => {
    expect(rowTags(allDay, date, now('10:30'))).toEqual([])
  })
})

describe('rowTimeLabel', () => {
  const afterparty: CalendarEvent = {
    id: 'afterparty',
    fromDate: '2026-08-17',
    toDate: '2026-08-18',
    fromTime: '23:00',
    toTime: '02:00',
  }
  const conference: CalendarEvent = {
    id: 'conference',
    fromDate: '2026-08-17',
    toDate: '2026-08-19',
    fromTime: '09:00',
    toTime: '17:00',
  }
  const day = (d: number) => new Date(2026, 7, d)

  it('gives the range on the day the event starts', () => {
    expect(rowTimeLabel(afterparty, '12h', day(17))).toBe('11 pm – 2 am')
  })

  it('gives the end on the day it finishes', () => {
    expect(rowTimeLabel(afterparty, '12h', day(18))).toBe('Ends 2 am')
  })

  it('owns a day it neither starts nor ends on', () => {
    expect(rowTimeLabel(conference, '12h', day(18))).toBe('All day')
  })

  it('falls back to the whole range without a date', () => {
    expect(rowTimeLabel(afterparty, '12h')).toBe('11 pm – 2 am')
  })
})
