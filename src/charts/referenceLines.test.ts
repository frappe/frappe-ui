import { describe, expect, it } from 'vitest'
import { buildAxisChartOption } from './axisChartOptions'
import { DOTTED_LINE } from './axisChartCommon'
import { pruneHiddenSeries } from './hiddenSeries'
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

function config(overrides: Partial<AxisChartConfig> = {}): AxisChartConfig {
  return {
    type: 'bar',
    data: [
      { month: 'Jan', sales: 10, refunds: 2, rate: 30 },
      { month: 'Feb', sales: 20, refunds: 4, rate: 40 },
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

/** The series echarts is handed that actually carry reference lines. */
const hostsOf = (option: any) =>
  option.series.filter((series: any) => series.markLine)

/** Every reference line drawn, across whichever hosts carry them. */
const entriesOf = (option: any) =>
  hostsOf(option).flatMap((series: any) => series.markLine.data)

/**
 * An option minus its formatters. Every build makes fresh closures, so two
 * options that describe the same plot never compare equal until they are gone.
 */
const structure = (value: any) => JSON.parse(JSON.stringify(value))

describe('reference line placement', () => {
  it('draws a horizontal rule at a value on the value axis', () => {
    const option = build({ referenceLines: [{ value: 15 }] })
    expect(entriesOf(option)).toEqual([
      { yAxis: 15, lineStyle: { width: 1.5, color: 'ink-6' } },
    ])
  })

  it('draws a vertical rule at a category on the category axis', () => {
    const option = build({ referenceLines: [{ value: 'Feb', axis: 'x' }] })
    expect(entriesOf(option)[0].xAxis).toBe('Feb')
  })

  it('swaps the two keys on a horizontal chart', () => {
    // The value axis runs across the plot there and the categories run down it,
    // so a value line is pinned to X and a category line to Y.
    const option = build({
      horizontal: true,
      referenceLines: [{ value: 15 }, { value: 'Feb', axis: 'x' }],
    })
    const [value, category] = entriesOf(option)
    expect(value.xAxis).toBe(15)
    expect(value.yAxis).toBeUndefined()
    expect(category.yAxis).toBe('Feb')
    expect(category.xAxis).toBeUndefined()
    // The host reads against the value axis, which is X on this chart.
    expect(hostsOf(option)[0].xAxisIndex).toBe(0)
    expect(hostsOf(option)[0].yAxisIndex).toBeUndefined()
  })

  it('reads a numeric string as a value and drops what is not a number', () => {
    const option = build({
      referenceLines: [
        { value: '15' },
        { value: 'nonsense' },
        { value: '' },
        { value: null as any },
      ],
    })
    expect(entriesOf(option)).toHaveLength(1)
    expect(entriesOf(option)[0].yAxis).toBe(15)
  })

  it('takes a Date on the category axis as it stands', () => {
    const at = new Date('2026-03-01')
    const option = build({ referenceLines: [{ value: at, axis: 'x' }] })
    expect(entriesOf(option)[0].xAxis).toBe(at)
  })

  it('carries several lines on one host', () => {
    const option = build({
      referenceLines: [{ value: 5 }, { value: 15 }, { value: 25 }],
    })
    expect(hostsOf(option)).toHaveLength(1)
    expect(entriesOf(option).map((entry: any) => entry.yAxis)).toEqual([
      5, 15, 25,
    ])
  })

  it('adds nothing at all without reference lines', () => {
    expect(hostsOf(build())).toEqual([])
    expect(hostsOf(build({ referenceLines: [] }))).toEqual([])
    // A list of unusable values leaves no host behind either.
    expect(hostsOf(build({ referenceLines: [{ value: 'nonsense' }] }))).toEqual(
      [],
    )
  })
})

describe('reference lines and the value axes', () => {
  const dualAxis = {
    y2Axis: { title: 'rate' },
    series: [
      { name: 'sales' },
      { name: 'rate', type: 'line' as const, axis: 'y2' as const },
    ],
  }

  it('hosts each axis’ lines on a series of its own', () => {
    const option = build({
      ...dualAxis,
      referenceLines: [
        { value: 15 },
        { value: 35, axis: 'y2' },
        { value: 25, axis: 'y' },
      ],
    })
    const hosts = hostsOf(option)
    expect(hosts.map((host: any) => host.yAxisIndex)).toEqual([0, 1])
    expect(hosts[0].markLine.data.map((e: any) => e.yAxis)).toEqual([15, 25])
    expect(hosts[1].markLine.data.map((e: any) => e.yAxis)).toEqual([35])
  })

  it('leaves out the host of an axis no line targets', () => {
    const option = build({
      ...dualAxis,
      referenceLines: [{ value: 35, axis: 'y2' }],
    })
    expect(hostsOf(option)).toHaveLength(1)
    expect(hostsOf(option)[0].yAxisIndex).toBe(1)
  })

  it('reads a y2 line against the primary axis when there is no second one', () => {
    // Same fallback a `y2` series takes: one value axis is the value axis.
    const option = build({ referenceLines: [{ value: 35, axis: 'y2' }] })
    expect(hostsOf(option)).toHaveLength(1)
    expect(hostsOf(option)[0].yAxisIndex).toBe(0)
    expect(entriesOf(option)[0].yAxis).toBe(35)
  })

  it('keeps a y2 line off the second axis of a horizontal chart, which has none', () => {
    const option = build({
      horizontal: true,
      ...dualAxis,
      series: [{ name: 'sales' }, { name: 'rate', axis: 'y2' }],
      referenceLines: [{ value: 35, axis: 'y2' }],
    })
    expect(hostsOf(option)[0].xAxisIndex).toBe(0)
    expect(entriesOf(option)[0].xAxis).toBe(35)
  })

  it('leaves the value-axis scale to the data', () => {
    // A rule is an annotation: stretching the scale to fit a target ten times
    // the data would flatten every bar it is meant to be read against.
    const bare = build()
    const annotated = build({ referenceLines: [{ value: 100000 }] })
    expect(structure(annotated.yAxis)).toEqual(structure(bare.yAxis))
    expect(annotated.yAxis.min).toBeUndefined()
    expect(annotated.yAxis.max).toBeUndefined()
  })
})

describe('reference line looks', () => {
  it('prints a label at the far end of the line, in the line’s color', () => {
    const option = build({
      referenceLines: [{ value: 15, label: 'Target', color: '#ff0000' }],
    })
    const { label, lineStyle } = entriesOf(option)[0]
    expect(label.show).toBe(true)
    expect(label.position).toBe('insideEndTop')
    expect(label.color).toBe('#ff0000')
    expect(lineStyle.color).toBe('#ff0000')
    // A function, so braces in a label are not read as an echarts template.
    expect(label.formatter()).toBe('Target')
  })

  it('carries no label at all when none is set', () => {
    expect(
      entriesOf(build({ referenceLines: [{ value: 15 }] }))[0].label,
    ).toBeUndefined()
  })

  it('takes its default ink from the tokens, not from the palette', () => {
    const option = build({ referenceLines: [{ value: 15, label: 'Target' }] })
    const [entry] = entriesOf(option)
    expect(entry.lineStyle.color).toBe(tokens.dataLabel)
    expect(entry.label.color).toBe(tokens.dataLabel)
  })

  it('breaks a dashed line up with the same texture the gridlines use', () => {
    const option = build({
      referenceLines: [{ value: 15, dashed: true }, { value: 25 }],
    })
    const [dashed, solid] = entriesOf(option)
    expect(dashed.lineStyle.type).toEqual(DOTTED_LINE.type)
    expect(dashed.lineStyle.cap).toBe(DOTTED_LINE.cap)
    // Heavier than the gridline the texture is borrowed from.
    expect(dashed.lineStyle.width).toBe(1.5)
    expect(solid.lineStyle.type).toBeUndefined()
  })

  it('takes no pointer and no symbols', () => {
    const option = build({ referenceLines: [{ value: 15 }] })
    const [host] = hostsOf(option)
    expect(host.silent).toBe(true)
    expect(host.markLine.silent).toBe(true)
    expect(host.markLine.symbol).toBe('none')
  })
})

describe('reference lines against the rest of the plot', () => {
  /** What the legend and the tooltip walk. The option's `series` is not it. */
  const legendNames = (overrides: Partial<AxisChartConfig>) =>
    config(overrides).series.map((series) => series.name)

  it('keeps its host out of the legend and out of hiddenSeries', () => {
    const overrides = { referenceLines: [{ value: 15 }] }
    const option = build(overrides)
    const names = legendNames(overrides)

    expect(names).toEqual(['sales', 'refunds'])
    expect(option.series).toHaveLength(3)
    // The host is in the echarts option and nowhere the caller can reach it.
    expect(hostsOf(option)).toHaveLength(1)
    expect(names).not.toContain(hostsOf(option)[0].name)
    // And a hidden list built from the drawn series never picks it up.
    expect(pruneHiddenSeries([hostsOf(option)[0].name], names)).toEqual([])
  })

  it('draws its lines while every togglable series is hidden', () => {
    const option = build({ referenceLines: [{ value: 15 }] }, [
      'sales',
      'refunds',
    ])
    expect(option.series.filter((s: any) => !s.markLine)).toEqual([])
    expect(entriesOf(option)).toHaveLength(1)
  })

  it('is not counted as a bar', () => {
    // A bar host would take a slot in every category and narrow the real bars;
    // it would also inset a line chart's category axis.
    const bars = build({ referenceLines: [{ value: 15 }] })
    expect(hostsOf(bars)[0].type).toBe('line')
    expect(hostsOf(bars)[0].data).toEqual([])

    const lines = build({
      type: 'line',
      series: [{ name: 'sales' }],
      referenceLines: [{ value: 15 }],
    })
    expect(lines.xAxis.boundaryGap).toBe(false)
    expect(lines.tooltip.axisPointer.type).toBe('line')
  })

  it('leaves stacking and the stack’s rounded tip alone', () => {
    const option = build({
      stacked: true,
      referenceLines: [{ value: 15 }],
    })
    const plotted = option.series.filter((s: any) => !s.markLine)
    expect(plotted.map((s: any) => s.stack)).toEqual(['bar:stack', 'bar:stack'])
    // The host has no stack to join, so it cannot land on top of the column.
    expect(hostsOf(option)[0].stack).toBeUndefined()
    expect(plotted[1].data[0].itemStyle.borderRadius).toEqual([4, 4, 0, 0])
  })

  it('sits after the combo marks and disturbs none of them', () => {
    const overrides: Partial<AxisChartConfig> = {
      series: [
        { name: 'sales' },
        { name: 'refunds', type: 'line' },
        { name: 'rate', type: 'area' },
      ],
    }
    const bare = build(overrides)
    const annotated = build({ ...overrides, referenceLines: [{ value: 15 }] })

    expect(structure(annotated.series.slice(0, 3))).toEqual(
      structure(bare.series),
    )
    expect(annotated.series[3]).toBe(hostsOf(annotated)[0])
  })
})
