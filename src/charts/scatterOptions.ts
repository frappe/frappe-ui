import type { EChartsCoreOption } from 'echarts/core'
import {
  AXIS_LABEL_FONT_SIZE,
  BLUR_OPACITY,
  buildAxisGrid,
  buildValueAxis,
  toNumber,
} from './axisChartCommon'
import { formatLabel } from './format'
import { CHART_FONT_FAMILY } from './measureText'
import { paletteColors, pickSeriesColor, type ChartTheme } from './theme'
import { mergeDeep } from './utils'
import type { ChartValueFormatter } from './props'
import type {
  AxisChartBaseConfig,
  ChartPaletteName,
  ChartYAxisConfig,
  ScatterChartConfig,
  ScatterPoint,
  ScatterSeries,
} from './types'

// Plot, legend and tooltip all read the same `ScatterSeries[]`, so the point
// under the pointer can't disagree with the one the option drew.

export type ScatterOptionContext = {
  theme: ChartTheme
  /** Series names the legend has switched off. Dropped from the option. */
  hiddenSeries?: string[]
  /** Prints the numbers the option itself prints, i.e. the two axis scales. */
  format?: {
    x?: ChartValueFormatter
    y?: ChartValueFormatter
  }
}

const SCATTER_PALETTE: ChartPaletteName = 'categorical'

/** Diameter of a point carrying no magnitude, and the floor of the bubble range. */
const MIN_SYMBOL_SIZE = 10
/** As wide as a bubble gets before it starts swallowing its neighbours. */
const MAX_SYMBOL_SIZE = 35

/** Points overlap by nature, so they have to read through each other. */
const SYMBOL_OPACITY = 0.75

/**
 * Room between the cloud and the axis lines. A symbol is centred on its
 * coordinate and clipped at the grid edge, so a point at the very top of the
 * scale would otherwise be drawn as a half circle sitting on the frame.
 */
const AXIS_INSET = '6%'

/**
 * The points as they are drawn: rows coerced to a pair of coordinates, grouped
 * into series, and every magnitude mapped onto a symbol diameter. Grouping and
 * the size scale both run over the whole dataset, so a bubble means the same
 * thing in every group.
 */
export function buildScatterSeries(
  config: ScatterChartConfig,
  { theme }: ScatterOptionContext,
): ScatterSeries[] {
  const rows = config.data ?? []
  const names: string[] = []
  const grouped = new Map<string, Omit<ScatterPoint, 'symbolSize'>[]>()
  const sizes: number[] = []
  let dropped = 0

  for (const row of rows) {
    const x = toNumber(row[config.xColumn])
    const y = toNumber(row[config.yColumn])
    // A point is a pair of coordinates. With one of them missing there is
    // nowhere on the plot to put it.
    if (x === null || y === null) {
      dropped++
      continue
    }

    const name = seriesName(config, row)
    let points = grouped.get(name)
    if (!points) {
      points = []
      names.push(name)
      grouped.set(name, points)
    }

    const size = config.sizeColumn ? toNumber(row[config.sizeColumn]) : null
    if (size !== null) sizes.push(size)

    points.push({ x, y, size, label: pointLabel(config, row), row })
  }

  if (dropped) warnDropped(dropped, config)

  const scale = symbolSizeScale(sizes, Boolean(config.sizeColumn))
  const colors = seriesColors(config, theme, names.length)

  return names.map((name, index) => ({
    name,
    label: formatLabel(name),
    color: colors[index],
    points: grouped.get(name)!.map((point) => ({
      ...point,
      symbolSize: scale(point.size),
    })),
  }))
}

const BLANK_GROUP = '(Blank)'

function seriesName(config: ScatterChartConfig, row: Record<string, any>) {
  if (!config.seriesColumn) return config.yColumn
  const value = row[config.seriesColumn]
  return value === null || value === undefined || value === ''
    ? BLANK_GROUP
    : String(value)
}

function pointLabel(config: ScatterChartConfig, row: Record<string, any>) {
  if (!config.labelColumn) return undefined
  const value = row[config.labelColumn]
  return value === null || value === undefined ? undefined : String(value)
}

/** Magnitude to symbol diameter, over the magnitudes of the whole plot. */
function symbolSizeScale(sizes: number[], hasSizeColumn: boolean) {
  if (!hasSizeColumn) return () => MIN_SYMBOL_SIZE

  const scale = magnitudeScale(sizes)
  // A row whose magnitude is blank still reads x against y, so it draws — at
  // the floor, which is the size a plain scatter point has anyway.
  return (size: number | null) =>
    size === null ? MIN_SYMBOL_SIZE : scale(size)
}

function magnitudeScale(sizes: number[]) {
  let min = Infinity
  let max = -Infinity
  for (const size of sizes) {
    if (size < min) min = size
    if (size > max) max = size
  }

  // One distinct magnitude says nothing about relative size. Drawing every
  // bubble at the floor would claim they are all the smallest there is, so the
  // whole column collapses onto the middle of the range instead.
  if (min === max) {
    const middle = (MIN_SYMBOL_SIZE + MAX_SYMBOL_SIZE) / 2
    return () => middle
  }

  const span = MAX_SYMBOL_SIZE - MIN_SYMBOL_SIZE
  return (size: number) => MIN_SYMBOL_SIZE + ((size - min) / (max - min)) * span
}

function seriesColors(
  config: ScatterChartConfig,
  theme: ChartTheme,
  count: number,
) {
  const explicit = Array.isArray(config.palette) ? config.palette : undefined
  if (explicit?.length) {
    return Array.from({ length: count }, (_, i) => pickSeriesColor(explicit, i))
  }

  const name =
    typeof config.palette === 'string' ? config.palette : SCATTER_PALETTE
  return paletteColors(name, theme, count)
}

function warnDropped(dropped: number, config: ScatterChartConfig) {
  if (!import.meta.env.DEV) return
  console.warn(
    `[frappe-ui] Dropped ${dropped} ${dropped === 1 ? 'row' : 'rows'} of the scatter data: "${config.xColumn}" and "${config.yColumn}" did not both read as numbers. A point needs two coordinates.`,
  )
}

export function buildScatterOption(
  config: ScatterChartConfig,
  context: ScatterOptionContext,
): EChartsCoreOption {
  const { theme, hiddenSeries = [], format } = context
  const isRTL = config.dir === 'rtl'
  const series = buildScatterSeries(config, context)
  const visible = series.filter((entry) => !hiddenSeries.includes(entry.name))

  const option = {
    animation: true,
    animationDuration: 500,
    animationDurationUpdate: 300,
    textStyle: { fontFamily: CHART_FONT_FAMILY },
    // No `tooltip` key and no TooltipComponent: a point is read on its own
    // rather than through an axis pointer, and the visible tooltip is a Vue
    // component (ChartTooltip).
    grid: buildAxisGrid(axisChartShim(), {
      horizontal: false,
      isRTL,
      // Nothing is printed past the end of a mark: a point is the mark.
      labelGutter: 0,
    }),
    // The x axis title is drawn on the axis, the way the category axis carries
    // its own; the y axis title is chrome, drawn above the plot by the
    // component. Same split as every other cartesian chart.
    xAxis: valueAxis(config.xAxis, theme, {
      horizontal: true,
      isRTL,
      format: format?.x,
      name: config.xAxis?.title,
    }),
    yAxis: valueAxis(config.yAxis, theme, {
      horizontal: false,
      isRTL,
      format: format?.y,
    }),
    series: visible.map(buildSeries),
  }

  return mergeDeep(option, config.echartOptions)
}

function buildSeries(entry: ScatterSeries) {
  return {
    type: 'scatter',
    name: entry.name,
    data: entry.points.map((point) => ({
      value: [point.x, point.y],
      symbolSize: point.symbolSize,
    })),
    symbol: 'circle',
    itemStyle: { color: entry.color, opacity: SYMBOL_OPACITY, borderWidth: 0 },
    // A whole group lifts at a time, never a single point: a point only means
    // something against the cloud around it, and fading that cloud takes the
    // reading away.
    emphasis: { focus: 'series', blurScope: 'coordinateSystem' },
    blur: { itemStyle: { opacity: SYMBOL_OPACITY * BLUR_OPACITY } },
  }
}

/**
 * One of the two value axes. `buildValueAxis` reads its options off the `yAxis`
 * of an axis-chart config and moves the scale to the bottom edge when the chart
 * is horizontal, so each axis here is built by handing it the config it should
 * read and the orientation that lands it on the right edge. Reusing it is what
 * keeps a scatter's gridlines, labels and min/max identical to the rest of the
 * family.
 */
function valueAxis(
  axis: ChartYAxisConfig | undefined,
  theme: ChartTheme,
  opts: {
    horizontal: boolean
    isRTL: boolean
    format?: ChartValueFormatter
    /** Axis title, for the axis that draws its own. */
    name?: string
  },
) {
  const { horizontal, isRTL, format, name } = opts

  // Merged *under* the caller's own overrides, the way `applyAxisFormatters`
  // does it: an explicit `echartOptions` still wins over what v2 decided.
  const echartOptions = mergeDeep(
    {
      // A scatter is read for the shape of its cloud, so both scales follow the
      // data instead of anchoring to zero and squashing it into a corner.
      scale: true,
      boundaryGap: [AXIS_INSET, AXIS_INSET],
      ...(name
        ? {
            name: formatLabel(name),
            nameLocation: 'end',
            nameGap: 8,
            nameTextStyle: {
              color: theme.axisTitle,
              fontSize: AXIS_LABEL_FONT_SIZE,
            },
          }
        : {}),
      ...(format
        ? // Wrapped rather than handed over: echarts also passes the tick index.
          { axisLabel: { formatter: (value: any) => format(Number(value)) } }
        : {}),
    },
    axis?.echartOptions,
  )

  return buildValueAxis(axisChartShim({ ...axis, echartOptions }), theme, {
    horizontal,
    isRTL,
  })
}

/**
 * The axis-chart shape `buildAxisGrid` and `buildValueAxis` are typed against.
 * Between them they read two fields — the x axis title, which only a horizontal
 * chart has, and the value axis whose options are being built — so the rest
 * stands in for a config a scatter does not have.
 */
function axisChartShim(valueAxis?: ChartYAxisConfig): AxisChartBaseConfig {
  return { data: [], xAxis: { key: '' }, series: [], yAxis: valueAxis }
}
