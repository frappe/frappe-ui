<script setup lang="ts">
import { CalendarHeatmapChart } from 'frappe-ui/charts'

// A year of commits, quieter at weekends. Days with no commits have no row.
const commits = Array.from({ length: 366 }, (_, i) => {
  const day = new Date(2024, 0, 1 + i)
  const weekend = day.getDay() === 0 || day.getDay() === 6
  const count = ((i * 37) % 11) - (weekend ? 7 : 2)
  return { day, commits: count }
}).filter((row) => row.commits > 0)
</script>

<template>
  <div class="h-60 w-full">
    <CalendarHeatmapChart
      :data="commits"
      date="day"
      value="commits"
      start="2024-01-01"
      end="2024-12-31"
      title="Commits"
      subtitle="2024"
    />
  </div>
</template>
