import {
  getTitleOptions,
  PADDING_TOP,
  SUBTITLE_HEIGHT,
  TITLE_BOTTOM,
  TITLE_HEIGHT,
} from './eChartOptions'
import { formatValue } from './helpers'
import { FunnelChartConfig } from './types'

export default function getFunnelChartOptions(config: FunnelChartConfig) {
  let data = config.data || []

  const labelPosition = 'alternate'
  const hasSubtitle = config.subtitle ? 1 : 0

  const labels = data.map((row) => row[config.categoryColumn])
  const values = data.map((row) => row[config.valueColumn])
  const total = values[0]

  const blueGradient = [
    '#2d87d6',
    '#4393da',
    '#589fdf',
    '#6dace3',
    '#83b8e7',
    '#98c4eb',
    '#c3dcf3',
    '#d8e9f7',
    '#edf5fc',
    '#ffffff',
  ]
  const colors = blueGradient

  return {
    animation: true,
    animationDuration: 700,
    color: colors,
    textStyle: { fontFamily: ['InterVar', 'sans-serif'] },
    title: getTitleOptions(config.title, config.subtitle),
    series: [
      {
        name: 'Funnel',
        type: 'funnel',
        orient: 'vertical',
        funnelAlign: 'center',
        top:
          PADDING_TOP +
          TITLE_HEIGHT +
          SUBTITLE_HEIGHT * hasSubtitle +
          TITLE_BOTTOM,
        left: 'center',
        width: '60%',
        height: '75%',
        minSize: '10px',
        maxSize: '100%',
        sort: 'descending',
        label: {
          show: true,
          position: 'inside',
          lineHeight: 16,
          formatter: (params: any) => {
            const index = labels.indexOf(params.name)
            const value = formatValue(values[index], 1, true)
            if (!config.showPercentages) {
              return value
            }
            const percentage = Number((values[index] / total) * 100).toFixed(0)
            return `${value} (${percentage}%)`
          },
        },
        labelLine: { show: false },
        gap: 6,
        data: values.map((value, index) => ({
          name: labels[index],
          value: value,
          itemStyle: {
            color: colors[index],
            borderColor: colors[index],
            borderWidth: 4,
            borderCap: 'round',
            borderJoin: 'round',
          },
          emphasis: {
            itemStyle: {
              color: colors[index],
              borderColor: colors[index],
              borderWidth: 6,
              borderCap: 'round',
              borderJoin: 'round',
            },
          },
        })),
      },
    ],
    tooltip: {
      trigger: 'item',
      confine: true,
      appendToBody: false,
      formatter: function (params: any) {
        const p = params as any
        const value = p.value
        const percentage = total > 0 ? (value / total) * 100 : 0
        const formatted = isNaN(value) ? value : formatValue(value, 1, true)
        const formattedPercentage = percentage.toFixed(0)
        return `
          <div class="flex items-center justify-between gap-5">
            <div>${p.name}</div>
            <div class="font-bold">
              ${formatted} (${formattedPercentage}%)
            </div>
          </div>
        `
      },
    },
  }
}
