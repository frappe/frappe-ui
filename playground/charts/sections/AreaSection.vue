<script setup lang="ts">
// The file's "Area Charts" row (Figma 1GDS12ys41lxeG3wQpNq41, 1356:67489
// … 1356:67608), by the library's AreaChart: sales under a 1.5px line on
// a flat 20% fill, captioned "Overall Sales"; the same with its values
// printed; four areas stacked, only the lowest carrying a line; four
// stepped areas over a year; and member growth with its subtitle. The
// hover the file draws — the crosshair, the tooltip, the other series
// faded — is the library's own.
import { computed, ref, shallowRef, watch } from 'vue'
import { AreaChart } from '../../../src/charts'
import Card from '../components/Card.vue'
import ChartTip from '../components/ChartTip.vue'
import { monthly, steppedYear } from '../chartData'
import { count, monthAxis, salesAxis, thousands, yearAxis } from '../chartAxes'
import type { ThemeColors } from '../useChartTheme'

const props = defineProps<{ theme: ThemeColors }>()

const area = computed(() => [props.theme.one('area')])
const areas = computed(() => props.theme.colors('areas', 4))
const stepped = computed(() => props.theme.colors('stepped', 4))

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

/**
 * The file's hover: the band under the pointer fills right in and the other
 * three fall back to a tenth of themselves (1356:67563). `triggerLineEvent`
 * is what makes a band answer the pointer at all — these series draw no
 * points, and without it echarts has only the symbols to listen on.
 */
const focus = (color: string) => ({
  triggerLineEvent: true,
  // The band under the pointer fills right in — the file draws it at full
  // opacity against the tenth it leaves the other three (1356:67563). Naming
  // its colour again is what keeps it its own: left alone, echarts lifts
  // whatever is hovered a shade lighter, and a band that changes colour as
  // you reach it was never the colour it was drawn in.
  emphasis: {
    disabled: false,
    focus: 'series',
    lineStyle: { width: 1, color },
    areaStyle: { color, opacity: 1 },
  },
  blur: { areaStyle: { opacity: 0.1 }, lineStyle: { opacity: 0.1 } },
})

/**
 * The file's stepped bands: each one a flat wash of its own colour taken to
 * the axis under a 1px step, the lowest at 30% and the rest at 20%
 * (1356:67528, "Vector 458" against 461/463/466). The palette runs darkest
 * first, which is the order the y keys are given in below.
 */
const stepConfig = computed(() => {
  const colors = props.theme.colors('stepped', 4)
  const band = (color: string, opacity: number) => ({
    echartOptions: {
      step: 'end',
      lineStyle: { width: 1 },
      areaStyle: { color, opacity },
      ...focus(color),
    },
  })
  return {
    data4: { label: 'Data 4', ...band(colors[0], 0.3) },
    data3: { label: 'Data 3', ...band(colors[1], 0.2) },
    data2: { label: 'Data 2', ...band(colors[2], 0.2) },
    data1: { label: 'Data 1', ...band(colors[3], 0.2) },
  }
})

/**
 * Which band the pointer is on. The file's hover reads out one band, not the
 * column (1356:67563: "Sales 9,902" alone), and echarts knows which series it
 * is emphasising — so the card listens for that and the tooltip below prints
 * the matching row. Off the bands, every row prints, which is the reading a
 * pointer in open space has actually asked for.
 */
const steppedChart = ref<any>(null)
const onBand = shallowRef<string | null>(null)

watch(
  () => steppedChart.value?.chart,
  (chart: any) => {
    if (!chart || chart.isDisposed?.()) return
    chart.off('mouseover')
    chart.off('mouseout')
    chart.off('globalout')
    chart.on('mouseover', (event: any) => {
      if (event.componentType === 'series') onBand.value = event.seriesName
    })
    // Crossing straight from one band to the next, echarts can report the
    // leaving before the arriving; clearing only the band that is still
    // named keeps the tooltip from blinking back to four rows in between.
    chart.on('mouseout', (event: any) => {
      if (event.seriesName === onBand.value) onBand.value = null
    })
    chart.on('globalout', () => (onBand.value = null))
  },
)

/** the hovered band's row, or every row when the pointer is on none */
function bandRows(items: any[]) {
  if (!onBand.value) return items
  const one = items.filter((item) => item.name === onBand.value)
  return one.length ? one : items
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
  <Card class="area-card--no-legend">
    <AreaChart
      ref="steppedChart"
      title="Stepped Line"
      :data="steppedYear"
      x="month"
      :y="['data4', 'data3', 'data2', 'data1']"
      stacked
      :series-config="stepConfig"
      :x-axis="monthAxis"
      :y-axis="salesAxis"
      :palette="stepped"
      :echart-options="crosshair"
    >
      <template #tooltip="tip">
        <ChartTip
          :label="tip.label"
          :items="bandRows(tip.items)"
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

<style scoped>
/* The file names no band on this card — the plot is the whole of it
   (1356:67528 carries no legend row). */
.area-card--no-legend :deep([data-slot='chart-legend']) {
  display: none;
}

/* The two pads a card without a subtitle has to find for itself. The file
   starts every plot in the row within five pixels of the same line, subtitle
   or not (1356:67528 opens at 75 against 1356:67489's 80), where a plot here
   is handed whatever the header leaves it — so this one began directly under
   its title, a subtitle's worth higher than the four cards around it. The
   bottom pad is the one `ChartContainer` drops in for a card with no legend,
   put back by hand because the legend above is hidden rather than absent;
   without it this plot would hang a row below its neighbours. */
.area-card--no-legend :deep([data-slot='chart-plot']) {
  padding-top: 18px;
  padding-bottom: 12px;
}
</style>
