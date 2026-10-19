<script setup lang="ts">
import { CalendarHeatmapChart } from 'frappe-ui/charts'

// One row per day: a chart of orders sums them per day before it draws.
const orders = Array.from({ length: 731 }, (_, i) => ({
  placed_on: new Date(2023, 3, 1 + i),
  amount: 40 + ((i * 53) % 200),
}))
</script>

<template>
  <div class="h-96 w-full">
    <CalendarHeatmapChart
      :data="orders"
      date="placed_on"
      value="amount"
      start="2023-04-01"
      end="2025-03-31"
      week-start="monday"
      title="Order value by day"
      subtitle="Fiscal years 2023–24 and 2024–25"
    />
  </div>
</template>
