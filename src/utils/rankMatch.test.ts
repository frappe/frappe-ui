import { describe, expect, it } from 'vitest'
import { rankMatch } from './rankMatch'

describe('rankMatch', () => {
  it('puts an exact match first, then prefix, then word start, then the rest', () => {
    expect(rankMatch('App', 'app')).toBe(0)
    expect(rankMatch('Approximate No. of SKUs', 'app')).toBe(1)
    expect(rankMatch('Mobile app', 'app')).toBe(2)
    expect(rankMatch('Frappe HR', 'app')).toBe(3)
  })

  it('counts a word after punctuation as a word start', () => {
    expect(rankMatch('Mobile (app)', 'app')).toBe(2)
    expect(rankMatch('Web/App', 'app')).toBe(2)
  })

  it('ignores case', () => {
    expect(rankMatch('Sarah Connor', 'SAR')).toBe(1)
  })
})
