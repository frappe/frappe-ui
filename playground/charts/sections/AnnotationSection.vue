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
import { MarkAreaComponent, MarkPointComponent } from 'echarts/components'
import { LineChart, registerChartModules } from '../../../src/charts'
import Card from '../components/Card.vue'
import { monthly, MONTHS } from '../chartData'
import { salesAxis, yearAxis } from '../chartAxes'
import type { ThemeColors } from '../useChartTheme'

// the points and the bands are marks the library's line chart does not
// register for itself
registerChartModules([MarkPointComponent, MarkAreaComponent])

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

/** a band from one month to another, in a tint, its edges dashed */
function band(
  fill: string,
  edge: string,
  ink: string,
  label: string,
  from: number,
  to: number,
) {
  return {
    itemStyle: { color: fill, opacity: 1 },
    label: {
      show: true,
      position: 'top',
      distance: 6,
      color: ink,
      fontSize: TYPE.xs,
      fontWeight: TYPE_WEIGHT.medium,
      formatter: label,
    },
    emphasis: { disabled: true },
    data: [
      [
        {
          xAxis: at(from),
          itemStyle: {
            borderColor: edge,
            borderWidth: 1,
            borderType: [2, 2],
          },
        },
        { xAxis: at(to) },
      ],
    ],
  }
}

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
const oneBand = computed(() => ({
  sales: {
    ...sales,
    echartOptions: {
      markArea: band(
        t('ink-amber-1'),
        t('ink-amber-4'),
        t('ink-amber-5'),
        'Reference Area',
        10,
        14,
      ),
    },
  },
}))
const twoBands = computed(() => ({
  sales: {
    ...sales,
    echartOptions: {
      markArea: {
        ...band(
          t('ink-amber-1'),
          t('ink-amber-4'),
          t('ink-amber-5'),
          '',
          10,
          14,
        ),
        data: [
          [
            {
              xAxis: at(10),
              name: 'First area',
              itemStyle: {
                color: t('ink-amber-1'),
                borderColor: t('ink-amber-4'),
                borderWidth: 1,
                borderType: [2, 2],
              },
              label: { color: t('ink-amber-5') },
            },
            { xAxis: at(14) },
          ],
          [
            {
              xAxis: at(18),
              name: 'Second area',
              itemStyle: {
                color: t('surface-red-1'),
                borderColor: t('outline-red-2'),
                borderWidth: 1,
                borderType: [2, 2],
              },
              label: { color: t('ink-red-5') },
            },
            { xAxis: at(22) },
          ],
        ],
        label: {
          show: true,
          position: 'top',
          distance: 6,
          fontSize: TYPE.xs,
          fontWeight: TYPE_WEIGHT.medium,
          formatter: (p: { name: string }) => p.name,
        },
      },
    },
  },
}))
const goodAverage = computed(() => ({
  sales: {
    ...sales,
    echartOptions: {
      markArea: {
        silent: true,
        emphasis: { disabled: true },
        z: -1,
        data: [
          [
            {
              yAxis: 10700,
              name: 'Good',
              itemStyle: { color: t('ink-green-1'), opacity: 1 },
              label: {
                show: true,
                position: 'insideTopRight',
                distance: 10,
                color: t('ink-green-5'),
                fontSize: TYPE.xs,
                formatter: 'Good',
              },
            },
            { yAxis: 24000 },
          ],
          [
            {
              yAxis: 0,
              name: 'Average',
              itemStyle: { color: t('ink-amber-1'), opacity: 1 },
              label: {
                show: true,
                position: 'insideBottomRight',
                distance: 10,
                color: t('ink-amber-5'),
                fontSize: TYPE.xs,
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
  <Card>
    <LineChart
      title="Area"
      :data="monthly"
      x="month"
      y="sales"
      :series-config="oneBand"
      :x-axis="yearAxis"
      :y-axis="salesAxis"
      :palette="line"
    />
  </Card>
  <Card>
    <LineChart
      title="X-axis Multi Area Reference"
      :data="monthly"
      x="month"
      y="sales"
      :series-config="twoBands"
      :x-axis="yearAxis"
      :y-axis="salesAxis"
      :palette="line"
    />
  </Card>
  <Card>
    <LineChart
      title="Area"
      :data="monthly"
      x="month"
      y="sales"
      :series-config="goodAverage"
      :x-axis="yearAxis"
      :y-axis="salesAxis"
      :palette="line"
    />
  </Card>
</template>
