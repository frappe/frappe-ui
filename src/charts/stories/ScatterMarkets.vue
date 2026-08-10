<script setup lang="ts">
import { ScatterChart } from 'frappe-ui/charts'

/** One row per market: what a seat costs, how long it stays, how many there are. */
const markets = [
  { market: 'Germany', arpu: 61, retention: 88, seats: 14200, region: 'EMEA' },
  { market: 'France', arpu: 54, retention: 82, seats: 9100, region: 'EMEA' },
  { market: 'UAE', arpu: 72, retention: 79, seats: 2600, region: 'EMEA' },
  { market: 'Nigeria', arpu: 21, retention: 74, seats: 4800, region: 'EMEA' },
  { market: 'India', arpu: 18, retention: 91, seats: 38400, region: 'APAC' },
  { market: 'Japan', arpu: 68, retention: 94, seats: 7300, region: 'APAC' },
  { market: 'Australia', arpu: 59, retention: 85, seats: 5200, region: 'APAC' },
  { market: 'Singapore', arpu: 77, retention: 81, seats: 1900, region: 'APAC' },
  {
    market: 'United States',
    arpu: 74,
    retention: 87,
    seats: 41500,
    region: 'Americas',
  },
  {
    market: 'Canada',
    arpu: 63,
    retention: 89,
    seats: 8600,
    region: 'Americas',
  },
  {
    market: 'Brazil',
    arpu: 26,
    retention: 71,
    seats: 12800,
    region: 'Americas',
  },
  {
    market: 'Mexico',
    arpu: 31,
    retention: 76,
    seats: 6400,
    region: 'Americas',
  },
]
</script>

<template>
  <div class="h-96 w-full">
    <ScatterChart
      :data="markets"
      x="arpu"
      y="retention"
      size="seats"
      series="region"
      label="market"
      :x-axis="{ title: 'ARPU', format: (value: number) => `$${value}` }"
      :y-axis="{ title: 'Retention', format: (value: number) => `${value}%` }"
      title="Revenue per seat against retention"
      subtitle="Bubble size is the number of seats"
    />
  </div>
</template>
