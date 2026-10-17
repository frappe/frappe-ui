import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import de from 'dayjs/esm/locale/de'
import { dayjs } from '#utils/dayjs'
import {
  buildCalendarHeatmapGrid,
  buildCalendarHeatmapOption,
  calendarDay,
  layoutCalendar,
  MONTH_LABEL_ROW,
  type CalendarHeatmapOptionContext,
} from './calendarHeatmapOptions'
import { HEATMAP_RAMP_SAMPLES } from './heatmapOptions'
import { drawsSomething } from './core/useChart'
import type { ChartTokens } from './tokens'
import type { CalendarHeatmapChartConfig } from './types'

/** The scale's own row, under the gap `scaleTop` already includes. */
const SCALE_HEIGHT = 16

const tokens: ChartTokens = {
  categorical: ['#111111', '#222222', '#333333'],
  sequential: ['#0a0a0a', '#5a5a5a', '#f5f5f5'],
  diverging: ['#0000ff', '#ffffff', '#ff0000'],
  axisLabel: 'ink-5',
  axisTitle: 'ink-7',
  axisLine: 'outline-2',
  gridline: 'gridline',
  dataLabel: 'ink-6',
  insideLabel: 'ink-8',
  backdrop: '#ffffff',
}

function config(
  overrides: Partial<CalendarHeatmapChartConfig> = {},
): CalendarHeatmapChartConfig {
  return {
    data: [
      { day: '2024-03-04', commits: 2 },
      { day: '2024-03-05', commits: 6 },
      { day: '2024-03-07', commits: 4 },
    ],
    dateColumn: 'day',
    valueColumn: 'commits',
    ...overrides,
  }
}

function grid(overrides: Partial<CalendarHeatmapChartConfig> = {}) {
  return buildCalendarHeatmapGrid(config(overrides), { tokens })
}

function build(
  overrides: Partial<CalendarHeatmapChartConfig> = {},
  context: Partial<CalendarHeatmapOptionContext> = {},
) {
  return buildCalendarHeatmapOption(config(overrides), {
    tokens,
    ...context,
  }) as any
}

describe('calendarDay', () => {
  it('reads an ISO string for the date it spells', () => {
    expect(calendarDay('2024-03-01')).toBe('2024-03-01')
    expect(calendarDay('2024-03-01 23:30:00')).toBe('2024-03-01')
    expect(calendarDay('2024-03-01T00:10:00Z')).toBe('2024-03-01')
  })

  it('reads a Date in local time, the day it prints as', () => {
    expect(calendarDay(new Date(2024, 2, 1, 23, 59))).toBe('2024-03-01')
  })

  it('names no day for anything that is not one', () => {
    expect(calendarDay('2024-02-30')).toBeNull()
    expect(calendarDay('March')).toBeNull()
    expect(calendarDay(1709251200000)).toBeNull()
    expect(calendarDay(null)).toBeNull()
    expect(calendarDay(new Date('nope'))).toBeNull()
  })
})

describe('buildCalendarHeatmapGrid', () => {
  it('takes one cell per day with data, in date order', () => {
    const cells = grid({
      data: [
        { day: '2024-03-07', commits: 4 },
        { day: '2024-03-04', commits: 2 },
      ],
    }).cells
    expect(cells.map((c) => [c.date, c.value])).toEqual([
      ['2024-03-04', 2],
      ['2024-03-07', 4],
    ])
  })

  it('adds up rows that fall on the same day, and keeps every row', () => {
    const rows = [
      { day: '2024-03-04 09:00:00', commits: 2 },
      { day: '2024-03-04 17:00:00', commits: 3 },
    ]
    const [cell] = grid({ data: rows }).cells
    expect(cell.value).toBe(5)
    expect(cell.rows).toEqual(rows)
  })

  it('skips rows with no day or no numeric value', () => {
    const cells = grid({
      data: [
        { day: '2024-03-04', commits: 2 },
        { day: 'soon', commits: 3 },
        { day: '2024-03-05', commits: null },
        { day: '2024-03-06', commits: 'many' },
      ],
    }).cells
    expect(cells.map((c) => c.date)).toEqual(['2024-03-04'])
  })

  it('takes the range from the data by default', () => {
    expect(grid()).toMatchObject({ start: '2024-03-04', end: '2024-03-07' })
  })

  it('lets the config set either end, and drops days outside it', () => {
    const result = grid({ start: '2024-03-05', end: new Date(2024, 2, 31) })
    expect(result).toMatchObject({ start: '2024-03-05', end: '2024-03-31' })
    expect(result.cells.map((c) => c.date)).toEqual([
      '2024-03-05',
      '2024-03-07',
    ])
  })

  it('never lets a defaulted end cross the end the config set', () => {
    expect(grid({ start: '2024-06-01' })).toMatchObject({
      start: '2024-06-01',
      end: '2024-06-01',
    })
    expect(grid({ end: '2024-01-01' })).toMatchObject({
      start: '2024-01-01',
      end: '2024-01-01',
    })
  })

  it('rejects a range written backwards or a bound that is not a date', () => {
    expect(() => grid({ start: '2024-03-07', end: '2024-03-01' })).toThrow(
      /after/,
    )
    expect(() => grid({ start: 'last week' })).toThrow(/not a date/)
  })

  describe('with no data', () => {
    beforeEach(() => {
      vi.useFakeTimers()
      vi.setSystemTime(new Date(2024, 5, 15, 12))
    })
    afterEach(() => vi.useRealTimers())

    it('spans the year up to today', () => {
      expect(grid({ data: [] })).toMatchObject({
        start: '2023-06-17',
        end: '2024-06-15',
        cells: [],
      })
    })

    it('runs from the start the config set up to today', () => {
      expect(grid({ data: [], start: '2024-06-01' })).toMatchObject({
        start: '2024-06-01',
        end: '2024-06-15',
      })
    })
  })

  it('draws a year or less as one band', () => {
    const { bands } = grid({ start: '2023-07-01', end: '2024-06-30' })
    expect(bands.map((b) => [b.start, b.end])).toEqual([
      ['2023-07-01', '2024-06-30'],
    ])
  })

  it('draws a longer range as one band per calendar year', () => {
    const { bands, cells } = grid({ start: '2023-07-01', end: '2024-12-31' })
    expect(bands.map((b) => [b.start, b.end])).toEqual([
      ['2023-07-01', '2023-12-31'],
      ['2024-01-01', '2024-12-31'],
    ])
    // A partial year still spans its whole year, so its months line up.
    expect(bands[0].weeks).toBe(bands[1].weeks)
    expect(cells.every((c) => c.band === 1)).toBe(true)
    expect(bands[1].cells.map((c) => c.bandIndex)).toEqual([0, 1, 2])
  })

  it('counts the week columns a band spans from its week start', () => {
    // 2024-03-03 is a Sunday, so the week runs Sunday to Saturday in one column.
    expect(
      grid({ start: '2024-03-03', end: '2024-03-09' }).bands[0].weeks,
    ).toBe(1)
    expect(
      grid({ start: '2024-03-03', end: '2024-03-09', weekStart: 'monday' })
        .bands[0].weeks,
    ).toBe(2)
  })

  it('scales color from zero for counts, deepest at the top', () => {
    const { min, max, cells } = grid()
    expect([min, max]).toEqual([0, 6])
    expect(cells[1].color).toBe('#0a0a0a')
  })

  it('never gives a day with a positive value the low end of the ramp', () => {
    const { cells, stops } = grid({
      data: [
        { day: '2024-03-04', commits: 1 },
        { day: '2024-03-05', commits: 1 },
        { day: '2024-03-06', commits: 9 },
      ],
    })
    expect(cells[0].color).not.toBe(stops[0])
    expect(cells[1].color).not.toBe(stops[0])
  })

  it('scales from the smallest day when one is negative', () => {
    const { min } = grid({
      data: [
        { day: '2024-03-04', commits: -3 },
        { day: '2024-03-05', commits: 6 },
      ],
    })
    expect(min).toBe(-3)
  })

  it('lets the config pin the scale, and centers a diverging one on zero', () => {
    expect(grid({ min: 1, max: 10 })).toMatchObject({ min: 1, max: 10 })
    expect(grid({ palette: 'diverging' })).toMatchObject({ min: -6, max: 6 })
  })
})

describe('buildCalendarHeatmapOption', () => {
  it('draws one calendar over the range, weeks running left to right', () => {
    const { calendar } = build()
    expect(calendar).toHaveLength(1)
    expect(calendar[0]).toMatchObject({
      range: ['2024-03-04', '2024-03-07'],
      orient: 'horizontal',
    })
  })

  it('starts the week on any weekday, Sunday by default', () => {
    expect(build().calendar[0].dayLabel.firstDay).toBe(0)
    expect(build({ weekStart: 'monday' }).calendar[0].dayLabel.firstDay).toBe(1)
    expect(build({ weekStart: 'saturday' }).calendar[0].dayLabel.firstDay).toBe(
      6,
    )
  })

  it('labels the second, fourth and sixth row, whatever the week start', () => {
    const labels = (weekStart?: CalendarHeatmapChartConfig['weekStart']) =>
      build({ weekStart }).calendar[0].dayLabel.nameMap
    expect(labels()).toEqual(['', 'Mon', '', 'Wed', '', 'Fri', ''])
    expect(labels('monday')).toEqual(['', '', 'Tue', '', 'Thu', '', 'Sat'])
    expect(labels('saturday')).toEqual(['Sun', '', 'Tue', '', 'Thu', '', ''])
  })

  describe('in another dayjs locale', () => {
    beforeEach(() => {
      dayjs.locale(de)
    })
    afterEach(() => {
      dayjs.locale('en')
    })

    it('names months and weekdays in it', () => {
      const [calendar] = build().calendar
      expect(calendar.monthLabel.nameMap[2]).toBe('März')
      expect(calendar.dayLabel.nameMap[1]).toBe('Mo.')
    })
  })

  it('stacks one calendar per year, with the year beside each', () => {
    const { calendar } = build({ start: '2023-01-01', end: '2024-12-31' })
    expect(calendar).toHaveLength(2)
    expect(calendar[1].top).toBeGreaterThan(calendar[0].top)
    expect(calendar.every((c: any) => c.yearLabel.show)).toBe(true)
    expect(build().calendar[0].yearLabel.show).toBe(false)
  })

  it('lays every year band out over its whole year, drawing the days in range', () => {
    const option = build({ start: '2023-07-01', end: '2024-12-31' })
    expect(option.calendar.map((c: any) => c.range)).toEqual(['2023', '2024'])
    const empty = option.series.filter((s: any) => s.silent)
    expect(empty[0].data[0][0]).toBe('2023-07-01')
    expect(empty[0].data.at(-1)[0]).toBe('2023-12-31')
  })

  it('fits square cells into the plot, no larger than a day reads', () => {
    const size = (width: number, height: number) =>
      build({ start: '2024-01-01', end: '2024-12-31' }, { width, height })
        .calendar[0].cellSize
    const [w, h] = size(700, 400)
    expect(w).toBe(h)
    expect(w).toBeLessThan(700 / 53)
    // A short card: the seven rows, the month labels and the scale fit the height.
    const year = grid({ start: '2024-01-01', end: '2024-12-31' })
    const short = layoutCalendar(year, {}, { width: 2000, height: 160 })
    expect(short.scaleTop + SCALE_HEIGHT).toBeLessThanOrEqual(160)
    expect(size(2000, 160)[0]).toBe(short.cellSize)
    // A huge card stops at the cap.
    expect(size(5000, 5000)[0]).toBe(20)
  })

  it('centers the calendar and its scale in a card taller than it needs', () => {
    const year = grid({ start: '2024-01-01', end: '2024-12-31' })
    const layout = layoutCalendar(year, {}, { width: 1200, height: 600 })
    const above = layout.tops[0]
    const below = 600 - (layout.scaleTop + SCALE_HEIGHT)
    expect(Math.abs(above - below)).toBeLessThanOrEqual(MONTH_LABEL_ROW + 1)
    expect(layout.scaleTop).toBeGreaterThan(
      layout.tops[0] + 7 * layout.cellSize,
    )
    expect(layout.right).toBe(
      layout.left + year.bands[0].weeks * layout.cellSize,
    )
  })

  it('draws the days with data in one series per band, under the visual map', () => {
    const option = build({ start: '2023-07-01', end: '2024-12-31' })
    const data = option.series.filter((s: any) => !s.silent)
    expect(data.map((s: any) => s.calendarIndex)).toEqual([0, 1])
    expect(data[1].data.map((d: any) => d.value)).toEqual([
      ['2024-03-04', 2],
      ['2024-03-05', 6],
      ['2024-03-07', 4],
    ])
    const [ramp] = option.visualMap
    expect(ramp.seriesIndex).toEqual([0, 1])
    expect(ramp.inRange.color).toHaveLength(HEATMAP_RAMP_SAMPLES)
    expect(ramp).toMatchObject({ show: false, min: 0, max: 6 })
  })

  it('fills the days with no data in the gridline color, silent', () => {
    const option = build({ start: '2024-03-01', end: '2024-03-10' })
    const empty = option.series.filter((s: any) => s.silent)
    expect(empty).toHaveLength(1)
    expect(option.visualMap[1].seriesIndex).toEqual([1])
    expect(option.visualMap[1].inRange.color).toBeUndefined()
    expect(empty[0].itemStyle.color).toBe('gridline')
    expect(empty[0].data.map((d: any) => d[0])).toEqual([
      '2024-03-01',
      '2024-03-02',
      '2024-03-03',
      '2024-03-06',
      '2024-03-08',
      '2024-03-09',
      '2024-03-10',
    ])
  })

  it('draws nothing at all for no data, so the empty state shows alone', () => {
    expect(drawsSomething(build({ data: [] }))).toBe(false)
  })

  it('separates days with a border in the surface behind the plot', () => {
    const series = build().series[0]
    expect(series.itemStyle).toMatchObject({
      borderColor: '#ffffff',
      borderWidth: 2,
    })
    expect(series.emphasis.focus).toBe('none')
  })

  it('asks for no echarts tooltip, so the module can stay unregistered', () => {
    expect(build().tooltip).toBeUndefined()
  })

  it('merges the echarts escape hatch over the built option', () => {
    const option = build({ echartOptions: { animation: false } })
    expect(option.animation).toBe(false)
    expect(option.calendar).toHaveLength(1)
  })
})
