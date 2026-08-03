<script setup lang="ts">
import { AreaChart } from 'frappe-ui/charts'

// Requests served per minute, split by the service that handled them.
const throughput = [
  { at: '2026-07-28T00:00:00', api: 4180, web: 2240, worker: 1360 },
  { at: '2026-07-28T02:00:00', api: 3260, web: 1780, worker: 1420 },
  { at: '2026-07-28T04:00:00', api: 2940, web: 1520, worker: 1680 },
  { at: '2026-07-28T06:00:00', api: 4620, web: 2380, worker: 1490 },
  { at: '2026-07-28T08:00:00', api: 8140, web: 4360, worker: 1610 },
  { at: '2026-07-28T10:00:00', api: 11280, web: 6120, worker: 1740 },
  { at: '2026-07-28T12:00:00', api: 12460, web: 6840, worker: 1820 },
  { at: '2026-07-28T14:00:00', api: 11940, web: 6410, worker: 1780 },
  { at: '2026-07-28T16:00:00', api: 10370, web: 5480, worker: 1690 },
  { at: '2026-07-28T18:00:00', api: 8020, web: 4120, worker: 1580 },
  { at: '2026-07-28T20:00:00', api: 6340, web: 3260, worker: 1470 },
  { at: '2026-07-28T22:00:00', api: 5010, web: 2680, worker: 1400 },
]
</script>

<template>
  <div class="h-80 w-full">
    <AreaChart
      :data="throughput"
      x="at"
      :y="['api', 'web', 'worker']"
      :x-axis="{ type: 'time', timeGrain: 'hour' }"
      :y-axis="{ title: 'Requests / min' }"
      stacked
      :series-config="{
        api: { label: 'API' },
        web: { label: 'Web' },
        worker: { label: 'Workers' },
      }"
      title="Request throughput"
      subtitle="Requests served per minute, by service"
    />
  </div>
</template>
