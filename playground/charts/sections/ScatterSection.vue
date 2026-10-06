<script setup lang="ts">
// The file's "Scatter plot" and "Bubble chart" rows (Figma
// 1GDS12ys41lxeG3wQpNq41, 1356:67690 … 1356:67991), by the library's
// ScatterChart: price against units sold as 10px points, alone and split
// four ways by channel; the same points sized by total sales, alone and
// split four ways by category. The hover the file draws — the crosshair,
// the 160px tooltip of price, units and sales, the other groups dimmed —
// is the library's own.
import { computed } from 'vue'
import { ScatterChart } from '../../../src/charts'
import Card from '../components/Card.vue'
import { BUBBLE_GROUPS, pricePoints, SCATTER_GROUPS } from '../chartData'
import { bubbleAxis, priceAxis, salesAxis } from '../chartAxes'
import type { ThemeColors } from '../useChartTheme'

const props = defineProps<{ theme: ThemeColors; bubbles?: boolean }>()

const single = computed(() => [props.theme.one('scatter')])
const bubble = computed(() => [props.theme.one('bubble')])
const four = computed(() => props.theme.colors('scatters', 4))
const fourBubbles = computed(() => props.theme.colors('bubbles', 4))

const points = pricePoints(17, 3)
const grouped = SCATTER_GROUPS.flatMap((group, i) =>
  pricePoints(5, 11 + i, group),
)
const bubblePoints = pricePoints(15, 5)
const groupedBubbles = BUBBLE_GROUPS.flatMap((group, i) =>
  pricePoints(5, 21 + i, group),
)
const units = (value: number) => Math.round(value).toLocaleString('en-US')
const money = (value: number) => Math.round(value).toLocaleString('en-US')
</script>

<template>
  <template v-if="!bubbles">
    <Card>
      <ScatterChart
        title="Default - Scatter Plot"
        :data="points"
        x="price"
        y="units"
        :x-axis="{ ...priceAxis, title: 'Price' }"
        :y-axis="{ ...salesAxis, title: 'No. of units' }"
        :palette="single"
      />
    </Card>
    <Card>
      <ScatterChart
        title="Multi-series"
        :data="grouped"
        x="price"
        y="units"
        split-by="group"
        :x-axis="{ ...priceAxis, title: 'Price' }"
        :y-axis="{ ...salesAxis, title: 'No. of units' }"
        :palette="four"
      />
    </Card>
  </template>
  <template v-else>
    <Card>
      <ScatterChart
        title="Bubble Chart"
        :data="bubblePoints"
        x="price"
        y="units"
        size="sales"
        :x-axis="{ ...priceAxis, title: 'Price' }"
        :y-axis="{ ...salesAxis, title: 'No. of units' }"
        :format="money"
        :palette="bubble"
      />
    </Card>
    <Card>
      <ScatterChart
        title="Bubble chart - Multi series"
        :data="groupedBubbles"
        x="price"
        y="units"
        size="sales"
        split-by="group"
        :x-axis="{ ...priceAxis, title: 'Price' }"
        :y-axis="{ ...bubbleAxis, title: 'No. of units' }"
        :format="money"
        :palette="fourBubbles"
      />
    </Card>
  </template>
</template>
