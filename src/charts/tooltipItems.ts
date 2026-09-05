import type { AxisChartSeriesConfig, ChartTooltipItem } from './types'
import { seriesLabel } from './seriesData'

/**
 * The rows a shared tooltip prints for one plotted row.
 *
 * Ranked by magnitude, biggest contributor first: every row here is a mark the
 * reader can find on the plot, so the order says which one dominates.
 */
export type TooltipItemsArgs = {
  /** The plotted row under the pointer. */
  row: Record<string, any>
  series: AxisChartSeriesConfig[]
  /** Series the legend has switched off, by name. */
  hiddenSeries: string[]
  /** Keyed by series name. */
  colors: Record<string, string>
  /** Prints a series value in the unit of the axis it is drawn against. */
  formatSeries: (series: AxisChartSeriesConfig, value: number) => string
  /** Each series' share of its stack, row by row. Only a normalized plot sets it. */
  shares?: Map<string, (number | null)[]>
  /** Index of `row`, which is how `shares` is addressed. */
  index: number
}

export function buildTooltipItems(args: TooltipItemsArgs): ChartTooltipItem[] {
  return args.series
    .filter((series) => !args.hiddenSeries.includes(series.name))
    .map((series) => {
      const value = Number(args.row[series.name])
      return {
        name: series.name,
        label: seriesLabel(series),
        color: args.colors[series.name],
        value,
        formattedValue: args.formatSeries(series, value),
        // A normalized plot draws the share, so the tooltip is the only place
        // the measured number survives — it carries both.
        percent: args.shares?.get(series.name)?.[args.index] ?? undefined,
      }
    })
    // A series that silently drops out of the tooltip reads as a bug, so a zero
    // stays. Only a blank cell is dropped.
    .filter((item) => !isNaN(item.value))
    .sort((a, b) => b.value - a.value)
}
