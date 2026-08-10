<script setup lang="ts">
import { BarChart } from 'frappe-ui/charts'

// Long data: one row per priority per week. `series` splits the rows apart.
const ticketsByPriority = [
  { week: 'Week 22', priority: 'Low', tickets: 184 },
  { week: 'Week 22', priority: 'Normal', tickets: 312 },
  { week: 'Week 22', priority: 'Urgent', tickets: 46 },
  { week: 'Week 23', priority: 'Low', tickets: 171 },
  { week: 'Week 23', priority: 'Normal', tickets: 344 },
  { week: 'Week 23', priority: 'Urgent', tickets: 58 },
  { week: 'Week 24', priority: 'Low', tickets: 196 },
  { week: 'Week 24', priority: 'Normal', tickets: 361 },
  { week: 'Week 24', priority: 'Urgent', tickets: 91 },
  { week: 'Week 25', priority: 'Low', tickets: 205 },
  { week: 'Week 25', priority: 'Normal', tickets: 328 },
  { week: 'Week 25', priority: 'Urgent', tickets: 63 },
]
</script>

<template>
  <div class="h-80 w-full">
    <BarChart
      :data="ticketsByPriority"
      x="week"
      y="tickets"
      series="priority"
      stacked
      :y-axis="{ title: 'Tickets closed' }"
      title="Tickets closed by priority"
      subtitle="Support queue, last four weeks"
    />
  </div>
</template>
