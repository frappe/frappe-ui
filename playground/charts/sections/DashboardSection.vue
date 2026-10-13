<script setup lang="ts">
// The file's dashboard (Figma 1GDS12ys41lxeG3wQpNq41, 1536:35040, "Charts -
// ocean blue" on the Review page): five spark-line readings across the top,
// then two to a row the week as one line, three lines, two stacked bands and
// three lines over their gradients; the half ring and a ring with its names
// down the left; bars on two axes and one bar cut into eight stages; the
// countries as pairs of bars and the funnel; the map with its scale stood up
// the left edge, and beside it the companies' table. The readings are the
// file's own, traced off its lines (chartData's `week`), and the colours are
// its Ocean steps, each a role (chartThemes' `dash*`) that falls back to the
// rows above for the other themes.
import { computed } from 'vue'
import { AreaChart, BarChart, LineChart } from '../../../src/charts'
import Card from '../components/Card.vue'
import ChartTip from '../components/ChartTip.vue'
import FunnelCard from '../components/FunnelCard.vue'
import HeatTable from '../components/HeatTable.vue'
import PieCard from '../components/PieCard.vue'
import SparkCard from '../components/SparkCard.vue'
import StackBarCard from '../components/StackBarCard.vue'
import UsMap from '../components/UsMap.vue'
import {
  HALF_ARCS,
  HEAT_COLUMNS,
  SPARK_BESIDE,
  SPARK_DOWN,
  SPARK_UP,
  dashBars,
  dashCountries,
  divergingHeatSteps,
  funnel,
  heatSteps,
  heatTable,
  pipelineShares,
  qualitativeHeatSteps,
  slices,
  week,
} from '../chartData'
import {
  count,
  fileCrosshair,
  filePlot,
  thousands,
  weekAxis,
  weekValueAxis,
} from '../chartAxes'
import { FUNNEL_OPACITY, type ChartTheme } from '../chartThemes'
import type { ThemeColors } from '../useChartTheme'

const props = defineProps<{ theme: ThemeColors; themeId: ChartTheme }>()

const crosshair = computed(() => fileCrosshair(props.theme.t))
const plot = computed(() => ({ ...crosshair.value, ...filePlot }))

// ---- the readings: a colour each (Ocean's first its darkest, the rest a step
// up; the other frames five apart)
const sparks = computed(() => props.theme.colors('dashSparks', 5))
const wash = computed(() => props.theme.one('sparkWash'))
const readings = [
  { value: '289', delta: '+7%', path: SPARK_BESIDE, range: [262, 298] },
  { value: '10 days', delta: '-4%', path: SPARK_DOWN, range: [8, 12] },
  { value: '44', delta: '+8%', path: SPARK_UP, range: [38, 47] },
  { value: '44', delta: '+8%', path: SPARK_UP, range: [38, 47] },
  { value: '02', delta: '+8%', path: SPARK_UP, range: [1, 3] },
] as const

// ---- the week
const line = computed(() => props.theme.colors('dashLine', 1))
const lines = computed(() => props.theme.colors('dashLines', 3))
const areas = computed(() => props.theme.colors('dashAreas', 2))
const gradient = computed(() => props.theme.colors('dashGradient', 3))

/** a 1.5px line with no dot of its own, as the line row draws its lines */
const stroke = { echartOptions: { lineStyle: { width: 1.5 }, symbol: 'none' } }

/**
 * The gradient card's wash: each line's own colour, from a quarter at its
 * line down to nothing at the baseline, so where two overlap they deepen —
 * the file's three washes, laid one over another (1536:35040).
 */
const fade = (color: string) => ({
  type: 'linear',
  x: 0,
  y: 0,
  x2: 0,
  y2: 1,
  colorStops: [
    { offset: 0, color: alpha(color, 0.25) },
    { offset: 1, color: alpha(color, 0) },
  ],
})
/** a resolved colour — `#rrggbb` or `rgb(…)` — at an opacity */
function alpha(color: string, a: number) {
  const hex = /^#([0-9a-f]{6})$/i.exec(color)?.[1]
  const rgb = hex
    ? [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16))
    : (color.match(/[\d.]+/g) ?? ['0', '0', '0']).slice(0, 3).map(Number)
  return `rgba(${rgb.join(', ')}, ${a})`
}
const gradientConfig = computed(() => {
  const [top, middle, bottom] = gradient.value
  const washed = (label: string, color: string) => ({
    label,
    format: count,
    echartOptions: {
      lineStyle: { width: 1.5 },
      symbol: 'none',
      areaStyle: { color: fade(color), opacity: 1 },
    },
  })
  return {
    top: washed('Data-1', top),
    middle: washed('Data-2', middle),
    bottom: washed('Data-3', bottom),
  }
})

/** the stacked bands draw no line of their own, only their fills */
const band = {
  echartOptions: {
    lineStyle: { width: 0 },
    symbol: 'none',
    areaStyle: { opacity: 1 },
  },
}

// ---- the rings
const half = computed(() => props.theme.colors('dashHalf', 8))
const halfArcs = computed(() => props.theme.colors('dashHalfArcs', 8))
const ring = computed(() => props.theme.colors('dashRing', 8))
/** the half ring names each slice by its share alone, as the pie row does */
const shares = slices.map((s) => ({ ...s, name: `Data (${s.share}%)` }))
/** the ring names them in full */
const named = slices.map((s) => ({ ...s, name: `${s.name} (${s.share}%)` }))

// ---- the bars
const bar = computed(() => props.theme.one('dashBar'))
/**
 * The file's bars read on two scales at once — 0 to 4 on the left, 0 to 16k
 * on the right — so the card carries both: the same bars in thousands on the
 * second axis, drawn exactly over the first and left unpainted, so the
 * tooltip reads out both numbers for the one bar it points at.
 */
const dualBars = dashBars.map((b) => ({ ...b, revenue: b.value * 4000 }))
const barSeries = {
  value: {
    label: 'Hours',
    echartOptions: {
      barCategoryGap: '42%',
      barGap: '-100%',
      itemStyle: { borderRadius: [3, 3, 0, 0] },
    },
  },
  revenue: {
    label: 'Revenue',
    format: count,
    echartOptions: {
      barCategoryGap: '42%',
      barGap: '-100%',
      itemStyle: { opacity: 0 },
      emphasis: { itemStyle: { opacity: 0 } },
    },
  },
}
const hoursAxis = {
  min: 0,
  max: 4,
  format: (v: number) => String(v),
  echartOptions: { interval: 0.5 },
}
const revenueAxis = {
  min: 0,
  max: 16000,
  format: thousands,
  echartOptions: { interval: 2000 },
}
/** the file prints nothing under its bars */
const noLabels = {
  type: 'category' as const,
  echartOptions: { axisLabel: { show: false } },
}

const stack = computed(() => props.theme.colors('dashStack', 8))

const countries = computed(() => props.theme.colors('dashCountries', 2))
const pair = {
  echartOptions: {
    barCategoryGap: '36%',
    barGap: '6%',
    itemStyle: { borderRadius: [0, 3, 3, 0] },
  },
}
const thousandsAxis = {
  min: 0,
  max: 700,
  format: (v: number) => (v === 0 ? '0' : `${v}k`),
  echartOptions: { interval: 100 },
}

// ---- the funnel, the map and the table
const funnelColor = computed(() => props.theme.colors('dashFunnel', 1))
const funnelOpacity = computed(() => FUNNEL_OPACITY[props.themeId])
const ramp = computed(() => props.theme.colors('map'))
const heat = computed(() => props.theme.colors('heat'))
const steps = computed(() =>
  props.themeId === 'diverging'
    ? divergingHeatSteps
    : props.themeId === 'ocean'
      ? heatSteps
      : qualitativeHeatSteps,
)
</script>

<template>
  <div class="dashboard-readings col-span-full">
    <SparkCard
      v-for="(r, i) in readings"
      :key="i"
      :title="`Spark-line - ${i + 1}`"
      :value="r.value"
      :delta="r.delta"
      caption="vs last week"
      :path="r.path"
      :range="[r.range[0], r.range[1]]"
      variant="beside"
      :color="sparks[i]"
      :wash="wash"
    />
  </div>

  <Card class="dash-card--no-legend">
    <LineChart
      title="Basic line chart"
      :data="week"
      x="at"
      y="basic"
      :series-config="{ basic: { label: 'Data', format: count, ...stroke } }"
      :x-axis="weekAxis"
      :y-axis="weekValueAxis"
      :palette="line"
      :echart-options="plot"
    >
      <template #tooltip="tip">
        <ChartTip :label="tip.label" :items="tip.items" :rows="tip.rows" />
      </template>
    </LineChart>
  </Card>
  <Card>
    <LineChart
      title="Stacked line chart"
      :data="week"
      x="at"
      :y="['data1', 'data2', 'data3']"
      :series-config="{
        data1: { label: 'Data-1', format: count, ...stroke },
        data2: { label: 'Data-2', format: count, ...stroke },
        data3: { label: 'Data-3', format: count, ...stroke },
      }"
      :x-axis="weekAxis"
      :y-axis="weekValueAxis"
      :palette="lines"
      :echart-options="plot"
    >
      <template #tooltip="tip">
        <ChartTip :label="tip.label" :items="tip.items" :rows="tip.rows" />
      </template>
    </LineChart>
  </Card>
  <Card>
    <AreaChart
      title="Stacked area chart"
      :data="week"
      x="at"
      :y="['lower', 'upper']"
      stacked
      :series-config="{
        lower: { label: 'Data-1', format: count, ...band },
        upper: { label: 'Data-2', format: count, ...band },
      }"
      :x-axis="weekAxis"
      :y-axis="weekValueAxis"
      :palette="areas"
      :echart-options="plot"
    >
      <template #tooltip="tip">
        <ChartTip :label="tip.label" :items="tip.items" :rows="tip.rows" />
      </template>
    </AreaChart>
  </Card>
  <Card>
    <LineChart
      title="Gradient stacked line chart"
      :data="week"
      x="at"
      :y="['top', 'middle', 'bottom']"
      :series-config="gradientConfig"
      :x-axis="weekAxis"
      :y-axis="weekValueAxis"
      :palette="gradient"
      :echart-options="plot"
    >
      <template #tooltip="tip">
        <ChartTip :label="tip.label" :items="tip.items" :rows="tip.rows" />
      </template>
    </LineChart>
  </Card>

  <Card>
    <PieCard
      title="Half Doughnut Chart"
      :slices="shares"
      :colors="half"
      :arcs="HALF_ARCS"
      :arc-colors="halfArcs"
      variant="half"
      :t="theme.t"
    />
  </Card>
  <Card>
    <PieCard
      title="Pie Chart"
      :slices="named"
      :colors="ring"
      variant="ring"
      :t="theme.t"
    />
  </Card>

  <Card class="dash-card--no-legend">
    <BarChart
      title="Basic Bar Chart"
      :data="dualBars"
      x="at"
      y="value"
      y2="revenue"
      :series-config="barSeries"
      :x-axis="noLabels"
      :y-axis="hoursAxis"
      :y2-axis="revenueAxis"
      :palette="[bar, bar]"
      :echart-options="crosshair"
    >
      <template #tooltip="tip">
        <ChartTip :label="tip.label" :items="tip.items" />
      </template>
    </BarChart>
  </Card>
  <Card>
    <StackBarCard
      title="Horizontal stacked bar chart"
      :shares="pipelineShares"
      :colors="stack"
    />
  </Card>

  <Card class="dash-card--no-legend">
    <BarChart
      title="Horizontal bar chart"
      :data="dashCountries"
      x="country"
      :y="['current', 'previous']"
      horizontal
      :series-config="{
        current: { label: 'This year', ...pair },
        previous: { label: 'Last year', ...pair },
      }"
      :y-axis="thousandsAxis"
      :palette="countries"
      :echart-options="crosshair"
    >
      <template #tooltip="tip">
        <ChartTip :label="tip.label" :items="tip.items" />
      </template>
    </BarChart>
  </Card>
  <Card>
    <FunnelCard
      title="Funnel chart"
      :stages="funnel"
      :colors="funnelColor"
      :opacity="funnelOpacity"
      variant="centred"
    />
  </Card>

  <Card>
    <UsMap title="Map Graph" :colors="ramp" :t="theme.t" scale="bar" />
  </Card>
  <!-- the table stands beside the map, uncarded and untitled -->
  <div class="min-w-0">
    <HeatTable
      :rows="heatTable"
      :columns="HEAT_COLUMNS"
      :colors="heat"
      :steps="steps"
      :ink="theme.t('chart-inside-label')"
    />
  </div>
</template>

<style scoped>
/* the five readings across the width of the two big cards, the grid's 17
   between; two to a row where there is room for only one big card */
.dashboard-readings {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px 17px;
}
@container chart-stage (min-width: 1177px) {
  .dashboard-readings {
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }
}

/* a card the file draws with no legend: the plot takes the row back */
.dash-card--no-legend :deep([data-slot='chart-legend']) {
  display: none;
}
</style>
