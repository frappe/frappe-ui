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
      <div class="relative h-full w-full">
        <div
          ref="plotEl"
          class="h-full w-full rounded-2 focus-visible:focus-ring"
          dir="ltr"
          role="img"
          :aria-label="chartAriaLabel(title, subtitle)"
          v-bind="plotAttrs"
        />

        <!-- The tooltip hangs off the pointer, which a reader walking the ring
             with the arrow keys has not got. The same reading in text. -->
        <span class="sr-only" role="status">{{ reading }}</span>

        <!-- HTML rather than an echarts graphic: swapping the readout on hover
             costs two spans instead of a `setOption` on the ring. -->
        <div
          v-if="!showInlineLabels"
          class="pointer-events-none absolute inset-0 flex items-center justify-center"
          :dir="dir"
        >
          <!-- A square as wide as the plot is tall, so the text stays inside the
               hole however the card is stretched. `min-w-0` is what holds the
               ratio: a flex item otherwise takes its content's min-width, which
               a long category name blows straight past. -->
          <div
            class="relative flex aspect-square h-full min-w-0 max-w-full items-center justify-center"
          >
            <!-- The half ring has no middle to sit in, so the readout drops to
                 the arc's own center. The square is as tall as the plot, so the
                 offset lands on the same fraction of the height as the series
                 center does. -->
            <div
              class="w-[62%]"
              :class="isHalf && 'absolute left-1/2'"
              :style="readoutStyle"
            >
              <slot name="center" v-bind="center">
                <div
                  class="truncate text-center text-xl font-semibold tabular-nums text-ink-gray-8"
                >
                  {{ center.value }}
                </div>
                <!-- The share is the point of the readout, so only the name
                     gives way when the hole is too narrow for both. -->
                <div
                  class="flex items-baseline justify-center gap-1 text-xs text-ink-gray-5"
                >
                  <span class="min-w-0 truncate">{{ center.label }}</span>
                  <span v-if="center.percent" class="shrink-0">
                    {{ center.percent }}
                  </span>
                </div>
              </slot>
            </div>
          </div>
        </div>
      </div>

      <ChartTooltip
        :open="tooltip.open"
        :x="tooltip.x"
        :y="tooltip.y"
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
        @change="toggleSlice"
        @highlight="hoverSlice"
      />
    </template>
  </ChartContainer>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { PieChart as PieSeries } from 'echarts/charts'
import { registerChartModules, useChart } from './core/useChart'
import { usePlotKeyboard } from './core/usePlotKeyboard'
import {
  buildDonutChartOption,
  buildDonutSlices,
  HALF_CENTER_Y,
} from './donutChartOptions'
import { formatLabel, formatPercent, formatValue } from './format'
import { useChartTokens } from './tokens'
import {
  chartAriaLabel,
  documentDir,
  elementCenter,
  plotReading,
} from './utils'
import ChartContainer from './components/ChartContainer.vue'
import ChartLegend from './components/ChartLegend.vue'
import ChartTooltip from './components/ChartTooltip.vue'
import type {
  ChartExposed,
  ChartLegendItem,
  ChartTooltipItem,
  DonutChartConfig,
  DonutChartEmits,
  DonutChartProps,
  DonutChartSlots,
} from './types'

// A pie is all a ring needs: no grid, no axes, and no tooltip component either
// (see buildDonutChartOption).
registerChartModules([PieSeries])

const props = defineProps<DonutChartProps>()

const emit = defineEmits<DonutChartEmits>()

defineSlots<DonutChartSlots>()

const plotEl = ref<HTMLElement>()
const hiddenSlices = ref<string[]>([])

const dir = computed(() => props.dir ?? documentDir())
const isHalf = computed(() => props.variant === 'half')

const config = computed<DonutChartConfig>(() => ({
  data: props.data,
  categoryColumn: props.category,
  valueColumn: props.value,
  maxSlices: props.maxSlices,
  showInlineLabels: props.showInlineLabels,
  centerLabel: props.centerLabel,
  variant: props.variant,
  palette: props.palette,
  dir: dir.value,
  echartOptions: props.echartOptions,
}))

/**
 * The half readout hangs off the arc's flat edge rather than straddling it:
 * `-100%` puts the block's bottom on the pie center, and the lift takes off the
 * line box's half-leading — text-xs is 12px of type in a 16px box, so the
 * bottom 2px of the caption line is space, not glyph.
 */
const HALF_READOUT_LIFT = '2px'
/** Centered by its box but read by its ink, which sits high in that box. */
const FULL_READOUT_DROP = '3px'

const readoutStyle = computed(() =>
  isHalf.value
    ? {
        top: HALF_CENTER_Y,
        transform: `translate(-50%, calc(-100% - ${HALF_READOUT_LIFT}))`,
      }
    : { transform: `translateY(${FULL_READOUT_DROP})` },
)

const { tokens } = useChartTokens(plotEl)

const slices = computed(() =>
  buildDonutSlices(config.value, {
    tokens: tokens.value,
    hiddenSlices: hiddenSlices.value,
  }),
)
const visibleSlices = computed(() => slices.value.filter((s) => !s.hidden))
const isEmpty = computed(() => !visibleSlices.value.length)

const sliceByName = computed(
  () => new Map(slices.value.map((slice) => [slice.name, slice])),
)

// A malformed config throws while building the option; surfacing it as an error
// state beats letting it bubble out of a render and blank the whole page.
const built = computed(() => {
  try {
    return {
      option: buildDonutChartOption(config.value, {
        tokens: tokens.value,
        hiddenSlices: hiddenSlices.value,
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
 * tooltip needs them the moment a slice is entered.
 */
const pointer = reactive({ x: 0, y: 0 })

const tooltip = reactive({
  open: false,
  x: 0,
  y: 0,
  items: [] as ChartTooltipItem[],
})

/** Slice under the pointer, or under the hovered legend entry. */
const hovered = ref<string | null>(null)

const { chart, dispatch } = useChart({
  container: plotEl,
  option: () => built.value.option,
  events: {
    mouseover: (params: any) => {
      hovered.value = params.name
      showTooltip(params.name)
    },
    mouseout: () => {
      hovered.value = null
      tooltip.open = false
    },
    click: (params: any) => {
      const slice = sliceByName.value.get(params.name)
      if (!slice) return
      emit('select', {
        name: slice.label,
        value: slice.value,
        percent: slice.percent,
        rows: slice.rows,
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
    globalout: () => {
      hovered.value = null
      tooltip.open = false
    },
  },
})

// Covers the legend, where echarts hasn't emphasised anything itself. Over the
// ring it repeats what the mouse already did, which echarts takes as a no-op.
watch(hovered, (name, previous) => {
  if (previous) dispatch({ type: 'downplay', seriesIndex: 0, name: previous })
  if (name && !hiddenSlices.value.includes(name)) {
    dispatch({ type: 'highlight', seriesIndex: 0, name })
  }
})

function showTooltip(name: string) {
  const slice = sliceByName.value.get(name)
  if (!slice) {
    tooltip.open = false
    return
  }

  tooltip.items = [
    {
      name: slice.name,
      label: slice.label,
      color: slice.color,
      value: slice.value,
      formattedValue: formatMeasure(slice.value),
      percent: slice.percent,
    },
  ]
  tooltip.x = pointer.x
  tooltip.y = pointer.y
  tooltip.open = true
}

const legendItems = computed<ChartLegendItem[]>(() =>
  slices.value.map((slice) => ({
    name: slice.name,
    label: slice.label,
    color: slice.color,
    hidden: slice.hidden,
    // A hidden slice has no share of the visible total, so it shows none.
    hint: slice.hidden ? undefined : formatPercent(slice.percent),
  })),
)

// The ring is one tab stop and the arrow keys walk it: an echarts plot draws
// into a single element, so there are no per-slice nodes to tab through.
const reading = ref('')

function readSlice(index: number) {
  const slice = visibleSlices.value[index]
  if (!slice) return
  const center = elementCenter(plotEl.value)
  if (center) {
    pointer.x = center.x
    pointer.y = center.y
  }
  hovered.value = slice.name
  showTooltip(slice.name)
  reading.value = plotReading(undefined, [
    {
      label: slice.label,
      value: `${formatMeasure(slice.value)} ${formatPercent(slice.percent)}`,
    },
  ])
}

const { attrs: plotAttrs } = usePlotKeyboard({
  marks: () => visibleSlices.value,
  // A slice is its category, which is what the ring is cut by.
  key: (slice) => slice.name,
  move: readSlice,
  activate: (index) => {
    const slice = visibleSlices.value[index]
    if (!slice) return
    emit('select', {
      name: slice.label,
      value: slice.value,
      percent: slice.percent,
      rows: slice.rows,
    })
  },
  clear: () => {
    hovered.value = null
    tooltip.open = false
    reading.value = ''
  },
})

function toggleSlice(name: string) {
  const hidden = hiddenSlices.value
  // Refuse to hide the last visible slice — an empty ring reads as a bug.
  if (!hidden.includes(name)) {
    if (visibleSlices.value.length === 1) return
    hiddenSlices.value = [...hidden, name]
  } else {
    hiddenSlices.value = hidden.filter((n) => n !== name)
  }
}

function hoverSlice(name: string | null) {
  hovered.value = name
}

const visibleTotal = computed(() =>
  visibleSlices.value.reduce((sum, slice) => sum + slice.value, 0),
)

const center = computed(() => {
  const slice = hovered.value ? sliceByName.value.get(hovered.value) : undefined
  if (slice && !slice.hidden) {
    return {
      value: shorten(slice.value),
      label: slice.label,
      percent: formatPercent(slice.percent),
    }
  }
  return {
    value: shorten(visibleTotal.value),
    label: props.centerLabel ?? formatLabel(props.value),
    percent: undefined,
  }
})

function formatMeasure(value: number) {
  return props.format ? props.format(value) : formatValue(value)
}

/** The hole is small; a full-precision total would not fit in it. */
function shorten(value: number) {
  return props.format ? props.format(value) : formatValue(value, 1, true)
}

// Slices that disappear while hidden shouldn't stay in the hidden list forever.
// Only ever assigns when something really went away: `slices` reads
// `hiddenSlices`, so an unconditional write here would feed itself.
watch(
  () => slices.value.map((slice) => slice.name),
  (names) => {
    if (hiddenSlices.value.every((name) => names.includes(name))) return
    hiddenSlices.value = hiddenSlices.value.filter((name) =>
      names.includes(name),
    )
  },
)

defineExpose<ChartExposed>({ chart: computed(() => chart.value) })
</script>
