import { describe, expect, it } from 'vitest'
import { useDateCoercion } from './composables'
import { parseRangeInput } from './utils'

function parse(raw: string, format?: string): [string | null, string | null] {
  const coerce = useDateCoercion(() => format)
  const [from, to] = parseRangeInput(raw, coerce)
  return [from?.format('YYYY-MM-DD') ?? null, to?.format('YYYY-MM-DD') ?? null]
}

describe('parseRangeInput', () => {
  it('splits an ISO range on "to"', () => {
    expect(parse('2025-01-01 to 2025-02-03')).toEqual([
      '2025-01-01',
      '2025-02-03',
    ])
  })

  it('splits on " - "', () => {
    expect(parse('2025-01-01 - 2025-02-03')).toEqual([
      '2025-01-01',
      '2025-02-03',
    ])
  })

  it('still splits an ISO range on a comma', () => {
    expect(parse('2025-01-01, 2025-02-03')).toEqual([
      '2025-01-01',
      '2025-02-03',
    ])
  })

  it('reads one date as the start of a range', () => {
    expect(parse('2025-01-01')).toEqual(['2025-01-01', null])
  })

  it('returns no dates for empty input', () => {
    expect(parse('   ')).toEqual([null, null])
  })

  describe('with a format that contains a comma', () => {
    const format = 'MMM DD, YYYY'

    it('keeps the comma inside each date', () => {
      expect(parse('Oct 03, 2025 to Oct 03, 2026', format)).toEqual([
        '2025-10-03',
        '2026-10-03',
      ])
    })

    it('keeps the comma inside each date when split on " - "', () => {
      expect(parse('Oct 03, 2025 - Oct 03, 2026', format)).toEqual([
        '2025-10-03',
        '2026-10-03',
      ])
    })

    it('reads one date as the start of a range', () => {
      expect(parse('Oct 03, 2025', format)).toEqual(['2025-10-03', null])
    })
  })
})
