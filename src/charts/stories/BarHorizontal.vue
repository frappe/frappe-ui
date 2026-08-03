<script setup lang="ts">
import { BarChart } from 'frappe-ui/charts'

const topProducts = [
  { product: 'Ethiopia Yirgacheffe — single origin, 1kg', revenue: 42800 },
  { product: 'House Espresso — 500g, subscriber favourite', revenue: 38600 },
  { product: 'Colombia Huila Decaf — whole bean, 500g', revenue: 27400 },
  { product: 'Cold Brew Concentrate — six-bottle case', revenue: 21900 },
  { product: 'Guatemala Antigua — limited lot, 250g', revenue: 17300 },
  { product: 'Starter Kit — grinder and filter bundle', revenue: 12700 },
]

const currency = (value: number) => `$${value.toLocaleString('en-US')}`
</script>

<template>
  <div class="h-80 w-full">
    <BarChart
      :data="topProducts"
      x="product"
      y="revenue"
      horizontal
      :y-axis="{ title: 'Revenue', format: currency }"
      :series-config="{ revenue: { showDataLabels: true } }"
      title="Top products"
      subtitle="Long labels read better along the Y axis"
    />
  </div>
</template>
