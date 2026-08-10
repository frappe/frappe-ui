<script setup lang="ts">
// A product dashboard rather than a gallery: one business, one period, numbers
// that agree across the tiles.
import { computed, ref } from 'vue'
import { Badge, Button, Dropdown, Select } from 'frappe-ui'
import {
  AreaChart,
  BarChart,
  DonutChart,
  FunnelChart,
  HeatmapChart,
  LineChart,
  NumberCard,
  useChartTokens,
} from 'frappe-ui/charts'
import type {
  AreaChartProps,
  BarChartProps,
  DonutChartProps,
  FunnelChartProps,
  HeatmapChartProps,
  LineChartProps,
  NumberCardProps,
} from 'frappe-ui/charts'

const MONTHS = [
  '2025-08-01',
  '2025-09-01',
  '2025-10-01',
  '2025-11-01',
  '2025-12-01',
  '2026-01-01',
  '2026-02-01',
  '2026-03-01',
  '2026-04-01',
  '2026-05-01',
  '2026-06-01',
  '2026-07-01',
]

const revenueByPlan = [
  { Starter: 38200, Plus: 61400, Pro: 44900 },
  { Starter: 39600, Plus: 63800, Pro: 47300 },
  { Starter: 41100, Plus: 66200, Pro: 50100 },
  { Starter: 44800, Plus: 72500, Pro: 55400 },
  { Starter: 48300, Plus: 79100, Pro: 61200 },
  { Starter: 42700, Plus: 70400, Pro: 58600 },
  { Starter: 43900, Plus: 72900, Pro: 60300 },
  { Starter: 46200, Plus: 76800, Pro: 63700 },
  { Starter: 47500, Plus: 79200, Pro: 66900 },
  { Starter: 49100, Plus: 82600, Pro: 70400 },
  { Starter: 50400, Plus: 85300, Pro: 73800 },
  { Starter: 52600, Plus: 89400, Pro: 78200 },
].map((row, i) => ({ month: MONTHS[i], ...row }))

const monthlyRevenue = revenueByPlan.map(
  (row) => row.Starter + row.Plus + row.Pro,
)
const monthlyTarget = [
  140000, 148000, 155000, 175000, 195000, 178000, 180000, 185000, 190000,
  198000, 206000, 215000,
]
const monthlyOrders = [
  1786, 1852, 1921, 2094, 2274, 2064, 2120, 2222, 2292, 2378, 2452, 2560,
]
const monthlyChurn = [
  3.1, 3.0, 2.9, 2.7, 2.6, 3.0, 2.9, 2.8, 2.6, 2.5, 2.5, 2.1,
]

const revenueVsTarget = MONTHS.map((month, i) => ({
  month,
  revenue: monthlyRevenue[i],
  target: monthlyTarget[i],
  attainment: Math.round((monthlyRevenue[i] / monthlyTarget[i]) * 1000) / 10,
}))

const sessionsByDevice = [
  { Mobile: 41200, Desktop: 26800, Tablet: 5400 },
  { Mobile: 43100, Desktop: 27400, Tablet: 5500 },
  { Mobile: 45600, Desktop: 28200, Tablet: 5600 },
  { Mobile: 52400, Desktop: 31900, Tablet: 6300 },
  { Mobile: 58200, Desktop: 34100, Tablet: 6900 },
  { Mobile: 47800, Desktop: 29600, Tablet: 5900 },
  { Mobile: 49300, Desktop: 30200, Tablet: 6000 },
  { Mobile: 52100, Desktop: 31400, Tablet: 6100 },
  { Mobile: 54600, Desktop: 32300, Tablet: 6200 },
  { Mobile: 57200, Desktop: 33500, Tablet: 6400 },
  { Mobile: 59800, Desktop: 34600, Tablet: 6500 },
  { Mobile: 63400, Desktop: 36100, Tablet: 6700 },
].map((row, i) => ({ month: MONTHS[i], ...row }))

const sessionsByChannel = [
  { channel: 'Organic search', sessions: 39900 },
  { channel: 'Paid social', sessions: 21400 },
  { channel: 'Email', sessions: 16800 },
  { channel: 'Direct', sessions: 14700 },
  { channel: 'Referral & affiliate', sessions: 8900 },
  { channel: 'Marketplace', sessions: 4500 },
]

const planMix = [
  { plan: 'Starter', subscriptions: 1180 },
  { plan: 'Plus', subscriptions: 962 },
  { plan: 'Pro', subscriptions: 418 },
]

const signupFunnel = [
  { stage: 'Visited the store', people: 106200 },
  { stage: 'Viewed a plan', people: 38400 },
  { stage: 'Started checkout', people: 9860 },
  { stage: 'Entered payment details', people: 3410 },
  { stage: 'Active subscription', people: 2560 },
]

const topProducts = [
  { product: 'Ethiopia Yirgacheffe — 1kg', revenue: 42800 },
  { product: 'House Espresso — 500g', revenue: 38600 },
  { product: 'Colombia Huila Decaf — 500g', revenue: 27400 },
  { product: 'Cold Brew Concentrate — case', revenue: 21900 },
  { product: 'Guatemala Antigua — 250g', revenue: 17300 },
  { product: 'Starter Kit — grinder bundle', revenue: 12700 },
]

/** Contribution margin against plan, in thousands. Negative where revenue missed. */
const marginVariance = [
  4.5, 2.1, 1.6, -3.2, -7.4, -6.3, -2.9, 1.7, 3.6, 4.1, 3.5, 5.2,
].map((variance, i) => ({ month: MONTHS[i], variance }))

const HOURS = ['6am', '8am', '10am', '12pm', '2pm', '4pm', '6pm', '8pm']
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const ORDERS_BY_HOUR = [
  [6, 45, 35, 29, 18, 14, 22, 10],
  [6, 47, 36, 30, 18, 15, 23, 10],
  [6, 46, 35, 29, 18, 14, 22, 10],
  [7, 48, 37, 31, 19, 15, 23, 11],
  [7, 50, 38, 32, 20, 16, 26, 12],
  [2, 12, 48, 55, 28, 21, 22, 9],
  [2, 10, 44, 50, 25, 18, 18, 7],
]
const TYPICAL_HOUR = [8, 52, 38, 34, 20, 15, 20, 9]

const ordersVsTypical = ORDERS_BY_HOUR.flatMap((counts, day) =>
  counts.map((orders, hour) => ({
    day: DAYS[day],
    hour: HOURS[hour],
    deviation: Math.round(
      ((orders - TYPICAL_HOUR[hour]) / TYPICAL_HOUR[hour]) * 100,
    ),
  })),
)

function growth(series: number[]) {
  const [previous, latest] = series.slice(-2)
  return Math.round(((latest - previous) / previous) * 1000) / 10
}

const kpiCards: NumberCardProps[] = [
  {
    title: 'Net revenue',
    value: monthlyRevenue.at(-1)!,
    prefix: '$',
    compact: true,
    delta: growth(monthlyRevenue),
    deltaSuffix: '%',
    deltaCaption: 'vs last month',
    sparkline: { data: monthlyRevenue },
  },
  {
    title: 'Orders shipped',
    value: monthlyOrders.at(-1)!,
    delta: growth(monthlyOrders),
    deltaSuffix: '%',
    deltaCaption: 'vs last month',
    sparkline: { data: monthlyOrders, type: 'bar' },
  },
  {
    title: 'Monthly churn',
    value: monthlyChurn.at(-1)!,
    suffix: '%',
    precision: 1,
    delta: -0.4,
    deltaSuffix: 'pts',
    deltaCaption: 'vs last month',
    negativeIsBetter: true,
    sparkline: { data: monthlyChurn },
  },
  {
    title: 'Average order value',
    value:
      Math.round((monthlyRevenue.at(-1)! / monthlyOrders.at(-1)!) * 100) / 100,
    prefix: '$',
    precision: 2,
    delta: 2.4,
    deltaSuffix: '%',
    deltaCaption: 'vs last month',
  },
]

/** Tiers of one measure summing to a total: the sequential default. */
const revenueByPlanChart: BarChartProps = {
  data: revenueByPlan,
  x: 'month',
  y: ['Starter', 'Plus', 'Pro'],
  xAxis: { type: 'time', timeGrain: 'month' },
  yAxis: { title: 'Revenue ($)' },
  stacked: true,
  title: 'Revenue by plan',
  subtitle: 'Net revenue, last 12 months',
}

/** Two units in one chart: dollars against the percentage of target they made. */
const revenueVsTargetChart: LineChartProps = {
  data: revenueVsTarget,
  x: 'month',
  y: ['revenue', 'target', 'attainment'],
  xAxis: { type: 'time', timeGrain: 'month' },
  yAxis: { title: 'Revenue ($)' },
  y2Axis: { title: 'Attainment (%)', min: 90, max: 110 },
  palette: 'categorical',
  seriesConfig: {
    target: { lineType: 'dashed', lineWidth: 1.5 },
    attainment: { axis: 'y2' },
  },
  title: 'Revenue against target',
  subtitle: 'Committed plan vs actuals',
}

const sessionsChart: AreaChartProps = {
  data: sessionsByDevice,
  x: 'month',
  y: ['Mobile', 'Desktop', 'Tablet'],
  xAxis: { type: 'time', timeGrain: 'month' },
  stacked: true,
  title: 'Sessions by device',
  subtitle: 'Store visits, last 12 months',
}

const channelsChart: DonutChartProps = {
  data: sessionsByChannel,
  category: 'channel',
  value: 'sessions',
  centerLabel: 'sessions',
  title: 'Traffic by channel',
  subtitle: 'July 2026',
}

/** Plans are ordered tiers, so the ring runs as a ramp rather than as hues. */
const planMixChart: DonutChartProps = {
  data: planMix,
  category: 'plan',
  value: 'subscriptions',
  variant: 'half',
  palette: 'sequential',
  centerLabel: 'subscriptions',
  title: 'Plan mix',
  subtitle: 'Active subscriptions, July 2026',
}

const funnelChart: FunnelChartProps = {
  data: signupFunnel,
  category: 'stage',
  value: 'people',
  title: 'Store visit to subscription',
  subtitle: 'July 2026',
}

const topProductsChart: BarChartProps = {
  data: topProducts,
  x: 'product',
  y: 'revenue',
  horizontal: true,
  seriesConfig: { revenue: { showDataLabels: true } },
  title: 'Top products',
  subtitle: 'Revenue, July 2026',
}

/** No in-cell values — 56 numbers loses the pattern, and the tooltip has them. */
const ordersVsTypicalChart: HeatmapChartProps = {
  data: ordersVsTypical,
  x: 'hour',
  y: 'day',
  value: 'deviation',
  palette: 'diverging',
  title: 'Demand vs typical week',
  subtitle: 'Orders against the same hour’s four-week average (%)',
}

const root = ref<HTMLElement>()
const { tokens } = useChartTokens(root)

/**
 * One series read as two directions off a shared rest point, which is what the
 * diverging ramp is for. The ramp ends are read outside the callback so a theme
 * flip re-colors the bars.
 */
const marginChart = computed<BarChartProps>(() => {
  const ahead = tokens.value.diverging[0]
  const behind = tokens.value.diverging.at(-1)!

  return {
    data: marginVariance,
    x: 'month',
    y: 'variance',
    xAxis: { type: 'time', timeGrain: 'month' },
    palette: 'diverging',
    seriesConfig: {
      variance: {
        echartOptions: {
          itemStyle: {
            color: (params: any) =>
              (Array.isArray(params.value) ? params.value[1] : params.value) < 0
                ? behind
                : ahead,
          },
        },
      },
    },
    title: 'Contribution margin vs plan',
    subtitle: 'Thousands of dollars',
  }
})

// Decorative: the page has no query layer behind it, and the point of the
// controls is that the header reads like one a customer would use.
const period = ref('12m')
const periodOptions = [
  { label: 'Last 12 months', value: '12m' },
  { label: 'Last 6 months', value: '6m' },
  { label: 'Year to date', value: 'ytd' },
]
const cardMenu = [
  { label: 'View full report', onClick: () => {} },
  { label: 'Export as CSV', onClick: () => {} },
]

// The card is chrome, not a label: every chart in it draws its own title.
const card =
  'flex min-w-0 flex-col rounded-xl border border-outline-gray-1 bg-surface-elevation-2 px-4 py-3'
</script>

<template>
  <div ref="root" class="flex w-full flex-col gap-4">
    <header class="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 class="text-xl font-semibold text-ink-gray-9">
          Subscription overview
        </h2>
        <p class="text-p-sm text-ink-gray-5">
          Brewline Coffee · 1 Aug 2025 – 31 Jul 2026
        </p>
      </div>
      <div class="flex items-center gap-2">
        <Select v-model="period" :options="periodOptions" size="sm" />
        <Button label="Export" variant="subtle" />
        <Button label="Share" variant="solid" />
      </div>
    </header>

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <NumberCard v-for="kpi in kpiCards" :key="kpi.title" v-bind="kpi" />
    </div>

    <div class="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
      <section :class="[card, 'h-80 lg:col-span-2']">
        <BarChart v-bind="revenueByPlanChart">
          <template #actions>
            <Dropdown :options="cardMenu" placement="left">
              <Button variant="ghost" size="sm" icon="lucide-more-horizontal" />
            </Dropdown>
          </template>
        </BarChart>
      </section>

      <section :class="[card, 'h-80']">
        <DonutChart v-bind="channelsChart" />
      </section>

      <section :class="[card, 'h-80 lg:col-span-2']">
        <LineChart v-bind="revenueVsTargetChart">
          <template #actions>
            <Badge label="102% of target" theme="green" />
          </template>
        </LineChart>
      </section>

      <section :class="[card, 'h-80']">
        <DonutChart v-bind="planMixChart" />
      </section>

      <section :class="[card, 'h-80']">
        <AreaChart v-bind="sessionsChart" />
      </section>

      <section :class="[card, 'h-80']">
        <FunnelChart v-bind="funnelChart" />
      </section>

      <section :class="[card, 'h-80']">
        <BarChart v-bind="marginChart" />
      </section>

      <section :class="[card, 'h-80 lg:col-span-2 xl:col-span-3']">
        <BarChart v-bind="topProductsChart" />
      </section>

      <!-- Eight columns of seven: needs the full row to stay square-ish. -->
      <section :class="[card, 'h-72 lg:col-span-2 xl:col-span-3']">
        <HeatmapChart v-bind="ordersVsTypicalChart" />
      </section>
    </div>
  </div>
</template>
