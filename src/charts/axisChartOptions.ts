import type { EChartsCoreOption } from 'echarts/core'
import { formatPercent, formatValue } from './format'
import { insideLabelColor, type ChartTokens } from './tokens'
import {
  axisChartBase,
  buildAxisGrid,
  buildValueAxes,
  buildXAxis,
  hasSecondaryValueAxis,
  plotRows,
  resolveSeriesColors,
  resolveXAxis,
  toNumber,
  valueAxisIndex,
  BLUR_OPACITY,
  DATA_LABEL_FONT_SIZE,
  type AxisChartOptionContext,
} from './axisChartCommon'
import { buildReferenceLineSeries } from './referenceLines'
import { mergeDeep } from './utils'
import type {
  AxisChartConfig,
  AxisChartSeriesConfig,
  ChartMark,
  ChartYAxisConfig,
} from './types'

const BAR_MAX_WIDTH = 32
/** Slim bars with an airy gap between categories. */
const BAR_CATEGORY_GAP = '38%'
const BAR_RADIUS = 4
/** Room for a data label sitting past the end of a bar. */
const BAR_LABEL_GUTTER = 40
/** Room for a data label sitting above a point. */
const LINE_LABEL_GUTTER = 24

const DEFAULT_LINE_WIDTH = 2
/** Big enough to hit with a pointer, small enough not to read as a scatter plot. */
const SYMBOL_SIZE = 6

/** A wash that shows the trend without swallowing the gridlines behind it. */
export const DEFAULT_FILL_OPACITY = 0.16
/** Stacked bands are read as areas, not as lines, so they carry a solid fill. */
export const DEFAULT_STACKED_FILL_OPACITY = 0.75
/** Where the gradient lands by the time it reaches the axis. */
const GRADIENT_FADE = 0.1

const MARKS: ChartMark[] = ['bar', 'line', 'area']

/** The scale a 100% stack is read against, whatever the numbers behind it. */
const NORMALIZED_MIN = 0
const NORMALIZED_MAX = 100

/**
 * Marks paint in this order whatever order the series arrive in: a bar hides a
 * band, a band hides a line. Above the axis pointer at z 1, which is a reading
 * aid rather than a mark.
 */
const MARK_Z: Record<ChartMark, number> = { bar: 2, area: 3, line: 4 }

/** A series with the two things the config only implies: its mark and its stack. */
type PlottedSeries = {
  series: AxisChartSeriesConfig
  mark: ChartMark
  /** echarts `stack` key, or undefined for a series that stands on its own. */
  stack?: string
}

type SeriesContext = {
  tokens: ChartTokens
  rows: Record<string, any>[]
  horizontal: boolean
  isRTL: boolean
  color: string
  /** Entry of the value-axis array this series is measured against. */
  yAxisIndex: number
  /** Where a row sits along the x axis: its own number, or its category. */
  xValue: (row: Record<string, any>) => any
  /** Whether this bar ends its column, in the direction that row runs. */
  carriesTip: (entry: PlottedSeries, rowIndex: number, value: number) => boolean
  /** Whether this area stacks onto another, i.e. reads as a band. */
  banded: boolean
  /**
   * This series' share of its stack, row by row, on a normalized chart. Set
   * means the plot draws the share and prints it as a percentage; unset means
   * the series draws the numbers the data holds.
   */
  share: (number | null)[] | null
}

/**
 * Each series' share of its stack, row by row, keyed by series name. Empty for
 * a chart that is not normalized, and missing an entry for a series that has no
 * stack to take a share of.
 */
export type StackShares = Map<string, (number | null)[]>

/**
 * The one option path every cartesian chart takes. `config.type` is the mark a
 * series draws as unless it names its own, which is the only thing `BarChart`,
 * `LineChart` and `AreaChart` disagree about.
 */
export function buildAxisChartOption(
  config: AxisChartConfig,
  { tokens, hiddenSeries = [], width }: AxisChartOptionContext,
): EChartsCoreOption {
  const isRTL = config.dir === 'rtl'
  const horizontal = Boolean(config.horizontal)
  const { type: xAxisType } = resolveXAxis(config, horizontal)
  if (horizontal && config.xAxis.type === 'value') {
    warn(
      `\`horizontal\` gives the x column the vertical axis and runs the value axis across the plot, where a bar is sized from the slot it stands in. \`xAxis.type: "value"\` hands out no slots, so it is ignored and "${config.xAxis.key}" is drawn as categories.`,
    )
  }
  const rows = plotRows(config, xAxisType)
  const colors = resolveSeriesColors(config, tokens)

  const plotted = plotSeries(config)
  const visible = plotted.filter(
    (entry) => !hiddenSeries.includes(entry.series.name),
  )
  // Read over *every* series rather than the visible ones: hiding the last bar
  // in the legend should not re-space the category axis under the plot.
  const hasBars = plotted.some((entry) => entry.mark === 'bar')
  const categories = rows.map((row) => row[config.xAxis.key])
  // A point on a value axis carries its own coordinate; on the other two the
  // pair holds whatever the column does and echarts matches it to a slot.
  const xValue = (row: Record<string, any>) =>
    xAxisType === 'value'
      ? toNumber(row[config.xAxis.key])
      : row[config.xAxis.key]

  // Not the x axis of the option: `horizontal` moves the column it carries to
  // the vertical edge.
  const xColumnAxis = buildXAxis(config, tokens, {
    categories,
    horizontal,
    isRTL,
    // Bars need a half-slot inset at each end to sit in; a line runs edge to edge.
    boundaryGap: hasBars,
    width,
  })
  const hasSecondary = hasSecondaryValueAxis(config, horizontal)
  const shares = stackShares(config, visible, rows)
  const valueAxis = buildValueAxes(
    pinNormalizedAxes(config, visible, shares, hasSecondary),
    tokens,
    { horizontal, isRTL },
  )
  const carriesTip = tipResolver(visible, config, rows)

  const option = {
    // A bar has a width for the pointer to shade; a line has none, so a chart
    // without bars points its axis with a rule instead.
    ...axisChartBase(tokens, hasBars ? 'shadow' : 'line'),
    grid: buildAxisGrid({
      horizontal,
      isRTL,
      labelGutter: dataLabelGutter(plotted),
      xAxisTitle: config.xAxis.title,
    }),
    xAxis: horizontal ? valueAxis : xColumnAxis,
    yAxis: horizontal ? xColumnAxis : valueAxis,
    series: [
      ...visible.map((entry) =>
        buildSeries(entry, config, {
          tokens,
          rows,
          horizontal,
          isRTL,
          color: colors[entry.series.name],
          yAxisIndex: valueAxisIndex(entry.series, hasSecondary),
          xValue,
          carriesTip,
          banded: isBanded(entry, plotted),
          share: shares.get(entry.series.name) ?? null,
        }),
      ),
      // Appended after the plotted series, and read from `config.referenceLines`
      // rather than `config.series`: everything that lists the series — the
      // legend, `hiddenSeries`, the tooltip, the bar count above — walks the
      // latter, so a host series cannot reach any of them.
      ...buildReferenceLineSeries(config.referenceLines, {
        tokens,
        horizontal,
        hasSecondaryValueAxis: hasSecondary,
        // A numeric x axis has no categories, so `axis: 'x'` is a number on
        // that scale — the same line a scatter draws, down the same path.
        hasCategoryAxis: xAxisType !== 'value',
      }),
    ],
  }

  return mergeDeep(option, config.echartOptions)
}

/**
 * `quiet` for a second read of the same config: a series asking for a mark the
 * library cannot draw is reported by the option build, once, rather than again
 * by everything else that resolves the same marks.
 */
function plotSeries(config: AxisChartConfig, quiet = false): PlottedSeries[] {
  return config.series.map((series) => {
    const mark = resolveMark(series, config, quiet)
    return { series, mark, stack: stackKey(series, config, mark) }
  })
}

function resolveMark(
  series: AxisChartSeriesConfig,
  config: AxisChartConfig,
  quiet = false,
): ChartMark {
  // A saved config outlives the code that wrote it, so an unreadable mark is a
  // value to recover from rather than a reason to draw nothing.
  const asked = series.type ?? config.type
  if (!MARKS.includes(asked)) {
    if (!quiet)
      warn(
        `Series "${series.name}" asks for type "${asked}", which is not one of ${MARKS.join(', ')}. Drawing it as ${article(config.type)}.`,
      )
    return config.type
  }
  if (config.horizontal && asked !== 'bar') {
    if (!quiet)
      warn(
        `\`horizontal\` runs the value axis across the plot, which only bars are drawn against. Series "${series.name}" asked for ${article(asked)} and is drawn as a bar.`,
      )
    return 'bar'
  }
  return asked
}

/**
 * Which stack a series joins. Marks stack among their own: a line has no body
 * to stack, and a bar segment sitting on top of an area band reads as neither.
 */
function stackKey(
  series: AxisChartSeriesConfig,
  config: AxisChartConfig,
  mark: ChartMark,
) {
  if (!config.stacked || mark === 'line') return undefined
  return `${mark}:${series.stackName || 'stack'}`
}

/** Whether an area actually stacks onto another, rather than only being asked to. */
function isBanded(entry: PlottedSeries, plotted: PlottedSeries[]) {
  if (entry.mark !== 'area' || !entry.stack) return false
  return plotted.some((other) => other !== entry && other.stack === entry.stack)
}

/**
 * The 100% stacked reading: every value as its share of the column it sits in.
 * The share is taken here rather than written back into the rows, so the
 * tooltip, the click event and the legend keep reading the numbers the caller
 * passed — the plot shows the share, the tooltip shows both.
 */
export function buildStackShares(
  config: AxisChartConfig,
  hiddenSeries: string[] = [],
): StackShares {
  if (config.stacked !== 'normalized') return new Map()
  const plotted = plotSeries(config, true)
  const visible = plotted.filter(
    (entry) => !hiddenSeries.includes(entry.series.name),
  )
  // The rows the option laid out, not the ones the caller passed: the tooltip
  // reads a share by datapoint index, so the two have to be counting the same
  // list.
  const { type } = resolveXAxis(config, Boolean(config.horizontal))
  return stackShares(config, visible, plotRows(config, type, true))
}

function stackShares(
  config: AxisChartConfig,
  visible: PlottedSeries[],
  rows: Record<string, any>[],
): StackShares {
  const shares: StackShares = new Map()
  if (config.stacked !== 'normalized') return shares

  // Per stack rather than across the whole x slot: two stacks standing side by
  // side are two wholes, and a share of their combined total would leave
  // neither column reaching the top, which is the one thing a 100% stack is
  // read for. With the single stack every normalized chart actually has, the
  // two readings are the same.
  const groups = new Map<string, PlottedSeries[]>()
  for (const entry of visible) {
    if (!entry.stack) continue
    groups.set(entry.stack, [...(groups.get(entry.stack) ?? []), entry])
  }

  for (const group of groups.values()) {
    // A series alone in its stack is its own whole: every row would read 100%,
    // which says nothing about the data. It keeps its own numbers instead.
    if (group.length < 2) continue

    // Magnitudes, so a column that mixes signs still spans exactly 100 from its
    // lowest segment to its highest, and a total near zero cannot blow the
    // shares up. All-positive data — what a part-to-whole reading is for —
    // makes this the plain sum.
    const totals = rows.map((row) =>
      group.reduce(
        (sum, entry) => sum + Math.abs(toNumber(row[entry.series.name]) ?? 0),
        0,
      ),
    )

    for (const entry of group) {
      shares.set(
        entry.series.name,
        rows.map((row, index) => {
          const value = toNumber(row[entry.series.name])
          if (value === null || !totals[index]) return null
          return (value / totals[index]) * NORMALIZED_MAX
        }),
      )
    }
  }

  return shares
}

/**
 * A 100% stack is only legible when the axis *is* the share: a column that
 * stops short of the top stops reading as a whole. So the pinned 0-100 wins
 * over a `min` or `max` the caller set, and says so. Only the axes that
 * actually carry a share are pinned.
 */
function pinNormalizedAxes(
  config: AxisChartConfig,
  visible: PlottedSeries[],
  shares: StackShares,
  hasSecondary: boolean,
): AxisChartConfig {
  if (!shares.size) return config

  const pinned = new Set<number>()
  for (const entry of visible) {
    if (shares.has(entry.series.name)) {
      pinned.add(valueAxisIndex(entry.series, hasSecondary))
    }
  }

  for (const entry of visible) {
    if (shares.has(entry.series.name)) continue
    if (!pinned.has(valueAxisIndex(entry.series, hasSecondary))) continue
    warn(
      `\`stacked: "normalized"\` pins that value axis to 0-100, but series "${entry.series.name}" stacks with nothing — a line never stacks, and a mark alone in its stack has no whole to be part of — so it draws its own numbers against that scale. Give it \`axis: "y2"\`, or stack it with the rest.`,
    )
  }

  return {
    ...config,
    ...(pinned.has(0) ? { yAxis: pinValueAxis(config.yAxis, 'yAxis') } : {}),
    ...(pinned.has(1) ? { y2Axis: pinValueAxis(config.y2Axis, 'y2Axis') } : {}),
  }
}

function pinValueAxis(
  axis: ChartYAxisConfig | undefined,
  name: string,
): ChartYAxisConfig {
  const overridden =
    (axis?.min !== undefined && axis.min !== NORMALIZED_MIN) ||
    (axis?.max !== undefined && axis.max !== NORMALIZED_MAX)
  if (overridden) {
    warn(
      `\`stacked: "normalized"\` reads every value as its share of its stack, so \`${name}\` is pinned to 0-100 and the \`min\`/\`max\` set on it is ignored.`,
    )
  }
  return {
    ...axis,
    min: NORMALIZED_MIN,
    max: NORMALIZED_MAX,
    // The ticks read shares, so a `format` written for the measure would print
    // a currency symbol on a percentage. No warning: that `format` still does
    // its real job in the tooltip, which is where the measure survives.
    echartOptions: mergeDeep(axis?.echartOptions ?? {}, {
      axisLabel: { formatter: (value: number) => formatPercent(value) },
    }),
  }
}

/** Chart-wide room for the labels, i.e. whatever the hungriest mark needs. */
function dataLabelGutter(plotted: PlottedSeries[]) {
  let gutter = 0
  for (const { series, mark, stack } of plotted) {
    if (!series.showDataLabels) continue
    // Stacked labels sit inside the fill, so they need no gutter.
    const needed =
      mark === 'bar' ? (stack ? 0 : BAR_LABEL_GUTTER) : LINE_LABEL_GUTTER
    gutter = Math.max(gutter, needed)
  }
  return gutter
}

function buildSeries(
  entry: PlottedSeries,
  config: AxisChartConfig,
  ctx: SeriesContext,
) {
  const base =
    entry.mark === 'bar'
      ? buildBarSeries(entry, ctx)
      : buildLineSeries(entry, config, ctx)

  return mergeDeep(base, entry.series.echartOptions)
}

/**
 * Whether a bar carries its column's rounded tip, asked per row rather than per
 * series: a stack runs away from the baseline in both directions at once, so
 * which segment ends the column depends on the sign of the number in that row.
 * Only that end is rounded — rounding the segments underneath carves notches
 * out of the middle of the column.
 */
function tipResolver(
  visible: PlottedSeries[],
  config: AxisChartConfig,
  rows: Record<string, any>[],
) {
  if (!config.stacked) return () => true
  const bars = visible.filter((entry) => entry.mark === 'bar')

  return (entry: PlottedSeries, rowIndex: number, value: number) => {
    if (!entry.stack) return true
    const outermost = bars
      .filter((other) => other.stack === entry.stack)
      .filter((other) =>
        sameDirection(toNumber(rows[rowIndex]?.[other.series.name]), value),
      )
      .at(-1)
    return outermost?.series.name === entry.series.name
  }
}

function sameDirection(a: number | null, b: number) {
  return a !== null && a !== 0 && a > 0 === b > 0
}

/**
 * The corners at the far end of the bar from the baseline — the tip it grows
 * towards. A bar below zero grows the other way, so its tip is the other end.
 */
function borderRadius(value: number, horizontal: boolean, isRTL: boolean) {
  // A bar of no length has no tip, and a radius on it draws a lozenge on the
  // baseline.
  if (!value) return 0

  if (!horizontal) {
    return value > 0
      ? [BAR_RADIUS, BAR_RADIUS, 0, 0]
      : [0, 0, BAR_RADIUS, BAR_RADIUS]
  }
  // In RTL the value axis runs the other way, so a positive bar ends on the left.
  return value > 0 !== isRTL
    ? [0, BAR_RADIUS, BAR_RADIUS, 0]
    : [BAR_RADIUS, 0, 0, BAR_RADIUS]
}

/** Every segment of a stack labels itself in place; only a free bar labels outside. */
function barLabelPosition(
  entry: PlottedSeries,
  horizontal: boolean,
  isRTL: boolean,
) {
  if (entry.stack) return 'inside'
  if (horizontal) return isRTL ? 'left' : 'right'
  return 'top'
}

function buildBarSeries(entry: PlottedSeries, ctx: SeriesContext) {
  const { series } = entry
  const { rows, horizontal, isRTL, color, tokens, carriesTip, yAxisIndex } = ctx

  const data = rows.map((row, index) => {
    const at = ctx.xValue(row)
    const value = ctx.share ? ctx.share[index] : toNumber(row[series.name])
    const point = horizontal ? [value, at] : [at, value]
    const rounded =
      value !== null && carriesTip(entry, index, value)
        ? borderRadius(value, horizontal, isRTL)
        : 0
    // Per point rather than per series: the rounding follows each bar's own
    // sign, and echarts reads a data item's own itemStyle over the series'.
    return { value: point, itemStyle: { borderRadius: rounded } }
  })

  const position = barLabelPosition(entry, horizontal, isRTL)

  return {
    type: 'bar',
    name: series.name,
    data,
    yAxisIndex,
    z: MARK_Z.bar,
    stack: entry.stack,
    barMaxWidth: BAR_MAX_WIDTH,
    barCategoryGap: BAR_CATEGORY_GAP,
    itemStyle: { color },
    // A whole series lifts at a time, never a single bar: isolating the bar
    // under the pointer turns every mouse move into a flicker, and the axis
    // pointer and tooltip already say which category is being read.
    emphasis: { focus: 'series', blurScope: 'coordinateSystem' },
    blur: {
      itemStyle: { opacity: BLUR_OPACITY },
      label: { opacity: BLUR_OPACITY },
    },
    label: {
      show: Boolean(series.showDataLabels),
      position,
      // A label sitting on the fill has to clear the fill, not the card.
      color:
        position === 'inside'
          ? insideLabelColor(color, tokens.insideLabel)
          : tokens.dataLabel,
      fontSize: DATA_LABEL_FONT_SIZE,
      formatter: (params: any) =>
        plottedLabel(
          horizontal ? params.value?.[0] : params.value?.[1],
          Boolean(ctx.share),
        ),
    },
    labelLayout: { hideOverlap: true },
  }
}

/** Line and area are one echarts series type: an area is a line with a fill. */
function buildLineSeries(
  entry: PlottedSeries,
  config: AxisChartConfig,
  ctx: SeriesContext,
) {
  const { series, mark } = entry
  const { rows, color, tokens, yAxisIndex, banded } = ctx

  const data = rows.map((row, index) => [
    ctx.xValue(row),
    ctx.share ? ctx.share[index] : toNumber(row[series.name]),
  ])

  const base = {
    type: 'line',
    name: series.name,
    data,
    yAxisIndex,
    z: MARK_Z[mark],
    stack: entry.stack,
    // Nulls read as gaps: bridging them invents data that was never measured.
    connectNulls: Boolean(config.connectNulls),
    smooth: Boolean(series.smooth),
    showSymbol: Boolean(series.showDataPoints),
    symbol: 'circle',
    symbolSize: SYMBOL_SIZE,
    itemStyle: { color },
    lineStyle: {
      color,
      width: series.lineWidth ?? DEFAULT_LINE_WIDTH,
      type: series.lineType ?? 'solid',
    },
    // 'series' rather than the bar chart's 'self': fading every point of a line
    // except the hovered one breaks the line up, so a whole line lifts instead.
    emphasis: { focus: 'series', blurScope: 'coordinateSystem' },
    blur: {
      lineStyle: { opacity: BLUR_OPACITY },
      itemStyle: { opacity: BLUR_OPACITY },
      label: { opacity: BLUR_OPACITY },
    },
    label: {
      show: Boolean(series.showDataLabels),
      position: 'top',
      color: tokens.dataLabel,
      fontSize: DATA_LABEL_FONT_SIZE,
      formatter: (params: any) =>
        plottedLabel(params.value?.[1], Boolean(ctx.share)),
    },
    labelLayout: { hideOverlap: true },
  }

  if (mark !== 'area') return base

  return {
    ...base,
    areaStyle: fillStyle(series, config, color, banded),
    blur: {
      ...base.blur,
      // The blur state has to dim the fill relative to its own opacity, not to 1.
      areaStyle: {
        opacity: fillOpacityOf(series, config, banded) * BLUR_OPACITY,
      },
    },
  }
}

/**
 * What a data label prints. A normalized series plots a share, so printing it
 * as a number would read as a count of something.
 */
function plottedLabel(value: any, normalized: boolean) {
  if (value === null || value === undefined || isNaN(value)) return ''
  return normalized ? formatPercent(value) : formatValue(value, 1, true)
}

function fillOpacityOf(
  series: AxisChartSeriesConfig,
  config: AxisChartConfig,
  banded: boolean,
) {
  return (
    series.fillOpacity ??
    config.fillOpacity ??
    (banded ? DEFAULT_STACKED_FILL_OPACITY : DEFAULT_FILL_OPACITY)
  )
}

/**
 * Overlapping washes fade out towards the axis so the lines stay legible where
 * they cross. A band that stacks on another has no overlap to resolve and reads
 * as one solid block, so it takes a flat fill instead.
 */
function fillStyle(
  series: AxisChartSeriesConfig,
  config: AxisChartConfig,
  color: string,
  banded: boolean,
) {
  const opacity = fillOpacityOf(series, config, banded)
  if (banded) return { color, opacity }

  const top = withAlpha(color, opacity)
  const bottom = withAlpha(color, opacity * GRADIENT_FADE)
  if (!top || !bottom) return { color, opacity }

  return {
    color: {
      type: 'linear',
      x: 0,
      y: 0,
      x2: 0,
      y2: 1,
      colorStops: [
        { offset: 0, color: top },
        { offset: 1, color: bottom },
      ],
    },
    // The stops carry the alpha; a second multiplier here would double-dip.
    opacity: 1,
  }
}

/**
 * `rgba()` for a hex color. Only hex parses — every `--chart-*` stop is authored
 * as hex — so a color in any other notation falls back to a flat fill.
 */
function withAlpha(color: string, alpha: number): string | null {
  const match = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(color?.trim() ?? '')
  if (!match) return null

  const hex =
    match[1].length === 3
      ? match[1]
          .split('')
          .map((c) => c + c)
          .join('')
      : match[1]

  const [r, g, b] = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16))
  return `rgba(${r}, ${g}, ${b}, ${Number(alpha.toFixed(3))})`
}

function article(mark: ChartMark) {
  return mark === 'area' ? 'an area' : `a ${mark}`
}

function warn(message: string) {
  if (import.meta.env.DEV) console.warn(`[frappe-ui] ${message}`)
}
