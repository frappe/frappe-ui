<script setup lang="ts">
import { LineChart } from 'frappe-ui/charts'

const weekly = [
  { week: '2026-05-04', signups: 1240, plan: 1100 },
  { week: '2026-05-11', signups: 1385, plan: 1150 },
  { week: '2026-05-18', signups: 1302, plan: 1200 },
  { week: '2026-05-25', signups: 1467, plan: 1250 },
  { week: '2026-06-01', signups: 1590, plan: 1300 },
  { week: '2026-06-08', signups: 1521, plan: 1350 },
  { week: '2026-06-15', signups: 1688, plan: 1400 },
  { week: '2026-06-22', signups: 1744, plan: 1450 },
]
</script>

<template>
  <div class="h-80 w-full">
    <LineChart
      :data="weekly"
      x="week"
      :y="['signups', 'plan']"
      :x-axis="{ type: 'time', timeGrain: 'week' }"
      :y-axis="{ title: 'Signups' }"
      palette="categorical"
      :series-config="{
        signups: { type: 'area' },
        plan: { lineType: 'dashed', lineWidth: 1.5 },
      }"
      title="Signups against plan"
      subtitle="The reading carries a fill; the plan stays a line"
    />
  </div>
</template>
