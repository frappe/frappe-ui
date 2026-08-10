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

      <!-- The tooltip hangs off the pointer, which a reader walking the cloud
           with the arrow keys has not got. The same reading in text. -->
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
import { computed, reactive, ref, watch } from 'vue'
import { ScatterChart as ScatterSeries } from 'echarts/charts'
import { GridComponent, MarkLineComponent } from 'echarts/components'
import { LabelLayout } from 'echarts/features'
import { registerChartModules, useChart } from './core/useChart'
import { usePlotKeyboard } from './core/usePlotKeyboard'
import { buildScatterOption, buildScatterSeries } from './scatterOptions'
import { formatLabel, formatValue } from './format'
import { pruneHiddenSeries, toggleHiddenSeries } from './hiddenSeries'
import { useChartTokens } from './tokens'
import { chartAriaLabel, documentDir, plotReading } from './utils'
import ChartContainer from './components/ChartContainer.vue'
import ChartLegend from './components/ChartLegend.vue'
import ChartTooltip from './components/ChartTooltip.vue'
import type {
  ChartExposed,
  ChartLegendItem,
  ChartTooltipItem,
  ScatterChartConfig,
  ScatterChartEmits,
  ScatterChartProps,
  ScatterChartSlots,
  ScatterPoint,
  ScatterSeries as ScatterSeriesGroup,
} from './types'

// The grid carries both value axes and MarkLineComponent draws the reference
// lines — without it they are dropped without a word. LabelLayout is what drops
// a point label that collides with its neighbour. There is no tooltip
// component, because the visible tooltip is a Vue one (see buildScatterOption).
registerChartModules([
  ScatterSeries,
  GridComponent,
  MarkLineComponent,
  LabelLayout,
])

const props = defineProps<ScatterChartProps>()

const hiddenSeries = defineModel<string[]>('hiddenSeries', {
  default: () => [],
})

const emit = defineEmits<ScatterChartEmits>()

defineSlots<ScatterChartSlots>()

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
  showDataLabels: props.showDataLabels,
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

const { tokens } = useChartTokens(plotEl)

const series = computed(() =>
  buildScatterSeries(config.value, { tokens: tokens.value }),
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
        tokens: tokens.value,
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
      emit('select', {
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
  showHit(hit, pointer.x, pointer.y)
}

type ScatterHit = { series: ScatterSeriesGroup; point: ScatterPoint }

function showHit(hit: ScatterHit, x: number, y: number) {
  const { series: entry, point } = hit

  // What identifies the point: its own name, and the group it belongs to. With
  // neither, the two measures underneath already say everything there is.
  const parts = [point.label, props.series ? entry.label : undefined]
  const label = parts.filter(Boolean).join(' · ')

  tooltip.label = label || undefined
  tooltip.items = [
    tooltipItem(props.x, point.x, formatX.value, entry.color),
    tooltipItem(props.y, point.y, formatY.value, entry.color),
    // Only when the chart draws a size: a bubble whose magnitude is blank is
    // sized by nothing, so there is no number to print.
    ...(props.size && point.size !== null
      ? [tooltipItem(props.size, point.size, props.format, entry.color)]
      : []),
  ]
  tooltip.x = x
  tooltip.y = y
  tooltip.open = true
}

function tooltipItem(
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

// The cloud is one tab stop and the arrow keys walk it, group by group: an
// echarts plot draws into a single element, so there are no per-point nodes to
// tab through — and a cloud of 400 points would be 400 tab stops if there were.
const reading = ref('')

// `seriesIndex` counts the drawn series, which is what an echarts action is
// addressed by — a hidden group is not in the option at all.
const walk = computed(() =>
  series.value
    .filter((entry) => !hiddenSeries.value.includes(entry.name))
    .flatMap((entry, seriesIndex) =>
      entry.points.map((point, dataIndex) => ({
        entry,
        point,
        seriesIndex,
        dataIndex,
      })),
    ),
)

function pointPoint(x: number, y: number) {
  const el = plotEl.value
  if (!el) return undefined
  const rect = el.getBoundingClientRect()
  const at = chart.value?.convertToPixel({ gridIndex: 0 }, [
    x,
    y,
  ]) as unknown as number[] | undefined
  if (!at || at.some((n) => typeof n !== 'number' || isNaN(n))) {
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
  }
  return { x: rect.left + at[0], y: rect.top + at[1] }
}

function readPoint(index: number) {
  const hit = walk.value[index]
  if (!hit) return
  const at = pointPoint(hit.point.x, hit.point.y)
  dispatch({
    type: 'highlight',
    seriesIndex: hit.seriesIndex,
    dataIndex: hit.dataIndex,
  })
  showHit(
    { series: hit.entry, point: hit.point },
    at?.x ?? pointer.x,
    at?.y ?? pointer.y,
  )
  reading.value = plotReading(
    tooltip.label,
    tooltip.items.map((item) => ({
      label: item.label,
      value: item.formattedValue,
    })),
  )
}

/** Takes the emphasis off the point the cursor has left. */
function downplayPoint(index: number | null) {
  const hit = index === null ? undefined : walk.value[index]
  if (!hit) return
  dispatch({
    type: 'downplay',
    seriesIndex: hit.seriesIndex,
    dataIndex: hit.dataIndex,
  })
}

const keyboard = usePlotKeyboard({
  marks: () => walk.value,
  // A point is its group and its place on the axes. Two points that sit on top
  // of each other are one name, which costs nothing: they draw as one mark.
  key: (hit) => `${hit.entry.name} ${hit.point.x} ${hit.point.y}`,
  move: (index, previous) => {
    downplayPoint(previous)
    readPoint(index)
  },
  activate: (index) => {
    const hit = walk.value[index]
    if (!hit) return
    emit('select', {
      seriesName: hit.entry.name,
      x: hit.point.x,
      y: hit.point.y,
      size: hit.point.size,
      label: hit.point.label,
      row: hit.point.row,
    })
  },
  clear: (previous) => {
    downplayPoint(previous)
    tooltip.open = false
    reading.value = ''
  },
})

const plotAttrs = keyboard.attrs

// Groups that disappear while hidden shouldn't stay in the hidden list forever.
watch(
  () => series.value.map((entry) => entry.name),
  (names) => {
    hiddenSeries.value = pruneHiddenSeries(hiddenSeries.value, names)
  },
)

defineExpose<ChartExposed>({ chart: computed(() => chart.value) })
</script>
