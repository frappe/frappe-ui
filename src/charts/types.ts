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
   *
   * `'value'` reads the column as a quantity: a point sits at its own number,
   * so a row at 1 and a row at 100 stand a hundred apart rather than in
   * neighbouring slots. It is only ever asked for, never inferred — a category
   * column often holds numbers, and re-spacing those would redraw a chart
   * nobody changed. It is ignored on a horizontal bar chart.
   */
  type?: 'category' | 'time' | 'value'
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
   *
   * On a scatter both axes are value axes, so `'x'` is a number on the
   * horizontal scale rather than a category, and `'y2'` names an axis a scatter
   * does not have — it reads as `'y'`, with a dev-mode warning. An axis chart
   * with `xAxis.type: 'value'` reads `'x'` the same way: a number on the scale.
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
   * `'normalized'` plots each value as its share of its stack — the 100%
   * stacked reading — and pins the value axis that carries it to 0-100.
   */
  stacked?: boolean | 'normalized'
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
   * How many slices the ring holds, "Others" included: past that it keeps the
   * largest `maxSlices - 1` and sums the tail into "Others". A ring stops being
   * readable long before the palette runs out, so it defaults to 9.
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

/** One cut of the grid. Both are category axes, so both read the same way. */
export type HeatmapAxisOptions = {
  /**
   * Prints each category. Takes the value the row carried, not the string it
   * reads as: a date column arrives as a Date, and `Mar 2024` needs the value.
   *
   * Display only. Two categories printing alike stay two categories.
   */
  format?: ChartCategoryFormatter
}

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
  /** The value each x category was first named by, keyed by the category. */
  xValues: Map<string, any>
  /** As `xValues`, for the rows of the grid. */
  yValues: Map<string, any>
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
  /** Prints the point's own name beside it. Needs `labelColumn` to have one. */
  showDataLabels?: boolean
  title?: string
  subtitle?: string
  /** Both axes are value axes: a scatter reads one measure against another. */
  xAxis?: ChartYAxisConfig
  yAxis?: ChartYAxisConfig
  /**
   * Rules drawn over the plot at fixed positions, quadrant dividers among them.
   * Not series: see `ReferenceLine`.
   */
  referenceLines?: ReferenceLine[]
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

// ---------------------------------------------------------------------------
// Component props: the public surface every chart takes.
//
// These sit in `types.ts` rather than a `props.ts` of their own because
// studio reads `<Component>Props` out of the family folder's `types.ts` to
// build its block schemas, and matches the declaration by name — a re-export
// from another file does not satisfy it.
// ---------------------------------------------------------------------------

/** Formats a measured value wherever it is printed: axis labels, tooltip, readouts. */
export type ChartValueFormatter = (value: number) => string

/** A category axis carries whatever the column holds, so its formatter takes any. */
export type ChartCategoryFormatter = (value: any) => string

export type ChartBaseProps = {
  /** Heads the card. Left out, the chart draws no header row at all. */
  title?: string
  /** A second line under the title, e.g. the period the numbers cover. */
  subtitle?: string
  /** Forces layout direction; defaults to document.documentElement.dir */
  dir?: ChartDir
  /** Draws the placeholder in place of the plot, for data still on its way. */
  loading?: boolean
  /**
   * Puts the chart in its error state and prints this message under it. A
   * chart that fails to draw sets its own; this is for a failed request.
   */
  error?: string | null
}

export type ChartXAxisOptions = {
  /** Heads the axis, under its labels. Left out, the axis carries no name. */
  title?: string
  /**
   * Inferred: `'time'` when every value in the `x` column is a `Date` or ISO
   * date string, `'category'` otherwise.
   *
   * `'value'` reads the column as a quantity and places every point by its own
   * number, the way a scatter reads its x. Ask for it — it is never inferred,
   * because a category column that happens to hold numbers still reads as a
   * list of categories. Ignored when `horizontal` is set.
   */
  type?: 'category' | 'time' | 'value'
  /** Label granularity on a time axis. Inferred from the spacing of the data. */
  timeGrain?: TimeGrain
  /** Prints each category label. Takes whatever the column holds. */
  format?: ChartCategoryFormatter
  /** Escape hatch: deep-merged into this axis' echarts option. */
  echartOptions?: EchartOptionsOverride
}

export type ChartValueAxisOptions = {
  /**
   * Names what the axis measures. Drawn above the plot rather than turned
   * sideways along it, so it reads with the chart title.
   */
  title?: string
  /** Bottom of the scale. Defaults to a round number under the data. */
  min?: number
  /** Top of the scale. Defaults to a round number over the data. */
  max?: number
  /** Prints each tick label, and every value this axis carries elsewhere. */
  format?: ChartValueFormatter
  /** Escape hatch: deep-merged into this axis' echarts option. */
  echartOptions?: EchartOptionsOverride
}

/**
 * Per-series look. Every key is optional: an unstyled series renders with
 * defaults. One style covers every mark, so a series keeps its label and color
 * when `type` changes, and the keys the mark it draws as does not read are
 * ignored rather than dropped.
 */
export type SeriesStyle = {
  /** Display name. The `seriesConfig` key stays the identity. */
  label?: string
  /** Takes this series out of the palette, e.g. to pin one to a brand color. */
  color?: string
  /**
   * Mark this series draws as. Defaults to the mark of the chart component it
   * sits in, so `BarChart` with one `'line'` series is a combo chart.
   */
  type?: ChartMark
  /**
   * Which value axis this series is measured against. `'y2'` gives a series in
   * another unit or magnitude its own scale, drawn opposite the primary.
   * Defaults to `'y'`. Ignored on a horizontal bar chart, which has no second
   * value axis, and on a chart where no series asks for `'y2'` the second axis
   * is not drawn at all.
   *
   * Moving a series here never moves it in the chart: the series are drawn in
   * `y` order whatever axis each one sits on, so a series keeps its color.
   */
  axis?: 'y' | 'y2'
  /** Prints this series' value beside each of its marks. */
  showDataLabels?: boolean
  /**
   * Groups series into separate stacks. Only read when `stacked` is on, and
   * only by the marks that stack: bars stack with bars, areas with areas.
   */
  stackName?: string
  /** Line and area series. */
  lineType?: 'solid' | 'dashed' | 'dotted'
  /** Line and area series. */
  lineWidth?: number
  /** Line and area series. */
  showDataPoints?: boolean
  /** Line and area series. */
  smooth?: boolean
  /** Overrides the chart-level `fillOpacity`. Area series only. */
  fillOpacity?: number
  /** Escape hatch: deep-merged into this series' echarts option. */
  echartOptions?: EchartOptionsOverride
}

export type AxisChartProps = ChartBaseProps & {
  /** The rows to plot. One row is one position on the category axis. */
  data: Record<string, any>[]
  /** Column holding the category or time each point sits at. */
  x: string
  /**
   * Value column(s). A list reads wide data: one series per column, drawn and
   * colored in the order given. `seriesConfig[key].axis` moves one of them to
   * the second value axis without moving it in the list.
   */
  y: string | string[]
  /** Grouping column, i.e. long data. Use with a single `y`. */
  series?: string
  /**
   * Caps how many series the `series` column produces. The rest are summed
   * into a single "Others" series, keyed `OTHERS_KEY` so `seriesConfig` can
   * style it. Uncapped by default, and ignored when `y` names the columns:
   * those the caller chose one by one.
   */
  maxSeries?: number
  /** Keyed by series identity: a `y` column, or a value of the `series` column. */
  seriesConfig?: Record<string, SeriesStyle>
  /**
   * Series the legend has switched off, by name. Bind it with
   * `v-model:hiddenSeries` to drive the legend from the app, or to keep what a
   * reader hid across a reload. Left unbound, the legend owns it.
   */
  hiddenSeries?: string[]
  /** The category axis: its title, how the `x` column reads, and label format. */
  xAxis?: ChartXAxisOptions
  /** The primary value axis: its title, its range, and how a value prints. */
  yAxis?: ChartValueAxisOptions
  /** The second value axis. Only drawn when a series sits on `axis: 'y2'`. */
  y2Axis?: ChartValueAxisOptions
  /** Ramp series colors are drawn from. Defaults to `'sequential'`. */
  palette?: ChartPalette
  /**
   * Series sum on top of each other. Bar and area series; a line never stacks.
   * `'normalized'` reads each value as its share of the stack it sits in
   * instead of its own magnitude, and pins that value axis to 0-100.
   */
  stacked?: boolean | 'normalized'
  /** Bridges gaps left by nulls. Line and area series. */
  connectNulls?: boolean
  /** Chart-level fill alpha; `seriesConfig` overrides it per series. Area series. */
  fillOpacity?: number
  /**
   * Targets, thresholds and other fixed marks drawn over the plot. They are
   * annotations, not series: no legend entry, and no way to switch one off.
   */
  referenceLines?: ReferenceLine[]
  /** Escape hatch: deep-merged into the echarts option the props built. */
  echartOptions?: EchartOptionsOverride
}

export type BarChartProps = AxisChartProps & {
  /** Bars run left-to-right; the category axis moves to Y. Bars only. */
  horizontal?: boolean
}

/** A line chart is an axis chart whose unmarked series draw as lines. */
export type LineChartProps = AxisChartProps

/** An area chart is a line chart whose unmarked series carry a fill. */
export type AreaChartProps = AxisChartProps

export type DonutChartProps = ChartBaseProps & {
  /** The rows to plot. One row is one slice, before the "Others" grouping. */
  data: Record<string, any>[]
  /** Row key holding the slice name. */
  category: string
  /** Row key holding the slice size. */
  value: string
  /**
   * How many slices the ring holds, "Others" included. Past that the ring keeps
   * the largest `maxSlices - 1` and sums the tail into a single "Others" slice,
   * named `OTHERS_KEY`. Defaults to 9 — a ring stops being readable long before
   * the palette runs out.
   */
  maxSlices?: number
  /**
   * Prints each slice's name and share beside the ring, and drops the readout
   * in the middle. Off by default: the legend says the same without the
   * leader lines.
   */
  showInlineLabels?: boolean
  /** Caption under the total in the middle. Defaults to the `value` key. */
  centerLabel?: string
  /** `'half'` draws the ring as a semicircle; only the geometry changes. */
  variant?: DonutVariant
  /** Prints every number the ring shows: the readout, the tooltip, the labels. */
  format?: ChartValueFormatter
  /** Defaults to `'categorical'`: slices are unrelated categories, not steps. */
  palette?: ChartPalette
  /** Escape hatch: deep-merged into the echarts option the props built. */
  echartOptions?: EchartOptionsOverride
}

export type FunnelChartProps = ChartBaseProps & {
  /** One row per stage, in process order. Rows are drawn as they arrive. */
  data: Record<string, any>[]
  /** Row key holding the stage name. */
  category: string
  /** Row key holding how many reached the stage. */
  value: string
  /** Prints each stage's share of the first stage. On by default. */
  showPercentages?: boolean
  /** Prints every number the funnel shows: the stage values and the tooltip. */
  format?: ChartValueFormatter
  /** Defaults to `'sequential'` reversed, so color darkens as the funnel narrows. */
  palette?: ChartPalette
}

export type HeatmapChartProps = ChartBaseProps & {
  /** One row per cell. */
  data: Record<string, any>[]
  /** Row key holding the column a cell sits in. */
  x: string
  /** Row key holding the row a cell sits in. */
  y: string
  /** Row key holding the magnitude the cell is colored by. */
  value: string
  /** Bottom of the color scale. Defaults to the smallest value in the data. */
  min?: number
  /** Top of the color scale. Defaults to the largest value in the data. */
  max?: number
  /** The columns of the grid: the axis under it, and the tooltip head. */
  xAxis?: HeatmapAxisOptions
  /** The rows of the grid: the axis beside it, and the tooltip head. */
  yAxis?: HeatmapAxisOptions
  /**
   * Prints each cell's value inside it. A label that would collide with its
   * neighbour is dropped, so a grid too fine to carry numbers shows none.
   */
  showValues?: boolean
  /** Prints every number the grid shows: the cells, the scale ends, the tooltip. */
  format?: ChartValueFormatter
  /**
   * Ramp cells are colored from. Defaults to `'sequential'`, which is what a
   * magnitude reads as; `'diverging'` is for signed data and centers on zero.
   */
  palette?: HeatmapPalette
  /** Escape hatch: deep-merged into the echarts option the props built. */
  echartOptions?: EchartOptionsOverride
}

export type SankeyChartProps = ChartBaseProps & {
  /** One row per flow, i.e. one band from a source node to a target node. */
  data: Record<string, any>[]
  /** Row key holding the node a flow leaves. */
  source: string
  /** Row key holding the node a flow arrives at. */
  target: string
  /** Row key holding how much flows along the link. */
  value: string
  /** Defaults to `'horizontal'`: the flow runs left to right. */
  orient?: SankeyOrient
  /** Where a node sits along the flow. Defaults to `'justify'`. */
  nodeAlign?: SankeyNodeAlign
  /** Prints every number the flow shows, i.e. what a band or node carries. */
  format?: ChartValueFormatter
  /** Defaults to `'categorical'`: nodes are unrelated categories. */
  palette?: ChartPalette
  /** Escape hatch: deep-merged into the echarts option the props built. */
  echartOptions?: EchartOptionsOverride
}

export type ScatterChartProps = ChartBaseProps & {
  /** One row per point. */
  data: Record<string, any>[]
  /** Row key holding the horizontal measure. */
  x: string
  /** Row key holding the vertical measure. */
  y: string
  /** Row key holding the magnitude each point is sized by. */
  size?: string
  /** Grouping column: one series per distinct value. */
  series?: string
  /**
   * Groups the legend has switched off, by name. Bind it with
   * `v-model:hiddenSeries` to drive the legend from the app. Left unbound, the
   * legend owns it.
   */
  hiddenSeries?: string[]
  /** Row key holding the point's own name, which heads its tooltip. */
  label?: string
  /**
   * Prints the point's own name beside it, the way an axis series prints its
   * value. `label` is what it prints, so a chart that names no label column has
   * nothing to show and says so in a dev-mode warning. Names that would collide
   * with a neighbour are dropped, so a dense cloud carries few.
   */
  showDataLabels?: boolean
  /** The horizontal scale. Both axes are value axes: a scatter has no categories. */
  xAxis?: ChartValueAxisOptions
  /** The vertical scale. */
  yAxis?: ChartValueAxisOptions
  /** Defaults to `'categorical'`: the groups are unrelated categories. */
  palette?: ChartPalette
  /**
   * Targets, thresholds and quadrant dividers drawn over the plot. They are
   * annotations, not series: no legend entry, and no way to switch one off.
   * Both axes are measured here, so `axis: 'x'` takes a number too — a pair of
   * lines, one per axis, is what divides a scatter into quadrants.
   */
  referenceLines?: ReferenceLine[]
  /**
   * Prints every number the chart shows. `xAxis.format` and `yAxis.format`
   * override it for their own axis; the size measure has no axis, so this is
   * what prints it.
   */
  format?: ChartValueFormatter
  /** Escape hatch: deep-merged into the echarts option the props built. */
  echartOptions?: EchartOptionsOverride
}

/** No `subtitle`: the card is one reading, and the caption row says what it compares against. */
export type NumberCardProps = Omit<ChartBaseProps, 'subtitle'> &
  Pick<ChartCardProps, 'card'> & {
    /** What the reading is, printed above the number. */
    title: string
    /** A string renders as given: the formatting props only apply to a number. */
    value: number | string | null
    /**
     * Ink the reading is printed in, e.g. the color of the series it summarizes
     * on a dashboard. One color for one mark, the way `SeriesStyle.color` names
     * a series' own — it does not restyle the card, and the delta keeps the
     * tone that says which way the number moved.
     */
    color?: string
    /** Printed before the number, e.g. a currency sign. */
    prefix?: string
    /** Printed after the number, e.g. a unit. */
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
    /** A trend across the bottom of the card: shape only, no axes to read against. */
    sparkline?: NumberCardSparkline
  }

// The chrome, i.e. everything around the plot. A chart an app draws itself
// composes these and reads as one of the family.

export type ChartCardProps = {
  /**
   * Draws the card surface: border, background, corner radius and padding. On
   * by default. Set it to `false` for a chart the app has already placed inside
   * a card of its own, so a bordered box does not nest in a bordered box.
   */
  card?: boolean
  /** Forces layout direction; defaults to document.documentElement.dir */
  dir?: ChartDir
}

export type ChartContainerProps = {
  /** Heads the card. Left out, the container draws no header row at all. */
  title?: string
  /** A second line under the title, e.g. the period the numbers cover. */
  subtitle?: string
  /** Value-axis title, drawn above the plot instead of inside it. */
  plotLabel?: string
  /** Title of the second value axis, drawn over the edge that axis sits on. */
  plotLabelSecondary?: string
  /** Edge of the plot the value-axis titles head. Defaults to the top. */
  plotLabelPlacement?: PlotLabelPlacement
  /** Draws the placeholder in place of the plot, for data still on its way. */
  loading?: boolean
  /** Non-empty switches the container into its error state. */
  error?: string | null
  /** Draws the empty state: there is data, and it plots to nothing. */
  empty?: boolean
  /** Forces layout direction; defaults to document.documentElement.dir */
  dir?: ChartDir
}

export type ChartLegendProps = {
  /** One entry per series, in the order they are drawn. */
  items: ChartLegendItem[]
}

export type ChartTooltipProps = {
  /**
   * Draws the tooltip. It is measured before it is placed, so it flips at the
   * viewport edge rather than running off it.
   */
  open: boolean
  /** Viewport x of the point the tooltip hangs off, i.e. the pointer. */
  x: number
  /** Viewport y of the point the tooltip hangs off, i.e. the pointer. */
  y: number
  /** Heads the tooltip, e.g. the category the readings below it belong to. */
  label?: string
  /** One row per reading, in the order they should be read. */
  items: ChartTooltipItem[]
  /** Forces layout direction; defaults to document.documentElement.dir */
  dir?: ChartDir
}

// ---------------------------------------------------------------------------
// Component emits and slots. Declared here beside the props so a consumer can
// name a handler's payload or a slot's props — `(e: ChartDatapointEvent)` reads
// as the family's own type rather than as an inline literal nobody can import.
// ---------------------------------------------------------------------------

/**
 * The three states, forwarded by every chart. A slot replaces the whole state
 * rather than a line inside it, so an app reaching one corner of the chrome
 * does not have to rebuild the rest of it.
 */
export type ChartStateSlots = {
  /** Replaces the whole placeholder, e.g. with a skeleton of the app's own. */
  loading?: () => unknown
  /** Replaces the message, e.g. to put a retry button beside it. */
  error?: (props: { error?: string | null }) => unknown
  /** Replaces the "no data" line, e.g. with a hint about the filters. */
  empty?: () => unknown
}

/** Controls at the top right of the card, e.g. a period Select or a Dropdown. */
export type ChartActionsSlot = {
  actions?: () => unknown
}

export type AxisChartEmits = {
  /**
   * A mark was selected, by click or by Enter on the keyboard cursor. Carries
   * the series it belongs to, its position along the category axis, and the
   * row behind it.
   */
  select: [event: ChartDatapointEvent]
}

export type AxisChartSlots = ChartActionsSlot &
  ChartStateSlots & {
    /**
     * Replaces the tooltip body. `items` holds one entry per visible series at
     * the hovered category, biggest first.
     */
    tooltip?: (props: { label?: string; items: ChartTooltipItem[] }) => unknown
  }

export type BarChartEmits = AxisChartEmits
export type BarChartSlots = AxisChartSlots
export type LineChartEmits = AxisChartEmits
export type LineChartSlots = AxisChartSlots
export type AreaChartEmits = AxisChartEmits
export type AreaChartSlots = AxisChartSlots

export type DonutChartEmits = {
  /**
   * A slice was selected, by click or by Enter on the keyboard cursor. The
   * "Others" slice carries every row it grouped, so a caller can drill into
   * the tail as well as into a named slice.
   */
  select: [event: DonutSliceEvent]
}

export type DonutChartSlots = ChartActionsSlot &
  ChartStateSlots & {
    /**
     * Replaces the readout in the middle of the ring. Reads the total, or the
     * hovered slice while one is hovered.
     */
    center?: (props: {
      value: string
      label: string
      /** Only set while a slice is hovered. */
      percent?: string
    }) => unknown
    /** Replaces the tooltip body. `items` holds the hovered slice alone. */
    tooltip?: (props: { items: ChartTooltipItem[] }) => unknown
  }

export type FunnelChartEmits = {
  /**
   * A stage was selected, by click or by Enter on the keyboard cursor. Carries
   * its position in the funnel and the row behind it; the whole column is the
   * hit area, not just the shape it draws.
   */
  select: [event: FunnelStageEvent]
}

export type FunnelChartSlots = ChartActionsSlot &
  ChartStateSlots & {
    /**
     * Replaces the tooltip body. `stage` carries the two conversion rates the
     * default body prints under the value.
     */
    tooltip?: (props: {
      label?: string
      items: ChartTooltipItem[]
      stage?: FunnelStage
    }) => unknown
  }

export type HeatmapChartEmits = {
  /**
   * A cell was selected, by click or by Enter on the keyboard cursor. Carries
   * both its categories and the row behind it.
   */
  select: [event: HeatmapCellEvent]
}

export type HeatmapChartSlots = ChartActionsSlot &
  ChartStateSlots & {
    /** Replaces the tooltip body. `items` holds the hovered cell alone. */
    tooltip?: (props: { label?: string; items: ChartTooltipItem[] }) => unknown
  }

export type SankeyChartEmits = {
  /**
   * A band was selected, by click or by Enter on the keyboard cursor. Carries
   * its two nodes and the row behind it. A node emits nothing: it stands for
   * every row that passes through it, not one.
   */
  select: [event: SankeyLinkEvent]
}

export type SankeyChartSlots = ChartActionsSlot &
  ChartStateSlots & {
    /** Replaces the tooltip body. `items` holds the hovered band or node alone. */
    tooltip?: (props: { label?: string; items: ChartTooltipItem[] }) => unknown
  }

export type ScatterChartEmits = {
  /**
   * A point was selected, by click or by Enter on the keyboard cursor. Carries
   * both measures and the row behind it.
   */
  select: [event: ScatterPointEvent]
}

export type ScatterChartSlots = ChartActionsSlot &
  ChartStateSlots & {
    /**
     * Replaces the tooltip body. `items` holds the point's two measures, and
     * its size when the chart draws one.
     */
    tooltip?: (props: { label?: string; items: ChartTooltipItem[] }) => unknown
  }

/** No tooltip slot: a card with no plot has nothing to hover. */
export type NumberCardSlots = ChartActionsSlot &
  ChartStateSlots & {
    /** Replaces `deltaCaption`, e.g. with a Dropdown that changes the period. */
    caption?: (props: { caption?: string }) => unknown
  }

export type ChartCardSlots = {
  /** The card's contents. The card supplies the surface and clips them. */
  default: () => unknown
}

export type ChartContainerSlots = ChartActionsSlot &
  ChartStateSlots & {
    /** The plot itself, drawn into a box the container sizes and states. */
    default: () => unknown
    /** The row under the plot, e.g. a `ChartLegend` or a ramp scale. */
    legend?: () => unknown
  }

export type ChartLegendEmits = {
  /** An entry was pressed: the named series' visibility flipped. */
  change: [name: string]
  /** The highlighted series, or null when the highlight clears. */
  highlight: [name: string | null]
}

export type ChartTooltipSlots = {
  /** Replaces the whole tooltip body, headline row included. */
  default: (props: { label?: string; items: ChartTooltipItem[] }) => unknown
}
