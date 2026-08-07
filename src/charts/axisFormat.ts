import type { AxisChartFormatters } from './seriesData'
import type { AxisChartBaseConfig, EchartOptionsOverride } from './types'
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
