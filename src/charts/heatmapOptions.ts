import type { EChartsCoreOption } from 'echarts/core'
import {
  AXIS_LABEL_FONT_SIZE,
  DATA_LABEL_FONT_SIZE,
  toNumber,
} from './axisChartCommon'
import { interpolateRamp } from './colorMath'
import { formatValue } from './format'
import { insideLabelColor, type ChartTheme } from './theme'
import { mergeDeep } from './utils'
import type { ChartValueFormatter } from './props'
import type { HeatmapCell, HeatmapChartConfig, HeatmapMatrix } from './types'

// Plot, tooltip and the ramp scale in the chrome all read the same
// `HeatmapMatrix`, so the scale in the corner can't disagree with the fills.

export type HeatmapOptionContext = {
  theme: ChartTheme
  /** Prints the value inside a cell. Defaults to a shortened number. */
  format?: ChartValueFormatter
}

/**
 * How many stops the continuous ramp is handed to echarts as. echarts blends
 * `inRange.color` linearly in sRGB; these ramps are authored for the OKLab blend
 * in `interpolateRamp`. Sampling it this finely leaves echarts interpolating
 * between neighbours too close together for the two spaces to differ visibly.
 */
export const HEATMAP_RAMP_SAMPLES = 32

/**
 * The two palest sequential stops vanish against a card, and on a heatmap they
 * would take the low end of the scale with them — a cell that exists has to
 * read as a cell. Same trim as the series palette makes (see `theme.ts`).
 */
const SEQUENTIAL_TAIL_TRIM = 2

/** Gap between two cells, in px. Split either side of the shared edge. */
const CELL_BORDER_WIDTH = 2
const CELL_RADIUS = 2

const BLANK_CATEGORY = '(Blank)'

/**
 * Cells, categories and the resolved color scale. Categories come out in first
 * appearance order rather than sorted: heatmap axes are usually already
 * meaningful (hours, weekdays, stages), so the caller's row order decides.
 */
export function buildHeatmapMatrix(
  config: HeatmapChartConfig,
  { theme }: HeatmapOptionContext,
): HeatmapMatrix {
  const rows = config.data ?? []
  const xCategories: string[] = []
  const yCategories: string[] = []
  const xIndexes = new Map<string, number>()
  const yIndexes = new Map<string, number>()

  const index = (
    label: string,
    categories: string[],
    indexes: Map<string, number>,
  ) => {
    const existing = indexes.get(label)
    if (existing !== undefined) return existing
    const next = categories.length
    categories.push(label)
    indexes.set(label, next)
    return next
  }

  // Keyed by coordinate, so two rows landing on the same cell leave one cell
  // rather than two stacked ones. The later row wins: a caller that pre-
  // aggregated its data does not hit this, and one that did not is better
  // served by a last-write-wins rule it can predict than by a silent sum.
  const placed = new Map<string, Omit<HeatmapCell, 'color'>>()

  for (const row of rows) {
    const x = categoryLabel(row[config.xColumn])
    const y = categoryLabel(row[config.yColumn])
    // Categories are registered even when the value is missing: an hour with no
    // orders is still an hour, and dropping its column would close the gap.
    const xIndex = index(x, xCategories, xIndexes)
    const yIndex = index(y, yCategories, yIndexes)

    const value = toNumber(row[config.valueColumn])
    if (value === null) continue

    const key = `${xIndex}:${yIndex}`
    if (import.meta.env.DEV && placed.has(key)) {
      console.warn(
        `[frappe-ui] Two rows land on the heatmap cell x="${x}", y="${y}". The last one is drawn; pre-aggregate the data to choose yourself.`,
      )
    }
    placed.set(key, { x, y, xIndex, yIndex, value, row })
  }

  const unsized = [...placed.values()]
  const { min, max } = resolveScale(config, unsized)
  const stops = heatmapRampStops(config, theme)
  const span = max - min

  const cells: HeatmapCell[] = unsized.map((cell) => ({
    ...cell,
    // A grid where every cell holds the same number has no scale to place them
    // on, so they all read as present rather than all as empty.
    color: rampColor(stops, span > 0 ? (cell.value - min) / span : 1),
  }))

  return { xCategories, yCategories, cells, min, max, stops }
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
 * The ramp the scale runs along, low end first. The sequential ramp is authored
 * dark to light and has to be reversed: on a heatmap the heavier number is the
 * heavier color. Diverging already runs cool to warm, i.e. negative to positive.
 */
export function heatmapRampStops(
  config: HeatmapChartConfig,
  theme: ChartTheme,
): string[] {
  if (Array.isArray(config.palette)) return config.palette
  if (config.palette === 'diverging') return theme.diverging
  return theme.sequential
    .slice(0, Math.max(1, theme.sequential.length - SEQUENTIAL_TAIL_TRIM))
    .reverse()
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

export function buildHeatmapOption(
  config: HeatmapChartConfig,
  context: HeatmapOptionContext,
): EChartsCoreOption {
  const { theme, format } = context
  const isRTL = config.dir === 'rtl'
  const matrix = buildHeatmapMatrix(config, context)
  const showValues = Boolean(config.showValues)

  const option = {
    animation: true,
    animationDuration: 500,
    animationDurationUpdate: 300,
    textStyle: { fontFamily: 'InterVar, Inter, sans-serif' },
    // No `tooltip` key and no TooltipComponent: a heatmap has no axis pointer
    // worth drawing, and the visible tooltip is a Vue component (ChartTooltip).
    grid: {
      top: 4,
      bottom: 0,
      left: 0,
      right: 4,
      containLabel: true,
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
        margin: 8,
        color: theme.axisLabel,
        fontSize: AXIS_LABEL_FONT_SIZE,
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
        margin: 8,
        color: theme.axisLabel,
        fontSize: AXIS_LABEL_FONT_SIZE,
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
          borderColor: theme.cellGap,
        },
        // Only a hairline round the hovered cell: a heatmap is read by comparing
        // fills, which a lift or a dimmed neighbourhood gets in the way of.
        emphasis: {
          focus: 'none',
          itemStyle: { borderColor: theme.axisLine },
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
          // Ink per cell, because the fill under it is per cell: the pale end of
          // the ramp needs the dark ink the deep end would disappear into.
          ...(showValues
            ? {
                label: {
                  color: insideLabelColor(cell.color, theme.insideLabel),
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
