<script setup lang="ts">
// The file's small card (Figma 1GDS12ys41lxeG3wQpNq41, 1356:69060 …
// 1356:69141): 223×120 with 12 in from the left and 11 from the top, a
// 14px ink-gray-5 title, the reading in 20px medium ink-gray-8, and a
// row of the change — an arrow glyph and "+7%" in the file's green-4
// (frappe-ui's green-7), or an arrow down and "-4%" in its red-3 (red-5) — then "vs last month" in ink-gray-5 with a
// chevron, the period being a picker. The trend is the library's
// sparkline geometry drawn as the file draws each one: a 1.5px line over
// a gradient that fades by three quarters, bleeding off the bottom; the
// line alone; two-pixel bars with rounded crowns; a solid fill; a 2px
// line beside the number; or the gradient inset in the card's padding.
import { computed } from 'vue'
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
    data?: number[]
    variant?: SparkVariant
    /** the trend's stroke, from the theme */
    color: string
    /** the card's height, the file's 120 unless told otherwise */
    height?: number
  }>(),
  { variant: 'none', height: 120, data: () => [] },
)

const W = 100
const H = 100
const points = computed(() =>
  sparklinePoints(props.data, { width: W, height: H, inset: 4 }),
)
const linePath = computed(() => sparklineLinePath(points.value))
const areaPath = computed(() => sparklineAreaPath(points.value, H))
const bars = computed(() =>
  sparklineBars(props.data, { width: W, height: H, inset: 0, gapRatio: 0.7 }),
)
const negative = computed(() => props.delta?.startsWith('-'))
/** the file sets the change beside the number over a bleeding trend */
const inline = computed(() => ['area', 'line', 'solid'].includes(props.variant))
const id = `spark-${Math.random().toString(36).slice(2, 8)}`
</script>

<template>
  <div
    class="relative overflow-hidden rounded-[12px] border border-outline-gray-1 bg-surface-elevation-2"
    :style="{ height: `${height}px` }"
  >
    <!-- the trend, under the words -->
    <svg
      v-if="variant === 'area' || variant === 'line' || variant === 'solid'"
      class="pointer-events-none absolute inset-x-0 bottom-0"
      :style="{ height: variant === 'line' ? '53px' : '45px' }"
      :viewBox="`0 0 ${W} ${H}`"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient :id="id" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" :stop-color="color" stop-opacity="1" />
          <stop offset="0.76" :stop-color="color" stop-opacity="0" />
        </linearGradient>
      </defs>
      <path
        v-if="variant === 'area'"
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
        vector-effect="non-scaling-stroke"
      />
    </svg>
    <svg
      v-else-if="variant === 'inset'"
      class="pointer-events-none absolute inset-x-3 bottom-[1px] h-[33px]"
      :viewBox="`0 0 ${W} ${H}`"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient :id="id" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" :stop-color="color" stop-opacity="1" />
          <stop offset="0.76" :stop-color="color" stop-opacity="0" />
        </linearGradient>
      </defs>
      <path :d="areaPath" :fill="`url(#${id})`" opacity="0.13" />
      <path
        :d="linePath"
        fill="none"
        :stroke="color"
        stroke-width="1.5"
        stroke-linecap="round"
        vector-effect="non-scaling-stroke"
      />
    </svg>
    <div
      v-else-if="variant === 'bars'"
      class="pointer-events-none absolute inset-x-3 bottom-0 h-[38px]"
      aria-hidden="true"
    >
      <div
        v-for="(bar, i) in bars"
        :key="i"
        class="absolute bottom-0 w-[2px] rounded-t-[4px]"
        :style="{
          left: `${bar.x}%`,
          height: `${bar.height}%`,
          backgroundColor: color,
        }"
      />
    </div>

    <div class="relative flex h-full flex-col px-3 pt-[11px]">
      <div class="text-base leading-[1.15] tracking-[0.02em] text-ink-gray-5">
        {{ title }}
      </div>
      <div
        class="flex items-end gap-[7px]"
        :class="variant === 'beside' ? 'mt-[22px]' : 'mt-2'"
      >
        <template v-if="inline && delta">
          <div
            class="text-[20px] font-medium leading-[1.15] tracking-[0.01em] text-ink-gray-8"
          >
            {{ value }}
          </div>
          <div
            class="flex items-center gap-1 pb-[2px] text-[13px] leading-[1.15] tracking-[0.02em]"
          >
            <span
              class="flex items-center gap-0.5"
              :class="negative ? 'text-ink-red-5' : 'text-ink-green-7'"
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
            <button
              type="button"
              class="flex items-center text-ink-gray-5"
              :aria-label="`Compare: ${caption}`"
            >
              {{ caption }}
              <span class="lucide-chevron-down size-4" aria-hidden="true" />
            </button>
          </div>
        </template>
        <template v-else>
          <div
            class="text-[20px] font-medium leading-[1.15] tracking-[0.01em] text-ink-gray-8"
          >
            {{ value }}
          </div>
          <!-- beside the number: the file's "My tickets" line -->
          <svg
            v-if="variant === 'beside'"
            class="mb-[2px] ml-auto h-[18px] w-[120px]"
            :viewBox="`0 0 ${W} ${H}`"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              :d="linePath"
              fill="none"
              :stroke="color"
              stroke-width="2"
              stroke-linecap="round"
              vector-effect="non-scaling-stroke"
            />
          </svg>
        </template>
      </div>
      <div
        v-if="delta && !inline"
        class="mt-1.5 flex items-center gap-1 text-[13px] leading-[1.15] tracking-[0.02em]"
      >
        <span
          class="flex items-center gap-0.5"
          :class="negative ? 'text-ink-red-5' : 'text-ink-green-7'"
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
        <button
          type="button"
          class="flex items-center text-ink-gray-5"
          :aria-label="`Compare: ${caption}`"
        >
          {{ caption }}
          <span class="lucide-chevron-down size-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  </div>
</template>
