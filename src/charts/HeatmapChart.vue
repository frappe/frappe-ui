<template>
  <ChartContainer
    :title="title"
    :subtitle="subtitle"
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

    <!-- A continuous ramp has no entries to switch on and off, so the scale
         itself stands in for the legend. -->
    <template #legend>
      <div class="flex items-center justify-end gap-2">
        <span class="text-p-xs tabular-nums text-ink-gray-5">
          {{ scale.min }}
        </span>
        <span
          class="h-2 w-20 rounded-1"
          :style="{ backgroundImage: scale.gradient }"
        />
        <span class="text-p-xs tabular-nums text-ink-gray-5">
          {{ scale.max }}
        </span>
      </div>
    </template>
  </ChartContainer>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { HeatmapChart as HeatmapSeries } from 'echarts/charts'
import { GridComponent, VisualMapContinuousComponent } from 'echarts/components'
import { LabelLayout } from 'echarts/features'
import { registerChartModules, useChart } from './core/useChart'
import {
  buildHeatmapMatrix,
  buildHeatmapOption,
  sampleRamp,
} from './heatmapOptions'
import { formatLabel, formatValue } from './format'
import { useChartTheme } from './theme'
import { chartAriaLabel, documentDir } from './utils'
import ChartContainer from './components/ChartContainer.vue'
import ChartTooltip from './components/ChartTooltip.vue'
import type {
  ChartExposed,
  ChartTooltipItem,
  HeatmapCellEvent,
  HeatmapChartConfig,
  HeatmapChartProps,
} from './types'

// The continuous visual map only: a heatmap has no piecewise scale to draw, and
// `LabelLayout` is what drops the in-cell labels that have no room.
registerChartModules([
  HeatmapSeries,
  GridComponent,
  VisualMapContinuousComponent,
  LabelLayout,
])

const props = defineProps<HeatmapChartProps>()

const emit = defineEmits<{
  cellClick: [event: HeatmapCellEvent]
}>()

defineSlots<{
  actions?: () => unknown
  tooltip?: (props: { label?: string; items: ChartTooltipItem[] }) => unknown
}>()

const plotEl = ref<HTMLElement>()

const dir = computed(() => props.dir ?? documentDir())

const config = computed<HeatmapChartConfig>(() => ({
  data: props.data,
  xColumn: props.x,
  yColumn: props.y,
  valueColumn: props.value,
  min: props.min,
  max: props.max,
  showValues: props.showValues,
  palette: props.palette,
  dir: dir.value,
  echartOptions: props.echartOptions,
}))

const { theme } = useChartTheme(plotEl)

const matrix = computed(() =>
  buildHeatmapMatrix(config.value, { theme: theme.value }),
)
const isEmpty = computed(() => !matrix.value.cells.length)

// A malformed config throws while building the option; surfacing it as an error
// state beats letting it bubble out of a render and blank the whole page.
const built = computed(() => {
  try {
    return {
      option: buildHeatmapOption(config.value, {
        theme: theme.value,
        format: props.format,
      }),
      error: null as string | null,
    }
  } catch (e: any) {
    return { option: undefined, error: e?.message ?? String(e) }
  }
})

const renderError = computed(() => built.value.error)

/**
 * Last pointer position, kept from zrender's own mousemove. The `mouseover`
 * payload carries no viewport coordinates across every echarts version, and the
 * tooltip needs them the moment a cell is entered.
 */
const pointer = reactive({ x: 0, y: 0 })

const tooltip = reactive({
  open: false,
  x: 0,
  y: 0,
  label: undefined as string | undefined,
  items: [] as ChartTooltipItem[],
})

const { chart } = useChart({
  container: plotEl,
  option: () => built.value.option,
  events: {
    mouseover: (params: any) => showTooltip(params.dataIndex),
    mouseout: () => (tooltip.open = false),
    click: (params: any) => {
      const cell = matrix.value.cells[params.dataIndex]
      if (!cell) return
      emit('cellClick', {
        x: cell.x,
        y: cell.y,
        value: cell.value,
        row: cell.row,
      })
    },
  },
  onZrEvents: {
    mousemove: (e: any) => {
      pointer.x = e.event?.clientX ?? pointer.x
      pointer.y = e.event?.clientY ?? pointer.y
      if (tooltip.open) {
        tooltip.x = pointer.x
        tooltip.y = pointer.y
      }
    },
    globalout: () => (tooltip.open = false),
  },
})

function showTooltip(dataIndex: number) {
  const cell = matrix.value.cells[dataIndex]
  if (!cell) {
    tooltip.open = false
    return
  }

  // The two categories head the tooltip, the way the x value heads an axis
  // chart's; the measure is the one line under it.
  tooltip.label = `${cell.y} · ${cell.x}`
  tooltip.items = [
    {
      name: `${cell.yIndex}:${cell.xIndex}`,
      label: formatLabel(props.value),
      color: cell.color,
      value: cell.value,
      formattedValue: props.format
        ? props.format(cell.value)
        : formatValue(cell.value),
    },
  ]
  tooltip.x = pointer.x
  tooltip.y = pointer.y
  tooltip.open = true
}

/** The ramp scale in the chrome, painted from the stops the cells came from. */
const scale = computed(() => {
  const { min, max, stops } = matrix.value
  const sampled = sampleRamp(stops)
  // The labels swap sides with the flex row in RTL, so the ramp has to swap
  // with them — otherwise the low end would sit against the high label.
  const towards = dir.value === 'rtl' ? 'left' : 'right'
  return {
    min: shorten(min),
    max: shorten(max),
    gradient: `linear-gradient(to ${towards}, ${sampled.join(', ')})`,
  }
})

/** The scale endpoints sit in a narrow strip, so they read shortened. */
function shorten(value: number) {
  return props.format ? props.format(value) : formatValue(value, 1, true)
}

defineExpose<ChartExposed>({ chart: computed(() => chart.value) })
</script>
