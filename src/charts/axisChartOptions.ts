import type { EChartsCoreOption } from 'echarts/core'
import {
  axisChartBase,
  buildAxisGrid,
  buildCategoryAxis,
  buildValueAxes,
  hasSecondaryValueAxis,
  resolveSeriesColors,
  stackNameOf,
  valueAxisIndex,
  visibleSeries,
  LINE_Z,
  MARK_Z,
  type AxisChartOptionContext,
} from './axisChartCommon'
import { areaSeriesExtra } from './areaChartOptions'
import {
  barTipResolver,
  buildBarSeries,
  BAR_DATA_LABEL_GUTTER,
} from './barChartOptions'
import { buildLineSeries, LINE_DATA_LABEL_GUTTER } from './lineChartOptions'
import { mergeDeep } from './utils'
import type { AxisChartConfig, AxisSeriesConfig, AxisSeriesType } from './types'

/**
 * The option behind every cartesian chart. Each series is drawn as its own
 * `type`, falling back to `defaultType` — the shape of the chart it was handed
 * to — so one config draws bars, lines, areas, or any mix of the three.
 *
 * What the mix decides, it decides over *every* series rather than the visible
 * ones: switching the last bar off in the legend should not re-space the
 * category axis or swap the pointer out from under the remaining lines.
 */
export function buildAxisChartOption(
  config: AxisChartConfig,
  { theme, hiddenSeries = [], width }: AxisChartOptionContext,
  defaultType: AxisSeriesType,
): EChartsCoreOption {
  const isRTL = config.dir === 'rtl'
  const horizontal = Boolean(config.horizontal)
  const rows = config.data ?? []
  const colors = resolveSeriesColors(config, theme)

  const typeOf = (series: AxisSeriesConfig) => series.type ?? defaultType
  const hasBars = config.series.some((series) => typeOf(series) === 'bar')

  const visible = visibleSeries(config.series, hiddenSeries)
  const categories = rows.map((row) => row[config.xAxis.key])

  const categoryAxis = buildCategoryAxis(config, theme, {
    categories,
    horizontal,
    isRTL,
    // A bar is drawn across its slot, so it needs the half-slot inset at each
    // end of the axis. A chart of lines alone runs edge to edge instead.
    boundaryGap: hasBars,
    width,
  })
  const valueAxis = buildValueAxes(config, theme, { horizontal, isRTL })
  const hasSecondary = hasSecondaryValueAxis(config, horizontal)

  const carriesTip = barTipResolver(
    visible.filter((series) => typeOf(series) === 'bar'),
    config,
    rows,
  )

  const option = {
    // A bar has a width for the pointer to shade; a line has none, so its
    // crosshair is a rule. A chart with any bar in it takes the band.
    ...axisChartBase(theme, hasBars ? 'shadow' : 'line'),
    grid: buildAxisGrid(config, {
      horizontal,
      isRTL,
      labelGutter: dataLabelGutter(config, typeOf),
    }),
    xAxis: horizontal ? valueAxis : categoryAxis,
    yAxis: horizontal ? categoryAxis : valueAxis,
    series: visible.map((series) => {
      const type = typeOf(series)
      const color = colors[series.name]
      const shared = {
        theme,
        rows,
        horizontal,
        isRTL,
        color,
        yAxisIndex: valueAxisIndex(series, hasSecondary),
        stack: stackNameOf(series, config, type),
      }

      if (type === 'bar') {
        return buildBarSeries(series, config, { ...shared, carriesTip })
      }
      return buildLineSeries(series, config, {
        ...shared,
        z: type === 'area' ? MARK_Z : LINE_Z,
        extra:
          type === 'area'
            ? areaSeriesExtra(series, config, color, {
                horizontal,
                isRTL,
                stacked: Boolean(shared.stack),
              })
            : undefined,
      })
    }),
  }

  return mergeDeep(option, config.echartOptions)
}

/**
 * Room for the data labels that sit past the end of a mark. Bars need the most,
 * and stacked ones none at all — they label inside the fill.
 */
function dataLabelGutter(
  config: AxisChartConfig,
  typeOf: (series: AxisSeriesConfig) => AxisSeriesType,
) {
  const gutters = config.series.map((series) => {
    if (!series.showDataLabels) return 0
    if (typeOf(series) !== 'bar') return LINE_DATA_LABEL_GUTTER
    return config.stacked ? 0 : BAR_DATA_LABEL_GUTTER
  })
  return Math.max(0, ...gutters)
}

export function buildBarChartOption(
  config: AxisChartConfig,
  context: AxisChartOptionContext,
): EChartsCoreOption {
  return buildAxisChartOption(config, context, 'bar')
}

export function buildLineChartOption(
  config: AxisChartConfig,
  context: AxisChartOptionContext,
): EChartsCoreOption {
  return buildAxisChartOption(config, context, 'line')
}

export function buildAreaChartOption(
  config: AxisChartConfig,
  context: AxisChartOptionContext,
): EChartsCoreOption {
  return buildAxisChartOption(config, context, 'area')
}
