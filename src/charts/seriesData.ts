import type {
  AxisChartBaseConfig,
  AxisChartProps,
  AxisChartSeriesConfig,
  ChartCategoryFormatter,
  ChartValueAxisOptions,
  ChartValueFormatter,
  ChartYAxisConfig,
} from './types'
import { toNumber } from './axisChartCommon'
import { OTHERS_KEY, OTHERS_LABEL } from './utils'

/** Below two there is nothing left to collapse into. */
const MIN_MAX_SERIES = 2

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

  if (import.meta.env.DEV && props.series && yColumns.length > 1) {
    console.warn(
      `[frappe-ui] \`series="${props.series}"\` reads long data, which has one value column. Reading \`y\` as "${yColumns[0]}" and ignoring the rest.`,
    )
  }

  if (import.meta.env.DEV && props.maxSeries !== undefined && !props.series) {
    console.warn(
      `[frappe-ui] \`maxSeries\` caps the series a \`series\` column produces. \`y\` names its columns one by one, so nothing is capped.`,
    )
  }

  const { data, names } = props.series
    ? capSeries(
        pivot(rows, props.x, yColumns[0], props.series),
        props.maxSeries,
      )
    : { data: rows, names: yColumns }

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
      series: names.map((name) => buildSeries(name, props)),
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

/**
 * One series, i.e. one column of wide data or one value of the grouping column.
 * The style is spread whole, `axis` included: which scale a series is measured
 * against is per-series meaning, and it lives where the rest of that meaning
 * does. Nothing here reads the axis, so a series never leaves the place `y` put
 * it — which is what keeps the palette on the caller's column order.
 */
function buildSeries(
  name: string,
  props: AxisChartProps,
): AxisChartSeriesConfig {
  // A saved config outlives the query behind it, so a `seriesConfig` entry for a
  // column that is no longer selected is expected, not an error.
  const style = props.seriesConfig?.[name]
  return {
    // The collapsed tail has no column behind it, so its label comes from here
    // rather than from the data. Ahead of the style: a `seriesConfig` entry for
    // the reserved key renames and colors it like any other series.
    ...(name === OTHERS_KEY ? { label: OTHERS_LABEL } : {}),
    ...style,
    name,
  }
}

function toColumns(value?: string | string[]): string[] {
  if (!value) return []
  return Array.isArray(value) ? value.filter(Boolean) : [value]
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

type Pivoted = { data: Record<string, any>[]; names: string[] }

/**
 * Series past the cap are summed into one "Others" series, the way slices past
 * `maxSlices` are summed into one arc. The rows are the pivot's own, so the
 * collapse rewrites them in place.
 */
function capSeries(pivoted: Pivoted, maxSeries?: number): Pivoted {
  const { data, names } = pivoted
  if (!maxSeries) return pivoted

  const max = Math.max(MIN_MAX_SERIES, maxSeries)
  if (names.length <= max) return pivoted

  const weights = seriesWeights(data, names)
  const ranked = [...names].sort((a, b) => weights[b] - weights[a])
  // One of the slots goes to "Others" itself.
  const kept = new Set(ranked.slice(0, max - 1))

  // The cap picks by size, but the survivors keep the order the data put them
  // in — the same order the uncapped chart draws, minus the tail. "Others" ends
  // the list, which is where a remainder reads in a stack and in the legend.
  const collapsed = names.filter((name) => !kept.has(name))
  for (const row of data) {
    let total: number | null = null
    for (const name of collapsed) {
      const value = toNumber(row[name])
      if (value !== null) total = (total ?? 0) + value
      delete row[name]
    }
    // An x where every collapsed series was missing stays missing, not zero.
    row[OTHERS_KEY] = total
  }

  return {
    data,
    names: [...names.filter((name) => kept.has(name)), OTHERS_KEY],
  }
}

/**
 * What each series is worth across the whole chart, which is what decides who
 * survives the cap. Magnitude rather than signed total: a series that runs
 * large and negative carries the chart as much as one that runs large.
 */
function seriesWeights(rows: Record<string, any>[], names: string[]) {
  const weights: Record<string, number> = {}
  for (const name of names) weights[name] = 0
  for (const row of rows) {
    for (const name of names) {
      weights[name] += Math.abs(toNumber(row[name]) ?? 0)
    }
  }
  return weights
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
