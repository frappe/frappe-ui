import type {
  AxisChartProps,
  ChartCategoryFormatter,
  ChartValueFormatter,
  ChartValueAxisOptions,
} from './props'
import type {
  AxisChartBaseConfig,
  AxisChartSeriesConfig,
  ChartYAxisConfig,
} from './types'

/**
 * Formatters travel beside the config rather than inside it: the option builders
 * take plain data, so axis labels and the Vue tooltip apply these themselves.
 */
export type AxisChartFormatters = {
  x?: ChartCategoryFormatter
  y?: ChartValueFormatter
  y2?: ChartValueFormatter
}

export type NormalizedAxisChart = {
  config: AxisChartBaseConfig
  format: AxisChartFormatters
}

/**
 * Flat props to the shape the option builders read: the series list, and wide
 * data for them to index into. Long data (`series` naming a grouping column) is
 * pivoted here, which is what keeps the builders unaware of the two layouts.
 */
export function normalizeAxisChartProps(
  props: AxisChartProps,
): NormalizedAxisChart {
  const rows = props.data ?? []
  const yColumns = toColumns(props.y)
  const y2Columns = toColumns(props.y2)

  if (import.meta.env.DEV && props.series && yColumns.length > 1) {
    console.warn(
      `[frappe-ui] \`series="${props.series}"\` reads long data, which has one value column. Reading \`y\` as "${yColumns[0]}" and ignoring the rest.`,
    )
  }

  const { data, names } = props.series
    ? pivot(rows, props.x, yColumns[0], props.series)
    : { data: rows, names: mergeColumns(yColumns, y2Columns) }

  const secondary = new Set(props.series ? [] : y2Columns)

  return {
    config: {
      data,
      xAxis: {
        key: props.x,
        type: props.xAxis?.type,
        timeGrain: props.xAxis?.timeGrain,
        title: props.xAxis?.title,
        echartOptions: props.xAxis?.echartOptions,
      },
      yAxis: toValueAxis(props.yAxis),
      y2Axis: toValueAxis(props.y2Axis),
      series: names.map((name) => buildSeries(name, props, secondary)),
      referenceLines: props.referenceLines,
      title: props.title,
      subtitle: props.subtitle,
      palette: props.palette,
      dir: props.dir,
      echartOptions: props.echartOptions,
    },
    format: {
      x: props.xAxis?.format,
      y: props.yAxis?.format,
      y2: props.y2Axis?.format,
    },
  }
}

function buildSeries(
  name: string,
  props: AxisChartProps,
  secondary: Set<string>,
): AxisChartSeriesConfig {
  // A saved config outlives the query behind it, so a `seriesConfig` entry for a
  // column that is no longer selected is expected, not an error.
  const style = props.seriesConfig?.[name]
  return {
    ...style,
    name,
    ...(secondary.has(name) ? { axis: 'y2' as const } : {}),
  }
}

function toColumns(value?: string | string[]): string[] {
  if (!value) return []
  return Array.isArray(value) ? value.filter(Boolean) : [value]
}

/** `y2` columns need not repeat in `y`; the ones that do keep their `y` position. */
function mergeColumns(y: string[], y2: string[]): string[] {
  return [...y, ...y2.filter((column) => !y.includes(column))]
}

/**
 * Long rows to wide: one row per x value, one column per value of the grouping
 * column. Both orders follow first appearance in the data, so the caller's sort
 * survives. Duplicate (x, series) pairs are last-write-wins.
 */
function pivot(
  rows: Record<string, any>[],
  x: string,
  y: string,
  series: string,
) {
  const names: string[] = []
  // Keyed by the stringified x value: `Date` objects and numbers still have to
  // collapse onto one row per category.
  const byCategory = new Map<string, Record<string, any>>()

  for (const row of rows) {
    const key = String(row[x])
    let wide = byCategory.get(key)
    if (!wide) {
      wide = { [x]: row[x] }
      byCategory.set(key, wide)
    }
    const name = String(row[series])
    if (!names.includes(name)) names.push(name)
    wide[name] = row[y]
  }

  const data = [...byCategory.values()]
  for (const wide of data) {
    for (const name of names) {
      // A combination the data never mentions is missing, not zero: a null
      // leaves a gap in the line instead of drawing a drop to the baseline.
      if (!(name in wide)) wide[name] = null
    }
  }

  return { data, names }
}

function toValueAxis(
  options?: ChartValueAxisOptions,
): ChartYAxisConfig | undefined {
  if (!options) return undefined
  return {
    title: options.title,
    min: options.min,
    max: options.max,
    echartOptions: options.echartOptions,
  }
}
