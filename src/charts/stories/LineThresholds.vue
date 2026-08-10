<script setup lang="ts">
import { LineChart } from 'frappe-ui/charts'

const latency = [
  { day: '2026-07-06', p95: 412, errors: 0.9 },
  { day: '2026-07-07', p95: 398, errors: 0.7 },
  { day: '2026-07-08', p95: 445, errors: 1.1 },
  { day: '2026-07-09', p95: 612, errors: 2.4 },
  { day: '2026-07-10', p95: 704, errors: 3.1 },
  { day: '2026-07-11', p95: 538, errors: 1.6 },
  { day: '2026-07-12', p95: 461, errors: 1.0 },
  { day: '2026-07-13', p95: 388, errors: 0.6 },
]
</script>

<template>
  <div class="h-80 w-full">
    <LineChart
      :data="latency"
      x="day"
      :y="['p95', 'errors']"
      :x-axis="{ type: 'time', timeGrain: 'day' }"
      :y-axis="{ title: 'p95 latency', format: (value) => `${value} ms` }"
      :y2-axis="{ title: 'Error rate', format: (value) => `${value}%` }"
      palette="categorical"
      :series-config="{ errors: { label: 'Errors', axis: 'y2' } }"
      :reference-lines="[
        { value: 500, label: 'SLA', dashed: true },
        { value: 2, axis: 'y2', label: 'Error budget', dashed: true },
        { value: '2026-07-09', axis: 'x', label: 'Release 4.2' },
      ]"
      title="Latency and errors"
      subtitle="API gateway, last eight days"
    />
  </div>
</template>
