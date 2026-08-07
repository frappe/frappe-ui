import type { TimeGrain } from './format'
import type {
  ChartDir,
  ChartLegendItem,
  ChartMark,
  ChartPalette,
  ChartTooltipItem,
  DonutVariant,
  EchartOptionsOverride,
  HeatmapPalette,
  NumberCardSparkline,
  PlotLabelPlacement,
  ReferenceLine,
  SankeyNodeAlign,
  SankeyOrient,
} from './types'

/** Formats a measured value wherever it is printed: axis labels, tooltip, readouts. */
export type ChartValueFormatter = (value: number) => string

/** A category axis carries whatever the column holds, so its formatter takes any. */
export type ChartCategoryFormatter = (value: any) => string

export type ChartBaseProps = {
  title?: string
  subtitle?: string
  /** Forces layout direction; defaults to document.documentElement.dir */
  dir?: ChartDir
  loading?: boolean
  error?: string | null
}

export type ChartXAxisOptions = {
  title?: string
  /**
   * Inferred: `'time'` when every value in the `x` column is a `Date` or ISO
   * date string, `'category'` otherwise.
   */
  type?: 'category' | 'time'
  /** Label granularity on a time axis. Inferred from the spacing of the data. */
  timeGrain?: TimeGrain
  format?: ChartCategoryFormatter
  echartOptions?: EchartOptionsOverride
}

export type ChartValueAxisOptions = {
  title?: string
  min?: number
  max?: number
  format?: ChartValueFormatter
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
  color?: string
  /**
   * Mark this series draws as. Defaults to the mark of the chart component it
   * sits in, so `BarChart` with one `'line'` series is a combo chart.
   */
  type?: ChartMark
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
  echartOptions?: EchartOptionsOverride
}

export type AxisChartProps = ChartBaseProps & {
  data: Record<string, any>[]
  /** Column holding the category or time each point sits at. */
  x: string
  /** Value column(s). A list reads wide data: one series per column. */
  y: string | string[]
  /** Column(s) measured against the second value axis. Ignored when `horizontal`. */
  y2?: string | string[]
  /** Grouping column, i.e. long data. Use with a single `y`. */
  series?: string
  /** Keyed by series identity: a `y` column, or a value of the `series` column. */
  seriesConfig?: Record<string, SeriesStyle>
  xAxis?: ChartXAxisOptions
  yAxis?: ChartValueAxisOptions
  y2Axis?: ChartValueAxisOptions
  /** Ramp series colors are drawn from. Defaults to `'sequential'`. */
  palette?: ChartPalette
  /** Series sum on top of each other. Bar and area series; a line never stacks. */
  stacked?: boolean
  /** Bridges gaps left by nulls. Line and area series. */
  connectNulls?: boolean
  /** Chart-level fill alpha; `seriesConfig` overrides it per series. Area series. */
  fillOpacity?: number
  /**
   * Targets, thresholds and other fixed marks drawn over the plot. They are
   * annotations, not series: no legend entry, and no way to switch one off.
   */
  referenceLines?: ReferenceLine[]
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
  data: Record<string, any>[]
  /** Row key holding the slice name. */
  category: string
  /** Row key holding the slice size. */
  value: string
  /** Slices past this many are summed into a single "Others" slice. */
  maxSlices?: number
  showInlineLabels?: boolean
  /** Caption under the total in the middle. Defaults to the `value` key. */
  centerLabel?: string
  variant?: DonutVariant
  format?: ChartValueFormatter
  /** Defaults to `'categorical'`: slices are unrelated categories, not steps. */
  palette?: ChartPalette
  echartOptions?: EchartOptionsOverride
}

export type FunnelChartProps = ChartBaseProps & {
  /** One row per stage, in process order. Rows are drawn as they arrive. */
  data: Record<string, any>[]
  category: string
  value: string
  /** Prints each stage's share of the first stage. On by default. */
  showPercentages?: boolean
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
  min?: number
  max?: number
  showValues?: boolean
  format?: ChartValueFormatter
  palette?: HeatmapPalette
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
  format?: ChartValueFormatter
  /** Defaults to `'categorical'`: nodes are unrelated categories. */
  palette?: ChartPalette
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
  /** Row key holding the point's own name, which heads its tooltip. */
  label?: string
  /** The horizontal scale. Both axes are value axes: a scatter has no categories. */
  xAxis?: ChartValueAxisOptions
  /** The vertical scale. */
  yAxis?: ChartValueAxisOptions
  /** Defaults to `'categorical'`: the groups are unrelated categories. */
  palette?: ChartPalette
  /**
   * Prints every number the chart shows. `xAxis.format` and `yAxis.format`
   * override it for their own axis; the size measure has no axis, so this is
   * what prints it.
   */
  format?: ChartValueFormatter
  echartOptions?: EchartOptionsOverride
}

/** No `subtitle`: the card is one reading, and the caption row says what it compares against. */
export type NumberCardProps = Omit<ChartBaseProps, 'subtitle'> &
  Pick<ChartCardProps, 'card'> & {
    title: string
    /** A string renders as given: the formatting props only apply to a number. */
    value: number | string | null
    prefix?: string
    suffix?: string
    /** Change against the comparison period. Sign drives the arrow. */
    delta?: number | null
    deltaSuffix?: string
    deltaCaption?: string
    /** Flips the delta colors, for metrics like churn or cost. */
    negativeIsBetter?: boolean
    /** Decimal places. Defaults to as many as the value carries, up to 2. */
    precision?: number
    /** Shortens the value, `12300` -> `12.3K`. */
    compact?: boolean
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
  title?: string
  subtitle?: string
  /** Value-axis title, drawn above the plot instead of inside it. */
  plotLabel?: string
  /** Title of the second value axis, drawn over the edge that axis sits on. */
  plotLabelSecondary?: string
  /** Edge of the plot the value-axis titles head. Defaults to the top. */
  plotLabelPlacement?: PlotLabelPlacement
  loading?: boolean
  /** Non-empty switches the container into its error state. */
  error?: string | null
  empty?: boolean
  dir?: ChartDir
}

export type ChartLegendProps = {
  /** One entry per series, in the order they are drawn. */
  items: ChartLegendItem[]
}

export type ChartTooltipProps = {
  open: boolean
  /** Viewport coordinates of the pointer. */
  x: number
  y: number
  label?: string
  items: ChartTooltipItem[]
  dir?: ChartDir
}
