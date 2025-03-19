import useEchartsOptions from './eChartOptions'
import { formatValue } from './helpers'
import { LineChartConfig } from './types'

export default function useLineChartOptions(config: LineChartConfig, data: any) {
	const baseOptions = useEchartsOptions(config)

	if (config.xType === 'time' && config.swapAxes) {
		throw new Error('Swap axes is not supported for time series data')
	}

	const swapAxes = config.swapAxes
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
					labelPosition = swapAxes ? 'right' : 'top'
				}
			}

			return {
				type: s.type,
				name: s.name,
				data: data.map((row: any) => [
					swapAxes ? row[s.name] : row[config.x],
					swapAxes ? row[config.x] : row[s.name],
				]),
				stack: s.type === 'bar' && config.stacked ? 'stack' : undefined,
				yAxisIndex: s.axis === 'y2' ? 1 : 0,
				itemStyle: {
					color: s.color,
				},
				label: {
					show: s.showDataLabels,
					position: labelPosition,
					formatter: (params: any) => {
						const _val = swapAxes ? params.value?.[0] : params.value?.[1]
						return formatValue(_val, 1, true)
					},
					fontSize: 11,
				},
				labelLayout: { hideOverlap: true },
				barMaxWidth: 60,
			}
		}),
	}
}
