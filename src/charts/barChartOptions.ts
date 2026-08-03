import type { EChartsCoreOption } from 'echarts/core'
import { formatValue } from './format'
import { insideLabelColor, type ChartTheme } from './theme'
import {
  axisChartBase,
  buildAxisGrid,
  buildCategoryAxis,
  buildValueAxes,
  hasSecondaryValueAxis,
  resolveSeriesColors,
  toNumber,
  valueAxisIndex,
  visibleSeries,
  DATA_LABEL_FONT_SIZE,
  BLUR_OPACITY,
  type AxisChartOptionContext,
} from './axisChartCommon'
import { mergeDeep } from './utils'
import type { BarChartConfig, BarSeriesConfig } from './types'

export type BarChartOptionContext = AxisChartOptionContext

export { resolveSeriesColors }

const BAR_MAX_WIDTH = 32
/** Slim bars with an airy gap between categories. */
const BAR_CATEGORY_GAP = '38%'
/** Room for a data label sitting past the end of a bar. */
const DATA_LABEL_GUTTER = 40
const BAR_RADIUS = 4

export function buildBarChartOption(
  config: BarChartConfig,
  { theme, hiddenSeries = [], width }: BarChartOptionContext,
): EChartsCoreOption {
  const isRTL = config.dir === 'rtl'
  const horizontal = Boolean(config.horizontal)
  const rows = config.data ?? []
  const colors = resolveSeriesColors(config, theme)

  const visible = visibleSeries(config.series, hiddenSeries)
  const categories = rows.map((row) => row[config.xAxis.key])

  const categoryAxis = buildCategoryAxis(config, theme, {
    categories,
    horizontal,
    isRTL,
    boundaryGap: true,
    width,
  })
  const valueAxis = buildValueAxes(config, theme, { horizontal, isRTL })
  const hasSecondary = hasSecondaryValueAxis(config, horizontal)

  const option = {
    ...axisChartBase(theme, 'shadow'),
    grid: buildAxisGrid(config, {
      horizontal,
      isRTL,
      labelGutter: dataLabelGutter(config),
    }),
    xAxis: horizontal ? valueAxis : categoryAxis,
    yAxis: horizontal ? categoryAxis : valueAxis,
    series: visible.map((series) =>
      buildSeries(series, config, {
        theme,
        rows,
        horizontal,
        isRTL,
        color: colors[series.name],
        yAxisIndex: valueAxisIndex(series, hasSecondary),
        carriesTip: tipResolver(visible, config, rows),
      }),
    ),
  }

  return mergeDeep(option, config.echartOptions)
}

/** Stacked labels sit inside the fill, so they need no gutter. */
function dataLabelGutter(config: BarChartConfig) {
  return !config.stacked && config.series.some((s) => s.showDataLabels)
    ? DATA_LABEL_GUTTER
    : 0
}

/**
 * Whether a bar carries its column's rounded tip, asked per row rather than per
 * series: a stack runs away from the baseline in both directions at once, so
 * which segment ends the column depends on the sign of the number in that row.
 * Only that end is rounded — rounding the segments underneath carves notches
 * out of the middle of the column.
 */
function tipResolver(
  visible: BarSeriesConfig[],
  config: BarChartConfig,
  rows: Record<string, any>[],
) {
  if (!config.stacked) return () => true

  return (series: BarSeriesConfig, rowIndex: number, value: number) => {
    const stack = stackNameOf(series, config)
    const outermost = visible
      .filter((s) => stackNameOf(s, config) === stack)
      .filter((s) => sameDirection(toNumber(rows[rowIndex]?.[s.name]), value))
      .at(-1)
    return outermost?.name === series.name
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

function stackNameOf(series: BarSeriesConfig, config: BarChartConfig) {
  if (!config.stacked) return undefined
  return series.stackName || 'stack'
}

/** Every segment of a stack labels itself in place; only a free bar labels outside. */
function dataLabelPosition(
  config: BarChartConfig,
  horizontal: boolean,
  isRTL: boolean,
) {
  if (config.stacked) return 'inside'
  if (horizontal) return isRTL ? 'left' : 'right'
  return 'top'
}

function buildSeries(
  series: BarSeriesConfig,
  config: BarChartConfig,
  ctx: {
    theme: ChartTheme
    rows: Record<string, any>[]
    horizontal: boolean
    isRTL: boolean
    color: string
    /** Entry of the value-axis array this series is measured against. */
    yAxisIndex: number
    /** Whether this bar ends its column, in the direction that row runs. */
    carriesTip: (
      series: BarSeriesConfig,
      rowIndex: number,
      value: number,
    ) => boolean
  },
) {
  const { rows, horizontal, isRTL, color, theme, carriesTip, yAxisIndex } = ctx

  const data = rows.map((row, index) => {
    const category = row[config.xAxis.key]
    const value = toNumber(row[series.name])
    const point = horizontal ? [value, category] : [category, value]
    const rounded =
      value !== null && carriesTip(series, index, value)
        ? borderRadius(value, horizontal, isRTL)
        : 0
    // Per point rather than per series: the rounding follows each bar's own
    // sign, and echarts reads a data item's own itemStyle over the series'.
    return { value: point, itemStyle: { borderRadius: rounded } }
  })

  const position = dataLabelPosition(config, horizontal, isRTL)

  const base = {
    type: 'bar',
    name: series.name,
    data,
    yAxisIndex,
    stack: stackNameOf(series, config),
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
          ? insideLabelColor(color, theme.insideLabel)
          : theme.dataLabel,
      fontSize: DATA_LABEL_FONT_SIZE,
      formatter: (params: any) => {
        const value = horizontal ? params.value?.[0] : params.value?.[1]
        return formatValue(value, 1, true)
      },
    },
    labelLayout: { hideOverlap: true },
  }

  return mergeDeep(base, series.echartOptions)
}
