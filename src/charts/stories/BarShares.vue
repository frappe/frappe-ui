<script setup lang="ts">
import { BarChart } from 'frappe-ui/charts'

// New revenue per quarter, one row per plan. Seven plans is more than a column
// can hold apart, which is what `maxSeries` is for.
const revenue = [
  { quarter: 'Q1', plan: 'Enterprise', amount: 412000 },
  { quarter: 'Q1', plan: 'Business', amount: 268000 },
  { quarter: 'Q1', plan: 'Pro', amount: 154000 },
  { quarter: 'Q1', plan: 'Starter', amount: 61000 },
  { quarter: 'Q1', plan: 'Education', amount: 24000 },
  { quarter: 'Q1', plan: 'Nonprofit', amount: 15000 },
  { quarter: 'Q1', plan: 'Legacy', amount: 9000 },

  { quarter: 'Q2', plan: 'Enterprise', amount: 486000 },
  { quarter: 'Q2', plan: 'Business', amount: 291000 },
  { quarter: 'Q2', plan: 'Pro', amount: 178000 },
  { quarter: 'Q2', plan: 'Starter', amount: 58000 },
  { quarter: 'Q2', plan: 'Education', amount: 31000 },
  { quarter: 'Q2', plan: 'Nonprofit', amount: 17000 },
  { quarter: 'Q2', plan: 'Legacy', amount: 7000 },

  { quarter: 'Q3', plan: 'Enterprise', amount: 604000 },
  { quarter: 'Q3', plan: 'Business', amount: 302000 },
  { quarter: 'Q3', plan: 'Pro', amount: 186000 },
  { quarter: 'Q3', plan: 'Starter', amount: 52000 },
  { quarter: 'Q3', plan: 'Education', amount: 29000 },
  { quarter: 'Q3', plan: 'Nonprofit', amount: 18000 },
  { quarter: 'Q3', plan: 'Legacy', amount: 5000 },

  { quarter: 'Q4', plan: 'Enterprise', amount: 731000 },
  { quarter: 'Q4', plan: 'Business', amount: 318000 },
  { quarter: 'Q4', plan: 'Pro', amount: 174000 },
  { quarter: 'Q4', plan: 'Starter', amount: 47000 },
  { quarter: 'Q4', plan: 'Education', amount: 33000 },
  { quarter: 'Q4', plan: 'Nonprofit', amount: 21000 },
  { quarter: 'Q4', plan: 'Legacy', amount: 4000 },
]

const money = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
  }).format(value)
</script>

<template>
  <div class="h-80 w-full">
    <BarChart
      :data="revenue"
      x="quarter"
      y="amount"
      series="plan"
      :max-series="5"
      stacked="normalized"
      :y-axis="{ title: 'Share of new revenue', format: money }"
      title="Revenue mix by plan"
      subtitle="Share of new revenue each quarter"
    />
  </div>
</template>
