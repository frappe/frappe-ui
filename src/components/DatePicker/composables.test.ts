import { describe, expect, it } from 'vitest'
import { useDateCoercion } from './composables'

const read = (format: string | undefined, text: string) =>
  useDateCoercion(() => format)(text)?.format('YYYY-MM-DD HH:mm:ss') ?? null

describe('useDateCoercion', () => {
  it('reads numbers in the format’s day-month-year order', () => {
    for (const text of ['03-11-2026', '3-11-2026', '3/11/2026', '3.11.26'])
      expect(read('DD-MM-YYYY', text)).toBe('2026-11-03 00:00:00')
    expect(read('MM/DD/YYYY', '3/11/2026')).toBe('2026-03-11 00:00:00')
  })

  it('reads a date-time typed without seconds or without a time', () => {
    const format = 'DD-MM-YYYY HH:mm:ss'
    expect(read(format, '24-10-2026 09:15:30')).toBe('2026-10-24 09:15:30')
    expect(read(format, '24-10-2026 9:15')).toBe('2026-10-24 09:15:00')
    expect(read(format, '3/11/2026')).toBe('2026-11-03 00:00:00')
    // Only the date takes the format's separator; the time keeps its own.
    expect(read('DD-MM-YYYY HH.mm', '3/11/2026 9.15')).toBe(
      '2026-11-03 09:15:00',
    )
  })

  it('reads a 12-hour time in either AM/PM case', () => {
    for (const format of ['DD-MM-YYYY hh:mm a', 'DD-MM-YYYY hh:mm A'])
      for (const text of ['3-11-2026 9:15 PM', '3-11-2026 9:15 pm'])
        expect(read(format, text)).toBe('2026-11-03 21:15:00')
  })

  it('reads ISO text and a month name loosely', () => {
    expect(read('DD-MM-YYYY', '2026-11-03')).toBe('2026-11-03 00:00:00')
    expect(read('DD-MM-YYYY HH:mm', '2026-10-24 09:15:30')).toBe(
      '2026-10-24 09:15:30',
    )
    expect(read('DD-MM-YYYY', '2026/11/03')).toBe('2026-11-03 00:00:00')
    expect(read('DD-MM-YYYY', 'Nov 3, 2026')).toBe('2026-11-03 00:00:00')
  })

  it('rejects numbers that do not fit the format', () => {
    expect(read('DD-MM-YYYY', '24-13-2026')).toBeNull()
    expect(read('DD-MM-YYYY', '11032026')).toBeNull()
    // A loose parse read these month-first: 11 March.
    expect(read('DD-MM-YYYY', '3/11')).toBeNull()
    expect(read('DD-MM-YYYY', '3-11-2026 10:00')).toBeNull()
  })

  it('reads loosely with no format, as before', () => {
    expect(read(undefined, '2026-11-03')).toBe('2026-11-03 00:00:00')
    expect(read(undefined, '3/11/2026')).toBe('2026-03-11 00:00:00')
  })
})
