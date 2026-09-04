import { describe, expect, it } from 'vitest'
import { nowRowIndex, rowTags } from './eventRow'
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

describe('nowRowIndex', () => {
  const day = [allDay, at('standup', '10:00', '11:00'), at('av', '15:00', '16:00')]

  it('sits above the first event still to come', () => {
    expect(nowRowIndex(day, now('12:00'))).toBe(2)
  })

  // Started is started: an event under way is above the line, and wears a
  // `Now` tag to say it has not finished.
  it('sits below an event that is under way', () => {
    expect(nowRowIndex(day, now('10:30'))).toBe(2)
  })

  it('sits below every row once they have all started', () => {
    expect(nowRowIndex(day, now('17:00'))).toBe(day.length)
  })

  // An all-day event is not at any point in the day, so the line never lands
  // above one — before the day's first timed event it goes under them all.
  it('never lands above an all-day event', () => {
    expect(nowRowIndex(day, now('08:00'))).toBe(1)
  })

  it('puts a day of all-day events entirely behind the line', () => {
    expect(nowRowIndex([allDay], now('08:00'))).toBe(1)
  })
})

describe('rowTags', () => {
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
