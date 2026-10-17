<script setup lang="ts">
import { CalendarHeatmapChart } from 'frappe-ui/charts'

// One row per order, so several rows land on most days and add up.
const orders = Array.from({ length: 1400 }, (_, i) => ({
  placed_on: new Date(2023, 6, 1 + Math.floor((i * 547) % 540)),
  amount: 20 + ((i * 13) % 80),
}))
</script>

<template>
  <div class="h-96 w-full">
    <CalendarHeatmapChart
      :data="orders"
      date="placed_on"
      value="amount"
      start="2023-07-01"
      end="2024-12-31"
      week-start="monday"
      title="Order value by day"
      subtitle="July 2023 to December 2024"
    />
  </div>
</template>
