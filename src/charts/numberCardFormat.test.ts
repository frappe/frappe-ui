import { describe, expect, it } from 'vitest'
import {
  deltaDirection,
  deltaTone,
  formatCardDelta,
  formatCardValue,
} from './numberCardFormat'

describe('deltaDirection', () => {
  it('reads the sign, and treats no delta as flat', () => {
    expect(deltaDirection(4)).toBe('up')
    expect(deltaDirection(-4)).toBe('down')
    expect(deltaDirection(0)).toBe('flat')
    expect(deltaDirection(null)).toBe('flat')
    expect(deltaDirection(undefined)).toBe('flat')
    expect(deltaDirection(NaN)).toBe('flat')
  })
})

describe('deltaTone', () => {
  it('colors a rise green by default', () => {
    expect(deltaTone(4)).toBe('positive')
    expect(deltaTone(-4)).toBe('negative')
  })

  it('flips for a metric where less is better', () => {
    expect(deltaTone(4, true)).toBe('negative')
    expect(deltaTone(-4, true)).toBe('positive')
  })

  it('stays neutral with no movement to report', () => {
    expect(deltaTone(0)).toBe('neutral')
    expect(deltaTone(0, true)).toBe('neutral')
    expect(deltaTone(null)).toBe('neutral')
  })
})

describe('formatCardValue', () => {
  it('wraps the number in its prefix and suffix', () => {
    expect(formatCardValue({ prefix: '$' }, 1234.5)).toBe('$1,234.5')
    expect(formatCardValue({ suffix: ' MRR' }, 1200)).toBe('1,200 MRR')
  })

  it('shortens on request', () => {
    expect(formatCardValue({ compact: true }, 12345)).toBe('12.3K')
    expect(formatCardValue({ compact: true, prefix: '$' }, 2_400_000)).toBe(
      '$2.4M',
    )
  })

  it('honours an explicit precision', () => {
    expect(formatCardValue({ precision: 2 }, 12)).toBe('12.00')
    expect(formatCardValue({ precision: 0 }, 12.7)).toBe('13')
  })

  it('prints a string reading exactly as given', () => {
    expect(formatCardValue({ prefix: '$', suffix: ' MRR' }, '2h 14m')).toBe(
      '2h 14m',
    )
    expect(formatCardValue({ precision: 0, compact: true }, '1234.567')).toBe(
      '1234.567',
    )
  })

  it('prints nothing for a missing value', () => {
    expect(formatCardValue({ prefix: '$' }, null)).toBe('')
    expect(formatCardValue({}, undefined)).toBe('')
  })
})

describe('formatCardDelta', () => {
  it('drops the sign, which the arrow already carries', () => {
    expect(formatCardDelta({ deltaSuffix: '%' }, -3.1)).toBe('3.1%')
    expect(formatCardDelta({ deltaSuffix: '%' }, 6.4)).toBe('6.4%')
  })

  it('shortens a large delta', () => {
    expect(formatCardDelta({}, 12400)).toBe('12.4K')
  })

  it('prints nothing for a missing delta', () => {
    expect(formatCardDelta({ deltaSuffix: '%' }, null)).toBe('')
  })
})
