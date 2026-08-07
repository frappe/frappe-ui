<template>
  <ChartContainer
    :title="title"
    :subtitle="subtitle"
    :plot-label="plotLabel"
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
import { computed, reactive, ref, watch } from 'vue'
import { ScatterChart as ScatterSeries } from 'echarts/charts'
import { GridComponent, MarkLineComponent } from 'echarts/components'
import { registerChartModules, useChart } from './core/useChart'
import { buildScatterOption, buildScatterSeries } from './scatterOptions'
import { formatLabel, formatValue } from './format'
import { pruneHiddenSeries, toggleHiddenSeries } from './hiddenSeries'
import { useChartTheme } from './theme'
import { chartAriaLabel, documentDir } from './utils'
import ChartContainer from './components/ChartContainer.vue'
import ChartLegend from './components/ChartLegend.vue'
import ChartTooltip from './components/ChartTooltip.vue'
import type { ScatterChartProps } from './props'
import type {
  ChartExposed,
  ChartLegendItem,
  ChartTooltipItem,
  ScatterChartConfig,
  ScatterPointEvent,
} from './types'

// The grid carries both value axes and MarkLineComponent draws the reference
// lines — without it they are dropped without a word. There is no tooltip
// component, because the visible tooltip is a Vue one (see buildScatterOption).
registerChartModules([ScatterSeries, GridComponent, MarkLineComponent])

const props = defineProps<ScatterChartProps>()

const hiddenSeries = defineModel<string[]>('hiddenSeries', {
  default: () => [],
})

const emit = defineEmits<{
  pointClick: [event: ScatterPointEvent]
}>()

defineSlots<{
  actions?: () => unknown
  tooltip?: (props: { label?: string; items: ChartTooltipItem[] }) => unknown
}>()

const plotEl = ref<HTMLElement>()

const dir = computed(() => props.dir ?? documentDir())

// An axis states its own units, so its formatter wins there. Nothing states the
// units of the size measure, which is why the chart-level one prints it.
const formatX = computed(() => props.xAxis?.format ?? props.format)
const formatY = computed(() => props.yAxis?.format ?? props.format)

const config = computed<ScatterChartConfig>(() => ({
  data: props.data,
  xColumn: props.x,
  yColumn: props.y,
  sizeColumn: props.size,
  seriesColumn: props.series,
  labelColumn: props.label,
  xAxis: toValueAxis(props.xAxis),
  yAxis: toValueAxis(props.yAxis),
  referenceLines: props.referenceLines,
  palette: props.palette,
  dir: dir.value,
  echartOptions: props.echartOptions,
}))

function toValueAxis(axis?: ScatterChartProps['xAxis']) {
  if (!axis) return undefined
  return {
    title: axis.title,
    min: axis.min,
    max: axis.max,
    echartOptions: axis.echartOptions,
  }
}

const { theme } = useChartTheme(plotEl)

const series = computed(() =>
  buildScatterSeries(config.value, { theme: theme.value }),
)

const isEmpty = computed(() =>
  series.value.every((entry) => !entry.points.length),
)

// The y-axis title is chrome rather than an echarts axis name, so it lines up
// with the chart title above the plot. The x-axis title is drawn on its axis.
const plotLabel = computed(() =>
  props.yAxis?.title ? formatLabel(props.yAxis.title) : undefined,
)

// A malformed config throws while building the option; surfacing it as an error
// state beats letting it bubble out of a render and blank the whole page.
const built = computed(() => {
  try {
    return {
      option: buildScatterOption(config.value, {
        theme: theme.value,
        hiddenSeries: hiddenSeries.value,
        format: { x: formatX.value, y: formatY.value },
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
 * tooltip needs them the moment a point is entered.
 */
const pointer = reactive({ x: 0, y: 0 })

const tooltip = reactive({
  open: false,
  x: 0,
  y: 0,
  label: undefined as string | undefined,
  items: [] as ChartTooltipItem[],
})

const { chart, dispatch } = useChart({
  container: plotEl,
  option: () => built.value.option,
  events: {
    mouseover: (params: any) => showTooltip(params),
    mouseout: () => (tooltip.open = false),
    click: (params: any) => {
      const hit = pointAt(params)
      if (!hit) return
      emit('pointClick', {
        seriesName: hit.series.name,
        x: hit.point.x,
        y: hit.point.y,
        size: hit.point.size,
        label: hit.point.label,
        row: hit.point.row,
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

/**
 * The point behind an echarts event. Found by series *name* rather than by
 * `seriesIndex`, which counts the drawn series only and so shifts as soon as
 * the legend hides one.
 */
function pointAt(params: any) {
  const entry = series.value.find((s) => s.name === params?.seriesName)
  const point = entry?.points[params?.dataIndex]
  return entry && point ? { series: entry, point } : undefined
}

function showTooltip(params: any) {
  const hit = pointAt(params)
  if (!hit) {
    tooltip.open = false
    return
  }
  const { series: entry, point } = hit

  // What identifies the point: its own name, and the group it belongs to. With
  // neither, the two measures underneath already say everything there is.
  const parts = [point.label, props.series ? entry.label : undefined]
  const label = parts.filter(Boolean).join(' · ')

  tooltip.label = label || undefined
  tooltip.items = [
    reading(props.x, point.x, formatX.value, entry.color),
    reading(props.y, point.y, formatY.value, entry.color),
    // Only when the chart draws a size: a bubble whose magnitude is blank is
    // sized by nothing, so there is no number to print.
    ...(props.size && point.size !== null
      ? [reading(props.size, point.size, props.format, entry.color)]
      : []),
  ]
  tooltip.x = pointer.x
  tooltip.y = pointer.y
  tooltip.open = true
}

function reading(
  column: string,
  value: number,
  format: ((value: number) => string) | undefined,
  color: string,
): ChartTooltipItem {
  return {
    name: column,
    label: formatLabel(column),
    color,
    value,
    formattedValue: format ? format(value) : formatValue(value),
  }
}

const legendItems = computed<ChartLegendItem[]>(() =>
  series.value.map((entry) => ({
    name: entry.name,
    label: entry.label,
    color: entry.color,
    hidden: hiddenSeries.value.includes(entry.name),
  })),
)

function toggleSeries(name: string) {
  hiddenSeries.value = toggleHiddenSeries(
    hiddenSeries.value,
    name,
    series.value.length,
  )
}

// Legend hover is the only thing that emphasises a group. Pointing at the plot
// deliberately does not — the tooltip already reads the point out, and dimming
// the cloud on every mouse move costs more than it says.
const hoveredSeries = ref<string | null>(null)
function hoverSeries(name: string | null) {
  hoveredSeries.value = name
}

watch(hoveredSeries, (name, previous) => {
  if (previous) dispatch({ type: 'downplay', seriesName: previous })
  if (name && !hiddenSeries.value.includes(name)) {
    dispatch({ type: 'highlight', seriesName: name })
  }
})

// Groups that disappear while hidden shouldn't stay in the hidden list forever.
watch(
  () => series.value.map((entry) => entry.name),
  (names) => {
    hiddenSeries.value = pruneHiddenSeries(hiddenSeries.value, names)
  },
)

defineExpose<ChartExposed>({ chart: computed(() => chart.value) })
</script>
