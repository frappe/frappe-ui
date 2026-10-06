// One set of cards per row of the design's "Charts type" rail
// (espresso-2.0, 35795:203360). The file draws the cards empty, so what
// each holds is this playground's: the library's own option builders
// (experimental/Charts) wherever it has one for the type — bar, line and
// area through the axis chart, pie through the donut, the funnel — and a
// plain ECharts option for the rest, all drawn in whichever palette the
// Theme group has picked.
import type { EChartsOption } from 'echarts'
import useAxisChartOptions from '../../experimental/Charts/axisChartOptions'
import useDonutChartOptions from '../../experimental/Charts/donutChartOptions'
import getFunnelChartOptions from '../../experimental/Charts/funnelChartOptions'
import type { AxisChartConfig } from '../../experimental/Charts/types'

export type ChartType =
  | 'bar'
  | 'sparkline'
  | 'area'
  | 'scatter'
  | 'bubble'
  | 'heatmap'
  | 'line'
  | 'funnel'
  | 'annotation'
  | 'pie'

/** the rail's rows, in the file's order and words */
export const CHART_TYPES: Array<{ id: ChartType; label: string }> = [
  { id: 'bar', label: 'Bar charts' },
  { id: 'sparkline', label: 'Spark line charts' },
  { id: 'area', label: 'Area Charts' },
  { id: 'scatter', label: 'Scatter plot' },
  { id: 'bubble', label: 'Bubble chart' },
  { id: 'heatmap', label: 'Heat map' },
  { id: 'line', label: 'Line chart' },
  { id: 'funnel', label: 'Funnel chart' },
  { id: 'annotation', label: 'Annotation' },
  { id: 'pie', label: 'Pie charts' },
]

export interface ChartCard {
  title: string
  options: EChartsOption
}

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]
const REVENUE = [42, 58, 51, 73, 66, 90, 84, 97, 88, 112, 104, 126]
const COSTS = [31, 36, 34, 45, 41, 52, 49, 58, 54, 63, 60, 71]
const PROFIT = REVENUE.map((r, i) => r - COSTS[i])
const USERS = [12, 19, 23, 28, 35, 41, 47, 56, 61, 70, 78, 89]

const monthly = MONTHS.map((month, i) => ({
  month,
  revenue: REVENUE[i],
  costs: COSTS[i],
  profit: PROFIT[i],
  users: USERS[i],
}))

const FONT = { fontFamily: ['InterVar', 'sans-serif'] }

/** the library's axis chart, as a card's option */
function axis(
  colors: string[],
  config: Omit<AxisChartConfig, 'data' | 'colors' | 'dir'> & {
    data?: Record<string, unknown>[]
  },
): EChartsOption {
  return useAxisChartOptions({
    data: monthly,
    dir: 'ltr',
    colors,
    ...config,
  }) as EChartsOption
}

/** an axis chart stripped to its line: no axes, no grid, no tooltip */
function spark(
  colors: string[],
  series: AxisChartConfig['series'],
  title: string,
): EChartsOption {
  return axis(colors, {
    title,
    xAxis: { key: 'month', type: 'category' },
    yAxis: {},
    series,
    echartOptions: {
      grid: { left: 8, right: 8, top: 56, bottom: 8, containLabel: false },
      xAxis: { show: false },
      yAxis: [{ show: false }, { show: false }],
      tooltip: { show: false },
      legend: { show: false },
    },
  })
}

function bars(colors: string[]): ChartCard[] {
  const xAxis = { key: 'month', type: 'category' as const }
  return [
    {
      title: 'Single series',
      options: axis(colors, {
        title: 'Revenue',
        subtitle: 'This year, by month',
        xAxis,
        yAxis: {},
        series: [{ name: 'revenue', type: 'bar' }],
      }),
    },
    {
      title: 'Grouped',
      options: axis(colors, {
        title: 'Revenue and costs',
        xAxis,
        yAxis: {},
        series: [
          { name: 'revenue', type: 'bar' },
          { name: 'costs', type: 'bar' },
        ],
      }),
    },
    {
      title: 'Stacked',
      options: axis(colors, {
        title: 'Costs and profit',
        subtitle: 'Stacked to revenue',
        xAxis,
        yAxis: {},
        stacked: true,
        series: [
          { name: 'costs', type: 'bar' },
          { name: 'profit', type: 'bar' },
        ],
      }),
    },
    {
      title: 'Horizontal',
      options: axis(colors, {
        title: 'Users',
        xAxis,
        yAxis: {},
        swapXY: true,
        series: [{ name: 'users', type: 'bar' }],
      }),
    },
    {
      title: 'With data labels',
      options: axis(colors, {
        title: 'Profit',
        subtitle: 'Labelled',
        xAxis,
        yAxis: {},
        series: [{ name: 'profit', type: 'bar', showDataLabels: true }],
      }),
    },
    {
      title: 'Bar and line',
      options: axis(colors, {
        title: 'Revenue and users',
        subtitle: 'Users on the second axis',
        xAxis,
        yAxis: { title: 'Revenue' },
        y2Axis: { title: 'Users' },
        series: [
          { name: 'revenue', type: 'bar' },
          { name: 'users', type: 'line', axis: 'y2', showDataPoints: true },
        ],
      }),
    },
  ]
}

function sparklines(colors: string[]): ChartCard[] {
  return [
    {
      title: 'Line',
      options: spark(colors, [{ name: 'revenue', type: 'line' }], 'Revenue'),
    },
    {
      title: 'Area',
      options: spark(colors, [{ name: 'users', type: 'area' }], 'Users'),
    },
    {
      title: 'Bars',
      options: spark(colors, [{ name: 'profit', type: 'bar' }], 'Profit'),
    },
    {
      title: 'Two lines',
      options: spark(
        colors,
        [
          { name: 'revenue', type: 'line' },
          { name: 'costs', type: 'line', lineType: 'dashed' },
        ],
        'Revenue against costs',
      ),
    },
  ]
}

function areas(colors: string[]): ChartCard[] {
  const xAxis = { key: 'month', type: 'category' as const }
  return [
    {
      title: 'Single area',
      options: axis(colors, {
        title: 'Users',
        subtitle: 'Growth this year',
        xAxis,
        yAxis: {},
        series: [{ name: 'users', type: 'area' }],
      }),
    },
    {
      title: 'Stacked areas',
      options: axis(colors, {
        title: 'Costs and profit',
        xAxis,
        yAxis: {},
        stacked: true,
        series: [
          { name: 'costs', type: 'area' },
          { name: 'profit', type: 'area' },
        ],
      }),
    },
    {
      title: 'Area with points',
      options: axis(colors, {
        title: 'Revenue',
        xAxis,
        yAxis: {},
        series: [
          {
            name: 'revenue',
            type: 'area',
            showDataPoints: true,
            fillOpacity: 0.15,
          },
        ],
      }),
    },
    {
      title: 'Area and line',
      options: axis(colors, {
        title: 'Revenue and costs',
        xAxis,
        yAxis: {},
        series: [
          { name: 'revenue', type: 'area' },
          { name: 'costs', type: 'line', lineType: 'dashed' },
        ],
      }),
    },
  ]
}

/** a seeded spread of points, the same on every load */
function points(n: number, seed: number): Array<[number, number]> {
  let s = seed
  const rand = () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
  return Array.from({ length: n }, () => {
    const x = Math.round(10 + rand() * 90)
    return [x, Math.round(x * 0.6 + rand() * 40)]
  })
}

const scatterBase = (title: string): EChartsOption => ({
  animation: true,
  animationDuration: 700,
  textStyle: FONT,
  title: { text: title, left: 0, textStyle: { fontSize: 14, fontWeight: 600 } },
  grid: { left: 8, right: 16, top: 48, bottom: 8, containLabel: true },
  tooltip: { trigger: 'item' },
  xAxis: { type: 'value', splitLine: { show: false } },
  yAxis: { type: 'value', splitLine: { lineStyle: { type: 'dashed' } } },
})

function scatters(colors: string[]): ChartCard[] {
  return [
    {
      title: 'One group',
      options: {
        ...scatterBase('Deal size against days to close'),
        color: colors,
        series: [{ type: 'scatter', symbolSize: 10, data: points(40, 7) }],
      },
    },
    {
      title: 'Two groups',
      options: {
        ...scatterBase('Inbound against outbound'),
        color: colors,
        legend: { bottom: 0 },
        grid: { left: 8, right: 16, top: 48, bottom: 32, containLabel: true },
        series: [
          {
            type: 'scatter',
            name: 'Inbound',
            symbolSize: 10,
            data: points(30, 11),
          },
          {
            type: 'scatter',
            name: 'Outbound',
            symbolSize: 10,
            data: points(30, 23),
          },
        ],
      },
    },
  ]
}

function bubbles(colors: string[]): ChartCard[] {
  const data = points(24, 5).map(([x, y], i) => [x, y, 8 + ((i * 7) % 30)])
  const size = (v: number[]) => Math.sqrt(v[2]) * 5
  return [
    {
      title: 'Sized by a third value',
      options: {
        ...scatterBase('Accounts by size'),
        color: colors,
        series: [{ type: 'scatter', data, symbolSize: size }],
      },
    },
    {
      title: 'Two groups',
      options: {
        ...scatterBase('Accounts by region'),
        color: colors,
        legend: { bottom: 0 },
        grid: { left: 8, right: 16, top: 48, bottom: 32, containLabel: true },
        series: [
          {
            type: 'scatter',
            name: 'North',
            data: data.slice(0, 12),
            symbolSize: size,
          },
          {
            type: 'scatter',
            name: 'South',
            data: data.slice(12),
            symbolSize: size,
          },
        ],
      },
    },
  ]
}

function heatmaps(colors: string[]): ChartCard[] {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const hours = ['6a', '8a', '10a', '12p', '2p', '4p', '6p', '8p']
  const cells: Array<[number, number, number]> = []
  days.forEach((_, d) =>
    hours.forEach((_, h) =>
      cells.push([
        h,
        d,
        Math.round(((d * 3 + h * 5) % 11) * 9 + (d === 5 || d === 6 ? 0 : 20)),
      ]),
    ),
  )
  const light = colors[colors.length - 1]
  const dark = colors[0]
  const base = (title: string): EChartsOption => ({
    animation: true,
    animationDuration: 700,
    textStyle: FONT,
    title: {
      text: title,
      left: 0,
      textStyle: { fontSize: 14, fontWeight: 600 },
    },
    tooltip: { position: 'top' },
    grid: { left: 8, right: 16, top: 48, bottom: 40, containLabel: true },
    xAxis: {
      type: 'category',
      data: hours,
      splitArea: { show: false },
      axisLine: { show: false },
      axisTick: { show: false },
    },
    yAxis: {
      type: 'category',
      data: days,
      axisLine: { show: false },
      axisTick: { show: false },
    },
  })
  return [
    {
      title: 'Activity by hour',
      options: {
        ...base('Activity by hour and day'),
        visualMap: {
          min: 0,
          max: 110,
          calculable: false,
          orient: 'horizontal',
          left: 'center',
          bottom: 0,
          itemHeight: 120,
          inRange: { color: [light, dark] },
        },
        series: [
          {
            type: 'heatmap',
            data: cells,
            itemStyle: { borderColor: '#fff', borderWidth: 2, borderRadius: 2 },
            emphasis: {
              itemStyle: { shadowBlur: 6, shadowColor: 'rgba(0,0,0,0.25)' },
            },
          },
        ],
      },
    },
    {
      title: 'Stepped scale',
      options: {
        ...base('Tickets by hour and day'),
        visualMap: {
          type: 'piecewise',
          min: 0,
          max: 110,
          splitNumber: colors.length,
          orient: 'horizontal',
          left: 'center',
          bottom: 0,
          inRange: { color: [...colors].reverse() },
        },
        series: [
          {
            type: 'heatmap',
            data: cells,
            itemStyle: { borderColor: '#fff', borderWidth: 2, borderRadius: 2 },
          },
        ],
      },
    },
  ]
}

function lines(colors: string[]): ChartCard[] {
  const xAxis = { key: 'month', type: 'category' as const }
  return [
    {
      title: 'Single line',
      options: axis(colors, {
        title: 'Revenue',
        subtitle: 'This year, by month',
        xAxis,
        yAxis: {},
        series: [{ name: 'revenue', type: 'line' }],
      }),
    },
    {
      title: 'Several lines',
      options: axis(colors, {
        title: 'Revenue, costs and profit',
        xAxis,
        yAxis: {},
        series: [
          { name: 'revenue', type: 'line' },
          { name: 'costs', type: 'line' },
          { name: 'profit', type: 'line' },
        ],
      }),
    },
    {
      title: 'With points',
      options: axis(colors, {
        title: 'Users',
        xAxis,
        yAxis: {},
        series: [{ name: 'users', type: 'line', showDataPoints: true }],
      }),
    },
    {
      title: 'Dashed and dotted',
      options: axis(colors, {
        title: 'Revenue against costs',
        xAxis,
        yAxis: {},
        series: [
          { name: 'revenue', type: 'line' },
          { name: 'costs', type: 'line', lineType: 'dashed' },
          { name: 'profit', type: 'line', lineType: 'dotted' },
        ],
      }),
    },
  ]
}

function funnels(colors: string[]): ChartCard[] {
  const stages = [
    { stage: 'Visited', count: 5400 },
    { stage: 'Signed up', count: 2900 },
    { stage: 'Trialled', count: 1600 },
    { stage: 'Converted', count: 740 },
    { stage: 'Renewed', count: 410 },
  ]
  const funnel = (title: string, showPercentages: boolean): EChartsOption => ({
    ...(getFunnelChartOptions({
      data: stages,
      title,
      dir: 'ltr',
      categoryColumn: 'stage',
      valueColumn: 'count',
      showPercentages,
    }) as EChartsOption),
    // the builder paints its own blue steps; the Theme group paints these
    color: colors,
  })
  return [
    { title: 'Counts', options: funnel('Sign-up funnel', false) },
    { title: 'Percentages', options: funnel('Sign-up funnel, by share', true) },
  ]
}

function annotations(colors: string[]): ChartCard[] {
  const xAxis = { key: 'month', type: 'category' as const }
  const mark = colors[0]
  return [
    {
      title: 'Average and peak',
      options: axis(colors, {
        title: 'Revenue',
        subtitle: 'Against the average',
        xAxis,
        yAxis: {},
        series: [
          {
            name: 'revenue',
            type: 'line',
            showDataPoints: true,
            echartOptions: {
              markLine: {
                symbol: 'none',
                lineStyle: { type: 'dashed', color: mark },
                label: { formatter: 'Avg {c}', position: 'insideEndTop' },
                data: [{ type: 'average', name: 'Average' }],
              },
              markPoint: {
                symbol: 'pin',
                symbolSize: 36,
                itemStyle: { color: mark },
                label: { fontSize: 10, color: '#fff' },
                data: [
                  { type: 'max', name: 'Peak' },
                  { type: 'min', name: 'Low' },
                ],
              },
            },
          },
        ],
      }),
    },
    {
      title: 'A marked span',
      options: axis(colors, {
        title: 'Users',
        subtitle: 'The campaign months',
        xAxis,
        yAxis: {},
        series: [
          {
            name: 'users',
            type: 'bar',
            echartOptions: {
              markArea: {
                itemStyle: { color: mark, opacity: 0.12 },
                label: { position: 'insideTop', color: mark, fontSize: 11 },
                data: [[{ name: 'Campaign', xAxis: 'Jun' }, { xAxis: 'Aug' }]],
              },
            },
          },
        ],
      }),
    },
    {
      title: 'A target line',
      options: axis(colors, {
        title: 'Profit',
        subtitle: 'Against the target',
        xAxis,
        yAxis: {},
        series: [
          {
            name: 'profit',
            type: 'bar',
            echartOptions: {
              markLine: {
                symbol: 'none',
                lineStyle: { color: mark, width: 1.5 },
                label: { formatter: 'Target', position: 'insideEndTop' },
                data: [{ yAxis: 40 }],
              },
            },
          },
        ],
      }),
    },
  ]
}

function pies(colors: string[]): ChartCard[] {
  const data = [
    { channel: 'Organic', share: 42 },
    { channel: 'Referral', share: 23 },
    { channel: 'Paid', share: 18 },
    { channel: 'Social', share: 11 },
    { channel: 'Other', share: 6 },
  ]
  const donut = (
    title: string,
    extra: Record<string, unknown> = {},
  ): EChartsOption =>
    useDonutChartOptions({
      data,
      title,
      dir: 'ltr',
      colors,
      categoryColumn: 'channel',
      valueColumn: 'share',
      ...extra,
    }) as EChartsOption
  return [
    { title: 'Donut', options: donut('Sign-ups by channel') },
    {
      title: 'Inline labels',
      options: donut('Sign-ups by channel', { showInlineLabels: true }),
    },
    {
      title: 'Pie',
      // the donut builder's ring, closed to a full pie
      options: (() => {
        const options = donut('Sign-ups by channel')
        const series = options.series as Array<{ radius?: unknown }>
        series[0].radius = ['0%', '70%']
        return options
      })(),
    },
  ]
}

const SETS: Record<ChartType, (colors: string[]) => ChartCard[]> = {
  bar: bars,
  sparkline: sparklines,
  area: areas,
  scatter: scatters,
  bubble: bubbles,
  heatmap: heatmaps,
  line: lines,
  funnel: funnels,
  annotation: annotations,
  pie: pies,
}

/** the cards for one row of the rail, in one palette */
export function chartCards(type: ChartType, colors: string[]): ChartCard[] {
  return SETS[type](colors)
}
