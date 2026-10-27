<script setup lang="ts">
import { PercentageBarChart } from 'frappe-ui/charts'

const ticketsByState = [
  { state: 'Resolved', tickets: 412 },
  { state: 'Open', tickets: 128 },
  { state: 'Waiting on customer', tickets: 64 },
]

const count = (value: number) => `${value.toLocaleString('en-US')} tickets`
</script>

<template>
  <div class="h-40 w-full">
    <PercentageBarChart
      :data="ticketsByState"
      category="state"
      value="tickets"
      :format="count"
      title="Support queue"
      subtitle="604 tickets this week"
    />
  </div>
</template>
