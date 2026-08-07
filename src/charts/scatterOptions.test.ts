import { describe, expect, it, vi } from 'vitest'
import { buildScatterOption, buildScatterSeries } from './scatterOptions'
import { paletteColors, type ChartTheme } from './theme'
import type { ScatterChartConfig } from './types'

const theme: ChartTheme = {
  palette: ['#111111', '#222222', '#333333', '#444444'],
  sequential: ['#0a0a0a', '#5a5a5a', '#cccccc'],
  diverging: ['#0000ff', '#ffffff', '#ff0000'],
  axisLabel: 'ink-5',
  axisTitle: 'ink-7',
  axisLine: 'outline-2',
  splitLine: 'outline-1',
  dataLabel: 'ink-6',
  insideLabel: 'ink-8',
  cellGap: '#ffffff',
}

/** Diameters the size measure is mapped onto. */
const MIN_SIZE = 10
const MAX_SIZE = 35
const MID_SIZE = (MIN_SIZE + MAX_SIZE) / 2

function config(
  overrides: Partial<ScatterChartConfig> = {},
): ScatterChartConfig {
  return {
    data: [
      { account: 'Acme', spend: 400, revenue: 1200, seats: 20, region: 'EU' },
      { account: 'Globex', spend: 900, revenue: 2400, seats: 60, region: 'EU' },
      { account: 'Initech', spend: 200, revenue: 300, seats: 10, region: 'US' },
      {
        account: 'Umbrella',
        spend: 700,
        revenue: 900,
        seats: 40,
        region: 'US',
      },
    ],
    xColumn: 'spend',
    yColumn: 'revenue',
    ...overrides,
  }
}

function series(overrides: Partial<ScatterChartConfig> = {}) {
  return buildScatterSeries(config(overrides), { theme })
}

function build(overrides: Partial<ScatterChartConfig> = {}) {
  return buildScatterOption(config(overrides), { theme }) as any
}

/** Every warning this module raises is dev-only, so every test that expects one
 *  has to silence the console it writes to. */
function captureWarnings(run: () => void) {
  const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
  run()
  const calls = warn.mock.calls.map((call) => String(call[0]))
  warn.mockRestore()
  return calls
}

describe('buildScatterSeries', () => {
  it('draws one point per row against the two measures', () => {
    const [only] = series()

    expect(only.points.map((point) => [point.x, point.y])).toEqual([
      [400, 1200],
      [900, 2400],
      [200, 300],
      [700, 900],
    ])
  })

  it('reads numeric strings as coordinates', () => {
    const built = series({ data: [{ spend: '400', revenue: '1200' }] })

    expect(built[0].points[0]).toMatchObject({ x: 400, y: 1200 })
  })

  it('carries the row behind each point, for the click event', () => {
    const [only] = series()

    expect(only.points[0].row).toMatchObject({ account: 'Acme', spend: 400 })
  })

  it('names its single series after the y column when nothing groups', () => {
    expect(series().map((entry) => entry.name)).toEqual(['revenue'])
    expect(series()[0].label).toBe('Revenue')
  })

  it('splits into one series per grouping value, first mention first', () => {
    const built = series({ seriesColumn: 'region' })

    expect(built.map((entry) => entry.name)).toEqual(['EU', 'US'])
    expect(built.map((entry) => entry.points.length)).toEqual([2, 2])
    expect(built[1].points.map((point) => point.x)).toEqual([200, 700])
  })

  it('reads a blank grouping value as (Blank)', () => {
    const built = series({
      seriesColumn: 'region',
      data: [{ spend: 1, revenue: 2, region: null }],
    })

    expect(built.map((entry) => entry.name)).toEqual(['(Blank)'])
  })

  it('takes the point name off the label column', () => {
    const built = series({ labelColumn: 'account' })

    expect(built[0].points.map((point) => point.label)).toEqual([
      'Acme',
      'Globex',
      'Initech',
      'Umbrella',
    ])
  })

  it('leaves a point unnamed when no label column is given', () => {
    expect(series()[0].points[0].label).toBeUndefined()
  })

  it('drops a row missing either coordinate, and says how many', () => {
    let built!: ReturnType<typeof series>
    const warnings = captureWarnings(() => {
      built = series({
        data: [
          { spend: 400, revenue: 1200 },
          { spend: null, revenue: 900 },
          { spend: 700, revenue: 'nope' },
          { spend: '', revenue: '' },
        ],
      })
    })

    expect(built[0].points.map((point) => point.x)).toEqual([400])
    expect(warnings).toHaveLength(1)
    expect(warnings[0]).toContain('[frappe-ui]')
    expect(warnings[0]).toContain('3 rows')
    expect(warnings[0]).toContain('spend')
    expect(warnings[0]).toContain('revenue')
  })

  it('says nothing about data that plots whole', () => {
    expect(captureWarnings(() => series())).toHaveLength(0)
  })

  it('has nothing to draw for no rows', () => {
    expect(series({ data: [] })).toEqual([])
  })

  it('sizes every point the same without a size column', () => {
    const sizes = series()[0].points.map((point) => point.symbolSize)

    expect(sizes).toEqual([MIN_SIZE, MIN_SIZE, MIN_SIZE, MIN_SIZE])
    expect(series()[0].points[0].size).toBeNull()
  })

  it('maps the size measure linearly across the readable range', () => {
    const points = series({ sizeColumn: 'seats' })[0].points
    const bySize = new Map(
      points.map((point) => [point.size, point.symbolSize]),
    )

    // Seats run 10 to 60, so 10 takes the floor and 60 the ceiling; 20 sits a
    // fifth of the way along the range and 40 three fifths.
    expect(bySize.get(10)).toBe(MIN_SIZE)
    expect(bySize.get(60)).toBe(MAX_SIZE)
    expect(bySize.get(20)).toBeCloseTo(15)
    expect(bySize.get(40)).toBeCloseTo(25)
  })

  it('reads the size scale across every group, not within one', () => {
    const built = series({ sizeColumn: 'seats', seriesColumn: 'region' })
    const sized = built.flatMap((entry) =>
      entry.points.map((point) => [point.size, point.symbolSize]),
    )

    // The smallest bubble is in US and the largest in EU; each still lands on
    // the end of the range rather than on the end of its own group.
    expect(sized).toContainEqual([10, MIN_SIZE])
    expect(sized).toContainEqual([60, MAX_SIZE])
  })

  it('draws one distinct magnitude as a readable bubble, not the floor', () => {
    const built = series({
      sizeColumn: 'seats',
      data: [
        { spend: 1, revenue: 2, seats: 30 },
        { spend: 3, revenue: 4, seats: 30 },
      ],
    })

    expect(built[0].points.map((point) => point.symbolSize)).toEqual([
      MID_SIZE,
      MID_SIZE,
    ])
  })

  it('draws a single sized point as a readable bubble', () => {
    const built = series({
      sizeColumn: 'seats',
      data: [{ spend: 1, revenue: 2, seats: 8 }],
    })

    expect(built[0].points[0].symbolSize).toBe(MID_SIZE)
  })

  it('draws a point with no magnitude at the floor, and prints none', () => {
    const built = series({
      sizeColumn: 'seats',
      data: [
        { spend: 1, revenue: 2, seats: 10 },
        { spend: 3, revenue: 4, seats: 60 },
        { spend: 5, revenue: 6, seats: null },
      ],
    })

    expect(built[0].points[2]).toMatchObject({
      size: null,
      symbolSize: MIN_SIZE,
    })
  })

  it('colors the groups from the categorical palette by default', () => {
    const built = series({ seriesColumn: 'region' })

    expect(built.map((entry) => entry.color)).toEqual(
      paletteColors('categorical', theme, 2),
    )
  })

  it('reads a named palette off the config', () => {
    const built = series({ seriesColumn: 'region', palette: 'sequential' })

    expect(built.map((entry) => entry.color)).toEqual(
      paletteColors('sequential', theme, 2),
    )
  })

  it('cycles an explicit palette in the order it was written', () => {
    const built = series({
      seriesColumn: 'account',
      palette: ['#aaaaaa', '#bbbbbb'],
    })

    expect(built.map((entry) => entry.color)).toEqual([
      '#aaaaaa',
      '#bbbbbb',
      '#aaaaaa',
      '#bbbbbb',
    ])
  })
})

describe('buildScatterOption', () => {
  it('draws one scatter series per group, points as coordinate pairs', () => {
    const option = build({ seriesColumn: 'region' })

    expect(option.series.map((entry: any) => entry.name)).toEqual(['EU', 'US'])
    expect(option.series[0].type).toBe('scatter')
    expect(option.series[0].data.map((item: any) => item.value)).toEqual([
      [400, 1200],
      [900, 2400],
    ])
  })

  it('sizes each point on the point itself', () => {
    const option = build({ sizeColumn: 'seats' })

    expect(option.series[0].data.map((item: any) => item.symbolSize)).toEqual([
      15,
      MAX_SIZE,
      MIN_SIZE,
      25,
    ])
  })

  it('paints a group in its palette color, translucent enough to overlap', () => {
    const option = build({ seriesColumn: 'region' })
    const [eu] = paletteColors('categorical', theme, 2)

    expect(option.series[0].itemStyle).toMatchObject({
      color: eu,
      opacity: 0.75,
    })
    expect(option.series[0].symbol).toBe('circle')
  })

  it('lifts a whole group at a time rather than one point', () => {
    expect(build().series[0].emphasis).toEqual({
      focus: 'series',
      blurScope: 'coordinateSystem',
    })
  })

  it('leaves a hidden group out of the option', () => {
    const option = buildScatterOption(config({ seriesColumn: 'region' }), {
      theme,
      hiddenSeries: ['EU'],
    }) as any

    expect(option.series.map((entry: any) => entry.name)).toEqual(['US'])
  })

  it('measures both axes, x along the bottom and y up the side', () => {
    const option = build()

    expect(option.xAxis.type).toBe('value')
    expect(option.xAxis.position).toBe('bottom')
    expect(option.yAxis.type).toBe('value')
    expect(option.yAxis.position).toBe('left')
  })

  it('follows the data instead of anchoring both scales to zero', () => {
    const option = build()

    expect(option.xAxis.scale).toBe(true)
    expect(option.yAxis.scale).toBe(true)
    // Room for a symbol centred on the highest value in the data.
    expect(option.xAxis.boundaryGap).toEqual(['6%', '6%'])
  })

  it('takes the ends of a scale from the axis config', () => {
    const option = build({
      xAxis: { min: 0, max: 1000 },
      yAxis: { min: 100 },
    })

    expect(option.xAxis).toMatchObject({ min: 0, max: 1000 })
    expect(option.yAxis.min).toBe(100)
  })

  it('draws the x axis title on the axis and leaves the y title to the chrome', () => {
    const option = build({
      xAxis: { title: 'ad_spend' },
      yAxis: { title: 'revenue' },
    })

    expect(option.xAxis.name).toBe('Ad Spend')
    expect(option.xAxis.nameLocation).toBe('end')
    expect(option.yAxis.name).toBeUndefined()
  })

  it('prints an axis scale through the formatter it was given', () => {
    const option = buildScatterOption(config(), {
      theme,
      format: { x: (value: number) => `$${value}`, y: () => 'y' },
    }) as any

    expect(option.xAxis.axisLabel.formatter(400)).toBe('$400')
    expect(option.yAxis.axisLabel.formatter(1200)).toBe('y')
  })

  it('lets an axis echartOptions override win over the formatter', () => {
    const option = buildScatterOption(
      config({
        xAxis: { echartOptions: { axisLabel: { formatter: () => 'own' } } },
      }),
      { theme, format: { x: (value: number) => `$${value}` } },
    ) as any

    expect(option.xAxis.axisLabel.formatter(400)).toBe('own')
  })

  it('runs the x axis the other way in RTL and moves the y axis across', () => {
    const option = build({ dir: 'rtl' })

    expect(option.xAxis.inverse).toBe(true)
    expect(option.yAxis.position).toBe('right')
  })

  it('merges the echarts escape hatch over the built option', () => {
    const option = build({ echartOptions: { series: [{ type: 'line' }] } })

    expect(option.series).toEqual([{ type: 'line' }])
    expect(option.animation).toBe(true)
  })

  it('merges a top-level override without touching the series', () => {
    const option = build({ echartOptions: { animation: false } })

    expect(option.animation).toBe(false)
    expect(option.series[0].type).toBe('scatter')
  })
})
