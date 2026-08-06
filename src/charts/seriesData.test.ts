import { afterEach, describe, expect, it, vi } from 'vitest'
import { normalizeAxisChartProps } from './seriesData'
import type {
  AxisChartProps,
  BarChartSeriesStyle,
  BarSeriesStyle,
  LineSeriesStyle,
} from './props'
import type { AxisChartConfig } from './types'

const wideRows = [
  { month: 'Jan', sales: 10, refunds: 2 },
  { month: 'Feb', sales: 20, refunds: 4 },
]

const longRows = [
  { month: 'Jan', region: 'East', amount: 10 },
  { month: 'Jan', region: 'West', amount: 5 },
  { month: 'Feb', region: 'East', amount: 12 },
]

function normalize<Style extends BarSeriesStyle | LineSeriesStyle>(
  props: Partial<AxisChartProps<Style>> = {},
) {
  return normalizeAxisChartProps({
    data: wideRows,
    x: 'month',
    y: ['sales', 'refunds'],
    ...props,
  } as AxisChartProps<Style>)
}

const namesOf = (config: { series: { name: string }[] }) =>
  config.series.map((series) => series.name)

afterEach(() => {
  vi.restoreAllMocks()
})

describe('normalizeAxisChartProps', () => {
  it('reads a single y column as one series', () => {
    const { config } = normalize({ y: 'sales' })
    expect(namesOf(config)).toEqual(['sales'])
    expect(config.data).toBe(wideRows)
  })

  it('reads a y list as one series per column, in order', () => {
    const { config } = normalize({ y: ['refunds', 'sales'] })
    expect(namesOf(config)).toEqual(['refunds', 'sales'])
  })

  it('carries the axis, chrome and palette props into the config', () => {
    const { config } = normalize({
      title: 'Sales',
      subtitle: 'Monthly',
      palette: 'categorical',
      dir: 'rtl',
      xAxis: { title: 'Month', type: 'category', timeGrain: 'month' },
      yAxis: { title: 'Amount', min: 0, max: 100 },
    })
    expect(config.xAxis).toMatchObject({
      key: 'month',
      type: 'category',
      timeGrain: 'month',
      title: 'Month',
    })
    expect(config.yAxis).toMatchObject({ title: 'Amount', min: 0, max: 100 })
    expect(config.y2Axis).toBeUndefined()
    expect(config).toMatchObject({
      title: 'Sales',
      subtitle: 'Monthly',
      palette: 'categorical',
      dir: 'rtl',
    })
  })

  // What wave-2 components do: spread the normalized config, add the chart's own
  // props. Typechecked, so a drift from the internal config types fails the build.
  it('produces a config the chart-specific configs accept', () => {
    const bar: AxisChartConfig = {
      ...normalize<BarSeriesStyle>({
        seriesConfig: { sales: { stackName: 'a' } },
      }).config,
      stacked: true,
      horizontal: true,
    }
    const line: AxisChartConfig = {
      ...normalize<LineSeriesStyle>({
        seriesConfig: { sales: { smooth: true } },
      }).config,
      connectNulls: true,
    }
    expect([bar.series.length, line.series.length]).toEqual([2, 2])
  })

  it('hands the format functions back beside the config', () => {
    const x = (value: any) => `x:${value}`
    const y = (value: number) => `y:${value}`
    const y2 = (value: number) => `y2:${value}`
    const { format } = normalize({
      xAxis: { format: x },
      yAxis: { format: y },
      y2Axis: { format: y2 },
    })
    expect(format).toEqual({ x, y, y2 })
  })
})

describe('normalizeAxisChartProps: seriesConfig', () => {
  it('applies label, color and per-chart style keys to the matching series', () => {
    const { config } = normalize<BarSeriesStyle>({
      seriesConfig: {
        refunds: {
          label: 'Operating costs',
          color: 'red',
          showDataLabels: true,
          stackName: 'costs',
        },
      },
    })
    expect(config.series[0]).toEqual({ name: 'sales' })
    expect(config.series[1]).toEqual({
      name: 'refunds',
      label: 'Operating costs',
      color: 'red',
      showDataLabels: true,
      stackName: 'costs',
    })
  })

  it('ignores keys that name no series', () => {
    const { config } = normalize({
      y: 'sales',
      seriesConfig: { dropped_column: { color: 'red' } },
    })
    expect(config.series).toEqual([{ name: 'sales' }])
  })

  it('styles a long-data series by its grouping value', () => {
    const { config } = normalize<LineSeriesStyle>({
      data: longRows,
      y: 'amount',
      series: 'region',
      seriesConfig: { West: { label: 'Westside', smooth: true } },
    })
    expect(config.series[1]).toEqual({
      name: 'West',
      label: 'Westside',
      smooth: true,
    })
  })

  it('keeps the series name as the identity whatever the style says', () => {
    const { config } = normalize({
      y: 'sales',
      seriesConfig: { sales: { label: 'Net sales' } },
    })
    expect(config.series[0].name).toBe('sales')
  })

  // The shape travels with the rest of the per-series look, so a saved combo
  // config is one object spread into one tag.
  it('carries the shape a series is recast to, and its style keys', () => {
    const { config } = normalize<BarChartSeriesStyle>({
      seriesConfig: {
        refunds: { type: 'line', lineType: 'dashed', label: 'Refund rate' },
      },
    })
    expect(config.series).toEqual([
      { name: 'sales' },
      {
        name: 'refunds',
        type: 'line',
        lineType: 'dashed',
        label: 'Refund rate',
      },
    ])
  })

  it('leaves the shape unset when nothing recasts the series', () => {
    const { config } = normalize({ y: 'sales' })
    expect(config.series[0].type).toBeUndefined()
  })

  it('recasts a series that sits on the second axis', () => {
    const { config } = normalize<BarChartSeriesStyle>({
      y: 'sales',
      y2: 'refunds',
      seriesConfig: { refunds: { type: 'line' } },
    })
    expect(config.series[1]).toEqual({
      name: 'refunds',
      type: 'line',
      axis: 'y2',
    })
  })
})

describe('normalizeAxisChartProps: y2', () => {
  it('puts a y2 column on the second axis', () => {
    const { config } = normalize({ y2: 'refunds' })
    expect(config.series).toEqual([
      { name: 'sales' },
      { name: 'refunds', axis: 'y2' },
    ])
  })

  it('appends y2 columns that y does not list', () => {
    const { config } = normalize({ y: 'sales', y2: ['refunds'] })
    expect(config.series).toEqual([
      { name: 'sales' },
      { name: 'refunds', axis: 'y2' },
    ])
  })

  it('leaves series off the second axis by default', () => {
    const { config } = normalize()
    expect(config.series.every((series) => !series.axis)).toBe(true)
  })
})

describe('normalizeAxisChartProps: long data', () => {
  it('pivots rows to wide, one series per value of the grouping column', () => {
    const { config } = normalize({
      data: longRows,
      y: 'amount',
      series: 'region',
    })
    expect(namesOf(config)).toEqual(['East', 'West'])
    expect(config.data).toEqual([
      { month: 'Jan', East: 10, West: 5 },
      { month: 'Feb', East: 12, West: null },
    ])
  })

  it('leaves a missing combination null rather than zero', () => {
    const { config } = normalize({
      data: longRows,
      y: 'amount',
      series: 'region',
    })
    expect(config.data[1].West).toBeNull()
  })

  it('orders categories and series by first appearance', () => {
    const { config } = normalize({
      data: [
        { month: 'Mar', region: 'West', amount: 1 },
        { month: 'Jan', region: 'East', amount: 2 },
        { month: 'Mar', region: 'East', amount: 3 },
      ],
      y: 'amount',
      series: 'region',
    })
    expect(config.data.map((row) => row.month)).toEqual(['Mar', 'Jan'])
    expect(namesOf(config)).toEqual(['West', 'East'])
  })

  it('collapses repeated x values onto one row, last write winning', () => {
    const { config } = normalize({
      data: [
        { month: 'Jan', region: 'East', amount: 10 },
        { month: 'Jan', region: 'East', amount: 99 },
      ],
      y: 'amount',
      series: 'region',
    })
    expect(config.data).toEqual([{ month: 'Jan', East: 99 }])
  })

  it('warns and reads the first y column when series meets a y list', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const { config } = normalize({
      data: longRows,
      y: ['amount', 'other'],
      series: 'region',
    })
    expect(warn).toHaveBeenCalledOnce()
    expect(warn.mock.calls[0][0]).toContain('amount')
    expect(config.data[0]).toEqual({ month: 'Jan', East: 10, West: 5 })
  })

  it('does not warn for a single y column', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    normalize({ data: longRows, y: 'amount', series: 'region' })
    expect(warn).not.toHaveBeenCalled()
  })
})
