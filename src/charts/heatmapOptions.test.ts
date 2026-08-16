import { describe, expect, it, vi } from 'vitest'
import {
  buildHeatmapMatrix,
  buildHeatmapOption,
  heatmapRampStops,
  hoverCellColor,
  sampleRamp,
  HEATMAP_RAMP_SAMPLES,
  type HeatmapOptionContext,
} from './heatmapOptions'
import { hexToOklch } from './colorMath'
import type { ChartTokens } from './tokens'
import type { HeatmapChartConfig } from './types'

const tokens: ChartTokens = {
  categorical: ['#111111', '#222222', '#333333'],
  // Nine stops, dark to light, like the shipped ramp.
  sequential: [
    '#0a0a0a',
    '#1a1a1a',
    '#3a3a3a',
    '#5a5a5a',
    '#8a8a8a',
    '#aaaaaa',
    '#cccccc',
    '#e0e0e0',
    '#f5f5f5',
  ],
  diverging: ['#0000ff', '#8888ff', '#ffffff', '#ff8888', '#ff0000'],
  axisLabel: 'ink-5',
  axisTitle: 'ink-7',
  axisLine: 'outline-2',
  splitLine: 'outline-1',
  dataLabel: 'ink-6',
  insideLabel: 'ink-8',
  cellGap: '#ffffff',
}

function config(
  overrides: Partial<HeatmapChartConfig> = {},
): HeatmapChartConfig {
  return {
    data: [
      { day: 'Mon', hour: '8am', orders: 10 },
      { day: 'Mon', hour: '9am', orders: 30 },
      { day: 'Tue', hour: '8am', orders: 20 },
      { day: 'Tue', hour: '9am', orders: 40 },
    ],
    xColumn: 'hour',
    yColumn: 'day',
    valueColumn: 'orders',
    ...overrides,
  }
}

function matrix(overrides: Partial<HeatmapChartConfig> = {}) {
  return buildHeatmapMatrix(config(overrides), { tokens })
}

function build(
  overrides: Partial<HeatmapChartConfig> = {},
  context: Partial<HeatmapOptionContext> = {},
) {
  return buildHeatmapOption(config(overrides), { tokens, ...context }) as any
}

describe('buildHeatmapMatrix', () => {
  it('takes categories in first-appearance order, not sorted', () => {
    const built = matrix({
      data: [
        { day: 'Wed', hour: '9am', orders: 1 },
        { day: 'Mon', hour: '8am', orders: 2 },
        { day: 'Wed', hour: '8am', orders: 3 },
      ],
    })

    expect(built.xCategories).toEqual(['9am', '8am'])
    expect(built.yCategories).toEqual(['Wed', 'Mon'])
  })

  it('registers the categories of a row whose value is missing', () => {
    const built = matrix({
      data: [
        { day: 'Mon', hour: '8am', orders: 5 },
        { day: 'Mon', hour: '9am', orders: null },
        { day: 'Tue', hour: '10am', orders: 7 },
      ],
    })

    expect(built.xCategories).toEqual(['8am', '9am', '10am'])
    // The empty hour keeps its column, but draws no cell.
    expect(built.cells).toHaveLength(2)
  })

  it('maps every cell onto its category indexes', () => {
    const built = matrix()

    expect(
      built.cells.map((cell) => [
        cell.x,
        cell.y,
        cell.xIndex,
        cell.yIndex,
        cell.value,
      ]),
    ).toEqual([
      ['8am', 'Mon', 0, 0, 10],
      ['9am', 'Mon', 1, 0, 30],
      ['8am', 'Tue', 0, 1, 20],
      ['9am', 'Tue', 1, 1, 40],
    ])
  })

  it('leaves one cell when two rows land on the same coordinate', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const built = matrix({
      data: [
        { day: 'Mon', hour: '8am', orders: 10 },
        { day: 'Mon', hour: '8am', orders: 99 },
      ],
    })

    expect(built.cells).toHaveLength(1)
    expect(built.cells[0].value).toBe(99)
    // The collision is a data mistake, so the warning has to name the cell.
    expect(warn).toHaveBeenCalledOnce()
    expect(warn.mock.calls[0][0]).toContain('8am')
    expect(warn.mock.calls[0][0]).toContain('Mon')
    warn.mockRestore()
  })

  it('says nothing when every row has its own cell', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    matrix()
    expect(warn).not.toHaveBeenCalled()
    warn.mockRestore()
  })

  it('reads a blank category as (Blank)', () => {
    const built = matrix({
      data: [{ day: null, hour: '', orders: 3 }],
    })

    expect(built.xCategories).toEqual(['(Blank)'])
    expect(built.yCategories).toEqual(['(Blank)'])
  })

  it('defaults the scale to the range of the data', () => {
    expect(matrix()).toMatchObject({ min: 10, max: 40 })
  })

  it('lets the config pin either end of the scale', () => {
    expect(matrix({ min: 0 })).toMatchObject({ min: 0, max: 40 })
    expect(matrix({ max: 100 })).toMatchObject({ min: 10, max: 100 })
  })

  it('defaults a diverging scale symmetric around zero', () => {
    const built = matrix({
      palette: 'diverging',
      data: [
        { day: 'Mon', hour: '8am', orders: -4 },
        { day: 'Mon', hour: '9am', orders: 12 },
      ],
    })

    expect(built).toMatchObject({ min: -12, max: 12 })
  })

  it('lets the config break the symmetry of a diverging scale', () => {
    const built = matrix({
      palette: 'diverging',
      min: -20,
      data: [{ day: 'Mon', hour: '8am', orders: 5 }],
    })

    expect(built).toMatchObject({ min: -20, max: 5 })
  })

  it('colors cells along the ramp, deepest at the top of the scale', () => {
    const built = matrix()
    const stops = heatmapRampStops(config(), tokens)

    expect(built.cells[0].color.toLowerCase()).toBe(stops[0].toLowerCase())
    expect(built.cells[3].color.toLowerCase()).toBe(
      stops[stops.length - 1].toLowerCase(),
    )
  })

  it('puts a flat grid at the top of the ramp, not the bottom', () => {
    const built = matrix({
      data: [
        { day: 'Mon', hour: '8am', orders: 7 },
        { day: 'Tue', hour: '8am', orders: 7 },
      ],
    })
    const stops = heatmapRampStops(config(), tokens)

    expect(built.cells.map((cell) => cell.color.toLowerCase())).toEqual([
      stops[stops.length - 1].toLowerCase(),
      stops[stops.length - 1].toLowerCase(),
    ])
  })
})

describe('heatmapRampStops', () => {
  it('reverses the sequential ramp and trims its palest stops', () => {
    const stops = heatmapRampStops(config(), tokens)

    expect(stops).toEqual([
      '#cccccc',
      '#aaaaaa',
      '#8a8a8a',
      '#5a5a5a',
      '#3a3a3a',
      '#1a1a1a',
      '#0a0a0a',
    ])
  })

  it('takes the diverging ramp as authored, cool end first', () => {
    expect(heatmapRampStops(config({ palette: 'diverging' }), tokens)).toEqual(
      tokens.diverging,
    )
  })

  it('takes an explicit list in the order it was written', () => {
    const colors = ['#ffffff', '#000000']
    expect(heatmapRampStops(config({ palette: colors }), tokens)).toEqual(colors)
  })
})

describe('sampleRamp', () => {
  it('samples the ramp finely enough to hide echarts own interpolation', () => {
    const sampled = sampleRamp(['#000000', '#ffffff'])

    expect(HEATMAP_RAMP_SAMPLES).toBe(32)
    expect(sampled).toHaveLength(32)
    expect(sampled[0].toLowerCase()).toBe('#000000')
    expect(sampled[31].toLowerCase()).toBe('#ffffff')
  })

  it('honours an explicit sample count', () => {
    expect(sampleRamp(['#000000', '#ffffff'], 5)).toHaveLength(5)
  })

  it('falls back to the ramp itself when a stop is not a hex color', () => {
    const stops = ['rgb(0 0 0)', 'rgb(255 255 255)']
    expect(sampleRamp(stops)).toEqual(stops)
  })

  it('leaves a one-stop ramp alone', () => {
    expect(sampleRamp(['#123456'])).toEqual(['#123456'])
  })
})

describe('buildHeatmapOption', () => {
  it('draws no gridlines and no axis lines', () => {
    const option = build()

    for (const axis of [option.xAxis, option.yAxis]) {
      expect(axis.splitLine.show).toBe(false)
      expect(axis.splitArea.show).toBe(false)
      expect(axis.axisLine.show).toBe(false)
      expect(axis.axisTick.show).toBe(false)
    }
  })

  it('runs the y categories from the top down', () => {
    const option = build()

    expect(option.yAxis.data).toEqual(['Mon', 'Tue'])
    expect(option.yAxis.inverse).toBe(true)
    expect(option.xAxis.inverse).toBe(false)
  })

  it('inverts the x axis in RTL and moves the y labels opposite', () => {
    const option = build({ dir: 'rtl' })

    expect(option.xAxis.inverse).toBe(true)
    expect(option.yAxis.position).toBe('right')
  })

  it('hides the visual map and feeds it the sampled ramp', () => {
    const option = build()

    expect(option.visualMap).toMatchObject({
      type: 'continuous',
      show: false,
      calculable: false,
      min: 10,
      max: 40,
      seriesIndex: 0,
    })
    expect(option.visualMap.inRange.color).toHaveLength(HEATMAP_RAMP_SAMPLES)
    expect(option.visualMap.inRange.color).toEqual(
      sampleRamp(heatmapRampStops(config(), tokens)),
    )
  })

  it('gives a flat grid a span for echarts to interpolate across', () => {
    const option = build({
      data: [{ day: 'Mon', hour: '8am', orders: 7 }],
    })

    // Every cell sits at the top of the ramp, which is where the matrix puts it.
    expect(option.visualMap).toMatchObject({ min: 6, max: 7 })
  })

  it('separates cells with a border in the surface behind the plot', () => {
    const { itemStyle } = build().series[0]

    expect(itemStyle).toMatchObject({
      borderRadius: 2,
      borderWidth: 2,
      borderColor: tokens.cellGap,
    })
  })

  it('emphasises the hovered cell without touching its neighbours', () => {
    expect(build().series[0].emphasis).toMatchObject({ focus: 'none' })
  })

  it('hovers with no ring and no shadow, only a lighter fill', () => {
    const series = build().series[0]

    // The resting border, restated: a hovered cell keeps the gap around it.
    expect(series.emphasis.itemStyle).toEqual({
      borderColor: tokens.cellGap,
      borderWidth: 2,
      shadowBlur: 0,
      shadowColor: 'transparent',
    })

    for (const item of series.data) {
      const cellColor = item.emphasis.itemStyle.color
      expect(cellColor).toMatch(/^#[0-9a-f]{6}$/i)
      expect(item.emphasis.itemStyle).not.toHaveProperty('borderColor')
      expect(item.emphasis.itemStyle).not.toHaveProperty('borderWidth')
    }
  })

  it('lightens each cell own fill on hover', () => {
    const cells = matrix().cells
    const series = build().series[0]

    series.data.forEach((item: any, index: number) => {
      const resting = cells[index].color
      const hovered = item.emphasis.itemStyle.color
      expect(hovered).toBe(hoverCellColor(resting))
      expect(hexToOklch(hovered).l).toBeGreaterThan(hexToOklch(resting).l)
    })
  })
})

describe('hoverCellColor', () => {
  it('lifts a dark-theme cell rather than sinking it into the background', () => {
    expect(hexToOklch(hoverCellColor('#074677')).l).toBeGreaterThan(
      hexToOklch('#074677').l,
    )
  })

  it('holds a near-white cell short of white', () => {
    const lightness = hexToOklch(hoverCellColor('#fbf1c7')).l
    expect(lightness).toBeLessThan(1)
    expect(lightness).toBeGreaterThanOrEqual(hexToOklch('#fbf1c7').l)
  })

  it('leaves a color it cannot parse alone', () => {
    expect(hoverCellColor('rgb(0 0 0)')).toBe('rgb(0 0 0)')
  })

  it('plots each cell at its coordinate with no label by default', () => {
    const series = build().series[0]

    expect(series.label.show).toBe(false)
    expect(series.data.map((item: any) => item.value)).toEqual([
      [0, 0, 10],
      [1, 0, 30],
      [0, 1, 20],
      [1, 1, 40],
    ])
    expect(series.data[0].label).toBeUndefined()
  })

  it('prints values in ink picked against each cell own fill', () => {
    const series = build({ showValues: true }).series[0]

    expect(series.label.show).toBe(true)
    expect(series.labelLayout).toEqual({ hideOverlap: true })
    // The palest cell keeps the theme ink; the deepest flips to white.
    expect(series.data[0].label.color).toBe(tokens.insideLabel)
    expect(series.data[3].label.color).toBe('#ffffff')
  })

  it('shortens the printed value', () => {
    const series = build({ showValues: true }).series[0]

    expect(series.label.formatter({ value: [0, 0, 12400] })).toBe('12.4K')
  })

  it('prints the value through `format` when one is given', () => {
    const option = buildHeatmapOption(config({ showValues: true }), {
      tokens,
      format: (value: number) => `${value} orders`,
    }) as any

    expect(option.series[0].label.formatter({ value: [0, 0, 12400] })).toBe(
      '12400 orders',
    )
  })

  it('merges the echarts escape hatch over the built option', () => {
    const option = build({ echartOptions: { grid: { top: 40 } } })

    expect(option.grid.top).toBe(40)
    expect(option.grid.outerBoundsContain).toBe('all')
  })
})

describe('printing the categories', () => {
  const months = [
    { month: new Date('2024-03-01'), team: 'Sales', deals: 4 },
    { month: new Date('2024-01-01'), team: 'Sales', deals: 7 },
  ]
  const monthName = (value: Date) =>
    value.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' })

  const byMonth = { data: months, xColumn: 'month', yColumn: 'team' }

  it('keeps the value each category was registered from, keyed by its label', () => {
    const built = matrix(byMonth)

    expect([...built.xValues]).toEqual([
      [String(months[0].month), months[0].month],
      [String(months[1].month), months[1].month],
    ])
    expect([...built.yValues]).toEqual([['Sales', 'Sales']])
  })

  it('prints an axis label from the value, not from the string it reads as', () => {
    const printed = build(byMonth, { xFormat: monthName }).xAxis.axisLabel
      .formatter

    // The category itself is a stringified Date. The formatter never sees it.
    expect(printed(String(months[0].month))).toBe('Mar')
    expect(printed(String(months[1].month))).toBe('Jan')
  })

  // Pins the label-keyed lookup: echarts numbers a category formatter's ticks
  // from the visible extent, so position alone would slide under a `dataZoom`.
  it('prints a category the axis asks for out of order', () => {
    const printed = build(byMonth, { xFormat: monthName }).xAxis.axisLabel
      .formatter

    expect(printed(String(months[1].month))).toBe('Jan')
    expect(printed(String(months[0].month))).toBe('Mar')
  })

  it('leaves echarts to print the category when no formatter is given', () => {
    expect(build().xAxis.axisLabel.formatter).toBeUndefined()
    expect(build().yAxis.axisLabel.formatter).toBeUndefined()
  })

  it('prints each axis through its own formatter', () => {
    const option = build(
      {},
      {
        xFormat: (value: string) => `at ${value}`,
        yFormat: (value: string) => `on ${value}`,
      },
    )

    expect(option.xAxis.axisLabel.formatter('8am')).toBe('at 8am')
    expect(option.yAxis.axisLabel.formatter('Mon')).toBe('on Mon')
  })

  it('leaves the blank marker alone, whatever the formatter would make of it', () => {
    const option = build(
      { data: [{ day: 'Mon', hour: null, orders: 3 }] },
      { xFormat: (value: any) => `hour ${value}` },
    )

    expect(option.xAxis.axisLabel.formatter('(Blank)')).toBe('(Blank)')
  })

  it('does not merge two categories that print alike', () => {
    const built = matrix({
      data: [
        { day: 'Mon', hour: new Date('2024-03-01'), orders: 1 },
        { day: 'Mon', hour: new Date('2025-03-01'), orders: 2 },
      ],
    })

    expect(built.xCategories).toHaveLength(2)
    expect(built.cells).toHaveLength(2)
  })
})
