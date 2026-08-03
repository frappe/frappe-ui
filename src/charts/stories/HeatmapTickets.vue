<script setup lang="ts">
import { HeatmapChart } from 'frappe-ui/charts'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
const SHIFTS = ['Morning', 'Midday', 'Afternoon', 'Evening']

// One row per cell: a grid is long data by construction.
const COUNTS = [
  [48, 62, 41, 18],
  [52, 66, 44, 21],
  [50, 71, 46, 19],
  [55, 74, 49, 24],
  [43, 58, 38, 15],
]

const tickets = DAYS.flatMap((day, dayIndex) =>
  SHIFTS.map((shift, shiftIndex) => ({
    day,
    shift,
    tickets: COUNTS[dayIndex][shiftIndex],
  })),
)
</script>

<template>
  <div class="h-72 w-full">
    <HeatmapChart
      :data="tickets"
      x="day"
      y="shift"
      value="tickets"
      show-values
      title="Support load"
      subtitle="Tickets opened per shift, sequential ramp"
    />
  </div>
</template>
