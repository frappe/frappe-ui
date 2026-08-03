<script setup lang="ts">
import { FunnelChart } from 'frappe-ui/charts'

const signupFunnel = [
  { stage: 'Visited the store', people: 106200 },
  { stage: 'Viewed a plan', people: 38400 },
  { stage: 'Started checkout', people: 9860 },
  { stage: 'Entered payment details', people: 3410 },
  { stage: 'Active subscription', people: 2560 },
]

const compact = (value: number) =>
  new Intl.NumberFormat('en-US', { notation: 'compact' }).format(value)
</script>

<template>
  <div class="h-80 w-full">
    <FunnelChart
      :data="signupFunnel"
      category="stage"
      value="people"
      :format="compact"
      title="Store visit to subscription"
      subtitle="July 2026"
    />
  </div>
</template>
