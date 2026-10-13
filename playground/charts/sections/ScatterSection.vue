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
import ChartTip from '../components/ChartTip.vue'
import { BUBBLE_GROUPS, pricePoints, SCATTER_GROUPS } from '../chartData'
import { bubbleAxis, priceAxis, salesAxis } from '../chartAxes'
import type { ChartTooltipItem } from '../../../src/charts/types'
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

/**
 * What the file's scatter tooltip names a point by, and how it prints each
 * one: "Price 33.4", "No. of units 1,553", "Total sales 51,894" (1356:67734,
 * 1356:67893). The axes print the same two measures short — "33.3" and "9k" —
 * where the tooltip is where the reading is given in full, so units is read
 * back off the point's own row rather than taken from the axis.
 */
const MEASURES: Record<
  string,
  { label: string; value?: (n: number) => string }
> = {
  price: { label: 'Price' },
  units: { label: 'No. of units', value: units },
  sales: { label: 'Total sales', value: money },
}

function measures(
  items: ChartTooltipItem[],
  rows?: Record<string, any>[],
): ChartTooltipItem[] {
  return items.map((item) => {
    const measure = MEASURES[item.name]
    if (!measure) return item
    const raw = rows?.[0]?.[item.name]
    return {
      ...item,
      label: measure.label,
      formattedValue:
        measure.value && typeof raw === 'number'
          ? measure.value(raw)
          : item.formattedValue,
    }
  })
}
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
      >
        <template #tooltip="tip">
          <ChartTip :items="measures(tip.items, tip.rows)" plain />
        </template>
      </ScatterChart>
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
      >
        <template #tooltip="tip">
          <ChartTip :items="measures(tip.items, tip.rows)" plain />
        </template>
      </ScatterChart>
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
      >
        <template #tooltip="tip">
          <ChartTip :items="measures(tip.items, tip.rows)" plain />
        </template>
      </ScatterChart>
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
      >
        <template #tooltip="tip">
          <ChartTip :items="measures(tip.items, tip.rows)" plain />
        </template>
      </ScatterChart>
    </Card>
  </template>
</template>
