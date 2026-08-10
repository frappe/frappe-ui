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

      <!-- The tooltip hangs off the pointer, which a reader walking the grid
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
import { usePlotKeyboard } from './core/usePlotKeyboard'
import {
  buildHeatmapMatrix,
  buildHeatmapOption,
  sampleRamp,
} from './heatmapOptions'
import { formatLabel, formatValue } from './format'
import { useChartTheme } from './theme'
import { chartAriaLabel, documentDir, plotReading } from './utils'
import ChartContainer from './components/ChartContainer.vue'
import ChartTooltip from './components/ChartTooltip.vue'
import type {
  ChartExposed,
  ChartTooltipItem,
  HeatmapChartConfig,
  HeatmapChartEmits,
  HeatmapChartProps,
  HeatmapChartSlots,
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

const emit = defineEmits<HeatmapChartEmits>()

defineSlots<HeatmapChartSlots>()

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

const { chart, dispatch } = useChart({
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

// The grid is one tab stop and the arrow keys walk it: an echarts plot draws
// into a single element, so there are no per-cell nodes to tab through. Left
// and right run along the data order, up and down hold the column.
const reading = ref('')

function cellPoint(index: number) {
  const el = plotEl.value
  const cell = matrix.value.cells[index]
  if (!el || !cell) return undefined
  const rect = el.getBoundingClientRect()
  const at = chart.value?.convertToPixel({ seriesIndex: 0 }, [
    cell.xIndex,
    cell.yIndex,
  ]) as unknown as number[] | undefined

  if (!at || at.some((n) => typeof n !== 'number' || isNaN(n))) {
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
  }
  return { x: rect.left + at[0], y: rect.top + at[1] }
}

function readCell(index: number) {
  const cell = matrix.value.cells[index]
  if (!cell) return
  const point = cellPoint(index)
  if (point) {
    pointer.x = point.x
    pointer.y = point.y
  }
  dispatch({ type: 'highlight', seriesIndex: 0, dataIndex: index })
  showTooltip(index)
  reading.value = tooltip.open
    ? plotReading(
        tooltip.label,
        tooltip.items.map((item) => ({
          label: item.label,
          value: item.formattedValue,
        })),
      )
    : ''
}

const keyboard = usePlotKeyboard({
  count: () => matrix.value.cells.length,
  move: readCell,
  // The column the cursor is in, one row along. A grid with a hole in it skips
  // nothing sideways, so the vertical step is the one that has to look.
  cross: (delta) => {
    const cells = matrix.value.cells
    const from = cells[keyboard.index.value ?? 0]
    if (!from) return
    const next = cells.findIndex(
      (cell) =>
        cell.xIndex === from.xIndex && cell.yIndex === from.yIndex + delta,
    )
    if (next < 0) return
    keyboard.index.value = next
    readCell(next)
  },
  activate: (index) => {
    const cell = matrix.value.cells[index]
    if (!cell) return
    emit('cellClick', {
      x: cell.x,
      y: cell.y,
      value: cell.value,
      row: cell.row,
    })
  },
  clear: () => {
    if (keyboard.index.value !== null) {
      dispatch({
        type: 'downplay',
        seriesIndex: 0,
        dataIndex: keyboard.index.value,
      })
    }
    tooltip.open = false
    reading.value = ''
  },
})

const plotAttrs = keyboard.attrs

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
