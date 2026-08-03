<script setup lang="ts">
import { AreaChart } from 'frappe-ui/charts'

const sessions = [
  { month: '2025-08-01', Mobile: 41200, Desktop: 26800, Tablet: 5400 },
  { month: '2025-09-01', Mobile: 43100, Desktop: 27400, Tablet: 5500 },
  { month: '2025-10-01', Mobile: 45600, Desktop: 28200, Tablet: 5600 },
  { month: '2025-11-01', Mobile: 52400, Desktop: 31900, Tablet: 6300 },
  { month: '2025-12-01', Mobile: 58200, Desktop: 34100, Tablet: 6900 },
  { month: '2026-01-01', Mobile: 47800, Desktop: 29600, Tablet: 5900 },
  { month: '2026-02-01', Mobile: 49300, Desktop: 30200, Tablet: 6000 },
  { month: '2026-03-01', Mobile: 52100, Desktop: 31400, Tablet: 6100 },
  { month: '2026-04-01', Mobile: 54600, Desktop: 32300, Tablet: 6200 },
  { month: '2026-05-01', Mobile: 57200, Desktop: 33500, Tablet: 6400 },
  { month: '2026-06-01', Mobile: 59800, Desktop: 34600, Tablet: 6500 },
  { month: '2026-07-01', Mobile: 63400, Desktop: 36100, Tablet: 6700 },
]
</script>

<template>
  <div class="h-80 w-full">
    <AreaChart
      :data="sessions"
      x="month"
      :y="['Mobile', 'Desktop', 'Tablet']"
      :x-axis="{ type: 'time', timeGrain: 'month' }"
      :y-axis="{ title: 'Sessions' }"
      stacked
      title="Sessions by device"
      subtitle="Stacked bands on the sequential ramp"
    />
  </div>
</template>
