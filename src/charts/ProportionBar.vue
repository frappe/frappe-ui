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
          :style="{ gap: `${SEGMENT_GAP}px` }"
        >
          <button
            v-for="segment in visibleSegments"
            :key="segment.name"
            type="button"
            data-slot="chart-segment"
            :data-state="hovered === segment.name ? 'active' : undefined"
            class="transition-[height,width,opacity] duration-150 focus-visible:focus-ring motion-reduce:transition-none"
            :class="
              hovered === segment.name ? thickness.hovered : thickness.track
            "
            :style="{
              width: `${segment.width}%`,
              backgroundColor: segment.color,
              borderRadius: `${thickness.radius}px`,
              opacity: blurred(segment) ? BLUR_OPACITY : undefined,
            }"
            :aria-label="segmentLabel(segment)"
            @mouseenter="hover(segment, $event)"
            @mousemove="track($event)"
            @mouseleave="clearHover"
            @focus="focusSegment(segment, $event)"
            @blur="clearHover"
            @click="select(segment)"
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
        @change="toggleSegment"
        @highlight="hovered = $event"
      />
    </template>
  </ChartContainer>
</template>

<script setup lang="ts">
import { computed, reactive, ref, useSlots, watch } from 'vue'
import { BLUR_OPACITY } from './axisChartCommon'
import { formatPercent, formatValue } from './format'
import { pruneHiddenSeries } from './hiddenSeries'
import { buildProportionSegments } from './proportionSegments'
import { useChartTokens } from './tokens'
import { documentDir } from './utils'
import ChartContainer from './components/ChartContainer.vue'
import ChartLegend from './components/ChartLegend.vue'
import ChartTooltip from './components/ChartTooltip.vue'
import type {
  ChartLegendItem,
  ChartTooltipItem,
  ProportionBarConfig,
  ProportionBarEmits,
  ProportionBarProps,
  ProportionBarSlots,
  ProportionSegment,
} from './types'

// A single 100% stacked bar: one track, one block per part, read as shares of
// the whole. No echarts — the marks are divs, which is what lets each one be a
// real button with its own focus ring rather than a region of a canvas.

const props = defineProps<ProportionBarProps>()

const hiddenSegments = defineModel<string[]>('hiddenSegments', {
  default: () => [],
})

const emit = defineEmits<ProportionBarEmits>()

defineSlots<ProportionBarSlots>()

const root = ref<HTMLElement>()
const dir = computed(() => props.dir ?? documentDir())

/**
 * How thick the track is, how thick the hovered segment grows to, and how far
 * its corners cut. Two sizes, because the bar is read two ways and there is no
 * third: `'sm'` under a number it breaks down, `'md'` where the breakdown is
 * itself the thing on the card.
 *
 * `'md'` carries the donut's `SLICE_RADIUS`; `'sm'` steps the corner back with
 * the thickness, since a corner at half the height rounds a segment into a
 * capsule and a row of capsules reads as separate objects rather than as one
 * track cut into parts.
 *
 * The hovered segment gains 2px at either size rather than a proportion of the
 * track: the cue is "this one, not its neighbours", and 2px reads as that at
 * 8px as well as at 12px. It is the ring's emphasis, unrolled.
 */
const THICKNESS = {
  sm: { track: 'h-2', hovered: 'h-2.5', radius: 3 },
  md: { track: 'h-3', hovered: 'h-3.5', radius: 4 },
} as const

/**
 * Between one segment and the next. The ring's gap is `padAngle`, an angle, so
 * it is not one distance — it runs about 2px to 3.3px across the ring sizes a
 * card gives it, widest at the outer edge. 3px reads as the same separation on
 * a straight track, and holds at every `size`: the gap separates the blocks,
 * so it should not thin out as the blocks do.
 */
const SEGMENT_GAP = 3

const size = computed(() => props.size ?? 'sm')
const thickness = computed(() => THICKNESS[size.value])

const slots = useSlots()
/** Whether `ChartContainer` is drawing a header row this bar has to clear. */
const hasHeader = computed(() =>
  Boolean(props.title || props.subtitle || slots.actions),
)

const config = computed<ProportionBarConfig>(() => ({
  data: props.data,
  categoryColumn: props.category,
  valueColumn: props.value,
  maxSegments: props.maxSegments,
  palette: props.palette,
  dir: dir.value,
}))

const { tokens } = useChartTokens(root)

const segments = computed(() =>
  buildProportionSegments(config.value, {
    tokens: tokens.value,
    hiddenSegments: hiddenSegments.value,
  }),
)
// A hidden segment keeps its legend entry and leaves the track. So does one
// worth nothing: a block with no width is a seam between its neighbours.
const visibleSegments = computed(() =>
  segments.value.filter((segment) => !segment.hidden && segment.width > 0),
)
const isEmpty = computed(() => !visibleSegments.value.length)

/** Segment under the pointer, under the keyboard focus, or under the legend. */
const hovered = ref<string | null>(null)

/**
 * Everything but the segment being pointed at steps back, the way the ring's
 * other slices do — `focus: 'self'` plus `blur.itemStyle.opacity` on the donut,
 * the same `BLUR_OPACITY` here. Growing one block on its own is a weak cue on a
 * track this thin; the pair is what makes the hover read.
 *
 * Nothing blurs while the legend highlights a segment the bar is not drawing —
 * a hidden one — because there is no segment for the reader to be looking at.
 */
const highlighted = computed(() =>
  visibleSegments.value.some((segment) => segment.name === hovered.value)
    ? hovered.value
    : null,
)
const blurred = (segment: ProportionSegment) =>
  highlighted.value !== null && highlighted.value !== segment.name

const tooltip = reactive({
  open: false,
  x: 0,
  y: 0,
  items: [] as ChartTooltipItem[],
  rows: [] as Record<string, any>[],
})

function hover(segment: ProportionSegment, event: MouseEvent) {
  read(segment)
  track(event)
  tooltip.open = true
}

// A keyboard reader has no pointer to anchor the tooltip to, so it hangs off
// the bottom of the segment's own block.
function focusSegment(segment: ProportionSegment, event: FocusEvent) {
  read(segment)
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
  tooltip.x = rect.left + rect.width / 2
  tooltip.y = rect.bottom
  tooltip.open = true
}

function read(segment: ProportionSegment) {
  hovered.value = segment.name
  tooltip.items = [
    {
      name: segment.name,
      label: segment.label,
      color: segment.color,
      value: segment.value,
      formattedValue: formatMeasure(segment.value),
      percent: segment.percent,
      kind: 'series',
    },
  ]
  // A named segment carries one row; "Others" carries every row it collapsed.
  tooltip.rows = segment.rows
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

function select(segment: ProportionSegment) {
  emit('select', {
    name: segment.label,
    value: segment.value,
    percent: segment.percent,
    rows: segment.rows,
  })
}

/**
 * The accessible name carries the share as well as the value: the block's
 * width is the whole point of the bar, and a reader who cannot see it is
 * otherwise told a number with nothing to read it against.
 */
function segmentLabel(segment: ProportionSegment) {
  return `${segment.label}, ${formatMeasure(segment.value)}, ${formatPercent(
    segment.percent,
  )}`
}

function formatMeasure(value: number) {
  return props.format ? props.format(value) : formatValue(value)
}

const legendItems = computed<ChartLegendItem[]>(() =>
  segments.value.map((segment) => ({
    name: segment.name,
    label: segment.label,
    color: segment.color,
    hidden: segment.hidden,
    // A hidden segment has no share of the visible total, so it shows none.
    hint: segment.hidden ? undefined : formatPercent(segment.percent),
  })),
)

function toggleSegment(name: string) {
  const hidden = hiddenSegments.value
  if (hidden.includes(name)) {
    hiddenSegments.value = hidden.filter((n) => n !== name)
    return
  }
  // Refuse to hide the last segment the bar is drawing — an empty bar reads as
  // a failure to load. Counted against what is drawn rather than against what
  // is unhidden: a segment worth nothing has a legend entry but no block, so
  // it is not the one still holding the bar up.
  if (visibleSegments.value.length <= 1) return
  hiddenSegments.value = [...hidden, name]
}

// Segments that disappear while hidden shouldn't stay in the hidden list
// forever. `pruneHiddenSeries` returns the list unchanged when there is nothing
// to drop, so a controlled `hiddenSegments` doesn't emit on every redraw.
watch(
  () => segments.value.map((segment) => segment.name),
  (names) => {
    hiddenSegments.value = pruneHiddenSeries(hiddenSegments.value, names)
  },
)
</script>
