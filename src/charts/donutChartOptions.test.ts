import { describe, expect, it } from 'vitest'
import { buildDonutChartOption, buildDonutSlices } from './donutChartOptions'
import { OTHERS_KEY } from './utils'
import type { ChartTokens } from './tokens'
import type { DonutChartConfig } from './types'

const tokens: ChartTokens = {
  categorical: ['#111111', '#222222', '#333333'],
  sequential: ['#000011', '#000022', '#000033', '#000044', '#000055'],
  diverging: ['#001100', '#002200', '#003300'],
  axisLabel: 'ink-5',
  axisTitle: 'ink-7',
  axisLine: 'outline-2',
  splitLine: 'outline-1',
  dataLabel: 'ink-6',
  insideLabel: 'ink-8',
  cellGap: '#ffffff',
}

function config(overrides: Partial<DonutChartConfig> = {}): DonutChartConfig {
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

function slices(
  overrides: Partial<DonutChartConfig> = {},
  hiddenSlices?: string[],
) {
  return buildDonutSlices(config(overrides), { tokens, hiddenSlices })
}

function build(
  overrides: Partial<DonutChartConfig> = {},
  hiddenSlices?: string[],
) {
  return buildDonutChartOption(config(overrides), {
    tokens,
    hiddenSlices,
  }) as any
}

const rows = (count: number, start = 0) =>
  Array.from({ length: count }, (_, i) => ({
    channel: `c${start + i}`,
    // Descending, so the ordering of the built slices is unambiguous.
    visits: 100 - (start + i),
  }))

describe('buildDonutSlices', () => {
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

describe('buildDonutChartOption', () => {
  it('draws a ring, not a pie', () => {
    const [inner] = build().series[0].radius
    expect(parseFloat(inner)).toBeGreaterThan(0)
  })

  it('plots the visible slices in their own colors', () => {
    expect(build().series[0].data).toEqual([
      { name: 'Search', value: 50, itemStyle: { color: '#111111' } },
      { name: 'Direct', value: 30, itemStyle: { color: '#222222' } },
      { name: 'Email', value: 20, itemStyle: { color: '#333333' } },
    ])
  })

  it('drops hidden slices from the plot', () => {
    expect(
      build({}, ['Direct']).series[0].data.map((d: any) => d.name),
    ).toEqual(['Search', 'Email'])
  })

  it('leaves inline labels off, and gives them room when asked for', () => {
    const plain = build().series[0]
    expect(plain.label.show).toBe(false)
    expect(plain.labelLine.show).toBe(false)

    const labelled = build({ showInlineLabels: true }).series[0]
    expect(labelled.label.show).toBe(true)
    expect(parseFloat(labelled.radius[1])).toBeLessThan(
      parseFloat(plain.radius[1]),
    )
  })

  it('labels a slice with its category and share', () => {
    const { label } = build({ showInlineLabels: true }).series[0]
    expect(label.formatter({ name: 'Search', percent: 50.2 })).toBe(
      'Search 50%',
    )
  })

  it('runs the ring counter-clockwise in RTL', () => {
    expect(build().series[0].clockwise).toBe(true)
    expect(build({ dir: 'rtl' }).series[0].clockwise).toBe(false)
  })

  describe('half variant', () => {
    it('sweeps the top half only, opening downward', () => {
      const series = build({ variant: 'half' }).series[0]
      expect(series.startAngle).toBe(180)
      expect(series.endAngle).toBe(0)
      expect(series.clockwise).toBe(true)
    })

    it('mirrors the sweep in RTL, still across the top', () => {
      const series = build({ variant: 'half', dir: 'rtl' }).series[0]
      expect(series.startAngle).toBe(0)
      expect(series.endAngle).toBe(180)
      expect(series.clockwise).toBe(false)
    })

    it('sits lower in the card than the full ring', () => {
      expect(build({ variant: 'half' }).series[0].center).toEqual([
        '50%',
        '75%',
      ])
      expect(build().series[0].center).toEqual(['50%', '50%'])
    })

    it('grows into the freed half at the same band thickness', () => {
      const half = build({ variant: 'half' }).series[0].radius
      const full = build().series[0].radius
      expect(half).toEqual(['74%', '100%'])
      expect(parseFloat(half[1])).toBeGreaterThan(parseFloat(full[1]))
      expect(parseFloat(half[1]) - parseFloat(half[0])).toBe(
        parseFloat(full[1]) - parseFloat(full[0]),
      )
    })

    it('gives inline labels the same room as the full ring does', () => {
      const labelled = build({ variant: 'half', showInlineLabels: true })
        .series[0]
      expect(labelled.radius).toEqual(['54%', '80%'])
      expect(labelled.label.show).toBe(true)
    })

    it('plots the same slices as the full ring', () => {
      expect(build({ variant: 'half' }).series[0].data).toEqual(
        build().series[0].data,
      )
    })

    it('leaves the full ring a full circle', () => {
      const series = build().series[0]
      expect(series.startAngle).toBeUndefined()
      expect(series.endAngle).toBeUndefined()
    })
  })

  it('asks for no echarts tooltip, so the module can stay unregistered', () => {
    expect(build().tooltip).toBeUndefined()
  })

  it('deep-merges the echartOptions escape hatch', () => {
    const option = build({
      echartOptions: {
        animation: false,
        series: [{ type: 'pie', radius: 10 }],
      },
    })
    expect(option.animation).toBe(false)
    // Arrays replace rather than merge, as everywhere else.
    expect(option.series).toEqual([{ type: 'pie', radius: 10 }])
  })
})
