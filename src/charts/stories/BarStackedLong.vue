<script setup lang="ts">
import { BarChart } from 'frappe-ui/charts'

// Long data: one row per plan per quarter. `series` splits the rows.
const revenueByPlan = [
  { quarter: 'Q1 2025', plan: 'Starter', revenue: 18200 },
  { quarter: 'Q1 2025', plan: 'Plus', revenue: 42600 },
  { quarter: 'Q1 2025', plan: 'Pro', revenue: 61400 },
  { quarter: 'Q2 2025', plan: 'Starter', revenue: 20450 },
  { quarter: 'Q2 2025', plan: 'Plus', revenue: 47100 },
  { quarter: 'Q2 2025', plan: 'Pro', revenue: 58900 },
  { quarter: 'Q3 2025', plan: 'Starter', revenue: 17800 },
  { quarter: 'Q3 2025', plan: 'Plus', revenue: 51300 },
  { quarter: 'Q3 2025', plan: 'Pro', revenue: 72200 },
  { quarter: 'Q4 2025', plan: 'Starter', revenue: 22900 },
  { quarter: 'Q4 2025', plan: 'Plus', revenue: 54800 },
  { quarter: 'Q4 2025', plan: 'Pro', revenue: 81050 },
]
</script>

<template>
  <div class="h-80 w-full">
    <BarChart
      :data="revenueByPlan"
      x="quarter"
      y="revenue"
      series="plan"
      stacked
      :y-axis="{ title: 'Revenue ($)' }"
      title="Revenue by plan"
      subtitle="Stacked, from long data"
    />
  </div>
</template>
