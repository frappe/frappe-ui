<script setup lang="ts">
import { LineChart } from 'frappe-ui/charts'

// Thirty warehouses, twelve weeks each. Each warehouse ships a steady volume
// of its own, nudged week by week, so the totals spread wide enough to rank.
const warehouses = Array.from({ length: 30 }, (_, i) => ({
  name: `WH-${String(i + 1).padStart(2, '0')}`,
  base: Math.round(1800 / (i + 1)) + 40,
}))

const shipments = Array.from({ length: 12 }, (_, week) =>
  warehouses.map((warehouse, i) => ({
    week: `Week ${week + 1}`,
    warehouse: warehouse.name,
    orders: Math.round(warehouse.base * (1 + 0.15 * Math.sin(week + i))),
  })),
).flat()
</script>

<template>
  <div class="h-[420px] w-full">
    <LineChart
      :data="shipments"
      x="week"
      y="orders"
      split-by="warehouse"
      :y-axis="{ title: 'Orders shipped' }"
      title="Orders shipped by warehouse"
      subtitle="All warehouses, last 12 weeks"
    />
  </div>
</template>
