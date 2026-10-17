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
    <template v-if="$slots['title-suffix']" #title-suffix>
      <slot name="title-suffix" />
    </template>

    <template v-if="$slots.loading" #loading><slot name="loading" /></template>
    <template v-if="$slots.error" #error="slotProps">
      <slot name="error" v-bind="slotProps" />
    </template>
    <template v-if="$slots.empty" #empty><slot name="empty" /></template>

    <template #default>
      <!-- echarts lays a calendar out left to right only, so the plot keeps
           `ltr` in both directions. -->
      <div
        ref="plotEl"
        class="h-full w-full rounded-2 focus-visible:focus-ring"
        dir="ltr"
        role="img"
        :aria-label="chartAriaLabel(title, subtitle)"
        v-bind="plotAttrs"
      />

      <!-- Under the last band rather than under the card, so the scale sits
           with what it explains however much height the card has to spare. -->
      <div
        v-if="!isEmpty && layout"
        data-slot="chart-scale"
        class="absolute flex -translate-x-full items-center gap-2 text-2xs tabular-nums text-ink-gray-5"
        :style="{ top: `${layout.scaleTop}px`, left: `${layout.right}px` }"
      >
        <span>{{ scale.min }}</span>
        <span
          class="h-2 w-20 rounded-1"
          :style="{ backgroundImage: scale.gradient }"
        />
        <span>{{ scale.max }}</span>
      </div>

      <span class="sr-only" role="status">{{ reading }}</span>

      <ChartTooltip
        :open="tooltip.open"
        :x="tooltip.x"
        :y="tooltip.y"
        :label="tooltip.label"
        :items="tooltip.items"
        :rows="tooltip.rows"
        :dir="dir"
      >
        <template v-if="$slots.tooltip" #default="slotProps">
          <slot name="tooltip" v-bind="slotProps" />
        </template>
      </ChartTooltip>
    </template>
  </ChartContainer>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { HeatmapChart as HeatmapSeries } from 'echarts/charts'
import {
  CalendarComponent,
  VisualMapContinuousComponent,
} from 'echarts/components'
import { registerChartModules, useChart } from './core/useChart'
import { usePlotKeyboard } from './core/usePlotKeyboard'
import { useTooltipDismiss } from './core/useTooltipDismiss'
import {
  buildCalendarHeatmapGrid,
  buildCalendarHeatmapOption,
  layoutCalendar,
} from './calendarHeatmapOptions'
import { sampleRamp } from './heatmapOptions'
import { formatDate, formatLabel, formatValue } from './format'
import { useChartTokens } from './tokens'
import { chartAriaLabel, documentDir, plotReading } from './utils'
import ChartContainer from './components/ChartContainer.vue'
import ChartTooltip from './components/ChartTooltip.vue'
import type {
  CalendarHeatmapCell,
  CalendarHeatmapChartConfig,
  CalendarHeatmapChartEmits,
  CalendarHeatmapChartProps,
  CalendarHeatmapChartSlots,
  ChartExposedRefs,
  ChartTooltipItem,
} from './types'

registerChartModules([
  HeatmapSeries,
  CalendarComponent,
  VisualMapContinuousComponent,
])

const props = defineProps<CalendarHeatmapChartProps>()

const emit = defineEmits<CalendarHeatmapChartEmits>()

defineSlots<CalendarHeatmapChartSlots>()

const plotEl = ref<HTMLElement>()

const dir = computed(() => props.dir ?? documentDir())

const config = computed<CalendarHeatmapChartConfig>(() => ({
  data: props.data,
  dateColumn: props.date,
  valueColumn: props.value,
  start: props.start,
  end: props.end,
  weekStart: props.weekStart,
  min: props.min,
  max: props.max,
  palette: props.palette,
  echartOptions: props.echartOptions,
}))

const { tokens } = useChartTokens(plotEl)

// A config the grid cannot be built from is reported by `built` below.
const grid = computed(() => {
  try {
    return buildCalendarHeatmapGrid(config.value, { tokens: tokens.value })
  } catch {
    return undefined
  }
})
const cells = computed(() => grid.value?.cells ?? [])
const isEmpty = computed(() => !cells.value.length)

const size = computed(() => ({
  width: plotWidth.value,
  height: plotHeight.value,
}))

const layout = computed(
  () => grid.value && layoutCalendar(grid.value, config.value, size.value),
)

const built = computed(() => {
  try {
    return {
      option: buildCalendarHeatmapOption(
        config.value,
        { tokens: tokens.value, ...size.value },
        grid.value,
      ),
      error: null as string | null,
    }
  } catch (e: any) {
    return { option: undefined, error: e?.message ?? String(e) }
  }
})

const renderError = computed(() => built.value.error)

const pointer = reactive({ x: 0, y: 0 })

const tooltip = reactive({
  open: false,
  x: 0,
  y: 0,
  label: undefined as string | undefined,
  items: [] as ChartTooltipItem[],
  rows: [] as Record<string, any>[],
})

useTooltipDismiss({
  plot: plotEl,
  data: () => cells.value,
  close: () => {
    tooltip.open = false
  },
})

/** The day under an echarts event. Days with no data are drawn silent. */
function eventCell(params: any): CalendarHeatmapCell | undefined {
  return grid.value?.bands[params.seriesIndex]?.cells[params.dataIndex]
}

function select(cell: CalendarHeatmapCell | undefined) {
  if (!cell) return
  emit('select', { date: cell.date, value: cell.value, rows: cell.rows })
}

const {
  chart,
  dispatch,
  width: plotWidth,
  height: plotHeight,
} = useChart({
  container: plotEl,
  option: () => built.value.option,
  events: {
    mouseover: (params: any) => showTooltip(eventCell(params)),
    mouseout: () => (tooltip.open = false),
    click: (params: any) => select(eventCell(params)),
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

function showTooltip(cell: CalendarHeatmapCell | undefined) {
  if (!cell) {
    tooltip.open = false
    return
  }
  tooltip.label = formatDate(cell.date, 'day', 'ddd, MMM D, YYYY')
  tooltip.items = [
    {
      name: cell.date,
      label: formatLabel(props.value),
      color: cell.color,
      value: cell.value,
      formattedValue: props.format
        ? props.format(cell.value)
        : formatValue(cell.value),
      kind: 'series',
    },
  ]
  tooltip.rows = cell.rows
  tooltip.x = pointer.x
  tooltip.y = pointer.y
  tooltip.open = true
}

// One tab stop; the arrow keys walk the days that have data, in date order.
const reading = ref('')

function cellPoint(cell: CalendarHeatmapCell) {
  const el = plotEl.value
  if (!el) return undefined
  const rect = el.getBoundingClientRect()
  // echarts types the finder without the calendar's own key.
  const finder: Record<string, number> = { calendarIndex: cell.band }
  const at = chart.value?.convertToPixel(finder, cell.date) as unknown as
    number[] | undefined
  if (!at || at.some((n) => typeof n !== 'number' || isNaN(n))) {
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
  }
  return { x: rect.left + at[0], y: rect.top + at[1] }
}

function readCell(index: number) {
  const cell = cells.value[index]
  if (!cell) return
  const point = cellPoint(cell)
  if (point) {
    pointer.x = point.x
    pointer.y = point.y
  }
  dispatch({
    type: 'highlight',
    seriesIndex: cell.band,
    dataIndex: cell.bandIndex,
  })
  showTooltip(cell)
  reading.value = plotReading(
    tooltip.label,
    tooltip.items.map((item) => ({
      label: item.label,
      value: item.formattedValue,
    })),
  )
}

function downplayCell(index: number | null) {
  const cell = index === null ? undefined : cells.value[index]
  if (!cell) return
  dispatch({
    type: 'downplay',
    seriesIndex: cell.band,
    dataIndex: cell.bandIndex,
  })
}

const { attrs: plotAttrs } = usePlotKeyboard({
  marks: () => cells.value,
  key: (cell) => cell.date,
  move: (index, previous) => {
    downplayCell(previous)
    readCell(index)
  },
  activate: (index) => select(cells.value[index]),
  clear: (previous) => {
    downplayCell(previous)
    tooltip.open = false
    reading.value = ''
  },
})

/** The ramp under the plot, painted from the stops the cells came from. */
const scale = computed(() => {
  const { min = 0, max = 0, stops = [] } = grid.value ?? {}
  const towards = dir.value === 'rtl' ? 'left' : 'right'
  return {
    min: shorten(min),
    max: shorten(max),
    gradient: `linear-gradient(to ${towards}, ${sampleRamp(stops).join(', ')})`,
  }
})

/** The scale ends sit in a narrow strip, so they read shortened. */
function shorten(value: number) {
  return props.format ? props.format(value) : formatValue(value, 1, true)
}

defineExpose<ChartExposedRefs>({ chart: computed(() => chart.value) })
</script>
