<script setup lang="ts">
import { ScatterChart } from 'frappe-ui/charts'

/** One row per product line: how fast it grows, and what it keeps. */
const products = [
  { product: 'Payroll', growth: 34, margin: 62 },
  { product: 'Invoicing', growth: 12, margin: 71 },
  { product: 'CRM', growth: 41, margin: 48 },
  { product: 'Helpdesk', growth: 27, margin: 55 },
  { product: 'Inventory', growth: 8, margin: 44 },
  { product: 'Insights', growth: 52, margin: 39 },
  { product: 'Field service', growth: 6, margin: 58 },
  { product: 'Point of sale', growth: 19, margin: 33 },
]

const percent = (value: number) => `${value}%`
</script>

<template>
  <div class="h-80 w-full">
    <ScatterChart
      :data="products"
      x="growth"
      y="margin"
      label="product"
      show-data-labels
      :x-axis="{ title: 'Growth', format: percent }"
      :y-axis="{ title: 'Margin', format: percent }"
      :reference-lines="[
        { value: 25, axis: 'x', label: 'Median growth', dashed: true },
        { value: 50, axis: 'y', label: 'Median margin', dashed: true },
      ]"
      title="Growth against margin"
      subtitle="Median lines divide the plot into four"
    />
  </div>
</template>
