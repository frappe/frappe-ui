<template>
  <ChartContainer
    :title="title"
    :subtitle="subtitle"
    :loading="loading"
    :error="error"
    :empty="isEmpty"
    :dir="dir"
  >
    <template v-if="$slots['title-suffix']" #title-suffix>
      <slot name="title-suffix" />
    </template>
    <template v-if="$slots.actions" #actions><slot name="actions" /></template>

    <!-- The container owns the three states, so an app that wants a retry
         button beside the message or a skeleton of its own reaches them here
         rather than dropping the bar and rebuilding the chrome. -->
    <template v-if="$slots.loading" #loading><slot name="loading" /></template>
    <template v-if="$slots.error" #error="slotProps">
      <slot name="error" v-bind="slotProps" />
    </template>
    <template v-if="$slots.empty" #empty><slot name="empty" /></template>

    <template #default>
      <!-- The track keeps its own thickness whatever height the card gives it,
           and centers in the space that is left. A bar stretched to fill a
           dashboard tile reads as a progress meter, not as a breakdown.

           The extra space under a header is the bar's, not the container's:
           the chrome's own gap suits a plot that fills its box, and a strip
           this thin sitting that close under the subtitle reads as a rule
           under the text rather than as the thing the card is about. A bar
           with no header goes without it: there is nothing above it to be
           separated from. -->
      <div
        ref="root"
        class="flex h-full w-full items-center"
        :class="hasHeader && 'pt-2'"
      >
        <div
          data-slot="chart-track"
          :data-size="size"
          class="flex w-full items-center"
          :class="thickness.track"
          :style="{ gap: `${SLICE_GAP}px` }"
        >
          <button
            v-for="slice in visibleSlices"
            :key="slice.name"
            type="button"
            data-slot="chart-slice"
            :data-state="hovered === slice.name ? 'active' : undefined"
            class="transition-[height,width,opacity] duration-150 focus-visible:focus-ring motion-reduce:transition-none"
            :class="
              hovered === slice.name ? thickness.hovered : thickness.track
            "
            :style="{
              width: `${slice.width}%`,
              backgroundColor: slice.color,
              borderRadius: `${thickness.radius}px`,
              opacity: blurred(slice) ? BLUR_OPACITY : undefined,
            }"
            :aria-label="sliceLabel(slice)"
            @mouseenter="hover(slice, $event)"
            @mousemove="track($event)"
            @mouseleave="clearHover"
            @focus="focusSegment(slice, $event)"
            @blur="clearHover"
            @click="select(slice)"
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
import { useReactiveSlots } from '../composables/useReactiveSlots'
import { pruneHiddenSeries } from './hiddenSeries'
import { buildPercentageBarSlices } from './percentageBarSlices'
import { useChartTokens } from './tokens'
import { documentDir } from './utils'
import ChartContainer from './components/ChartContainer.vue'
import ChartLegend from './components/ChartLegend.vue'
import ChartTooltip from './components/ChartTooltip.vue'
import type {
  ChartLegendItem,
  ChartTooltipItem,
  PercentageBarChartConfig,
  PercentageBarChartEmits,
  PercentageBarChartProps,
  PercentageBarChartSlots,
  PercentageBarSlice,
} from './types'

// A single 100% stacked bar: one track, one block per part, read as shares of
// the whole. No echarts — the marks are divs, which is what lets each one be a
// real button with its own focus ring rather than a region of a canvas.

const props = defineProps<PercentageBarChartProps>()

const hiddenSlices = defineModel<string[]>('hiddenSlices', {
  default: () => [],
})

const emit = defineEmits<PercentageBarChartEmits>()

defineSlots<PercentageBarChartSlots>()

const root = ref<HTMLElement>()
const dir = computed(() => props.dir ?? documentDir())

/**
 * How thick the track is, how thick the hovered slice grows to, and how far
 * its corners cut. Two sizes, because the bar is read two ways and there is no
 * third: `'sm'` under a number it breaks down, `'md'` where the breakdown is
 * itself the thing on the card.
 *
 * `'md'` carries the donut's `SLICE_RADIUS`; `'sm'` steps the corner back with
 * the thickness, since a corner at half the height rounds a slice into a
 * capsule and a row of capsules reads as separate objects rather than as one
 * track cut into parts.
 *
 * The hovered slice gains 2px at either size rather than a proportion of the
 * track: the cue is "this one, not its neighbours", and 2px reads as that at
 * 8px as well as at 12px. It is the ring's emphasis, unrolled.
 */
const THICKNESS = {
  sm: { track: 'h-2', hovered: 'h-2.5', radius: 3 },
  md: { track: 'h-3', hovered: 'h-3.5', radius: 4 },
} as const

/**
 * Between one slice and the next. The ring's gap is `padAngle`, an angle, so
 * it is not one distance — it runs about 2px to 3.3px across the ring sizes a
 * card gives it, widest at the outer edge. 3px reads as the same separation on
 * a straight track, and holds at every `size`: the gap separates the blocks,
 * so it should not thin out as the blocks do.
 */
const SLICE_GAP = 3

const size = computed(() => props.size ?? 'sm')
const thickness = computed(() => THICKNESS[size.value])

// `useSlots()` hands back an object Vue mutates in place and never tracks, so a
// computed over it would cache whichever slots were filled at mount and leave
// the bar padded for a header a parent has since taken away (CONTEXT.md).
const slots = useReactiveSlots()
/** Whether `ChartContainer` is drawing a header row this bar has to clear. */
const hasHeader = computed(() =>
  Boolean(props.title || props.subtitle || slots.actions),
)

const config = computed<PercentageBarChartConfig>(() => ({
  data: props.data,
  categoryColumn: props.category,
  valueColumn: props.value,
  maxSlices: props.maxSlices,
  palette: props.palette,
  dir: dir.value,
}))

const { tokens } = useChartTokens(root)

const slices = computed(() =>
  buildPercentageBarSlices(config.value, {
    tokens: tokens.value,
    hiddenSlices: hiddenSlices.value,
  }),
)
// A hidden slice keeps its legend entry and leaves the track. So does one
// worth nothing: a block with no width is a seam between its neighbours.
const visibleSlices = computed(() =>
  slices.value.filter((slice) => !slice.hidden && slice.width > 0),
)
const isEmpty = computed(() => !visibleSlices.value.length)

/** Slice under the pointer, under the keyboard focus, or under the legend. */
const hovered = ref<string | null>(null)

/**
 * Everything but the slice being pointed at steps back, the way the ring's
 * other slices do — `focus: 'self'` plus `blur.itemStyle.opacity` on the donut,
 * the same `BLUR_OPACITY` here. Growing one block on its own is a weak cue on a
 * track this thin; the pair is what makes the hover read.
 *
 * Nothing blurs while the legend highlights a slice the bar is not drawing —
 * a hidden one — because there is no slice for the reader to be looking at.
 */
const highlighted = computed(() =>
  visibleSlices.value.some((slice) => slice.name === hovered.value)
    ? hovered.value
    : null,
)
const blurred = (slice: PercentageBarSlice) =>
  highlighted.value !== null && highlighted.value !== slice.name

const tooltip = reactive({
  open: false,
  x: 0,
  y: 0,
  items: [] as ChartTooltipItem[],
  rows: [] as Record<string, any>[],
})

function hover(slice: PercentageBarSlice, event: MouseEvent) {
  read(slice)
  track(event)
  tooltip.open = true
}

// A keyboard reader has no pointer to anchor the tooltip to, so it hangs off
// the bottom of the slice's own block.
function focusSegment(slice: PercentageBarSlice, event: FocusEvent) {
  read(slice)
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
  tooltip.x = rect.left + rect.width / 2
  tooltip.y = rect.bottom
  tooltip.open = true
}

function read(slice: PercentageBarSlice) {
  hovered.value = slice.name
  tooltip.items = [
    {
      name: slice.name,
      label: slice.label,
      color: slice.color,
      value: slice.value,
      formattedValue: formatMeasure(slice.value),
      percent: slice.percent,
      kind: 'series',
    },
  ]
  // A named slice carries one row; "Others" carries every row it collapsed.
  tooltip.rows = slice.rows
}

function track(event: MouseEvent) {
  if (!tooltip.open) return
  tooltip.x = event.clientX
  tooltip.y = event.clientY
}

function clearHover() {
  hovered.value = null
  tooltip.open = false
}

function select(slice: PercentageBarSlice) {
  emit('select', {
    name: slice.label,
    value: slice.value,
    percent: slice.percent,
    rows: slice.rows,
  })
}

/**
 * The accessible name carries the share as well as the value: the block's
 * width is the whole point of the bar, and a reader who cannot see it is
 * otherwise told a number with nothing to read it against.
 */
function sliceLabel(slice: PercentageBarSlice) {
  return `${slice.label}, ${formatMeasure(slice.value)}, ${formatPercent(
    slice.percent,
  )}`
}

function formatMeasure(value: number) {
  return props.format ? props.format(value) : formatValue(value)
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

function toggleSlice(name: string) {
  const hidden = hiddenSlices.value
  if (hidden.includes(name)) {
    hiddenSlices.value = hidden.filter((n) => n !== name)
    return
  }
  // Refuse to hide the last slice the bar is drawing — an empty bar reads as
  // a failure to load. Counted against what is drawn rather than against what
  // is unhidden: a slice worth nothing has a legend entry but no block, so
  // it is neither the one holding the bar up nor able to empty it, and its own
  // entry stays pressable however little is left on the track.
  const drawn = visibleSlices.value.some((slice) => slice.name === name)
  if (drawn && visibleSlices.value.length <= 1) return
  hiddenSlices.value = [...hidden, name]
}

// Slices that disappear while hidden shouldn't stay in the hidden list
// forever. `pruneHiddenSeries` returns the list unchanged when there is nothing
// to drop, so a controlled `hiddenSlices` doesn't emit on every redraw.
watch(
  () => slices.value.map((slice) => slice.name),
  (names) => {
    hiddenSlices.value = pruneHiddenSeries(hiddenSlices.value, names)
  },
)
</script>
