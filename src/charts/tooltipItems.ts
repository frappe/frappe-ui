import { formatValue } from './format'
import { seriesLabel } from './seriesData'
import type {
  AxisChartSeriesConfig,
  ChartTooltipItem,
  ChartTooltipSeries,
} from './types'

/**
 * The rows a shared tooltip prints for one plotted row.
 *
 * Two kinds, and the split is the whole point of this module. A `'series'` row
 * is a mark the reader can find on the plot, so the rows are ranked by
 * magnitude: biggest contributor first. A `'context'` row is a `tooltipSeries`
 * column, which is drawn nowhere and is usually measured in another unit — so
 * ranking it among the series would compare two things that do not compare.
 * The extras keep the author's order, and print after every series row.
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
  /** Each series' share of its stack, for this row. Only a normalized plot sets it. */
  shares?: Map<string, (number | null)[]>
  /** Index of `row`, which is how `shares` is addressed. */
  index: number
  tooltipSeries?: ChartTooltipSeries[]
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
  return (args.tooltipSeries ?? [])
    .map((extra) => ({ extra, value: args.row[extra.name] }))
    .filter(
      ({ value }) => value !== null && value !== undefined && value !== '',
    )
    .map(({ extra, value }) => ({
      name: extra.name,
      label: extra.label,
      value: typeof value === 'number' ? value : String(value),
      formattedValue: formatContextValue(extra, value),
      kind: 'context' as const,
    }))
}

/**
 * An extra sits on no axis, so it takes no formatter from one: its own, or the
 * default. Only a number is formatted — anything else is already text.
 */
function formatContextValue(extra: ChartTooltipSeries, value: any) {
  if (extra.format) return extra.format(value)
  return typeof value === 'number' ? formatValue(value) : String(value)
}
