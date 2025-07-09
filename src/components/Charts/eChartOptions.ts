import { formatDate, formatLabel, formatValue, mergeDeep } from './helpers'
import { AxisChartConfig } from './types'

export const PADDING_TOP = 0
export const PADDING_BOTTOM = 10
export const AXIS_TITLE_HEIGHT = 20
export const LEGEND_HEIGHT = 30
export const LEGEND_BOTTOM = 10
export const TITLE_HEIGHT = 20
export const SUBTITLE_HEIGHT = 18
export const TITLE_BOTTOM = 24

export default function useEchartsOptions(config: AxisChartConfig) {
  const title = config.title
  const subtitle = config.subtitle
  const hasTitle = title ? 1 : 0
  const hasSubtitle = subtitle ? 1 : 0
  const hasXAxisTitle = config.xAxis.title ? 1 : 0
  const hasYAxisTitle = config.yAxis.title ? 1 : 0
  const hasY2AxisTitle = config.y2Axis?.title ? 1 : 0
  const hasLegend = config.series.length > 1 ? 1 : 0

  const xAxisOptions = getXAxisOptions(config)
  const yAxisOptions = getYAxisOptions(config)

  return {
    animation: true,
    animationDuration: 700,
    textStyle: { fontFamily: ['InterVar', 'sans-serif'] },
    title: getTitleOptions(title, subtitle),
    color: config.colors,
    grid: {
      left: '1%',
      right: config.swapXY ? '2.5%' : '1.5%',
      top:
        PADDING_TOP +
        TITLE_HEIGHT * hasTitle +
        SUBTITLE_HEIGHT * hasSubtitle +
        TITLE_BOTTOM,
      bottom: PADDING_BOTTOM + LEGEND_HEIGHT * hasLegend,
      containLabel: true,
    },
    xAxis: xAxisOptions,
    yAxis: yAxisOptions,
    series: [],
    tooltip: {
      show: true,
      trigger: 'axis',
      formatter: (params: Object | Array<Object>) => {
        if (Array.isArray(params)) {
          params = params
            // remove zero values
            .filter((p) => p.value?.[1] !== 0)
            // sort in descending order by value
            .sort((a, b) => b.value?.[1] - a.value?.[1])
        }

        if (!Array.isArray(params)) {
          const p = params as any
          const value = config.swapXY ? p.value[0] : p.value[1]
          const formatted = isNaN(value) ? value : formatValue(value)
          return `
                <div class="flex items-center justify-between gap-5">
                  <div>${p.name}</div>
                  <div class="font-bold">${formatted}</div>
                </div>
              `
        }

        if (Array.isArray(params)) {
          const t = params.map((p, idx) => {
            const xValue = config.swapXY ? p.value[1] : p.value[0]
            const yValue = config.swapXY ? p.value[0] : p.value[1]
            const formattedX =
              config.xAxis.type == 'time'
                ? formatDate(xValue, undefined, config.xAxis.timeGrain)
                : xValue
            const formattedY = isNaN(yValue) ? yValue : formatValue(yValue)
            return `
              <div class="flex flex-col">
                ${idx == 0 ? `<div>${formattedX}</div>` : ''}
                <div class="flex items-center justify-between gap-5">
                  <div class="flex gap-1 items-center">
                    ${p.marker}
                    <div>${formatLabel(p.seriesName)}:</div>
                  </div>
                  <div class="font-bold">${formattedY}</div>
                </div>
              </div>
            `
          })
          return t.join('')
        }
      },
      confine: true,
      appendToBody: false,
      axisPointer: {
        type: 'shadow',
      },
    },
    legend: {
      show: hasLegend,
      type: 'scroll',
      bottom: LEGEND_BOTTOM,
      orient: 'horizontal',
      itemGap: 12,
      padding: [0, 25],
      formatter: function (name: string) {
        return formatLabel(name)
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
    },
  }
}

export function getTitleOptions(title: string, subtitle?: string) {
  return {
    top: '4px',
    left: '0.8%',
    text: title,
    subtext: subtitle,
    padding: 0,
    itemGap: -3,
    textStyle: {
      fontSize: 14,
      fontWeight: 500,
      lineHeight: 24,
      // color: titleColor
    },
    subtextStyle: {
      fontSize: 13,
      fontWeight: 400,
      lineHeight: 20,
      // color: subtitleColor,
    },
  }
}

function getXAxisOptions(config: AxisChartConfig) {
  const options = config.swapXY
    ? {
        show: true,
        type: 'value',
        z: 2,
        scale: false,
        boundaryGap: false,
        position: 'top',
        name: `${config.yAxis.title} →`,
        nameGap: 6,
        nameLocation: 'end',
        nameTextStyle: {
          align: 'right',
          verticalAlign: 'bottom',
          padding: [0, 0, 26, 0],
          // color: '#000',
          backgroundColor: '#fff',
          borderColor: '#fff',
          borderWidth: 4,
        },
        splitLine: {
          show: true,
          width: 1,
        },
        axisLine: {
          show: false,
          onZero: false,
        },
        axisTick: {
          show: false,
          alignWithLabel: true,
          formatter: function (value: number) {
            return formatValue(value, 1, true)
          },
        },
        axisLabel: {
          show: true,
          hideOverlap: true,
          margin: 8,
          formatter: function (value: number) {
            return formatValue(value, 1, true)
          },
        },
      }
    : {
        z: 2,
        type: config.xAxis.type,
        scale: true,
        splitLine: {
          show: false,
        },
        axisLine: {
          show: true,
        },
        axisTick: {
          show: false,
          alignWithLabel: true,
        },
        axisLabel: {
          show: true,
          hideOverlap: true,
          showMaxLabel:
            config.xAxis.type === 'category' || config.xAxis.type === 'value',
          margin: 8,
        },
      }

  return mergeDeep(options, config.swapXY ? config.yAxis.echartOptions : config.xAxis.echartOptions)
}

function getYAxisOptions(config: AxisChartConfig) {
  let primaryYAxisOptions = config.swapXY
    ? {
        show: true,
        type: config.xAxis.type,
        z: 2,
        scale: true,
        inverse: 'true',
        splitLine: {
          show: false,
        },
        axisLine: {
          show: true,
        },
        axisTick: {
          show: false,
          alignWithLabel: true,
        },
        axisLabel: {
          show: true,
          hideOverlap: true,
          margin: 6,
        },
      }
    : {
        show: true,
        type: 'value',
        z: 2,
        scale: false,
        boundaryGap: ['0%', '1%'],
        name: `↑ ${config.yAxis.title}`,
        nameGap: 6,
        nameLocation: 'end',
        nameTextStyle: {
          align: 'left',
          verticalAlign: 'top',
          padding: [0, 0, 0, -2],
          // color: '#000',
          backgroundColor: '#fff',
          borderColor: '#fff',
          borderWidth: 4,
        },
        splitLine: {
          show: true,
          width: 1,
        },
        axisLine: {
          show: false,
          onZero: false,
        },
        axisTick: {
          show: false,
          alignWithLabel: true,
        },
        axisLabel: {
          show: true,
          hideOverlap: true,
          margin: 8,
          formatter: function (value: number) {
            return formatValue(value, 1, true)
          },
        },
        min: config.yAxis.yMin,
        max: config.yAxis.yMax,
      }

  primaryYAxisOptions = mergeDeep(
    primaryYAxisOptions,
    config.swapXY ? config.xAxis.echartOptions : config.yAxis.echartOptions
  )

  let secondaryYAxisOptions = {
    show: false,
    type: 'value',
    z: 2,
    alignTicks: true,
    scale: false,
    boundaryGap: ['0%', '1%'],
    name: `${config.y2Axis?.title} ↑`,
    nameLocation: 'end',
    nameTextStyle: {
      align: 'right',
      verticalAlign: 'top',
      padding: [0, 5, 0, 0],
      // color: '#000',
      backgroundColor: '#fff',
    },
    nameGap: 6,
    splitLine: {
      show: true,
      width: 1,
    },
    axisLine: {
      show: false,
      onZero: false,
    },
    axisTick: {
      show: false,
      alignWithLabel: true,
    },
    axisLabel: {
      show: true,
      hideOverlap: true,
      margin: 8,
      formatter: function (value: number) {
        return formatValue(value, 1, true)
      },
      // color: '#000',
    },
    min: config.y2Axis?.yMin,
    max: config.y2Axis?.yMax,
  }

  secondaryYAxisOptions = mergeDeep(
    secondaryYAxisOptions,
    config.swapXY ? config.y2Axis?.echartOptions : config.y2Axis?.echartOptions
  )

  return config.swapXY
    ? [primaryYAxisOptions]
    : [primaryYAxisOptions, secondaryYAxisOptions]
}
