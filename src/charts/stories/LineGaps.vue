<script setup lang="ts">
import { LineChart } from 'frappe-ui/charts'
import type { LineChartProps } from 'frappe-ui/charts'

// The two nulls are a tracking outage, not two weeks of nobody checking out.
const checkoutShare = [
  { week: '2026-05-11', share: 8.2 },
  { week: '2026-05-18', share: 9.1 },
  { week: '2026-05-25', share: 9.8 },
  { week: '2026-06-01', share: null },
  { week: '2026-06-08', share: null },
  { week: '2026-06-15', share: 11.4 },
  { week: '2026-06-22', share: 12.0 },
  { week: '2026-06-29', share: 12.9 },
  { week: '2026-07-06', share: 13.4 },
  { week: '2026-07-13', share: 14.1 },
  { week: '2026-07-20', share: 15.2 },
  { week: '2026-07-27', share: 16.0 },
]

const adoption: LineChartProps = {
  data: checkoutShare,
  x: 'week',
  y: 'share',
  xAxis: { type: 'time', timeGrain: 'week' },
  yAxis: { title: 'Share of orders (%)' },
  seriesConfig: { share: { label: 'In-app checkout', showDataPoints: true } },
}
</script>

<template>
  <div class="grid w-full gap-4 sm:grid-cols-2">
    <div class="h-72">
      <LineChart
        v-bind="adoption"
        title="In-app checkout"
        subtitle="Share of orders, weekly"
      />
    </div>
    <div class="h-72">
      <LineChart
        v-bind="adoption"
        connect-nulls
        title="In-app checkout"
        subtitle="Same series with connectNulls"
      />
    </div>
  </div>
</template>
