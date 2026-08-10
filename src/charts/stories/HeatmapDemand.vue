<script setup lang="ts">
import { HeatmapChart } from 'frappe-ui/charts'

const HOURS = ['6am', '8am', '10am', '12pm', '2pm', '4pm', '6pm', '8pm']
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

/** Orders placed in each hour of July, against the same hour's four-week average. */
const ORDERS = [
  [6, 45, 35, 29, 18, 14, 22, 10],
  [6, 47, 36, 30, 18, 15, 23, 10],
  [6, 46, 35, 29, 18, 14, 22, 10],
  [7, 48, 37, 31, 19, 15, 23, 11],
  [7, 50, 38, 32, 20, 16, 26, 12],
  [2, 12, 48, 55, 28, 21, 22, 9],
  [2, 10, 44, 50, 25, 18, 18, 7],
]
const TYPICAL = [8, 52, 38, 34, 20, 15, 20, 9]

// Signed deviation, so the diverging ramp does the reading: quiet weekend
// mornings cool, the brunch rush hot.
const ordersVsTypical = ORDERS.flatMap((row, day) =>
  row.map((orders, hour) => ({
    day: DAYS[day],
    hour: HOURS[hour],
    deviation: Math.round(((orders - TYPICAL[hour]) / TYPICAL[hour]) * 100),
  })),
)
</script>

<template>
  <div class="h-72 w-full">
    <HeatmapChart
      :data="ordersVsTypical"
      x="hour"
      y="day"
      value="deviation"
      palette="diverging"
      :min="-60"
      :max="60"
      :format="(value) => `${value > 0 ? '+' : ''}${value}%`"
      title="Demand vs typical week"
      subtitle="Orders against the same hour's four-week average"
    />
  </div>
</template>
