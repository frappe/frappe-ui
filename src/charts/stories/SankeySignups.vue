<script setup lang="ts">
import { SankeyChart } from 'frappe-ui/charts'

/** Where last quarter's signups came from, and what became of them. */
const signups = [
  { from: 'Organic search', to: 'Free trial', users: 4200 },
  { from: 'Paid ads', to: 'Free trial', users: 2600 },
  { from: 'Referral', to: 'Free trial', users: 1800 },
  { from: 'Partner', to: 'Sales demo', users: 900 },
  { from: 'Free trial', to: 'Paid plan', users: 2100 },
  { from: 'Free trial', to: 'Lapsed', users: 6500 },
  { from: 'Sales demo', to: 'Paid plan', users: 640 },
  { from: 'Sales demo', to: 'Lapsed', users: 260 },
]
</script>

<template>
  <div class="h-80 w-full">
    <SankeyChart
      :data="signups"
      source="from"
      target="to"
      value="users"
      title="Signup flow"
      subtitle="Acquisition channel to outcome, last quarter"
    />
  </div>
</template>
