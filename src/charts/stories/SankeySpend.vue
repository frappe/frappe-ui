<script setup lang="ts">
import { SankeyChart } from 'frappe-ui/charts'

/** Where the infrastructure bill goes, in thousands of dollars. */
const spend = [
  { service: 'Compute', team: 'Product', amount: 320 },
  { service: 'Compute', team: 'Data', amount: 180 },
  { service: 'Storage', team: 'Product', amount: 90 },
  { service: 'Storage', team: 'Data', amount: 240 },
  { service: 'Network', team: 'Product', amount: 60 },
  { service: 'Network', team: 'Support', amount: 40 },
]

const inThousands = (value: number) => `$${value}K`
</script>

<template>
  <div class="h-96 w-full">
    <SankeyChart
      :data="spend"
      source="service"
      target="team"
      value="amount"
      orient="vertical"
      :format="inThousands"
      title="Infrastructure spend"
      subtitle="Service to team, this month"
    />
  </div>
</template>
