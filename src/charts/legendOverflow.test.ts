import { describe, expect, it } from 'vitest'
import { legendFit, rankLegendItems } from './legendOverflow'
import { OTHERS_KEY } from './utils'

const entry = (name: string, weight?: number) => ({
  name,
  label: name,
  color: '#000',
  hidden: false,
  weight,
})

const names = (items: { name: string }[]) => items.map((item) => item.name)

describe('rankLegendItems', () => {
  it('puts the heaviest first', () => {
    const ranked = rankLegendItems([
      entry('a', 1),
      entry('b', 30),
      entry('c', 7),
    ])
    expect(names(ranked)).toEqual(['b', 'c', 'a'])
  })

  it('keeps the given order for equal weights', () => {
    const ranked = rankLegendItems([
      entry('a', 5),
      entry('b', 5),
      entry('c', 9),
    ])
    expect(names(ranked)).toEqual(['c', 'a', 'b'])
  })

  it('keeps the given order when nothing has a weight', () => {
    const ranked = rankLegendItems([entry('a'), entry('b'), entry('c')])
    expect(names(ranked)).toEqual(['a', 'b', 'c'])
  })

  it('puts entries with no weight after the ranked ones', () => {
    const ranked = rankLegendItems([entry('a'), entry('b', 2), entry('c', 0)])
    expect(names(ranked)).toEqual(['b', 'c', 'a'])
  })

  it('keeps "Others" at the end, however large', () => {
    const ranked = rankLegendItems([
      entry('a', 1),
      entry(OTHERS_KEY, 500),
      entry('b', 9),
    ])
    expect(names(ranked)).toEqual(['b', 'a', OTHERS_KEY])
  })

  it('leaves the list it was given alone', () => {
    const items = [entry('a', 1), entry('b', 2)]
    rankLegendItems(items)
    expect(names(items)).toEqual(['a', 'b'])
  })
})

describe('legendFit', () => {
  it('fits every entry that fits as it is', () => {
    expect(legendFit([40, 40, 40], 128, 60, 4)).toBe(3)
  })

  it('makes room for the trigger once the entries overflow', () => {
    // 60 + 4 + 40 = 104, and a second entry would reach 148.
    expect(legendFit([40, 40, 40], 120, 60, 4)).toBe(1)
  })

  it('stops at the first entry that does not fit', () => {
    expect(legendFit([30, 100, 10], 120, 50, 4)).toBe(1)
  })

  it('shows only the trigger when no entry fits beside it', () => {
    expect(legendFit([90, 90], 120, 60, 4)).toBe(0)
  })

  it('fits nothing in a row with no room', () => {
    expect(legendFit([40], 0, 60, 4)).toBe(0)
  })

  it('fits an empty legend', () => {
    expect(legendFit([], 0, 60, 4)).toBe(0)
  })
})
