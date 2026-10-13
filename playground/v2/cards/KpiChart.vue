<script setup lang="ts">
// The chart inside a KPI card: the design's own art, plus a reading of the
// point under the pointer. The points come from that art (see kpiSeries.ts),
// so the reading always matches the shape being pointed at.
//
// The bubble is frappe-ui's Tooltip, which portals out of the card — so it
// is never clipped at the card's corners. Its trigger is an invisible band
// that snaps to the nearest point and spans half the way to each neighbour,
// so the pointer stays inside it as it travels and the bubble follows
// without closing. Until the pointer has moved once, the band covers the
// whole chart, so the bubble opens as soon as the chart is entered.
import { computed, ref } from 'vue'
import { Tooltip } from '../../../src'
import type { Period, Series } from './kpiSeries'

const props = defineProps<{
  chart: string
  series: Series
  /** the chart slot's height in px (42, 37 for the stacked bars, 40 right) */
  height: number
  /** the foot chart runs over the card's hairline to its edges */
  fullBleed?: boolean
  period: Period
  total: number
}>()

// the points, scaled so they add up to the card's headline
const points = computed(() => {
  const sum = props.series.points.reduce((t, p) => t + p.h, 0)
  return props.series.points.map((p) => ({
    ...p,
    value: Math.max(1, Math.round((p.h / sum) * props.total)),
  }))
})

const hovered = ref<number | null>(null)
const box = ref<HTMLElement | null>(null)
// the box the art is drawn in, measured as the pointer moves: the SVG
// keeps its aspect, so it is scaled to the box's width and centred in its
// height — the mark has to follow that, not the box
const size = ref<{ w: number; h: number } | null>(null)

function onMove(event: PointerEvent) {
  const el = box.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  size.value = { w: rect.width, h: rect.height }
  // the art is laid out in viewBox units; scale the pointer into them
  const x = ((event.clientX - rect.left) / rect.width) * props.series.width
  let best = 0
  for (let i = 1; i < points.value.length; i++) {
    if (Math.abs(points.value[i].x - x) < Math.abs(points.value[best].x - x)) {
      best = i
    }
  }
  hovered.value = best
}

const pct = (units: number) => `${(units / props.series.width) * 100}%`

const marker = computed(() => {
  const i = hovered.value
  if (i === null) return null
  const all = points.value
  const p = all[i]
  const n = all.length
  const stepMs = (props.period.days * 86400000) / Math.max(1, n - 1)
  const at = new Date(Date.now() - (n - 1 - i) * stepMs)
  // the band reaches halfway to each neighbour, and to the edge at the ends
  const from = i === 0 ? 0 : (p.x + all[i - 1].x) / 2
  const to = i === n - 1 ? props.series.width : (p.x + all[i + 1].x) / 2
  // the art is scaled to the box's width and centred vertically, so the dot
  // rides the drawn line rather than the box's own proportions
  const scale = size.value ? size.value.w / props.series.width : 1
  const drawn = props.series.height * scale
  const top = size.value
    ? (size.value.h - drawn) / 2 + (props.series.height - p.h) * scale
    : 0
  return {
    left: pct(p.x),
    top: `${top}px`,
    band: { left: pct(from), width: pct(to - from) },
    value: p.value,
    when: format(at, stepMs),
  }
})

// the day, or the month once the points are a month or more apart — never
// a clock time
function format(date: Date, stepMs: number) {
  const day = date.getDate()
  const month = date.toLocaleString('en', { month: 'short' })
  if (stepMs < 28 * 86400000) return `${day} ${month}`
  return `${month} ${date.getFullYear()}`
}
</script>

<template>
  <div
    ref="box"
    class="kpi-chart relative"
    :class="fullBleed ? '-mx-px -mb-px w-[calc(100%+2px)]' : 'w-[146px]'"
    :style="{ height: `${height}px` }"
    @pointermove="onMove"
    @pointerleave="hovered = null"
  >
    <div
      class="flex size-full items-center overflow-hidden"
      aria-hidden="true"
      v-html="chart"
    />
    <template v-if="marker">
      <span class="kpi-rule" :style="{ left: marker.left }" />
      <!-- the line charts mark the point itself; the bars don't -->
      <span
        v-if="series.dot"
        class="kpi-dot"
        :style="{ left: marker.left, top: marker.top }"
      />
    </template>
    <Tooltip :hover-delay="0" side="top" :offset="6">
      <template #content>
        <span class="whitespace-nowrap">
          <b class="font-medium">{{ marker?.value }}</b> subscribers ·
          {{ marker?.when }}
        </span>
      </template>
      <!-- before the first move the band covers the chart, so entering it
           opens the bubble at once; after that it snaps to the point -->
      <span class="kpi-hit" :style="marker?.band ?? { left: '0%', width: '100%' }" />
    </Tooltip>
  </div>
</template>

<style>
/* the hovered point: a rule through the chart, and a dot on the line */
.kpi-rule {
  @apply pointer-events-none absolute inset-y-0 w-px;
  /* no bg-outline-* utility exists; the token is the variable */
  background-color: var(--outline-gray-3);
}
.kpi-dot {
  @apply pointer-events-none absolute size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full;
  background-color: var(--ink-violet-5);
  box-shadow: 0 0 0 2px var(--card-surface);
}
/* the tooltip's trigger: invisible, and only under the pointer */
.kpi-hit {
  @apply absolute inset-y-0 block;
}
</style>
