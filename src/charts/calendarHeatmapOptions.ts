import type { EChartsCoreOption } from 'echarts/core'
import {
  AXIS_LABEL_FONT_SIZE,
  AXIS_LABEL_MARGIN,
  CATEGORY_LABEL_GAP,
  toNumber,
} from './axisChartCommon'
import { dayjs } from '#utils/dayjs'
import { estimateTextWidth } from './format'
import { interpolateRamp } from './colorMath'
import {
  CELL_BORDER_WIDTH,
  CELL_RADIUS,
  HEATMAP_RAMP_SAMPLES,
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
  CalendarHeatmapDay,
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
  /** Width of the weekday labels and their margin; 0 when rows are too short for them. */
  dayGutter: number
  /** Top of each band's first row of cells. */
  tops: number[]
  /** Right edge of the widest band. */
  right: number
  /** Top of the scale under the last band. */
  scaleTop: number
}

const DAY_MS = 24 * 60 * 60 * 1000

/** Up to this many days is one band; longer, bands of twelve months. */
const ONE_BAND_MAX_DAYS = 366

/**
 * Where on the ramp the lowest day lands. The pale end is as light as the grey
 * of an empty day, so a day with data, 0 included, starts past it.
 */
const RAMP_FLOOR = 0.15

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
  if (config.weekStart) return FIRST_DAY[config.weekStart]
  return dayjs.Ls[dayjs.locale()]?.weekStart ?? FIRST_DAY.sunday
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

/** The first day of the month `months` after the one `key` falls in. */
function monthStart(key: string, months = 0) {
  const [year, month] = key.split('-').map(Number)
  const index = year * 12 + month - 1 + months
  return dayKey(Math.floor(index / 12), (index % 12) + 1, 1)
}

function monthEnd(key: string) {
  return addDays(monthStart(key, 1), -1)
}

function configDay(value: string | Date | undefined, name: string) {
  if (value === undefined || value === null || value === '') return undefined
  const day = calendarDay(value)
  if (!day) throw new Error(`\`${name}\` is not a date: ${String(value)}`)
  return day
}

/**
 * The days drawn, or none. A range the config names in full is drawn even with
 * no data in it, because an empty year is a reading too. An end it leaves out
 * comes from the data inside the end it names, rounded out to the whole month,
 * and with no such data there is nothing to draw. Only a range the caller
 * wrote backwards is an error.
 */
function resolveRange(
  config: CalendarHeatmapChartConfig,
  days: string[],
): { start: string; end: string } | undefined {
  const start = configDay(config.start, 'start')
  const end = configDay(config.end, 'end')
  if (start && end) {
    if (start > end) {
      throw new Error(`\`start\` (${start}) is after \`end\` (${end})`)
    }
    return { start, end }
  }

  const inside = days.filter(
    (day) => (!start || day >= start) && (!end || day <= end),
  )
  if (!inside.length) return undefined
  return {
    start: start ?? monthStart(inside[0]),
    end: end ?? monthEnd(inside[inside.length - 1]),
  }
}

/**
 * A year or less is one band. Longer, bands of twelve months from the range's
 * first month, so a fiscal or a rolling year is one band, not two halves. Each
 * band is the days drawn in it, and the span its calendar lays out: a whole
 * twelve months, so its months line up with the other bands.
 */
function bandRanges(start: string, end: string) {
  if (daysBetween(start, end) < ONE_BAND_MAX_DAYS) {
    return [{ start, end, span: [start, end] as [string, string] }]
  }
  const ranges = []
  for (
    let first = monthStart(start);
    first <= end;
    first = monthStart(first, 12)
  ) {
    const last = addDays(monthStart(first, 12), -1)
    ranges.push({
      start: first < start ? start : first,
      end: last > end ? end : last,
      span: [first, last] as [string, string],
    })
  }
  return ranges
}

/** A band's years: `2024` for a calendar year, `2023–24` across two. */
function bandLabel([first, last]: [string, string]) {
  const [from, to] = [first.slice(0, 4), last.slice(0, 4)]
  return from === to ? from : `${from}–${to.slice(2)}`
}

/** The months a band draws days in, as `YYYY-MM`. */
function bandMonths(band: CalendarHeatmapBand) {
  const months = []
  for (
    let first = monthStart(band.start);
    first <= band.end;
    first = monthStart(first, 1)
  ) {
    months.push(first.slice(0, 7))
  }
  return months
}

/** A day's row in its column, 0 at the top. */
function weekRow(day: string, firstDay: number) {
  return (new Date(toTime(day)).getUTCDay() - firstDay + 7) % 7
}

/** Week columns from the column `start` falls in to the one `end` falls in. */
function weekCount(start: string, end: string, firstDay: number) {
  return Math.ceil((weekRow(start, firstDay) + daysBetween(start, end) + 1) / 7)
}

/**
 * Days, bands and the resolved color scale. Of two rows on the same day the
 * later one is drawn, as on the category heatmap: the chart does not choose how
 * a caller's numbers combine.
 */
export function buildCalendarHeatmapGrid(
  config: CalendarHeatmapChartConfig,
  { tokens }: CalendarHeatmapOptionContext,
): CalendarHeatmapGrid {
  const firstDay = weekStartDay(config)
  const placed = new Map<string, { value: number; row: Record<string, any> }>()

  for (const row of config.data ?? []) {
    const date = calendarDay(row[config.dateColumn])
    const value = toNumber(row[config.valueColumn])
    if (date === null || value === null) continue
    if (import.meta.env.DEV && placed.has(date)) {
      console.warn(
        `[frappe-ui] Two rows land on the calendar heatmap day ${date}. The last one is drawn; pre-aggregate the data to choose yourself.`,
      )
    }
    placed.set(date, { value, row })
  }

  const range = resolveRange(config, [...placed.keys()].sort())
  const inRange = [...placed.entries()]
    .filter(([date]) => range && date >= range.start && date <= range.end)
    .sort(([a], [b]) => (a < b ? -1 : 1))

  const values = inRange.map(([, day]) => day)
  // From zero, as a count is read: the smallest day starting the ramp would
  // draw paler than the empty days around it.
  const fromZero =
    config.palette !== 'diverging' && values.every((day) => day.value >= 0)
  const { min, max } = resolveScale(
    { ...config, min: config.min ?? (fromZero ? 0 : undefined) },
    values,
  )
  const stops = dataRamp(config, tokens)
  const span = max - min

  const ranges = range ? bandRanges(range.start, range.end) : []
  const bands: CalendarHeatmapBand[] = []
  const cells: CalendarHeatmapCell[] = []
  const days: CalendarHeatmapDay[] = []

  ranges.forEach(({ start, end, span: bandSpan }, band) => {
    const entry: CalendarHeatmapBand = {
      start,
      end,
      span: bandSpan,
      weeks: weekCount(bandSpan[0], bandSpan[1], firstDay),
      cells: [],
    }
    bands.push(entry)
    let empty = 0
    for (let date = start; date <= end; date = addDays(date, 1)) {
      const day = placed.get(date)
      if (!day) {
        // The empty days' series follow the data series, one per band.
        days.push({
          date,
          band,
          seriesIndex: ranges.length + band,
          dataIndex: empty++,
        })
        continue
      }
      const cell = {
        date,
        value: day.value,
        row: day.row,
        // As on the category heatmap: a flat calendar reads as present, not empty.
        color: rampColor(stops, span > 0 ? (day.value - min) / span : 1),
      }
      days.push({
        date,
        band,
        cell,
        seriesIndex: band,
        dataIndex: entry.cells.length,
      })
      entry.cells.push(cell)
      cells.push(cell)
    }
  })

  return { bands, cells, days, min, max, stops }
}

/**
 * The ramp from its floor up, which the days and the scale both draw from. A
 * diverging ramp keeps its pale middle for zero, so it is drawn whole.
 */
function dataRamp(config: CalendarHeatmapChartConfig, tokens: ChartTokens) {
  const stops = heatmapRampStops(config, tokens)
  if (config.palette === 'diverging') return stops
  try {
    return Array.from({ length: HEATMAP_RAMP_SAMPLES }, (_, i) =>
      interpolateRamp(
        stops,
        RAMP_FLOOR + ((1 - RAMP_FLOOR) * i) / (HEATMAP_RAMP_SAMPLES - 1),
      ),
    )
  } catch {
    return stops
  }
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
 * the scale. The calendar sits at the top left, as the sibling charts do, and
 * the room it does not need is left under it and to its right.
 */
export function layoutCalendar(
  grid: CalendarHeatmapGrid,
  config: Pick<CalendarHeatmapChartConfig, 'weekStart'>,
  {
    width = 0,
    height = 0,
  }: Pick<CalendarHeatmapOptionContext, 'width' | 'height'>,
): CalendarHeatmapLayout {
  const count = grid.bands.length
  const weeks = Math.max(...grid.bands.map((band) => band.weeks))
  const chrome = count * MONTH_LABEL_ROW + (count - 1) * BAND_GAP + SCALE_ROW

  function fit(gutter: number) {
    const fits = [MAX_CELL_SIZE]
    if (width > 0) fits.push((width - gutter - PLOT_RIGHT_PAD) / weeks)
    if (height > 0) fits.push((height - chrome) / (7 * count))
    return fits.length === 1
      ? DEFAULT_CELL_SIZE
      : Math.max(1, Math.floor(Math.min(...fits)))
  }

  let gutter = gutters(grid, weekStartDay(config))
  let cellSize = fit(gutter.total)
  // A row shorter than the label font cannot carry a weekday, so the labels
  // go and the cells take their room.
  if (cellSize < AXIS_LABEL_FONT_SIZE) {
    gutter = { day: 0, total: gutter.total - gutter.day }
    cellSize = fit(gutter.total)
  }

  const bandHeight = MONTH_LABEL_ROW + 7 * cellSize + BAND_GAP
  return {
    cellSize,
    left: gutter.total,
    dayGutter: gutter.day,
    tops: grid.bands.map((_, index) => MONTH_LABEL_ROW + index * bandHeight),
    right: gutter.total + weeks * cellSize,
    scaleTop: count * bandHeight - BAND_GAP + SCALE_GAP,
  }
}

/**
 * The months a band names, as `YYYY-MM`: those it draws days in, less any whose
 * label would run into the one before it. A month's label stands over the
 * first column its top row falls in, which is where echarts draws it.
 */
export function bandMonthLabels(
  band: CalendarHeatmapBand,
  firstDay: number,
  cellSize: number,
) {
  const [spanStart] = band.span
  const names = monthNames()
  const shown: string[] = []
  let free = -Infinity
  for (const month of bandMonths(band)) {
    const first = `${month}-01` < spanStart ? spanStart : `${month}-01`
    const top = addDays(first, (7 - weekRow(first, firstDay)) % 7)
    const column = Math.floor(
      (weekRow(spanStart, firstDay) + daysBetween(spanStart, top)) / 7,
    )
    const x = column * cellSize
    if (x < free) continue
    shown.push(month)
    const name = names[Number(month.slice(5)) - 1]
    free =
      x + estimateTextWidth(name, AXIS_LABEL_FONT_SIZE) + CATEGORY_LABEL_GAP
  }
  return shown
}

/** Prints the months in `shown`, as `YYYY-MM`, and leaves the rest blank. */
function monthLabelFormatter(shown: Set<string>) {
  return (params: { yyyy: string; MM: string; nameMap: string }) =>
    shown.has(`${params.yyyy}-${params.MM}`) ? params.nameMap : ''
}

export function buildCalendarHeatmapOption(
  config: CalendarHeatmapChartConfig,
  context: CalendarHeatmapOptionContext,
  grid = buildCalendarHeatmapGrid(config, context),
): EChartsCoreOption {
  const { tokens } = context
  const isMultiBand = grid.bands.length > 1
  const layout = layoutCalendar(grid, config, context)
  const size = layout.cellSize

  const labelStyle = {
    color: tokens.axisLabel,
    fontSize: AXIS_LABEL_FONT_SIZE,
    fontFamily: CHART_FONT_FAMILY,
  }

  const firstDay = weekStartDay(config)
  const calendar = grid.bands.map((band, index) => ({
    // A band lays out its whole span; the days outside the range stay
    // transparent, as the calendar's own day rects are.
    range: band.span,
    orient: 'horizontal',
    left: layout.left,
    top: layout.tops[index],
    cellSize: [size, size],
    // The series draw every day, empty ones included, so the calendar's own
    // rects and month rules would only draw under and across them.
    splitLine: { show: false },
    itemStyle: { color: 'transparent', borderWidth: 0 },
    dayLabel: {
      show: layout.dayGutter > 0,
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
      formatter: monthLabelFormatter(
        new Set(bandMonthLabels(band, firstDay, size)),
      ),
    },
    yearLabel: {
      show: isMultiBand,
      ...labelStyle,
      color: tokens.axisTitle,
      fontWeight: 'normal',
      position: 'left',
      margin: layout.dayGutter + AXIS_LABEL_MARGIN / 2,
      formatter: bandLabel(band.span),
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
  // rects, which take no corner radius and answer no pointer.
  const emptyStyle = { ...cellStyle, color: tokens.gridline }
  const emptySeries = grid.bands.map((_, index) => ({
    type: 'heatmap',
    coordinateSystem: 'calendar',
    calendarIndex: index,
    itemStyle: emptyStyle,
    emphasis: {
      focus: 'none',
      itemStyle: { ...emptyStyle, shadowBlur: 0, shadowColor: 'transparent' },
    },
    data: grid.days
      .filter((day) => day.band === index && !day.cell)
      .map((day) => [day.date, 0]),
  }))

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
