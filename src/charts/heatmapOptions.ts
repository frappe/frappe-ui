import type { EChartsCoreOption } from 'echarts/core'
import {
  AXIS_LABEL_FONT_SIZE,
  AXIS_LABEL_MARGIN,
  DATA_LABEL_FONT_SIZE,
  toNumber,
} from './axisChartCommon'
import { hexToOklch, interpolateRamp, oklchToHex } from './colorMath'
import { formatValue } from './format'
import { CHART_FONT_FAMILY } from './measureText'
import { chartColors, insideLabelColor, type ChartTokens } from './tokens'
import { mergeDeep } from './utils'
import type {
  ChartCategoryFormatter,
  ChartPaletteName,
  ChartValueFormatter,
  HeatmapCell,
  HeatmapChartConfig,
  HeatmapMatrix,
} from './types'

// Plot, tooltip and the ramp scale in the chrome all read the same
// `HeatmapMatrix`, so the scale in the corner can't disagree with the fills.

/**
 * Formatters travel beside the config rather than inside it, as they do for the
 * axis charts (see `AxisChartFormatters`): the builder takes plain data.
 */
export type HeatmapOptionContext = {
  tokens: ChartTokens
  /** Prints the value inside a cell. Defaults to a shortened number. */
  format?: ChartValueFormatter
  /** Prints the columns of the grid. Left out, echarts prints the category. */
  xFormat?: ChartCategoryFormatter
  /** Prints the rows of the grid. */
  yFormat?: ChartCategoryFormatter
}

/**
 * How many stops the continuous ramp is handed to echarts as. echarts blends
 * `inRange.color` linearly in sRGB; these ramps are authored for the OKLab blend
 * in `interpolateRamp`. Sampling it this finely leaves echarts interpolating
 * between neighbours too close together for the two spaces to differ visibly.
 */
export const HEATMAP_RAMP_SAMPLES = 32

const HEATMAP_PALETTE: ChartPaletteName = 'sequential'

/** Gap between two cells, in px. Split either side of the shared edge. */
const CELL_BORDER_WIDTH = 2
const CELL_RADIUS = 2

const BLANK_CATEGORY = '(Blank)'

/**
 * How much OKLCH lightness a hovered cell gains. Enough to separate it from its
 * neighbours, small enough that it still reads as its own value on the ramp.
 */
const HOVER_LIGHTEN = 0.06

/** A hovered cell stops short of white, or it dissolves into the gap around it. */
const HOVER_MAX_LIGHTNESS = 0.97

/**
 * The hovered fill: the cell's own color, lighter. Up in both themes — the light
 * ramp runs deep to pale and the dark one is dark blue to grey, so a lift reads
 * as a highlight either way, where moving towards the surface behind the plot
 * would take a dark-theme cell down into the background instead.
 *
 * Non-hex stops (a caller's `rgb()` palette) hover as themselves; a fill that
 * doesn't change is better than one that throws.
 */
export function hoverCellColor(color: string): string {
  try {
    const { l, c, h } = hexToOklch(color)
    return oklchToHex({
      l: Math.max(l, Math.min(l + HOVER_LIGHTEN, HOVER_MAX_LIGHTNESS)),
      c,
      h,
    })
  } catch {
    return color
  }
}

/**
 * Cells, categories and the resolved color scale. Categories come out in first
 * appearance order rather than sorted: heatmap axes are usually already
 * meaningful (hours, weekdays, stages), so the caller's row order decides.
 */
export function buildHeatmapMatrix(
  config: HeatmapChartConfig,
  { tokens }: HeatmapOptionContext,
): HeatmapMatrix {
  const rows = config.data ?? []
  const x = categoryAxis()
  const y = categoryAxis()

  // Keyed by coordinate, so two rows landing on the same cell leave one cell
  // rather than two stacked ones. The later row wins: a caller that pre-
  // aggregated its data does not hit this, and one that did not is better
  // served by a last-write-wins rule it can predict than by a silent sum.
  const placed = new Map<string, Omit<HeatmapCell, 'color'>>()

  for (const row of rows) {
    // Categories are registered even when the value is missing: an hour with no
    // orders is still an hour, and dropping its column would close the gap.
    const xIndex = x.register(row[config.xColumn])
    const yIndex = y.register(row[config.yColumn])
    const xLabel = x.labels[xIndex]
    const yLabel = y.labels[yIndex]

    const value = toNumber(row[config.valueColumn])
    if (value === null) continue

    const key = `${xIndex}:${yIndex}`
    if (import.meta.env.DEV && placed.has(key)) {
      console.warn(
        `[frappe-ui] Two rows land on the heatmap cell x="${xLabel}", y="${yLabel}". The last one is drawn; pre-aggregate the data to choose yourself.`,
      )
    }
    placed.set(key, { x: xLabel, y: yLabel, xIndex, yIndex, value, row })
  }

  const unsized = [...placed.values()]
  const { min, max } = resolveScale(config, unsized)
  const stops = heatmapRampStops(config, tokens)
  const span = max - min

  const cells: HeatmapCell[] = unsized.map((cell) => ({
    ...cell,
    // A grid where every cell holds the same number has no scale to place them
    // on, so they all read as present rather than all as empty.
    color: rampColor(stops, span > 0 ? (cell.value - min) / span : 1),
  }))

  return {
    xCategories: x.labels,
    yCategories: y.labels,
    xValues: x.values,
    yValues: y.values,
    cells,
    min,
    max,
    stops,
  }
}

/**
 * One cut of the grid, collected as the rows are read.
 *
 * Values are keyed by label rather than held in a parallel array: the label is
 * all an echarts axis-label formatter is handed. Its index counts from the
 * visible extent, so a `dataZoom` would slide a positional lookup by one.
 */
function categoryAxis() {
  const labels: string[] = []
  const values = new Map<string, any>()
  const indexes = new Map<string, number>()

  return {
    labels,
    values,
    register(value: any) {
      const label = categoryLabel(value)
      const existing = indexes.get(label)
      if (existing !== undefined) return existing
      indexes.set(label, labels.length)
      values.set(label, value)
      return labels.push(label) - 1
    },
  }
}

/**
 * The ends of the color scale. Config wins; the rest comes from the data,
 * except on a diverging ramp, where an unset end is mirrored from the larger
 * side so -4 in a -4..+12 series reads as deep as +4 does the other way.
 */
function resolveScale(
  config: HeatmapChartConfig,
  cells: { value: number }[],
): { min: number; max: number } {
  const values = cells.map((cell) => cell.value)
  const dataMin = values.length ? Math.min(...values) : 0
  const dataMax = values.length ? Math.max(...values) : 0

  if (config.palette === 'diverging') {
    const extent = Math.max(Math.abs(dataMin), Math.abs(dataMax))
    return {
      min: config.min ?? -extent,
      max: config.max ?? extent,
    }
  }

  return { min: config.min ?? dataMin, max: config.max ?? dataMax }
}

/**
 * The ramp the scale runs along, low end first. Asked for as a ramp rather than
 * as one color per cell: a heatmap interpolates between the stops. The deep end
 * goes last, because the heavier number is the heavier color; diverging already
 * runs cool to warm, i.e. negative to positive.
 */
export function heatmapRampStops(
  config: HeatmapChartConfig,
  tokens: ChartTokens,
): string[] {
  return chartColors(config.palette, tokens, {
    fallback: HEATMAP_PALETTE,
    count: 'ramp',
    deepEnd: 'last',
  })
}

/**
 * `count` stops taken off a continuous ramp. Falls back to the ramp itself when
 * a stop is not a hex color — `interpolateRamp` only parses hex, and a caller
 * that passed `rgb()` is better served by echarts' own blend than by an error.
 */
export function sampleRamp(
  stops: string[],
  count = HEATMAP_RAMP_SAMPLES,
): string[] {
  if (stops.length <= 1 || count <= 1) return stops.slice(0, 1)
  try {
    return Array.from({ length: count }, (_, i) =>
      interpolateRamp(stops, i / (count - 1)),
    )
  } catch {
    return [...stops]
  }
}

function rampColor(stops: string[], t: number): string {
  if (!stops.length) return ''
  try {
    return interpolateRamp(stops, t)
  } catch {
    return stops[Math.round(Math.min(Math.max(t, 0), 1) * (stops.length - 1))]
  }
}

function categoryLabel(value: any) {
  return value === null || value === undefined || value === ''
    ? BLANK_CATEGORY
    : String(value)
}

/**
 * How one category reads. The formatter is handed the value the row carried,
 * because the label the category is keyed by has already lost a Date.
 *
 * A blank category prints as the blank marker whatever the formatter does with
 * it: `(Blank)` says the rows named no category, and a formatter reading a date
 * out of `undefined` would say something worse.
 */
export function heatmapCategoryLabel(
  format: ChartCategoryFormatter | undefined,
  values: Map<string, any>,
  label: string,
): string {
  if (!format || label === BLANK_CATEGORY) return label
  return format(values.get(label))
}

/**
 * The `axisLabel` keys that print a category, or none when no formatter was
 * given — echarts then prints the category itself.
 */
function categoryLabelFormatter(
  format: ChartCategoryFormatter | undefined,
  values: Map<string, any>,
) {
  if (!format) return {}
  return {
    formatter: (label: string) => heatmapCategoryLabel(format, values, label),
  }
}

export function buildHeatmapOption(
  config: HeatmapChartConfig,
  context: HeatmapOptionContext,
): EChartsCoreOption {
  const { tokens, format, xFormat, yFormat } = context
  const isRTL = config.dir === 'rtl'
  const matrix = buildHeatmapMatrix(config, context)
  const showValues = Boolean(config.showValues)

  const option = {
    animation: true,
    animationDuration: 500,
    animationDurationUpdate: 300,
    textStyle: { fontFamily: CHART_FONT_FAMILY },
    // No `tooltip` key and no TooltipComponent: a heatmap has no axis pointer
    // worth drawing, and the visible tooltip is a Vue component (ChartTooltip).
    grid: {
      top: 4,
      bottom: 0,
      left: 0,
      right: 4,
      // See `buildAxisGrid`: echarts reserves the room the labels and the axis
      // names need, on both dimensions, inside the rect above.
      outerBoundsMode: 'same',
      outerBoundsContain: 'all',
    },
    xAxis: {
      type: 'category',
      data: matrix.xCategories,
      // RTL reads right-to-left along the horizontal axis, as it does on every
      // other chart in here.
      inverse: isRTL,
      position: 'bottom',
      // A cell already fills its slot, so a rule under it locates nothing.
      splitLine: { show: false },
      splitArea: { show: false },
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        hideOverlap: true,
        margin: AXIS_LABEL_MARGIN,
        color: tokens.axisLabel,
        fontSize: AXIS_LABEL_FONT_SIZE,
        ...categoryLabelFormatter(xFormat, matrix.xValues),
      },
    },
    yAxis: {
      type: 'category',
      data: matrix.yCategories,
      // echarts counts a category axis up from the bottom; a grid is read from
      // the top down, so the first category has to sit on the first row.
      inverse: true,
      position: isRTL ? 'right' : 'left',
      splitLine: { show: false },
      splitArea: { show: false },
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        hideOverlap: true,
        margin: AXIS_LABEL_MARGIN,
        color: tokens.axisLabel,
        fontSize: AXIS_LABEL_FONT_SIZE,
        ...categoryLabelFormatter(yFormat, matrix.yValues),
      },
    },
    // Hidden: the ramp is explained by an HTML scale next to the plot. This one
    // only exists to map values onto colors.
    visualMap: {
      type: 'continuous',
      show: false,
      calculable: false,
      min: visualMapMin(matrix),
      max: matrix.max,
      inRange: { color: sampleRamp(matrix.stops) },
      seriesIndex: 0,
    },
    series: [
      {
        type: 'heatmap',
        name: config.valueColumn,
        // Drawn in the surface behind the plot rather than left out: a cell is a
        // filled rect, so the only way to separate two of them is a border.
        itemStyle: {
          borderRadius: CELL_RADIUS,
          borderWidth: CELL_BORDER_WIDTH,
          borderColor: tokens.cellGap,
        },
        // Hover only lightens the fill (per cell, below). The border stays the
        // resting one and the shadow is turned off: a heatmap is read by
        // comparing fills, and a ring or a lift round one cell reads as an
        // outline drawn on the data.
        emphasis: {
          focus: 'none',
          itemStyle: {
            borderColor: tokens.cellGap,
            borderWidth: CELL_BORDER_WIDTH,
            shadowBlur: 0,
            shadowColor: 'transparent',
          },
        },
        label: {
          show: showValues,
          fontSize: DATA_LABEL_FONT_SIZE,
          formatter: (params: any) => {
            const value = cellValue(params)
            return format ? format(value) : formatValue(value, 1, true)
          },
        },
        // What makes `showValues` mean "when they fit": a label with no room
        // collides with its neighbour, and the loser is dropped rather than
        // printed over the cell next door.
        labelLayout: { hideOverlap: true },
        data: matrix.cells.map((cell) => ({
          value: [cell.xIndex, cell.yIndex, cell.value],
          // Per cell, because the fill is: the visualMap paints each cell from
          // its own value, so the hover fill has to be derived from that value
          // too. Naming a fill here also stops echarts lifting the border
          // color instead, which is what drew the ring around a hovered cell.
          emphasis: { itemStyle: { color: hoverCellColor(cell.color) } },
          // Ink per cell, because the fill under it is per cell: the pale end of
          // the ramp needs the dark ink the deep end would disappear into.
          ...(showValues
            ? {
                label: {
                  color: insideLabelColor(cell.color, tokens.insideLabel),
                },
              }
            : null),
        })),
      },
    ],
  }

  return mergeDeep(option, config.echartOptions)
}

/**
 * echarts needs a span to interpolate across. A flat grid has none, so the
 * bottom of the scale is dropped below the value every cell holds — which puts
 * all of them at the top of the ramp, the same place `buildHeatmapMatrix` puts
 * them.
 */
function visualMapMin(matrix: HeatmapMatrix) {
  return matrix.max > matrix.min ? matrix.min : matrix.max - 1
}

function cellValue(params: any): number {
  const value = params?.value
  return Array.isArray(value) ? Number(value[2]) : Number(value)
}
