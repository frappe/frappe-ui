<script setup lang="ts">
// The page's last row: the charts above put together as one dashboard would
// use them. Four readings across the top on the file's small cards, then the
// file's 580×360 cards two to a row: revenue over time, orders a month, the
// share by channel and the sales pipeline. Every card is one the rows above
// already draw — the same components, colours and axes — so it moves with
// the theme picked in the rail like the rest of the page.
import { computed } from 'vue'
import { BarChart, LineChart } from '../../../src/charts'
import Card from '../components/Card.vue'
import ChartTip from '../components/ChartTip.vue'
import FunnelCard from '../components/FunnelCard.vue'
import PieCard from '../components/PieCard.vue'
import SparkCard from '../components/SparkCard.vue'
import {
  SPARK_BESIDE,
  SPARK_DOWN,
  SPARK_UP,
  funnel,
  monthly,
  slices,
} from '../chartData'
import {
  count,
  fileCrosshair,
  filePlot,
  salesAxis,
  thousands,
  yearAxis,
} from '../chartAxes'
import type { ChartValueAxisOptions } from '../../../src/charts/types'
import { FUNNEL_OPACITY, type ChartTheme } from '../chartThemes'
import type { ThemeColors } from '../useChartTheme'

const props = defineProps<{ theme: ThemeColors; themeId: ChartTheme }>()

const spark = computed(() => props.theme.one('spark'))
const wash = computed(() => props.theme.one('sparkWash'))
const line = computed(() => [props.theme.one('line')])
const bar = computed(() => [props.theme.one('bar')])
const doughnut = computed(() => props.theme.colors('doughnut'))
const funnelColors = computed(() => props.theme.colors('funnel', 5))
const funnelOpacity = computed(() => FUNNEL_OPACITY[props.themeId])

const crosshair = computed(() => fileCrosshair(props.theme.t))
const lineOptions = computed(() => ({ ...crosshair.value, ...filePlot }))

/** the line row's stroke: 1.5, and no dot but the crosshair's */
const revenueSeries = {
  sales: {
    label: 'Revenue',
    format: count,
    echartOptions: { lineStyle: { width: 1.5 }, symbol: 'none' },
  },
}
/** the bar row's default card: bars 42% apart with a 2px crown */
const orderSeries = {
  orders: {
    label: 'Orders',
    format: count,
    echartOptions: { barCategoryGap: '42%', itemStyle: { borderRadius: 2 } },
  },
}
/** orders peak near 2.6k: 0 → 3k in steps of 500 */
const orderAxis: ChartValueAxisOptions = {
  min: 0,
  max: 3000,
  format: thousands,
  echartOptions: { interval: 500 },
}

const channels = ['Direct', 'Partners', 'Marketplace', 'Referral', 'Events']
const channelShare = slices
  .slice(0, 5)
  .map((s, i) => ({ ...s, name: `${channels[i]} (${s.share}%)` }))
</script>

<template>
  <div class="dashboard-kpis col-span-full">
    <SparkCard
      title="Revenue"
      value="$1.28M"
      delta="+7%"
      caption="vs last month"
      :path="SPARK_UP"
      :range="[1150000, 1283456]"
      :format="(v: number) => `$${(v / 1e6).toFixed(2)}M`"
      variant="area"
      :color="spark"
      :wash="wash"
    />
    <SparkCard
      title="Orders"
      value="184"
      delta="+7%"
      caption="vs last month"
      :data="[
        6, 10, 13, 10, 11, 17, 20, 28, 22, 22, 16, 27, 20, 20, 13, 26, 14, 17,
        20, 15, 6, 19, 20, 30, 28, 16, 10, 6, 6, 9,
      ]"
      variant="bars"
      :color="spark"
      :wash="wash"
    />
    <SparkCard
      title="Open tickets"
      value="87"
      delta="+7%"
      caption="vs last week"
      :path="SPARK_BESIDE"
      :range="[78, 92]"
      variant="beside"
      :color="spark"
      :wash="wash"
    />
    <SparkCard
      title="Conversion"
      value="38%"
      delta="-4%"
      caption="vs last month"
      :path="SPARK_DOWN"
      :range="[34, 41]"
      :format="(v: number) => `${Math.round(v)}%`"
      variant="inset"
      :color="spark"
      :wash="wash"
    />
  </div>

  <Card>
    <LineChart
      title="Revenue"
      :data="monthly"
      x="month"
      y="sales"
      :series-config="revenueSeries"
      :x-axis="yearAxis"
      :y-axis="salesAxis"
      :palette="line"
      :echart-options="lineOptions"
    >
      <template #tooltip="tip">
        <ChartTip :label="tip.label" :items="tip.items" :rows="tip.rows" />
      </template>
    </LineChart>
  </Card>
  <Card>
    <BarChart
      title="Orders"
      :data="monthly"
      x="month"
      y="orders"
      :series-config="orderSeries"
      :x-axis="yearAxis"
      :y-axis="orderAxis"
      :palette="bar"
      :echart-options="crosshair"
    >
      <template #tooltip="tip">
        <ChartTip :label="tip.label" :items="tip.items" />
      </template>
    </BarChart>
  </Card>
  <Card medium-title>
    <PieCard
      title="Sales by channel"
      :slices="channelShare"
      :colors="doughnut"
      variant="donut"
      :t="theme.t"
    />
  </Card>
  <Card>
    <FunnelCard
      title="Sales pipeline"
      :stages="funnel"
      :colors="funnelColors"
      :opacity="funnelOpacity"
      variant="centred"
    />
  </Card>
</template>

<style scoped>
/* four readings across the two big cards' width, the grid's 17 between */
.dashboard-kpis {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px 17px;
}
@container chart-stage (min-width: 1177px) {
  .dashboard-kpis {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}
</style>
