import type { EChartsCoreOption } from 'echarts/core'
import {
  AXIS_LABEL_FONT_SIZE,
  AXIS_LABEL_MARGIN,
  toNumber,
} from './axisChartCommon'
import { dayjs } from '#utils/dayjs'
import { estimateTextWidth } from './format'
import {
  CELL_BORDER_WIDTH,
  CELL_RADIUS,
  heatmapRampStops,
  hoverCellColor,
  rampColor,
  resolveScale,
  sampleRamp,
  visualMapMin,
} from './heatmapOptions'
import { CHART_FONT_FAMILY } from './measureText'
import type { ChartTokens } from './tokens'
import { mergeDeep } from './utils'
import type {
  CalendarHeatmapBand,
  CalendarHeatmapCell,
  CalendarHeatmapChartConfig,
  CalendarHeatmapGrid,
  CalendarHeatmapWeekStart,
} from './types'

export type CalendarHeatmapOptionContext = {
  tokens: ChartTokens
  /** Plot size in px the square cells fit into. Unset, they take a default. */
  width?: number
  height?: number
}

/** Where `layoutCalendar` puts the bands and the scale, in px from the plot's corner. */
export type CalendarHeatmapLayout = {
  cellSize: number
  /** Left edge of the bands, past the weekday and year labels. */
  left: number
  /** Width of the weekday labels and their margin. */
  dayGutter: number
  /** Top of each band's first row of cells. */
  tops: number[]
  /** Right edge of the widest band. */
  right: number
  /** Top of the scale under the last band. */
  scaleTop: number
}

const DAY_MS = 24 * 60 * 60 * 1000

/** Up to this many days is one band; longer, one band per calendar year. */
const ONE_BAND_MAX_DAYS = 366

/** The range drawn when neither config nor data names one: a year to today. */
const DEFAULT_RANGE_DAYS = 365

/** echarts' own default: past it a day reads as a tile. */
const MAX_CELL_SIZE = 20
const DEFAULT_CELL_SIZE = 12

/** Room above a band for its month labels. */
export const MONTH_LABEL_ROW = AXIS_LABEL_FONT_SIZE + AXIS_LABEL_MARGIN
const BAND_GAP = 12
const PLOT_RIGHT_PAD = 4
/** Room under the last band for the HTML scale, and the gap above it. */
const SCALE_ROW = 24
const SCALE_GAP = 8

const FIRST_DAY: Record<CalendarHeatmapWeekStart, number> = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
}

/** Rows that carry a weekday label: seven at cell height crowd into each other. */
const LABELLED_ROWS = [1, 3, 5]

/** Short month names in the dayjs locale, as the tooltip and time axes print them. */
function monthNames() {
  return Array.from({ length: 12 }, (_, month) =>
    dayjs(new Date(2024, month, 1)).format('MMM'),
  )
}

/**
 * Indexed by weekday, Sunday first, as echarts reads `dayLabel.nameMap`. Labels
 * go by row, so any week start gets evenly spaced ones.
 */
function dayNames(firstDay: number) {
  const names = Array<string>(7).fill('')
  for (const row of LABELLED_ROWS) {
    const weekday = (firstDay + row) % 7
    names[weekday] = dayjs(new Date(2024, 0, 7 + weekday)).format('ddd')
  }
  return names
}

function weekStartDay(config: Pick<CalendarHeatmapChartConfig, 'weekStart'>) {
  return FIRST_DAY[config.weekStart ?? 'sunday']
}

const ISO_DAY = /^(\d{4})-(\d{2})-(\d{2})/

/**
 * The calendar day a value names, as `YYYY-MM-DD`, or null when it names none.
 *
 * A string is read for the date it spells, not as an instant: `2024-03-01`
 * through `new Date` is UTC midnight, which west of Greenwich is the day before.
 * A `Date` is read in local time, the day it prints as.
 */
export function calendarDay(value: any): string | null {
  if (value instanceof Date) {
    if (isNaN(value.getTime())) return null
    return dayKey(value.getFullYear(), value.getMonth() + 1, value.getDate())
  }
  if (typeof value !== 'string') return null
  const match = ISO_DAY.exec(value)
  if (!match) return null
  const [, year, month, day] = match.map(Number)
  const parsed = new Date(Date.UTC(year, month - 1, day))
  // `2024-02-30` matches the pattern and rolls over into March.
  if (parsed.getUTCMonth() !== month - 1) return null
  return toKey(parsed.getTime())
}

function dayKey(year: number, month: number, day: number) {
  return `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

/** Day arithmetic runs on UTC midnights, so no daylight saving shift moves a day. */
function toTime(key: string) {
  const [year, month, day] = key.split('-').map(Number)
  return Date.UTC(year, month - 1, day)
}

function toKey(time: number) {
  const date = new Date(time)
  return dayKey(
    date.getUTCFullYear(),
    date.getUTCMonth() + 1,
    date.getUTCDate(),
  )
}

function addDays(key: string, days: number) {
  return toKey(toTime(key) + days * DAY_MS)
}

function daysBetween(from: string, to: string) {
  return Math.round((toTime(to) - toTime(from)) / DAY_MS)
}

function today() {
  return calendarDay(new Date()) as string
}

function configDay(value: string | Date | undefined, name: string) {
  if (value === undefined || value === null || value === '') return undefined
  const day = calendarDay(value)
  if (!day) throw new Error(`\`${name}\` is not a date: ${String(value)}`)
  return day
}

/**
 * The days drawn. Either end the config leaves out comes from the data; with
 * no data, the range is the year up to today. A defaulted end never crosses
 * the other one, so only a range the caller wrote backwards is an error.
 */
function resolveRange(
  config: CalendarHeatmapChartConfig,
  days: string[],
): { start: string; end: string } {
  const start = configDay(config.start, 'start')
  const end = configDay(config.end, 'end')
  if (start && end && start > end) {
    throw new Error(`\`start\` (${start}) is after \`end\` (${end})`)
  }

  const first = days[0]
  const last = days[days.length - 1]
  const resolvedEnd = end ?? latest(last ?? today(), start)
  const resolvedStart =
    start ??
    earliest(first ?? addDays(resolvedEnd, 1 - DEFAULT_RANGE_DAYS), resolvedEnd)
  return { start: resolvedStart, end: resolvedEnd }
}

function latest(day: string, other: string | undefined) {
  return other && other > day ? other : day
}

function earliest(day: string, other: string) {
  return other < day ? other : day
}

/**
 * A year or less is one band; longer, one band per calendar year it touches.
 * Each band is the days drawn in it, and the span its calendar lays out: a
 * year band spans the whole year, so its months line up with the other years.
 */
function bandRanges(start: string, end: string) {
  if (daysBetween(start, end) < ONE_BAND_MAX_DAYS) {
    return [{ start, end, spanStart: start, spanEnd: end }]
  }
  const ranges = []
  for (
    let year = Number(start.slice(0, 4));
    year <= Number(end.slice(0, 4));
    year++
  ) {
    const first = dayKey(year, 1, 1)
    const last = dayKey(year, 12, 31)
    ranges.push({
      start: first < start ? start : first,
      end: last > end ? end : last,
      spanStart: first,
      spanEnd: last,
    })
  }
  return ranges
}

/** Week columns from the column `start` falls in to the one `end` falls in. */
function weekCount(start: string, end: string, firstDay: number) {
  const offset = (new Date(toTime(start)).getUTCDay() - firstDay + 7) % 7
  return Math.ceil((offset + daysBetween(start, end) + 1) / 7)
}

/**
 * Days, bands and the resolved color scale. Rows on the same day add up: a
 * calendar cell is a day, and rows keyed by a timestamp land several to a day.
 */
export function buildCalendarHeatmapGrid(
  config: CalendarHeatmapChartConfig,
  { tokens }: CalendarHeatmapOptionContext,
): CalendarHeatmapGrid {
  const firstDay = weekStartDay(config)
  const summed = new Map<
    string,
    { value: number; rows: Record<string, any>[] }
  >()

  for (const row of config.data ?? []) {
    const date = calendarDay(row[config.dateColumn])
    const value = toNumber(row[config.valueColumn])
    if (date === null || value === null) continue
    const day = summed.get(date)
    if (day) {
      day.value += value
      day.rows.push(row)
    } else {
      summed.set(date, { value, rows: [row] })
    }
  }

  const { start, end } = resolveRange(config, [...summed.keys()].sort())
  const inRange = [...summed.entries()]
    .filter(([date]) => date >= start && date <= end)
    .sort(([a], [b]) => (a < b ? -1 : 1))

  const days = inRange.map(([, day]) => day)
  // From zero, as a count is read: the smallest day starting the ramp would
  // draw paler than the empty days around it.
  const fromZero =
    config.palette !== 'diverging' && days.every((day) => day.value >= 0)
  const { min, max } = resolveScale(
    { ...config, min: config.min ?? (fromZero ? 0 : undefined) },
    days,
  )
  const stops = heatmapRampStops(config, tokens)
  const span = max - min

  const bands: CalendarHeatmapBand[] = bandRanges(start, end).map((band) => ({
    start: band.start,
    end: band.end,
    weeks: weekCount(band.spanStart, band.spanEnd, firstDay),
    cells: [],
  }))

  const cells: CalendarHeatmapCell[] = inRange.map(([date, day]) => {
    const band = bands.findIndex((b) => date <= b.end)
    const cell = {
      date,
      value: day.value,
      rows: day.rows,
      // As on the category heatmap: a flat calendar reads as present, not empty.
      color: rampColor(stops, span > 0 ? (day.value - min) / span : 1),
      band,
      bandIndex: bands[band].cells.length,
    }
    bands[band].cells.push(cell)
    return cell
  })

  return { start, end, bands, cells, min, max, stops }
}

/** Gutter left of the bands: the weekday labels, and the year beside them. */
function gutters(grid: CalendarHeatmapGrid, firstDay: number) {
  const dayLabelWidth = Math.max(
    ...dayNames(firstDay).map((name) =>
      estimateTextWidth(name, AXIS_LABEL_FONT_SIZE),
    ),
  )
  const day = Math.ceil(dayLabelWidth) + AXIS_LABEL_MARGIN
  // The year runs up the side of its band, outside the day labels.
  const year =
    grid.bands.length > 1 ? AXIS_LABEL_FONT_SIZE + AXIS_LABEL_MARGIN : 0
  return { day, total: day + year }
}

/**
 * Where the bands and the scale under them sit in the plot. Cells are square,
 * as large as both the width and the height allow: the width holds the widest
 * band's weeks beside the gutter, the height every band, its month labels and
 * the scale. The height left over goes above and below, half each, so the
 * calendar and its scale sit together in the middle of the card.
 */
export function layoutCalendar(
  grid: CalendarHeatmapGrid,
  config: Pick<CalendarHeatmapChartConfig, 'weekStart'>,
  {
    width = 0,
    height = 0,
  }: Pick<CalendarHeatmapOptionContext, 'width' | 'height'>,
): CalendarHeatmapLayout {
  const gutter = gutters(grid, weekStartDay(config))
  const count = grid.bands.length
  const weeks = Math.max(...grid.bands.map((band) => band.weeks))
  const chrome = count * MONTH_LABEL_ROW + (count - 1) * BAND_GAP + SCALE_ROW

  const fits = [MAX_CELL_SIZE]
  if (width > 0) fits.push((width - gutter.total - PLOT_RIGHT_PAD) / weeks)
  if (height > 0) fits.push((height - chrome) / (7 * count))
  const cellSize =
    fits.length === 1
      ? DEFAULT_CELL_SIZE
      : Math.max(1, Math.floor(Math.min(...fits)))

  const bandHeight = MONTH_LABEL_ROW + 7 * cellSize + BAND_GAP
  const offset = Math.max(
    0,
    Math.floor((height - chrome - 7 * count * cellSize) / 2),
  )
  return {
    cellSize,
    left: gutter.total,
    dayGutter: gutter.day,
    tops: grid.bands.map(
      (_, index) => offset + MONTH_LABEL_ROW + index * bandHeight,
    ),
    right: gutter.total + weeks * cellSize,
    scaleTop: offset + count * bandHeight - BAND_GAP + SCALE_GAP,
  }
}

export function buildCalendarHeatmapOption(
  config: CalendarHeatmapChartConfig,
  context: CalendarHeatmapOptionContext,
  grid = buildCalendarHeatmapGrid(config, context),
): EChartsCoreOption {
  const { tokens } = context
  const isMultiYear = grid.bands.length > 1
  const layout = layoutCalendar(grid, config, context)
  const size = layout.cellSize

  const labelStyle = {
    color: tokens.axisLabel,
    fontSize: AXIS_LABEL_FONT_SIZE,
    fontFamily: CHART_FONT_FAMILY,
  }

  const firstDay = weekStartDay(config)
  const calendar = grid.bands.map((band, index) => ({
    // A year band lays out its whole year; the days outside the range stay
    // transparent, as the calendar's own day rects are.
    range: isMultiYear ? band.start.slice(0, 4) : [band.start, band.end],
    orient: 'horizontal',
    left: layout.left,
    top: layout.tops[index],
    cellSize: [size, size],
    // The series draw every day, empty ones included, so the calendar's own
    // rects and month rules would only draw under and across them.
    splitLine: { show: false },
    itemStyle: { color: 'transparent', borderWidth: 0 },
    dayLabel: {
      ...labelStyle,
      firstDay,
      nameMap: dayNames(firstDay),
      margin: AXIS_LABEL_MARGIN,
    },
    monthLabel: {
      ...labelStyle,
      nameMap: monthNames(),
      align: 'left',
      margin: AXIS_LABEL_MARGIN / 2,
    },
    yearLabel: {
      show: isMultiYear,
      ...labelStyle,
      color: tokens.axisTitle,
      fontWeight: 'normal',
      position: 'left',
      margin: layout.dayGutter + AXIS_LABEL_MARGIN / 2,
      formatter: '{start}',
    },
  }))

  const cellStyle = {
    borderRadius: CELL_RADIUS,
    borderWidth: CELL_BORDER_WIDTH,
    borderColor: tokens.backdrop,
  }

  // The data series come first, one per band, so a series index is a band index.
  const dataSeries = grid.bands.map((band, index) => ({
    type: 'heatmap',
    coordinateSystem: 'calendar',
    calendarIndex: index,
    name: config.valueColumn,
    itemStyle: cellStyle,
    // As on the category heatmap: hover lightens the fill and nothing else.
    emphasis: {
      focus: 'none',
      itemStyle: { ...cellStyle, shadowBlur: 0, shadowColor: 'transparent' },
    },
    data: band.cells.map((cell) => ({
      value: [cell.date, cell.value],
      emphasis: { itemStyle: { color: hoverCellColor(cell.color) } },
    })),
  }))

  // Days with no data. A series of their own rather than the calendar's day
  // rects, which take no corner radius. None for a calendar with no data: it
  // shows the empty state, and the entry animation is kept for the data.
  const emptySeries = (grid.cells.length ? grid.bands : []).map(
    (band, index) => {
      const filled = new Set(band.cells.map((cell) => cell.date))
      const empty: [string, number][] = []
      for (let day = band.start; day <= band.end; day = addDays(day, 1)) {
        if (!filled.has(day)) empty.push([day, 0])
      }
      return {
        type: 'heatmap',
        coordinateSystem: 'calendar',
        calendarIndex: index,
        silent: true,
        itemStyle: { ...cellStyle, color: tokens.gridline },
        data: empty,
      }
    },
  )

  const option = {
    animation: true,
    animationDuration: 500,
    animationDurationUpdate: 300,
    textStyle: { fontFamily: CHART_FONT_FAMILY },
    calendar,
    // Hidden: the ramp is explained by an HTML scale under the plot. The empty
    // days take a second map only because echarts' development build throws for
    // a heatmap without one. It maps opacity: a color mapping would overwrite
    // their `itemStyle.color`, and cannot parse the oklch gridline token.
    visualMap: [
      {
        type: 'continuous',
        show: false,
        calculable: false,
        min: visualMapMin(grid),
        max: grid.max,
        inRange: { color: sampleRamp(grid.stops) },
        seriesIndex: dataSeries.map((_, index) => index),
      },
      {
        type: 'continuous',
        show: false,
        calculable: false,
        min: 0,
        max: 1,
        inRange: { opacity: [1, 1] },
        seriesIndex: emptySeries.map((_, index) => dataSeries.length + index),
      },
    ],
    series: [...dataSeries, ...emptySeries],
  }

  return mergeDeep(option, config.echartOptions)
}
