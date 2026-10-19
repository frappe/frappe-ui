<template>
  <ChartContainer
    :title="title"
    :subtitle="subtitle"
    :loading="loading"
    :error="error"
    :empty="isEmpty"
    :dir="dir"
  >
    <template v-if="$slots.actions" #actions><slot name="actions" /></template>
    <template v-if="$slots['title-suffix']" #title-suffix>
      <slot name="title-suffix" />
    </template>

    <!-- The container owns the three states, so an app that wants a retry
         button beside the message or a skeleton of its own reaches them here
         rather than dropping the chart and rebuilding the chrome. -->
    <template v-if="$slots.loading" #loading><slot name="loading" /></template>
    <template v-if="$slots.error" #error="slotProps">
      <slot name="error" v-bind="slotProps" />
    </template>
    <template v-if="$slots.empty" #empty><slot name="empty" /></template>

    <template #default>
      <div ref="root" class="flex h-full w-full items-center">
        <!-- With every slice at zero the track is drawn bare, as the ring is. -->
        <div
          role="group"
          :aria-label="chartAriaLabel(title, subtitle)"
          class="flex h-3 w-full gap-0.5 rounded-1"
          :style="
            drawn.length ? undefined : { backgroundColor: tokens.gridline }
          "
        >
          <!-- Grown by share rather than by value: grow factors that sum to
               less than 1 leave part of the track empty. The floor keeps a
               sliver of a share on the track, so its legend entry points at
               something. -->
          <button
            v-for="slice in drawn"
            :key="slice.name"
            type="button"
            class="h-full min-w-1 overflow-hidden rounded-1 transition-opacity focus-visible:focus-ring motion-reduce:transition-none"
            :style="{
              flex: `${slice.percent} 1 0`,
              backgroundColor: slice.color,
              opacity:
                highlighted && highlighted !== slice.name
                  ? BLUR_OPACITY
                  : undefined,
            }"
            :aria-label="sliceLabel(slice)"
            @mouseenter="hover(slice, $event)"
            @mousemove="track($event)"
            @mouseleave="clearHover"
            @focus="focusSlice(slice, $event)"
            @blur="clearHover"
            @click="emit('select', sliceEvent(slice))"
          />
        </div>
      </div>

      <ChartTooltip
        :open="tooltip.open"
        :x="tooltip.x"
        :y="tooltip.y"
        :items="tooltip.items"
        :rows="tooltip.rows"
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
        @highlight="hovered = $event"
      />
    </template>
  </ChartContainer>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { BLUR_OPACITY } from './axisChartCommon'
import { formatPercent, formatValue } from './format'
import { pruneHiddenSeries, toggleHiddenSeries } from './hiddenSeries'
import { useTooltipDismiss } from './core/useTooltipDismiss'
import {
  buildSlices,
  drawnSlices,
  sliceEvent,
  sliceLegendItems,
  sliceTooltipItem,
} from './slices'
import { useChartTokens } from './tokens'
import { chartAriaLabel, documentDir } from './utils'
import ChartContainer from './components/ChartContainer.vue'
import ChartLegend from './components/ChartLegend.vue'
import ChartTooltip from './components/ChartTooltip.vue'
import type {
  ChartTooltipItem,
  DonutSlice,
  PercentageBarChartEmits,
  PercentageBarChartProps,
  PercentageBarChartSlots,
} from './types'

// The donut's slices laid along one track. No echarts: each slice is a button,
// so it takes its own tab stop and focus ring where a canvas region cannot.

const props = defineProps<PercentageBarChartProps>()

const hiddenSlices = defineModel<string[]>('hiddenSlices', {
  default: () => [],
})

const emit = defineEmits<PercentageBarChartEmits>()

defineSlots<PercentageBarChartSlots>()

const root = ref<HTMLElement>()
const dir = computed(() => props.dir ?? documentDir())

const { tokens } = useChartTokens(root)

const slices = computed(() =>
  buildSlices(
    {
      data: props.data,
      categoryColumn: props.category,
      valueColumn: props.value,
      maxSlices: props.maxSlices,
      order: props.order,
      palette: props.palette,
      colors: props.colors,
    },
    { tokens: tokens.value, hiddenSlices: hiddenSlices.value },
  ),
)
const drawn = computed(() => drawnSlices(slices.value))
const isEmpty = computed(() => slices.value.every((slice) => slice.hidden))

/** Slice under the pointer, under the keyboard focus, or under the legend. */
const hovered = ref<string | null>(null)

/**
 * The rest of the track steps back from the hovered slice, as the ring does. A
 * hidden slice under the legend has no block to step back from.
 */
const highlighted = computed(() =>
  drawn.value.some((slice) => slice.name === hovered.value)
    ? hovered.value
    : null,
)

const tooltip = reactive({
  open: false,
  x: 0,
  y: 0,
  items: [] as ChartTooltipItem[],
  /** Plural: a slice groups, and "Others" groups the whole tail. */
  rows: [] as Record<string, any>[],
})

useTooltipDismiss({
  plot: root,
  data: () => drawn.value,
  close: () => {
    tooltip.open = false
  },
})

function hover(slice: DonutSlice, event: MouseEvent) {
  readSlice(slice)
  track(event)
  tooltip.open = true
}

// A keyboard reader has no pointer to anchor the tooltip to, so it hangs off the
// bottom of the slice itself.
function focusSlice(slice: DonutSlice, event: FocusEvent) {
  readSlice(slice)
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
  tooltip.x = rect.left + rect.width / 2
  tooltip.y = rect.bottom
  tooltip.open = true
}

function readSlice(slice: DonutSlice) {
  hovered.value = slice.name
  tooltip.items = [sliceTooltipItem(slice, formatMeasure)]
  tooltip.rows = slice.rows
}

function track(event: MouseEvent) {
  tooltip.x = event.clientX
  tooltip.y = event.clientY
}

function clearHover() {
  hovered.value = null
  tooltip.open = false
}

/** The width is what the bar says, so the name carries the share in words. */
function sliceLabel(slice: DonutSlice) {
  return `${slice.label}, ${formatMeasure(slice.value)}, ${formatPercent(
    slice.percent,
  )}`
}

function formatMeasure(value: number) {
  return props.format ? props.format(value) : formatValue(value)
}

const legendItems = computed(() =>
  sliceLegendItems(slices.value, formatMeasure),
)

function toggleSlice(name: string) {
  hiddenSlices.value = toggleHiddenSeries(
    hiddenSlices.value,
    name,
    drawn.value.map((slice) => slice.name),
  )
}

// Slices that disappear while hidden shouldn't stay in the hidden list forever.
// Only ever assigns when something really went away: `slices` reads
// `hiddenSlices`, so an unconditional write here would feed itself.
watch(
  () => slices.value.map((slice) => slice.name),
  (names) => {
    hiddenSlices.value = pruneHiddenSeries(hiddenSlices.value, names)
  },
)
</script>
