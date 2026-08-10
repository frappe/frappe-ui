import { describe, expect, it } from 'vitest'
import { markName } from './utils'

describe('markName', () => {
  it('leaves a category and a number as they are', () => {
    expect(markName('Jan')).toBe('Jan')
    expect(markName(12)).toBe(12)
  })

  // A refetch answers with a fresh Date for the same instant, and the keyboard
  // cursor compares names with ===.
  it('reads a date as its instant', () => {
    const at = '2026-01-01T00:00:00.000Z'
    expect(markName(new Date(at))).toBe(markName(new Date(at)))
    expect(markName(new Date(at))).toBe(Date.parse(at))
  })

  it('has no name for a blank cell', () => {
    expect(markName(null)).toBe(undefined)
    expect(markName(undefined)).toBe(undefined)
  })
})
