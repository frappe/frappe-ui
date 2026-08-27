import { describe, expect, it } from 'vitest'
import {
  addDays,
  barsInColumn,
  daySegments,
  daysBetween,
  eventDays,
  isAllDayLike,
  isOvernight,
  layoutRow,
  shiftEventDays,
  shiftEventMinutes,
  stripPlacement,
} from './eventSpan'
import type { CalendarEvent } from './types'

const week = [3, 4, 5, 6, 7, 8, 9].map((d) => new Date(2026, 7, d)) // Mon 3 Aug – Sun 9 Aug

const timed = (
  id: string,
  fromDate: string,
  fromTime: string,
  toDate: string,
  toTime: string,
): CalendarEvent => ({ id, fromDate, toDate, fromTime, toTime })

const fullDay = (
  id: string,
  fromDate: string,
  toDate = fromDate,
): CalendarEvent => ({
  id,
  fromDate,
  toDate,
  isFullDay: true,
})

describe('day arithmetic', () => {
  it('adds and subtracts days across month ends', () => {
    expect(addDays('2026-08-31', 1)).toBe('2026-09-01')
    expect(addDays('2026-03-01', -1)).toBe('2026-02-28')
    expect(daysBetween('2026-08-30', '2026-09-02')).toBe(3)
    expect(daysBetween('2026-09-02', '2026-08-30')).toBe(-3)
  })

  it('is not thrown off by a DST transition', () => {
    // Whole-day rounding: a 23h or 25h day still counts as one.
    expect(daysBetween('2026-03-07', '2026-03-09')).toBe(2)
    expect(daysBetween('2026-10-31', '2026-11-02')).toBe(2)
  })
})

describe('eventDays', () => {
  it('reads a single-day event as one day', () => {
    expect(
      eventDays(timed('a', '2026-08-04', '10:00', '2026-08-04', '11:00')),
    ).toEqual({
      start: '2026-08-04',
      end: '2026-08-04',
    })
  })

  it('does not occupy the day a timed event ends at midnight', () => {
    expect(
      eventDays(timed('a', '2026-08-04', '22:00', '2026-08-05', '00:00')),
    ).toEqual({
      start: '2026-08-04',
      end: '2026-08-04',
    })
  })

  it('keeps a full-day event on every listed day', () => {
    expect(eventDays(fullDay('a', '2026-08-04', '2026-08-06'))).toEqual({
      start: '2026-08-04',
      end: '2026-08-06',
    })
  })

  it('falls back to `date` and clamps an end before the start', () => {
    expect(eventDays({ id: 'a', date: '2026-08-04' })).toEqual({
      start: '2026-08-04',
      end: '2026-08-04',
    })
    expect(
      eventDays(timed('a', '2026-08-04', '10:00', '2026-08-02', '11:00')),
    ).toEqual({
      start: '2026-08-04',
      end: '2026-08-04',
    })
  })
})

describe('classification', () => {
  it('calls a late evening overnight, not a span', () => {
    const event = timed('a', '2026-08-04', '22:00', '2026-08-05', '02:00')
    expect(isOvernight(event)).toBe(true)
    expect(isAllDayLike(event)).toBe(false)
  })

  it('sends a timed event of a day or more to the all-day row', () => {
    const event = timed('a', '2026-08-04', '10:00', '2026-08-05', '15:00')
    expect(isOvernight(event)).toBe(false)
    expect(isAllDayLike(event)).toBe(true)
  })

  it('treats full-day events as all-day whatever their times say', () => {
    expect(
      isAllDayLike({
        ...fullDay('a', '2026-08-04'),
        fromTime: '00:00',
        toTime: '02:00',
      }),
    ).toBe(true)
    expect(isOvernight(fullDay('a', '2026-08-04', '2026-08-05'))).toBe(false)
  })

  it('leaves a single-day timed event out of the all-day row', () => {
    expect(
      isAllDayLike(timed('a', '2026-08-04', '10:00', '2026-08-04', '11:00')),
    ).toBe(false)
  })
})

describe('daySegments', () => {
  it('returns a single-day event as one piece', () => {
    const [seg] = daySegments(
      timed('a', '2026-08-04', '10:00', '2026-08-04', '11:00'),
    )
    expect(seg).toMatchObject({
      date: '2026-08-04',
      segFromTime: '10:00',
      segToTime: '11:00',
      segIsStart: true,
      segIsEnd: true,
    })
  })

  it('cuts an overnight event at midnight and leaves its own times alone', () => {
    const segs = daySegments(
      timed('a', '2026-08-04', '22:00', '2026-08-05', '02:00'),
    )
    expect(segs).toHaveLength(2)
    expect(segs[0]).toMatchObject({
      date: '2026-08-04',
      segFromTime: '22:00',
      segToTime: '24:00',
      segIsStart: true,
      segIsEnd: false,
      fromTime: '22:00',
      toTime: '02:00',
    })
    expect(segs[1]).toMatchObject({
      date: '2026-08-05',
      segFromTime: '00:00',
      segToTime: '02:00',
      segIsStart: false,
      segIsEnd: true,
    })
  })

  it('runs a midnight-ending event to the end of its last day', () => {
    const segs = daySegments(
      timed('a', '2026-08-04', '22:00', '2026-08-05', '00:00'),
    )
    expect(segs).toHaveLength(1)
    expect(segs[0]).toMatchObject({ segFromTime: '22:00', segToTime: '24:00' })
  })

  it('keeps a same-day event ending at 00:00 as written', () => {
    const [seg] = daySegments(
      timed('a', '2026-08-04', '00:00', '2026-08-04', '00:00'),
    )
    expect(seg).toMatchObject({ segFromTime: '00:00', segToTime: '00:00' })
  })
})

describe('layoutRow', () => {
  it('clips a bar to the row and marks which ends are real', () => {
    const { bars } = layoutRow([fullDay('a', '2026-08-01', '2026-08-05')], week)
    expect(bars).toHaveLength(1)
    expect(bars[0]).toMatchObject({
      startCol: 0,
      endCol: 2,
      isStart: false,
      isEnd: true,
    })
  })

  it('drops events outside the row', () => {
    const { bars, laneCount } = layoutRow(
      [fullDay('a', '2026-08-01', '2026-08-02'), fullDay('b', '2026-08-10')],
      week,
    )
    expect(bars).toHaveLength(0)
    expect(laneCount).toBe(0)
  })

  it('keeps a spanning bar in one lane and tucks single days beneath it', () => {
    const { bars, laneCount } = layoutRow(
      [
        timed('short', '2026-08-04', '09:00', '2026-08-04', '10:00'),
        fullDay('long', '2026-08-03', '2026-08-06'),
        fullDay('after', '2026-08-07'),
      ],
      week,
    )
    const byId = Object.fromEntries(bars.map((b) => [b.event.id, b]))
    expect(byId.long.lane).toBe(0)
    expect(byId.short.lane).toBe(1)
    // The lane above is free again once the long bar ends.
    expect(byId.after.lane).toBe(0)
    expect(laneCount).toBe(2)
  })

  it('places the longer of two bars starting the same day first', () => {
    const { bars } = layoutRow(
      [
        fullDay('two', '2026-08-04', '2026-08-05'),
        fullDay('four', '2026-08-04', '2026-08-07'),
      ],
      week,
    )
    const byId = Object.fromEntries(bars.map((b) => [b.event.id, b]))
    expect(byId.four.lane).toBe(0)
    expect(byId.two.lane).toBe(1)
  })

  it('orders same-day single events full-day first, then by start time', () => {
    const { bars } = layoutRow(
      [
        timed('late', '2026-08-04', '15:00', '2026-08-04', '16:00'),
        timed('early', '2026-08-04', '09:00', '2026-08-04', '10:00'),
        fullDay('whole', '2026-08-04'),
      ],
      week,
    )
    expect(bars.map((b) => b.event.id)).toEqual(['whole', 'early', 'late'])
    expect(bars.map((b) => b.lane)).toEqual([0, 1, 2])
  })

  it('occupies only the days a midnight-ending event covers', () => {
    const { bars } = layoutRow(
      [timed('a', '2026-08-04', '20:00', '2026-08-05', '00:00')],
      week,
    )
    expect(bars[0]).toMatchObject({ startCol: 1, endCol: 1 })
  })

  it('lists the bars touching a column', () => {
    const { bars } = layoutRow(
      [
        fullDay('a', '2026-08-03', '2026-08-05'),
        fullDay('b', '2026-08-05', '2026-08-06'),
      ],
      week,
    )
    expect(barsInColumn(bars, 2).map((b) => b.event.id)).toEqual(['a', 'b'])
    expect(barsInColumn(bars, 3).map((b) => b.event.id)).toEqual(['b'])
    expect(barsInColumn(bars, 0).map((b) => b.event.id)).toEqual(['a'])
  })
})

describe('shiftEventDays', () => {
  it('moves both ends and rebuilds the datetime strings', () => {
    const event = shiftEventDays(
      timed('a', '2026-08-04', '22:00', '2026-08-06', '02:00'),
      3,
    )
    expect(event).toMatchObject({
      date: '2026-08-07',
      fromDate: '2026-08-07',
      toDate: '2026-08-09',
      fromDateTime: '2026-08-07 22:00',
      toDateTime: '2026-08-09 02:00',
    })
  })
})

describe('shiftEventMinutes', () => {
  it('moves both ends within the day', () => {
    const event = shiftEventMinutes(
      timed('a', '2026-08-04', '10:00', '2026-08-04', '11:30'),
      45,
    )
    expect(event).toMatchObject({
      fromDate: '2026-08-04',
      toDate: '2026-08-04',
      fromTime: '10:45:00',
      toTime: '12:15:00',
      fromDateTime: '2026-08-04 10:45:00',
      toDateTime: '2026-08-04 12:15:00',
    })
  })

  it('rolls an end over midnight onto the next day', () => {
    const event = shiftEventMinutes(
      timed('a', '2026-08-04', '22:00', '2026-08-04', '23:00'),
      120,
    )
    expect(event).toMatchObject({
      fromDate: '2026-08-05',
      toDate: '2026-08-05',
      fromTime: '00:00:00',
      toTime: '01:00:00',
    })
  })

  it('pulls an overnight tail back onto the first day', () => {
    const event = shiftEventMinutes(
      timed('a', '2026-08-04', '22:00', '2026-08-05', '02:00'),
      -180,
    )
    expect(event).toMatchObject({
      date: '2026-08-04',
      fromDate: '2026-08-04',
      toDate: '2026-08-04',
      fromTime: '19:00:00',
      toTime: '23:00:00',
    })
  })
})

describe('stripPlacement', () => {
  it('removes the fields the views attach', () => {
    const [seg] = daySegments(
      timed('a', '2026-08-04', '10:00', '2026-08-04', '11:00'),
    )
    expect(stripPlacement(seg)).toEqual({
      id: 'a',
      date: '2026-08-04',
      fromDate: '2026-08-04',
      toDate: '2026-08-04',
      fromTime: '10:00',
      toTime: '11:00',
    })
  })
})
