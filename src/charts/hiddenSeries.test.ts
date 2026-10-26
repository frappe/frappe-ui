import { describe, expect, it } from 'vitest'
import { pruneHiddenSeries, toggleHiddenSeries } from './hiddenSeries'

describe('toggleHiddenSeries', () => {
  it('hides a drawn series', () => {
    expect(toggleHiddenSeries([], 'sales', ['sales', 'refunds'])).toEqual([
      'sales',
    ])
  })

  it('shows a hidden series again', () => {
    expect(toggleHiddenSeries(['sales', 'refunds'], 'sales', ['tax'])).toEqual([
      'refunds',
    ])
  })

  it('refuses to hide the last drawn series', () => {
    const hidden = ['sales', 'refunds']
    expect(toggleHiddenSeries(hidden, 'tax', ['tax'])).toBe(hidden)
  })

  it('refuses to hide the only series', () => {
    expect(toggleHiddenSeries([], 'sales', ['sales'])).toEqual([])
  })

  it('hides a series with no mark, whatever is left drawn', () => {
    expect(toggleHiddenSeries([], 'zero', ['sales'])).toEqual(['zero'])
    expect(toggleHiddenSeries([], 'zero', [])).toEqual(['zero'])
  })

  it('leaves the list it was given alone', () => {
    const hidden = ['sales']
    toggleHiddenSeries(hidden, 'refunds', ['refunds', 'tax'])
    expect(hidden).toEqual(['sales'])
  })
})

describe('pruneHiddenSeries', () => {
  it('drops names the chart no longer draws', () => {
    expect(pruneHiddenSeries(['sales', 'gone'], ['sales', 'refunds'])).toEqual([
      'sales',
    ])
  })

  it('returns the same list when every name still exists', () => {
    const hidden = ['sales']
    expect(pruneHiddenSeries(hidden, ['sales', 'refunds'])).toBe(hidden)
  })

  it('returns the same empty list', () => {
    const hidden: string[] = []
    expect(pruneHiddenSeries(hidden, ['sales'])).toBe(hidden)
  })
})
