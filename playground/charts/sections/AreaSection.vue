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
import ChartTip from '../components/ChartTip.vue'
import { monthly, year } from '../chartData'
import { count, monthAxis, salesAxis, thousands, yearAxis } from '../chartAxes'
import type { ThemeColors } from '../useChartTheme'

const props = defineProps<{ theme: ThemeColors }>()

const area = computed(() => [props.theme.one('area')])
const areas = computed(() => props.theme.colors('areas', 4))
const stepped = computed(() => props.theme.colors('stepped', 4))

/**
 * The wash the file draws under a lone area: its own line colour, flat at
 * 20%, carried the whole way down to the axis — every "Vector 433" in the
 * row is the line's Ocean/B-800 at opacity .2, over a 1.5px stroke of the
 * same (1356:67489, 1356:67428, 1356:67608). The library fades its wash out
 * towards the axis instead, so that two bands crossing stay legible where
 * they overlap; a single area has no overlap to resolve, so these cards name
 * the fill the file drew. The colour is read back from the theme, which means
 * a flip to dark mode re-reads it like every other colour on the page.
 */
/**
 * The rule the file drops through the hovered reading: a solid 1px hairline,
 * black at 9% over the card (1356:67518 "Line 80"). The bar cards draw the
 * same thing in `outline-gray-2`, which is the token that lands on that grey
 * and, unlike a black wash, survives a flip to dark mode.
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

const wash = computed(() => ({
  areaStyle: { color: props.theme.one('area'), opacity: 0.2 },
  lineStyle: { width: 1.5 },
}))

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
      :series-config="{ sales: { label: 'Sales', echartOptions: wash } }"
      :x-axis="yearAxis"
      :y-axis="salesAxis"
      :palette="area"
      :echart-options="crosshair"
    >
      <template #tooltip="tip">
        <ChartTip
          :label="tip.label"
          :items="tip.items"
          :rows="tip.rows"
          :value="count"
        />
      </template>
    </AreaChart>
  </Card>
  <Card>
    <AreaChart
      title="Area Chart with Labels"
      :data="monthly"
      x="month"
      y="sales"
      show-data-labels
      :series-config="{
        sales: { label: 'Sales', format: thousands, echartOptions: wash },
      }"
      :x-axis="yearAxis"
      :y-axis="salesAxis"
      :palette="area"
      :echart-options="crosshair"
    >
      <template #tooltip="tip">
        <ChartTip
          :label="tip.label"
          :items="tip.items"
          :rows="tip.rows"
          :value="count"
        />
      </template>
    </AreaChart>
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
      :echart-options="crosshair"
    >
      <template #tooltip="tip">
        <ChartTip
          :label="tip.label"
          :items="tip.items"
          :rows="tip.rows"
          :value="count"
        />
      </template>
    </AreaChart>
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
      :echart-options="crosshair"
    >
      <template #tooltip="tip">
        <ChartTip
          :label="tip.label"
          :items="tip.items"
          :rows="tip.rows"
          :value="count"
        />
      </template>
    </AreaChart>
  </Card>
  <Card>
    <AreaChart
      title="Member growth"
      subtitle="All time count of members"
      :data="monthly"
      x="month"
      y="sales"
      :series-config="{ sales: { label: 'Members', echartOptions: wash } }"
      :x-axis="yearAxis"
      :y-axis="{ ...salesAxis, title: 'Sales' }"
      :palette="area"
      :echart-options="crosshair"
    >
      <template #tooltip="tip">
        <ChartTip
          :label="tip.label"
          :items="tip.items"
          :rows="tip.rows"
          :value="count"
        />
      </template>
    </AreaChart>
  </Card>
</template>
