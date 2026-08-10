import { describe, expect, it } from 'vitest'
import {
  buildAxisChartOption,
  DEFAULT_FILL_OPACITY,
  DEFAULT_STACKED_FILL_OPACITY,
} from './axisChartOptions'
import type { ChartTokens } from './tokens'
import type { AxisChartConfig } from './types'

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

/** What `AreaChart` hands the builder: the shared config, marked `'area'`. */
function config(overrides: Partial<AxisChartConfig> = {}): AxisChartConfig {
  return {
    type: 'area',
    data: [
      { month: 'Jan', sales: 10, refunds: 2 },
      { month: 'Feb', sales: 20, refunds: 4 },
    ],
    xAxis: { key: 'month', type: 'category' },
    series: [{ name: 'sales' }, { name: 'refunds' }],
    ...overrides,
  }
}

function build(
  overrides: Partial<AxisChartConfig> = {},
  hiddenSeries?: string[],
) {
  return buildAxisChartOption(config(overrides), { tokens, hiddenSeries }) as any
}

function alphaOf(rgba: string) {
  return Number(rgba.slice(rgba.lastIndexOf(',') + 1, -1))
}

describe('area chart option', () => {
  it('is a line chart with a fill', () => {
    const option = build()
    expect(option.series[0].type).toBe('line')
    expect(option.series[0].lineStyle.width).toBe(2)
    expect(option.series[0].data).toEqual([
      ['Jan', 10],
      ['Feb', 20],
    ])
    expect(option.series[0].areaStyle).toBeTruthy()
    expect(option.xAxis.boundaryGap).toBe(false)
  })

  it('thins crowded labels out and keeps the last category', () => {
    const option = build()
    expect(option.xAxis.axisLabel.hideOverlap).toBe(true)
    expect(option.xAxis.axisLabel.showMaxLabel).toBe(true)
    expect(option.yAxis.axisLabel.hideOverlap).toBe(true)
    expect(option.yAxis.axisLabel.showMaxLabel).toBe(true)
  })

  it('keeps the line options a line chart has', () => {
    const option = build({
      connectNulls: true,
      series: [
        {
          name: 'sales',
          lineType: 'dashed',
          showDataPoints: true,
          smooth: true,
        },
      ],
    })
    expect(option.series[0].lineStyle.type).toBe('dashed')
    expect(option.series[0].showSymbol).toBe(true)
    expect(option.series[0].smooth).toBe(true)
    expect(option.series[0].connectNulls).toBe(true)
  })

  it('fades an overlapping fill out towards the axis', () => {
    const { color } = build().series[0].areaStyle
    expect(color.type).toBe('linear')
    // Top to bottom, not left to right.
    expect([color.x, color.y, color.x2, color.y2]).toEqual([0, 0, 0, 1])
    expect(color.colorStops[0].color).toBe(
      `rgba(0, 0, 17, ${DEFAULT_FILL_OPACITY})`,
    )
    expect(alphaOf(color.colorStops[1].color)).toBeLessThan(
      DEFAULT_FILL_OPACITY,
    )
  })

  it('fills stacked bands flat, and more solidly', () => {
    const option = build({ stacked: true })
    expect(option.series[0].areaStyle).toEqual({
      color: '#000011',
      opacity: DEFAULT_STACKED_FILL_OPACITY,
    })
    expect(DEFAULT_STACKED_FILL_OPACITY).toBeGreaterThan(DEFAULT_FILL_OPACITY)
  })

  it('orders a stack along the sequential ramp, dark to light', () => {
    const option = build({
      stacked: true,
      series: [{ name: 'a' }, { name: 'b' }, { name: 'c' }],
      data: [{ month: 'Jan', a: 1, b: 2, c: 3 }],
    })
    expect(option.series.map((s: any) => s.areaStyle.color)).toEqual([
      '#000011',
      '#000022',
      '#000033',
    ])
  })

  it('stacks series under one stack, or under named ones', () => {
    // The stack key carries the mark: areas stack with areas, never onto bars.
    expect(build({ stacked: true }).series.map((s: any) => s.stack)).toEqual([
      'area:stack',
      'area:stack',
    ])
    expect(build().series[0].stack).toBeUndefined()
    expect(
      build({
        stacked: true,
        series: [
          { name: 'sales', stackName: 'left' },
          { name: 'refunds', stackName: 'right' },
        ],
      }).series.map((s: any) => s.stack),
    ).toEqual(['area:left', 'area:right'])
  })

  it('washes an area that has nothing to stack onto, whatever stacked says', () => {
    // Named apart, the two bands never meet, so neither reads as a solid block.
    const option = build({
      stacked: true,
      series: [
        { name: 'sales', stackName: 'left' },
        { name: 'refunds', stackName: 'right' },
      ],
    })
    expect(option.series[0].areaStyle.color.type).toBe('linear')
    expect(
      build({ stacked: true, series: [{ name: 'sales' }] }).series[0].areaStyle
        .color.type,
    ).toBe('linear')
  })

  it('keeps a band solid while its partner is hidden in the legend', () => {
    const option = build({ stacked: true }, ['sales'])
    expect(option.series[0].areaStyle).toEqual({
      color: '#000033',
      opacity: DEFAULT_STACKED_FILL_OPACITY,
    })
  })

  it('takes fillOpacity from the series, then the chart', () => {
    expect(
      build({ fillOpacity: 0.5 }).series[0].areaStyle.color.colorStops[0].color,
    ).toBe('rgba(0, 0, 17, 0.5)')
    expect(
      build({
        fillOpacity: 0.5,
        series: [{ name: 'sales', fillOpacity: 0.25 }],
        // A lone series takes the ramp's mid stop, hence the shifted blue.
      }).series[0].areaStyle.color.colorStops[0].color,
    ).toBe('rgba(0, 0, 34, 0.25)')
  })

  it('falls back to a flat fill for a color it cannot add alpha to', () => {
    const option = build({ palette: ['oklch(0.5 0 0)'] })
    expect(option.series[0].areaStyle).toEqual({
      color: 'oklch(0.5 0 0)',
      opacity: DEFAULT_FILL_OPACITY,
    })
  })

  it('dims the fill relative to its own opacity when blurred', () => {
    expect(build().series[0].blur.areaStyle.opacity).toBeLessThan(
      DEFAULT_FILL_OPACITY,
    )
  })

  it('drops hidden series', () => {
    expect(build({}, ['sales']).series.map((s: any) => s.name)).toEqual([
      'refunds',
    ])
  })
})
