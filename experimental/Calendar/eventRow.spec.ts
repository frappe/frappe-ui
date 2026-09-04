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
    expect(rowTiming(standup, date, now('10:30'))).toEqual({
      label: 'Now',
      theme: 'blue',
    })
  })

  it('marks one about to start', () => {
    expect(rowTiming(standup, date, now('09:45'))).toEqual({
      label: 'Soon',
      theme: 'amber',
    })
  })

  // Two states, not a countdown: an hour out is as far as the tag reaches, and
  // beyond that the time beside it says everything a count would.
  it('says nothing about an event further off than an hour', () => {
    expect(rowTiming(standup, date, now('08:59'))).toBeNull()
    expect(rowTiming(standup, date, now('07:00'))).toBeNull()
  })

  it('says soon for anything inside the hour before it', () => {
    expect(rowTiming(standup, date, now('09:45'))?.label).toBe('Soon')
    expect(rowTiming(standup, date, now('09:00'))?.label).toBe('Soon')
    expect(rowTiming(standup, date, now('08:59'))).toBeNull()
  })

  it('says nothing about an event already over', () => {
    expect(rowTiming(standup, date, now('12:00'))).toBeNull()
  })

  // An all-day event is not at any point in the day, so it is never under way.
  it('leaves an all-day event alone', () => {
    expect(rowTiming(allDay, date, now('10:30'))).toBeNull()
  })

  // A timed event over two days is drawn as an all-day bar, but it is running
  // all the same, and each of its rows is measured by its own part of it.
  it('marks a timed stay under way on either of its days', () => {
    const stay: CalendarEvent = {
      id: 'stay',
      fromDate: '2026-08-20',
      toDate: '2026-08-21',
      fromTime: '18:00',
      toTime: '19:00',
    }
    const second = new Date(2026, 7, 21)
    expect(rowTiming(stay, date, now('18:30'))?.label).toBe('Now')
    expect(rowTiming(stay, date, now('17:15'))?.label).toBe('Soon')
    expect(
      rowTiming(stay, second, new Date('2026-08-21T03:00:00'))?.label,
    ).toBe('Now')
    expect(
      rowTiming(stay, second, new Date('2026-08-21T20:00:00')),
    ).toBeNull()
  })

  // The timing tag reads beside the time; the tags after the title are the
  // event's own state, and a draft stays a draft whatever the clock says.
  it('is separate from the row tags', () => {
    expect(rowTags(standup, date, now('10:30'))).toEqual([])
    expect(rowTags({ ...standup, isDraft: true }, date, now('10:30'))).toEqual([
      { label: 'Draft' },
    ])
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

  // A timed event over two days is drawn as an all-day bar, but it still
  // starts and ends at a time, and each row says the part that is its own.
  it('gives the start on the first day of a timed stay', () => {
    const overnight: CalendarEvent = {
      id: 'stay',
      fromDate: '2026-08-17',
      toDate: '2026-08-18',
      fromTime: '18:00',
      toTime: '19:00',
    }
    expect(rowTimeLabel(overnight, '12h', day(17))).toBe('From 6 pm')
    expect(rowTimeLabel(overnight, '12h', day(18))).toBe('Ends 7 pm')
  })

  it('owns the day only when it has no clock of its own', () => {
    const stay: CalendarEvent = {
      id: 'offsite',
      fromDate: '2026-08-17',
      toDate: '2026-08-19',
      isFullDay: true,
    }
    expect(rowTimeLabel(stay, '12h', day(18))).toBe('All day')
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

describe('hasEnded', () => {
  const day = new Date(2026, 7, 20)
  const standup = at('standup', '10:00', '11:00')
  const overnight: CalendarEvent = {
    id: 'afterparty',
    fromDate: '2026-08-20',
    toDate: '2026-08-21',
    fromTime: '23:00',
    toTime: '02:00',
  }

  it('is over once its end has passed', () => {
    expect(hasEnded(standup, day, now('11:01'))).toBe(true)
    expect(hasEnded(standup, day, now('11:00'))).toBe(true)
    expect(hasEnded(standup, day, now('10:59'))).toBe(false)
  })

  // A day already spent is over whatever is on it.
  it('is over on a day behind today', () => {
    const yesterday = new Date(2026, 7, 19)
    expect(hasEnded(standup, yesterday, now('08:00'))).toBe(true)
  })

  it('is not over on a day still to come', () => {
    const tomorrow = new Date(2026, 7, 21)
    expect(hasEnded(standup, tomorrow, now('23:59'))).toBe(false)
  })

  // The day you are in is not behind you, however late it is.
  it('leaves an all-day event alone on today', () => {
    expect(hasEnded(allDay, day, now('23:00'))).toBe(false)
  })

  // It runs on into tomorrow, so it has not ended on this row.
  it('leaves an event that runs past the day alone', () => {
    expect(hasEnded(overnight, day, now('23:30'))).toBe(false)
  })
})

describe('daySpan', () => {
  const stay: CalendarEvent = {
    id: 'offsite',
    fromDate: '2026-08-19',
    toDate: '2026-08-21',
    isFullDay: true,
  }

  it('counts the day within the stay', () => {
    expect(daySpan(stay, new Date(2026, 7, 19))).toBe('Day 1/3')
    expect(daySpan(stay, new Date(2026, 7, 20))).toBe('Day 2/3')
    expect(daySpan(stay, new Date(2026, 7, 21))).toBe('Day 3/3')
  })

  it('says nothing about an event that fits in one day', () => {
    expect(daySpan(at('standup', '10:00', '11:00'), new Date(2026, 7, 20))).toBe(
      null,
    )
  })

  it('says nothing for a date outside the stay', () => {
    expect(daySpan(stay, new Date(2026, 7, 22))).toBe(null)
  })
})
