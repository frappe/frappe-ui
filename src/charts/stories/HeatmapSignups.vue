<script setup lang="ts">
import { HeatmapChart } from 'frappe-ui/charts'

const PLANS = ['Free', 'Pro', 'Team']
const COUNTS = [
  [420, 455, 512, 498, 540, 601],
  [86, 92, 104, 118, 131, 147],
  [12, 15, 14, 21, 26, 33],
]

// A real date column: the axis would otherwise print the whole timestamp.
const signups = PLANS.flatMap((plan, planIndex) =>
  COUNTS[planIndex].map((signups, month) => ({
    plan,
    month: new Date(Date.UTC(2024, month, 1)),
    signups,
  })),
)

const monthName = (month: Date) =>
  month.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' })
</script>

<template>
  <div class="h-72 w-full">
    <HeatmapChart
      :data="signups"
      x="month"
      y="plan"
      value="signups"
      :x-axis="{ format: monthName }"
      show-values
      title="Signups by plan"
      subtitle="First half of 2024"
    />
  </div>
</template>
