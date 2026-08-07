import { formatValue } from './format'
import type { ChartTheme } from './theme'
import {
  toNumber,
  BLUR_OPACITY,
  DATA_LABEL_FONT_SIZE,
  LINE_Z,
} from './axisChartCommon'
import { mergeDeep } from './utils'
import type { AxisChartConfig, AxisSeriesConfig } from './types'

const DEFAULT_LINE_WIDTH = 2
/** Big enough to hit with a pointer, small enough not to read as a scatter plot. */
const SYMBOL_SIZE = 6
/** Room for a data label sitting above a point. */
export const LINE_DATA_LABEL_GUTTER = 24

export type LineSeriesContext = {
  theme: ChartTheme
  rows: Record<string, any>[]
  color: string
  /** Entry of the value-axis array this series is measured against. */
  yAxisIndex?: number
  /** True when the category axis is the Y axis, as on a horizontal bar chart. */
  horizontal?: boolean
  isRTL?: boolean
  /** The echarts stack this series joins. Only an area ever gets one. */
  stack?: string
  /** Drawing plane. A line sits above the marks it is read against. */
  z?: number
  /** Extra option keys layered on before the per-series escape hatch. */
  extra?: Record<string, any>
}

export function buildLineSeries(
  series: AxisSeriesConfig,
  config: AxisChartConfig,
  ctx: LineSeriesContext,
) {
  const {
    rows,
    color,
    theme,
    extra,
    yAxisIndex = 0,
    horizontal = false,
    isRTL = false,
    z = LINE_Z,
  } = ctx

  const data = rows.map((row) => {
    const category = row[config.xAxis.key]
    const value = toNumber(row[series.name])
    return horizontal ? [value, category] : [category, value]
  })

  // On a horizontal chart the value runs along X, so the label clears the end
  // of the line rather than sitting above it.
  const position = horizontal ? (isRTL ? 'left' : 'right') : 'top'

  const base = {
    type: 'line',
    name: series.name,
    data,
    yAxisIndex,
    stack: ctx.stack,
    z,
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
      position,
      color: theme.dataLabel,
      fontSize: DATA_LABEL_FONT_SIZE,
      formatter: (params: any) =>
        formatValue(params.value?.[horizontal ? 0 : 1], 1, true),
    },
    labelLayout: { hideOverlap: true },
  }

  return mergeDeep(base, extra, series.echartOptions)
}
