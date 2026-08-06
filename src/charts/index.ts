export { default as AreaChart } from './AreaChart.vue'
export { default as BarChart } from './BarChart.vue'
export { default as DonutChart } from './DonutChart.vue'
export { default as FunnelChart } from './FunnelChart.vue'
export { default as HeatmapChart } from './HeatmapChart.vue'
export { default as LineChart } from './LineChart.vue'
export { default as NumberCard } from './NumberCard.vue'

export { useChart, registerChartModules } from './core/useChart'
export type {
  ChartEventHandlers,
  UseChartArgs,
  UseChartReturn,
} from './core/useChart'

export {
  currentColorScheme,
  paletteColors,
  resolveChartTheme,
  useChartTheme,
  type ChartTheme,
  type ColorScheme,
} from './theme'

export {
  formatAxisValue,
  formatDate,
  formatLabel,
  formatPercent,
  formatValue,
  type TimeGrain,
} from './format'

export type {
  AreaChartProps,
  AreaChartSeriesStyle,
  AreaSeriesStyle,
  AxisChartProps,
  BarChartProps,
  BarChartSeriesStyle,
  BarSeriesStyle,
  ChartBaseProps,
  ChartCategoryFormatter,
  ChartValueAxisOptions,
  ChartValueFormatter,
  ChartXAxisOptions,
  DonutChartProps,
  FunnelChartProps,
  HeatmapChartProps,
  LineChartProps,
  LineChartSeriesStyle,
  LineSeriesStyle,
  NumberCardProps,
  SeriesStyle,
} from './props'

// Only what the props, emits, slots and template refs above reach for; the
// config shapes the option builders read stay internal.
export type {
  AxisSeriesType,
  ChartDatapointEvent,
  ChartDir,
  ChartExposed,
  ChartPalette,
  ChartPaletteName,
  ChartTooltipItem,
  DonutSliceEvent,
  DonutVariant,
  EchartOptionsOverride,
  FunnelStage,
  FunnelStageEvent,
  HeatmapCellEvent,
  HeatmapPalette,
  NumberCardSparkline,
  NumberCardSparklineType,
} from './types'
