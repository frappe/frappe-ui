<script setup lang="ts">
// The file's "Line chart" row (Figma 1GDS12ys41lxeG3wQpNq41, 1356:68175 …
// 1356:68212), by the library's LineChart: one 1.5px line of sales; the
// same with its values printed over every point; four stepped lines of
// four categories over a year, with the legend under them; sales and
// orders as two lines; and the line with a 6px dot at every reading.
import { computed } from 'vue'
import { LineChart } from '../../../src/charts'
import Card from '../components/Card.vue'
import { monthly, year } from '../chartData'
import {
  bubbleAxis,
  monthAxis,
  salesAxis,
  thousands,
  yearAxis,
} from '../chartAxes'
import type { ThemeColors } from '../useChartTheme'

const props = defineProps<{ theme: ThemeColors }>()

const line = computed(() => [props.theme.one('line')])
const markers = computed(() => [props.theme.one('markers')])
const lines = computed(() => props.theme.colors('lines', 2))
const steps = computed(() => props.theme.colors('steps', 4))

/** the file's four categories, as the year's readings scaled apart */
const stepped = year.map((row, i) => ({
  month: row.month,
  toys: Math.round(row.sales * 0.72 + (i % 3) * 400),
  apparel: Math.round(row.sales * 0.58 + (i % 4) * 300),
  sports: Math.round(row.sales * 0.4 + (i % 2) * 500),
  odd: Math.round(row.sales * 0.2 + (i % 5) * 200),
}))

/** step-after, as the file draws every stepped series */
const step = { echartOptions: { step: 'end', lineStyle: { width: 1 } } }
const stepConfig = {
  toys: { label: 'Toys', ...step },
  apparel: { label: 'Apparel', ...step },
  sports: { label: 'Sports Goods', ...step },
  odd: { label: 'Odd equipment', ...step },
}
</script>

<template>
  <Card>
    <LineChart
      title="Line chart"
      :data="monthly"
      x="month"
      y="sales"
      :series-config="{ sales: { label: 'Sales' } }"
      :x-axis="yearAxis"
      :y-axis="salesAxis"
      :palette="line"
    />
  </Card>
  <Card>
    <LineChart
      title="Value label"
      :data="monthly"
      x="month"
      y="sales"
      show-data-labels
      :series-config="{ sales: { label: 'Sales', format: thousands } }"
      :x-axis="yearAxis"
      :y-axis="salesAxis"
      :palette="line"
    />
  </Card>
  <Card>
    <LineChart
      title="Multi-series line with steps"
      :data="stepped"
      x="month"
      :y="['toys', 'apparel', 'sports', 'odd']"
      :series-config="stepConfig"
      :x-axis="monthAxis"
      :y-axis="bubbleAxis"
      :palette="steps"
    />
  </Card>
  <Card>
    <LineChart
      title="Multi Line Chart"
      :data="monthly"
      x="month"
      :y="['sales', 'orders']"
      :series-config="{
        sales: { label: 'Sales' },
        orders: { label: 'Orders' },
      }"
      :x-axis="yearAxis"
      :y-axis="salesAxis"
      :palette="lines"
    />
  </Card>
  <Card>
    <LineChart
      title="Line chart with markers"
      :data="monthly"
      x="month"
      y="sales"
      show-data-points
      :series-config="{ sales: { label: 'Sales' } }"
      :x-axis="yearAxis"
      :y-axis="salesAxis"
      :palette="markers"
    />
  </Card>
</template>
