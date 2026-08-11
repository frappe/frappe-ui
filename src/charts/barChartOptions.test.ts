import { describe, expect, it } from 'vitest'
import { buildAxisChartOption } from './axisChartOptions'
import { AXIS_LABEL_FONT_SIZE, resolveSeriesColors } from './axisChartCommon'
import { estimateTextWidth } from './format'
import type { ChartTokens } from './tokens'
import type { AxisChartConfig } from './types'

const tokens: ChartTokens = {
  categorical: ['#111111', '#222222', '#333333'],
  // Five stops so the sequential pale-tail trim and even spacing are visible.
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

/** What `BarChart` hands the builder: the shared config, marked `'bar'`. */
function config(overrides: Partial<AxisChartConfig> = {}): AxisChartConfig {
  return {
    type: 'bar',
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
  width?: number,
) {
  return buildAxisChartOption(config(overrides), {
    tokens,
    hiddenSeries,
    width,
  }) as any
}

function colorsFor(overrides: Partial<AxisChartConfig> = {}) {
  return resolveSeriesColors(config(overrides), tokens)
}

/** The plain [category, value] pairs behind a series' data items. */
const valuesOf = (series: any) => series.data.map((item: any) => item.value)

/** The corner radii each of a series' bars carries, row by row. */
const radiiOf = (series: any) =>
  series.data.map((item: any) => item.itemStyle.borderRadius)

const named = (count: number) =>
  Array.from({ length: count }, (_, i) => ({
    name: String.fromCharCode(97 + i),
  }))

describe('resolveSeriesColors', () => {
  it('defaults to the sequential ramp and honours explicit series colors', () => {
    expect(
      colorsFor({
        series: [{ name: 'sales' }, { name: 'refunds', color: 'red' }],
      }),
    ).toEqual({ sales: '#000011', refunds: 'red' })
  })

  it('gives a lone sequential series a mid stop, not the darkest', () => {
    expect(colorsFor({ series: [{ name: 'sales' }] })).toEqual({
      sales: '#000022',
    })
  })

  it('spaces sequential series out dark to light, skipping the palest stops', () => {
    expect(Object.values(colorsFor({ series: named(3) }))).toEqual([
      '#000011',
      '#000022',
      '#000033',
    ])
  })

  it('cycles the sequential ramp once there are more series than usable stops', () => {
    const colors = colorsFor({ series: named(6) })
    expect(colors.a).toBe('#000011')
    expect(colors.f).toBe(colors.a)
  })

  it('cycles the categorical ramp in series order', () => {
    const colors = colorsFor({ palette: 'categorical', series: named(4) })
    expect(Object.values(colors)).toEqual([
      '#111111',
      '#222222',
      '#333333',
      '#111111',
    ])
  })

  it('spans a diverging ramp end to end so the extremes read as opposites', () => {
    expect(Object.values(colorsFor({ palette: 'diverging' }))).toEqual([
      '#001100',
      '#003300',
    ])
  })

  it('cycles an explicit color list from palette', () => {
    expect(colorsFor({ palette: ['a', 'b'] }).sales).toBe('a')
    expect(colorsFor({ palette: ['a', 'b'] }).refunds).toBe('b')
  })
})

describe('bar chart option axes', () => {
  it('puts categories on the x axis and values on the y axis', () => {
    const option = build()
    expect(option.xAxis.type).toBe('category')
    expect(option.xAxis.data).toEqual(['Jan', 'Feb'])
    expect(option.yAxis.type).toBe('value')
    expect(option.yAxis.position).toBe('left')
  })

  it('swaps the axes when horizontal', () => {
    const option = build({ horizontal: true })
    expect(option.yAxis.type).toBe('category')
    expect(option.xAxis.type).toBe('value')
    expect(option.xAxis.position).toBe('bottom')
    // First category reads from the top down.
    expect(option.yAxis.inverse).toBe(true)
  })

  it('inverts the category axis and flips the value axis in RTL', () => {
    const option = build({ dir: 'rtl' })
    expect(option.xAxis.inverse).toBe(true)
    expect(option.yAxis.position).toBe('right')
  })

  it('inverts the value axis, not the category axis, for horizontal RTL', () => {
    const option = build({ horizontal: true, dir: 'rtl' })
    expect(option.xAxis.inverse).toBe(true)
    expect(option.yAxis.position).toBe('right')
  })

  it('gridlines the value axis and baselines the category axis, in token ink', () => {
    const option = build()
    expect(option.xAxis.axisLabel.color).toBe(tokens.axisLabel)

    // Gridlines run across the values; the category axis carries the baseline.
    expect(option.yAxis.splitLine.show).toBe(true)
    expect(option.yAxis.splitLine.lineStyle.color).toBe(tokens.splitLine)
    expect(option.xAxis.splitLine.show).toBe(false)
    expect(option.yAxis.axisLine.show).toBe(false)
    expect(option.xAxis.axisLine.lineStyle.color).toBe(tokens.splitLine)
  })

  it('puts dates on a time axis without being told to', () => {
    const option = build({
      data: [
        { month: new Date('2024-01-01'), sales: 10 },
        { month: new Date('2024-02-01'), sales: 20 },
      ],
      xAxis: { key: 'month' },
      series: [{ name: 'sales' }],
    })
    expect(option.xAxis.type).toBe('time')
    expect(option.xAxis.data).toBeUndefined()
    // The grain follows the spacing of the rows, so ticks read as months.
    expect(option.xAxis.axisLabel.formatter('2024-03-01')).toBe('Mar')
  })

  it('leaves plain labels on a category axis, and honours an explicit type', () => {
    expect(build({ xAxis: { key: 'month' } }).xAxis.type).toBe('category')

    const forced = build({
      data: [
        { month: new Date('2024-01-01'), sales: 10 },
        { month: new Date('2024-02-01'), sales: 20 },
      ],
      xAxis: { key: 'month', type: 'category' },
      series: [{ name: 'sales' }],
    })
    expect(forced.xAxis.type).toBe('category')
  })

  it('thins crowded labels out and keeps the last category on both axes', () => {
    const vertical = build()
    expect(vertical.xAxis.axisLabel.hideOverlap).toBe(true)
    expect(vertical.xAxis.axisLabel.showMaxLabel).toBe(true)
    expect(vertical.yAxis.axisLabel.hideOverlap).toBe(true)
    expect(vertical.yAxis.axisLabel.showMaxLabel).toBe(true)

    // The category axis is the y axis here, so the pinning has to follow it.
    const horizontal = build({ horizontal: true })
    expect(horizontal.yAxis.axisLabel.showMaxLabel).toBe(true)
    expect(horizontal.xAxis.axisLabel.showMaxLabel).toBe(true)
  })

  it('caps a horizontal chart’s label column at a third of the width', () => {
    const option = build({ horizontal: true }, undefined, 600)
    expect(option.yAxis.axisLabel.width).toBe(192)
    expect(option.yAxis.axisLabel.overflow).toBe('truncate')
  })

  it('keeps the cap readable on a narrow chart', () => {
    const option = build({ horizontal: true }, undefined, 100)
    expect(option.yAxis.axisLabel.width).toBe(56)
  })

  it('re-reads the cap from the width it is given', () => {
    const wide = build({ horizontal: true }, undefined, 900)
    const narrow = build({ horizontal: true }, undefined, 300)
    expect(wide.yAxis.axisLabel.width).toBe(288)
    expect(narrow.yAxis.axisLabel.width).toBe(96)
  })

  it('middle-truncates category labels that overrun the cap', () => {
    const option = build({ horizontal: true }, undefined, 300)
    const format = option.yAxis.axisLabel.formatter
    const truncated = format('Referral Partners and Affiliate Network')
    expect(truncated).toMatch(/^Referr.*….*Network$/)
    expect(
      estimateTextWidth(truncated, AXIS_LABEL_FONT_SIZE),
    ).toBeLessThanOrEqual(option.yAxis.axisLabel.width)
    expect(format('Direct')).toBe('Direct')
  })

  it('leaves the cap off until the chart has been measured', () => {
    const option = build({ horizontal: true })
    expect(option.yAxis.axisLabel.width).toBeUndefined()
    expect(option.yAxis.axisLabel.formatter('Referral Partners and More')).toBe(
      'Referral Partners and More',
    )
  })

  it('leaves a vertical chart’s category labels uncapped', () => {
    const option = build({}, undefined, 600)
    expect(option.xAxis.axisLabel.width).toBeUndefined()
    expect(option.yAxis.axisLabel.width).toBeUndefined()
  })

  it('leaves a horizontal time axis uncapped, its labels being short', () => {
    const option = build(
      { horizontal: true, xAxis: { key: 'month', type: 'time' } },
      undefined,
      600,
    )
    expect(option.yAxis.axisLabel.width).toBeUndefined()
  })

  it('leaves a time axis free to drop its end label', () => {
    const option = build({ xAxis: { key: 'month', type: 'time' } })
    expect(option.xAxis.axisLabel.hideOverlap).toBe(true)
    expect(option.xAxis.axisLabel.showMaxLabel).toBeUndefined()
  })

  it('formats value ticks compactly and category ticks verbatim', () => {
    const option = build()
    expect(option.yAxis.axisLabel.formatter(1500)).toBe('1.5K')
    expect(option.xAxis.axisLabel.formatter('Jan')).toBe('Jan')
  })

  it('labels a time axis by tick level, not date by date', () => {
    const option = build({
      xAxis: { key: 'month', type: 'time', timeGrain: 'month' },
    })
    expect(option.xAxis.type).toBe('time')
    expect(option.xAxis.data).toBeUndefined()

    const { formatter, rich } = option.xAxis.axisLabel
    expect(formatter('2024-03-01')).toBe('Mar')
    // The tick that opens a year names the year, and echarts marks it as the
    // primary level so the rich style can set it apart.
    expect(formatter('2024-01-01')).toBe('2024')
    expect(formatter('2024-01-01', 0, { level: 1 })).toBe('{primary|2024}')
    expect(rich.primary.fontWeight).toBe(600)
    // Nothing a monthly series can say about a single day.
    expect(formatter('2024-03-15')).toBe('')
  })

  it('passes min and max through', () => {
    const option = build({ yAxis: { min: 0, max: 100 } })
    expect(option.yAxis.min).toBe(0)
    expect(option.yAxis.max).toBe(100)
  })
})

describe('bar chart option series', () => {
  it('emits one bar series per config entry as [category, value] pairs', () => {
    const option = build()
    expect(option.series).toHaveLength(2)
    expect(option.series[0].type).toBe('bar')
    expect(option.series[0].name).toBe('sales')
    expect(valuesOf(option.series[0])).toEqual([
      ['Jan', 10],
      ['Feb', 20],
    ])
  })

  it('reverses the pair order when horizontal', () => {
    const option = build({ horizontal: true })
    expect(valuesOf(option.series[0])).toEqual([
      [10, 'Jan'],
      [20, 'Feb'],
    ])
  })

  it('coerces blanks and non-numbers to null so bars are skipped', () => {
    const option = build({
      data: [
        { month: 'Jan', sales: '' },
        { month: 'Feb', sales: 'n/a' },
        { month: 'Mar', sales: '30' },
      ],
      series: [{ name: 'sales' }],
    })
    expect(valuesOf(option.series[0])).toEqual([
      ['Jan', null],
      ['Feb', null],
      ['Mar', 30],
    ])
  })

  it('leaves series unstacked by default', () => {
    const option = build()
    expect(option.series[0].stack).toBeUndefined()
  })

  it('stacks series and rounds only the outermost bar', () => {
    const option = build({ stacked: true })
    // The stack key carries the mark: bars stack with bars, never onto a band.
    expect(option.series.map((s: any) => s.stack)).toEqual([
      'bar:stack',
      'bar:stack',
    ])
    expect(radiiOf(option.series[0])).toEqual([0, 0])
    expect(radiiOf(option.series[1])).toEqual([
      [4, 4, 0, 0],
      [4, 4, 0, 0],
    ])
  })

  it('rounds the outermost bar of each named stack', () => {
    const option = build({
      stacked: true,
      series: [
        { name: 'a', stackName: 'left' },
        { name: 'b', stackName: 'right' },
        { name: 'c', stackName: 'left' },
      ],
      data: [{ month: 'Jan', a: 1, b: 2, c: 3 }],
    })
    const radii = option.series.map((s: any) => radiiOf(s)[0])
    expect(radii[0]).toBe(0)
    expect(radii[1]).toEqual([4, 4, 0, 0])
    expect(radii[2]).toEqual([4, 4, 0, 0])
  })

  it('rounds the trailing edge of horizontal bars, mirrored in RTL', () => {
    expect(radiiOf(build({ horizontal: true }).series[0])[0]).toEqual([
      0, 4, 4, 0,
    ])
    expect(
      radiiOf(build({ horizontal: true, dir: 'rtl' }).series[0])[0],
    ).toEqual([4, 0, 0, 4])
  })

  it('rounds a bar below zero at its tip, not at the baseline', () => {
    const option = build({
      data: [
        { month: 'Jan', sales: 10 },
        { month: 'Feb', sales: -10 },
      ],
      series: [{ name: 'sales' }],
    })
    expect(radiiOf(option.series[0])).toEqual([
      [4, 4, 0, 0],
      [0, 0, 4, 4],
    ])
  })

  it('rounds a horizontal bar below zero at its left end, mirrored in RTL', () => {
    const data = [{ month: 'Jan', sales: -10 }]
    const series = [{ name: 'sales' }]
    expect(
      radiiOf(build({ horizontal: true, data, series }).series[0]),
    ).toEqual([[4, 0, 0, 4]])
    expect(
      radiiOf(build({ horizontal: true, dir: 'rtl', data, series }).series[0]),
    ).toEqual([[0, 4, 4, 0]])
  })

  it('rounds each end of a mixed-sign stack, on the segment that reaches it', () => {
    const option = build({
      stacked: true,
      data: [{ month: 'Jan', sales: 10, refunds: -4, fees: -2 }],
      series: [{ name: 'sales' }, { name: 'refunds' }, { name: 'fees' }],
    })
    // The only bar above zero tops the stack; the lower of the two below it
    // ends the run downwards.
    expect(radiiOf(option.series[0])[0]).toEqual([4, 4, 0, 0])
    expect(radiiOf(option.series[1])[0]).toBe(0)
    expect(radiiOf(option.series[2])[0]).toEqual([0, 0, 4, 4])
  })

  it('rounds row by row, so a stack that flips sign flips its tip', () => {
    const option = build({
      stacked: true,
      data: [
        { month: 'Jan', sales: 10, refunds: 5 },
        { month: 'Feb', sales: -10, refunds: -5 },
      ],
      series: [{ name: 'sales' }, { name: 'refunds' }],
    })
    expect(radiiOf(option.series[0])).toEqual([0, 0])
    expect(radiiOf(option.series[1])).toEqual([
      [4, 4, 0, 0],
      [0, 0, 4, 4],
    ])
  })

  it('leaves a zero or missing bar square', () => {
    const option = build({
      data: [
        { month: 'Jan', sales: 0 },
        { month: 'Feb', sales: '' },
      ],
      series: [{ name: 'sales' }],
    })
    expect(radiiOf(option.series[0])).toEqual([0, 0])
  })

  it('passes a zero bar in a stack over to the segment that has length', () => {
    const option = build({
      stacked: true,
      data: [{ month: 'Jan', sales: 10, refunds: 0 }],
      series: [{ name: 'sales' }, { name: 'refunds' }],
    })
    expect(radiiOf(option.series[0])[0]).toEqual([4, 4, 0, 0])
    expect(radiiOf(option.series[1])[0]).toBe(0)
  })

  it('applies the resolved series color', () => {
    const option = build()
    expect(option.series[0].itemStyle.color).toBe('#000011')
    expect(option.series[1].itemStyle.color).toBe('#000033')
  })

  it('emphasises a whole series at a time, and only gently', () => {
    const option = build()
    expect(option.series[0].emphasis).toEqual({
      focus: 'series',
      blurScope: 'coordinateSystem',
    })
    // Legend hover is the only thing that blurs, so it has to stay readable.
    expect(option.series[0].blur.itemStyle.opacity).toBeGreaterThan(0.5)
    expect(option.series[0].blur.itemStyle.opacity).toBeLessThan(1)
  })

  it('hides data labels unless asked, and formats them compactly', () => {
    expect(build().series[0].label.show).toBe(false)
    const option = build({ series: [{ name: 'sales', showDataLabels: true }] })
    expect(option.series[0].label.show).toBe(true)
    expect(option.series[0].label.position).toBe('top')
    expect(option.series[0].label.formatter({ value: ['Jan', 2500] })).toBe(
      '2.5K',
    )
  })

  it('moves data labels to the bar end when horizontal', () => {
    expect(
      build({ horizontal: true, series: [{ name: 'sales' }] }).series[0].label
        .position,
    ).toBe('right')
    expect(
      build({ horizontal: true, dir: 'rtl', series: [{ name: 'sales' }] })
        .series[0].label.position,
    ).toBe('left')
  })

  it('labels every stacked segment in place', () => {
    const option = build({ stacked: true })
    expect(option.series.map((s: any) => s.label.position)).toEqual([
      'inside',
      'inside',
    ])
  })

  it('flips a stacked label to white once its segment is dark enough', () => {
    const option = build({
      stacked: true,
      palette: ['#0a2d5a', '#dbeafe'],
      series: [
        { name: 'sales', showDataLabels: true },
        { name: 'refunds', showDataLabels: true },
      ],
    })
    expect(option.series[0].label.color).toBe('#ffffff')
    expect(option.series[1].label.color).toBe('ink-8')
  })

  // The palette's mid stops sit either side of the white/ink crossover, and
  // both used to come back white — unreadable on the pale ones.
  it('keeps the dark ink on a mid-tone fill that white would not clear', () => {
    const option = build({
      stacked: true,
      // Slot 5 (violet) against slot 6 (violet light).
      palette: ['#753cbb', '#bb9df1'],
      series: [
        { name: 'sales', showDataLabels: true },
        { name: 'refunds', showDataLabels: true },
      ],
    })
    expect(option.series[0].label.color).toBe('#ffffff')
    expect(option.series[1].label.color).toBe('ink-8')
  })
})

describe('bar chart option second value axis', () => {
  const dualSeries = [
    { name: 'sales' },
    { name: 'refunds', axis: 'y2' as const },
  ]

  it('draws the second axis opposite the primary and indexes the series', () => {
    const option = build({ y2Axis: { title: 'rate' }, series: dualSeries })
    expect(option.yAxis.map((a: any) => a.position)).toEqual(['left', 'right'])
    expect(option.yAxis[1].alignTicks).toBe(true)
    expect(option.yAxis[1].splitLine.show).toBe(false)
    expect(option.series.map((s: any) => s.yAxisIndex)).toEqual([0, 1])
  })

  it('ignores the second axis on horizontal bars, where the value axis is x', () => {
    const option = build({
      horizontal: true,
      y2Axis: { title: 'rate' },
      series: dualSeries,
    })
    expect(Array.isArray(option.xAxis)).toBe(false)
    expect(option.xAxis.type).toBe('value')
    // yAxisIndex points at the category axis here; every series shares it.
    expect(option.series.map((s: any) => s.yAxisIndex)).toEqual([0, 0])
  })
})

describe('bar chart option hidden series', () => {
  it('drops hidden series from the option', () => {
    const option = build({}, ['sales'])
    expect(option.series.map((s: any) => s.name)).toEqual(['refunds'])
  })

  it('keeps every series on its own color when one is hidden', () => {
    const option = build({}, ['sales'])
    expect(option.series[0].itemStyle.color).toBe('#000033')
  })

  it('rounds the outermost of the series that remain', () => {
    const option = build({ stacked: true }, ['refunds'])
    expect(radiiOf(option.series[0])[0]).toEqual([4, 4, 0, 0])
  })
})

describe('bar chart option chrome', () => {
  it('leaves the title and legend to the HTML chrome', () => {
    const option = build({ title: 'Sales', subtitle: 'By month' })
    expect(option.title).toBeUndefined()
    expect(option.legend).toBeUndefined()
  })

  it('leaves the value-axis title to the chrome, whichever way the bars run', () => {
    expect(build({ yAxis: { title: 'amount' } }).yAxis.name).toBeUndefined()
    expect(
      build({ horizontal: true, yAxis: { title: 'amount' } }).xAxis.name,
    ).toBeUndefined()
  })

  it('keeps the echarts tooltip for its axis pointer but hides its content', () => {
    const option = build()
    expect(option.tooltip.trigger).toBe('axis')
    expect(option.tooltip.showContent).toBe(false)
  })
})

describe('bar chart option escape hatches', () => {
  it('deep merges echartOptions over the generated option', () => {
    const option = build({
      echartOptions: { grid: { left: 40 }, animation: false },
    })
    expect(option.grid.left).toBe(40)
    expect(option.grid.outerBoundsContain).toBe('all')
    expect(option.animation).toBe(false)
  })

  it('merges per-axis and per-series echartOptions', () => {
    const option = build({
      xAxis: {
        key: 'month',
        type: 'category',
        echartOptions: { inverse: true },
      },
      yAxis: { echartOptions: { splitLine: { show: false } } },
      series: [{ name: 'sales', echartOptions: { barMaxWidth: 10 } }],
    })
    expect(option.xAxis.inverse).toBe(true)
    expect(option.yAxis.splitLine.show).toBe(false)
    expect(option.yAxis.splitLine.lineStyle.color).toBe('outline-1')
    expect(option.series[0].barMaxWidth).toBe(10)
  })

  it('replaces arrays instead of merging them index-wise', () => {
    const option = build({ echartOptions: { series: [] } })
    expect(option.series).toEqual([])
  })
})

describe('bar chart option edge cases', () => {
  it('produces an empty series list for empty data', () => {
    const option = build({ data: [] })
    expect(option.xAxis.data).toEqual([])
    expect(option.series[0].data).toEqual([])
  })
})
