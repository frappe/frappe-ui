<script setup lang="ts">
import { LineChart } from 'frappe-ui/charts'

// A rate is the only thing on the axis. The count it was taken from and the
// money behind it are two other units, so drawing them would need two more
// scales to say what the tooltip says in two lines.
const checkout = [
  { month: '2025-08-01', conversion_rate: 2.9, orders: 1540, aov: 68.4 },
  { month: '2025-09-01', conversion_rate: 3.1, orders: 1682, aov: 71.2 },
  { month: '2025-10-01', conversion_rate: 3.4, orders: 1910, aov: 69.8 },
  { month: '2025-11-01', conversion_rate: 4.1, orders: 2604, aov: 74.5 },
  { month: '2025-12-01', conversion_rate: 3.8, orders: 2471, aov: 81.3 },
  { month: '2026-01-01', conversion_rate: 2.8, orders: 1489, aov: 63.9 },
  { month: '2026-02-01', conversion_rate: 3.0, orders: 1603, aov: 66.1 },
  { month: '2026-03-01', conversion_rate: 3.3, orders: 1855, aov: 70.7 },
  { month: '2026-04-01', conversion_rate: 3.5, orders: 1994, aov: 73.2 },
  { month: '2026-05-01', conversion_rate: 3.6, orders: 2088, aov: 75.6 },
  { month: '2026-06-01', conversion_rate: 3.4, orders: 1962, aov: 72.8 },
  { month: '2026-07-01', conversion_rate: 3.7, orders: 2205, aov: 78.1 },
]
</script>

<template>
  <div class="h-80 w-full">
    <LineChart
      :data="checkout"
      x="month"
      y="conversion_rate"
      :x-axis="{ type: 'time', timeGrain: 'month' }"
      :y-axis="{ title: 'Conversion rate', format: (value) => `${value}%` }"
      :series-config="{ conversion_rate: { label: 'Conversion rate' } }"
      :tooltip-columns="[
        { name: 'orders', label: 'Orders' },
        {
          name: 'aov',
          label: 'Average order value',
          format: (value) => `$${value}`,
        },
      ]"
      title="Checkout conversion"
      subtitle="Hover a month: the count and the basket behind the rate"
    />
  </div>
</template>
