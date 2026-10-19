import { describe, expect, it } from 'vitest'
import { buildDonutChartOption } from './donutChartOptions'
import { buildSlices } from './slices'
import type { ChartTokens } from './tokens'
import type { DonutChartConfig } from './types'

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
  return buildSlices(config(overrides), { tokens, hiddenSlices })
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

  it('plots a pinned slice in its pinned color', () => {
    const option = build({ colors: { Direct: '#ff0000' } })
    expect(option.series[0].data[1].itemStyle.color).toBe('#ff0000')
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

    const labelled = build({ showDataLabels: true }).series[0]
    expect(labelled.label.show).toBe(true)
    expect(parseFloat(labelled.radius[1])).toBeLessThan(
      parseFloat(plain.radius[1]),
    )
  })

  it('labels a slice with its category and share', () => {
    const { label } = build({ showDataLabels: true }).series[0]
    expect(label.formatter({ name: 'Search', percent: 50.2 })).toBe(
      'Search 50%',
    )
  })

  it('labels slices with the shares the legend prints, adding up to 100', () => {
    const { label } = build({
      showDataLabels: true,
      data: [
        { channel: 'a', visits: 1 },
        { channel: 'b', visits: 1 },
        { channel: 'c', visits: 1 },
      ],
    }).series[0]
    expect(
      ['a', 'b', 'c'].map((name) => label.formatter({ name, percent: 33.33 })),
    ).toEqual(['a 34%', 'b 33%', 'c 33%'])
  })

  it('runs the ring counter-clockwise in RTL', () => {
    expect(build().series[0].clockwise).toBe(true)
    expect(build({ dir: 'rtl' }).series[0].clockwise).toBe(false)
  })

  describe('zero slices', () => {
    const lone = {
      data: [
        { channel: 'Search', visits: 100 },
        { channel: 'Direct', visits: 0 },
        { channel: 'Email', visits: 0 },
      ],
    }

    it('leaves them off the ring, and in the legend', () => {
      expect(build(lone).series[0].data.map((d: any) => d.name)).toEqual([
        'Search',
      ])
      expect(slices(lone).map((s) => s.name)).toEqual([
        'Search',
        'Direct',
        'Email',
      ])
    })

    it('closes the ring around a lone slice', () => {
      expect(build(lone).series[0].padAngle).toBe(0)
      expect(build({}, ['Direct', 'Email']).series[0].padAngle).toBe(0)
    })

    it('draws a blank ring when every slice is zero', () => {
      const series = build({
        data: [
          { channel: 'Search', visits: 0 },
          { channel: 'Direct', visits: 0 },
        ],
      }).series[0]
      expect(series.data).toEqual([])
      expect(series.emptyCircleStyle.color).toBe('outline-1')
    })
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
      const labelled = build({ variant: 'half', showDataLabels: true })
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
