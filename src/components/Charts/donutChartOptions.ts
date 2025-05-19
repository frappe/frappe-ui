import { getTitleOptions } from './eChartOptions'
import { formatValue } from './helpers'
import { DonutChartConfig } from './types'

export default function useDonutChartOptions(config: DonutChartConfig) {
  let data = config.data || []

  data = data.sort((a, b) => {
    const aValue = a[config.valueColumn]
    const bValue = b[config.valueColumn]
    if (aValue === bValue) {
      return 0
    }
    return aValue > bValue ? -1 : 1
  })

  const labels = data.map((row) => row[config.categoryColumn])
  const values = data.map((row) => row[config.valueColumn])
  const total = values.reduce((acc, value) => {
    return isNaN(value) ? acc : acc + value
  }, 0)

  let radius = ['40%', '70%']
  let center = ['50%', '48%']

  if (config.subtitle) {
    radius = ['40%', '70%']
    center = ['50%', '50%']
  }

  if (config.showInlineLabels) {
    center = ['50%', '50%']
  }

  // legend position
  let orient = 'horizontal'
  let bottom = 0
  let left = 'center'
  // let padding = [30, 30, 10, 30]
  let padding = [0, 10, 10, 10]

  return {
    animation: true,
    animationDuration: 700,
    color: config.colors,
    textStyle: { fontFamily: ['InterVar', 'sans-serif'] },
    title: getTitleOptions(config.title, config.subtitle),
    dataset: {
      source: [
        [config.categoryColumn, config.valueColumn],
        ...data.map((r) => [r[config.categoryColumn], r[config.valueColumn]]),
      ],
    },
    series: [
      {
        type: 'pie',
        name: config.categoryColumn,
        center,
        radius,
        labelLine: {
          show: config.showInlineLabels,
          lineStyle: {
            width: 2,
          },
          length: 10,
          length2: 20,
          smooth: true,
        },
        label: {
          show: config.showInlineLabels,
          formatter: ({ value, name }: any) => {
            const percentage = total > 0 ? (value[1] / total) * 100 : 0
            return `${name} (${percentage.toFixed(0)}%)`
          },
        },
        emphasis: { scaleSize: 5 },
      },
    ],
    legend: !config.showInlineLabels
      ? {
          // top,
          left: left,
          bottom: bottom,
          padding: padding,
          orient: orient,
          show: true,
          type: 'scroll',
          itemGap: 12,
          formatter: function (name: string) {
            const labelIndex = labels.indexOf(name)
            const percentage =
              total > 0 ? (values[labelIndex] / total) * 100 : 0
            return `${name} (${percentage.toFixed(0)}%)`
          },
          textStyle: {
            padding: [0, 0, 0, -5],
            color: '#000',
          },
          icon: 'circle',
          pageIcons: {
            horizontal: [
              'M 17 3 h 2 c 0.386 0 0.738 0.223 0.904 0.572 s 0.115 0.762 -0.13 1.062 L 11.292 15 l 8.482 10.367 c 0.245 0.299 0.295 0.712 0.13 1.062 S 19.386 27 19 27 h -2 c -0.3 0 -0.584 -0.135 -0.774 -0.367 l -9 -11 c -0.301 -0.369 -0.301 -0.898 0 -1.267 l 9 -11 C 16.416 3.135 16.7 3 17 3 Z',
              'M 12 27 h -2 c -0.386 0 -0.738 -0.223 -0.904 -0.572 s -0.115 -0.762 0.13 -1.062 L 17.708 15 L 9.226 4.633 c -0.245 -0.299 -0.295 -0.712 -0.13 -1.062 S 9.614 3 10 3 h 2 c 0.3 0 0.584 0.135 0.774 0.367 l 9 11 c 0.301 0.369 0.301 0.898 0 1.267 l -9 11 C 12.584 26.865 12.3 27 12 27 Z',
            ],
          },
          pageIconColor: '#64748B',
          pageInactiveColor: '#C0CCDA',
          pageIconSize: 10,
          pageTextStyle: {
            color: '#64748B',
          },
          animationDurationUpdate: 300,
        }
      : null,
    tooltip: {
      trigger: 'item',
      confine: true,
      appendToBody: false,
      formatter: function (params: any) {
        const p = params as any
        const value = p.value[1]
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
