<script setup lang="ts">
// A card of the Charts page, as the Frappe Charts file draws every one
// (Figma 1GDS12ys41lxeG3wQpNq41, 1356:66389 and its neighbours): the
// file's 580×360 proportions on a 12px radius behind an outline-gray-1
// hairline, surface-white, 16 in from every edge, the title in 14px semibold
// ink-gray-8 on the top-left. The library's ChartCard holds the surface
// (its own corner is 8px and its padding 16/12); the file's are set here,
// over it, so the chrome under the title — the container, the legend, the
// states — stays the library's.
import { ChartCard } from '../../../src/charts'
import { useChartsEmpty } from '../chartsEmpty'

defineProps<{
  /** the file's small sparkline card: 223×120, 16 in */
  small?: boolean
  /** a card the width of the row, for the heat table */
  wide?: boolean
  /** the pie row's titles, which the file sets in medium rather than semibold */
  mediumTitle?: boolean
}>()

// the page's empty state: the card keeps its title, and the plot, the
// axis titles and the legend give way to the library's own "No data to
// show" — what ChartContainer draws for a chart with nothing to plot
const empty = useChartsEmpty()
</script>

<template>
  <ChartCard
    class="chart-page-card"
    :class="[
      small ? 'chart-page-card--small' : wide ? '' : 'aspect-[580/360]',
      wide && 'col-span-full',
      mediumTitle && 'chart-page-card--medium-title',
      empty && 'is-empty',
    ]"
  >
    <div class="flex h-full w-full flex-col">
      <slot />
    </div>
  </ChartCard>
</template>

<style>
/* Empty: the library's empty state, word for word and in its type, drawn
   over the plot it hides. The plot stays mounted, as the library keeps it
   through every state, so turning the switch off brings it straight back. */
.chart-page-card.is-empty [data-slot='chart-plot'] > *,
.chart-page-card.is-empty [data-slot='chart-container'] > div:not([data-slot]),
.chart-page-card.is-empty [data-slot='chart-legend'] {
  visibility: hidden;
}
.chart-page-card.is-empty [data-slot='chart-plot']::after {
  content: 'No data to show';
  @apply absolute inset-0 flex items-center justify-center text-center text-p-sm text-ink-gray-5;
}
/* the file's card over the library's: 12px corner, white, 16 in */
.chart-page-card[data-slot='chart-card'] {
  border-radius: 12px;
  padding: 16px;
}
.chart-page-card--small {
  height: 120px;
}
/* The file's title: 14 semibold, 115%, ink-gray-8 (#171717) — text/base/
   semibold on every card of the file but the pie row's four, which set
   theirs in text/base/medium (1589:43577 … 43629). */
.chart-page-card [data-slot='chart-header'] > div > div:first-child {
  @apply text-base-semibold leading-tighter;
  color: var(--ink-gray-8);
}
.chart-page-card--medium-title
  [data-slot='chart-header']
  > div
  > div:first-child {
  /* the weight alone: text-base-medium carries the scale's own 1.35, which
     would undo the 1.15 the title stands on and lower the plot by 2.8 */
  @apply text-base-medium leading-tighter;
}
.chart-page-card [data-slot='chart-header'] > div > div + div {
  @apply text-xs leading-tighter;
  color: var(--ink-gray-5);
  margin-top: 4px;
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
