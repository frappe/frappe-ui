<script setup lang="ts">
// The file's "Bar charts" row (Figma 1GDS12ys41lxeG3wQpNq41, 1356:66389
// … 1356:66508), drawn by the library's BarChart: a lone series 14 wide
// on a 2px crown; four series stacked in 28px columns, labelled inside;
// the same as shares of 100; six groups of four 10px bars; the
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

/** the file's 14px bars, 28px stacked columns, 10px grouped bars */
const width = (px: number) => ({ echartOptions: { barMaxWidth: px } })
const stackedConfig = {
  data1: { label: 'Data 1', ...width(28) },
  data2: { label: 'Data 2', ...width(28) },
  data3: { label: 'Data 3', ...width(28) },
  data4: { label: 'Data 4', ...width(28) },
}
const groupedConfig = {
  data1: { label: 'Data 1', ...width(10) },
  data2: { label: 'Data 2', ...width(10) },
  data3: { label: 'Data 3', ...width(10) },
  data4: { label: 'Data 4', ...width(10) },
}
const narrowConfig = {
  data1: { label: 'Data 1', ...width(14) },
  data2: { label: 'Data 2', ...width(14) },
  data3: { label: 'Data 3', ...width(14) },
  data4: { label: 'Data 4', ...width(14) },
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
      :series-config="{ sales: { label: 'Sales', ...width(14) } }"
      :x-axis="yearAxis"
      :y-axis="salesAxis"
      :palette="single"
    />
  </Card>
  <Card>
    <BarChart
      title="Stacked Bar Chart"
      :data="stackYear"
      x="month"
      :y="['data1', 'data2', 'data3', 'data4']"
      stacked
      show-data-labels
      :series-config="{
        data1: { label: 'Data 1', format: money, ...width(28) },
        data2: { label: 'Data 2', format: money, ...width(28) },
        data3: { label: 'Data 3', format: money, ...width(28) },
        data4: { label: 'Data 4', format: money, ...width(28) },
      }"
      :x-axis="monthAxis"
      :y-axis="salesAxis"
      :palette="labelled"
    />
  </Card>
  <Card>
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
  <Card>
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
  <Card>
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
      :series-config="{ income: { label: 'Income per Capita', ...width(12) } }"
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
      :series-config="Object.fromEntries(CHANNELS.map((c) => [c, width(6)]))"
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
      :series-config="Object.fromEntries(CHANNELS.map((c) => [c, width(24)]))"
      :palette="channels"
    />
  </Card>
  <Card>
    <BarChart
      title="Secondary / Dual Axis with Line"
      :data="monthly"
      x="month"
      y="sales"
      y2="orders"
      :series-config="{
        sales: { label: 'Sales', ...width(14) },
        orders: { label: 'Orders', type: 'line' },
      }"
      :x-axis="yearAxis"
      :y-axis="salesAxis"
      :y2-axis="{ min: 0, max: 4000 }"
      :palette="lineOver"
    />
  </Card>
</template>
