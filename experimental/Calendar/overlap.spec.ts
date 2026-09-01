import { describe, expect, it } from 'vitest'
import { findOverlappingEventsCount } from './calendarUtils'
import type { CalendarEvent } from './types'

/** Times as minutes since midnight, the shape useCalendarData stamps on. */
const ev = (
  id: string,
  startTime: number,
  endTime: number,
  extra: Partial<CalendarEvent> = {},
): CalendarEvent => ({ id, startTime, endTime, ...extra })

interface Placement {
  hall?: number
  of?: number
}

const placed = (events: CalendarEvent[]): Record<string, Placement> =>
  Object.fromEntries(
    findOverlappingEventsCount(events).map((e) => [
      String(e.id),
      { hall: e.hallNumber, of: e.hallCount },
    ]),
  )

describe('findOverlappingEventsCount', () => {
  it('gives a lone event the whole column', () => {
    expect(placed([ev('a', 600, 660)])).toEqual({ a: { hall: 0, of: 1 } })
  })

  it('splits two overlapping events into two columns', () => {
    expect(placed([ev('a', 660, 780), ev('b', 660, 720)])).toEqual({
      a: { hall: 0, of: 2 },
      b: { hall: 1, of: 2 },
    })
  })

  // The point of counting per cluster: a busy morning must not narrow a lone
  // afternoon event. Before this, hallCount was the whole day's hall count.
  it('counts columns per overlap cluster, not per day', () => {
    const rows = placed([
      ev('morning-1', 540, 660),
      ev('morning-2', 540, 600),
      ev('afternoon', 900, 960),
    ])
    expect(rows['morning-1']).toEqual({ hall: 0, of: 2 })
    expect(rows['morning-2']).toEqual({ hall: 1, of: 2 })
    expect(rows['afternoon']).toEqual({ hall: 0, of: 1 })
  })

  // A and C never meet, but B overlaps both, so all three share a width.
  it('joins a cluster transitively through the event in the middle', () => {
    const rows = placed([
      ev('a', 540, 600),
      ev('b', 570, 690),
      ev('c', 660, 720),
    ])
    expect(rows['a']!.of).toBe(2)
    expect(rows['b']!.of).toBe(2)
    expect(rows['c']!.of).toBe(2)
    expect(rows['c']!.hall).toBe(0)
  })

  it('treats touching events as consecutive, not concurrent', () => {
    expect(placed([ev('a', 540, 600), ev('b', 600, 660)])).toEqual({
      a: { hall: 0, of: 1 },
      b: { hall: 0, of: 1 },
    })
  })

  it('leaves a declined event full width and beneath the rest', () => {
    const result = findOverlappingEventsCount([
      ev('yes', 660, 780),
      ev('no', 660, 720, { isDeclined: true }),
    ])
    // Declined first, so DOM order puts it under the events it underlies.
    expect(result[0]!.id).toBe('no')
    expect(result[0]!.hallNumber).toBe(0)
    expect(result[0]!.hallCount).toBe(1)
    // ...and the others lay out as if it were not there.
    expect(result[1]).toMatchObject({ id: 'yes', hallNumber: 0, hallCount: 1 })
  })

  it('stacks four concurrent events into four columns', () => {
    const rows = placed([
      ev('a', 600, 720),
      ev('b', 600, 720),
      ev('c', 600, 720),
      ev('d', 600, 720),
    ])
    const placements = Object.values(rows)
    expect(placements.map((p) => p.of)).toEqual([4, 4, 4, 4])
    expect(placements.map((p) => p.hall).sort()).toEqual([0, 1, 2, 3])
  })
})
