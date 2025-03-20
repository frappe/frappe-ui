import useEchartsOptions from './eChartOptions'
import { formatValue } from './helpers'
import {
  AreaSeriesConfig,
  AxisChartConfig,
  BarSeriesConfig,
  LineSeriesConfig,
} from './types'

export default function useAxisChartOptions(config: AxisChartConfig) {
  const data = config.data || []
  const baseOptions = useEchartsOptions(config)

  if (config.xAxis.type === 'time' && config.swapXY) {
    throw new Error('Swap axes is not supported for time series data')
  }

  if (
    config.series.find((s) => s.axis === 'y2' || s.type !== 'bar') &&
    config.swapXY
  ) {
    throw new Error('Swap axes is not supported for non-bar series or y2 axis')
  }

  const swapXY = config.swapXY
  const seriesCount = config.series.length
  const hasY2 = config.series.some((s) => s.axis === 'y2')

  if (hasY2) {
    baseOptions.yAxis[1].show = true
  }

  return {
    ...baseOptions,
    series: config.series.map((s, idx) => {
      let labelPosition = 'top'
      if (config.stacked && seriesCount > 1) {
        labelPosition = 'inside'
        if (idx === seriesCount - 1) {
          // Last series
          labelPosition = swapXY ? 'right' : 'top'
        }
      }

      const standardOptions = {
        type: s.type,
        name: s.name,
        data: data.map((row: any) => [
          swapXY ? row[s.name] : row[config.xAxis.key],
          swapXY ? row[config.xAxis.key] : row[s.name],
        ]),
        yAxisIndex: s.axis === 'y2' ? 1 : 0,
        label: {
          show: s.showDataLabels,
          position: labelPosition,
          formatter: (params: any) => {
            const _val = swapXY ? params.value?.[0] : params.value?.[1]
            return formatValue(_val, 1, true)
          },
          fontSize: 11,
        },
        labelLayout: { hideOverlap: true },
        itemStyle: {
          color: s.color,
        },
      }

      let seriesTypeOptions = {}
      if (s.type === 'bar') {
        seriesTypeOptions = getBarSeriesOptions(config, s)
      }
      if (s.type === 'line') {
        seriesTypeOptions = getLineSeriesOptions(config, s)
      }
      if (s.type === 'area') {
        seriesTypeOptions = getAreaSeriesOptions(config, s)
      }

      return mergeDeep(standardOptions, seriesTypeOptions)
    }),
  }
}

function getBarSeriesOptions(config: AxisChartConfig, series: BarSeriesConfig) {
  const roundedCorners = config.swapXY ? [0, 2, 2, 0] : [2, 2, 0, 0]
  const idx = config.series.findIndex((s) => s.name === series.name)
  const isLast = idx === config.series.length - 1

  return {
    stack: config.stacked ? 'stack' : undefined,
    barMaxWidth: 60,
    itemStyle: {
      borderRadius: config.stacked
        ? isLast
          ? roundedCorners
          : 0
        : roundedCorners,
    },
  }
}

function getLineSeriesOptions(
  config: AxisChartConfig,
  series: LineSeriesConfig,
) {
  const showSymbol = series.showDataPoints || series.showDataLabels
  return {
    symbol: 'circle',
    symbolSize: 7,
    showSymbol: showSymbol,
    emphasis: {},
    lineStyle: {
      width: series.lineWidth || 2,
      type: series.lineType,
    },
  }
}

function getAreaSeriesOptions(
  config: AxisChartConfig,
  series: AreaSeriesConfig,
) {
  return {
    type: 'line',
    areaStyle: {
      color: series.color,
      opacity: series.fillOpacity || 0.6,
    },
  }
}

function isObject(item: any) {
  return item && typeof item === 'object' && !Array.isArray(item)
}

function mergeDeep(target: any, source: any) {
  let output = Object.assign({}, target)
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      if (isObject(source[key])) {
        if (!(key in target)) Object.assign(output, { [key]: source[key] })
        else output[key] = mergeDeep(target[key], source[key])
      } else {
        Object.assign(output, { [key]: source[key] })
      }
    })
  }
  return output
}
