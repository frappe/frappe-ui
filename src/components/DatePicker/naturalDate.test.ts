import { describe, expect, it } from 'vitest'
import { dayjsLocal } from '../../utils/dayjs'
import { parseNaturalDate, parseNaturalRange } from './naturalDate'

// Wednesday, May 14 2025 — every call gets this fixed anchor
const now = dayjsLocal('2025-05-14')

function date(input: string, anchor = now) {
  return parseNaturalDate(input, anchor)?.format('YYYY-MM-DD') ?? null
}

function range(input: string, anchor = now) {
  const r = parseNaturalRange(input, anchor)
  return r ? r.map((d) => d.format('YYYY-MM-DD')) : null
}

describe('parseNaturalDate', () => {
  it('parses fixed keywords', () => {
    expect(date('today')).toBe('2025-05-14')
    expect(date('now')).toBe('2025-05-14')
    expect(date('tomorrow')).toBe('2025-05-15')
    expect(date('tmrw')).toBe('2025-05-15')
    expect(date('yesterday')).toBe('2025-05-13')
  })

  it('parses next/last week as the same weekday shifted a week', () => {
    expect(date('next week')).toBe('2025-05-21')
    expect(date('last week')).toBe('2025-05-07')
  })

  it('parses next/last month and year, clamped to month end', () => {
    expect(date('next month')).toBe('2025-06-14')
    expect(date('last month')).toBe('2025-04-14')
    expect(date('next year')).toBe('2026-05-14')
    expect(date('last year')).toBe('2024-05-14')
    const may31 = dayjsLocal('2025-05-31')
    expect(date('next month', may31)).toBe('2025-06-30')
    expect(date('last month', may31)).toBe('2025-04-30')
  })

  it('parses "in N units" and "N units ago"', () => {
    expect(date('in 3 days')).toBe('2025-05-17')
    expect(date('in 1 day')).toBe('2025-05-15')
    expect(date('in 2 weeks')).toBe('2025-05-28')
    expect(date('in 1 month')).toBe('2025-06-14')
    expect(date('in 1 year')).toBe('2026-05-14')
    expect(date('3 days ago')).toBe('2025-05-11')
    expect(date('1 week ago')).toBe('2025-05-07')
    expect(date('2 months ago')).toBe('2025-03-14')
    expect(date('1 year ago')).toBe('2024-05-14')
  })

  it('parses signed shorthand offsets', () => {
    expect(date('+5d')).toBe('2025-05-19')
    expect(date('-2w')).toBe('2025-04-30')
    expect(date('+1m')).toBe('2025-06-14')
    expect(date('+1y')).toBe('2026-05-14')
    expect(date('-1d')).toBe('2025-05-13')
  })

  it('parses weekday names as the next occurrence strictly after today', () => {
    expect(date('friday')).toBe('2025-05-16')
    expect(date('monday')).toBe('2025-05-19')
    expect(date('sunday')).toBe('2025-05-18')
    // now is a Wednesday — same weekday name jumps a full week
    expect(date('wednesday')).toBe('2025-05-21')
    expect(date('next friday')).toBe('2025-05-16')
    expect(date('next wednesday')).toBe('2025-05-21')
  })

  it('parses "last <weekday>" as the previous occurrence strictly before today', () => {
    expect(date('last monday')).toBe('2025-05-12')
    expect(date('last wednesday')).toBe('2025-05-07')
    expect(date('last thursday')).toBe('2025-05-08')
  })

  it('parses month-day dates, with the year defaulting to now', () => {
    expect(date('may 4')).toBe('2025-05-04')
    expect(date('4 may')).toBe('2025-05-04')
    expect(date('may 4 2025')).toBe('2025-05-04')
    expect(date('4 may 2024')).toBe('2024-05-04')
    expect(date('december 25')).toBe('2025-12-25')
    expect(date('dec 25')).toBe('2025-12-25')
    expect(date('25 december 2026')).toBe('2026-12-25')
  })

  it('rejects invalid day-of-month', () => {
    expect(date('32 may')).toBe(null)
    expect(date('may 32')).toBe(null)
    expect(date('feb 30')).toBe(null)
    expect(date('feb 29')).toBe(null) // 2025 is not a leap year
    expect(date('feb 29 2024')).toBe('2024-02-29')
    expect(date('may 0')).toBe(null)
  })

  it('parses bare ordinals as that day in the current month', () => {
    expect(date('1st')).toBe('2025-05-01')
    expect(date('2nd')).toBe('2025-05-02')
    expect(date('3rd')).toBe('2025-05-03')
    expect(date('15th')).toBe('2025-05-15')
    expect(date('23rd')).toBe('2025-05-23')
    expect(date('31st')).toBe('2025-05-31')
    expect(date('31st', dayjsLocal('2025-04-10'))).toBe(null)
  })

  it('tolerates case and extra whitespace', () => {
    expect(date('  Tomorrow ')).toBe('2025-05-15')
    expect(date('NEXT   FRIDAY')).toBe('2025-05-16')
    expect(date(' May  4  2024 ')).toBe('2024-05-04')
  })

  it('returns null for anything outside the vocabulary', () => {
    expect(date('')).toBe(null)
    expect(date('   ')).toBe(null)
    expect(date('asdf')).toBe(null)
    expect(date('next')).toBe(null)
    expect(date('this week')).toBe(null)
    expect(date('in x days')).toBe(null)
    expect(date('+5q')).toBe(null)
  })
})

describe('parseNaturalRange', () => {
  it('parses single-day keywords as a collapsed range', () => {
    expect(range('today')).toEqual(['2025-05-14', '2025-05-14'])
    expect(range('yesterday')).toEqual(['2025-05-13', '2025-05-13'])
    expect(range('tomorrow')).toEqual(['2025-05-15', '2025-05-15'])
  })

  it('parses full weeks with the locale week start', () => {
    expect(range('this week')).toEqual(['2025-05-11', '2025-05-17'])
    expect(range('last week')).toEqual(['2025-05-04', '2025-05-10'])
    expect(range('next week')).toEqual(['2025-05-18', '2025-05-24'])
  })

  it('parses full months, quarters and years', () => {
    expect(range('this month')).toEqual(['2025-05-01', '2025-05-31'])
    expect(range('last month')).toEqual(['2025-04-01', '2025-04-30'])
    expect(range('next month')).toEqual(['2025-06-01', '2025-06-30'])
    expect(range('this quarter')).toEqual(['2025-04-01', '2025-06-30'])
    expect(range('last quarter')).toEqual(['2025-01-01', '2025-03-31'])
    expect(range('this year')).toEqual(['2025-01-01', '2025-12-31'])
    expect(range('last year')).toEqual(['2024-01-01', '2024-12-31'])
  })

  it('parses rolling "last N units" and "next N units"', () => {
    expect(range('last 7 days')).toEqual(['2025-05-07', '2025-05-14'])
    expect(range('last 2 weeks')).toEqual(['2025-04-30', '2025-05-14'])
    expect(range('last 3 months')).toEqual(['2025-02-14', '2025-05-14'])
    expect(range('last 12 months')).toEqual(['2024-05-14', '2025-05-14'])
    expect(range('next 7 days')).toEqual(['2025-05-14', '2025-05-21'])
    expect(range('next 1 year')).toEqual(['2025-05-14', '2026-05-14'])
  })

  it('parses "since <date>"', () => {
    expect(range('since may 4')).toEqual(['2025-05-04', '2025-05-14'])
    expect(range('since last monday')).toEqual(['2025-05-12', '2025-05-14'])
  })

  it('parses explicit ranges with any separator', () => {
    expect(range('may 4 to next friday')).toEqual(['2025-05-04', '2025-05-16'])
    expect(range('may 4 - may 20')).toEqual(['2025-05-04', '2025-05-20'])
    expect(range('may 4 – may 20')).toEqual(['2025-05-04', '2025-05-20'])
    expect(range('may 4 — may 20')).toEqual(['2025-05-04', '2025-05-20'])
    expect(range('yesterday to tomorrow')).toEqual([
      '2025-05-13',
      '2025-05-15',
    ])
  })

  it('inherits an explicit year across the range, in both directions', () => {
    expect(range('may 4 to may 26 2024')).toEqual(['2024-05-04', '2024-05-26'])
    expect(range('may 4 2024 to may 26')).toEqual(['2024-05-04', '2024-05-26'])
  })

  it('inherits the year before validating the day of month', () => {
    // feb 29 only exists once the leap year is inherited
    expect(range('feb 29 to mar 1 2024')).toEqual(['2024-02-29', '2024-03-01'])
    expect(range('mar 1 2024 to feb 29')).toEqual(['2024-02-29', '2024-03-01'])
    expect(range('feb 29 to mar 1 2023')).toBe(null)
  })

  it('swaps reversed ranges so start <= end', () => {
    expect(range('may 20 to may 4')).toEqual(['2025-05-04', '2025-05-20'])
    expect(range('tomorrow to yesterday')).toEqual([
      '2025-05-13',
      '2025-05-15',
    ])
  })

  it('tolerates case and extra whitespace', () => {
    expect(range('  Last 2 Weeks ')).toEqual(['2025-04-30', '2025-05-14'])
    expect(range('May 4  TO  Next Friday')).toEqual([
      '2025-05-04',
      '2025-05-16',
    ])
  })

  it('returns null when any part fails to parse', () => {
    expect(range('')).toBe(null)
    expect(range('   ')).toBe(null)
    expect(range('asdf')).toBe(null)
    expect(range('may 4 to junk')).toBe(null)
    expect(range('junk to may 4')).toBe(null)
    expect(range('since junk')).toBe(null)
    expect(range('32 may to june 1')).toBe(null)
    expect(range('friday')).toBe(null) // bare weekday is not a range
  })
})
