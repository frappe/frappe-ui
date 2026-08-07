<template>
  <ChartContainer
    :title="title"
    :subtitle="subtitle"
    :plot-label="plotLabel"
    :plot-label-secondary="plotLabelSecondary"
    :plot-label-placement="plotLabelPlacement"
    :loading="loading"
    :error="error || renderError"
    :empty="isEmpty"
    :dir="dir"
  >
    <template v-if="$slots.actions" #actions><slot name="actions" /></template>

    <template #default>
      <div
        ref="plotEl"
        class="h-full w-full"
        dir="ltr"
        role="img"
        :aria-label="chartAriaLabel(title, subtitle)"
      />

      <ChartTooltip
        :open="tooltip.open"
        :x="tooltip.x"
        :y="tooltip.y"
        :label="tooltip.label"
        :items="tooltip.items"
        :dir="dir"
      >
        <template v-if="$slots.tooltip" #default="slotProps">
          <slot name="tooltip" v-bind="slotProps" />
        </template>
      </ChartTooltip>
    </template>

    <template v-if="legendItems.length > 1" #legend>
      <ChartLegend
        :items="legendItems"
        @toggle="toggleSeries"
        @hover="hoverSeries"
      />
    </template>
  </ChartContainer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
// Both series types: any axis chart draws any mark, so a bar chart with one
// `type: 'line'` series needs the line module registered too.
import { BarChart as BarSeries, LineChart as LineSeries } from 'echarts/charts'
import {
  GridComponent,
  MarkLineComponent,
  TooltipComponent,
} from 'echarts/components'
import { LabelLayout } from 'echarts/features'
import { registerChartModules } from './core/useChart'
import { useAxisChart } from './core/useAxisChart'
import { buildAxisChartOption } from './axisChartOptions'
import { normalizeAxisChartProps } from './seriesData'
import { chartAriaLabel } from './utils'
import ChartContainer from './components/ChartContainer.vue'
import ChartLegend from './components/ChartLegend.vue'
import ChartTooltip from './components/ChartTooltip.vue'
import type { BarChartProps } from './props'
import type {
  AxisChartConfig,
  ChartDatapointEvent,
  ChartExposed,
  ChartTooltipItem,
} from './types'

registerChartModules([
  BarSeries,
  LineSeries,
  GridComponent,
  MarkLineComponent,
  TooltipComponent,
  LabelLayout,
])

const props = defineProps<BarChartProps>()

const hiddenSeries = defineModel<string[]>('hiddenSeries', {
  default: () => [],
})

const emit = defineEmits<{
  datapointClick: [event: ChartDatapointEvent]
}>()

defineSlots<{
  actions?: () => unknown
  tooltip?: (props: { label?: string; items: ChartTooltipItem[] }) => unknown
}>()

const normalized = computed(() => normalizeAxisChartProps(props))
const config = computed<AxisChartConfig>(() => ({
  ...normalized.value.config,
  type: 'bar',
  stacked: props.stacked,
  horizontal: props.horizontal,
  connectNulls: props.connectNulls,
  fillOpacity: props.fillOpacity,
}))

const {
  plotEl,
  chart,
  dir,
  isEmpty,
  plotLabel,
  plotLabelSecondary,
  plotLabelPlacement,
  renderError,
  tooltip,
  legendItems,
  toggleSeries,
  hoverSeries,
} = useAxisChart({
  config: () => config.value,
  format: () => normalized.value.format,
  buildOption: buildAxisChartOption,
  horizontal: () => Boolean(props.horizontal),
  hiddenSeries,
  onDatapointClick: (event) => emit('datapointClick', event),
})

defineExpose<ChartExposed>({ chart: computed(() => chart.value) })
</script>
