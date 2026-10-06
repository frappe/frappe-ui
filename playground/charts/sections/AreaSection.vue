<script setup lang="ts">
// The file's "Area Charts" row (Figma 1GDS12ys41lxeG3wQpNq41, 1356:67489
// … 1356:67608), by the library's AreaChart: sales under a 1.5px line on
// a flat 20% fill, captioned "Overall Sales"; the same with its values
// printed; four areas stacked, only the lowest carrying a line; four
// stepped areas over a year; and member growth with its subtitle. The
// hover the file draws — the crosshair, the tooltip, the other series
// faded — is the library's own.
import { computed } from 'vue'
import { AreaChart } from '../../../src/charts'
import Card from '../components/Card.vue'
import { monthly, year } from '../chartData'
import { monthAxis, salesAxis, thousands, yearAxis } from '../chartAxes'
import type { ThemeColors } from '../useChartTheme'

const props = defineProps<{ theme: ThemeColors }>()

const area = computed(() => [props.theme.one('area')])
const areas = computed(() => props.theme.colors('areas', 4))
const stepped = computed(() => props.theme.colors('stepped', 4))

const stacked = monthly.map((row, i) => ({
  month: row.month,
  data1: Math.round(row.sales * 0.4),
  data2: Math.round(row.sales * 0.2 + (i % 3) * 200),
  data3: Math.round(row.sales * 0.12 + (i % 2) * 300),
  data4: Math.round(row.sales * 0.1 + (i % 4) * 150),
}))

const steppedRows = year.map((row, i) => ({
  month: row.month,
  data1: Math.round(row.sales * 0.5 + (i % 3) * 400),
  data2: Math.round(row.sales * 0.4 + (i % 4) * 300),
  data3: Math.round(row.sales * 0.3 + (i % 2) * 500),
  data4: Math.round(row.sales * 0.1 + (i % 5) * 200),
}))

const step = { echartOptions: { step: 'end', lineStyle: { width: 1 } } }
const stepConfig = {
  data1: { label: 'Data 1', ...step },
  data2: { label: 'Data 2', ...step },
  data3: { label: 'Data 3', ...step },
  data4: { label: 'Data 4', ...step },
}

/** the upper three of the stack carry no line of their own */
const noLine = { echartOptions: { lineStyle: { width: 0 } } }
const stackConfig = {
  data1: { label: 'Sales' },
  data2: { label: 'Data 2', ...noLine },
  data3: { label: 'Data 3', ...noLine },
  data4: { label: 'Data 4', ...noLine },
}
</script>

<template>
  <Card>
    <AreaChart
      title="Area Chart"
      subtitle="Overall Sales"
      :data="monthly"
      x="month"
      y="sales"
      :series-config="{ sales: { label: 'Sales' } }"
      :x-axis="yearAxis"
      :y-axis="salesAxis"
      :palette="area"
    />
  </Card>
  <Card>
    <AreaChart
      title="Area Chart with Labels"
      :data="monthly"
      x="month"
      y="sales"
      show-data-labels
      :series-config="{ sales: { label: 'Sales', format: thousands } }"
      :x-axis="yearAxis"
      :y-axis="salesAxis"
      :palette="area"
    />
  </Card>
  <Card>
    <AreaChart
      title="Area Chart"
      subtitle="Overall Sales"
      :data="stacked"
      x="month"
      :y="['data1', 'data2', 'data3', 'data4']"
      stacked
      :series-config="stackConfig"
      :x-axis="yearAxis"
      :y-axis="salesAxis"
      :palette="areas"
    />
  </Card>
  <Card>
    <AreaChart
      title="Stepped Line"
      :data="steppedRows"
      x="month"
      :y="['data4', 'data3', 'data2', 'data1']"
      :series-config="stepConfig"
      :x-axis="monthAxis"
      :y-axis="salesAxis"
      :palette="stepped"
    />
  </Card>
  <Card>
    <AreaChart
      title="Member growth"
      subtitle="All time count of members"
      :data="monthly"
      x="month"
      y="sales"
      :series-config="{ sales: { label: 'Members' } }"
      :x-axis="yearAxis"
      :y-axis="{ ...salesAxis, title: 'Sales' }"
      :palette="area"
    />
  </Card>
</template>
