import type { ComputedRef } from 'vue'
import type { ECharts } from 'echarts/core'
import type { TimeGrain } from './format'

export type ChartDir = 'ltr' | 'rtl'

/** What an echarts-backed chart hands back through a template ref. */
export type ChartExposed = {
  /** The echarts instance, once the plot has a size to initialise into. */
  chart: ComputedRef<ECharts | undefined>
}

/** Deep-merged into the generated echarts option as a last-resort escape hatch. */
export type EchartOptionsOverride = Record<string, any>

export type ChartPaletteName = 'sequential' | 'categorical' | 'diverging'

/**
 * Which ramp series colors come from, or an explicit list of colors to cycle.
 * The named ramps read `--chart-*` from CSS, so they follow the app's theme.
 */
export type ChartPalette = ChartPaletteName | string[]

export type ChartXAxisConfig = {
  key: string
  /**
   * Inferred: `'time'` when every value in `key` is a `Date` or ISO date
   * string, `'category'` otherwise. Set it to override — e.g. `'category'` to
   * line dates up as evenly spaced buckets rather than on a real timeline.
   */
  type?: 'category' | 'time'
  /** Label granularity on a time axis. Inferred from the spacing of the data. */
  timeGrain?: TimeGrain
  title?: string
  echartOptions?: EchartOptionsOverride
}

export type ChartYAxisConfig = {
  title?: string
  min?: number
  max?: number
  echartOptions?: EchartOptionsOverride
}

/** The shape a series is drawn as. Mixing shapes in one chart is a combo chart. */
export type AxisSeriesType = 'bar' | 'line' | 'area'

export type AxisChartSeriesConfig = {
  /** Key in each data row that holds this series' value, and its identity. */
  name: string
  /** Display name. Falls back to the formatted `name`. */
  label?: string
  color?: string
  /**
   * Shape this series is drawn as. Unset draws it as the chart's own shape, so
   * a `LineChart` series is a line until it says otherwise.
   */
  type?: AxisSeriesType
  /**
   * Which value axis this series is measured against. `'y2'` gives a series in
   * a different unit or magnitude its own scale, opposite the primary. Ignored
   * on a horizontal bar chart, which has no second value axis.
   */
  axis?: 'y' | 'y2'
  showDataLabels?: boolean
  echartOptions?: EchartOptionsOverride
}

/** Everything a cartesian chart config carries whatever it draws. */
export type AxisChartBaseConfig<
  S extends AxisChartSeriesConfig = AxisChartSeriesConfig,
> = {
  data: Record<string, any>[]
  xAxis: ChartXAxisConfig
  yAxis?: ChartYAxisConfig
  /**
   * The second value axis, drawn opposite the primary. Only read when a series
   * sets `axis: 'y2'`, and never on a horizontal bar chart — two value axes
   * along the top and bottom of the plot are unreadable.
   */
  y2Axis?: ChartYAxisConfig
  series: S[]
  title?: string
  subtitle?: string
  /**
   * Ramp series colors are drawn from. Defaults to `'sequential'`: one series
   * gets a single mid-blue, more get evenly spaced stops running dark to light.
   */
  palette?: ChartPalette
  /** Forces layout direction; defaults to document.documentElement.dir */
  dir?: ChartDir
  echartOptions?: EchartOptionsOverride
}

export type BarSeriesConfig = AxisChartSeriesConfig & {
  /** Groups series into separate stacks. Only read when `stacked` is on. */
  stackName?: string
}

export type LineSeriesConfig = AxisChartSeriesConfig & {
  /** Dash pattern of the line itself. Defaults to a solid stroke. */
  lineType?: 'solid' | 'dashed' | 'dotted'
  /** Stroke width in px. Defaults to 2. */
  lineWidth?: number
  /**
   * Marks every datapoint with a dot. Off by default — a clean line reads
   * better, and the dot for the hovered point appears anyway.
   */
  showDataPoints?: boolean
  /** Rounds the corners of the line instead of drawing straight segments. */
  smooth?: boolean
}

export type AreaSeriesConfig = LineSeriesConfig & {
  /** Groups series into separate stacks. Only read when `stacked` is on. */
  stackName?: string
  /** Overrides the chart-level `fillOpacity` for this series. */
  fillOpacity?: number
}

/**
 * One series as the option builder reads it. Every shape's style keys are here
 * together because any cartesian chart may draw any of them — the keys that
 * apply are the ones belonging to the series' own `type`.
 */
export type AxisSeriesConfig = BarSeriesConfig & AreaSeriesConfig

/**
 * The config behind every cartesian chart. Bar, line and area differ only in
 * the shape their series default to, so one config covers all three — and a
 * combo chart, which is a config whose series do not agree on a shape.
 */
export type AxisChartConfig = AxisChartBaseConfig<AxisSeriesConfig> & {
  /**
   * Series of the same shape sum on top of each other: bars into columns,
   * areas into bands. Lines never stack — a stacked line reads as an area.
   */
  stacked?: boolean
  /** Bars run left-to-right; the category axis moves to Y. */
  horizontal?: boolean
  /**
   * Bridges gaps left by null or non-numeric values. Off by default: a break in
   * the line is how missing data should read.
   */
  connectNulls?: boolean
  /**
   * Alpha of the fill under each area. Defaults to a faint wash that fades out
   * towards the axis; stacked areas default to a solid band instead.
   */
  fillOpacity?: number
}

export type DonutChartConfig = {
  data: Record<string, any>[]
  /** Row key holding the slice name. */
  categoryColumn: string
  /** Row key holding the slice size. */
  valueColumn: string
  title?: string
  subtitle?: string
  /**
   * Slices past this many are summed into a single "Others" slice. A ring stops
   * being readable long before the palette runs out, so it defaults to 9.
   */
  maxSlices?: number
  /**
   * Ramp slice colors are drawn from. Defaults to `'categorical'`: slices are
   * unrelated categories, not steps of one magnitude, so they read as separate
   * hues rather than as a ramp.
   */
  palette?: ChartPalette
  /**
   * Prints each slice's name and share next to the ring. Off by default: the
   * legend carries the same information without the leader lines.
   */
  showInlineLabels?: boolean
  /** Caption under the total in the middle. Defaults to the value column name. */
  centerLabel?: string
  /** `'half'` draws the ring as a semicircle; only the geometry changes. */
  variant?: DonutVariant
  /** Forces layout direction; defaults to document.documentElement.dir */
  dir?: ChartDir
  echartOptions?: EchartOptionsOverride
}

export type DonutVariant = 'full' | 'half'

/** One arc of the ring, after sorting, "Others" grouping and color assignment. */
export type DonutSlice = {
  /** Identity used by echarts actions and the legend. Unique within the ring. */
  name: string
  /** The category value as it should read; not unique. */
  label: string
  value: number
  /** Share of the *visible* total, so hiding a slice re-percentages the rest. */
  percent: number
  color: string
  hidden: boolean
  /** The row behind this slice, or every grouped row for the "Others" slice. */
  rows: Record<string, any>[]
  isOthers: boolean
}

export type DonutSliceEvent = {
  /** The slice as it reads, i.e. the category value or "Others". */
  name: string
  value: number
  percent: number
  /** One row, or every grouped row when the "Others" slice was clicked. */
  rows: Record<string, any>[]
}

export type FunnelChartConfig = {
  /** One row per stage, in process order. Rows are drawn as they arrive. */
  data: Record<string, any>[]
  /** Row key holding the stage name. */
  categoryColumn: string
  /** Row key holding how many reached the stage. */
  valueColumn: string
  title?: string
  subtitle?: string
  /**
   * Ramp the columns are colored from. Defaults to `'sequential'` reversed —
   * palest at the top of the funnel, deepest at the end — so the color darkens
   * as the population narrows.
   */
  palette?: ChartPalette
  /**
   * Prints each stage's share of the first stage under its value. On by
   * default: the conversion rate is what a funnel is read for.
   */
  showPercentages?: boolean
  /** Forces layout direction; defaults to document.documentElement.dir */
  dir?: ChartDir
}

/** One stage of the funnel, after coercion and percentage arithmetic. */
export type FunnelStage = {
  index: number
  label: string
  value: number
  /** Share of the first stage, i.e. the conversion rate to here. 0-100. */
  percentOfFirst: number
  /** Share of the preceding stage. 0-100; the first stage's is 100. */
  percentOfPrevious: number
  row: Record<string, any>
}

export type FunnelStageEvent = {
  label: string
  value: number
  index: number
  row: Record<string, any>
}

/**
 * Which continuous ramp cells are colored from, or an explicit list of stops to
 * interpolate between. Only the continuous ramps: a heatmap reads one measure
 * across a scale, so the categorical palette has nothing to say here.
 */
export type HeatmapPalette = 'sequential' | 'diverging' | string[]

export type HeatmapChartConfig = {
  /** One row per cell. Rows with no numeric value leave their cell undrawn. */
  data: Record<string, any>[]
  /** Row key holding the column a cell sits in. */
  xColumn: string
  /** Row key holding the row a cell sits in. */
  yColumn: string
  /** Row key holding the magnitude the cell is colored by. */
  valueColumn: string
  title?: string
  subtitle?: string
  /**
   * Ramp cells are colored from. Defaults to `'sequential'`, which is what a
   * magnitude reads as; `'diverging'` is for signed data, and centers the scale
   * on zero unless `min`/`max` say otherwise.
   */
  palette?: HeatmapPalette
  /** Bottom of the color scale. Defaults to the smallest value in the data. */
  min?: number
  /** Top of the color scale. Defaults to the largest value in the data. */
  max?: number
  /**
   * Prints each cell's value inside it. Labels that would collide with a
   * neighbour are dropped, so a grid too fine to carry numbers shows none.
   */
  showValues?: boolean
  /** Forces layout direction; defaults to document.documentElement.dir */
  dir?: ChartDir
  echartOptions?: EchartOptionsOverride
}

/** One drawn cell of the grid, after category indexing and color assignment. */
export type HeatmapCell = {
  /** The x category as it reads. */
  x: string
  /** The y category as it reads. */
  y: string
  xIndex: number
  yIndex: number
  value: number
  color: string
  row: Record<string, any>
}

/** The grid as the plot, the tooltip and the ramp scale all read it. */
export type HeatmapMatrix = {
  /** Columns, in the order the rows first mention them. */
  xCategories: string[]
  /** Rows, in the order the rows first mention them. Drawn top to bottom. */
  yCategories: string[]
  cells: HeatmapCell[]
  /** Bottom of the color scale, config or data. */
  min: number
  /** Top of the color scale, config or data. */
  max: number
  /** The ramp the scale runs along, low end first. */
  stops: string[]
}

export type HeatmapCellEvent = {
  x: string
  y: string
  value: number
  row: Record<string, any>
}

export type NumberCardConfig = {
  title: string
  /** Null renders the empty state; a KPI with no number is not a zero. */
  value: number | null
  prefix?: string
  suffix?: string
  /** Change against the comparison period. Sign drives the arrow. */
  delta?: number | null
  /** Unit printed after the delta, e.g. `'%'`. */
  deltaSuffix?: string
  /** What the delta is measured against, e.g. `'vs last month'`. */
  deltaCaption?: string
  /** Flips the delta colors, for metrics like churn or cost. */
  negativeIsBetter?: boolean
  /** Decimal places. Defaults to as many as the value carries, up to 2. */
  precision?: number
  /** Shortens the value, `12300` -> `12.3K`. */
  compact?: boolean
  /** Forces layout direction; defaults to document.documentElement.dir */
  dir?: ChartDir
  /** A trend across the bottom of the card: shape only, no axes to read against. */
  sparkline?: NumberCardSparkline
}

export type NumberCardSparkline = {
  /** Oldest reading first. Gaps are skipped, not drawn as zero. */
  data: (number | null | undefined)[]
  /**
   * `line` for a continuous reading, `bar` for one the reader counts in
   * periods. Defaults to `line`.
   */
  type?: NumberCardSparklineType
  /** Overrides the sequential-palette blue the sparkline is drawn in. */
  color?: string
}

export type NumberCardSparklineType = 'line' | 'bar'

/**
 * Which edge of the plot the value-axis title heads, i.e. the edge that axis is
 * drawn on: the top for a column chart, the bottom for a row chart.
 */
export type PlotLabelPlacement = 'top' | 'bottom'

export type ChartLegendItem = {
  /** Series name, i.e. the identity used by echarts actions. */
  name: string
  label: string
  color: string
  hidden: boolean
  /** Muted note after the label, e.g. a donut slice's share of the total. */
  hint?: string
}

export type ChartTooltipItem = {
  name: string
  label: string
  color: string
  value: number
  formattedValue: string
  /** Share of the total, printed after the value. Only part-to-whole charts set it. */
  percent?: number
}

export type ChartDatapointEvent = {
  seriesName: string
  dataIndex: number
  value: number
  row: Record<string, any>
}
