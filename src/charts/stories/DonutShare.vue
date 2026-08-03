<script setup lang="ts">
import { DonutChart } from 'frappe-ui/charts'

const sessionsByChannel = [
  { channel: 'Organic search', sessions: 39900 },
  { channel: 'Paid social', sessions: 21400 },
  { channel: 'Email', sessions: 16800 },
  { channel: 'Direct', sessions: 14700 },
  { channel: 'Referral & affiliate', sessions: 8900 },
]

const compact = (value: number) =>
  new Intl.NumberFormat('en-US', { notation: 'compact' }).format(value)
</script>

<template>
  <div class="h-80 w-full">
    <DonutChart
      :data="sessionsByChannel"
      category="channel"
      value="sessions"
      center-label="sessions"
      :format="compact"
      title="Traffic by channel"
      subtitle="July 2026"
    />
  </div>
</template>
