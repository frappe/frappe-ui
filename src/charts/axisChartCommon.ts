import {
  estimateTextWidth,
  formatAxisValue,
  formatLabel,
  formatTimeAxisLabel,
  formatValue,
  inferTimeGrain,
  isTemporal,
  truncateMiddleToWidth,
  type TimeGrain,
} from './format'
import { CHART_FONT_FAMILY } from './measureText'
import { chartColors, type ChartTokens } from './tokens'
import { mergeDeep } from './utils'
import type {
  AxisChartBaseConfig,
  AxisChartSeriesConfig,
  ChartPaletteName,
  ChartYAxisConfig,
} from './types'

export type AxisChartOptionContext = {
  tokens: ChartTokens
  /** Series names the legend has switched off. Dropped from the option. */
  hiddenSeries?: string[]
  /** Plot width in pixels, once measured. Unset leaves pixel sizes to echarts. */
  width?: number
}

export const AXIS_LABEL_FONT_SIZE = 11
export const DATA_LABEL_FONT_SIZE = 11
/** How far the other series drop back while one is hovered in the legend. */
export const BLUR_OPACITY = 0.75

/**
 * Gridlines and the category baseline are drawn as fine dots rather than rules:
 * they should locate a value without competing with the marks in front of them.
 * A short dash with a round cap gives round dots at any device pixel ratio.
 */
export const DOTTED_LINE = { type: [1, 3], cap: 'round', width: 1 }

/**
 * Most of a horizontal chart that its category labels may claim. `containLabel`
 * reserves whatever the longest label needs, so without a cap one long name
 * pushes the plot over and leaves the bars a sliver.
 */
const CATEGORY_LABEL_WIDTH_RATIO = 0.32
/** Below this the column says nothing at all, so a narrow chart overruns the ratio. */
const MIN_CATEGORY_LABEL_WIDTH = 56

/** The angle a category axis turns to when its labels stop fitting flat. */
const TILT_ANGLE = 45
const TILT_SIN = Math.sin((TILT_ANGLE * Math.PI) / 180)
/** Clear air either side of a flat label, under which two of them read as one. */
const CATEGORY_LABEL_GAP = 8
/**
 * How far below its tick a tilted label may reach, which is how much plot height
 * the axis is allowed to spend on saying more.
 */
const TILTED_LABEL_EXTENT = 72
/** A label's own line box, which turns into reach of its own once rotated. */
const LABEL_LINE_HEIGHT = 13
/** The gap every axis here keeps between a label and the plot. */
export const AXIS_LABEL_MARGIN = 8

const DEFAULT_PALETTE: ChartPaletteName = 'sequential'

/** Series colors, keyed by name so a hidden series never shifts its neighbours. */
export function resolveSeriesColors(
  config: AxisChartBaseConfig,
  tokens: ChartTokens,
): Record<string, string> {
  const assigned = chartColors(config.palette, tokens, {
    fallback: DEFAULT_PALETTE,
    count: config.series.length,
  })
  const colors: Record<string, string> = {}
  config.series.forEach((series, index) => {
    colors[series.name] = series.color || assigned[index]
  })
  return colors
}

export type ResolvedXAxis = {
  type: 'category' | 'time' | 'value'
  timeGrain?: TimeGrain
}

/**
 * What the x axis actually is, config and data taken together. A category axis
 * spaces its values evenly, which draws a gap-free month out of a series that
 * skips March — so an unset `type` picks `'time'` for a column of dates.
 *
 * `'value'` is only ever asked for. A column of numbers is as often a list of
 * categories — quarters, store numbers, shirt sizes — as it is a quantity, so
 * inferring the scale would re-space charts nobody touched.
 */
export function resolveXAxis(
  config: AxisChartBaseConfig,
  horizontal = false,
): ResolvedXAxis {
  const values = (config.data ?? []).map((row) => row[config.xAxis.key])
  const asked = config.xAxis.type
  // `horizontal` runs the value axis across the plot and gives the x column the
  // vertical one, where a bar is sized from the slot it stands in. A numeric
  // scale has no slots to hand out, so the ask is dropped rather than half
  // drawn; the option build says so out loud.
  const type =
    asked === 'value' && horizontal
      ? 'category'
      : (asked ?? (isTemporal(values) ? 'time' : 'category'))
  if (type !== 'time') return { type }
  return { type, timeGrain: config.xAxis.timeGrain ?? inferTimeGrain(values) }
}

/**
 * The rows in the order the plot draws them, and only the rows it can place.
 *
 * A value axis puts a point at its own x number instead of in its row's slot,
 * so rows arriving out of order would draw a line that doubles back on itself,
 * and a row whose x is not a number has nowhere on the scale to sit. Every
 * other axis draws the rows as they arrive: that order is the caller's reading
 * of the data, not something to correct.
 *
 * Everything that counts datapoints — the tooltip, the click event, the stack
 * shares — indexes into these rather than into `config.data`, so the row a
 * reader points at is the row the option drew there.
 */
export function plotRows(
  config: AxisChartBaseConfig,
  type: ResolvedXAxis['type'],
  /** `quiet` for a second read of the same config; see `plotSeries`. */
  quiet = false,
): Record<string, any>[] {
  const rows = config.data ?? []
  if (type !== 'value') return rows

  const placed: { row: Record<string, any>; x: number }[] = []
  for (const row of rows) {
    const x = toNumber(row[config.xAxis.key])
    if (x !== null) placed.push({ row, x })
  }

  const dropped = rows.length - placed.length
  if (dropped && !quiet) {
    warn(
      `Dropped ${dropped} ${dropped === 1 ? 'row' : 'rows'}: \`xAxis.type: "value"\` reads "${config.xAxis.key}" as a quantity, and a point with no number for it has nowhere on the scale to sit.`,
    )
  }

  return placed.sort((a, b) => a.x - b.x).map((entry) => entry.row)
}

/** Option keys that hold for any cartesian chart, whatever it draws. */
export function axisChartBase(
  tokens: ChartTokens,
  axisPointer: 'shadow' | 'line',
) {
  return {
    animation: true,
    animationDuration: 500,
    animationDurationUpdate: 300,
    textStyle: { fontFamily: CHART_FONT_FAMILY },
    // echarts' own tooltip stays on for the axis pointer only; the visible
    // tooltip is a Vue component (see ChartTooltip).
    tooltip: {
      trigger: 'axis',
      showContent: false,
      axisPointer: {
        // echarts floats the pointer at z 50, over every series. It is a
        // reading aid, not a mark: below the series (z 2) the dots and bars it
        // points at stay whole.
        z: 1,
        ...(axisPointer === 'shadow'
          ? { type: 'shadow' }
          : {
              type: 'line',
              lineStyle: { color: tokens.axisLine, width: 1 },
            }),
      },
    },
  }
}

/**
 * Chrome (title, legend, tooltip body) is Vue-rendered HTML around the plot, so
 * the grid only reserves room for its own axis labels and names. echarts does
 * that reservation itself: it measures the labels it has already laid out and
 * shrinks the plot until they fit the outer bounds. What it does not cover is
 * data labels, which sit past the end of a mark and would otherwise be clipped
 * by the plot edge — hence `labelGutter`.
 *
 * A label is measured as the box its rotation gives it, so a tilted category
 * axis (see `categoryLabelFit`) takes its own height out of the plot without the
 * grid saying anything. What keeps that from eating the plot is the cap on the
 * label, not a number here.
 */
// The air between the outermost label and the edge of the canvas. The bounds are
// this rect rather than the canvas, so the pad is held open: echarts shrinks the
// plot to keep the labels inside it and never spends the two pixels.
const EDGE_PAD = 2

export function buildAxisGrid(opts: {
  horizontal: boolean
  isRTL: boolean
  labelGutter: number
  /** Title on the category axis, which only a horizontal chart draws inline. */
  xAxisTitle?: string
}) {
  const { horizontal, isRTL, labelGutter, xAxisTitle } = opts
  const endGutter = horizontal ? labelGutter : 0

  return {
    top: 8 + (horizontal ? 0 : labelGutter),
    bottom: 0,
    left: EDGE_PAD + (isRTL ? endGutter : 0),
    right: (xAxisTitle && horizontal ? 24 : EDGE_PAD) + (isRTL ? 0 : endGutter),
    // What `containLabel` did until echarts 6, plus the two things it never did:
    // it reserves on both dimensions, so the label at either end of a horizontal
    // axis stops overhanging the canvas, and `all` covers the axis name as well
    // as the labels. `same` reads the bounds off the rect above.
    outerBoundsMode: 'same',
    outerBoundsContain: 'all',
  }
}

/**
 * The axis the x column is drawn against, whichever of the three readings it
 * carries. One builder rather than one per type: they differ in how a tick
 * prints and in whether the values are a list or a scale, and nowhere else.
 */
export function buildXAxis(
  config: AxisChartBaseConfig,
  tokens: ChartTokens,
  opts: {
    categories: any[]
    horizontal: boolean
    isRTL: boolean
    /** Bars need a half-slot inset at each end; a line runs edge to edge. */
    boundaryGap: boolean
    /** Plot width in pixels, when known. Decides how the labels are laid out. */
    width?: number
  },
) {
  const { categories, horizontal, isRTL, boundaryGap } = opts
  const { type, timeGrain } = resolveXAxis(config, horizontal)
  const { rotate, labelWidth } = categoryLabelFit(config, { ...opts, type })

  const axis = {
    type,
    // A quantity read along the plot is a position, not a magnitude: there is
    // no baseline to anchor to, so the scale follows the data the way both of
    // a scatter's do.
    ...(type === 'value' ? { scale: true } : {}),
    // RTL reads right-to-left along the horizontal axis; the vertical axis of a
    // horizontal bar chart is inverted so the first category sits on top.
    inverse: horizontal ? true : isRTL,
    position: horizontal ? (isRTL ? 'right' : 'left') : 'bottom',
    ...(type === 'category' ? { data: categories, boundaryGap } : {}),
    name: config.xAxis.title ? formatLabel(config.xAxis.title) : undefined,
    nameLocation: 'end',
    nameGap: 8,
    nameTextStyle: { color: tokens.axisTitle, fontSize: AXIS_LABEL_FONT_SIZE },
    splitLine: { show: false },
    // The baseline gets the same dotted hairline as the gridlines: it reads as
    // the zero line of that grid rather than as a frame around the plot.
    axisLine: {
      show: true,
      lineStyle: { color: tokens.splitLine, ...DOTTED_LINE },
    },
    axisTick: { show: false },
    axisLabel: {
      show: true,
      // Labels thin themselves out as the plot narrows: echarts' own interval
      // picks every nth category, `hideOverlap` catches whatever still collides.
      hideOverlap: true,
      // The thinning counts from the first category, so the last one usually
      // goes unlabelled — which reads as a clipped axis. Pinning it drops its
      // neighbour instead. Not for time axes: their end is a round tick, not a
      // datapoint, so labelling it says nothing about where the series stops.
      ...(type === 'category' ? { showMaxLabel: true } : {}),
      margin: AXIS_LABEL_MARGIN,
      color: tokens.axisLabel,
      fontSize: AXIS_LABEL_FONT_SIZE,
      // The formatter does the shortening (echarts only ellipsises the end),
      // but the cap still has to be declared: it is what `containLabel`
      // reserves against, and it catches a label the estimate underread.
      ...(labelWidth ? { width: labelWidth, overflow: 'truncate' } : {}),
      // Left out entirely when the labels fit, so a flat axis carries no
      // rotation key at all.
      ...(rotate ? { rotate } : {}),
      ...xAxisLabelFormat(type, { tokens, timeGrain, labelWidth }),
    },
  }

  return mergeDeep(axis, config.xAxis.echartOptions)
}

/**
 * How a tick prints, which is most of what the three readings disagree about.
 * A value axis prints the compact tick the value axis on the other side of the
 * plot prints: both are numbers on a scale, and one chart should not round the
 * same magnitude two ways.
 */
function xAxisLabelFormat(
  type: ResolvedXAxis['type'],
  opts: { tokens: ChartTokens; timeGrain?: TimeGrain; labelWidth?: number },
) {
  if (type === 'time') {
    return {
      // echarts hands a time axis' formatter the tick's level, which is what
      // lets the year that opens a run of months read as its header rather
      // than as another tick. `primary` is echarts' own name for that level's
      // rich style.
      formatter: (value: any, _index: number, extra?: { level: number }) =>
        formatTimeAxisLabel(value, opts.timeGrain, extra?.level),
      rich: {
        primary: {
          color: opts.tokens.axisTitle,
          fontSize: AXIS_LABEL_FONT_SIZE,
          fontWeight: 600,
        },
      },
    }
  }

  if (type === 'value') {
    return { formatter: (value: number) => formatValue(value, 1, true) }
  }

  return {
    formatter: (value: any) =>
      categoryLabel(formatAxisValue(value, type), opts.labelWidth),
  }
}

type CategoryLabelFit = {
  /** Degrees the labels are turned by. 0 leaves them flat. */
  rotate: number
  /** What a label is shortened to, when anything caps it. */
  labelWidth?: number
}

/**
 * How the category labels are laid out. Legibility is the library's job, so
 * there is no angle prop: the labels are measured against the room they have
 * and the axis decides for itself.
 *
 * One rule decides it — show as much of a label as the space allows. Labels
 * that fit their slot are left alone. Once one does not, the axis takes
 * whichever layout carries more text: flat and shortened to the slot, or
 * tilted, which trades the slot for the depth below the axis. Wide slots keep
 * flat labels, because reading across beats reading up a diagonal; crowded ones
 * tilt, where a flat label would be down to a syllable. Whatever still collides
 * after that is thinned out by `hideOverlap`, as it always was.
 *
 * The whole axis takes one layout. Labels leaning two ways read as two axes.
 */
function categoryLabelFit(
  config: AxisChartBaseConfig,
  opts: {
    categories: any[]
    horizontal: boolean
    isRTL: boolean
    boundaryGap: boolean
    width?: number
    type: ResolvedXAxis['type']
  },
): CategoryLabelFit {
  const { type, horizontal, isRTL, width } = opts

  // Only a category axis draws a label per row, which is the crowding this
  // measures. A time or value axis picks its own ticks — it drops to a coarser
  // interval rather than crowd them — and both print something short: a round
  // number, or a levelled date whose bold year only heads a run of months
  // while it sits flat.
  if (type !== 'category') return { rotate: 0 }

  // A row chart's categories are already stacked one per line down the side,
  // so there is nothing for a tilt to buy. They stand in the way of the marks
  // instead, which is what the column cap is for.
  if (horizontal) return { rotate: 0, labelWidth: categoryLabelWidth(width) }

  const slot = categorySlotWidth(config, opts)
  if (!slot || fitsFlat(opts.categories, drawnLabel(config, type), slot))
    return { rotate: 0 }

  const flat = Math.floor(slot - CATEGORY_LABEL_GAP)
  const tilted = tiltedLabelWidth()
  if (flat >= tilted) return { rotate: 0, labelWidth: flat }

  return {
    // The tilt leans towards the value axis. Its column of ticks is width the
    // grid holds open, and nothing occupies it below the plot — which is
    // exactly where a tilted label reaches. RTL puts that column on the other
    // side, so the labels lean the other way.
    rotate: isRTL ? -TILT_ANGLE : TILT_ANGLE,
    labelWidth: tilted,
  }
}

/**
 * The room one category gets along the axis, or undefined where there is
 * nothing to decide from: a chart that has not been measured, one measured at
 * nothing, or a line with a single point, which has no neighbour to collide
 * with.
 */
function categorySlotWidth(
  config: AxisChartBaseConfig,
  opts: { categories: any[]; boundaryGap: boolean; width?: number },
) {
  if (!opts.width) return undefined

  const plot = opts.width - 2 * EDGE_PAD - valueAxisReserve(config)
  // `boundaryGap` gives every category a slot of its own to sit in the middle
  // of; without it they sit on the dividers, so what has to hold a label is
  // the distance between two ticks.
  const slots = opts.boundaryGap
    ? opts.categories.length
    : opts.categories.length - 1

  if (plot <= 0 || slots < 1) return undefined
  return plot / slots
}

/**
 * The text a tick actually draws. An axis `format` reaches echarts as an
 * `axisLabel.formatter` (see `applyAxisFormatters`) and wins over the one built
 * here, so it is what decides the width: measuring the raw value instead would
 * tilt an axis whose labels the caller had already shortened.
 */
function drawnLabel(config: AxisChartBaseConfig, type: 'category') {
  const formatter = config.xAxis.echartOptions?.axisLabel?.formatter
  if (typeof formatter !== 'function') {
    return (value: any) => formatAxisValue(value, type)
  }
  return (value: any, index: number) => String(formatter(value, index) ?? '')
}

/** Whether every label draws inside its own slot with clear air either side. */
function fitsFlat(
  categories: any[],
  label: (value: any, index: number) => string,
  slot: number,
) {
  return categories.every(
    (value, index) =>
      estimateTextWidth(label(value, index), AXIS_LABEL_FONT_SIZE) +
        CATEGORY_LABEL_GAP <=
      slot,
  )
}

/**
 * How much text a tilted label may carry: the standing budget, turned into a
 * width along the diagonal it runs on.
 *
 * A second bound used to shorten it on a crowded axis — the room beside the
 * leading tick, so that one label would not overhang the canvas. echarts holds
 * that room open itself now (see `buildAxisGrid`), and length is all a tilted
 * label costs: two of them run parallel, so a long one reaches further down
 * rather than into its neighbour. Crowding no longer decides what a tilt can
 * say, which is why this takes no slot.
 */
function tiltedLabelWidth() {
  return Math.floor(
    (TILTED_LABEL_EXTENT - LABEL_LINE_HEIGHT * TILT_SIN) / TILT_SIN,
  )
}

/**
 * What the value axes take out of the width before the categories divide up
 * what is left: the widest tick each of them prints, and its margin.
 *
 * The ticks are echarts' to pick, so this prints the ends of the scale the way
 * the axis will and measures those. `formatValue` compresses a magnitude to a
 * few characters — `1.2M`, `450` — so a round tick between two ends is no wider
 * than the wider end. What is left is a layout decision and nothing more:
 * echarts reserves the room the labels actually need, so a few pixels out here
 * costs a tilt that could have stayed flat, never a clipped label.
 */
function valueAxisReserve(config: AxisChartBaseConfig): number {
  if (!hasSecondaryValueAxis(config))
    return tickColumnWidth(config, config.series, config.yAxis)

  const onY2 = (series: AxisChartSeriesConfig) => series.axis === 'y2'
  return (
    tickColumnWidth(config, config.series.filter((s) => !onY2(s)), config.yAxis) +
    tickColumnWidth(config, config.series.filter(onY2), config.y2Axis)
  )
}

/** The widest tick one value axis prints, from what it is asked to plot. */
function tickColumnWidth(
  config: AxisChartBaseConfig,
  series: AxisChartSeriesConfig[],
  axisConfig: ChartYAxisConfig | undefined,
): number {
  let low = Infinity
  let high = -Infinity
  for (const row of config.data ?? []) {
    for (const one of series) {
      const value = toNumber(row[one.name])
      if (value === null) continue
      if (value < low) low = value
      if (value > high) high = value
    }
  }

  // An axis told where to start or stop prints ticks between those, whatever the
  // rows hold. An axis with nothing numeric to plot still draws, and prints 0.
  const ends = [
    axisConfig?.min ?? (low === Infinity ? 0 : low),
    axisConfig?.max ?? (high === -Infinity ? 0 : high),
  ]
  const tick = drawnTick(axisConfig)
  const widest = Math.max(
    ...ends.map((value) => estimateTextWidth(tick(value), AXIS_LABEL_FONT_SIZE)),
  )
  return Math.ceil(widest) + AXIS_LABEL_MARGIN
}

/**
 * The text a value-axis tick actually prints. An axis `format` reaches echarts as
 * an `axisLabel.formatter` (see `applyAxisFormatters`) and wins over the compact
 * number the axis would print itself, so it is what the column has to be read
 * from: a currency that spells out `₹ 1,234,567.00` holds open several times the
 * width of `1.2M`, and the categories only get what is left. Same rule as
 * `drawnLabel` on the other axis.
 */
function drawnTick(axisConfig: ChartYAxisConfig | undefined) {
  const formatter = axisConfig?.echartOptions?.axisLabel?.formatter
  if (typeof formatter !== 'function') {
    return (value: number) => formatValue(value, 1, true)
  }
  return (value: number) => String(formatter(value) ?? '')
}

function categoryLabelWidth(width?: number) {
  if (!width) return undefined
  return Math.max(
    MIN_CATEGORY_LABEL_WIDTH,
    Math.round(width * CATEGORY_LABEL_WIDTH_RATIO),
  )
}

function categoryLabel(label: string, labelWidth?: number) {
  if (!labelWidth) return label
  return truncateMiddleToWidth(label, labelWidth, AXIS_LABEL_FONT_SIZE)
}

/**
 * Whether the chart actually draws a second value axis. Read over *every*
 * series rather than the visible ones: switching the last y2 series off in the
 * legend should not pull an axis out from under the plot and reflow it.
 */
export function hasSecondaryValueAxis(
  config: AxisChartBaseConfig,
  horizontal = false,
): boolean {
  if (horizontal) return false
  return config.series.some((series) => series.axis === 'y2')
}

/** Which entry of the value-axis array a series is plotted against. */
export function valueAxisIndex(
  series: AxisChartSeriesConfig,
  hasSecondary: boolean,
): number {
  return hasSecondary && series.axis === 'y2' ? 1 : 0
}

/** The value axis, or both of them when a series sits on `y2`. */
export function buildValueAxes(
  config: AxisChartBaseConfig,
  tokens: ChartTokens,
  opts: { horizontal: boolean; isRTL: boolean },
) {
  const primary = buildValueAxis(config.yAxis, tokens, opts)
  if (!hasSecondaryValueAxis(config, opts.horizontal)) return primary
  return [
    primary,
    buildValueAxis(config.y2Axis, tokens, { ...opts, secondary: true }),
  ]
}

/**
 * One value axis, from the axis config that describes it. It takes that config
 * rather than the chart's, so a plot with two value scales and no category axis
 * — the scatter — builds each of them the same way an axis chart builds its y.
 */
export function buildValueAxis(
  axisConfig: ChartYAxisConfig | undefined,
  tokens: ChartTokens,
  opts: {
    horizontal: boolean
    isRTL: boolean
    /** Drawn opposite the primary, and aligned to its ticks. */
    secondary?: boolean
  },
) {
  const { horizontal, isRTL } = opts
  const secondary = Boolean(opts.secondary)

  const axis = {
    type: 'value',
    inverse: horizontal ? isRTL : false,
    position: valueAxisPosition(horizontal, isRTL, secondary),
    // Both scales are picked so their ticks land on the same rows. Without it
    // the two sets of gridlines interleave and the plot reads as a mesh.
    alignTicks: secondary,
    // The value-axis title is chrome, not a mark: it is drawn as HTML above the
    // plot (see ChartContainer's `plotLabel`) so it lines up with the chart
    // title whichever way the bars run.
    min: axisConfig?.min,
    max: axisConfig?.max,
    // Gridlines carry the reading of the plot; the axis line itself is noise.
    // Only the primary draws them: with aligned ticks the second set lands on
    // the same rows, so it adds nothing but a doubled line.
    splitLine: {
      show: !secondary,
      lineStyle: { color: tokens.splitLine, ...DOTTED_LINE },
    },
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: {
      show: true,
      hideOverlap: true,
      // A value axis is read by its extremes, so the top (or right-hand) end of
      // the scale keeps its label even in a short plot.
      showMaxLabel: true,
      margin: AXIS_LABEL_MARGIN,
      color: tokens.axisLabel,
      fontSize: AXIS_LABEL_FONT_SIZE,
      formatter: (value: number) => formatValue(value, 1, true),
    },
  }

  return mergeDeep(axis, axisConfig?.echartOptions)
}

/** The secondary axis takes the edge the primary left free. */
function valueAxisPosition(
  horizontal: boolean,
  isRTL: boolean,
  secondary: boolean,
) {
  if (horizontal) return 'bottom'
  if (isRTL) return secondary ? 'left' : 'right'
  return secondary ? 'right' : 'left'
}

export function toNumber(value: any): number | null {
  if (value === null || value === undefined || value === '') return null
  const parsed = Number(value)
  return isNaN(parsed) ? null : parsed
}

function warn(message: string) {
  if (import.meta.env.DEV) console.warn(`[frappe-ui] ${message}`)
}
