import {
  formatAxisValue,
  formatLabel,
  formatTimeAxisLabel,
  formatValue,
  inferTimeGrain,
  isTemporal,
  truncateMiddleToWidth,
  type TimeGrain,
} from './format'
import { paletteColors, pickSeriesColor, type ChartTheme } from './theme'
import { mergeDeep } from './utils'
import type {
  AxisChartBaseConfig,
  AxisChartSeriesConfig,
  ChartPaletteName,
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

const DEFAULT_PALETTE: ChartPaletteName = 'sequential'

/** Series colors, keyed by name so a hidden series never shifts its neighbours. */
export function resolveSeriesColors(
  config: AxisChartBaseConfig,
  theme: ChartTheme,
): Record<string, string> {
  const assigned = seriesPaletteColors(config, theme)
  const colors: Record<string, string> = {}
  config.series.forEach((series, index) => {
    colors[series.name] = series.color || assigned[index]
  })
  return colors
}

function seriesPaletteColors(config: AxisChartBaseConfig, theme: ChartTheme) {
  const count = config.series.length
  const explicit = Array.isArray(config.palette) ? config.palette : undefined

  if (explicit?.length) {
    return Array.from({ length: count }, (_, i) => pickSeriesColor(explicit, i))
  }

  const name =
    typeof config.palette === 'string' ? config.palette : DEFAULT_PALETTE
  return paletteColors(name, theme, count)
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

export function visibleSeries<T extends AxisChartSeriesConfig>(
  series: T[],
  hiddenSeries: string[],
): T[] {
  return series.filter((s) => !hiddenSeries.includes(s.name))
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
    textStyle: { fontFamily: 'InterVar, Inter, sans-serif' },
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
 */
// `containLabel` reserves label room from an estimate, not the final layout —
// an exact-fit grid clips the widest value label by a few px (the leading "$"
// of "$250k"). v1 shipped the same stack for years behind a 1–2.5% cushion;
// this is that cushion, in px so it does not grow with the plot.
const EDGE_PAD = 4

export function buildAxisGrid(
  config: AxisChartBaseConfig,
  opts: { horizontal: boolean; isRTL: boolean; labelGutter: number },
) {
  const { horizontal, isRTL, labelGutter } = opts
  const endGutter = horizontal ? labelGutter : 0

  return {
    top: 8 + (horizontal ? 0 : labelGutter),
    bottom: 0,
    left: EDGE_PAD + (isRTL ? endGutter : 0),
    right:
      (config.xAxis.title && horizontal ? 24 : EDGE_PAD) +
      (isRTL ? 0 : endGutter),
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
    /** Plot width in pixels, when known. Caps the label column of a row chart. */
    width?: number
  },
) {
  const { categories, horizontal, isRTL, boundaryGap } = opts
  const { type, timeGrain } = resolveXAxis(config)
  // Only a row chart's labels stand in the way of the marks. A column chart's
  // sit under the plot, where echarts already rotates and thins them out.
  const labelWidth =
    horizontal && type === 'category'
      ? categoryLabelWidth(opts.width)
      : undefined

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
  const primary = buildValueAxis(config, theme, opts)
  if (!hasSecondaryValueAxis(config, opts.horizontal)) return primary
  return [primary, buildValueAxis(config, theme, { ...opts, axis: 'y2' })]
}

export function buildValueAxis(
  config: AxisChartBaseConfig,
  theme: ChartTheme,
  opts: { horizontal: boolean; isRTL: boolean; axis?: 'y' | 'y2' },
) {
  const { horizontal, isRTL } = opts
  const secondary = opts.axis === 'y2'
  const axisConfig = secondary ? config.y2Axis : config.yAxis

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
