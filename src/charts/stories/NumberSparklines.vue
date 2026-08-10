<script setup lang="ts">
import { NumberCard } from 'frappe-ui/charts'
import type { NumberCardProps } from 'frappe-ui/charts'

const signups = [
  842, 906, 971, 1044, 1123, 1018, 1067, 1142, 1196, 1218, 1247, 1284,
]
const ordersShipped = [
  1786, 1852, 1921, 2094, 2274, 2064, 2120, 2222, 2292, 2378, 2452, 2560,
]
const pipeline = [
  12.4, 13.1, 13.9, 15.2, 16.0, 15.1, 15.8, 16.4, 17.1, 17.6, 18.0, 18.45,
]
const storageUsed = [42, 44, 46, 49, 51, 52, 54, 56, 57, 59, 60, 61]

const cards: NumberCardProps[] = [
  {
    title: 'Signups',
    value: 1284,
    delta: 12.5,
    deltaSuffix: '%',
    deltaCaption: 'vs last month',
    sparkline: { data: signups },
  },
  {
    title: 'Orders shipped',
    value: 2560,
    sparkline: { data: ordersShipped, type: 'bar' },
  },
  {
    title: 'Pipeline',
    value: 18_450_000,
    prefix: '$',
    compact: true,
    sparkline: { data: pipeline },
  },
  {
    title: 'Storage used',
    value: 61,
    suffix: '%',
    // The reading in the ink of the trend under it: one mark, one color.
    color: '#f59e0b',
    sparkline: { data: storageUsed, color: '#f59e0b' },
  },
]
</script>

<template>
  <div class="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
    <NumberCard v-for="card in cards" :key="card.title" v-bind="card" />
  </div>
</template>
