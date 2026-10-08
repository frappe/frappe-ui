import { describe, expect, it } from 'vitest'
import { buildAxisChartOption, DEFAULT_LINE_WIDTH } from './axisChartOptions'
import { AXIS_LABEL_FONT_SIZE, dashedLine } from './axisChartCommon'
import { estimateTextWidth, formatValue } from './format'
import type { ChartTokens } from './tokens'
import type { AxisChartConfig } from './types'

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

/** What `LineChart` hands the builder: the shared config, marked `'line'`. */
function config(overrides: Partial<AxisChartConfig> = {}): AxisChartConfig {
  return {
    type: 'line',
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
  return buildAxisChartOption(config(overrides), {
    tokens,
    hiddenSeries,
  }) as any
}

describe('line chart option axes', () => {
  it('puts categories on the x axis and values on the y axis', () => {
    const option = build()
    expect(option.xAxis.type).toBe('category')
    expect(option.xAxis.data).toEqual(['Jan', 'Feb'])
    expect(option.yAxis.type).toBe('value')
    expect(option.yAxis.position).toBe('left')
  })

  it('insets a line on a category axis half a slot, as a bar sits', () => {
    expect(build().xAxis.boundaryGap).toBe(true)
  })

  it('draws horizontal gridlines only, in token ink', () => {
    const option = build()
    expect(option.xAxis.splitLine.show).toBe(false)
    expect(option.yAxis.splitLine.show).toBe(true)
    expect(option.yAxis.splitLine.lineStyle.color).toBe(tokens.gridline)
    expect(option.yAxis.axisLine.show).toBe(false)
    expect(option.xAxis.axisLabel.color).toBe(tokens.axisLabel)
    expect(option.yAxis.axisLabel.color).toBe(tokens.axisLabel)
  })

  it('flips the axes in RTL', () => {
    const option = build({ dir: 'rtl' })
    expect(option.xAxis.inverse).toBe(true)
    expect(option.yAxis.position).toBe('right')
  })

  it('thins crowded labels out and keeps the last category, RTL included', () => {
    for (const dir of ['ltr', 'rtl'] as const) {
      const option = build({ dir })
      expect(option.xAxis.axisLabel.hideOverlap).toBe(true)
      expect(option.xAxis.axisLabel.showMaxLabel).toBe(true)
      expect(option.yAxis.axisLabel.hideOverlap).toBe(true)
      expect(option.yAxis.axisLabel.showMaxLabel).toBe(true)
    }
  })

  it('labels a time axis by tick level, not date by date', () => {
    const option = build({
      xAxis: { key: 'month', type: 'time', timeGrain: 'month' },
    })
    expect(option.xAxis.type).toBe('time')
    expect(option.xAxis.data).toBeUndefined()

    const { formatter } = option.xAxis.axisLabel
    expect(formatter('2024-03-01')).toBe('Mar')
    expect(formatter('2024-01-01', 0, { level: 1 })).toBe('{primary|2024}')
    expect(formatter('2024-03-15')).toBe('')
  })

  it('formats value ticks compactly and passes min and max through', () => {
    const option = build({ yAxis: { min: 0, max: 100 } })
    expect(option.yAxis.axisLabel.formatter(1500)).toBe('1.5K')
    expect(option.yAxis.min).toBe(0)
    expect(option.yAxis.max).toBe(100)
  })
})

describe('line chart option time axis inset', () => {
  const WIDTH = 600
  const INSET = 32
  const DAY = 24 * 60 * 60 * 1000
  const FIRST = new Date(2026, 0, 5).getTime()
  const LAST = new Date(2026, 0, 25).getTime()
  // The one-digit tick the value axis prints, and its margin.
  const TICKS = Math.ceil(estimateTextWidth('1', AXIS_LABEL_FONT_SIZE)) + 8
  const PLOT = WIDTH - 4 - TICKS

  const dates = (days: number[]) =>
    days.map((day) => ({
      day: `2026-01-${String(day).padStart(2, '0')}`,
      sales: 1,
    }))

  function buildOn(
    overrides: Partial<AxisChartConfig> = {},
    measured: number | null = WIDTH,
  ) {
    return buildAxisChartOption(
      config({
        data: dates([5, 15, 25]),
        xAxis: { key: 'day', type: 'time', timeGrain: 'day' },
        series: [{ name: 'sales' }],
        ...overrides,
      }),
      { tokens, width: measured ?? undefined },
    ) as any
  }

  it('pads each end of the axis by 32px of the plot', () => {
    const { min, max } = buildOn().xAxis
    const pixelsPerMs = PLOT / (max - min)
    expect((FIRST - min) * pixelsPerMs).toBeCloseTo(INSET)
    expect((max - LAST) * pixelsPerMs).toBeCloseTo(INSET)
  })

  it('holds the pad at 32px as the plot narrows', () => {
    const { min, max } = buildOn({}, 300).xAxis
    const pixelsPerMs = (300 - 4 - TICKS) / (max - min)
    expect((FIRST - min) * pixelsPerMs).toBeCloseTo(INSET)
  })

  it('pads nothing for a single date, a chart not yet measured, or a plot too narrow', () => {
    for (const option of [
      buildOn({ data: dates([5, 5]) }),
      buildOn({}, null),
      buildOn({}, 2 * INSET + 4 + TICKS),
    ]) {
      expect(option.xAxis.min).toBeUndefined()
      expect(option.xAxis.max).toBeUndefined()
    }
  })

  it('pads a series too long to spread into Math.min', () => {
    const start = new Date(2000, 0, 1).getTime()
    const data = Array.from({ length: 200_000 }, (_, index) => ({
      day: new Date(start + index * 60_000).toISOString(),
      sales: 1,
    }))
    expect(buildOn({ data }).xAxis.min).toBeLessThan(start)
  })

  it('leaves an axis whose caller set an end, labels and all', () => {
    const option = buildOn({
      xAxis: {
        key: 'day',
        type: 'time',
        timeGrain: 'day',
        echartOptions: { min: FIRST - 3 * DAY },
      },
    })
    expect(option.xAxis.min).toBe(FIRST - 3 * DAY)
    expect(option.xAxis.max).toBeUndefined()
    expect(option.xAxis.axisLabel.formatter(FIRST - DAY)).toBe('4')
  })

  it('pads an area chart the same way', () => {
    expect(buildOn({ type: 'area' }).xAxis.min).toBeLessThan(FIRST)
  })

  it('leaves a chart with a bar to echarts, which insets for it', () => {
    const option = buildOn({
      type: 'bar',
      series: [{ name: 'sales' }, { name: 'refunds', type: 'line' }],
    })
    expect(option.xAxis.min).toBeUndefined()
    expect(option.xAxis.max).toBeUndefined()
    expect(option.xAxis.splitNumber).toBeUndefined()
  })

  it('leaves a row chart and a value axis as they were', () => {
    expect(buildOn({ horizontal: true }).yAxis.min).toBeUndefined()
    const value = buildOn({ xAxis: { key: 'sales', type: 'value' } })
    expect(value.xAxis.min).toBeUndefined()
  })

  it('splits the padded span further, to keep the ticks as dense as unpadded', () => {
    // Echarts divides the span by this to pick the interval, and a wider span
    // otherwise tips it into a coarser one.
    expect(buildOn().xAxis.splitNumber).toBeGreaterThan(6)
  })

  it('labels no tick that falls in the pad, past either end of the series', () => {
    const { formatter } = buildOn().xAxis.axisLabel
    expect(formatter(FIRST)).toBe('5')
    expect(formatter(LAST)).toBe('25')
    expect(formatter(FIRST - DAY)).toBe('')
    expect(formatter(LAST + DAY)).toBe('')
  })

  it('labels every tick on an axis it did not pad', () => {
    const { formatter } = buildOn({}, null).xAxis.axisLabel
    expect(formatter(FIRST - DAY)).toBe('4')
    expect(formatter(LAST + DAY)).toBe('26')
  })
})

describe('line chart option series', () => {
  it('emits one line series per config entry as [category, value] pairs', () => {
    const option = build()
    expect(option.series).toHaveLength(2)
    expect(option.series[0].type).toBe('line')
    expect(option.series[0].name).toBe('sales')
    expect(option.series[0].data).toEqual([
      ['Jan', 10],
      ['Feb', 20],
    ])
  })

  it('takes series colors from the sequential ramp by default', () => {
    const option = build()
    expect(option.series[0].lineStyle.color).toBe('#000011')
    expect(option.series[0].itemStyle.color).toBe('#000011')
    expect(option.series[1].lineStyle.color).toBe('#000033')
  })

  it('draws more than one line in separate hues on a ramp of five pairs', () => {
    const pairs = ['d1', 'l1', 'd2', 'l2', 'd3', 'l3', 'd4', 'l4', 'd5', 'l5']
    const option = buildAxisChartOption(config(), {
      tokens: { ...tokens, categorical: pairs },
    }) as any
    expect(option.series.map((s: any) => s.lineStyle.color)).toEqual([
      'd1',
      'l2',
    ])
  })

  it('honours explicit colors and palettes', () => {
    expect(build({ palette: ['a', 'b'] }).series[0].lineStyle.color).toBe('a')
    expect(build({ palette: 'categorical' }).series[1].lineStyle.color).toBe(
      '#222222',
    )
    expect(
      build({ series: [{ name: 'sales', color: 'red' }] }).series[0].lineStyle
        .color,
    ).toBe('red')
  })

  it('breaks the line of a dashed series, solid otherwise', () => {
    expect(build().series[0].lineStyle.type).toBe('solid')

    const option = build({ series: [{ name: 'sales', dashed: true }] })
    // The reference lines' dash, at the one stroke width the library draws.
    expect(option.series[0].lineStyle.type).toEqual(
      dashedLine(DEFAULT_LINE_WIDTH).type,
    )
    expect(option.series[0].lineStyle.width).toBe(DEFAULT_LINE_WIDTH)
  })

  it('hides datapoints unless asked for', () => {
    expect(build().series[0].showSymbol).toBe(false)
    expect(
      build({ series: [{ name: 'sales', showDataPoints: true }] }).series[0]
        .showSymbol,
    ).toBe(true)
  })

  it('keeps the symbols that carry data labels, drawn at no size', () => {
    const labelled = build({
      series: [{ name: 'sales', showDataLabels: true }],
    }).series[0]
    expect(labelled.showSymbol).toBe(true)
    expect(labelled.symbolSize).toBe(0)

    const both = build({
      series: [{ name: 'sales', showDataLabels: true, showDataPoints: true }],
    }).series[0]
    expect(both.symbolSize).toBeGreaterThan(0)
  })

  it('draws straight segments unless smoothing is asked for', () => {
    expect(build().series[0].smooth).toBe(false)
    expect(
      build({ series: [{ name: 'sales', smooth: true }] }).series[0].smooth,
    ).toBe(true)
  })

  it('leaves gaps at nulls, and bridges them only when asked', () => {
    const option = build({
      data: [
        { month: 'Jan', sales: 10 },
        { month: 'Feb', sales: null },
        { month: 'Mar', sales: '' },
        { month: 'Apr', sales: 'n/a' },
        { month: 'May', sales: '30' },
      ],
      series: [{ name: 'sales' }],
    })
    expect(option.series[0].connectNulls).toBe(false)
    expect(option.series[0].data).toEqual([
      ['Jan', 10],
      ['Feb', null],
      ['Mar', null],
      ['Apr', null],
      ['May', 30],
    ])
    expect(
      build({ series: [{ name: 'sales', connectNulls: true }] }).series[0]
        .connectNulls,
    ).toBe(true)
  })

  it('never emphasises a line, so the others keep their opacity', () => {
    const option = build()
    expect(option.series[0].emphasis).toEqual({ disabled: true })
    expect(option.series[0].blur).toBeUndefined()
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

  it('prints data labels in the series format', () => {
    const option = build({
      series: [{ name: 'sales', showDataLabels: true, format: (v) => `$${v}` }],
    })
    expect(option.series[0].label.formatter({ value: ['Jan', 2500] })).toBe(
      '$2500',
    )
  })

  it('draws no fill', () => {
    expect(build().series[0].areaStyle).toBeUndefined()
  })
})

describe('line chart option hidden series', () => {
  it('drops hidden series but keeps the rest on their own colors', () => {
    const option = build({}, ['sales'])
    expect(option.series.map((s: any) => s.name)).toEqual(['refunds'])
    expect(option.series[0].lineStyle.color).toBe('#000033')
  })
})

describe('line chart option chrome', () => {
  it('leaves the title and legend to the HTML chrome', () => {
    const option = build({ title: 'Sales', subtitle: 'By month' })
    expect(option.title).toBeUndefined()
    expect(option.legend).toBeUndefined()
  })

  it('points the axis with a rule rather than a shaded band', () => {
    const option = build()
    expect(option.tooltip.trigger).toBe('axis')
    expect(option.tooltip.showContent).toBe(false)
    expect(option.tooltip.axisPointer.type).toBe('line')
    expect(option.tooltip.axisPointer.lineStyle.color).toBe('outline-2')
    // Under the series, so the rule passes behind the data points it locates.
    expect(option.tooltip.axisPointer.z).toBe(1)
  })

  it('leaves the room for data labels to the laid-out chart', () => {
    // How far a label reaches depends on the axis ends echarts picks, so
    // `useAxisChart` moves the edge after layout rather than guessing here.
    expect(
      build({ series: [{ name: 'sales', showDataLabels: true }] }).grid.top,
    ).toBe(8)
  })

  it('leaves the y-axis title to the chrome above the plot', () => {
    const option = build({ yAxis: { title: 'amount' } })
    expect(option.yAxis.name).toBeUndefined()
    expect(option.grid.top).toBe(8)
  })
})

describe('line chart option second value axis', () => {
  function dual(overrides: Partial<AxisChartConfig> = {}) {
    return build({
      y2Axis: { title: 'rate' },
      series: [{ name: 'sales' }, { name: 'refunds', axis: 'y2' }],
      ...overrides,
    })
  }

  it('keeps a single axis object while no series asks for the second', () => {
    expect(Array.isArray(build().yAxis)).toBe(false)
    expect(Array.isArray(build({ y2Axis: { title: 'rate' } }).yAxis)).toBe(
      false,
    )
  })

  it('draws the second axis opposite the primary, and mirrors both in RTL', () => {
    const [primary, secondary] = dual().yAxis
    expect(primary.position).toBe('left')
    expect(secondary.position).toBe('right')

    const [rtlPrimary, rtlSecondary] = dual({ dir: 'rtl' }).yAxis
    expect(rtlPrimary.position).toBe('right')
    expect(rtlSecondary.position).toBe('left')
  })

  it('aligns the second scale to the first so the ticks share rows', () => {
    const [primary, secondary] = dual().yAxis
    expect(secondary.alignTicks).toBe(true)
    expect(primary.alignTicks).toBe(false)
  })

  it('draws gridlines from the primary axis only', () => {
    const [primary, secondary] = dual().yAxis
    expect(primary.splitLine.show).toBe(true)
    expect(secondary.splitLine.show).toBe(false)
  })

  it('formats and bounds the second axis the way it does the first', () => {
    const [, secondary] = dual({ y2Axis: { min: 0, max: 100 } }).yAxis
    expect(secondary.min).toBe(0)
    expect(secondary.max).toBe(100)
    expect(secondary.axisLabel.color).toBe('ink-5')
    expect(secondary.axisLabel.formatter(1500)).toBe('1.5K')
  })

  it('takes echartOptions for the second axis from y2Axis', () => {
    const [primary, secondary] = dual({
      yAxis: { echartOptions: { name: 'primary' } },
      y2Axis: { echartOptions: { name: 'secondary' } },
    }).yAxis
    expect(primary.name).toBe('primary')
    expect(secondary.name).toBe('secondary')
  })

  it('points each series at the axis it is measured against', () => {
    const series = dual().series
    expect(series.map((s: any) => s.yAxisIndex)).toEqual([0, 1])
  })

  it('leaves every series on the primary when nothing asks for the second', () => {
    const option = build({ y2Axis: { title: 'rate' } })
    expect(option.series.map((s: any) => s.yAxisIndex)).toEqual([0, 0])
  })

  it('keeps the second axis while its only series is hidden', () => {
    const option = buildAxisChartOption(
      config({
        y2Axis: { title: 'rate' },
        series: [{ name: 'sales' }, { name: 'refunds', axis: 'y2' }],
      }),
      { tokens, hiddenSeries: ['refunds'] },
    ) as any
    expect(option.yAxis).toHaveLength(2)
    expect(option.series).toHaveLength(1)
  })
})

describe('line chart option escape hatches', () => {
  it('deep merges chart, axis and series echartOptions', () => {
    const option = build({
      echartOptions: { grid: { left: 40 }, animation: false },
      xAxis: {
        key: 'month',
        type: 'category',
        echartOptions: { inverse: true },
      },
      yAxis: { echartOptions: { splitLine: { show: false } } },
      series: [{ name: 'sales', echartOptions: { symbolSize: 10 } }],
    })
    expect(option.grid.left).toBe(40)
    expect(option.grid.outerBoundsContain).toBe('all')
    expect(option.animation).toBe(false)
    expect(option.xAxis.inverse).toBe(true)
    expect(option.yAxis.splitLine.show).toBe(false)
    expect(option.yAxis.splitLine.lineStyle.color).toBe('outline-1')
    expect(option.series[0].symbolSize).toBe(10)
  })
})

describe('line chart option edge cases', () => {
  it('produces empty series data for empty data', () => {
    const option = build({ data: [] })
    expect(option.xAxis.data).toEqual([])
    expect(option.series[0].data).toEqual([])
  })
})
