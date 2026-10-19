import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import de from 'dayjs/esm/locale/de'
import { dayjs } from '#utils/dayjs'
import {
  bandMonthLabels,
  buildCalendarHeatmapGrid,
  buildCalendarHeatmapOption,
  calendarDay,
  layoutCalendar,
  MONTH_LABEL_ROW,
  type CalendarHeatmapOptionContext,
} from './calendarHeatmapOptions'
import { hexToOklch } from './colorMath'
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

/** First and last day drawn. */
function range(overrides: Partial<CalendarHeatmapChartConfig> = {}) {
  const { bands } = grid(overrides)
  return [bands[0]?.start, bands[bands.length - 1]?.end]
}

/** The series that draw the days with no data, one per band. */
function emptySeries(option: any) {
  return option.series.filter((s: any) => s.itemStyle.color === 'gridline')
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

  it('draws the later of two rows on the same day, as the category heatmap does', () => {
    const rows = [
      { day: '2024-03-04 09:00:00', commits: 2 },
      { day: '2024-03-04 17:00:00', commits: 3 },
    ]
    const [cell] = grid({ data: rows }).cells
    expect(cell.value).toBe(3)
    expect(cell.row).toBe(rows[1])
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

  it('takes the range from the data by default, out to whole months', () => {
    expect(range()).toEqual(['2024-03-01', '2024-03-31'])
    expect(
      range({
        data: [
          { day: '2023-12-20', commits: 1 },
          { day: '2024-02-10', commits: 1 },
        ],
      }),
    ).toEqual(['2023-12-01', '2024-02-29'])
  })

  it('lets the config set either end, and drops days outside it', () => {
    const config = { start: '2024-03-05', end: new Date(2024, 2, 31) }
    expect(range(config)).toEqual(['2024-03-05', '2024-03-31'])
    expect(grid(config).cells.map((c) => c.date)).toEqual([
      '2024-03-05',
      '2024-03-07',
    ])
  })

  it('takes a defaulted end from the data inside the end the config set', () => {
    expect(range({ start: '2024-03-05' })).toEqual(['2024-03-05', '2024-03-31'])
    expect(range({ end: '2024-03-06' })).toEqual(['2024-03-01', '2024-03-06'])
  })

  it('draws nothing when one end is set and no data falls inside it', () => {
    expect(grid({ start: '2024-06-01' }).bands).toEqual([])
    expect(grid({ end: '2024-01-01' }).bands).toEqual([])
  })

  it('rejects a range written backwards or a bound that is not a date', () => {
    expect(() => grid({ start: '2024-03-07', end: '2024-03-01' })).toThrow(
      /after/,
    )
    expect(() => grid({ start: 'last week' })).toThrow(/not a date/)
  })

  it('draws a range set in full even with no data in it', () => {
    const empty = { data: [], start: '2024-01-01', end: '2024-12-31' }
    expect(range(empty)).toEqual(['2024-01-01', '2024-12-31'])
    expect(grid(empty).cells).toEqual([])
    expect(grid({ start: '2024-06-01', end: '2024-06-30' }).bands).toHaveLength(
      1,
    )
  })

  it('draws nothing for no data and no range', () => {
    expect(grid({ data: [] }).bands).toEqual([])
  })

  it('draws a year or less as one band', () => {
    const { bands } = grid({ start: '2023-07-01', end: '2024-06-30' })
    expect(bands.map((b) => [b.start, b.end])).toEqual([
      ['2023-07-01', '2024-06-30'],
    ])
  })

  it('draws a longer range in bands of twelve months from its first month', () => {
    const { bands, days } = grid({ start: '2023-07-15', end: '2024-12-31' })
    expect(bands.map((b) => [b.start, b.end])).toEqual([
      ['2023-07-15', '2024-06-30'],
      ['2024-07-01', '2024-12-31'],
    ])
    // A short last band still spans twelve months, so its months line up.
    expect(bands.map((b) => b.span)).toEqual([
      ['2023-07-01', '2024-06-30'],
      ['2024-07-01', '2025-06-30'],
    ])
    const data = days.filter((day) => day.cell)
    expect(
      data.map((day) => [day.band, day.seriesIndex, day.dataIndex]),
    ).toEqual([
      [0, 0, 0],
      [0, 0, 1],
      [0, 0, 2],
    ])
  })

  it('lists every day drawn, with the series and the place that draw it', () => {
    const { days } = grid({ start: '2024-03-03', end: '2024-03-06' })
    expect(
      days.map((day) => [
        day.date,
        day.cell?.value,
        day.seriesIndex,
        day.dataIndex,
      ]),
    ).toEqual([
      ['2024-03-03', undefined, 1, 0],
      ['2024-03-04', 2, 0, 0],
      ['2024-03-05', 6, 0, 1],
      ['2024-03-06', undefined, 1, 1],
    ])
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

  it('draws a day of 0 darker than an empty day, on the scale as well', () => {
    const light: ChartTokens = {
      ...tokens,
      // `--chart-sequential-*` in the light theme
      sequential: [
        '#095895',
        '#2283c3',
        '#4eacdf',
        '#71bde5',
        '#91ccec',
        '#9cd1ee',
        '#b8def2',
        '#dceef9',
        '#edf7fc',
      ],
      // `--outline-gray-1`, oklch(0.946 0 0)
      gridline: '#ededed',
    }
    const { cells, stops } = buildCalendarHeatmapGrid(
      config({
        data: [
          { day: '2024-03-04', commits: 0 },
          { day: '2024-03-05', commits: 6 },
        ],
      }),
      { tokens: light },
    )
    const lightness = (color: string) => hexToOklch(color).l
    expect(cells[0].color).toBe(stops[0])
    expect(lightness(stops[0])).toBeLessThan(lightness(light.gridline))
  })

  it('draws a diverging ramp whole, its pale middle on zero', () => {
    expect(grid({ palette: 'diverging' }).stops).toEqual(tokens.diverging)
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
      range: ['2024-03-01', '2024-03-31'],
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
      expect(calendar.dayLabel.nameMap[2]).toBe('Di.')
    })

    it('starts the week where it does, unless the config says otherwise', () => {
      expect(build().calendar[0].dayLabel.firstDay).toBe(1)
      expect(build({ weekStart: 'sunday' }).calendar[0].dayLabel.firstDay).toBe(
        0,
      )
    })
  })

  it('stacks one calendar per band, with its years beside each', () => {
    const years = build({ start: '2023-01-01', end: '2024-12-31' }).calendar
    expect(years).toHaveLength(2)
    expect(years[1].top).toBeGreaterThan(years[0].top)
    expect(years.every((c: any) => c.yearLabel.show)).toBe(true)
    expect(years.map((c: any) => c.yearLabel.formatter)).toEqual([
      '2023',
      '2024',
    ])
    const fiscal = build({ start: '2023-04-01', end: '2025-03-31' }).calendar
    expect(fiscal.map((c: any) => c.yearLabel.formatter)).toEqual([
      '2023–24',
      '2024–25',
    ])
    expect(build().calendar[0].yearLabel.show).toBe(false)
  })

  it('lays every band out over its twelve months, drawing the days in range', () => {
    const option = build({ start: '2023-07-01', end: '2024-12-31' })
    expect(option.calendar.map((c: any) => c.range)).toEqual([
      ['2023-07-01', '2024-06-30'],
      ['2024-07-01', '2025-06-30'],
    ])
    const empty = emptySeries(option)
    expect(empty[1].data[0][0]).toBe('2024-07-01')
    expect(empty[1].data.at(-1)[0]).toBe('2024-12-31')
  })

  it('names only the months a band draws days in', () => {
    const option = build({ start: '2023-12-01', end: '2024-12-31' })
    const name = (band: number, yyyy: string, MM: string) =>
      option.calendar[band].monthLabel.formatter({ yyyy, MM, nameMap: MM })
    expect(name(0, '2023', '12')).toBe('12')
    expect(name(0, '2024', '11')).toBe('11')
    expect(name(1, '2024', '12')).toBe('12')
    expect(name(1, '2025', '01')).toBe('')
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

  it('sits at the top left of a card larger than it needs', () => {
    const year = grid({ start: '2024-01-01', end: '2024-12-31' })
    const layout = layoutCalendar(year, {}, { width: 1200, height: 600 })
    expect(layout.tops[0]).toBe(MONTH_LABEL_ROW)
    expect(layout.scaleTop + SCALE_HEIGHT).toBeLessThan(600 / 2)
    expect(layout.scaleTop).toBeGreaterThan(
      layout.tops[0] + 7 * layout.cellSize,
    )
    expect(layout.right).toBe(
      layout.left + year.bands[0].weeks * layout.cellSize,
    )
  })

  describe('in a 360px card', () => {
    const year = { start: '2024-01-01', end: '2024-12-31' }
    const narrow = { width: 328, height: 180 }

    it('drops the weekday labels once a row is shorter than they are', () => {
      const layout = layoutCalendar(grid(year), {}, narrow)
      expect(layout.cellSize).toBeLessThan(11)
      expect(layout.dayGutter).toBe(0)
      expect(layout.left).toBe(0)
      expect(build(year, narrow).calendar[0].dayLabel.show).toBe(false)
      expect(
        build(year, { width: 1100, height: 260 }).calendar[0].dayLabel.show,
      ).toBe(true)
    })

    it('drops a month label that would run into the one before it', () => {
      const shown = (width: number) => {
        const result = grid(year)
        const { cellSize } = layoutCalendar(result, {}, { width, height: 180 })
        return bandMonthLabels(result.bands[0], 0, cellSize)
      }
      expect(shown(1100)).toHaveLength(12)
      const months = shown(narrow.width)
      expect(months.length).toBeLessThan(12)
      expect(months[0]).toBe('2024-01')
    })
  })

  it('names the month a range starts in late, not both it and the next', () => {
    const late = grid({ start: '2024-04-28', end: '2024-12-31' })
    const { cellSize } = layoutCalendar(late, {}, { width: 1100, height: 260 })
    expect(bandMonthLabels(late.bands[0], 0, cellSize).slice(0, 2)).toEqual([
      '2024-04',
      '2024-06',
    ])
  })

  it('draws the days with data in one series per band, under the visual map', () => {
    const option = build({ start: '2023-07-01', end: '2024-12-31' })
    const data = option.series.filter((s: any) => s.name === 'commits')
    expect(data.map((s: any) => s.calendarIndex)).toEqual([0, 1])
    expect(data[0].data.map((d: any) => d.value)).toEqual([
      ['2024-03-04', 2],
      ['2024-03-05', 6],
      ['2024-03-07', 4],
    ])
    const [ramp] = option.visualMap
    expect(ramp.seriesIndex).toEqual([0, 1])
    expect(ramp.inRange.color).toHaveLength(HEATMAP_RAMP_SAMPLES)
    expect(ramp).toMatchObject({ show: false, min: 0, max: 6 })
  })

  it('fills the days with no data in the gridline color', () => {
    const option = build({ start: '2024-03-01', end: '2024-03-10' })
    const empty = emptySeries(option)
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

  it('draws every day empty for a range set in full with no data', () => {
    const option = build({ data: [], start: '2024-03-01', end: '2024-03-31' })
    const empty = emptySeries(option)
    expect(empty[0].data).toHaveLength(31)
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
