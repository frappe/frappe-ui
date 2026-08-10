import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  buildAxisChartOption,
  DEFAULT_FILL_OPACITY,
  DEFAULT_STACKED_FILL_OPACITY,
} from './axisChartOptions'
import type { ChartTokens } from './tokens'
import type { AxisChartConfig, ChartMark } from './types'

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

/**
 * A chart whose series draw as different marks. `type` on the config is the
 * chart component the caller picked; `type` on a series overrides it.
 */
function config(overrides: Partial<AxisChartConfig> = {}): AxisChartConfig {
  return {
    type: 'bar',
    data: [
      { month: 'Jan', sales: 10, refunds: 2, rate: 30 },
      { month: 'Feb', sales: 20, refunds: 4, rate: 40 },
    ],
    xAxis: { key: 'month', type: 'category' },
    series: [{ name: 'sales' }, { name: 'refunds', type: 'line' }],
    ...overrides,
  }
}

function build(
  overrides: Partial<AxisChartConfig> = {},
  hiddenSeries?: string[],
) {
  return buildAxisChartOption(config(overrides), { tokens, hiddenSeries }) as any
}

const typesOf = (option: any) => option.series.map((s: any) => s.type)
const namesOf = (option: any) => option.series.map((s: any) => s.name)

afterEach(() => {
  vi.restoreAllMocks()
})

describe('combo series marks', () => {
  it('draws an unmarked series as the chart’s own mark', () => {
    for (const [type, drawn] of [
      ['bar', 'bar'],
      ['line', 'line'],
      ['area', 'line'],
    ] as const) {
      const option = build({ type, series: [{ name: 'sales' }] })
      expect(option.series[0].type).toBe(drawn)
    }
    // Only the area carries a fill; the other two are bare.
    expect(
      build({ type: 'area', series: [{ name: 'sales' }] }).series[0].areaStyle,
    ).toBeTruthy()
    expect(
      build({ type: 'line', series: [{ name: 'sales' }] }).series[0].areaStyle,
    ).toBeUndefined()
  })

  it('lets a series name its own mark, whichever chart it sits in', () => {
    expect(typesOf(build())).toEqual(['bar', 'line'])
    expect(
      typesOf(
        build({
          type: 'line',
          series: [{ name: 'sales', type: 'bar' }, { name: 'refunds' }],
        }),
      ),
    ).toEqual(['bar', 'line'])
  })

  it('fills one series of a line chart on `type: area` alone', () => {
    const option = build({
      type: 'line',
      series: [{ name: 'sales' }, { name: 'refunds', type: 'area' }],
    })
    expect(option.series[0].areaStyle).toBeUndefined()
    // The wash of an unstacked area: a gradient that fades to the axis.
    expect(option.series[1].areaStyle.color.type).toBe('linear')
    expect(option.series[1].areaStyle.color.colorStops[0].color).toBe(
      `rgba(0, 0, 51, ${DEFAULT_FILL_OPACITY})`,
    )
  })

  it('reads chart-level and per-series fillOpacity for that fill', () => {
    const option = build({
      type: 'line',
      fillOpacity: 0.5,
      series: [
        { name: 'sales', type: 'area' },
        { name: 'refunds', type: 'area', fillOpacity: 0.25 },
      ],
    })
    expect(option.series[0].areaStyle.color.colorStops[0].color).toBe(
      'rgba(0, 0, 17, 0.5)',
    )
    expect(option.series[1].areaStyle.color.colorStops[0].color).toBe(
      'rgba(0, 0, 51, 0.25)',
    )
  })

  it('paints lines over bands over bars, whatever order they are declared in', () => {
    const option = build({
      series: [
        { name: 'refunds', type: 'line' },
        { name: 'rate', type: 'area' },
        { name: 'sales' },
      ],
    })
    const z = option.series.map((s: any) => s.z)
    expect(z[0]).toBeGreaterThan(z[1])
    expect(z[1]).toBeGreaterThan(z[2])
    // Above the axis pointer, which passes behind every mark.
    expect(z[2]).toBeGreaterThan(option.tooltip.axisPointer.z)
  })
})

describe('combo axes', () => {
  it('insets the category axis and shades the pointer as soon as one bar is drawn', () => {
    const option = build()
    expect(option.xAxis.boundaryGap).toBe(true)
    expect(option.tooltip.axisPointer.type).toBe('shadow')
  })

  it('runs a bar-free chart edge to edge with a rule for a pointer', () => {
    const option = build({
      type: 'line',
      series: [{ name: 'sales' }, { name: 'refunds', type: 'area' }],
    })
    expect(option.xAxis.boundaryGap).toBe(false)
    expect(option.tooltip.axisPointer.type).toBe('line')
  })

  it('keeps the inset while the only bar is hidden in the legend', () => {
    const option = build({}, ['sales'])
    expect(namesOf(option)).toEqual(['refunds'])
    // Re-spacing the axis on a legend toggle would move every remaining point.
    expect(option.xAxis.boundaryGap).toBe(true)
    expect(option.tooltip.axisPointer.type).toBe('shadow')
  })

  it('measures a line series against the second value axis', () => {
    const option = build({
      y2Axis: { title: 'rate' },
      series: [{ name: 'sales' }, { name: 'rate', type: 'line', axis: 'y2' }],
    })
    expect(option.yAxis.map((a: any) => a.position)).toEqual(['left', 'right'])
    expect(option.series.map((s: any) => s.yAxisIndex)).toEqual([0, 1])
    expect(typesOf(option)).toEqual(['bar', 'line'])
  })

  it('reserves label room for the hungriest mark that shows labels', () => {
    const bare = build().grid.top
    const withLine = build({
      series: [
        { name: 'sales' },
        { name: 'refunds', type: 'line', showDataLabels: true },
      ],
    }).grid.top
    const withBar = build({
      series: [
        { name: 'sales', showDataLabels: true },
        { name: 'refunds', type: 'line', showDataLabels: true },
      ],
    }).grid.top

    expect(withLine).toBeGreaterThan(bare)
    // A free bar labels past its tip, which needs more room than a point does.
    expect(withBar).toBeGreaterThan(withLine)
  })
})

describe('combo colors', () => {
  it('assigns the same color to a series whatever mark it draws as', () => {
    const bars = build({ series: [{ name: 'sales' }, { name: 'refunds' }] })
    const mixed = build()
    expect(bars.series[0].itemStyle.color).toBe(mixed.series[0].itemStyle.color)
    expect(bars.series[1].itemStyle.color).toBe(mixed.series[1].itemStyle.color)
    // The line takes the same stop for its stroke as for its symbols.
    expect(mixed.series[1].lineStyle.color).toBe(
      mixed.series[1].itemStyle.color,
    )
  })

  it('keeps every series on its own color when one is hidden', () => {
    expect(build({}, ['sales']).series[0].itemStyle.color).toBe('#000033')
  })
})

describe('combo stacking', () => {
  it('stacks each mark among its own and leaves the line out of it', () => {
    const option = build({
      stacked: true,
      series: [
        { name: 'sales' },
        { name: 'refunds' },
        { name: 'rate', type: 'line' },
      ],
    })
    expect(option.series.map((s: any) => s.stack)).toEqual([
      'bar:stack',
      'bar:stack',
      undefined,
    ])
  })

  it('keeps a bar and an area apart even under one stackName', () => {
    const option = build({
      stacked: true,
      series: [
        { name: 'sales', stackName: 'totals' },
        { name: 'rate', type: 'area', stackName: 'totals' },
      ],
    })
    expect(option.series.map((s: any) => s.stack)).toEqual([
      'bar:totals',
      'area:totals',
    ])
  })

  it('washes an area that stacks with no other area, over stacked bars', () => {
    const option = build({
      stacked: true,
      series: [
        { name: 'sales' },
        { name: 'refunds' },
        { name: 'rate', type: 'area' },
      ],
    })
    // A solid band here would hide the bars it is drawn over.
    expect(option.series[2].areaStyle.color.type).toBe('linear')
    expect(option.series[2].areaStyle.color.colorStops[0].color).toContain(
      String(DEFAULT_FILL_OPACITY),
    )
  })

  it('bands two areas that do stack, bars alongside or not', () => {
    const option = build({
      stacked: true,
      series: [
        { name: 'sales' },
        { name: 'refunds', type: 'area' },
        { name: 'rate', type: 'area' },
      ],
    })
    expect(option.series[1].areaStyle.opacity).toBe(
      DEFAULT_STACKED_FILL_OPACITY,
    )
    expect(option.series[2].areaStyle.opacity).toBe(
      DEFAULT_STACKED_FILL_OPACITY,
    )
  })

  it('rounds the outermost bar of the stack, counting bars only', () => {
    const option = build({
      stacked: true,
      data: [{ month: 'Jan', sales: 10, refunds: 5, rate: 99 }],
      series: [
        { name: 'sales' },
        { name: 'refunds' },
        // Declared last and the tallest, but it is not in the column.
        { name: 'rate', type: 'line' },
      ],
    })
    const radii = option.series.map(
      (s: any) => s.data[0]?.itemStyle?.borderRadius,
    )
    expect(radii[0]).toBe(0)
    expect(radii[1]).toEqual([4, 4, 0, 0])
    // A line carries plain [category, value] pairs, with no item style at all.
    expect(option.series[2].data[0]).toEqual(['Jan', 99])
  })

  it('labels a stacked bar inside its segment and a line above its point', () => {
    const option = build({
      stacked: true,
      series: [
        { name: 'sales', showDataLabels: true },
        { name: 'refunds', type: 'line', showDataLabels: true },
      ],
    })
    expect(option.series[0].label.position).toBe('inside')
    expect(option.series[1].label.position).toBe('top')
  })
})

describe('combo line options', () => {
  it('applies the line keys to line and area series and no others', () => {
    const option = build({
      connectNulls: true,
      series: [
        { name: 'sales', smooth: true, lineType: 'dashed' },
        { name: 'refunds', type: 'line', smooth: true, lineType: 'dashed' },
        { name: 'rate', type: 'area', showDataPoints: true },
      ],
    })
    // The bar has no stroke to dash and no gap to bridge.
    expect(option.series[0].lineStyle).toBeUndefined()
    expect(option.series[0].smooth).toBeUndefined()
    expect(option.series[0].connectNulls).toBeUndefined()

    expect(option.series[1].lineStyle.type).toBe('dashed')
    expect(option.series[1].smooth).toBe(true)
    expect(option.series[1].connectNulls).toBe(true)
    expect(option.series[2].showSymbol).toBe(true)
  })

  it('merges per-series echartOptions whatever the mark', () => {
    const option = build({
      series: [
        { name: 'sales', echartOptions: { barMaxWidth: 10 } },
        { name: 'refunds', type: 'line', echartOptions: { symbolSize: 12 } },
      ],
    })
    expect(option.series[0].barMaxWidth).toBe(10)
    expect(option.series[1].symbolSize).toBe(12)
  })
})

describe('combo warnings', () => {
  function warnSpy() {
    return vi.spyOn(console, 'warn').mockImplementation(() => {})
  }

  it('draws a non-bar mark as a bar on a horizontal chart, and says so', () => {
    const warn = warnSpy()
    const option = build({
      horizontal: true,
      series: [{ name: 'sales' }, { name: 'refunds', type: 'line' }],
    })
    expect(typesOf(option)).toEqual(['bar', 'bar'])
    // The value axis runs across the plot, so the pairs are [value, category].
    expect(option.series[1].data[0].value).toEqual([2, 'Jan'])
    expect(warn).toHaveBeenCalledOnce()
    expect(warn.mock.calls[0][0]).toContain('[frappe-ui]')
    expect(warn.mock.calls[0][0]).toContain('refunds')
    expect(warn.mock.calls[0][0]).toContain('horizontal')
  })

  it('falls back to the chart’s mark for a type it cannot draw', () => {
    const warn = warnSpy()
    const option = build({
      type: 'line',
      series: [{ name: 'sales', type: 'scatter' as ChartMark }],
    })
    expect(option.series[0].type).toBe('line')
    expect(warn).toHaveBeenCalledOnce()
    expect(warn.mock.calls[0][0]).toContain('scatter')
  })

  it('says nothing about a combination it can draw', () => {
    const warn = warnSpy()
    build({ stacked: true })
    build({ type: 'area', series: [{ name: 'sales', type: 'bar' }] })
    build({ horizontal: true, series: [{ name: 'sales', type: 'bar' }] })
    expect(warn).not.toHaveBeenCalled()
  })
})
