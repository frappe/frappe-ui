import type { TimeGrain } from './format'
import type {
  ChartDir,
  ChartPalette,
  DonutVariant,
  EchartOptionsOverride,
  HeatmapPalette,
  NumberCardSparkline,
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

/** Per-series look. Every key is optional: an unstyled series renders with defaults. */
export type SeriesStyle = {
  /** Display name. The `seriesConfig` key stays the identity. */
  label?: string
  color?: string
  showDataLabels?: boolean
  echartOptions?: EchartOptionsOverride
}

export type BarSeriesStyle = SeriesStyle & {
  /** Groups series into separate stacks. Only read when `stacked` is on. */
  stackName?: string
}

export type LineSeriesStyle = SeriesStyle & {
  lineType?: 'solid' | 'dashed' | 'dotted'
  lineWidth?: number
  showDataPoints?: boolean
  smooth?: boolean
}

export type AreaSeriesStyle = LineSeriesStyle & {
  stackName?: string
  /** Overrides the chart-level `fillOpacity` for this series. */
  fillOpacity?: number
}

export type AxisChartProps<Style extends SeriesStyle = SeriesStyle> =
  ChartBaseProps & {
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
    seriesConfig?: Record<string, Style>
    xAxis?: ChartXAxisOptions
    yAxis?: ChartValueAxisOptions
    y2Axis?: ChartValueAxisOptions
    /** Ramp series colors are drawn from. Defaults to `'sequential'`. */
    palette?: ChartPalette
    echartOptions?: EchartOptionsOverride
  }

export type BarChartProps = AxisChartProps<BarSeriesStyle> & {
  stacked?: boolean
  /** Bars run left-to-right; the category axis moves to Y. */
  horizontal?: boolean
}

export type LineChartProps = AxisChartProps<LineSeriesStyle> & {
  connectNulls?: boolean
}

export type AreaChartProps = AxisChartProps<AreaSeriesStyle> & {
  stacked?: boolean
  connectNulls?: boolean
  /** Chart-level default; `seriesConfig` overrides it per series. */
  fillOpacity?: number
}

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

/** No `subtitle`: the card is one reading, and the caption row says what it compares against. */
export type NumberCardProps = Omit<ChartBaseProps, 'subtitle'> & {
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
