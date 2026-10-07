<script setup lang="ts">
// A card of the Charts page, as the Frappe Charts file draws every one
// (Figma 1GDS12ys41lxeG3wQpNq41, 1356:66389 and its neighbours): the
// file's 580×360 proportions on a 12px radius behind an outline-gray-1
// hairline, surface-white, 16 in from every edge, the title in 14px medium
// ink-gray-8 on the top-left. The library's ChartCard holds the surface
// (its own corner is 8px and its padding 16/12); the file's are set here,
// over it, so the chrome under the title — the container, the legend, the
// states — stays the library's.
import { ChartCard } from '../../../src/charts'

defineProps<{
  /** the file's small sparkline card: 223×120, 16 in */
  small?: boolean
  /** a card the width of the row, for the heat table */
  wide?: boolean
  /** a legend of names alone, the share being in the name */
  plainLegend?: boolean
}>()
</script>

<template>
  <ChartCard
    class="chart-page-card"
    :class="[
      small ? 'chart-page-card--small' : wide ? '' : 'aspect-[580/360]',
      wide && 'col-span-full',
      plainLegend && 'chart-page-card--plain-legend',
    ]"
  >
    <div class="flex h-full w-full flex-col">
      <slot />
    </div>
  </ChartCard>
</template>

<style>
/* the file's card over the library's: 12px corner, white, 16 in */
.chart-page-card[data-slot='chart-card'] {
  border-radius: 12px;
  padding: 16px;
}
.chart-page-card--small {
  height: 120px;
}
/* the file's title: 14 medium, 115%, ink-gray-8 (#171717) */
.chart-page-card [data-slot='chart-header'] > div > div:first-child {
  @apply text-base-medium leading-tighter;
  color: var(--ink-gray-8);
}
.chart-page-card [data-slot='chart-header'] > div > div + div {
  @apply text-xs leading-tighter;
  color: var(--ink-gray-5);
  margin-top: 4px;
}
/* a ring's legend prints its slice's share after the name; the file's
   legend names the share in the label itself */
/* The share sits one span deeper than this reached, so it was printing twice —
   "Data (22%) 22%" — where the file names it once (1589:43605's legend is the
   name alone). The legend wraps its row in a truncating span and the row in
   another, so the reading is the third child of the inner one. */
.chart-page-card--plain-legend
  [data-slot='chart-legend']
  button
  > span
  > span
  > span:nth-child(3) {
  display: none;
}
/* the file's legend row: 7px dots, 13px ink-gray-5 labels, 14 apart */
.chart-page-card [data-slot='chart-legend'] {
  column-gap: 6px;
}
.chart-page-card [data-slot='chart-legend'] button {
  @apply text-sm leading-tighter;
  color: var(--ink-gray-5);
}
.chart-page-card [data-slot='chart-legend'] button > span > span:nth-child(2) {
  color: var(--ink-gray-5);
}
</style>
