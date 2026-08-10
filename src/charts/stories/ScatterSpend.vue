<script setup lang="ts">
import { ScatterChart } from 'frappe-ui/charts'

/** What each account cost to win last quarter, and what it brought back. */
const accounts = [
  { account: 'Acme', spend: 4200, revenue: 12400 },
  { account: 'Globex', spend: 9100, revenue: 24200 },
  { account: 'Initech', spend: 2200, revenue: 3100 },
  { account: 'Umbrella', spend: 7400, revenue: 9600 },
  { account: 'Soylent', spend: 5600, revenue: 18800 },
  { account: 'Hooli', spend: 12800, revenue: 21400 },
  { account: 'Vehement', spend: 1800, revenue: 6200 },
  { account: 'Massive Dynamic', spend: 10400, revenue: 34600 },
  { account: 'Stark', spend: 6800, revenue: 7400 },
  { account: 'Wayne', spend: 3100, revenue: 11200 },
]

const currency = (value: number) =>
  `$${new Intl.NumberFormat('en-US').format(value)}`
</script>

<template>
  <div class="h-80 w-full">
    <ScatterChart
      :data="accounts"
      x="spend"
      y="revenue"
      label="account"
      :x-axis="{ title: 'Acquisition spend' }"
      :y-axis="{ title: 'Revenue' }"
      :format="currency"
      title="Spend against revenue"
      subtitle="Ten largest accounts, last quarter"
    />
  </div>
</template>
