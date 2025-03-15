import { TimeGrain } from './helpers'

export type SeriesConfig = {
	name: string
	type: 'bar' | 'line' | 'area'
	color?: string
	axis?: 'y' | 'y2'
	showDataLabels?: boolean
}

export type AxisChartConfig = {
	title: string
	subtitle?: string
	colors?: string[]
	x: string
	xType: 'category' | 'time' | 'value'
	timeGrain?: TimeGrain
	series: SeriesConfig[]
	xAxisTitle?: string
	yAxisTitle?: string
	y2AxisTitle?: string
	swapAxes?: boolean
}

export type BarChartConfig = AxisChartConfig & {
	stacked?: boolean
}
