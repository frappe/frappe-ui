<script setup lang="ts">
import { LineChart } from 'frappe-ui/charts'

const performance = [
  { month: '2025-08-01', revenue: 144500, target: 140000, attainment: 103.2 },
  { month: '2025-09-01', revenue: 150700, target: 148000, attainment: 101.8 },
  { month: '2025-10-01', revenue: 157400, target: 155000, attainment: 101.5 },
  { month: '2025-11-01', revenue: 172700, target: 175000, attainment: 98.7 },
  { month: '2025-12-01', revenue: 188600, target: 195000, attainment: 96.7 },
  { month: '2026-01-01', revenue: 171700, target: 178000, attainment: 96.5 },
  { month: '2026-02-01', revenue: 177100, target: 180000, attainment: 98.4 },
  { month: '2026-03-01', revenue: 186700, target: 185000, attainment: 100.9 },
  { month: '2026-04-01', revenue: 193600, target: 190000, attainment: 101.9 },
  { month: '2026-05-01', revenue: 202100, target: 198000, attainment: 102.1 },
  { month: '2026-06-01', revenue: 209500, target: 206000, attainment: 101.7 },
  { month: '2026-07-01', revenue: 220200, target: 215000, attainment: 102.4 },
]
</script>

<template>
  <div class="h-80 w-full">
    <LineChart
      :data="performance"
      x="month"
      :y="['revenue', 'target', 'attainment']"
      :x-axis="{ type: 'time', timeGrain: 'month' }"
      :y-axis="{ title: 'Revenue ($)' }"
      :y2-axis="{ title: 'Attainment (%)', min: 90, max: 110 }"
      palette="categorical"
      :series-config="{
        target: { lineType: 'dashed', lineWidth: 1.5 },
        attainment: { label: 'Attainment', axis: 'y2' },
      }"
      title="Revenue against target"
      subtitle="Committed plan vs actuals, last 12 months"
    />
  </div>
</template>
