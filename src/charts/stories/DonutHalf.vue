<script setup lang="ts">
import { DonutChart } from 'frappe-ui/charts'

const planMix = [
  { plan: 'Starter', subscriptions: 1180 },
  { plan: 'Plus', subscriptions: 962 },
  { plan: 'Pro', subscriptions: 418 },
]
</script>

<template>
  <div class="h-80 w-full">
    <!-- Plans are ordered tiers, so the ring runs as a ramp rather than as hues. -->
    <DonutChart
      :data="planMix"
      category="plan"
      value="subscriptions"
      variant="half"
      palette="sequential"
      show-inline-labels
      title="Plan mix"
      subtitle="Active subscriptions, July 2026"
    />
  </div>
</template>
