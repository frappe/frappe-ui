import { afterEach, describe, expect, it, vi } from 'vitest'
import { buildAxisChartOption } from './axisChartOptions'
import { plotRows, resolveXAxis } from './axisChartCommon'
import { normalizeAxisChartProps } from './seriesData'
import type { ChartTokens } from './tokens'
import type { AxisChartConfig, AxisChartProps } from './types'

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
 * A measure read against a quantity: revenue against the discount that won it.
 * The gaps are uneven on purpose — evenly spaced rows would plot the same
 * whichever way the axis reads them, which is the confusion these tests exist
 * to rule out.
 */
function config(overrides: Partial<AxisChartConfig> = {}): AxisChartConfig {
  return {
    type: 'line',
    data: [
      { discount: 1, revenue: 10 },
      { discount: 2, revenue: 20 },
      { discount: 100, revenue: 30 },
    ],
    xAxis: { key: 'discount', type: 'value' },
    series: [{ name: 'revenue' }],
    ...overrides,
  }
}

function build(overrides: Partial<AxisChartConfig> = {}) {
  return buildAxisChartOption(config(overrides), { tokens }) as any
}

/** The [x, y] pairs behind a series' data items, whichever way they are wrapped. */
const pairsOf = (series: any) =>
  series.data.map((item: any) => item.value ?? item)

/** Every warning here is dev-only, so a test expecting one silences it first. */
function captureWarnings(run: () => void) {
  const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
  run()
  const calls = warn.mock.calls.map((call) => String(call[0]))
  warn.mockRestore()
  return calls
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe('resolveXAxis: the numeric axis is asked for', () => {
  it('reads a column of numbers as categories until told otherwise', () => {
    expect(resolveXAxis(config({ xAxis: { key: 'discount' } }))).toEqual({
      type: 'category',
    })
  })

  it('takes the scale when the config names it', () => {
    expect(resolveXAxis(config())).toEqual({ type: 'value' })
  })

  it('carries the type through from the prop', () => {
    const props = {
      data: config().data,
      x: 'discount',
      y: 'revenue',
      xAxis: { type: 'value' },
    } as AxisChartProps
    expect(normalizeAxisChartProps(props).config.xAxis.type).toBe('value')
  })
})

describe('numeric x axis: the axis itself', () => {
  it('builds a value scale rather than a list of the values plotted', () => {
    const option = build()
    expect(option.xAxis.type).toBe('value')
    expect(option.xAxis.data).toBeUndefined()
    // An x coordinate is a position, not a magnitude read from zero.
    expect(option.xAxis.scale).toBe(true)
  })

  it('prints its ticks as numbers, compact like the value axis opposite', () => {
    const option = build()
    expect(option.xAxis.axisLabel.formatter(1500)).toBe('1.5K')
  })

  it('leaves the ticks flat: they are echarts’ to pick, not one per row', () => {
    // 20 rows in a narrow plot, which is what tilts a category axis. A value
    // axis draws as many ticks as it has room for instead, so there is nothing
    // to fit and no angle to take.
    const data = Array.from({ length: 20 }, (_, i) => ({
      discount: i * 1000,
      revenue: i,
    }))
    const option = buildAxisChartOption(config({ data }), {
      tokens,
      width: 200,
    }) as any
    expect(option.xAxis.axisLabel.rotate).toBeUndefined()
    expect(option.xAxis.axisLabel.width).toBeUndefined()
  })
})

describe('numeric x axis: where the points land', () => {
  it('gives every point its own coordinate instead of a slot', () => {
    expect(pairsOf(build().series[0])).toEqual([
      [1, 10],
      [2, 20],
      [100, 30],
    ])
  })

  it('reads the rows in numeric order whatever order they arrive in', () => {
    const option = build({
      data: [
        { discount: 100, revenue: 30 },
        { discount: 1, revenue: 10 },
        { discount: 2, revenue: 20 },
      ],
    })
    expect(pairsOf(option.series[0])).toEqual([
      [1, 10],
      [2, 20],
      [100, 30],
    ])
  })

  it('coerces a numeric string, so a column read off a query still plots', () => {
    const option = build({ data: [{ discount: '20', revenue: 5 }] })
    expect(pairsOf(option.series[0])).toEqual([[20, 5]])
  })

  it('drops a row with no number for x, and says how many', () => {
    let option: any
    const warnings = captureWarnings(() => {
      option = build({
        data: [
          { discount: 2, revenue: 20 },
          { discount: null, revenue: 40 },
        ],
      })
    })
    expect(pairsOf(option.series[0])).toEqual([[2, 20]])
    expect(warnings[0]).toContain('Dropped 1 row')
  })

  it('bars take the same pairs, so a bar chart reads the scale too', () => {
    const option = build({ type: 'bar' })
    expect(option.series[0].type).toBe('bar')
    expect(pairsOf(option.series[0])).toEqual([
      [1, 10],
      [2, 20],
      [100, 30],
    ])
  })

  it('leaves a category axis indexing its rows in the order they arrive', () => {
    const option = build({
      xAxis: { key: 'discount', type: 'category' },
      data: [
        { discount: 100, revenue: 30 },
        { discount: 1, revenue: 10 },
      ],
    })
    expect(option.xAxis.data).toEqual([100, 1])
    expect(pairsOf(option.series[0])).toEqual([
      [100, 30],
      [1, 10],
    ])
  })
})

describe('numeric x axis: reference lines', () => {
  const markLines = (option: any) =>
    option.series.at(-1).markLine.data as Record<string, any>[]

  it('pins a line to a number on the scale, the way a scatter does', () => {
    const option = build({
      referenceLines: [{ value: 50, axis: 'x', label: 'Cap' }],
    })
    expect(markLines(option)[0].xAxis).toBe(50)
  })

  it('reads a numeric string as that same number', () => {
    const option = build({
      referenceLines: [{ value: '50', axis: 'x' }],
    })
    expect(markLines(option)[0].xAxis).toBe(50)
  })

  it('still measures a y line against the value axis', () => {
    const option = build({
      referenceLines: [
        { value: 25, label: 'Target' },
        { value: 50, axis: 'x' },
      ],
    })
    const [target, cap] = markLines(option)
    expect(target.yAxis).toBe(25)
    expect(cap.xAxis).toBe(50)
  })
})

describe('numeric x axis: horizontal bars', () => {
  it('is ignored, because a bar is sized from the slot it stands in', () => {
    let option: any
    const warnings = captureWarnings(() => {
      option = build({ type: 'bar', horizontal: true })
    })
    // The x column runs down the side, as a list of categories.
    expect(option.yAxis.type).toBe('category')
    expect(option.yAxis.data).toEqual([1, 2, 100])
    expect(option.xAxis.type).toBe('value')
    expect(warnings[0]).toContain('xAxis.type: "value"')
  })

  it('resolves the same way for every other reader of the config', () => {
    expect(resolveXAxis(config({ horizontal: true }), true)).toEqual({
      type: 'category',
    })
  })
})

describe('plotRows', () => {
  it('hands every other axis the rows exactly as they came', () => {
    const built = config({ xAxis: { key: 'discount', type: 'category' } })
    expect(plotRows(built, 'category')).toBe(built.data)
  })

  it('keeps the caller’s rows intact while it sorts', () => {
    const built = config()
    const ordered = plotRows(built, 'value')
    expect(built.data.map((row) => row.discount)).toEqual([1, 2, 100])
    expect(ordered[0]).toBe(built.data[0])
  })
})
