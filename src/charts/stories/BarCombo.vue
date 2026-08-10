<script setup lang="ts">
import { BarChart } from 'frappe-ui/charts'

const quarterly = [
  { quarter: 'Q1 2025', revenue: 412000, expenses: 361000, margin: 12.4 },
  { quarter: 'Q2 2025', revenue: 438500, expenses: 372400, margin: 15.1 },
  { quarter: 'Q3 2025', revenue: 461200, expenses: 398700, margin: 13.6 },
  { quarter: 'Q4 2025', revenue: 512800, expenses: 421300, margin: 17.8 },
  { quarter: 'Q1 2026', revenue: 489600, expenses: 415900, margin: 15.0 },
  { quarter: 'Q2 2026', revenue: 534100, expenses: 438200, margin: 18.0 },
]
</script>

<template>
  <div class="h-80 w-full">
    <BarChart
      :data="quarterly"
      x="quarter"
      :y="['revenue', 'expenses', 'margin']"
      :y-axis="{
        title: 'Amount',
        format: (value) => `$${(value / 1000).toFixed(0)}k`,
      }"
      :y2-axis="{ title: 'Margin (%)', min: 0, max: 25 }"
      palette="categorical"
      :series-config="{
        margin: {
          type: 'line',
          label: 'Margin',
          axis: 'y2',
          showDataPoints: true,
        },
      }"
      title="Revenue, expenses and margin"
      subtitle="Last six quarters"
    />
  </div>
</template>
