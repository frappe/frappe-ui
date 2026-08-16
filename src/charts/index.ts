// The `--chart-*` color tokens ship with the package: importing from
// `frappe-ui/charts` pulls in the ramps every chart draws from.
import './style.css'

export { default as AreaChart } from './AreaChart.vue'
export { default as BarChart } from './BarChart.vue'
export { default as DonutChart } from './DonutChart.vue'
export { default as FunnelChart } from './FunnelChart.vue'
export { default as HeatmapChart } from './HeatmapChart.vue'
export { default as LineChart } from './LineChart.vue'
export { default as NumberCard } from './NumberCard.vue'
export { default as SankeyChart } from './SankeyChart.vue'
export { default as ScatterChart } from './ScatterChart.vue'

// The chrome, so a plot an app draws itself reads as one of the family: the
// card surface, the title block and states, the legend and the tooltip.
export { default as ChartCard } from './components/ChartCard.vue'
export { default as ChartContainer } from './components/ChartContainer.vue'
export { default as ChartLegend } from './components/ChartLegend.vue'
export { default as ChartTooltip } from './components/ChartTooltip.vue'

export { useChart, registerChartModules } from './core/useChart'
export type {
  ChartEventHandlers,
  UseChartArgs,
  UseChartReturn,
} from './core/useChart'

// The plot-area colors, for a plot an app draws itself. `resolveChartTokens`
// reads them once and stays internal: a plot that does not re-resolve on a
// theme flip is the bug the composable exists to prevent.
export { paletteColors, useChartTokens, type ChartTokens } from './tokens'
export type { ResolvedColorScheme } from './tokens'

// Identity of the bucket `maxSeries` and `maxSlices` collapse their tail into,
// so a caller can style it without hardcoding the reserved key.
export { OTHERS_KEY, OTHERS_LABEL } from './utils'

// The grain a time x axis is read at. The format helpers that consume it are
// internal: each one hardcodes `en-US`, so exporting them would freeze that
// until `2.0.0`.
export type { TimeGrain } from './format'

export type {
  AreaChartEmits,
  AreaChartProps,
  AreaChartSlots,
  AxisChartEmits,
  AxisChartProps,
  AxisChartSlots,
  BarChartEmits,
  BarChartProps,
  BarChartSlots,
  ChartActionsSlot,
  ChartBaseProps,
  ChartCardProps,
  ChartCardSlots,
  ChartCategoryFormatter,
  ChartContainerProps,
  ChartContainerSlots,
  ChartLegendEmits,
  ChartLegendProps,
  ChartStateSlots,
  ChartTooltipProps,
  ChartTooltipSlots,
  ChartValueAxisOptions,
  ChartValueFormatter,
  ChartXAxisOptions,
  DonutChartEmits,
  DonutChartProps,
  DonutChartSlots,
  FunnelChartEmits,
  FunnelChartProps,
  FunnelChartSlots,
  HeatmapChartEmits,
  HeatmapChartProps,
  HeatmapChartSlots,
  LineChartEmits,
  LineChartProps,
  LineChartSlots,
  NumberCardProps,
  NumberCardSlots,
  SankeyChartEmits,
  SankeyChartProps,
  SankeyChartSlots,
  ScatterChartEmits,
  ScatterChartProps,
  ScatterChartSlots,
  SeriesStyle,
} from './types'

// Only what the props, emits, slots and template refs above reach for; the
// config shapes the option builders read stay internal.
export type {
  ChartDatapointEvent,
  ChartDir,
  ChartExposed,
  ChartLegendItem,
  ChartMark,
  ChartPalette,
  ChartPaletteName,
  ChartTooltipItem,
  DonutSliceEvent,
  DonutVariant,
  EchartOptionsOverride,
  FunnelStage,
  FunnelStageEvent,
  HeatmapAxisOptions,
  HeatmapCellEvent,
  HeatmapPalette,
  NumberCardSparkline,
  NumberCardSparklineType,
  PlotLabelPlacement,
  ReferenceLine,
  SankeyLinkEvent,
  SankeyNodeAlign,
  SankeyOrient,
  ScatterPointEvent,
} from './types'
