<script setup lang="ts">
import { LineChart } from 'frappe-ui/charts'

const sessions = [
  { month: '2025-08-01', mobile: 41200, desktop: 26800 },
  { month: '2025-09-01', mobile: 43100, desktop: 27400 },
  { month: '2025-10-01', mobile: 45600, desktop: 28200 },
  { month: '2025-11-01', mobile: 52400, desktop: 31900 },
  { month: '2025-12-01', mobile: 58200, desktop: 34100 },
  { month: '2026-01-01', mobile: 47800, desktop: 29600 },
  { month: '2026-02-01', mobile: 49300, desktop: 30200 },
  { month: '2026-03-01', mobile: 52100, desktop: 31400 },
  { month: '2026-04-01', mobile: 54600, desktop: 32300 },
  { month: '2026-05-01', mobile: 57200, desktop: 33500 },
  { month: '2026-06-01', mobile: 59800, desktop: 34600 },
  { month: '2026-07-01', mobile: 63400, desktop: 36100 },
]
</script>

<template>
  <div class="h-80 w-full">
    <LineChart
      :data="sessions"
      x="month"
      :y="['mobile', 'desktop']"
      :x-axis="{ type: 'time', timeGrain: 'month', title: 'Month' }"
      :y-axis="{ title: 'Sessions' }"
      palette="categorical"
      :series-config="{
        mobile: { smooth: true },
        desktop: { lineType: 'dashed', lineWidth: 1.5, smooth: true },
      }"
      title="Sessions by device"
      subtitle="Store sessions, last 12 months"
    />
  </div>
</template>
