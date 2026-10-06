<script setup lang="ts">
// The file's "Bar charts" row (Figma 1GDS12ys41lxeG3wQpNq41, 1356:66389
// … 1356:66508), drawn by the library's BarChart: a lone series on a 2px
// crown, its bars holding 58% of their slot; four series stacked in wider
// columns, labelled inside; the same as shares of 100; six groups of four; the
// horizontals — eleven countries, five channels per country grouped and
// as shares — and the bars with a line over them on a second axis. The
// hover variants the file draws beside them are what the library's
// tooltip and crosshair do on the same cards.
import { computed } from 'vue'
import { BarChart } from '../../../src/charts'
import Card from '../components/Card.vue'
import ChartTip from '../components/ChartTip.vue'
import {
  CHANNELS,
  channelRevenue,
  countries,
  groupYear,
  monthly,
  stackYear,
} from '../chartData'
import { count, incomeAxis, monthAxis, salesAxis, yearAxis } from '../chartAxes'
import type { ThemeColors } from '../useChartTheme'

const props = defineProps<{ theme: ThemeColors }>()

const single = computed(() => [props.theme.one('bar')])
const stack = computed(() => props.theme.colors('stack', 4))
const labelled = computed(() => props.theme.colors('stackLabelled', 4))
const group = computed(() => props.theme.colors('group', 4))
const channels = computed(() => props.theme.colors('scatters', 5))
const lineOver = computed(() => [
  props.theme.one('bar'),
  props.theme.one('markers'),
])

/**
 * The file points at the column under the cursor with a 1px rule the full
 * height of the plot, where the library shades the whole slot behind the bars.
 * The rule is the file's black at 9%, which on either mode is the hairline the
 * page already draws its outlines in.
 */
const crosshair = computed(() => ({
  tooltip: {
    axisPointer: {
      type: 'line',
      lineStyle: {
        color: props.theme.t('outline-gray-2'),
        width: 1,
        type: 'solid',
      },
    },
  },
}))

/**
 * A bar's width, as the file sets it: against its slot, not in pixels. The
 * file measures 14 wide in a 24 slot on the default card, 28 in 43 on the
 * stacked ones, 14 in 43.5 at 100%, and 10 with 2 between in a 90 group —
 * so what carries over is the gap's share of the slot, not the pixels,
 * which were read on a 580-wide card where ours is 447 and narrower still
 * on a small screen. Given in pixels the bars close up as the card narrows;
 * given as a share they keep the file's gaps at any width.
 */
const slot = (gap: number, radius = 0) => ({
  echartOptions: {
    barCategoryGap: `${gap}%`,
    itemStyle: { borderRadius: radius },
  },
})
/** a group of bars: the gap around the group, and the gap between its bars */
const grouped = (gap: number, between: number) => ({
  echartOptions: {
    barCategoryGap: `${gap}%`,
    barGap: `${between}%`,
    itemStyle: { borderRadius: 0 },
  },
})
/**
 * The file's crown, on the two cards that draw a bar on its own: 2 across the
 * top corners (1356:66389 and 1356:66448). Every stacked and grouped bar in
 * the file is square — a crown there would round the top segment alone, which
 * is a shape the stack does not have.
 */
const CROWN = 2
/**
 * The labelled stack: the same 35% slot, and the file's 9px label inside each
 * segment where the library's data labels are 11. At 11 a "$4.6k" is as wide
 * as the column it sits on, so the labels of neighbouring columns meet in the
 * gap between them; at 9 each one sits inside its own segment, as the file
 * draws it.
 */
const labelledStack = {
  echartOptions: { ...slot(35).echartOptions, label: { fontSize: 9 } },
}

const groupedConfig = {
  data1: { label: 'Data 1', format: count, ...grouped(49, 20) },
  data2: { label: 'Data 2', format: count, ...grouped(49, 20) },
  data3: { label: 'Data 3', format: count, ...grouped(49, 20) },
  data4: { label: 'Data 4', format: count, ...grouped(49, 20) },
}
const narrowConfig = {
  data1: { label: 'Data 1', ...slot(68) },
  data2: { label: 'Data 2', ...slot(68) },
  data3: { label: 'Data 3', ...slot(68) },
  data4: { label: 'Data 4', ...slot(68) },
}

/**
 * The file's second stacked card (1356:66568): the same four series in 14-wide
 * columns, with 1px of the card showing between the segments. echarts has no
 * gap inside a stack, so each segment carries a half-pixel border in the
 * card's own surface — a half off each of two neighbours is the file's 1px,
 * and it follows the card into dark mode.
 */
const split = computed(() => {
  const edge = {
    ...slot(66).echartOptions,
    itemStyle: {
      borderRadius: 0,
      borderWidth: 0.5,
      borderColor: props.theme.t('surface-elevation-2'),
    },
  }
  return {
    data1: { label: 'Data 1', format: count, echartOptions: edge },
    data2: { label: 'Data 2', format: count, echartOptions: edge },
    data3: { label: 'Data 3', format: count, echartOptions: edge },
    data4: { label: 'Data 4', format: count, echartOptions: edge },
  }
})
const money = (value: number) =>
  `$${(value / 1000).toFixed(1).replace(/\.0$/, '')}k`
</script>

<template>
  <Card>
    <BarChart
      title="Default Bar Chart"
      :data="monthly"
      x="month"
      y="sales"
      :series-config="{
        sales: { label: 'Sales', format: count, ...slot(42, CROWN) },
      }"
      :x-axis="yearAxis"
      :y-axis="salesAxis"
      :palette="single"
      :echart-options="crosshair"
    >
      <template #tooltip="tip">
        <ChartTip :label="tip.label" :items="tip.items" />
      </template>
    </BarChart>
  </Card>
  <!-- every segment prints its own reading, so this one needs no legend to
       say which series is which — the file draws it without one too -->
  <Card class="bar-card--no-legend">
    <BarChart
      title="Stacked Bar Chart"
      :data="stackYear"
      x="month"
      :y="['data1', 'data2', 'data3', 'data4']"
      stacked
      show-data-labels
      :series-config="{
        data1: { label: 'Data 1', format: money, ...labelledStack },
        data2: { label: 'Data 2', format: money, ...labelledStack },
        data3: { label: 'Data 3', format: money, ...labelledStack },
        data4: { label: 'Data 4', format: money, ...labelledStack },
      }"
      :x-axis="monthAxis"
      :y-axis="salesAxis"
      :palette="labelled"
      :echart-options="crosshair"
    >
      <template #tooltip="tip">
        <ChartTip :label="tip.label" :items="tip.items" />
      </template>
    </BarChart>
  </Card>
  <Card class="bar-card--no-legend">
    <BarChart
      title="100% Stacked"
      :data="stackYear"
      x="month"
      :y="['data1', 'data2', 'data3', 'data4']"
      stacked="normalized"
      :series-config="narrowConfig"
      :x-axis="monthAxis"
      :palette="stack"
      :echart-options="crosshair"
    >
      <template #tooltip="tip">
        <ChartTip :label="tip.label" :items="tip.items" />
      </template>
    </BarChart>
  </Card>
  <Card class="bar-card--no-legend">
    <BarChart
      title="Stacked Bar Chart"
      :data="stackYear"
      x="month"
      :y="['data1', 'data2', 'data3', 'data4']"
      stacked
      :series-config="split"
      :x-axis="monthAxis"
      :y-axis="salesAxis"
      :palette="stack"
      :echart-options="crosshair"
    >
      <template #tooltip="tip">
        <ChartTip :label="tip.label" :items="tip.items" />
      </template>
    </BarChart>
  </Card>
  <Card class="bar-card--no-legend">
    <BarChart
      title="Group stack"
      :data="groupYear"
      x="month"
      :y="['data1', 'data2', 'data3', 'data4']"
      :series-config="groupedConfig"
      :x-axis="monthAxis"
      :y-axis="salesAxis"
      :palette="group"
      :echart-options="crosshair"
    >
      <template #tooltip="tip">
        <ChartTip :label="tip.label" :items="tip.items" />
      </template>
    </BarChart>
  </Card>
  <Card>
    <BarChart
      title="Horizontal"
      :data="countries"
      x="country"
      y="income"
      horizontal
      :series-config="{ income: { label: 'Income per Capita', ...slot(43) } }"
      :x-axis="{ title: 'Top countries' }"
      :y-axis="{ ...incomeAxis, title: 'Income per Capita (USD)' }"
      :palette="single"
      :echart-options="crosshair"
    >
      <template #tooltip="tip">
        <ChartTip :label="tip.label" :items="tip.items" />
      </template>
    </BarChart>
  </Card>
  <Card>
    <BarChart
      title="Horizontal"
      subtitle="Channel Revenue per Country (USD $k)"
      :data="channelRevenue.slice(0, 4)"
      x="country"
      :y="[...CHANNELS]"
      horizontal
      :series-config="
        Object.fromEntries(CHANNELS.map((c) => [c, grouped(30, 33)]))
      "
      :y-axis="incomeAxis"
      :palette="channels"
      :echart-options="crosshair"
    >
      <template #tooltip="tip">
        <ChartTip :label="tip.label" :items="tip.items" />
      </template>
    </BarChart>
  </Card>
  <Card>
    <BarChart
      title="Horizontal 100% Stacked"
      subtitle="Channel Contribution"
      :data="channelRevenue"
      x="country"
      :y="[...CHANNELS]"
      horizontal
      stacked="normalized"
      :series-config="Object.fromEntries(CHANNELS.map((c) => [c, slot(40)]))"
      :palette="channels"
      :echart-options="crosshair"
    >
      <template #tooltip="tip">
        <ChartTip :label="tip.label" :items="tip.items" />
      </template>
    </BarChart>
  </Card>
  <Card class="bar-card--no-legend">
    <BarChart
      title="Secondary / Dual Axis with Line"
      :data="monthly"
      x="month"
      y="sales"
      y2="orders"
      :series-config="{
        sales: { label: 'Sales', format: count, ...slot(42, CROWN) },
        orders: { label: 'Orders', format: count, type: 'line' },
      }"
      :x-axis="yearAxis"
      :y-axis="salesAxis"
      :y2-axis="{ min: 0, max: 4000 }"
      :palette="lineOver"
      :echart-options="crosshair"
    >
      <template #tooltip="tip">
        <ChartTip :label="tip.label" :items="tip.items" />
      </template>
    </BarChart>
  </Card>
</template>

<style scoped>
/* The file's plot box, measured on its 580×360 card (1356:66389): the 24k
   gridline 75 down from the card's top edge and the baseline at 318, with the
   x labels under it ending on the card's own padding. The library puts 8px
   over the first gridline and reserves the label row under the last, so the
   plot takes the rest of the 43 the file leaves under the title off the top
   and gives back the gutter it opens at the bottom. A card carrying a legend
   loses the row to it, as the file's own legend cards do. */
:deep([data-slot='chart-plot']) {
  padding-top: 22px;
  padding-bottom: 5px;
}

/* The file's legend, which is what filters the series here (1356:67154, the
   row at y=324): a 7px square of the series' colour in a 16px cell, the name
   in 12px ink-gray-5 beside it, items 16 apart. The swatch and the label are
   the library's; the button around them carries the hover, the press and the
   switched-off state, so the row reads as something to click. */
:deep([data-slot='chart-legend']) {
  column-gap: 4px;
  row-gap: 2px;
}
:deep([data-slot='chart-legend'] button) {
  padding-left: 6px;
  padding-right: 6px;
  font-size: 12px;
  letter-spacing: 0.02em;
}
:deep([data-slot='chart-legend'] button > span > span) {
  gap: 4.5px;
}
:deep([data-slot='chart-legend'] button > span > span > span:first-child) {
  width: 7px;
  height: 7px;
  border-radius: 2px;
}
/* A card that names its series in the plot itself needs no legend under it,
   and the plot takes the row back — the file's baseline at 318, where a card
   carrying a legend stops short of it. */
.bar-card--no-legend :deep([data-slot='chart-legend']) {
  display: none;
}

/* only while the series is on: switched off, the library's own paler ink
   says so, and the swatch fades with it */
:deep(
  [data-slot='chart-legend']
    button[aria-pressed='true']
    > span
    > span
    > span:nth-child(2)
) {
  color: var(--ink-gray-5);
}
</style>
