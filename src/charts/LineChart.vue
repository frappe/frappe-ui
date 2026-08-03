<template>
  <ChartContainer
    :title="title"
    :subtitle="subtitle"
    :plot-label="plotLabel"
    :plot-label-secondary="plotLabelSecondary"
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
import { LineChart as LineSeries } from 'echarts/charts'
import { GridComponent, TooltipComponent } from 'echarts/components'
import { LabelLayout } from 'echarts/features'
import { registerChartModules } from './core/useChart'
import { useAxisChart } from './core/useAxisChart'
import { buildLineChartOption } from './lineChartOptions'
import { normalizeAxisChartProps } from './seriesData'
import { chartAriaLabel } from './utils'
import ChartContainer from './components/ChartContainer.vue'
import ChartLegend from './components/ChartLegend.vue'
import ChartTooltip from './components/ChartTooltip.vue'
import type { LineChartProps, LineSeriesStyle } from './props'
import type {
  ChartDatapointEvent,
  ChartExposed,
  ChartTooltipItem,
  LineChartConfig,
} from './types'

registerChartModules([LineSeries, GridComponent, TooltipComponent, LabelLayout])

const props = defineProps<LineChartProps>()

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

const normalized = computed(() =>
  normalizeAxisChartProps<LineSeriesStyle>(props),
)
const config = computed<LineChartConfig>(() => ({
  ...normalized.value.config,
  connectNulls: props.connectNulls,
}))

const {
  plotEl,
  chart,
  dir,
  isEmpty,
  plotLabel,
  plotLabelSecondary,
  renderError,
  tooltip,
  legendItems,
  toggleSeries,
  hoverSeries,
} = useAxisChart({
  config: () => config.value,
  format: () => normalized.value.format,
  buildOption: buildLineChartOption,
  hiddenSeries,
  onDatapointClick: (event) => emit('datapointClick', event),
})

defineExpose<ChartExposed>({ chart: computed(() => chart.value) })
</script>
