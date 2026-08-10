<script setup lang="ts">
import { BarChart } from 'frappe-ui/charts'

const booked = [
  { month: 'Feb', amount: 318000 },
  { month: 'Mar', amount: 402000 },
  { month: 'Apr', amount: 366000 },
  { month: 'May', amount: 451000 },
  { month: 'Jun', amount: 428000 },
  { month: 'Jul', amount: 494000 },
]
</script>

<template>
  <div class="h-80 w-full">
    <BarChart
      :data="booked"
      x="month"
      y="amount"
      :y-axis="{
        title: 'Booked',
        format: (value) => `$${(value / 1000).toFixed(0)}k`,
      }"
      :reference-lines="[
        { value: 420000, label: 'Quota', dashed: true },
        { value: 355000, label: 'Break-even' },
      ]"
      title="New business booked"
      subtitle="Against quota, last six months"
    />
  </div>
</template>
