import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  buildAxisChartOption,
  buildStackShares,
  DEFAULT_STACKED_FILL_OPACITY,
} from './axisChartOptions'
import { normalizeAxisChartProps } from './seriesData'
import type {
  AxisChartConfig,
  AxisChartProps,
} from './types'
import type { ChartTokens } from './tokens'

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

/** Two series whose totals are round numbers, so the shares read at a glance. */
function config(overrides: Partial<AxisChartConfig> = {}): AxisChartConfig {
  return {
    type: 'bar',
    stacked: 'normalized',
    data: [
      { month: 'Jan', sales: 30, refunds: 10 },
      { month: 'Feb', sales: 60, refunds: 40 },
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

/** The plotted number of each point, whichever way the pairs are ordered. */
const plottedOf = (series: any, horizontal = false) =>
  series.data.map((item: any) => {
    const pair = item.value ?? item
    return horizontal ? pair[0] : pair[1]
  })

const seriesNamed = (option: any, name: string) =>
  option.series.find((s: any) => s.name === name)

afterEach(() => {
  vi.restoreAllMocks()
})

describe('normalized stacking: plotted values', () => {
  it('plots each value as its share of the stack at that x', () => {
    const option = build()
    expect(plottedOf(option.series[0])).toEqual([75, 60])
    expect(plottedOf(option.series[1])).toEqual([25, 40])
  })

  it('leaves the rows alone, so every other reader sees the real numbers', () => {
    const rows = [
      { month: 'Jan', sales: 30, refunds: 10 },
      { month: 'Feb', sales: 60, refunds: 40 },
    ]
    build({ data: rows })
    expect(rows[0]).toEqual({ month: 'Jan', sales: 30, refunds: 10 })
  })

  it('still stacks the series, so the shares pile into one column', () => {
    const option = build()
    expect(option.series.map((s: any) => s.stack)).toEqual([
      'bar:stack',
      'bar:stack',
    ])
  })

  it('plots the raw numbers for plain `stacked`', () => {
    const option = build({ stacked: true })
    expect(plottedOf(option.series[0])).toEqual([30, 60])
  })

  it('leaves a missing value missing rather than reading it as no share', () => {
    const option = build({
      data: [
        { month: 'Jan', sales: 30, refunds: null },
        { month: 'Feb', sales: 60, refunds: 40 },
      ],
    })
    expect(plottedOf(option.series[0])).toEqual([100, 60])
    expect(plottedOf(option.series[1])).toEqual([null, 40])
  })

  it('draws nothing at an x where the whole stack is zero', () => {
    const option = build({
      data: [
        { month: 'Jan', sales: 0, refunds: 0 },
        { month: 'Feb', sales: 60, refunds: 40 },
      ],
    })
    expect(plottedOf(option.series[0])).toEqual([null, 60])
  })

  // Magnitudes as the denominator: the column still spans exactly 100 from its
  // lowest segment to its highest, and a total near zero cannot blow it up.
  it('measures the share against the magnitude of the stack, not its net', () => {
    const option = build({
      data: [{ month: 'Jan', sales: 80, refunds: -20 }],
    })
    expect(plottedOf(option.series[0])).toEqual([80])
    expect(plottedOf(option.series[1])).toEqual([-20])
  })

  it('re-percentages what is left when a series is hidden', () => {
    const option = build(
      {
        data: [{ month: 'Jan', sales: 30, refunds: 10, fees: 10 }],
        series: [{ name: 'sales' }, { name: 'refunds' }, { name: 'fees' }],
      },
      ['fees'],
    )
    expect(plottedOf(option.series[0])).toEqual([75])
    expect(plottedOf(option.series[1])).toEqual([25])
  })

  it('normalizes an area chart’s bands the same way', () => {
    const option = build({ type: 'area' })
    expect(option.series[0].type).toBe('line')
    expect(plottedOf(option.series[0])).toEqual([75, 60])
    // Still a band stacked onto another, so still a solid fill.
    expect(option.series[0].areaStyle.opacity).toBe(
      DEFAULT_STACKED_FILL_OPACITY,
    )
  })

  it('normalizes horizontal bars, whose pairs run the other way', () => {
    const option = build({ horizontal: true })
    expect(plottedOf(option.series[0], true)).toEqual([75, 60])
    expect(option.xAxis.min).toBe(0)
    expect(option.xAxis.max).toBe(100)
  })
})

describe('normalized stacking: stack groups', () => {
  const twoStacks: Partial<AxisChartConfig> = {
    data: [{ month: 'Jan', a: 30, b: 10, c: 1, d: 1 }],
    series: [
      { name: 'a', stackName: 'left' },
      { name: 'b', stackName: 'left' },
      { name: 'c', stackName: 'right' },
      { name: 'd', stackName: 'right' },
    ],
  }

  // Sharing one denominator would leave neither column reaching the top, which
  // is the one thing a 100% stack is read for.
  it('takes each named stack to 100 on its own', () => {
    const option = build(twoStacks)
    expect(plottedOf(seriesNamed(option, 'a'))).toEqual([75])
    expect(plottedOf(seriesNamed(option, 'b'))).toEqual([25])
    expect(plottedOf(seriesNamed(option, 'c'))).toEqual([50])
    expect(plottedOf(seriesNamed(option, 'd'))).toEqual([50])
  })

  // Bars and areas are separate stacks whatever `stackName` says, so a combo
  // chart's two marks each read as their own whole.
  it('takes the bars and the areas to 100 separately', () => {
    const option = build({
      data: [{ month: 'Jan', a: 30, b: 10, c: 1, d: 3 }],
      series: [
        { name: 'a' },
        { name: 'b' },
        { name: 'c', type: 'area' },
        { name: 'd', type: 'area' },
      ],
    })
    expect(plottedOf(seriesNamed(option, 'a'))).toEqual([75])
    expect(plottedOf(seriesNamed(option, 'c'))).toEqual([25])
    expect(plottedOf(seriesNamed(option, 'd'))).toEqual([75])
  })
})

describe('normalized stacking: series with no stack', () => {
  const withLine: Partial<AxisChartConfig> = {
    data: [
      { month: 'Jan', sales: 30, refunds: 10, rate: 4 },
      { month: 'Feb', sales: 60, refunds: 40, rate: 8 },
    ],
    series: [{ name: 'sales' }, { name: 'refunds' }, { name: 'rate' }],
  }

  it('leaves a line on its own numbers, a line never stacking', () => {
    const option = build({
      ...withLine,
      series: [
        { name: 'sales' },
        { name: 'refunds' },
        { name: 'rate', type: 'line' },
      ],
    })
    expect(plottedOf(seriesNamed(option, 'rate'))).toEqual([4, 8])
  })

  it('warns that a line is drawn against the pinned axis in its own units', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    build({
      ...withLine,
      series: [
        { name: 'sales' },
        { name: 'refunds' },
        { name: 'rate', type: 'line' },
      ],
    })
    expect(warn).toHaveBeenCalledOnce()
    expect(warn.mock.calls[0][0]).toContain('[frappe-ui]')
    expect(warn.mock.calls[0][0]).toContain('"rate"')
  })

  it('says nothing about a line that has its own scale to sit on', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const option = build({
      ...withLine,
      series: [
        { name: 'sales' },
        { name: 'refunds' },
        { name: 'rate', type: 'line', axis: 'y2' },
      ],
    })
    expect(warn).not.toHaveBeenCalled()
    expect(plottedOf(seriesNamed(option, 'rate'))).toEqual([4, 8])
    // Only the axis carrying the shares is pinned.
    expect(option.yAxis[0].max).toBe(100)
    expect(option.yAxis[1].max).toBeUndefined()
  })

  // A series alone in its stack is its own whole: 100% at every x says nothing.
  it('leaves a lone band among the bars on its own numbers, and warns', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const option = build({
      ...withLine,
      series: [
        { name: 'sales' },
        { name: 'refunds' },
        { name: 'rate', type: 'area' },
      ],
    })
    expect(plottedOf(seriesNamed(option, 'rate'))).toEqual([4, 8])
    expect(warn).toHaveBeenCalledOnce()
  })

  it('normalizes nothing, and pins nothing, on a single-series chart', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const option = build({ series: [{ name: 'sales' }] })
    expect(plottedOf(option.series[0])).toEqual([30, 60])
    expect(option.yAxis.min).toBeUndefined()
    expect(warn).not.toHaveBeenCalled()
  })

  it('drops back to raw numbers once the legend leaves one series stacked', () => {
    const option = build({}, ['refunds'])
    expect(plottedOf(option.series[0])).toEqual([30, 60])
    expect(option.yAxis.min).toBeUndefined()
  })
})

describe('normalized stacking: the value axis', () => {
  it('pins the value axis to 0-100', () => {
    const option = build()
    expect(option.yAxis.min).toBe(0)
    expect(option.yAxis.max).toBe(100)
  })

  it('leaves the axis to the data when `stacked` is plain', () => {
    const option = build({ stacked: true })
    expect(option.yAxis.min).toBeUndefined()
  })

  it('keeps the axis title and echartOptions the caller set', () => {
    const option = build({
      yAxis: { title: 'Share', echartOptions: { splitLine: { show: false } } },
    })
    expect(option.yAxis.max).toBe(100)
    expect(option.yAxis.splitLine.show).toBe(false)
  })

  it('prints the ticks as percentages', () => {
    expect(build().yAxis.axisLabel.formatter(75)).toBe('75%')
    expect(build({ stacked: true }).yAxis.axisLabel.formatter(75)).toBe('75')
  })

  // A `format` written for the measure would put a currency symbol on a share.
  // It still prints the measure in the tooltip, which is why nothing is warned.
  it('keeps a caller’s value format off the ticks of a pinned axis', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const option = build({
      yAxis: { echartOptions: { axisLabel: { formatter: () => '$$' } } },
    })
    expect(option.yAxis.axisLabel.formatter(75)).toBe('75%')
    expect(warn).not.toHaveBeenCalled()
  })

  // A column that stops short of the top stops reading as a whole, so the
  // pinned range wins — but the caller stated something and has to hear that.
  it('overrides a min or max the caller set, and warns', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const option = build({ yAxis: { min: 0, max: 50 } })
    expect(option.yAxis.max).toBe(100)
    expect(warn).toHaveBeenCalledOnce()
    expect(warn.mock.calls[0][0]).toContain('[frappe-ui]')
    expect(warn.mock.calls[0][0]).toContain('yAxis')
  })

  it('says nothing when the caller pinned the same range', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    build({ yAxis: { min: 0, max: 100 } })
    expect(warn).not.toHaveBeenCalled()
  })

  it('names the second axis when that is the one being overridden', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const option = build({
      data: [{ month: 'Jan', sales: 30, refunds: 10, a: 1, b: 3 }],
      series: [
        { name: 'sales' },
        { name: 'refunds' },
        { name: 'a', axis: 'y2' },
        { name: 'b', axis: 'y2' },
      ],
      y2Axis: { max: 20 },
    })
    expect(option.yAxis[1].max).toBe(100)
    expect(warn).toHaveBeenCalledOnce()
    expect(warn.mock.calls[0][0]).toContain('y2Axis')
  })

  it('normalizes each axis against the stack that sits on it', () => {
    const option = build({
      data: [{ month: 'Jan', sales: 30, refunds: 10, a: 1, b: 3 }],
      series: [
        { name: 'sales' },
        { name: 'refunds' },
        { name: 'a', axis: 'y2' },
        { name: 'b', axis: 'y2' },
      ],
    })
    // One stack key, so both axes share a denominator only if the config says
    // so; here `stackName` is unset, so all four bars are one stack.
    expect(plottedOf(seriesNamed(option, 'sales'))).toEqual([(30 / 44) * 100])
    expect(option.yAxis[0].max).toBe(100)
    expect(option.yAxis[1].max).toBe(100)
  })
})

describe('normalized stacking: data labels', () => {
  it('prints a share as a percentage, not as a count', () => {
    const option = build({
      series: [
        { name: 'sales', showDataLabels: true },
        { name: 'refunds', showDataLabels: true },
      ],
    })
    expect(option.series[0].label.formatter({ value: ['Jan', 75] })).toBe('75%')
    expect(option.series[0].label.formatter({ value: ['Jan', 0.4] })).toBe(
      '<1%',
    )
    expect(option.series[0].label.formatter({ value: ['Jan', null] })).toBe('')
  })

  it('reads the share off the value axis when horizontal', () => {
    const option = build({
      horizontal: true,
      series: [{ name: 'sales', showDataLabels: true }, { name: 'refunds' }],
    })
    expect(option.series[0].label.formatter({ value: [75, 'Jan'] })).toBe('75%')
  })

  it('keeps printing the measure for a series that carries no share', () => {
    const option = build({
      data: [{ month: 'Jan', sales: 30, refunds: 10, rate: 2500 }],
      series: [
        { name: 'sales' },
        { name: 'refunds' },
        { name: 'rate', type: 'line', axis: 'y2', showDataLabels: true },
      ],
    })
    expect(
      seriesNamed(option, 'rate').label.formatter({ value: ['Jan', 2500] }),
    ).toBe('2.5K')
  })
})

describe('buildStackShares', () => {
  it('is empty for a chart that is not normalized', () => {
    expect(buildStackShares(config({ stacked: true })).size).toBe(0)
    expect(buildStackShares(config({ stacked: undefined })).size).toBe(0)
  })

  it('hands back each series’ share, row by row', () => {
    const shares = buildStackShares(config())
    expect(shares.get('sales')).toEqual([75, 60])
    expect(shares.get('refunds')).toEqual([25, 40])
  })

  it('holds no entry for a series with no stack to take a share of', () => {
    const shares = buildStackShares(
      config({
        data: [{ month: 'Jan', sales: 30, refunds: 10, rate: 4 }],
        series: [
          { name: 'sales' },
          { name: 'refunds' },
          { name: 'rate', type: 'line' },
        ],
      }),
    )
    expect(shares.has('rate')).toBe(false)
  })

  it('re-percentages against the visible series', () => {
    const shares = buildStackShares(
      config({
        data: [{ month: 'Jan', sales: 30, refunds: 10, fees: 10 }],
        series: [{ name: 'sales' }, { name: 'refunds' }, { name: 'fees' }],
      }),
      ['fees'],
    )
    expect(shares.get('sales')).toEqual([75])
  })

  // The option build is the one that reports a mark the library cannot draw.
  it('reads the same marks without repeating the option build’s warnings', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    buildStackShares(
      config({ horizontal: true, series: [{ name: 'sales', type: 'line' }] }),
    )
    expect(warn).not.toHaveBeenCalled()
  })
})

describe('normalized stacking with maxSeries', () => {
  /** What a component hands the builder: normalized props, marked `'bar'`. */
  function fromProps(props: Partial<AxisChartProps>): AxisChartConfig {
    return {
      ...normalizeAxisChartProps({
        data: [],
        x: 'month',
        y: 'amount',
        ...props,
      } as AxisChartProps).config,
      type: 'bar',
      stacked: 'normalized',
    }
  }

  const longRows = [
    { month: 'Jan', region: 'East', amount: 50 },
    { month: 'Jan', region: 'West', amount: 30 },
    { month: 'Jan', region: 'North', amount: 15 },
    { month: 'Jan', region: 'South', amount: 5 },
  ]

  // The collapse runs in the data layer and the share in the option layer, so
  // the tail is one series by the time anything is divided.
  it('takes the shares after the tail has collapsed, so they sum to 100', () => {
    const option = buildAxisChartOption(
      fromProps({ data: longRows, series: 'region', maxSeries: 3 }),
      { tokens },
    ) as any
    expect(option.series.map((s: any) => s.name)).toEqual([
      'East',
      'West',
      '__others__',
    ])
    const plotted = option.series.map((s: any) => plottedOf(s)[0])
    expect(plotted).toEqual([50, 30, 20])
    expect(plotted.reduce((a: number, b: number) => a + b, 0)).toBe(100)
  })

  it('pins the axis and labels the collapsed series “Others”', () => {
    const config = fromProps({
      data: longRows,
      series: 'region',
      maxSeries: 3,
    })
    const option = buildAxisChartOption(config, { tokens }) as any
    expect(option.yAxis.max).toBe(100)
    expect(config.series.at(-1)).toEqual({
      name: '__others__',
      label: 'Others',
    })
  })
})
