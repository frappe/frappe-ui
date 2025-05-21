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
    echartOptions?: {
      [key: string]: any
    }
  }
  yAxis: {
    title?: string
    yMin?: number
    yMax?: number
    echartOptions?: {
      [key: string]: any
    }
  }
  y2Axis?: {
    title?: string
    yMin?: number
    yMax?: number
    echartOptions?: {
      [key: string]: any
    }
  }
  swapXY?: boolean
  stacked?: boolean
  series: (BarSeriesConfig | LineSeriesConfig | AreaSeriesConfig)[]
  echartOptions?: {
    [key: string]: any
  }
}

export type SeriesConfig = {
  name: string
  type: 'bar' | 'line' | 'area'
  color?: string
  axis?: 'y' | 'y2'
  showDataLabels?: boolean
  echartOptions?: {
    [key: string]: any
  }
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
  echartOptions?: {
    [key: string]: any
  }
}

export type FunnelChartConfig = {
  data: Record<string, any>[]
  title: string
  subtitle?: string
  colors?: string[]
  categoryColumn: string
  valueColumn: string
  showPercentages?: boolean
  echartOptions?: {
    [key: string]: any
  }
}

export type NumberChartConfig = {
  title: string
  value: number
  prefix?: string
  suffix?: string
  delta?: number
  deltaPrefix?: string
  deltaSuffix?: string
  negativeIsBetter?: boolean
}
