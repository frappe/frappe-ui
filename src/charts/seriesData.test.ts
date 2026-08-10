import { afterEach, describe, expect, it, vi } from 'vitest'
import { normalizeAxisChartProps } from './seriesData'
import { resolveSeriesColors } from './axisChartCommon'
import type { ChartTokens } from './tokens'
import type { AxisChartConfig, AxisChartProps } from './types'

const wideRows = [
  { month: 'Jan', sales: 10, refunds: 2 },
  { month: 'Feb', sales: 20, refunds: 4 },
]

const longRows = [
  { month: 'Jan', region: 'East', amount: 10 },
  { month: 'Jan', region: 'West', amount: 5 },
  { month: 'Feb', region: 'East', amount: 12 },
]

function normalize(props: Partial<AxisChartProps> = {}) {
  return normalizeAxisChartProps({
    data: wideRows,
    x: 'month',
    y: ['sales', 'refunds'],
    ...props,
  } as AxisChartProps)
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

  // What the components do: spread the normalized config, add the mark they
  // default to and their own props. Typechecked, so a drift from the internal
  // config type fails the build.
  it('produces a config the option builder accepts', () => {
    const bar: AxisChartConfig = {
      ...normalize({ seriesConfig: { sales: { stackName: 'a' } } }).config,
      type: 'bar',
      stacked: true,
      horizontal: true,
    }
    const line: AxisChartConfig = {
      ...normalize({ seriesConfig: { sales: { smooth: true } } }).config,
      type: 'line',
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
    const { config } = normalize({
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
    const { config } = normalize({
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
})

describe('normalizeAxisChartProps: the second value axis', () => {
  it('puts a series on the second axis from its style', () => {
    const { config } = normalize({
      seriesConfig: { refunds: { axis: 'y2' } },
    })
    expect(config.series).toEqual([
      { name: 'sales' },
      { name: 'refunds', axis: 'y2' },
    ])
  })

  // The axis a series is measured against says nothing about where it is drawn.
  // Series colors are handed out in this order, so a series that changed axis
  // and changed place would silently change color with it.
  it('keeps the series in y order whatever axis each one sits on', () => {
    const { config } = normalize({
      y: ['sales', 'refunds', 'rate'],
      seriesConfig: { sales: { axis: 'y2' }, refunds: { axis: 'y' } },
    })
    expect(namesOf(config)).toEqual(['sales', 'refunds', 'rate'])
  })

  it('leaves series off the second axis by default', () => {
    const { config } = normalize()
    expect(config.series.every((series) => !series.axis)).toBe(true)
  })

  // The reading a chart is changed to make: give the second series its own
  // scale. Colors are handed out along the series list, so the series that
  // moved has to come back in the same color it went in.
  it('keeps a series in its own color when it changes axis', () => {
    const tokens: ChartTokens = {
      categorical: ['#111111', '#222222', '#333333'],
      sequential: ['#000011', '#000022', '#000033'],
      diverging: ['#001100', '#002200', '#003300'],
      axisLabel: 'ink-5',
      axisTitle: 'ink-7',
      axisLine: 'outline-2',
      splitLine: 'outline-1',
      dataLabel: 'ink-6',
      insideLabel: 'ink-8',
      cellGap: '#ffffff',
    }
    const colorsOf = (props: Partial<AxisChartProps>) =>
      resolveSeriesColors(normalize(props).config, tokens)

    expect(colorsOf({ seriesConfig: { refunds: { axis: 'y2' } } })).toEqual(
      colorsOf({}),
    )
  })

  // Long data reaches the second axis the same way, which the column list it
  // has no columns to name could not do.
  it('moves a long-data series by its grouping value', () => {
    const { config } = normalize({
      data: longRows,
      y: 'amount',
      series: 'region',
      seriesConfig: { West: { axis: 'y2' } },
    })
    expect(config.series).toEqual([
      { name: 'East' },
      { name: 'West', axis: 'y2' },
    ])
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

describe('normalizeAxisChartProps: maxSeries', () => {
  // One row, so a series' weight is plain to read off the data.
  const regions = [
    { month: 'Jan', region: 'East', amount: 50 },
    { month: 'Jan', region: 'West', amount: 30 },
    { month: 'Jan', region: 'North', amount: 15 },
    { month: 'Jan', region: 'South', amount: 5 },
  ]

  const grouped = (props: Partial<AxisChartProps> = {}) =>
    normalize({ data: regions, y: 'amount', series: 'region', ...props })

  it('leaves the series alone when nothing is capped', () => {
    expect(namesOf(grouped().config)).toEqual([
      'East',
      'West',
      'North',
      'South',
    ])
    expect(namesOf(grouped({ maxSeries: 4 }).config)).toEqual([
      'East',
      'West',
      'North',
      'South',
    ])
  })

  it('sums the tail into one "Others" series', () => {
    const { config } = grouped({ maxSeries: 3 })
    expect(namesOf(config)).toEqual(['East', 'West', '__others__'])
    expect(config.data).toEqual([
      { month: 'Jan', East: 50, West: 30, __others__: 20 },
    ])
  })

  it('labels the collapsed series “Others”', () => {
    const { config } = grouped({ maxSeries: 3 })
    expect(config.series.at(-1)).toEqual({
      name: '__others__',
      label: 'Others',
    })
  })

  it('lets a seriesConfig entry rename and color the collapsed series', () => {
    const { config } = grouped({
      maxSeries: 3,
      seriesConfig: { __others__: { label: 'Everywhere else', color: 'red' } },
    })
    expect(config.series.at(-1)).toEqual({
      name: '__others__',
      label: 'Everywhere else',
      color: 'red',
    })
  })

  // A grouping value that reads "Others" is a series like any other; the
  // reserved identity is what keeps the two apart.
  it('does not collide with a group actually called Others', () => {
    const { config } = normalize({
      data: [
        { month: 'Jan', region: 'Others', amount: 50 },
        { month: 'Jan', region: 'West', amount: 30 },
        { month: 'Jan', region: 'North', amount: 5 },
      ],
      y: 'amount',
      series: 'region',
      maxSeries: 2,
    })
    expect(namesOf(config)).toEqual(['Others', '__others__'])
    expect(config.data).toEqual([{ month: 'Jan', Others: 50, __others__: 35 }])
  })

  it('keeps the largest series and collapses the smallest', () => {
    const { config } = normalize({
      data: [
        { month: 'Jan', region: 'Tiny', amount: 1 },
        { month: 'Jan', region: 'Huge', amount: 100 },
        { month: 'Jan', region: 'Mid', amount: 40 },
      ],
      y: 'amount',
      series: 'region',
      maxSeries: 2,
    })
    expect(namesOf(config)).toEqual(['Huge', '__others__'])
  })

  it('weighs a series by its total across every x, not by one row', () => {
    const { config } = normalize({
      data: [
        // Steady never tops the chart at any one x, but carries more of it.
        { month: 'Jan', region: 'Spike', amount: 70 },
        { month: 'Jan', region: 'Steady', amount: 40 },
        { month: 'Feb', region: 'Spike', amount: 0 },
        { month: 'Feb', region: 'Steady', amount: 40 },
        { month: 'Feb', region: 'Small', amount: 1 },
      ],
      y: 'amount',
      series: 'region',
      maxSeries: 2,
    })
    expect(namesOf(config)).toEqual(['Steady', '__others__'])
  })

  // Magnitude, not signed total: a series that runs large and negative carries
  // the chart as much as one that runs large.
  it('weighs a series that runs negative by how far it runs', () => {
    const { config } = normalize({
      data: [
        { month: 'Jan', region: 'Refunds', amount: -80 },
        { month: 'Jan', region: 'Sales', amount: 90 },
        { month: 'Jan', region: 'Fees', amount: 3 },
      ],
      y: 'amount',
      series: 'region',
      maxSeries: 2,
    })
    expect(namesOf(config)).toEqual(['Sales', '__others__'])
  })

  // The cap picks by size; the survivors keep the order the data put them in,
  // so the caller's sort survives it the way it survives the pivot.
  it('keeps the survivors in data order, with "Others" last', () => {
    const { config } = normalize({
      data: [
        { month: 'Jan', region: 'Small', amount: 1 },
        { month: 'Jan', region: 'Big', amount: 90 },
        { month: 'Jan', region: 'Tiny', amount: 2 },
        { month: 'Jan', region: 'Mid', amount: 50 },
      ],
      y: 'amount',
      series: 'region',
      maxSeries: 3,
    })
    expect(namesOf(config)).toEqual(['Big', 'Mid', '__others__'])
  })

  it('leaves an x where every collapsed series was missing missing', () => {
    const { config } = normalize({
      data: [
        { month: 'Jan', region: 'East', amount: 50 },
        { month: 'Jan', region: 'West', amount: 30 },
        { month: 'Jan', region: 'North', amount: 15 },
        { month: 'Feb', region: 'East', amount: 20 },
      ],
      y: 'amount',
      series: 'region',
      maxSeries: 2,
    })
    expect(config.data).toEqual([
      { month: 'Jan', East: 50, __others__: 45 },
      { month: 'Feb', East: 20, __others__: null },
    ])
  })

  it('leaves at least one series beside "Others" whatever the cap says', () => {
    for (const maxSeries of [1, 0.5, -3]) {
      const { config } = grouped({ maxSeries })
      expect(namesOf(config)).toEqual(['East', '__others__'])
    }
  })

  it('warns and caps nothing when y names the columns', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const { config } = normalize({ maxSeries: 1 })
    expect(namesOf(config)).toEqual(['sales', 'refunds'])
    expect(warn).toHaveBeenCalledOnce()
    expect(warn.mock.calls[0][0]).toContain('[frappe-ui]')
    expect(warn.mock.calls[0][0]).toContain('maxSeries')
  })

  it('says nothing when maxSeries is left out', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    normalize()
    expect(warn).not.toHaveBeenCalled()
  })
})
