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

    <!-- The container owns the three states, so an app that wants a retry
         button beside the message or a skeleton of its own reaches them here
         rather than dropping the chart and rebuilding the chrome. -->
    <template v-if="$slots.loading" #loading><slot name="loading" /></template>
    <template v-if="$slots.error" #error="slotProps">
      <slot name="error" v-bind="slotProps" />
    </template>
    <template v-if="$slots.empty" #empty><slot name="empty" /></template>

    <template #default>
      <div
        ref="plotEl"
        class="h-full w-full rounded-2 focus-visible:focus-ring"
        dir="ltr"
        role="img"
        :aria-label="chartAriaLabel(title, subtitle)"
        v-bind="plotAttrs"
      />

      <!-- The tooltip hangs off the pointer, which a reader walking the plot
           with the arrow keys has not got. This is the same reading in text. -->
      <span class="sr-only" role="status">{{ reading }}</span>

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
        @change="toggleSeries"
        @highlight="hoverSeries"
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
import { buildAxisChartOption, buildStackShares } from './axisChartOptions'
import { normalizeAxisChartProps } from './seriesData'
import { chartAriaLabel } from './utils'
import ChartContainer from './components/ChartContainer.vue'
import ChartLegend from './components/ChartLegend.vue'
import ChartTooltip from './components/ChartTooltip.vue'
import type {
  AxisChartConfig,
  BarChartEmits,
  BarChartProps,
  BarChartSlots,
  ChartExposed,
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

const emit = defineEmits<BarChartEmits>()

defineSlots<BarChartSlots>()

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
  plotAttrs,
  reading,
} = useAxisChart({
  config: () => config.value,
  format: () => normalized.value.format,
  buildOption: buildAxisChartOption,
  stackShares: () => buildStackShares(config.value, hiddenSeries.value),
  horizontal: () => Boolean(props.horizontal),
  hiddenSeries,
  onSelect: (event) => emit('select', event),
})

defineExpose<ChartExposed>({ chart: computed(() => chart.value) })
</script>
