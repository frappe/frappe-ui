<script setup lang="ts">
import { AreaChart } from 'frappe-ui/charts'

const revenue = [
  { month: '2025-08-01', revenue: 144500 },
  { month: '2025-09-01', revenue: 150700 },
  { month: '2025-10-01', revenue: 157400 },
  { month: '2025-11-01', revenue: 172700 },
  { month: '2025-12-01', revenue: 188600 },
  { month: '2026-01-01', revenue: 171700 },
  { month: '2026-02-01', revenue: 177100 },
  { month: '2026-03-01', revenue: 186700 },
  { month: '2026-04-01', revenue: 193600 },
  { month: '2026-05-01', revenue: 202100 },
  { month: '2026-06-01', revenue: 209500 },
  { month: '2026-07-01', revenue: 220200 },
]
</script>

<template>
  <div class="h-80 w-full">
    <AreaChart
      :data="revenue"
      x="month"
      y="revenue"
      :x-axis="{ type: 'time', timeGrain: 'month' }"
      :y-axis="{
        title: 'Net revenue',
        format: (value) => `$${(value / 1000).toFixed(0)}k`,
      }"
      :fill-opacity="0.25"
      :series-config="{ revenue: { smooth: true } }"
      title="Net revenue"
      subtitle="One series, fill fades out towards the axis"
    />
  </div>
</template>
