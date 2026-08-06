import { describe, expect, it } from 'vitest'
import {
  buildAreaChartOption,
  buildAxisChartOption,
  buildBarChartOption,
  buildLineChartOption,
} from './axisChartOptions'
import { LINE_Z, MARK_Z } from './axisChartCommon'
import { BAR_DATA_LABEL_GUTTER } from './barChartOptions'
import { LINE_DATA_LABEL_GUTTER } from './lineChartOptions'
import type { ChartTheme } from './theme'
import type { AxisChartConfig, AxisSeriesType } from './types'

const theme: ChartTheme = {
  palette: ['#111111', '#222222', '#333333'],
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

/** Revenue in currency against a rate: the chart combo and y2 both exist for. */
function config(overrides: Partial<AxisChartConfig> = {}): AxisChartConfig {
  return {
    data: [
      { month: 'Jan', revenue: 100, growth: 4 },
      { month: 'Feb', revenue: 140, growth: 6 },
    ],
    xAxis: { key: 'month', type: 'category' },
    series: [{ name: 'revenue' }, { name: 'growth', type: 'line' }],
    ...overrides,
  }
}

function build(
  overrides: Partial<AxisChartConfig> = {},
  defaultType: AxisSeriesType = 'bar',
  hiddenSeries?: string[],
) {
  return buildAxisChartOption(
    config(overrides),
    { theme, hiddenSeries },
    defaultType,
  ) as any
}

const typesOf = (option: any) => option.series.map((s: any) => s.type)
const valuesOf = (series: any) =>
  series.data.map((item: any) => (Array.isArray(item) ? item : item.value))

describe('combo series', () => {
  it('draws each series as the type it names', () => {
    expect(typesOf(build())).toEqual(['bar', 'line'])
  })

  it('falls back to the shape of the chart it was handed to', () => {
    const plain = { series: [{ name: 'revenue' }, { name: 'growth' }] }
    expect(typesOf(build(plain, 'bar'))).toEqual(['bar', 'bar'])
    expect(typesOf(build(plain, 'line'))).toEqual(['line', 'line'])
    // An area is a line series with a fill, so echarts still calls it a line.
    const area = build(plain, 'area')
    expect(typesOf(area)).toEqual(['line', 'line'])
    expect(area.series[0].areaStyle).toBeTruthy()
  })

  it('recasts a series in any of the three charts', () => {
    const recast = config({
      series: [{ name: 'revenue' }, { name: 'growth', type: 'bar' }],
    })
    expect(typesOf(buildLineChartOption(recast, { theme }))).toEqual([
      'line',
      'bar',
    ])

    const area = buildAreaChartOption(recast, { theme }) as any
    expect(typesOf(area)).toEqual(['line', 'bar'])
    expect(area.series[1].areaStyle).toBeUndefined()
  })

  it('gives a recast series the keys of the shape it is drawn as', () => {
    const option = build({
      series: [
        { name: 'revenue' },
        { name: 'growth', type: 'line', lineType: 'dashed', smooth: true },
      ],
    })
    expect(option.series[1].lineStyle.type).toBe('dashed')
    expect(option.series[1].smooth).toBe(true)
  })

  it('keeps the per-series escape hatch on a recast series', () => {
    const option = build({
      series: [
        { name: 'revenue' },
        { name: 'growth', type: 'line', echartOptions: { symbol: 'triangle' } },
      ],
    })
    expect(option.series[1].symbol).toBe('triangle')
  })

  it('measures a recast series against the second value axis', () => {
    const option = build({
      series: [
        { name: 'revenue' },
        { name: 'growth', type: 'line', axis: 'y2' },
      ],
      y2Axis: { max: 10 },
    })
    expect(option.yAxis).toHaveLength(2)
    expect(option.yAxis[1].max).toBe(10)
    expect(option.series.map((s: any) => s.yAxisIndex)).toEqual([0, 1])
  })

  it('draws a line over the marks it is read against', () => {
    const option = build()
    expect(option.series[0].z).toBeUndefined()
    expect(option.series[1].z).toBe(LINE_Z)
  })

  it('leaves a band on the same plane as the columns', () => {
    const option = build({
      series: [{ name: 'revenue' }, { name: 'growth', type: 'area' }],
    })
    expect(option.series[1].z).toBe(MARK_Z)
  })
})

describe('combo axes', () => {
  it('shades the pointer and insets the categories when anything is a bar', () => {
    const option = build()
    expect(option.tooltip.axisPointer.type).toBe('shadow')
    expect(option.xAxis.boundaryGap).toBe(true)
  })

  it('rules the pointer and runs edge to edge when nothing is', () => {
    const option = build(
      { series: [{ name: 'revenue' }, { name: 'growth', type: 'area' }] },
      'line',
    )
    expect(option.tooltip.axisPointer.type).toBe('line')
    expect(option.xAxis.boundaryGap).toBe(false)
  })

  // Hiding the last bar must not re-space the axis under the remaining line:
  // the plot would reflow on a legend click.
  it('holds the inset and the pointer when the only bar is hidden', () => {
    const option = build({}, 'bar', ['revenue'])
    expect(option.series).toHaveLength(1)
    expect(option.xAxis.boundaryGap).toBe(true)
    expect(option.tooltip.axisPointer.type).toBe('shadow')
  })

  it('reserves the widest gutter the labelled series need', () => {
    expect(
      build({
        series: [
          { name: 'revenue', showDataLabels: true },
          { name: 'growth', type: 'line', showDataLabels: true },
        ],
      }).grid.top,
    ).toBe(8 + BAR_DATA_LABEL_GUTTER)

    expect(
      build({
        series: [
          { name: 'revenue' },
          { name: 'growth', type: 'line', showDataLabels: true },
        ],
      }).grid.top,
    ).toBe(8 + LINE_DATA_LABEL_GUTTER)
  })
})

describe('combo stacking', () => {
  const stacks = (option: any) => option.series.map((s: any) => s.stack)

  it('never stacks a line, whatever the chart says', () => {
    expect(stacks(build({ stacked: true }))).toEqual(['bar:stack', undefined])
  })

  it('keeps columns and bands in stacks of their own', () => {
    const option = build({
      data: [{ month: 'Jan', revenue: 100, refunds: 20, growth: 4 }],
      stacked: true,
      series: [
        { name: 'revenue' },
        { name: 'growth', type: 'area' },
        { name: 'refunds' },
      ],
    })
    expect(stacks(option)).toEqual(['bar:stack', 'area:stack', 'bar:stack'])
  })

  it('namespaces a named stack by its shape too', () => {
    expect(
      stacks(
        build({
          stacked: true,
          series: [
            { name: 'revenue', stackName: 'left' },
            { name: 'growth', type: 'area', stackName: 'left' },
          ],
        }),
      ),
    ).toEqual(['bar:left', 'area:left'])
  })

  it('rounds the outermost column without counting the line', () => {
    const option = build({
      stacked: true,
      data: [{ month: 'Jan', revenue: 100, refunds: 20, growth: 4 }],
      series: [
        { name: 'revenue' },
        { name: 'growth', type: 'line' },
        { name: 'refunds' },
      ],
    })
    // The last *bar* tops the column; the line after it is not part of the stack.
    expect(option.series[0].data[0].itemStyle.borderRadius).toBe(0)
    expect(option.series[2].data[0].itemStyle.borderRadius).toEqual([
      4, 4, 0, 0,
    ])
  })
})

describe('combo on a horizontal chart', () => {
  const horizontal = {
    horizontal: true,
    series: [
      { name: 'revenue' },
      { name: 'growth', type: 'line' as const, showDataLabels: true },
    ],
  }

  it('runs a recast line along the value axis', () => {
    const option = build(horizontal)
    expect(valuesOf(option.series[0])).toEqual([
      [100, 'Jan'],
      [140, 'Feb'],
    ])
    expect(valuesOf(option.series[1])).toEqual([
      [4, 'Jan'],
      [6, 'Feb'],
    ])
  })

  it('labels past the end of the line, and the other way in RTL', () => {
    expect(build(horizontal).series[1].label.position).toBe('right')
    expect(build({ ...horizontal, dir: 'rtl' }).series[1].label.position).toBe(
      'left',
    )
  })

  it('fades a recast band towards the axis it is measured from', () => {
    const vertical = build({
      series: [{ name: 'growth', type: 'area' }],
    }).series[0].areaStyle.color
    expect([vertical.x, vertical.y, vertical.x2, vertical.y2]).toEqual([
      0, 0, 0, 1,
    ])

    const sideways = build({
      horizontal: true,
      series: [{ name: 'growth', type: 'area' }],
    }).series[0].areaStyle.color
    expect([sideways.x, sideways.y, sideways.x2, sideways.y2]).toEqual([
      1, 0, 0, 0,
    ])
  })
})

describe('buildAxisChartOption entry points', () => {
  it('hands each chart its own default shape', () => {
    const plain = config({ series: [{ name: 'revenue' }] })
    const seriesOf = (option: any) => option.series[0]

    expect(seriesOf(buildBarChartOption(plain, { theme })).type).toBe('bar')
    expect(seriesOf(buildLineChartOption(plain, { theme })).type).toBe('line')

    const area = seriesOf(buildAreaChartOption(plain, { theme }))
    expect(area.type).toBe('line')
    expect(area.areaStyle).toBeTruthy()
  })
})
