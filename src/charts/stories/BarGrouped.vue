<script setup lang="ts">
import { BarChart } from 'frappe-ui/charts'
import type { BarChartProps } from 'frappe-ui/charts'

const monthly = [
  { month: '2025-08-01', revenue: 144500, expenses: 121300 },
  { month: '2025-09-01', revenue: 150700, expenses: 124800 },
  { month: '2025-10-01', revenue: 157400, expenses: 129100 },
  { month: '2025-11-01', revenue: 172700, expenses: 138600 },
  { month: '2025-12-01', revenue: 188600, expenses: 152400 },
  { month: '2026-01-01', revenue: 171700, expenses: 149900 },
  { month: '2026-02-01', revenue: 177100, expenses: 151200 },
  { month: '2026-03-01', revenue: 186700, expenses: 155800 },
  { month: '2026-04-01', revenue: 193600, expenses: 159400 },
  { month: '2026-05-01', revenue: 202100, expenses: 164300 },
  { month: '2026-06-01', revenue: 209500, expenses: 168700 },
  { month: '2026-07-01', revenue: 220200, expenses: 173500 },
]

// The shape a saved chart takes: one typed object, spread with v-bind.
const revenueVsExpenses: BarChartProps = {
  data: monthly,
  x: 'month',
  y: ['revenue', 'expenses'],
  xAxis: { type: 'time', timeGrain: 'month' },
  yAxis: {
    title: 'Amount',
    format: (value) => `$${(value / 1000).toFixed(0)}k`,
  },
  seriesConfig: { expenses: { label: 'Operating expenses' } },
  title: 'Revenue vs expenses',
  subtitle: 'Last 12 months',
}
</script>

<template>
  <div class="h-80 w-full">
    <BarChart v-bind="revenueVsExpenses" />
  </div>
</template>
