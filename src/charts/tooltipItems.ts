import { formatValue } from './format'
import { seriesLabel, type ResolvedTooltipColumn } from './seriesData'
import type { AxisChartSeriesConfig, ChartTooltipItem } from './types'

/**
 * The rows a shared tooltip prints for one plotted row. Series rows are ranked
 * by magnitude, biggest first. Context rows are drawn nowhere and usually in
 * another unit, so they keep the author's order and print after every series.
 */
export type TooltipItemsArgs = {
  row: Record<string, any>
  series: AxisChartSeriesConfig[]
  hiddenSeries: string[]
  colors: Record<string, string>
  /** Prints a series value in the unit of the axis it is drawn against. */
  formatSeries: (series: AxisChartSeriesConfig, value: number) => string
  /** Each series' share of its stack, for this row. Only a normalized plot sets it. */
  shares?: Map<string, (number | null)[]>
  index: number
  tooltipColumns?: ResolvedTooltipColumn[]
}

export function buildTooltipItems(args: TooltipItemsArgs): ChartTooltipItem[] {
  return [...seriesItems(args), ...contextItems(args)]
}

function seriesItems(args: TooltipItemsArgs): ChartTooltipItem[] {
  return (
    args.series
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
          kind: 'series' as const,
        }
      })
      // A series that silently drops out of the tooltip reads as a bug, so a zero
      // stays. Only a blank cell is dropped.
      .filter((item) => !isNaN(item.value as number))
      .sort((a, b) => (b.value as number) - (a.value as number))
  )
}

function contextItems(args: TooltipItemsArgs): ChartTooltipItem[] {
  return (args.tooltipColumns ?? [])
    .map((column) => ({ column, value: args.row[column.name] }))
    .filter(
      ({ value }) => value !== null && value !== undefined && value !== '',
    )
    .map(({ column, value }) => ({
      name: column.name,
      label: column.label,
      value: typeof value === 'number' ? value : String(value),
      formattedValue: formatColumnValue(column, value),
      kind: 'context' as const,
    }))
}

function formatColumnValue(column: ResolvedTooltipColumn, value: any) {
  if (column.format) return column.format(value)
  return typeof value === 'number' ? formatValue(value) : String(value)
}
