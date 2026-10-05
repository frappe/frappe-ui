import { describe, it, expect } from 'vitest'
import { useDateCoercion } from './composables'

function parse(format: string | undefined, input: string) {
  return (
    useDateCoercion(() => format)(input)?.format('YYYY-MM-DD HH:mm') ?? null
  )
}

describe('useDateCoercion', () => {
  it('reads an exact match of the format', () => {
    expect(parse('DD/MM/YYYY', '05/10/2026')).toBe('2026-10-05 00:00')
  })

  it('reads a day-first date typed without padding or with another separator', () => {
    for (const input of [
      '5/10/2026',
      '05-10-2026',
      '05.10.2026',
      '5 10 2026',
    ]) {
      expect(parse('DD/MM/YYYY', input)).toBe('2026-10-05 00:00')
    }
    expect(parse('DD/MM/YYYY', '13/1/2026')).toBe('2026-01-13 00:00')
    expect(parse('DD-MM-YYYY', '5/10/2026')).toBe('2026-10-05 00:00')
  })

  it('reads the time under a day-first date-time format', () => {
    expect(parse('DD/MM/YYYY HH:mm', '5/10/2026 9:05')).toBe('2026-10-05 09:05')
  })

  it('rejects numbers a day-first format cannot place, never reading them month-first', () => {
    expect(parse('DD/MM/YYYY', '05/13/2026')).toBe(null)
    expect(parse('DD/MM/YYYY', '32/10/2026')).toBe(null)
    expect(parse('DD/MM/YYYY', '05/10/26')).toBe(null)
    expect(parse('DD MMM YYYY', '5/10/2026')).toBe(null)
  })

  it('still reads the ISO value the model holds', () => {
    expect(parse('DD/MM/YYYY', '2026-10-05')).toBe('2026-10-05 00:00')
    expect(parse('DD/MM/YYYY HH:mm', '2026-10-05 09:05:00')).toBe(
      '2026-10-05 09:05',
    )
  })

  it('reads a month-first format the same way', () => {
    expect(parse('MM/DD/YYYY', '10/5/2026')).toBe('2026-10-05 00:00')
    expect(parse('MM/DD/YYYY', '10-05-2026')).toBe('2026-10-05 00:00')
  })

  it('keeps the loose parse when there is no format or the input has words', () => {
    expect(parse(undefined, '2026-10-05')).toBe('2026-10-05 00:00')
    expect(parse('DD/MM/YYYY', 'Oct 5 2026')).toBe('2026-10-05 00:00')
    expect(parse('DD/MM/YYYY', 'not a date')).toBe(null)
  })
})
