import type { EChartsCoreOption } from 'echarts/core'
import { formatValue } from './format'
import type { ChartTheme } from './theme'
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
  BLUR_OPACITY,
  DATA_LABEL_FONT_SIZE,
  type AxisChartOptionContext,
} from './axisChartCommon'
import { mergeDeep } from './utils'
import type { LineChartConfig, LineSeriesConfig } from './types'

export type LineChartOptionContext = AxisChartOptionContext

const DEFAULT_LINE_WIDTH = 2
/** Big enough to hit with a pointer, small enough not to read as a scatter plot. */
const SYMBOL_SIZE = 6
/** Room for a data label sitting above a point. */
const DATA_LABEL_GUTTER = 24

export function buildLineChartOption(
  config: LineChartConfig,
  context: LineChartOptionContext,
): EChartsCoreOption {
  return buildLineLikeOption(config, context)
}

/**
 * The line option, with a hook for the keys an area series adds on top. Area is
 * a line with a fill, so it shares the axes, the grid and the series entirely.
 */
export function buildLineLikeOption<C extends LineChartConfig>(
  config: C,
  { theme, hiddenSeries = [] }: LineChartOptionContext,
  seriesExtra?: (
    series: C['series'][number],
    color: string,
  ) => Record<string, any>,
): EChartsCoreOption {
  const isRTL = config.dir === 'rtl'
  const rows = config.data ?? []
  const colors = resolveSeriesColors(config, theme)
  const visible = visibleSeries(config.series, hiddenSeries)
  const categories = rows.map((row) => row[config.xAxis.key])

  const option = {
    // A line has no width of its own to anchor the pointer to, so the crosshair
    // is a rule rather than the band a bar chart shades.
    ...axisChartBase(theme, 'line'),
    grid: buildAxisGrid(config, {
      horizontal: false,
      isRTL,
      labelGutter: config.series.some((s) => s.showDataLabels)
        ? DATA_LABEL_GUTTER
        : 0,
    }),
    // A line starts at the plot edge; the half-slot inset bars need would leave
    // it floating away from the axis.
    xAxis: buildCategoryAxis(config, theme, {
      categories,
      horizontal: false,
      isRTL,
      boundaryGap: false,
    }),
    yAxis: buildValueAxes(config, theme, { horizontal: false, isRTL }),
    series: visible.map((series) =>
      buildLineSeries(series, config, {
        theme,
        rows,
        color: colors[series.name],
        yAxisIndex: valueAxisIndex(series, hasSecondaryValueAxis(config)),
        extra: seriesExtra?.(series, colors[series.name]),
      }),
    ),
  }

  return mergeDeep(option, config.echartOptions)
}

export type LineSeriesContext = {
  theme: ChartTheme
  rows: Record<string, any>[]
  color: string
  /** Entry of the value-axis array this series is measured against. */
  yAxisIndex?: number
  /** Extra option keys layered on before the per-series escape hatch. */
  extra?: Record<string, any>
}

export function buildLineSeries(
  series: LineSeriesConfig,
  config: LineChartConfig,
  ctx: LineSeriesContext,
) {
  const { rows, color, theme, extra, yAxisIndex = 0 } = ctx

  const data = rows.map((row) => [
    row[config.xAxis.key],
    toNumber(row[series.name]),
  ])

  const base = {
    type: 'line',
    name: series.name,
    data,
    yAxisIndex,
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
      color: theme.dataLabel,
      fontSize: DATA_LABEL_FONT_SIZE,
      formatter: (params: any) => formatValue(params.value?.[1], 1, true),
    },
    labelLayout: { hideOverlap: true },
  }

  return mergeDeep(base, extra, series.echartOptions)
}
