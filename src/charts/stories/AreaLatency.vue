<script setup lang="ts">
import { AreaChart } from 'frappe-ui/charts'

const latency = [
  { at: '2026-07-28T00:00:00', p95: 182 },
  { at: '2026-07-28T02:00:00', p95: 168 },
  { at: '2026-07-28T04:00:00', p95: 161 },
  { at: '2026-07-28T06:00:00', p95: 194 },
  { at: '2026-07-28T08:00:00', p95: 268 },
  { at: '2026-07-28T10:00:00', p95: 412 },
  { at: '2026-07-28T12:00:00', p95: 587 },
  { at: '2026-07-28T14:00:00', p95: 449 },
  { at: '2026-07-28T16:00:00', p95: 321 },
  { at: '2026-07-28T18:00:00', p95: 254 },
  { at: '2026-07-28T20:00:00', p95: 213 },
  { at: '2026-07-28T22:00:00', p95: 190 },
]
</script>

<template>
  <div class="h-80 w-full">
    <AreaChart
      :data="latency"
      x="at"
      y="p95"
      :x-axis="{ type: 'time', timeGrain: 'hour' }"
      :y-axis="{ title: 'Latency', format: (value) => `${value} ms` }"
      :fill-opacity="0.25"
      :series-config="{ p95: { label: 'p95 latency', smooth: true } }"
      title="Response time"
      subtitle="95th percentile, all endpoints"
    />
  </div>
</template>
