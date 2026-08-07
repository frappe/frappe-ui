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

/**
 * What a series draws as. Every cartesian chart can hold every mark, so a bar
 * chart with one line series and an area chart are the same option with a
 * different default.
 */
export type ChartMark = 'bar' | 'line' | 'area'

export type AxisChartSeriesConfig = {
  /** Key in each data row that holds this series' value, and its identity. */
  name: string
  /** Display name. Falls back to the formatted `name`. */
  label?: string
  color?: string
  /** Mark this series draws as. Defaults to the chart's own mark. */
  type?: ChartMark
  /**
   * Which value axis this series is measured against. `'y2'` gives a series in
   * a different unit or magnitude its own scale, opposite the primary. Ignored
   * on a horizontal bar chart, which has no second value axis.
   */
  axis?: 'y' | 'y2'
  showDataLabels?: boolean
  /**
   * Groups series into separate stacks. Only read when `stacked` is on, and
   * only by the marks that stack — a line never does.
   */
  stackName?: string
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
  /** Overrides the chart-level `fillOpacity`. Read by an area series. */
  fillOpacity?: number
  echartOptions?: EchartOptionsOverride
}

/**
 * A rule drawn across the plot at a fixed position: a target, a threshold, a
 * budget, or the date something changed. An annotation rather than a series —
 * it has no legend entry, cannot be switched off, and is never in the tooltip.
 */
export type ReferenceLine = {
  /**
   * Where the line sits: a number on a value axis, or whatever the category
   * column holds on the category axis. A value outside the range the plot
   * covers is not drawn; the scale follows the data, not the annotation.
   */
  value: number | string | Date
  /**
   * Which axis `value` is read against. `'y'` (the default) and `'y2'` draw a
   * rule across the plot at a measured value; `'x'` draws one down it at a
   * category. `'y2'` reads against the primary axis on a chart that draws only
   * one, exactly as a series does.
   */
  axis?: 'y' | 'y2' | 'x'
  /** Printed at the far end of the line. Left out, the rule carries no text. */
  label?: string
  /** Defaults to the ink data labels are printed in, so it reads as an annotation. */
  color?: string
  /** Breaks the rule up, for a line that should not read as a hard boundary. */
  dashed?: boolean
}

/** Everything a cartesian chart config carries whatever it draws. */
export type AxisChartBaseConfig = {
  data: Record<string, any>[]
  xAxis: ChartXAxisConfig
  yAxis?: ChartYAxisConfig
  /**
   * The second value axis, drawn opposite the primary. Only read when a series
   * sets `axis: 'y2'`, and never on a horizontal bar chart — two value axes
   * along the top and bottom of the plot are unreadable.
   */
  y2Axis?: ChartYAxisConfig
  series: AxisChartSeriesConfig[]
  /** Rules drawn over the plot at fixed positions. Not series: see `ReferenceLine`. */
  referenceLines?: ReferenceLine[]
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

/**
 * What every cartesian chart hands its option builder. Bar, line and area
 * differ in one value — the mark their unmarked series draw as — so a combo
 * chart is not a fourth shape, it is this one with a mixed series list.
 */
export type AxisChartConfig = AxisChartBaseConfig & {
  /** Mark for series that name none: the chart component the caller picked. */
  type: ChartMark
  /**
   * Series sum on top of each other rather than standing side by side. Read by
   * the marks that stack, i.e. bars and areas; a line never stacks.
   */
  stacked?: boolean
  /** Bars run left-to-right; the category axis moves to Y. Bars only. */
  horizontal?: boolean
  /**
   * Bridges gaps left by null or non-numeric values. Off by default: a break in
   * the line is how missing data should read. Line and area series only.
   */
  connectNulls?: boolean
  /**
   * Alpha of the fill under an area series. Defaults to a faint wash that fades
   * out towards the axis; areas that stack into a band default to solid.
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

/** Which way the flow runs: columns of nodes left to right, or rows top to bottom. */
export type SankeyOrient = 'horizontal' | 'vertical'

/**
 * Where a node sits along the flow. `'justify'` pushes a node with no outgoing
 * flow to the far end, `'left'` and `'right'` pin every node to the end it is
 * named after.
 */
export type SankeyNodeAlign = 'left' | 'right' | 'justify'

export type SankeyChartConfig = {
  /** One row per flow. Rows with no numeric value draw no band. */
  data: Record<string, any>[]
  /** Row key holding the node a flow leaves. */
  sourceColumn: string
  /** Row key holding the node a flow arrives at. */
  targetColumn: string
  /** Row key holding how much flows along the link. */
  valueColumn: string
  title?: string
  subtitle?: string
  orient?: SankeyOrient
  nodeAlign?: SankeyNodeAlign
  /**
   * Ramp node colors are drawn from. Defaults to `'categorical'`: the nodes of
   * a flow are unrelated categories, not steps of one magnitude.
   */
  palette?: ChartPalette
  echartOptions?: EchartOptionsOverride
}

/** One node of the flow, after de-duplication and color assignment. */
export type SankeyNode = {
  /** The source or target value as it reads. Unique within the graph. */
  name: string
  /**
   * What passes through the node: the larger of what arrives and what leaves,
   * which is the side that decides how tall echarts draws it.
   */
  value: number
  color: string
}

/** One drawn link, i.e. one row of the data. */
export type SankeyLink = {
  source: string
  target: string
  value: number
  /** The source node's color, which is what the band is painted in. */
  color: string
  row: Record<string, any>
}

/** The flow as the plot, the labels and the tooltip all read it. */
export type SankeyGraph = {
  /** Nodes in the order the rows first mention them, source before target. */
  nodes: SankeyNode[]
  links: SankeyLink[]
}

export type SankeyLinkEvent = {
  source: string
  target: string
  value: number
  row: Record<string, any>
}

export type ScatterChartConfig = {
  /** One row per point. A row missing either coordinate draws nothing. */
  data: Record<string, any>[]
  /** Row key holding the horizontal measure. */
  xColumn: string
  /** Row key holding the vertical measure. */
  yColumn: string
  /** Row key holding the magnitude each point is sized by. */
  sizeColumn?: string
  /** Grouping column: one series per distinct value. */
  seriesColumn?: string
  /** Row key holding the point's own name, which heads its tooltip. */
  labelColumn?: string
  title?: string
  subtitle?: string
  /** Both axes are value axes: a scatter reads one measure against another. */
  xAxis?: ChartYAxisConfig
  yAxis?: ChartYAxisConfig
  /**
   * Ramp series colors are drawn from. Defaults to `'categorical'`: the groups
   * of a scatter are unrelated categories, not steps of one magnitude.
   */
  palette?: ChartPalette
  /** Forces layout direction; defaults to document.documentElement.dir */
  dir?: ChartDir
  echartOptions?: EchartOptionsOverride
}

/** One drawn point, after coercion and size scaling. */
export type ScatterPoint = {
  x: number
  y: number
  /** The magnitude behind the symbol. Null when the chart has no size column. */
  size: number | null
  /** Symbol diameter in px: the magnitude mapped into the readable range. */
  symbolSize: number
  /** The point's own name, when the config names a label column. */
  label?: string
  row: Record<string, any>
}

/** One group of points, i.e. one value of the grouping column. */
export type ScatterSeries = {
  /** The grouping value as it reads, or the y column when nothing groups. Unique. */
  name: string
  label: string
  color: string
  points: ScatterPoint[]
}

export type ScatterPointEvent = {
  seriesName: string
  x: number
  y: number
  /** Null when the chart has no size column. */
  size: number | null
  label?: string
  row: Record<string, any>
}

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
