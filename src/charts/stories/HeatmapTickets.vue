<script setup lang="ts">
import { HeatmapChart } from 'frappe-ui/charts'

const HOURS = ['9am', '11am', '1pm', '3pm', '5pm', '7pm']
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']

// One row per cell: a grid is long data by construction.
const COUNTS = [
  [34, 48, 29, 41, 26, 11],
  [37, 52, 31, 44, 28, 13],
  [35, 55, 33, 46, 27, 12],
  [39, 58, 36, 49, 31, 15],
  [30, 43, 25, 38, 22, 9],
]

const tickets = DAYS.flatMap((day, dayIndex) =>
  HOURS.map((hour, hourIndex) => ({
    day,
    hour,
    tickets: COUNTS[dayIndex][hourIndex],
  })),
)
</script>

<template>
  <div class="h-72 w-full">
    <HeatmapChart
      :data="tickets"
      x="hour"
      y="day"
      value="tickets"
      show-values
      title="Support load"
      subtitle="Tickets opened by hour of the working week"
    />
  </div>
</template>
