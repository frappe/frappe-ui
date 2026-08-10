import { describe, expect, it } from 'vitest'
import { pruneHiddenSeries, toggleHiddenSeries } from './hiddenSeries'

describe('toggleHiddenSeries', () => {
  it('hides a visible series', () => {
    expect(toggleHiddenSeries([], 'sales', 3)).toEqual(['sales'])
  })

  it('shows a hidden series again', () => {
    expect(toggleHiddenSeries(['sales', 'refunds'], 'sales', 3)).toEqual([
      'refunds',
    ])
  })

  it('refuses to hide the last visible series', () => {
    const hidden = ['sales', 'refunds']
    expect(toggleHiddenSeries(hidden, 'tax', 3)).toBe(hidden)
  })

  it('refuses to hide the only series', () => {
    expect(toggleHiddenSeries([], 'sales', 1)).toEqual([])
  })

  it('leaves the list it was given alone', () => {
    const hidden = ['sales']
    toggleHiddenSeries(hidden, 'refunds', 3)
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
