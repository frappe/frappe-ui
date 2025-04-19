import { TimeGrain } from './helpers'

export type AxisChartConfig = {
  data: Record<string, any>[]
  title: string
  subtitle?: string
  colors?: string[]
  xAxis: {
    key: string
    type: 'category' | 'time' | 'value'
    timeGrain?: TimeGrain
    title?: string
  }
  yAxis: {
    title?: string
    yMin?: number
    yMax?: number
  }
  y2Axis?: {
    title?: string
    yMin?: number
    yMax?: number
  }
  swapXY?: boolean
  stacked?: boolean
  series: (BarSeriesConfig | LineSeriesConfig | AreaSeriesConfig)[]
}

export type SeriesConfig = {
  name: string
  type: 'bar' | 'line' | 'area'
  color?: string
  axis?: 'y' | 'y2'
  showDataLabels?: boolean
}

export type BarSeriesConfig = SeriesConfig & {
  type: 'bar'
  stackName?: string
}

export type LineSeriesConfig = SeriesConfig & {
  type: 'line'
  lineType?: 'solid' | 'dashed' | 'dotted'
  lineWidth?: number
  showDataPoints?: boolean
}

export type AreaSeriesConfig = SeriesConfig & {
  type: 'area'
  showDataPoints?: boolean
  fillOpacity?: number
}


export type DonutChartConfig = {
  data: Record<string, any>[]
  title: string
  subtitle?: string
  colors?: string[]
  categoryColumn: string
  valueColumn: string
  maxSliceCount?: number
  showInlineLabels?: boolean
}
