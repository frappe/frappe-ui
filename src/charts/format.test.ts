import { describe, expect, it } from 'vitest'
import { chartFont, measureTextWidth } from './measureText'
import {
  estimateTextWidth,
  formatAxisValue,
  formatDate,
  formatLabel,
  formatPercent,
  formatTimeAxisLabel,
  formatValue,
  inferTimeGrain,
  isTemporal,
  truncateMiddle,
  truncateMiddleToWidth,
} from './format'

describe('formatLabel', () => {
  it('turns snake_case keys into titles', () => {
    expect(formatLabel('total_sales')).toBe('Total Sales')
    expect(formatLabel('sales')).toBe('Sales')
    expect(formatLabel('')).toBe('')
  })
})

describe('truncateMiddle', () => {
  it('leaves a label that already fits alone', () => {
    expect(truncateMiddle('Direct', 10)).toBe('Direct')
    expect(truncateMiddle('Events', 6)).toBe('Events')
    expect(truncateMiddle('', 3)).toBe('')
  })

  it('drops the middle and never exceeds the budget', () => {
    expect(truncateMiddle('Referral Partners', 9)).toBe('Refe…ners')
    expect(truncateMiddle('Referral Partners', 8)).toBe('Refe…ers')
  })

  it('keeps the tail that tells labels sharing a prefix apart', () => {
    expect(truncateMiddle('Social — Organic', 10)).toBe('Socia…anic')
    expect(truncateMiddle('Social — Paid', 10)).toBe('Socia…Paid')
  })

  it('degrades to the ellipsis alone once there is no room for both ends', () => {
    expect(truncateMiddle('Marketplace', 2)).toBe('M…')
    expect(truncateMiddle('Marketplace', 1)).toBe('…')
    expect(truncateMiddle('Marketplace', 0)).toBe('…')
  })
})

// This file runs under node, so there is no DOM to measure in and every width
// below comes from the character table. The measured path is covered in
// measureText.test.ts.
describe('estimateTextWidth (character-table fallback)', () => {
  it('is the path taken when there is nothing to measure in', () => {
    expect(typeof document).toBe('undefined')
    expect(measureTextWidth('Direct', chartFont(11))).toBeNull()
    expect(estimateTextWidth('Direct', 11)).toBeGreaterThan(0)
  })

  it('reads capitals as wider than lowercase of the same length', () => {
    expect(estimateTextWidth('EMEA', 11)).toBeGreaterThan(
      estimateTextWidth('emea', 11),
    )
    expect(estimateTextWidth('llll', 11)).toBeLessThan(
      estimateTextWidth('mmmm', 11),
    )
  })

  it('scales with the font size', () => {
    expect(estimateTextWidth('Direct', 22)).toBe(
      estimateTextWidth('Direct', 11) * 2,
    )
    expect(estimateTextWidth('', 11)).toBe(0)
  })
})

describe('truncateMiddleToWidth (character-table fallback)', () => {
  const fits = (text: string, width: number) =>
    estimateTextWidth(text, 11) <= width

  it('leaves a label that already draws inside the cap alone', () => {
    expect(truncateMiddleToWidth('Direct', 185, 11)).toBe('Direct')
  })

  it('shortens until the result really fits, capitals and all', () => {
    const wide = truncateMiddleToWidth(
      'Paid Search — Brand Campaigns (EMEA)',
      88,
      11,
    )
    expect(wide).toContain('…')
    expect(fits(wide, 88)).toBe(true)

    const plain = truncateMiddleToWidth(
      'Referral Partners and Affiliate Network',
      88,
      11,
    )
    expect(fits(plain, 88)).toBe(true)
  })

  it('keeps more of a narrow label than of a wide one at the same cap', () => {
    const narrow = truncateMiddleToWidth('lililililililililili', 40, 11)
    const wide = truncateMiddleToWidth('WMWMWMWMWMWMWMWMWMWM', 40, 11)
    expect(narrow.length).toBeGreaterThan(wide.length)
  })

  it('falls back to the ellipsis alone when nothing fits', () => {
    expect(truncateMiddleToWidth('Marketplace Listings', 1, 11)).toBe('…')
  })
})

describe('formatValue', () => {
  it('groups thousands and keeps whole numbers whole', () => {
    expect(formatValue(1234)).toBe('1,234')
  })

  it('keeps at most two guessed decimals', () => {
    expect(formatValue(1.5)).toBe('1.5')
    expect(formatValue(1.23456)).toBe('1.23')
  })

  it('honours an explicit precision', () => {
    expect(formatValue(1.5, 2)).toBe('1.50')
    expect(formatValue(1.567, 0)).toBe('2')
  })

  it('shortens large numbers for axis ticks', () => {
    expect(formatValue(1500, 1, true)).toBe('1.5K')
    expect(formatValue(2_400_000, 1, true)).toBe('2.4M')
  })

  it('renders nothing for missing values', () => {
    expect(formatValue(NaN)).toBe('')
    expect(formatValue(null as unknown as number)).toBe('')
  })
})

describe('formatDate', () => {
  it('picks a format per time grain', () => {
    expect(formatDate('2024-03-15', 'day')).toBe('Mar 15, 2024')
    expect(formatDate('2024-03-15', 'month')).toBe('Mar 2024')
    expect(formatDate('2024-03-15', 'quarter')).toBe('Q1 2024')
    expect(formatDate('2024-03-15', 'year')).toBe('2024')
  })

  it('falls back to the raw value when the date is unparseable', () => {
    expect(formatDate('not-a-date')).toBe('not-a-date')
    expect(formatDate('')).toBe('')
  })
})

describe('formatPercent', () => {
  it('rounds, and keeps a sliver from reading as nothing', () => {
    expect(formatPercent(0)).toBe('0%')
    expect(formatPercent(0.4)).toBe('<1%')
    expect(formatPercent(12.4)).toBe('12%')
    expect(formatPercent(12.6)).toBe('13%')
    expect(formatPercent(100)).toBe('100%')
  })
})

describe('formatAxisValue', () => {
  it('leaves category values alone', () => {
    expect(formatAxisValue('Jan', 'category')).toBe('Jan')
    expect(formatAxisValue(null, 'category')).toBe('')
  })

  it('formats time values by grain', () => {
    expect(formatAxisValue('2024-03-15', 'time', 'month')).toBe('Mar 2024')
  })
})

describe('isTemporal', () => {
  it('recognises dates and ISO date strings', () => {
    expect(isTemporal([new Date('2024-01-01'), new Date('2024-02-01')])).toBe(
      true,
    )
    expect(isTemporal(['2024-01-01', '2024-02-01T09:30'])).toBe(true)
  })

  it('ignores gaps but needs at least one value', () => {
    expect(isTemporal([null, '2024-01-01', undefined, ''])).toBe(true)
    expect(isTemporal([])).toBe(false)
    expect(isTemporal([null, ''])).toBe(false)
  })

  it('leaves labels that merely look date-ish as categories', () => {
    expect(isTemporal(['Q1 2024', 'Q2 2024'])).toBe(false)
    expect(isTemporal(['Jan', 'Feb'])).toBe(false)
    expect(isTemporal([2023, 2024])).toBe(false)
    // One stray label is enough: the column is not a clean set of dates.
    expect(isTemporal(['2024-01-01', 'Unknown'])).toBe(false)
  })
})

describe('inferTimeGrain', () => {
  function every(step: number, unit: 'hour' | 'day', count = 5) {
    const ms = unit === 'hour' ? 3600e3 : 86400e3
    return Array.from(
      { length: count },
      (_, i) => new Date(Date.UTC(2024, 0, 1) + i * step * ms),
    )
  }

  it('reads the grain off the spacing between rows', () => {
    expect(inferTimeGrain(every(1, 'hour'))).toBe('hour')
    expect(inferTimeGrain(every(1, 'day'))).toBe('day')
    expect(inferTimeGrain(every(7, 'day'))).toBe('week')
    expect(inferTimeGrain(every(30, 'day'))).toBe('month')
    expect(inferTimeGrain(every(91, 'day'))).toBe('quarter')
    expect(inferTimeGrain(every(365, 'day'))).toBe('year')
  })

  it('is not thrown off by a single missing period', () => {
    const monthly = [
      new Date('2024-01-01'),
      new Date('2024-02-01'),
      // March is missing.
      new Date('2024-04-01'),
      new Date('2024-05-01'),
    ]
    expect(inferTimeGrain(monthly)).toBe('month')
  })

  it('falls back to days when there is no spacing to measure', () => {
    expect(inferTimeGrain([])).toBe('day')
    expect(inferTimeGrain([new Date('2024-01-01')])).toBe('day')
  })
})

describe('formatTimeAxisLabel', () => {
  it('names each tick by the coarsest unit it lands on', () => {
    expect(formatTimeAxisLabel('2023-01-01', 'month')).toBe('2023')
    expect(formatTimeAxisLabel('2023-04-01', 'month')).toBe('Apr')
    expect(formatTimeAxisLabel('2023-04-05', 'day')).toBe('5')
    expect(formatTimeAxisLabel('2023-04-05 06:00', 'hour')).toBe('06:00')
  })

  it('marks the tick that heads a level as primary', () => {
    expect(formatTimeAxisLabel('2023-01-01', 'month', 1)).toBe('{primary|2023}')
    expect(formatTimeAxisLabel('2023-04-01', 'month', 0)).toBe('Apr')
  })

  it('leaves ticks finer than the grain unlabelled', () => {
    expect(formatTimeAxisLabel('2023-04-15', 'month')).toBe('')
    expect(formatTimeAxisLabel('2023-04-05 06:00', 'day')).toBe('')
    // A quarterly series still reads at month resolution, a weekly one at days.
    expect(formatTimeAxisLabel('2023-04-01', 'quarter')).toBe('Apr')
    expect(formatTimeAxisLabel('2023-04-05', 'week')).toBe('5')
  })

  it('says nothing about a value that is not a date', () => {
    expect(formatTimeAxisLabel('not a date', 'day')).toBe('')
  })
})
