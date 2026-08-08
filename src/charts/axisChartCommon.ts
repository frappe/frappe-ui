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
import { chartColors, type ChartTheme } from './theme'
import { mergeDeep } from './utils'
import type {
  AxisChartBaseConfig,
  AxisChartSeriesConfig,
  ChartPaletteName,
  ChartYAxisConfig,
} from './types'

export type AxisChartOptionContext = {
  theme: ChartTheme
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
 * How far past its tick a tilted label may reach. It is one number for two
 * budgets, because at 45° a label reaches exactly as far below its tick as it
 * does to the side: the plot keeps its height (the grid reserves this much for
 * the labels) and the leading label stays inside the canvas.
 */
const TILTED_LABEL_EXTENT = 72
/** A label's own line box, which turns into reach of its own once rotated. */
const LABEL_LINE_HEIGHT = 13
/**
 * What one value axis takes out of the chart before the categories divide up
 * what is left: a compact tick — `1.2M`, `450` — and its `axisLabel.margin`.
 * The ticks are echarts' to pick, so this is an estimate, and it rounds up:
 * reading the plot wider than it is would leave labels flat that do not fit,
 * which is the failure the measuring is here to prevent.
 */
const VALUE_AXIS_RESERVE = 44

const DEFAULT_PALETTE: ChartPaletteName = 'sequential'

/** Series colors, keyed by name so a hidden series never shifts its neighbours. */
export function resolveSeriesColors(
  config: AxisChartBaseConfig,
  theme: ChartTheme,
): Record<string, string> {
  const assigned = chartColors(config.palette, theme, {
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
  type: 'category' | 'time'
  timeGrain?: TimeGrain
}

/**
 * What the x axis actually is, config and data taken together. A category axis
 * spaces its values evenly, which draws a gap-free month out of a series that
 * skips March — so an unset `type` picks `'time'` for a column of dates.
 */
export function resolveXAxis(config: AxisChartBaseConfig): ResolvedXAxis {
  const values = (config.data ?? []).map((row) => row[config.xAxis.key])
  const type = config.xAxis.type ?? (isTemporal(values) ? 'time' : 'category')
  if (type !== 'time') return { type }
  return { type, timeGrain: config.xAxis.timeGrain ?? inferTimeGrain(values) }
}

/** Option keys that hold for any cartesian chart, whatever it draws. */
export function axisChartBase(
  theme: ChartTheme,
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
              lineStyle: { color: theme.axisLine, width: 1 },
            }),
      },
    },
  }
}

/**
 * Chrome (title, legend, tooltip body) is Vue-rendered HTML around the plot, so
 * the grid only reserves room for its own axis labels. `containLabel` covers
 * those but not data labels, which sit past the end of a mark and would
 * otherwise be clipped by the plot edge — hence `labelGutter`.
 *
 * `containLabel` measures a label as the box its rotation gives it, so a tilted
 * category axis (see `categoryLabelFit`) takes its own height out of the plot
 * without the grid saying anything. What keeps that from eating the plot is the
 * cap on the label, not a number here.
 */
// `containLabel` reserves against a DOM measurement of the same text in the
// same font the plot renders it in (see measureText.ts), so the reservation is
// the truth. What is left is rounding: echarts drops fractions at several
// layout steps, and the widest label loses a px or two of glyph edge in rare
// cases — this covers that, nothing more.
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
    containLabel: true,
  }
}

export function buildCategoryAxis(
  config: AxisChartBaseConfig,
  theme: ChartTheme,
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
  const { type, timeGrain } = resolveXAxis(config)
  const { rotate, labelWidth } = categoryLabelFit(config, { ...opts, type })

  const axis = {
    type,
    // RTL reads right-to-left along the horizontal axis; the vertical axis of a
    // horizontal bar chart is inverted so the first category sits on top.
    inverse: horizontal ? true : isRTL,
    position: horizontal ? (isRTL ? 'right' : 'left') : 'bottom',
    ...(type === 'category' ? { data: categories, boundaryGap } : {}),
    name: config.xAxis.title ? formatLabel(config.xAxis.title) : undefined,
    nameLocation: 'end',
    nameGap: 8,
    nameTextStyle: { color: theme.axisTitle, fontSize: AXIS_LABEL_FONT_SIZE },
    splitLine: { show: false },
    // The baseline gets the same dotted hairline as the gridlines: it reads as
    // the zero line of that grid rather than as a frame around the plot.
    axisLine: {
      show: true,
      lineStyle: { color: theme.splitLine, ...DOTTED_LINE },
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
      margin: 8,
      color: theme.axisLabel,
      fontSize: AXIS_LABEL_FONT_SIZE,
      // The formatter does the shortening (echarts only ellipsises the end),
      // but the cap still has to be declared: it is what `containLabel`
      // reserves against, and it catches a label the estimate underread.
      ...(labelWidth ? { width: labelWidth, overflow: 'truncate' } : {}),
      // Left out entirely when the labels fit, so a flat axis carries no
      // rotation key at all.
      ...(rotate ? { rotate } : {}),
      ...(type === 'time'
        ? {
            // echarts hands a time axis' formatter the tick's level, which is
            // what lets the year that opens a run of months read as its header
            // rather than as another tick. `primary` is echarts' own name for
            // that level's rich style.
            formatter: (
              value: any,
              _index: number,
              extra?: { level: number },
            ) => formatTimeAxisLabel(value, timeGrain, extra?.level),
            rich: {
              primary: {
                color: theme.axisTitle,
                fontSize: AXIS_LABEL_FONT_SIZE,
                fontWeight: 600,
              },
            },
          }
        : {
            formatter: (value: any) =>
              categoryLabel(formatAxisValue(value, type), labelWidth),
          }),
    },
  }

  return mergeDeep(axis, config.xAxis.echartOptions)
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
    type: 'category' | 'time'
  },
): CategoryLabelFit {
  const { type, horizontal, isRTL, width } = opts

  // A time axis picks its own ticks — it drops to a coarser interval rather
  // than crowd them — and its levelled labels, a bold year heading a run of
  // months, only read as a heading while they sit flat.
  if (type !== 'category') return { rotate: 0 }

  // A row chart's categories are already stacked one per line down the side,
  // so there is nothing for a tilt to buy. They stand in the way of the marks
  // instead, which is what the column cap is for.
  if (horizontal) return { rotate: 0, labelWidth: categoryLabelWidth(width) }

  const slot = categorySlotWidth(config, opts)
  if (!slot || fitsFlat(opts.categories, drawnLabel(config, type), slot))
    return { rotate: 0 }

  const flat = Math.floor(slot - CATEGORY_LABEL_GAP)
  const tilted = tiltedLabelWidth(slot)
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

  const valueAxes = hasSecondaryValueAxis(config) ? 2 : 1
  const plot = opts.width - 2 * EDGE_PAD - valueAxes * VALUE_AXIS_RESERVE
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
 * How much text a tilted label may carry: whichever is smaller of the standing
 * budget and the room beside the leading tick, which is its half slot plus the
 * column the value axis holds open. Both bound the same diagonal, so one
 * division converts either of them into a width.
 */
function tiltedLabelWidth(slot: number) {
  const reach = Math.min(
    TILTED_LABEL_EXTENT,
    EDGE_PAD + VALUE_AXIS_RESERVE + slot / 2,
  )
  return Math.floor((reach - LABEL_LINE_HEIGHT * TILT_SIN) / TILT_SIN)
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
  theme: ChartTheme,
  opts: { horizontal: boolean; isRTL: boolean },
) {
  const primary = buildValueAxis(config.yAxis, theme, opts)
  if (!hasSecondaryValueAxis(config, opts.horizontal)) return primary
  return [
    primary,
    buildValueAxis(config.y2Axis, theme, { ...opts, secondary: true }),
  ]
}

/**
 * One value axis, from the axis config that describes it. It takes that config
 * rather than the chart's, so a plot with two value scales and no category axis
 * — the scatter — builds each of them the same way an axis chart builds its y.
 */
export function buildValueAxis(
  axisConfig: ChartYAxisConfig | undefined,
  theme: ChartTheme,
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
      lineStyle: { color: theme.splitLine, ...DOTTED_LINE },
    },
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: {
      show: true,
      hideOverlap: true,
      // A value axis is read by its extremes, so the top (or right-hand) end of
      // the scale keeps its label even in a short plot.
      showMaxLabel: true,
      margin: 8,
      color: theme.axisLabel,
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
