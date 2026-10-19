import { describe, expect, it } from 'vitest'
import {
  buildSlices,
  drawnSlices,
  sliceLegendItems,
  type SliceConfig,
} from './slices'
import { OTHERS_KEY } from './utils'
import type { ChartTokens } from './tokens'

const tokens: ChartTokens = {
  categorical: ['#111111', '#222222', '#333333'],
  sequential: ['#000011', '#000022', '#000033'],
  diverging: ['#001100', '#002200', '#003300'],
  axisLabel: 'ink-5',
  axisTitle: 'ink-7',
  axisLine: 'outline-2',
  gridline: 'outline-1',
  dataLabel: 'ink-6',
  insideLabel: 'ink-8',
  backdrop: '#ffffff',
}

function config(overrides: Partial<SliceConfig> = {}): SliceConfig {
  return {
    data: [
      { channel: 'Search', visits: 50 },
      { channel: 'Direct', visits: 30 },
      { channel: 'Email', visits: 20 },
    ],
    categoryColumn: 'channel',
    valueColumn: 'visits',
    ...overrides,
  }
}

function slices(overrides: Partial<SliceConfig> = {}, hiddenSlices?: string[]) {
  return buildSlices(config(overrides), { tokens, hiddenSlices })
}

const rows = (count: number, start = 0) =>
  Array.from({ length: count }, (_, i) => ({
    channel: `c${start + i}`,
    // Descending, so the ordering of the built slices is unambiguous.
    visits: 100 - (start + i),
  }))

describe('buildSlices', () => {
  it('sorts by value and shares out the total', () => {
    expect(
      slices({
        data: [
          { channel: 'Email', visits: 20 },
          { channel: 'Search', visits: 50 },
          { channel: 'Direct', visits: 30 },
        ],
      }).map((s) => [s.label, s.value, s.percent]),
    ).toEqual([
      ['Search', 50, 50],
      ['Direct', 30, 30],
      ['Email', 20, 20],
    ])
  })

  it('defaults to the categorical palette, cycling past its end', () => {
    expect(slices({ data: rows(4) }).map((s) => s.color)).toEqual([
      '#111111',
      '#222222',
      '#333333',
      '#111111',
    ])
  })

  it('takes a named ramp or an explicit color list', () => {
    expect(slices({ palette: 'sequential' }).map((s) => s.color)).toEqual([
      '#000011',
      '#000022',
      '#000033',
    ])
    expect(slices({ palette: ['red', 'blue'] }).map((s) => s.color)).toEqual([
      'red',
      'blue',
      'red',
    ])
  })

  it('pins a color to a category, the rest keeping their palette slot', () => {
    expect(
      slices({ colors: { Direct: '#ff0000' } }).map((s) => s.color),
    ).toEqual(['#111111', '#ff0000', '#333333'])
  })

  it('pins "Others" by the reserved key, and ignores a pin folded into it', () => {
    const built = slices({
      maxSlices: 2,
      colors: { [OTHERS_KEY]: '#999999', Email: '#ff0000' },
    })
    expect(built.map((s) => [s.name, s.color])).toEqual([
      ['Search', '#111111'],
      [OTHERS_KEY, '#999999'],
    ])
  })

  it('pins a repeated category on every slice it names', () => {
    const built = slices({
      data: [
        { channel: 'Search', visits: 50 },
        { channel: 'Search', visits: 30 },
      ],
      colors: { Search: '#ff0000' },
    })
    expect(built.map((s) => s.color)).toEqual(['#ff0000', '#ff0000'])
  })

  it('skips rows with a missing, non-numeric or negative value', () => {
    expect(
      slices({
        data: [
          { channel: 'Search', visits: 50 },
          { channel: 'Direct', visits: null },
          { channel: 'Email', visits: 'n/a' },
          { channel: 'Refunds', visits: -10 },
          { channel: 'Events', visits: 0 },
        ],
      }).map((s) => s.label),
    ).toEqual(['Search', 'Events'])
  })

  it('labels a blank category rather than dropping it', () => {
    expect(slices({ data: [{ channel: '', visits: 5 }] })[0].label).toBe(
      '(Blank)',
    )
  })

  it('keeps repeated category values addressable one at a time', () => {
    const [first, second] = slices({
      data: [
        { channel: 'Search', visits: 50 },
        { channel: 'Search', visits: 20 },
      ],
    })
    expect([first.label, second.label]).toEqual(['Search', 'Search'])
    expect([first.name, second.name]).toEqual(['Search', 'Search (2)'])
  })

  describe('"Others" grouping', () => {
    it('leaves the ring alone while it fits in maxSlices', () => {
      const built = slices({ data: rows(9) })
      expect(built).toHaveLength(9)
      expect(built.some((s) => s.isOthers)).toBe(false)
    })

    it('folds the tail into one slice once it overflows', () => {
      const built = slices({ data: rows(12) })
      expect(built).toHaveLength(9)

      const others = built[8]
      expect(others.name).toBe(OTHERS_KEY)
      expect(others.label).toBe('Others')
      expect(others.isOthers).toBe(true)
      // The four smallest of `100 - i` for i in 0..11.
      expect(others.value).toBe(92 + 91 + 90 + 89)
      expect(others.rows.map((r) => r.channel)).toEqual([
        'c8',
        'c9',
        'c10',
        'c11',
      ])
    })

    it('honours a custom maxSlices', () => {
      const built = slices({ data: rows(10), maxSlices: 3 })
      expect(built.map((s) => s.label)).toEqual(['c0', 'c1', 'Others'])
      expect(built[2].rows).toHaveLength(8)
    })

    it('never groups a single row into an "Others" of one', () => {
      const built = slices({ data: rows(10), maxSlices: 9 })
      expect(built[8].rows).toHaveLength(2)
    })

    it('percentages "Others" against the same total as the rest', () => {
      const built = slices({
        data: [
          { channel: 'a', visits: 60 },
          { channel: 'b', visits: 20 },
          { channel: 'c', visits: 15 },
          { channel: 'd', visits: 5 },
        ],
        maxSlices: 2,
      })
      expect(built.map((s) => [s.label, s.value, s.percent])).toEqual([
        ['a', 60, 60],
        ['Others', 40, 40],
      ])
    })
  })

  describe('hidden slices', () => {
    it('re-percentages the rest against the visible total', () => {
      expect(
        slices({}, ['Email']).map((s) => [s.label, s.percent, s.hidden]),
      ).toEqual([
        ['Search', 62.5, false],
        ['Direct', 37.5, false],
        ['Email', 0, true],
      ])
    })

    it('keeps every slice in the list, colors unshifted', () => {
      expect(slices({}, ['Direct']).map((s) => s.color)).toEqual(
        slices().map((s) => s.color),
      )
    })

    it('shares out nothing when everything is hidden', () => {
      expect(
        slices({}, ['Search', 'Direct', 'Email']).map((s) => s.percent),
      ).toEqual([0, 0, 0])
    })
  })

  it('shares out nothing when the total is zero', () => {
    expect(slices({ data: [{ channel: 'a', visits: 0 }] })[0].percent).toBe(0)
  })

  it('holds no slices for no rows', () => {
    expect(slices({ data: [] })).toEqual([])
  })
})

describe('drawnSlices', () => {
  it('leaves out hidden and zero slices', () => {
    const built = slices(
      {
        data: [
          { channel: 'Search', visits: 50 },
          { channel: 'Direct', visits: 30 },
          { channel: 'Email', visits: 0 },
        ],
      },
      ['Direct'],
    )
    expect(drawnSlices(built).map((s) => s.name)).toEqual(['Search'])
  })
})

describe('sliceLegendItems', () => {
  it('lists every slice with its share, a hidden one without', () => {
    const items = sliceLegendItems(slices({}, ['Email']), (v) => `${v} visits`)
    expect(
      items.map((i) => [i.name, i.hint, i.weight, i.formattedValue]),
    ).toEqual([
      ['Search', '63%', 50, '50 visits'],
      ['Direct', '38%', 30, '30 visits'],
      ['Email', undefined, 20, '20 visits'],
    ])
  })
})
