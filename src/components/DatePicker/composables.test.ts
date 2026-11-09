import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useDateCoercion } from './composables'

describe('useDateCoercion', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 10, 5))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('defaults yearless dates to the current year', () => {
    const coerce = useDateCoercion(() => undefined)
    expect(coerce('15 oct')?.format('YYYY-MM-DD')).toBe('2026-10-15')
    expect(coerce('Oct 15')?.format('YYYY-MM-DD')).toBe('2026-10-15')
    expect(coerce('15 Oct 2025')?.format('YYYY-MM-DD')).toBe('2025-10-15')
    expect(coerce('2026-10-15')?.format('YYYY-MM-DD')).toBe('2026-10-15')
    expect(coerce('10/15/25')?.format('YYYY-MM-DD')).toBe('2025-10-15')
    expect(coerce('15 oct 14:00')?.format('YYYY-MM-DD')).toBe('2026-10-15')
    expect(coerce('')).toBeNull()
    expect(coerce('not a date')).toBeNull()

    const coerceFormatted = useDateCoercion(() => 'D MMM')
    expect(coerceFormatted('15 Oct')?.format('YYYY-MM-DD')).toBe('2026-10-15')
  })
})
