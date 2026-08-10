<template>
  <ChartCard :card="card" :dir="dir">
    <!-- Drawn before the content so the content paints over it without either
         needing a z-index. Both shapes bleed off the bottom edge of the card. -->
    <div
      v-if="showSparkline"
      class="pointer-events-none absolute inset-x-0 bottom-0 h-12"
      :style="sparklineTransform"
      aria-hidden="true"
    >
      <svg
        v-if="sparklineType === 'line'"
        class="h-full w-full"
        :viewBox="`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`"
        preserveAspectRatio="none"
        focusable="false"
      >
        <defs>
          <linearGradient :id="gradientId" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="0%"
              :stop-color="sparklineColor"
              stop-opacity="0.24"
            />
            <stop offset="100%" :stop-color="sparklineColor" stop-opacity="0" />
          </linearGradient>
        </defs>
        <path :d="areaPath" :fill="`url(#${gradientId})`" />
        <path
          :d="linePath"
          fill="none"
          :stroke="sparklineColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          vector-effect="non-scaling-stroke"
        />
      </svg>

      <!-- Boxes, drawn as boxes: an SVG rect stretched by
           `preserveAspectRatio="none"` would carry an oval corner radius. -->
      <div v-else class="relative h-full w-full">
        <div
          v-for="(bar, i) in bars"
          :key="i"
          class="absolute bottom-0 rounded-t-1"
          :style="{
            left: `${bar.x}%`,
            width: `${bar.width}%`,
            height: `${bar.height}%`,
            backgroundColor: sparklineColor,
          }"
        />
      </div>
    </div>

    <!-- Anchored to the top of the card: a delta row or a sparkline adds height
         below the number, it never moves the number. The padding holds the
         space the sparkline band takes out of flow. -->
    <div
      ref="root"
      class="relative flex min-w-0 flex-col gap-1.5"
      :class="{ 'pb-10': showSparkline }"
    >
      <div class="flex min-w-0 items-center justify-between gap-3">
        <div class="min-w-0 truncate text-sm text-ink-gray-5">
          {{ title }}
        </div>
        <!-- Zero height, so whatever the app puts here — a Badge, a button —
             reserves its width and centres on the title without setting the
             row's height and pushing the number down. -->
        <div
          v-if="$slots.actions"
          class="flex h-0 shrink-0 items-center justify-end"
        >
          <slot name="actions" />
        </div>
      </div>

      <!-- The same three states the other charts show through ChartContainer,
           and the same three slots over them: a card that failed says so
           instead of printing a stale or empty reading, and an app that wants a
           retry button beside the message replaces the message. -->
      <template v-if="error">
        <slot name="error" :error="error">
          <div class="text-sm-medium text-ink-red-7">
            Could not render this chart
          </div>
          <div class="truncate text-p-sm text-ink-gray-5">{{ error }}</div>
        </slot>
      </template>

      <template v-else-if="loading">
        <slot name="loading">
          <div class="relative truncate text-3xl-semibold tabular-nums">
            <!-- The number holds the line open while the skeleton covers it, so
                 the card does not resettle when the reading arrives. -->
            <Skeleton class="absolute inset-y-1 start-0 w-28 rounded-4" />
            <span class="invisible">{{ valueText }}</span>
          </div>
          <Skeleton class="my-0.5 h-4 w-32 rounded-4" />
        </slot>
      </template>

      <slot v-else-if="showEmptySlot" name="empty" />

      <template v-else>
        <!-- The ink is the caller's on a reading that carries one, the way a
             series' color is: a card standing for a series is read against it. -->
        <div
          class="relative truncate text-3xl-semibold tabular-nums"
          :class="isEmpty ? 'text-ink-gray-4' : 'text-ink-gray-9'"
          :style="valueStyle"
        >
          {{ valueText }}
        </div>

        <div v-if="isEmpty" class="text-sm text-ink-gray-5">No data</div>

        <!-- One text line tall, and no taller: a control in the caption slot is
             the app's to fit into this row. -->
        <div
          v-else-if="showDeltaRow"
          class="flex min-w-0 items-center gap-1 text-sm"
        >
          <span
            v-if="direction !== 'flat'"
            class="size-4 shrink-0"
            :class="[
              toneClass,
              direction === 'up'
                ? 'lucide-arrow-up-right'
                : 'lucide-arrow-down-left',
            ]"
            aria-hidden="true"
          />
          <span
            v-if="formattedDelta"
            class="text-sm-medium tabular-nums"
            :class="toneClass"
          >
            {{ formattedDelta }}
          </span>
          <!-- The card states the comparison but does not own it: an app that
               lets the reader change the period puts its own Dropdown here. -->
          <slot name="caption" :caption="deltaCaption">
            <span v-if="deltaCaption" class="truncate text-ink-gray-5">
              {{ deltaCaption }}
            </span>
          </slot>
        </div>
      </template>
    </div>
  </ChartCard>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import {
  deltaDirection,
  deltaTone,
  formatCardDelta,
  formatCardValue,
  type DeltaTone,
} from './numberCardFormat'
import {
  sparklineAreaPath,
  sparklineBars,
  sparklineLinePath,
  sparklinePoints,
} from './sparkline'
import { paletteColors, useChartTokens } from './tokens'
import { documentDir, prefersReducedMotion } from './utils'
import { useId } from '#utils/useId'
import Skeleton from '#components/Skeleton/Skeleton.vue'
import ChartCard from './components/ChartCard.vue'
import type { NumberCardProps, NumberCardSlots } from './types'

// No echarts, sparkline included: a page full of these should cost nothing but
// HTML.

// `card` carries its default here as well as on ChartCard because Vue casts an
// absent boolean prop to `false` rather than leaving it undefined: without it
// NumberCard forwards a definite `false` and the surface never draws.
const props = withDefaults(defineProps<NumberCardProps>(), { card: true })

const slots = defineSlots<NumberCardSlots>()

const root = ref<HTMLElement>()
const dir = computed(() => props.dir ?? documentDir())
const isEmpty = computed(
  () => props.value === null || props.value === undefined,
)

// The `-7` inks are the ones Badge prints its green and red text in, and the
// only stops on either ramp that clear text contrast against a white card.
const TONE_CLASSES: Record<DeltaTone, string> = {
  positive: 'text-ink-green-7',
  negative: 'text-ink-red-7',
  neutral: 'text-ink-gray-6',
}

const direction = computed(() => deltaDirection(props.delta))
const toneClass = computed(
  () => TONE_CLASSES[deltaTone(props.delta, props.negativeIsBetter)],
)
const formattedDelta = computed(() => formatCardDelta(props, props.delta))
const showEmptySlot = computed(() => isEmpty.value && Boolean(slots.empty))
// Only over a reading. The em dash a card with no value prints is not a number
// the color says anything about, and the loading skeleton is not one either.
const valueStyle = computed(() =>
  props.color && !isEmpty.value ? { color: props.color } : undefined,
)
const showDeltaRow = computed(
  () =>
    Boolean(formattedDelta.value) ||
    Boolean(props.deltaCaption) ||
    Boolean(slots.caption),
)

// `preserveAspectRatio="none"` makes the horizontal unit meaningless — fine for
// a line with no axis — so the geometry is computed once at any card width.
const VIEW_WIDTH = 100
const VIEW_HEIGHT = 100
/** Room for the 1.5px stroke at the series' peak and trough. */
const VIEW_INSET = 3

// One gradient per card: two cards sharing an id would share a fill.
const gradientId = `number-card-sparkline-${useId()}`

const sparklineType = computed(() => props.sparkline?.type ?? 'line')

const points = computed(() =>
  sparklineType.value === 'line'
    ? sparklinePoints(props.sparkline?.data, {
        width: VIEW_WIDTH,
        height: VIEW_HEIGHT,
        inset: VIEW_INSET,
      })
    : [],
)
const bars = computed(() =>
  sparklineType.value === 'bar'
    ? sparklineBars(props.sparkline?.data, {
        width: VIEW_WIDTH,
        height: VIEW_HEIGHT,
        inset: VIEW_INSET,
      })
    : [],
)
const showSparkline = computed(
  () =>
    !props.loading &&
    !props.error &&
    !isEmpty.value &&
    (points.value.length > 0 || bars.value.length > 0),
)
const linePath = computed(() => sparklineLinePath(points.value))
const areaPath = computed(() => sparklineAreaPath(points.value, VIEW_HEIGHT))

const { tokens } = useChartTokens(root)
const sparklineColor = computed(
  () =>
    props.sparkline?.color ?? paletteColors('sequential', tokens.value, 1)[0],
)

// Time runs with the reading direction, so an RTL card reads oldest-first from
// the right. Mirroring the box is enough: the line carries no text.
const sparklineTransform = computed(() =>
  dir.value === 'rtl' ? { transform: 'scaleX(-1)' } : undefined,
)

/** The count-up runs this long however far the number travels. */
const COUNT_UP_MS = 600

const displayValue = ref<number | string | null>(props.value)
const formattedValue = computed(() =>
  formatCardValue(props, displayValue.value),
)
// Never empty: this line sets the height of the card's top block, and an empty
// one would collapse it and take the block's other variants with it.
const valueText = computed(() => formattedValue.value || '—')

let frame: number | undefined

watch(
  () => props.value,
  (to, from) => {
    cancel()
    // Only a number counts up to another number: a string reading has no
    // intermediate values, and neither does arriving from or landing on nothing.
    if (typeof to !== 'number' || typeof from !== 'number') {
      displayValue.value = to
      return
    }
    if (prefersReducedMotion()) {
      displayValue.value = to
      return
    }
    animate(from, to)
  },
)

function animate(from: number, to: number) {
  const start = performance.now()
  // Snapped to the decimals the endpoints carry: an unrounded intermediate makes
  // the number grow and shrink digits on its way up.
  const decimals =
    props.precision ?? (Number.isInteger(from) && Number.isInteger(to) ? 0 : 2)
  const factor = 10 ** decimals

  const step = (now: number) => {
    const progress = Math.min((now - start) / COUNT_UP_MS, 1)
    const raw = from + (to - from) * easeOut(progress)
    displayValue.value = Math.round(raw * factor) / factor
    if (progress < 1) {
      frame = requestAnimationFrame(step)
      return
    }
    // Lands on the exact value: the eased arithmetic can leave a float behind.
    displayValue.value = to
    frame = undefined
  }
  frame = requestAnimationFrame(step)
}

/** Fast out of the gate, settling on the final number. */
function easeOut(progress: number) {
  return 1 - Math.pow(1 - progress, 3)
}

function cancel() {
  if (frame !== undefined) cancelAnimationFrame(frame)
  frame = undefined
}

onBeforeUnmount(cancel)
</script>
