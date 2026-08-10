import { DATA_LABEL_FONT_SIZE, DOTTED_LINE, toNumber } from './axisChartCommon'
import type { ChartTokens } from './tokens'
import type { ReferenceLine } from './types'

/** Heavier than a gridline: the rule is a statement, not part of the grid. */
const REFERENCE_LINE_WIDTH = 1.5

/**
 * Name of the series that carries the lines targeting one value axis. Prefixed
 * so it cannot collide with a data column, which is what every real series is
 * named after.
 */
const HOST_SERIES_NAME = '__frappe-ui-reference-lines'

export type ReferenceLineContext = {
  tokens: ChartTokens
  /** True when the category axis is Y, i.e. the value axis runs across the plot. */
  horizontal: boolean
  /** Whether the chart actually draws a second value axis. */
  hasSecondaryValueAxis: boolean
  /**
   * Whether one of the two axes carries categories. Defaults to true. A scatter
   * sets it false: both of its axes are value axes, so `'x'` names a numeric
   * scale rather than the categories, and a line on it is read as a number.
   */
  hasCategoryAxis?: boolean
  /**
   * The mark the empty host draws as. Defaults to `'line'`. echarts drops a
   * series whose type the chart never registered — and takes its `markLine`
   * with it, silently — so the host has to be a mark the chart already carries.
   * Which is also why it is not simply always `'scatter'`: an axis chart has no
   * scatter series either.
   */
  hostSeriesType?: 'line' | 'scatter'
}

/**
 * The empty series the reference lines ride on — one per value axis they target.
 *
 * A `markLine` inherits both the axis and the legend visibility of the series it
 * hangs off, so hosting one on a plotted series would read it against that
 * series' scale and let a legend toggle take the line away with the data. Each
 * host is a series of its own instead, carrying no data and no name a caller
 * ever sees: the legend and `hiddenSeries` are built from `config.series`, which
 * these are not part of.
 *
 * The host's own mark matters as much as the emptiness — a `'bar'` host would be
 * counted when echarts divides a category slot between the bars in it, and every
 * real bar would narrow to make room for one that draws nothing. See
 * `hostSeriesType` for the rest of that choice.
 */
export function buildReferenceLineSeries(
  lines: ReferenceLine[] | undefined,
  ctx: ReferenceLineContext,
): Record<string, any>[] {
  if (!lines?.length) return []

  // The value axis is Y, except on a horizontal chart where it runs across the plot.
  const axisIndexKey = ctx.horizontal ? 'xAxisIndex' : 'yAxisIndex'
  const hosts: Record<string, any>[] = []

  for (const axisIndex of [0, 1]) {
    const data = lines
      .filter((line) => hostIndex(line, ctx) === axisIndex)
      .map((line) => markLineEntry(line, ctx))
      .filter((entry) => entry !== null)

    if (!data.length) continue
    hosts.push({
      type: ctx.hostSeriesType ?? 'line',
      name: `${HOST_SERIES_NAME}-${axisIndex}`,
      data: [],
      silent: true,
      [axisIndexKey]: axisIndex,
      markLine: { silent: true, symbol: 'none', data },
    })
  }

  return hosts
}

/**
 * Which host a line rides. The same rule a series follows (see
 * `valueAxisIndex`): `'y2'` falls back to the primary axis on a chart that draws
 * only one, so a line never lands on a scale that is not there. A category line
 * has no value axis of its own and rides the primary host, whose category axis
 * is the same one.
 */
function hostIndex(line: ReferenceLine, ctx: ReferenceLineContext) {
  return ctx.hasSecondaryValueAxis && line.axis === 'y2' ? 1 : 0
}

function markLineEntry(
  line: ReferenceLine,
  { tokens, horizontal, hasCategoryAxis = true }: ReferenceLineContext,
): Record<string, any> | null {
  const onXAxis = line.axis === 'x'
  // A value-axis line is read as a number; a category one carries whatever the
  // category column holds, which may be a string or a date. On a chart with no
  // category axis, `'x'` is a value axis like any other and reads as a number.
  const onCategoryAxis = onXAxis && hasCategoryAxis
  const at = onCategoryAxis ? line.value : toNumber(line.value)
  if (at === null || at === undefined || at === '') return null

  // A line pinned to an x value draws as a vertical rule and one pinned to a y
  // value as a horizontal rule. `horizontal` swaps which axis carries the
  // categories, so it swaps the key each kind of line needs.
  const axisKey = onXAxis !== horizontal ? 'xAxis' : 'yAxis'
  // The ink data labels are printed in: a reference line annotates the plot, so
  // it should not read as another measure drawn in a palette color.
  const color = line.color || tokens.dataLabel

  return {
    [axisKey]: at,
    lineStyle: {
      // Every rule v2 draws that is not a mark — the gridlines, the category
      // baseline — carries this one dot texture, so a broken reference line
      // takes it too rather than introducing a second dash pattern.
      ...(line.dashed ? DOTTED_LINE : {}),
      width: REFERENCE_LINE_WIDTH,
      color,
    },
    ...(line.label
      ? {
          label: {
            show: true,
            position: 'insideEndTop',
            // A function rather than the string itself: echarts reads a string
            // formatter as a template, so a label with braces in it would come
            // out substituted.
            formatter: () => line.label,
            color,
            fontSize: DATA_LABEL_FONT_SIZE,
          },
        }
      : {}),
  }
}
