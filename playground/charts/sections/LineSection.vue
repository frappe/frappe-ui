<script setup lang="ts">
// The file's "Line chart" row (Figma 1GDS12ys41lxeG3wQpNq41, 1356:68175,
// 68378, 68437, 68269, 68212), by the library's LineChart: one 1.5px line of
// sales; the same with its values printed over every point; four stepped
// lines of four categories over a year, with the legend under them; sales and
// orders as two lines, which the file leaves unnamed; and the line with a 6px
// dot at every reading. Every card drops the file's hairline through the
// reading under the pointer and reads it out in the file's own tooltip.
import { computed } from 'vue'
import { LineChart } from '../../../src/charts'
import Card from '../components/Card.vue'
import ChartTip from '../components/ChartTip.vue'
import { monthly, year } from '../chartData'
import {
  bubbleAxis,
  count,
  monthAxis,
  salesAxis,
  thousands,
  yearAxis,
} from '../chartAxes'
import type { ChartTooltipItem } from '../../../src/charts/types'
import type { ThemeColors } from '../useChartTheme'

const props = defineProps<{ theme: ThemeColors }>()

const line = computed(() => [props.theme.one('line')])
const markers = computed(() => [props.theme.one('markers')])
const lines = computed(() => props.theme.colors('lines', 2))
const steps = computed(() => props.theme.colors('steps', 4))

/**
 * The rule the file drops through the hovered reading: a solid 1px hairline,
 * black at 9% over the card — every card in this row carries the same "Line
 * 80" (1356:68175, 68378, 68437, 68269, 68212). `outline-gray-2` is the token
 * that lands on that grey and, unlike a black wash, survives a flip to dark.
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
 * Where the file opens its plot. It leaves 43 between the title and the first
 * gridline and takes the plot to 318 of a 360 card (1356:68175's "Frame
 * 1000009725" is 48,75,516,243), which is a fifth of the card's height given
 * over to air; the library hands the plot everything the header does not want,
 * so ours opened a third of the way higher. The share is named rather than the
 * pixels, so a card of another size keeps the file's proportion.
 *
 * Only the vertical is named. The plot's width already lands on the file's —
 * 88.8% of the card against its 88.96 — but it sits a little to the left of
 * it, because echarts holds back room for the half of "2023" that would
 * otherwise overhang the canvas and the file simply lets its own last label
 * sit inside the plot. Pushing the left in to match would narrow the plot
 * rather than move it, which trades a difference nobody reads for one they do.
 */
const plotTop = { grid: { top: '12%' } }
/**
 * The stepped card gives its legend the room instead: the file closes that
 * plot at 278 rather than 318 and opens it at 62 (1356:68437), which is 40
 * less at the foot and 13 more at the head.
 */
const stepsPlot = { grid: { top: '8%', bottom: 29 } }

const lineOptions = computed(() => ({ ...crosshair.value, ...plotTop }))
const stepsOptions = computed(() => ({ ...crosshair.value, ...stepsPlot }))

/**
 * A line as the file strokes it: 1.5 for a plain line, 1 for a step (1356:68175
 * "Vector 434" against 1356:68437 "Vector 449"), where the library's own
 * default is 2. `symbol: 'none'` is what keeps a card that draws no markers
 * from growing one under the pointer: echarts hides a line's symbols but
 * brings back the active one, and the file draws no dot on any card but the
 * markers card — the crosshair and the tooltip are its whole hover.
 */
const stroke = (width: number) => ({
  echartOptions: { lineStyle: { width }, symbol: 'none' },
})
/** the markers card keeps its symbols, so only the width is named */
const marked = { echartOptions: { lineStyle: { width: 1.5 } } }

/**
 * The file's four categories, lightest line highest: Toys runs along the
 * bottom at about 3k and Odd equipment along the top at about 12k
 * (1356:68437's tooltip reads 3,600 / 8,958 / 10,345 / 12,344 at July, and
 * its vectors sit in that order). The palette runs darkest first, so Toys
 * takes Ocean 900 and Odd equipment Ocean 600, which is the file's own.
 */
const stepped = year.map((row, i) => ({
  month: row.month,
  toys: Math.round(row.sales * 0.26 + (i % 3) * 120),
  apparel: Math.round(row.sales * 0.62 + (i % 4) * 200),
  sports: Math.round(row.sales * 0.78 + (i % 2) * 260),
  odd: Math.round(row.sales * 0.9 + (i % 5) * 180),
}))

/**
 * The file's second line swings where the shared reading barely moves: its
 * Orders run between about 500 and 6,300 against the same 0–24k axis
 * (1356:68269's "Vector 435" covers 60 of the plot's 243, where the page's
 * own `orders` sits flat around 2k and covers barely a tenth of that). The
 * card carries its own so the pair reads the way the file draws it, without
 * moving a reading the bar row plots on its own axis.
 */
const twoLines = monthly.map((row, i) => ({
  month: row.month,
  sales: row.sales,
  orders: Math.round(row.orders * 0.5 + ((i * 5) % 7) * 850),
}))

/** step-after at 1px, as the file draws every stepped series */
const step = {
  echartOptions: { step: 'end', lineStyle: { width: 1 }, symbol: 'none' },
}
const stepConfig = {
  toys: { label: 'Toys', ...step },
  apparel: { label: 'Apparel', ...step },
  sports: { label: 'Sports Goods', ...step },
  odd: { label: 'Odd equipment', ...step },
}

/**
 * The file reads the four steps out in the order it names them — Toys,
 * Apparel, Sports Goods, Odd equipment, which is the legend's order below
 * (1356:68437). The library hands a tooltip its rows biggest first, which is
 * the right default where a reader is looking for the largest share and the
 * wrong one where the rows are a fixed list they have already read once.
 */
const STEP_ORDER = Object.keys(stepConfig)
const inOrder = (items: ChartTooltipItem[]) =>
  [...items].sort(
    (a, b) => STEP_ORDER.indexOf(a.name) - STEP_ORDER.indexOf(b.name),
  )
</script>

<template>
  <Card>
    <LineChart
      title="Line chart"
      :data="monthly"
      x="month"
      y="sales"
      :series-config="{ sales: { label: 'Sales', ...stroke(1.5) } }"
      :x-axis="yearAxis"
      :y-axis="salesAxis"
      :palette="line"
      :echart-options="lineOptions"
    >
      <template #tooltip="tip">
        <ChartTip
          :label="tip.label"
          :items="tip.items"
          :rows="tip.rows"
          :value="count"
        />
      </template>
    </LineChart>
  </Card>
  <Card>
    <LineChart
      title="Value label"
      :data="monthly"
      x="month"
      y="sales"
      show-data-labels
      :series-config="{
        sales: {
          label: 'Sales',
          format: thousands,
          echartOptions: { lineStyle: { width: 1.5 } },
        },
      }"
      :x-axis="yearAxis"
      :y-axis="salesAxis"
      :palette="line"
      :echart-options="lineOptions"
    >
      <template #tooltip="tip">
        <ChartTip
          :label="tip.label"
          :items="tip.items"
          :rows="tip.rows"
          :value="count"
        />
      </template>
    </LineChart>
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
      :echart-options="stepsOptions"
    >
      <template #tooltip="tip">
        <ChartTip
          :items="inOrder(tip.items)"
          :rows="tip.rows"
          :value="count"
          bare
          mark="square"
        />
      </template>
    </LineChart>
  </Card>
  <Card class="line-card--no-legend">
    <LineChart
      title="Multi Line Chart"
      :data="twoLines"
      x="month"
      :y="['sales', 'orders']"
      :series-config="{
        sales: { label: 'Sales', ...stroke(1.5) },
        orders: { label: 'Orders', ...stroke(1.5) },
      }"
      :x-axis="yearAxis"
      :y-axis="salesAxis"
      :palette="lines"
      :echart-options="lineOptions"
    >
      <template #tooltip="tip">
        <ChartTip
          :label="tip.label"
          :items="tip.items"
          :rows="tip.rows"
          :value="count"
          mark="dot"
        />
      </template>
    </LineChart>
  </Card>
  <Card>
    <LineChart
      title="Line chart with markers"
      :data="monthly"
      x="month"
      y="sales"
      show-data-points
      :series-config="{ sales: { label: 'Sales', ...marked } }"
      :x-axis="yearAxis"
      :y-axis="salesAxis"
      :palette="markers"
      :echart-options="lineOptions"
    >
      <template #tooltip="tip">
        <ChartTip
          :label="tip.label"
          :items="tip.items"
          :rows="tip.rows"
          :value="count"
        />
      </template>
    </LineChart>
  </Card>
</template>

<style scoped>
/* The file names neither line on this card — its plot runs the full height of
   the card, exactly as the single-line card's does (1356:68269 opens at 75 and
   closes at 318, against the stepped card's 62 and 278, which gives its legend
   the room). The bottom pad is the one `ChartContainer` drops in for a card
   with no legend, put back by hand because the legend above is hidden rather
   than absent. */
.line-card--no-legend :deep([data-slot='chart-legend']) {
  display: none;
}
.line-card--no-legend :deep([data-slot='chart-plot']) {
  padding-bottom: 12px;
}
</style>
