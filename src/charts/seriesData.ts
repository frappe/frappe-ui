import type {
  AxisChartBaseConfig,
  AxisChartProps,
  AxisChartSeriesConfig,
  ChartCategoryFormatter,
  ChartTooltipColumn,
  ChartValueAxisOptions,
  ChartValueFormatter,
  ChartYAxisConfig,
  SeriesStyle,
} from './types'
import { toNumber } from './axisChartCommon'
import { formatLabel } from './format'
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

export type ResolvedTooltipColumn = ChartTooltipColumn & { label: string }

export type NormalizedAxisChart = {
  config: AxisChartBaseConfig
  format: AxisChartFormatters
  /**
   * The tooltip-only columns, resolved. They travel beside the config rather
   * than inside it: the option builders read the config, and nothing an option
   * builder draws should learn that these exist.
   */
  tooltipColumns: ResolvedTooltipColumn[]
}

/**
 * Flat props to the shape the option builders read: the series list, and wide
 * data for them to index into. Long data (`splitBy` naming the column to split
 * on) is pivoted here, which is what keeps the builders unaware of the two layouts.
 */
export function normalizeAxisChartProps(
  props: AxisChartProps,
): NormalizedAxisChart {
  const rows = props.data ?? []
  const yColumns = toColumns(props.y)
  const y2Columns = toColumns(props.y2)

  if (import.meta.env.DEV && props.splitBy && yColumns.length > 1) {
    console.warn(
      `[frappe-ui] \`splitBy="${props.splitBy}"\` reads long data, which has one value column. Reading \`y\` as "${yColumns[0]}" and ignoring the rest.`,
    )
  }

  if (import.meta.env.DEV && props.maxSeries !== undefined && !props.splitBy) {
    console.warn(
      `[frappe-ui] \`maxSeries\` caps the series \`splitBy\` produces. \`y\` names its columns one by one, so nothing is capped.`,
    )
  }

  const tooltipColumns = (props.tooltipColumns ?? []).map((column) => ({
    ...column,
    label: column.label ?? formatLabel(column.name),
  }))

  // `splitBy` splits `y` and nothing else, so a `y2` column is carried across
  // the pivot untouched and drawn as one series of its own.
  const { data, names: primary } = props.splitBy
    ? capSeries(
        pivot(rows, props.x, yColumns[0], props.splitBy, [
          ...y2Columns,
          ...tooltipColumns.map((column) => column.name),
        ]),
        props.maxSeries,
      )
    : { data: rows, names: yColumns }

  // A pivoted row holds one value per key, so a group value equal to a tooltip
  // column's name lands on the same key and the plotted measure wins. Keeping
  // the column would print the measure under the column's label.
  const clobbered = props.splitBy
    ? tooltipColumns.filter((column) => primary.includes(column.name))
    : []

  if (import.meta.env.DEV && clobbered.length) {
    const named = clobbered.map((column) => `"${column.name}"`).join(', ')
    console.warn(
      `[frappe-ui] \`splitBy="${props.splitBy}"\` produces a series named ${named}, which \`tooltipColumns\` also names. The series keeps the key and the column is dropped. Rename the column, or change the values in "${props.splitBy}".`,
    )
  }

  // A series is its own column name, so a name the primary axis already drew
  // cannot come back on the second one.
  const shadowed = y2Columns.filter((name) => primary.includes(name))

  if (import.meta.env.DEV && shadowed.length) {
    const named = shadowed.map((name) => `"${name}"`).join(', ')
    console.warn(
      `[frappe-ui] \`y2\` names ${named}, which the chart already draws against the primary axis. A series is its own name, so the second one is dropped.`,
    )
  }

  const names = [
    ...primary.map((name) => ({ name, axis: 'y' as const })),
    ...y2Columns
      .filter((name) => !shadowed.includes(name))
      .map((name) => ({ name, axis: 'y2' as const })),
  ]

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
      series: names.map(({ name, axis }) => buildSeries(name, axis, props)),
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
    tooltipColumns: tooltipColumns.filter(
      (column) => !clobbered.includes(column),
    ),
  }
}

/** What a series is called wherever it is printed: legend, tooltip, reading. */
export function seriesLabel(series: AxisChartSeriesConfig) {
  return series.label ?? formatLabel(series.name)
}

/**
 * The look keys a chart sets for every series at once. With `splitBy` the
 * series names come from the data, so a chart-level default is the only way to
 * reach all of them.
 */
const LOOK_KEYS = [
  'showDataLabels',
  'smooth',
  'showDataPoints',
  'dashed',
  'connectNulls',
] as const

/**
 * One series, i.e. one column of wide data or one value of `splitBy`. `axis`
 * comes from the prop that named the column rather than from the style: which
 * scale a series is read against is which list it was written in, so the
 * series draw and take their palette slots in that one order.
 */
function buildSeries(
  name: string,
  axis: 'y' | 'y2',
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
    ...styleWithoutAxis(style),
    ...seriesLook(props, style),
    ...(axis === 'y2' ? { axis } : {}),
    name,
  }
}

/**
 * The entry as a series wears it. `axis` is dropped rather than spread: a
 * stored config written against the removed `seriesConfig[key].axis` still
 * carries the key, and letting it through would move a `y` column across and
 * leave a second spelling of what `y2` alone now says.
 */
function styleWithoutAxis(style?: SeriesStyle) {
  if (!style) return undefined
  const { axis: _axis, ...rest } = style as SeriesStyle & { axis?: unknown }
  return rest
}

/**
 * Each look key as the series draws it: its own value, else the chart's. The
 * one place the chart-level default is resolved, so nothing downstream reads
 * two sources for one key.
 */
function seriesLook(props: AxisChartProps, style?: SeriesStyle) {
  const look: Pick<SeriesStyle, (typeof LOOK_KEYS)[number]> = {}
  for (const key of LOOK_KEYS) {
    const value = style?.[key] ?? props[key]
    // An unset key stays absent rather than arriving as `undefined`, so a
    // series still equals the plain object it would have been without one.
    if (value !== undefined) look[key] = value
  }
  return look
}

function toColumns(value?: string | string[]): string[] {
  if (!value) return []
  return Array.isArray(value) ? value.filter(Boolean) : [value]
}

/**
 * Long rows to wide: one row per x value, one column per value of `splitBy`.
 * Both orders follow first appearance in the data, so the caller's sort
 * survives. Duplicate (x, splitBy) pairs are last-write-wins.
 *
 * `carry` names columns to copy across untouched. A tooltip column reads per
 * category, not per group, so the first row to reach a category decides its
 * value.
 */
function pivot(
  rows: Record<string, any>[],
  x: string,
  y: string,
  splitBy: string,
  carry: string[] = [],
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
      for (const column of carry) wide[column] = row[column]
      byCategory.set(key, wide)
    }
    const name = String(row[splitBy])
    if (!names.includes(name)) names.push(name)
    // Written after the carried columns, so a series named like one of them
    // keeps the plot's number rather than losing it to the tooltip's.
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
