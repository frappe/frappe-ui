<script setup lang="ts">
// The file's small card (Figma 1GDS12ys41lxeG3wQpNq41, 1356:69060 …
// 1356:69141): 223×120 on a 12px corner, 12 in from the left and 11 from the
// top, a 14px ink-gray-5 title, the reading in 20px medium ink-gray-8, and a
// row of the change — an arrow and "+7%" in the file's green-4 (frappe-ui's
// green-7), or an arrow down and "-4%" in its red-3 (red-5) — then "vs last
// month" in ink-gray-5 with a chevron, the period being a picker.
//
// The trend is the library's sparkline geometry, laid out as the file lays
// each one out: a 1.5px line over a gradient that fades by three quarters,
// both bleeding off the card's edges; the line alone; 2px bars with rounded
// crowns, inset by the card's padding; a solid fill; a 2px line beside the
// number; or the gradient inset at the foot of the card. The file draws the
// line across the top of its box and lets the fill run on to the bottom edge,
// which is what `span` carries here.
//
// The file draws no hover state for these, so the one here is the page's own
// and is the plot's: the reading under the pointer gets a dot, and the
// library's tooltip shell carries the file's tooltip body (ChartTip).
import { computed, ref } from 'vue'
import { Dropdown } from '../../../src'
import { ChartTooltip } from '../../../src/charts'
import type { ChartTooltipItem } from '../../../src/charts/types'
import ChartTip from './ChartTip.vue'
import type { SparkVertex } from '../chartData'
import {
  sparklineAreaPath,
  sparklineBars,
  sparklineLinePath,
  sparklinePoints,
} from '../../../src/charts/sparkline'

export type SparkVariant =
  | 'area'
  | 'line'
  | 'bars'
  | 'solid'
  | 'beside'
  | 'inset'
  | 'none'

const props = withDefaults(
  defineProps<{
    title: string
    value: string
    /** the change, as the file prints it: "+7%" */
    delta?: string
    /** the period the change is read against: "vs last month" */
    caption?: string
    /** evenly spaced readings: the bars card */
    data?: number[]
    /** the file's own vertices, each with the x it is drawn at */
    path?: SparkVertex[]
    /**
     * What the trend's low and high read as. The file's vertices are a
     * drawing, so their numbers are the shape's, not the card's: this maps
     * them onto the card's own units for the tooltip, which is linear and so
     * leaves the shape exactly where it was.
     */
    range?: [number, number]
    /** how the tooltip prints a reading */
    format?: (value: number) => string
    variant?: SparkVariant
    /** the trend's stroke, from the theme */
    color: string
    /** the card's height, the file's 120 unless told otherwise */
    height?: number
  }>(),
  { variant: 'none', height: 120, data: () => [] },
)

/**
 * Each trend's box, read off the file: how tall it is, how far in from the
 * card's edges it sits, and how much of its height the line itself takes —
 * the rest is fill, running on to the bottom edge.
 */
const BOXES = {
  area: { h: 42, inset: 0, bottom: 2, span: 0.64 },
  line: { h: 51, inset: 0, bottom: 2, span: 0.7 },
  solid: { h: 51, inset: 0, bottom: 0, span: 1 },
  inset: { h: 32, inset: 12, bottom: 1, span: 0.72 },
  bars: { h: 38, inset: 12, bottom: 0, span: 1 },
} as const

const box = computed(() =>
  props.variant in BOXES ? BOXES[props.variant as keyof typeof BOXES] : null,
)

const H = 100
const readings = computed(() => {
  const raw = props.path ? props.path.map(([, value]) => value) : props.data
  const range = props.range
  if (!range || raw.length < 2) return raw
  const low = Math.min(...raw)
  const high = Math.max(...raw)
  if (high === low) return raw.map(() => range[1])
  return raw.map(
    (value) =>
      range[0] + ((value - low) / (high - low)) * (range[1] - range[0]),
  )
})

/**
 * The trend as points in the viewBox. A card drawn from the file's vertices
 * keeps their x as well as their reading — the file spaces them unevenly, and
 * evening them out would redraw its trend as a different one.
 */
const points = computed(() => {
  const span = H * (box.value?.span ?? 1)
  const even = sparklinePoints(readings.value, {
    width: H,
    height: span,
    inset: 4,
  })
  if (!props.path) return even
  return even.map((point, i) => ({
    x: (props.path![i]?.[0] ?? 0) * H,
    y: point.y,
  }))
})
const linePath = computed(() => sparklineLinePath(points.value))
const areaPath = computed(() => sparklineAreaPath(points.value, H))
const bars = computed(() =>
  sparklineBars(props.data, { width: H, height: H, inset: 0, gapRatio: 0.7 }),
)
const negative = computed(() => props.delta?.startsWith('-'))
/** the file sets the change beside the number over a bleeding trend */
const inline = computed(() => ['area', 'line', 'solid'].includes(props.variant))
const id = `spark-${Math.random().toString(36).slice(2, 8)}`

// --- the hover ------------------------------------------------------------
const trendEl = ref<HTMLElement | null>(null)
const at = ref<number | null>(null)
const pointer = ref({ x: 0, y: 0 })

const marker = computed(() => {
  if (at.value === null) return null
  if (props.variant === 'bars') {
    const bar = bars.value[at.value]
    return bar
      ? { left: `${bar.x + bar.width / 2}%`, top: `${100 - bar.height}%` }
      : null
  }
  const point = points.value[at.value]
  return point ? { left: `${point.x}%`, top: `${point.y}%` } : null
})

const items = computed<ChartTooltipItem[]>(() => {
  const value = at.value === null ? null : readings.value[at.value]
  if (value === null || value === undefined) return []
  return [
    {
      name: 'value',
      label: props.title,
      color: props.color,
      value,
      formattedValue: props.format
        ? props.format(value)
        : Math.round(value).toLocaleString('en-US'),
      kind: 'series',
    },
  ]
})

// --- the comparison picker ------------------------------------------------
/**
 * The chevron after "vs last month" is a picker in the file, so it opens one:
 * the design system's own dropdown, carrying the periods a reading can be read
 * against. The card's numbers are the file's mock, so picking a period changes
 * what the reading is compared with and nothing else.
 */
const PERIODS = [
  'vs last week',
  'vs last month',
  'vs last quarter',
  'vs last year',
]
const period = ref(props.caption ?? PERIODS[1])
const periods = computed(() =>
  PERIODS.map((label) => ({
    label,
    selected: label === period.value,
    onClick: () => {
      period.value = label
    },
  })),
)

function track(event: MouseEvent) {
  const el = trendEl.value
  const count = readings.value.length
  if (!el || count < 2) return
  const rect = el.getBoundingClientRect()
  const share = (event.clientX - rect.left) / rect.width
  if (props.path) {
    let nearest = 0
    props.path.forEach(([x], i) => {
      if (Math.abs(x - share) < Math.abs(props.path![nearest][0] - share))
        nearest = i
    })
    at.value = nearest
  } else {
    at.value = Math.min(count - 1, Math.max(0, Math.round(share * (count - 1))))
  }
  pointer.value = { x: event.clientX, y: event.clientY }
}
</script>

<template>
  <div
    class="relative overflow-hidden rounded-[12px] border border-outline-gray-1 bg-surface-elevation-2"
    :style="{ height: `${height}px` }"
    @mousemove="track"
    @mouseleave="at = null"
  >
    <!-- The trend, under the words. The box is a div rather than the svg
         itself: an svg is a replaced element, so left and right alone never
         stretch it — it takes the width its viewBox' ratio asks for. -->
    <div
      v-if="box && variant !== 'bars'"
      ref="trendEl"
      class="pointer-events-none absolute"
      :style="{
        left: `${box.inset}px`,
        right: `${box.inset}px`,
        bottom: `${box.bottom}px`,
        height: `${box.h}px`,
      }"
      aria-hidden="true"
    >
      <svg
        class="h-full w-full overflow-visible"
        :viewBox="`0 0 ${H} ${H}`"
        preserveAspectRatio="none"
      >
        <!-- The file's gradient runs well past the box it fills: it opens at
             23% of the box's height and would only reach nothing at 179% of
             it, so the fill still carries about a third of its colour at the
             card's bottom edge rather than fading out halfway down. -->
        <defs>
          <linearGradient :id="id" x1="0" y1="0.23" x2="0" y2="1.79">
            <stop offset="0" :stop-color="color" stop-opacity="1" />
            <stop offset="0.764" :stop-color="color" stop-opacity="0" />
          </linearGradient>
        </defs>
        <path
          v-if="variant === 'area' || variant === 'inset'"
          :d="areaPath"
          :fill="`url(#${id})`"
          opacity="0.13"
        />
        <path v-if="variant === 'solid'" :d="areaPath" :fill="color" />
        <path
          v-if="variant !== 'solid'"
          :d="linePath"
          fill="none"
          :stroke="color"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          vector-effect="non-scaling-stroke"
        />
      </svg>
      <span
        v-if="marker && variant !== 'solid'"
        class="absolute size-[5px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        :style="{ ...marker, backgroundColor: color }"
      />
    </div>

    <div
      v-else-if="box"
      ref="trendEl"
      class="pointer-events-none absolute"
      :style="{
        left: `${box.inset}px`,
        right: `${box.inset}px`,
        bottom: `${box.bottom}px`,
        height: `${box.h}px`,
      }"
      aria-hidden="true"
    >
      <div
        v-for="(bar, i) in bars"
        :key="i"
        class="absolute bottom-0 w-[2px] rounded-t-[4px] transition-opacity"
        :style="{
          left: `${bar.x}%`,
          height: `${bar.height}%`,
          backgroundColor: color,
          opacity: at === null || at === i ? 1 : 0.4,
        }"
      />
    </div>

    <div class="relative flex h-full flex-col px-3 pt-[11px]">
      <div class="text-base leading-[1.15] tracking-[0.02em] text-ink-gray-5">
        {{ title }}
      </div>
      <div
        class="flex items-end gap-[7px]"
        :class="variant === 'beside' ? 'mt-[29px]' : 'mt-2'"
      >
        <div
          class="text-[20px] font-medium leading-[1.15] tracking-[0.01em] text-ink-gray-8"
        >
          {{ value }}
        </div>
        <!-- the file sets the change beside the number over a bleeding trend -->
        <div
          v-if="inline && delta"
          class="flex items-center gap-1 pb-[2px] text-[13px] leading-[1.15] tracking-[0.02em]"
        >
          <span
            class="flex items-center gap-0.5"
            :class="negative ? 'spark-fall' : 'text-ink-green-7'"
          >
            <span
              class="size-4"
              :class="
                negative ? 'lucide-arrow-down-left' : 'lucide-arrow-up-right'
              "
              aria-hidden="true"
            />
            {{ delta }}
          </span>
          <Dropdown :options="periods" placement="bottom-start">
            <template #trigger="{ open }">
              <button
                type="button"
                class="flex items-center rounded-2 text-ink-gray-5 transition-colors hover:text-ink-gray-7"
                :aria-label="`Compared with: ${period}`"
              >
                {{ period }}
                <span
                  class="lucide-chevron-down size-4 transition-transform"
                  :class="open && 'rotate-180'"
                  aria-hidden="true"
                />
              </button>
            </template>
          </Dropdown>
        </div>
        <!-- beside the number: the file's "My tickets" line -->
        <svg
          v-if="variant === 'beside'"
          ref="trendEl"
          class="mb-[2px] ml-auto h-[18px] w-[120px] shrink-0"
          :viewBox="`0 0 ${H} ${H}`"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            :d="linePath"
            fill="none"
            :stroke="color"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            vector-effect="non-scaling-stroke"
          />
        </svg>
      </div>
      <div
        v-if="delta && !inline"
        class="flex items-center gap-1 text-[13px] leading-[1.15] tracking-[0.02em]"
        :class="variant === 'beside' ? 'mt-auto pb-3' : 'mt-1.5'"
      >
        <span
          class="flex items-center gap-0.5"
          :class="negative ? 'spark-fall' : 'text-ink-green-7'"
        >
          <span
            class="size-4"
            :class="
              negative ? 'lucide-arrow-down-left' : 'lucide-arrow-up-right'
            "
            aria-hidden="true"
          />
          {{ delta }}
        </span>
        <Dropdown :options="periods" placement="bottom-start">
          <template #trigger="{ open }">
            <button
              type="button"
              class="flex items-center rounded-2 text-ink-gray-5 transition-colors hover:text-ink-gray-7"
              :aria-label="`Compared with: ${period}`"
            >
              {{ period }}
              <span
                class="lucide-chevron-down size-4 transition-transform"
                :class="open && 'rotate-180'"
                aria-hidden="true"
              />
            </button>
          </template>
        </Dropdown>
      </div>
    </div>

    <ChartTooltip
      :open="at !== null && items.length > 0"
      :x="pointer.x"
      :y="pointer.y"
      :items="items"
      :rows="[]"
    >
      <template #default="tip">
        <ChartTip :items="tip.items" />
      </template>
    </ChartTooltip>
  </div>
</template>

<style scoped>
/* The file's red is ink-red-5, which is exactly its #e03636 in light. The red
   scale does not flip the way the green's does, though: in dark mode the rise
   beside it (ink-green-7) lands at oklch L 0.77 while ink-red-5 lands at 0.55,
   so the fall reads dimmer than the rise rather than beside it. Dark takes
   ink-red-7, which lands at 0.73 — the same weight as the green. */
.spark-fall {
  color: var(--ink-red-5);
}
:root[data-theme='dark'] .spark-fall {
  color: var(--ink-red-7);
}
@media (prefers-color-scheme: dark) {
  :root:not([data-theme='light']) .spark-fall {
    color: var(--ink-red-7);
  }
}
</style>
