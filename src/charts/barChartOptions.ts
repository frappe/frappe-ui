import { formatValue } from './format'
import { insideLabelColor, type ChartTheme } from './theme'
import { toNumber, BLUR_OPACITY, DATA_LABEL_FONT_SIZE } from './axisChartCommon'
import { mergeDeep } from './utils'
import type {
  AxisChartConfig,
  AxisSeriesConfig,
  BarSeriesConfig,
} from './types'

const BAR_MAX_WIDTH = 32
/** Slim bars with an airy gap between categories. */
const BAR_CATEGORY_GAP = '38%'
/** Room for a data label sitting past the end of a bar. */
export const BAR_DATA_LABEL_GUTTER = 40
const BAR_RADIUS = 4

/** Whether a bar ends its column, in the direction that row runs. */
export type BarTipResolver = (
  series: BarSeriesConfig,
  rowIndex: number,
  value: number,
) => boolean

/**
 * Whether a bar carries its column's rounded tip, asked per row rather than per
 * series: a stack runs away from the baseline in both directions at once, so
 * which segment ends the column depends on the sign of the number in that row.
 * Only that end is rounded — rounding the segments underneath carves notches
 * out of the middle of the column. Reads the bar series alone: a line crossing
 * the chart is drawn over the columns, not stacked into them.
 */
export function barTipResolver(
  visibleBars: AxisSeriesConfig[],
  config: AxisChartConfig,
  rows: Record<string, any>[],
): BarTipResolver {
  if (!config.stacked) return () => true

  return (series: BarSeriesConfig, rowIndex: number, value: number) => {
    const stack = stackKeyOf(series, config)
    const outermost = visibleBars
      .filter((s) => stackKeyOf(s, config) === stack)
      .filter((s) => sameDirection(toNumber(rows[rowIndex]?.[s.name]), value))
      .at(-1)
    return outermost?.name === series.name
  }
}

/** Which stack a bar belongs to, before the shape namespace is applied. */
function stackKeyOf(series: BarSeriesConfig, config: AxisChartConfig) {
  if (!config.stacked) return undefined
  return series.stackName || 'stack'
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
function dataLabelPosition(
  stacked: boolean,
  horizontal: boolean,
  isRTL: boolean,
) {
  if (stacked) return 'inside'
  if (horizontal) return isRTL ? 'left' : 'right'
  return 'top'
}

export type BarSeriesContext = {
  theme: ChartTheme
  rows: Record<string, any>[]
  horizontal: boolean
  isRTL: boolean
  color: string
  /** Entry of the value-axis array this series is measured against. */
  yAxisIndex: number
  /** The echarts stack this bar joins, or undefined when it stands alone. */
  stack?: string
  carriesTip: BarTipResolver
}

export function buildBarSeries(
  series: AxisSeriesConfig,
  config: AxisChartConfig,
  ctx: BarSeriesContext,
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

  const position = dataLabelPosition(Boolean(ctx.stack), horizontal, isRTL)

  const base = {
    type: 'bar',
    name: series.name,
    data,
    yAxisIndex,
    stack: ctx.stack,
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
