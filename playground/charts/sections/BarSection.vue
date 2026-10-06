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
import {
  CHANNELS,
  channelRevenue,
  countries,
  groupYear,
  monthly,
  stackYear,
} from '../chartData'
import { incomeAxis, monthAxis, salesAxis, yearAxis } from '../chartAxes'
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
 * A bar's width, as the file sets it: against its slot, not in pixels. The
 * file measures 14 wide in a 24 slot on the default card, 28 in 43 on the
 * stacked ones, 14 in 43.5 at 100%, and 10 with 2 between in a 90 group —
 * so what carries over is the gap's share of the slot, not the pixels,
 * which were read on a 580-wide card where ours is 447 and narrower still
 * on a small screen. Given in pixels the bars close up as the card narrows;
 * given as a share they keep the file's gaps at any width.
 */
const slot = (gap: number) => ({
  echartOptions: { barCategoryGap: `${gap}%` },
})
/** a group of bars: the gap around the group, and the gap between its bars */
const grouped = (gap: number, between: number) => ({
  echartOptions: { barCategoryGap: `${gap}%`, barGap: `${between}%` },
})
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

const stackedConfig = {
  data1: { label: 'Data 1', ...slot(35) },
  data2: { label: 'Data 2', ...slot(35) },
  data3: { label: 'Data 3', ...slot(35) },
  data4: { label: 'Data 4', ...slot(35) },
}
const groupedConfig = {
  data1: { label: 'Data 1', ...grouped(49, 20) },
  data2: { label: 'Data 2', ...grouped(49, 20) },
  data3: { label: 'Data 3', ...grouped(49, 20) },
  data4: { label: 'Data 4', ...grouped(49, 20) },
}
const narrowConfig = {
  data1: { label: 'Data 1', ...slot(68) },
  data2: { label: 'Data 2', ...slot(68) },
  data3: { label: 'Data 3', ...slot(68) },
  data4: { label: 'Data 4', ...slot(68) },
}
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
      :series-config="{ sales: { label: 'Sales', ...slot(42) } }"
      :x-axis="yearAxis"
      :y-axis="salesAxis"
      :palette="single"
    />
  </Card>
  <Card no-legend>
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
    />
  </Card>
  <Card no-legend>
    <BarChart
      title="Stacked Bar Chart"
      :data="stackYear"
      x="month"
      :y="['data1', 'data2', 'data3', 'data4']"
      stacked
      :series-config="stackedConfig"
      :x-axis="monthAxis"
      :y-axis="salesAxis"
      :palette="stack"
    />
  </Card>
  <Card no-legend>
    <BarChart
      title="100% Stacked"
      :data="stackYear"
      x="month"
      :y="['data1', 'data2', 'data3', 'data4']"
      stacked="normalized"
      :series-config="narrowConfig"
      :x-axis="monthAxis"
      :palette="stack"
    />
  </Card>
  <Card no-legend>
    <BarChart
      title="Group stack"
      :data="groupYear"
      x="month"
      :y="['data1', 'data2', 'data3', 'data4']"
      :series-config="groupedConfig"
      :x-axis="monthAxis"
      :y-axis="salesAxis"
      :palette="group"
    />
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
    />
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
    />
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
    />
  </Card>
  <Card no-legend>
    <BarChart
      title="Secondary / Dual Axis with Line"
      :data="monthly"
      x="month"
      y="sales"
      y2="orders"
      :series-config="{
        sales: { label: 'Sales', ...slot(42) },
        orders: { label: 'Orders', type: 'line' },
      }"
      :x-axis="yearAxis"
      :y-axis="salesAxis"
      :y2-axis="{ min: 0, max: 4000 }"
      :palette="lineOver"
    />
  </Card>
</template>
