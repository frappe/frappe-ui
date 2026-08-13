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
      <!-- The scale stands beside the plot rather than under it: a continuous
           ramp is a scale, and a grid's own scale reads down the side of it the
           way the value axis of an axis chart does. It sits after the plot, and
           before it in RTL, so it lands opposite the category axis either way.
           -->
      <div class="flex h-full w-full" :class="{ 'flex-row-reverse': isRTL }">
        <div
          ref="plotEl"
          class="min-w-0 flex-1 rounded-2 focus-visible:focus-ring"
          dir="ltr"
          role="img"
          :aria-label="chartAriaLabel(title, subtitle)"
          v-bind="plotAttrs"
        />

        <!--
          The ends line up with the grid's own furniture: the foot of the ramp
          on the axis line, `min` in the row of x-axis labels reading as one of
          them. Both come out of `xLabelRowHeight` — the one thing about the
          plot that CSS cannot know, because echarts decides how much room the
          x labels need and reserves it inside the plot box.
        -->
        <!--
          `text-2xs` is `AXIS_LABEL_FONT_SIZE` as a class: 11px, and tight,
          because these are single-line micro-labels rather than paragraphs.
          `min` sits in the row of x-axis labels and reads as one of them, so
          the 12px caption token it used to take read as a mistake rather than
          as a difference in rank — and its 1.6 line-height made the label box
          taller than the row echarts had reserved for it.
        -->
        <div class="ms-2 flex shrink-0 flex-col items-center justify-end">
          <span class="text-2xs tabular-nums text-ink-gray-5">
            {{ scale.max }}
          </span>
          <!-- Grows into the room it has and stops: a ramp as tall as the card
               reads as a second column of data rather than as a key to one. -->
          <span
            class="mt-2 max-h-20 w-2 flex-1 rounded-1"
            :style="{ backgroundImage: scale.gradient }"
          />
          <!-- Holds the whole label row below the axis line, so `min` starts
               where an x-axis label starts. -->
          <span
            class="text-2xs tabular-nums text-ink-gray-5"
            :style="{
              marginTop: `${AXIS_LABEL_MARGIN}px`,
              // Its own height until the plot has been laid out once, so the
              // first frame reads as a label rather than as a collapsed box.
              height: xLabelRowHeight
                ? `${Math.max(xLabelRowHeight - AXIS_LABEL_MARGIN, 0)}px`
                : undefined,
            }"
          >
            {{ scale.min }}
          </span>
        </div>
      </div>

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
  AXIS_LABEL_MARGIN,
  buildHeatmapMatrix,
  buildHeatmapOption,
  heatmapCategoryLabel,
  sampleRamp,
} from './heatmapOptions'
import { formatLabel, formatValue } from './format'
import { useChartTokens } from './tokens'
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
const isRTL = computed(() => dir.value === 'rtl')

const config = computed<HeatmapChartConfig>(() => ({
  data: props.data,
  xColumn: props.x,
  yColumn: props.y,
  valueColumn: props.value,
  min: props.min,
  max: props.max,
  xFormat: props.xFormat,
  yFormat: props.yFormat,
  showValues: props.showValues,
  palette: props.palette,
  dir: dir.value,
  echartOptions: props.echartOptions,
}))

const { tokens } = useChartTokens(plotEl)

const matrix = computed(() =>
  buildHeatmapMatrix(config.value, { tokens: tokens.value }),
)
const isEmpty = computed(() => !matrix.value.cells.length)

// A malformed config throws while building the option; surfacing it as an error
// state beats letting it bubble out of a render and blank the whole page.
const built = computed(() => {
  try {
    return {
      option: buildHeatmapOption(config.value, {
        tokens: tokens.value,
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

/**
 * How much of the plot box sits below the axis line: the row echarts reserved
 * for the x-axis labels, in px.
 *
 * The scale beside the plot is DOM and the grid is canvas, so the one number
 * that ties them together has to be read off the laid-out chart — echarts sizes
 * that row from the labels themselves, and it changes with the text, the font
 * and the width. Read after every render, because all three can change without
 * the data doing so.
 */
const xLabelRowHeight = ref(0)

function measureXLabelRow() {
  const grid = (chart.value as any)
    ?.getModel?.()
    ?.getComponent?.('grid', 0)
    ?.coordinateSystem?.getRect?.()
  if (!grid || !chart.value) return

  const below = chart.value.getHeight() - (grid.y + grid.height)
  // Guarded against a re-render loop: the scale's width comes from its labels,
  // so writing this on every frame would re-lay the plot that produced it.
  if (Number.isFinite(below) && Math.abs(below - xLabelRowHeight.value) > 0.5) {
    xLabelRowHeight.value = below
  }
}

const { chart, dispatch } = useChart({
  container: plotEl,
  option: () => built.value.option,
  events: {
    // Fires once the plot has finished laying out, which is the first moment
    // the grid rect means anything, and again after every resize and re-render.
    finished: () => measureXLabelRow(),
    mouseover: (params: any) => showTooltip(params.dataIndex),
    mouseout: () => (tooltip.open = false),
    click: (params: any) => {
      const cell = matrix.value.cells[params.dataIndex]
      if (!cell) return
      emit('select', {
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

/** One category as its axis prints it, by the index the cell sits at. */
function categoryLabelOf(axis: 'x' | 'y', index: number, fallback: string) {
  const { xValues, yValues } = matrix.value
  return axis === 'x'
    ? heatmapCategoryLabel(props.xFormat, xValues[index], fallback)
    : heatmapCategoryLabel(props.yFormat, yValues[index], fallback)
}

function showTooltip(dataIndex: number) {
  const cell = matrix.value.cells[dataIndex]
  if (!cell) {
    tooltip.open = false
    return
  }

  // The two categories head the tooltip, the way the x value heads an axis
  // chart's; the measure is the one line under it. Printed the same way the
  // axes print them, or a reader would meet two spellings of one category.
  tooltip.label = `${categoryLabelOf('y', cell.yIndex, cell.y)} · ${categoryLabelOf('x', cell.xIndex, cell.x)}`
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

/** Takes the emphasis off the cell the cursor has left. */
function downplayCell(index: number | null) {
  if (index === null) return
  dispatch({ type: 'downplay', seriesIndex: 0, dataIndex: index })
}

const keyboard = usePlotKeyboard({
  marks: () => matrix.value.cells,
  // The pair of categories names the cell, whatever order the grid ends up in
  // and whichever refetch built the rows.
  key: (cell) => `${cell.y} ${cell.x}`,
  move: (index, previous) => {
    downplayCell(previous)
    readCell(index)
  },
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
    keyboard.goTo(next)
  },
  activate: (index) => {
    const cell = matrix.value.cells[index]
    if (!cell) return
    emit('select', {
      x: cell.x,
      y: cell.y,
      value: cell.value,
      row: cell.row,
    })
  },
  clear: (previous) => {
    downplayCell(previous)
    tooltip.open = false
    reading.value = ''
  },
})

const plotAttrs = keyboard.attrs

/** The ramp scale in the chrome, painted from the stops the cells came from. */
const scale = computed(() => {
  const { min, max, stops } = matrix.value
  return {
    min: shorten(min),
    max: shorten(max),
    // Upright, low end at the foot. The labels sit above and below the ramp
    // rather than either side of it, so this reads the same in both directions
    // and RTL has nothing to flip.
    gradient: `linear-gradient(to top, ${sampleRamp(stops).join(', ')})`,
  }
})

/** The scale endpoints sit in a narrow strip, so they read shortened. */
function shorten(value: number) {
  return props.format ? props.format(value) : formatValue(value, 1, true)
}

defineExpose<ChartExposed>({ chart: computed(() => chart.value) })
</script>
