<script setup lang="ts">
// The file's "Annotation" row (Figma 1GDS12ys41lxeG3wQpNq41, 1356:68709 …
// 1356:68643): one 1.5px line of sales over the year axis, and over it
// the marks a reader puts on a chart — a violet rule at 12k, a red point
// and its word, two points where sales dropped, a point with a callout,
// a grey target at 10k and a forecast at 18k, a rule down the plot where
// a product shipped and two where two did, an amber band, an amber and a
// red band, and the plot split into a green "Good" over an amber
// "Average". The rules are the library's reference lines; the points,
// the callout and the bands are echarts marks on the series, in the
// tokens the file names for them — the file's ink/red-3, amber-2 and
// amber-3, green-3 and violet are frappe-ui's red-5, amber-4 and amber-5,
// green-5 and violet-5, the same colours under the library's numbering.
import { computed } from 'vue'
import { TYPE, TYPE_WEIGHT } from '../chartType'
import {
  MarkAreaComponent,
  MarkLineComponent,
  MarkPointComponent,
} from 'echarts/components'
import { LineChart, registerChartModules } from '../../../src/charts'
import Card from '../components/Card.vue'
import { annotated, monthly, MONTHS } from '../chartData'
import { endLabels, filePlot, salesAxis, yearAxis } from '../chartAxes'
import type { ThemeColors } from '../useChartTheme'

// the points and the bands are marks the library's line chart does not
// register for itself
registerChartModules([MarkPointComponent, MarkAreaComponent, MarkLineComponent])

const props = defineProps<{ theme: ThemeColors }>()

const line = computed(() => [props.theme.one('annotation')])
const t = (name: string) => props.theme.t(name)

const at = (i: number) => MONTHS[i]
const point = (i: number) => ({ xAxis: at(i), yAxis: monthly[i].sales })

/** a 9px point in `color`, its word under it */
function marks(color: string, label: string, ...indexes: number[]) {
  return {
    markPoint: {
      symbol: 'circle',
      symbolSize: 9,
      itemStyle: { color },
      label: {
        show: true,
        position: 'bottom',
        distance: 6,
        color,
        fontSize: TYPE.xs,
        fontWeight: TYPE_WEIGHT.medium,
        formatter: label,
      },
      data: indexes.map(point),
    },
  }
}

/**
 * Bands from one month to another, as the file draws its reference areas
 * (1356:68610, 1356:68674): a tint over the plot's full height, a dashed rule
 * down each side and none along the top or the foot, and the band's word
 * centred 7 over it in its own ink. A mark area can only dash all four sides
 * of itself, so the tint is the area and the two rules are a mark line.
 */
type Band = {
  /** the months the band opens and closes on */
  from: number
  to: number
  label: string
  fill: string
  edge: string
  ink: string
}
function bands(...list: Band[]) {
  return {
    markArea: {
      silent: true,
      emphasis: { disabled: true },
      label: {
        show: true,
        position: 'top',
        distance: 7,
        fontSize: TYPE.xs,
        fontWeight: TYPE_WEIGHT.medium,
      },
      data: list.map((b) => [
        {
          xAxis: at(b.from),
          itemStyle: { color: b.fill, opacity: 1, borderWidth: 0 },
          label: { color: b.ink, formatter: b.label },
        },
        { xAxis: at(b.to) },
      ]),
    },
    markLine: {
      silent: true,
      symbol: 'none',
      label: { show: false },
      emphasis: { disabled: true },
      data: list.flatMap((b) =>
        [b.from, b.to].map((i) => ({
          xAxis: at(i),
          lineStyle: { color: b.edge, width: 1, type: [2, 2] },
        })),
      ),
    },
  }
}
const amber = computed(() => ({
  fill: t('chart-band-amber-fill'),
  edge: t('chart-band-amber-edge'),
  ink: t('chart-band-amber-ink'),
}))
const red = computed(() => ({
  fill: t('chart-band-red-fill'),
  edge: t('chart-band-red-edge'),
  ink: t('chart-band-red-ink'),
}))
/**
 * The file's plot box, and its months 10 under the plot (328 against a foot at
 * 318) where the library's 8 margin leaves them 6 under it.
 */
const bandPlot = {
  ...filePlot,
  xAxis: { axisLabel: { ...endLabels.axisLabel, margin: 12 } },
}

/** the file's 1.5 line with no dot under the pointer (1356:68610 "Vector 434") */
const fileLine = { lineStyle: { width: 1.5 }, symbol: 'none' }

const sales = { label: 'Sales' }
const pointOf = computed(() => ({
  sales: {
    ...sales,
    echartOptions: marks(t('ink-red-5'), 'Reference Point', 10),
  },
}))
const dropped = computed(() => ({
  sales: {
    ...sales,
    showDataPoints: true,
    echartOptions: marks(t('ink-red-5'), 'Sales dropped', 10, 18),
  },
}))
const callout = computed(() => ({
  sales: {
    ...sales,
    showDataPoints: true,
    echartOptions: {
      markPoint: {
        symbol: 'circle',
        symbolSize: 9,
        itemStyle: { color: t('ink-gray-7') },
        label: {
          show: true,
          position: 'right',
          distance: 8,
          formatter: 'Sales dropped here',
          color: t('ink-gray-6'),
          fontSize: TYPE.xs,
          backgroundColor: t('surface-elevation-2'),
          borderRadius: 8,
          padding: [8, 8, 8, 8],
          shadowBlur: 12,
          shadowOffsetY: 6,
          shadowColor: 'rgba(0,0,0,0.12)',
        },
        data: [point(10)],
      },
    },
  },
}))
/**
 * Where the bands sit, in months from the first: the file's are 87 wide, about
 * four months, set by hand at 264→351 and 441→528 (1356:68610, 68674). A
 * category axis rounds a position to its nearest month, so the amber band
 * lands within 2 of the file's and the red one, which the file sets a quarter
 * of a month past July 2022, 6 to the left of it.
 */
const AMBER_BAND = { from: 10, to: 14 }
const RED_BAND = { from: 18, to: 22 }

const oneBand = computed(() => ({
  sales: {
    ...sales,
    echartOptions: {
      ...fileLine,
      ...bands({ ...AMBER_BAND, label: 'Reference Area', ...amber.value }),
    },
  },
}))
const twoBands = computed(() => ({
  sales: {
    ...sales,
    echartOptions: {
      ...fileLine,
      ...bands(
        { ...AMBER_BAND, label: 'First area', ...amber.value },
        { ...RED_BAND, label: 'Second area', ...red.value },
      ),
    },
  },
}))
/**
 * The file's "Good" over "Average" (1356:68643): the plot split at 10.7k (its
 * two rectangles meet at 210 of a plot running 75→318), the upper green and
 * the lower amber, each word in text/xs/regular 10 in from its corner.
 */
const goodAverage = computed(() => ({
  sales: {
    ...sales,
    echartOptions: {
      ...fileLine,
      markArea: {
        silent: true,
        emphasis: { disabled: true },
        z: -1,
        label: {
          show: true,
          distance: 10,
          fontSize: TYPE.xs,
          fontWeight: TYPE_WEIGHT.regular,
        },
        data: [
          [
            {
              yAxis: 10700,
              itemStyle: { color: t('chart-band-green-fill'), opacity: 1 },
              label: {
                position: 'insideTopRight',
                color: t('chart-band-green-ink'),
                formatter: 'Good',
              },
            },
            { yAxis: 24000 },
          ],
          [
            {
              yAxis: 0,
              itemStyle: { color: amber.value.fill, opacity: 1 },
              label: {
                position: 'insideBottomRight',
                color: amber.value.ink,
                formatter: 'Average',
              },
            },
            { yAxis: 10700 },
          ],
        ],
      },
    },
  },
}))
</script>

<template>
  <Card>
    <LineChart
      title="Reference Line"
      :data="monthly"
      x="month"
      y="sales"
      :series-config="{ sales }"
      :x-axis="yearAxis"
      :y-axis="salesAxis"
      :palette="line"
      :reference-lines="[
        {
          value: 12000,
          label: 'Reference Line',
          color: t('ink-violet-5'),
          dashed: true,
          labelPlacement: 'start-bottom',
        },
      ]"
    />
  </Card>
  <Card>
    <LineChart
      title="Reference point"
      :data="monthly"
      x="month"
      y="sales"
      show-data-points
      :series-config="pointOf"
      :x-axis="yearAxis"
      :y-axis="salesAxis"
      :palette="line"
    />
  </Card>
  <Card>
    <LineChart
      title="Points from data"
      :data="monthly"
      x="month"
      y="sales"
      :series-config="dropped"
      :x-axis="yearAxis"
      :y-axis="salesAxis"
      :palette="line"
    />
  </Card>
  <Card>
    <LineChart
      title="Defined point"
      :data="monthly"
      x="month"
      y="sales"
      :series-config="callout"
      :x-axis="yearAxis"
      :y-axis="salesAxis"
      :palette="line"
    />
  </Card>
  <Card>
    <LineChart
      title="Y-axis Defined Inline"
      :data="monthly"
      x="month"
      y="sales"
      show-data-points
      :series-config="{ sales }"
      :x-axis="yearAxis"
      :y-axis="salesAxis"
      :palette="line"
      :reference-lines="[
        {
          value: 10000,
          label: 'Target (10k)',
          dashed: true,
          labelPlacement: 'end-bottom',
        },
      ]"
    />
  </Card>
  <Card>
    <LineChart
      title="Y-axis Multiple Lines"
      :data="monthly"
      x="month"
      y="sales"
      show-data-points
      :series-config="{ sales }"
      :x-axis="yearAxis"
      :y-axis="salesAxis"
      :palette="line"
      :reference-lines="[
        {
          value: 10000,
          label: 'Target (10k)',
          dashed: true,
          labelPlacement: 'end-bottom',
        },
        {
          value: 18000,
          label: 'Forecast (18k)',
          dashed: true,
          labelPlacement: 'end-top',
        },
      ]"
    />
  </Card>
  <Card>
    <LineChart
      title="X-axis Defined Line"
      :data="monthly"
      x="month"
      y="sales"
      :series-config="{ sales }"
      :x-axis="yearAxis"
      :y-axis="salesAxis"
      :palette="line"
      :reference-lines="[
        {
          value: at(6),
          axis: 'x',
          label: 'New product',
          dashed: true,
          labelPlacement: 'end-top',
        },
      ]"
    />
  </Card>
  <Card>
    <LineChart
      title="X-axis Multi Defined Line"
      :data="monthly"
      x="month"
      y="sales"
      :series-config="{ sales }"
      :x-axis="yearAxis"
      :y-axis="salesAxis"
      :palette="line"
      :reference-lines="[
        {
          value: at(6),
          axis: 'x',
          label: 'Product 1',
          dashed: true,
          labelPlacement: 'end-top',
        },
        {
          value: at(13),
          axis: 'x',
          label: 'Product 2',
          dashed: true,
          labelPlacement: 'end-top',
        },
      ]"
    />
  </Card>
  <Card class="band-card">
    <LineChart
      title="Area"
      :data="annotated"
      x="month"
      y="sales"
      :series-config="oneBand"
      :echart-options="bandPlot"
      :x-axis="yearAxis"
      :y-axis="salesAxis"
      :palette="line"
    />
  </Card>
  <Card class="band-card">
    <LineChart
      title="X-axis Multi Area Reference"
      :data="annotated"
      x="month"
      y="sales"
      :series-config="twoBands"
      :echart-options="bandPlot"
      :x-axis="yearAxis"
      :y-axis="salesAxis"
      :palette="line"
    />
  </Card>
  <Card class="band-card">
    <LineChart
      title="Area"
      :data="annotated"
      :echart-options="bandPlot"
      x="month"
      y="sales"
      :series-config="goodAverage"
      :x-axis="yearAxis"
      :y-axis="salesAxis"
      :palette="line"
    />
  </Card>
</template>

<style scoped>
/* The band cards carry no legend, so the library's container pads the plot
   12 under it, where the file closes its plot at 318 of 360 and sets the
   months 10 under that. The months' wider margin (bandPlot) is taken out of
   the plot, so the padding gives back 10 rather than the line row's 6. */
.band-card :deep([data-slot='chart-plot']) {
  padding-bottom: 2px;
}
</style>
