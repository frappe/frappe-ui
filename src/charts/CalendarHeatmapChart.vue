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
           with what it explains however much height the card has to spare.
           Ends where the calendar ends, unless the calendar is narrower than
           the scale: then it starts at the plot's edge. -->
      <ChartScale
        v-if="grid && cells.length && layout"
        class="absolute"
        :style="{
          top: `${layout.scaleTop}px`,
          left: `${layout.right}px`,
          transform: `translateX(max(-100%, -${layout.right}px))`,
        }"
        :min="grid.min"
        :max="grid.max"
        :stops="grid.stops"
        :format="format"
        :below-min="clipped.belowMin"
        :above-max="clipped.aboveMax"
        :dir="dir"
      />

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
import { formatDate, formatLabel, formatValue } from './format'
import { useChartTokens, useResolvedConfig } from './tokens'
import { chartAriaLabel, documentDir, plotReading } from './utils'
import ChartContainer from './components/ChartContainer.vue'
import ChartScale from './components/ChartScale.vue'
import ChartTooltip from './components/ChartTooltip.vue'
import type {
  CalendarHeatmapChartConfig,
  CalendarHeatmapChartEmits,
  CalendarHeatmapChartProps,
  CalendarHeatmapChartSlots,
  CalendarHeatmapDay,
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

const config = useResolvedConfig<CalendarHeatmapChartConfig>(
  () => ({
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
  }),
  plotEl,
)

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
const days = computed(() => grid.value?.days ?? [])
const isEmpty = computed(() => !grid.value?.bands.length)

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
  data: () => days.value,
  close: () => {
    tooltip.open = false
  },
})

const dayIndexes = computed(
  () => new Map(days.value.map((day, index) => [day.date, index])),
)

/** The day under an echarts event: both series carry it first in the value. */
function eventDay(params: any): CalendarHeatmapDay | undefined {
  const index = dayIndexes.value.get(params.value?.[0])
  return index === undefined ? undefined : days.value[index]
}

/** A day with no row has nothing to report, so it does not select. */
function select(day: CalendarHeatmapDay | undefined) {
  const cell = day?.cell
  if (!cell) return
  emit('select', { date: cell.date, value: cell.value, row: cell.row })
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
    mouseover: (params: any) => showTooltip(eventDay(params)),
    mouseout: () => (tooltip.open = false),
    click: (params: any) => select(eventDay(params)),
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

function showTooltip(day: CalendarHeatmapDay | undefined) {
  if (!day) {
    tooltip.open = false
    return
  }
  const { cell } = day
  tooltip.label = formatDate(day.date, 'day', 'ddd, MMM D, YYYY')
  tooltip.items = [
    {
      name: day.date,
      label: formatLabel(props.value),
      color: cell?.color ?? tokens.value.gridline,
      value: cell?.value ?? '',
      formattedValue: !cell
        ? 'No data'
        : props.format
          ? props.format(cell.value)
          : formatValue(cell.value),
      kind: 'series',
    },
  ]
  tooltip.rows = cell ? [cell.row] : []
  tooltip.x = pointer.x
  tooltip.y = pointer.y
  tooltip.open = true
}

// One tab stop. The arrow keys walk the grid as it is drawn, every day of it,
// so a reader finds the date of a gap as well as of a day with data. The grid
// runs left to right in RTL too, so right is always the next week.
const reading = ref('')

function dayPoint(day: CalendarHeatmapDay) {
  const el = plotEl.value
  if (!el) return undefined
  const rect = el.getBoundingClientRect()
  // echarts types the finder without the calendar's own key.
  const finder: Record<string, number> = { calendarIndex: day.band }
  const at = chart.value?.convertToPixel(finder, day.date) as unknown as
    number[] | undefined
  if (!at || at.some((n) => typeof n !== 'number' || isNaN(n))) {
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
  }
  return { x: rect.left + at[0], y: rect.top + at[1] }
}

function readDay(index: number) {
  const day = days.value[index]
  if (!day) return
  const point = dayPoint(day)
  if (point) {
    pointer.x = point.x
    pointer.y = point.y
  }
  dispatch({
    type: 'highlight',
    seriesIndex: day.seriesIndex,
    dataIndex: day.dataIndex,
  })
  showTooltip(day)
  reading.value = plotReading(
    tooltip.label,
    tooltip.items.map((item) => ({
      label: item.label,
      value: item.formattedValue,
    })),
  )
}

function downplayDay(index: number | null) {
  const day = index === null ? undefined : days.value[index]
  if (!day) return
  dispatch({
    type: 'downplay',
    seriesIndex: day.seriesIndex,
    dataIndex: day.dataIndex,
  })
}

/** Moves the cursor `count` days on. Past either end of the range, it holds. */
function walk(count: number) {
  const next = (keyboard.index.value ?? 0) + count
  if (next < 0 || next >= days.value.length) return
  keyboard.goTo(next)
}

const keyboard = usePlotKeyboard({
  marks: () => days.value,
  key: (day) => day.date,
  move: (index, previous) => {
    downplayDay(previous)
    readDay(index)
  },
  along: (delta) => walk(7 * delta),
  cross: walk,
  activate: (index) => select(days.value[index]),
  clear: (previous) => {
    downplayDay(previous)
    tooltip.open = false
    reading.value = ''
  },
})

const plotAttrs = keyboard.attrs

/** Days past an end of the scale: a `max` set under an outlier must say so. */
const clipped = computed(() => {
  const { min = 0, max = 0 } = grid.value ?? {}
  return {
    belowMin: cells.value.some((cell) => cell.value < min),
    aboveMax: cells.value.some((cell) => cell.value > max),
  }
})

defineExpose<ChartExposedRefs>({ chart: computed(() => chart.value) })
</script>
