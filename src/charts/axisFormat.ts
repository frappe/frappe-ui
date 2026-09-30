import type { AxisChartFormatters } from './seriesData'
import type {
  AxisChartBaseConfig,
  AxisChartSeriesConfig,
  ChartValueFormatter,
  EchartOptionsOverride,
} from './types'
import { mergeDeep } from './utils'

/**
 * Axis `format` functions reach echarts as an `axisLabel.formatter` merged into
 * the same per-axis `echartOptions` the builders already apply. Going through
 * that path rather than a builder argument keeps the precedence honest: an
 * explicit `echartOptions.axisLabel.formatter` still wins over `format`.
 */
export function applyAxisFormatters<C extends AxisChartBaseConfig>(
  config: C,
  format: AxisChartFormatters,
): C {
  if (!format.x && !format.y && !format.y2) return config

  const next = { ...config }
  if (format.x) {
    next.xAxis = {
      ...config.xAxis,
      echartOptions: withFormatter(config.xAxis.echartOptions, format.x),
    }
  }
  if (format.y) {
    next.yAxis = {
      ...config.yAxis,
      echartOptions: withFormatter(config.yAxis?.echartOptions, format.y),
    }
  }
  if (format.y2) {
    next.y2Axis = {
      ...config.y2Axis,
      echartOptions: withFormatter(config.y2Axis?.echartOptions, format.y2),
    }
  }
  return next
}

function withFormatter(
  echartOptions: EchartOptionsOverride | undefined,
  format: (value: any) => string,
): EchartOptionsOverride {
  // Wrapped rather than handed over: echarts also passes the tick index and, on
  // a time axis, its level — arguments a caller's one-argument formatter would
  // otherwise receive.
  return mergeDeep(
    { axisLabel: { formatter: (value: any) => format(value) } },
    echartOptions,
  )
}

/**
 * How a series prints its values. Without its own format, a series reads in the
 * units of the axis it is actually drawn against, so `y2` series never fall back
 * to the primary formatter — except on a horizontal chart, which has no second
 * axis to put them on.
 */
export function seriesFormatter(
  series: AxisChartSeriesConfig,
  format: AxisChartFormatters,
  horizontal: boolean,
): ChartValueFormatter | undefined {
  const secondary = series.axis === 'y2' && !horizontal
  return series.format ?? (secondary ? format.y2 : format.y)
}
