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
 * The box the file draws its plot in: 48,75,516,243 of a 580×360 card
 * (1356:68175's "Frame 1000009725", and the same on 68378, 68269 and 68212),
 * which is 8.28% in from the left, 2.76% from the right, 20.83% down and
 * 11.67% up. The library sizes a plot from what is left over instead — the
 * header takes what it needs and the grid takes the rest — so ours opened a
 * third of the way higher and sat a little to the left.
 *
 * The shares are of the canvas rather than of the card, since the header above
 * it is a fixed height and not a fraction of one, and they are the numbers
 * that put the drawn plot on the file's — measured rather than derived, since
 * what the library holds back for a label is its own business.
 */
const FILE_BOX = { right: 0 } as const

/**
 * And why the plot can reach that right edge at all. The file's end labels are
 * not centred on their ticks the way the ones between them are: "2021" starts
 * at 51 against a plot opening at 48, and "2023" ends at 560 against one
 * closing at 564 — each is pulled inside the plot rather than straddling its
 * edge. echarts centres them by default and then reserves half a label's width
 * at either end so nothing overhangs, which is the room the plot was losing.
 * Aligning the two end labels the way the file aligns them gives it back.
 */
const endLabels = {
  axisLabel: { alignMinLabel: 'left', alignMaxLabel: 'right' },
}
const plotTop = { grid: { ...FILE_BOX, left: '4.56%', top: '12%' } }
/**
 * The stepped card gives its legend the room instead: the file closes that
 * plot at 278 rather than 318 and opens it at 62 (1356:68437), which is 40
 * less at the foot and 13 more at the head.
 */
const stepsPlot = {
  grid: { ...FILE_BOX, left: '4.9%', top: '12.6%', bottom: 10 },
}

const lineOptions = computed(() => ({
  ...crosshair.value,
  ...plotTop,
  xAxis: endLabels,
}))
const stepsOptions = computed(() => ({
  ...crosshair.value,
  ...stepsPlot,
  xAxis: endLabels,
}))

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
 * The printed values, as the file sets them (1356:68378). Two things it does
 * that the library does not.
 *
 * It strokes every label in the card's own surface — a 1px halo — which is how
 * its labels stay readable where the line runs under them, and the card is
 * thick with them: twenty-five readings across 592 leaves 24 between, so a
 * label and the line will meet. The token is read rather than written white,
 * so the halo is the card's ground in either mode.
 *
 * And it pulls the first and last label inside the plot rather than centring
 * them on readings that sit on its edges: the file's own first label opens at
 * 45.5 against a line starting at 51.5. Centred, ours ran into the y axis at
 * one end and off the canvas at the other.
 */
const LAST = monthly.length - 1
const valueLabels = computed(() => ({
  label: {
    textBorderColor: props.theme.t('surface-elevation-2'),
    textBorderWidth: 1,
  },
  labelLayout: (p: { dataIndex: number }) => ({
    hideOverlap: true,
    dx: p.dataIndex === 0 ? 14 : p.dataIndex === LAST ? -14 : 0,
  }),
}))

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
          echartOptions: { lineStyle: { width: 1.5 }, ...valueLabels },
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
