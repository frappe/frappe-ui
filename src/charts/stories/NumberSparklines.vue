<script setup lang="ts">
import { NumberCard } from 'frappe-ui/charts'
import type { NumberCardProps } from 'frappe-ui/charts'

const revenue = [
  144500, 150700, 157400, 172700, 188600, 171700, 177100, 186700, 193600,
  202100, 209500, 220200,
]
const orders = [
  1786, 1852, 1921, 2094, 2274, 2064, 2120, 2222, 2292, 2378, 2452, 2560,
]

const cards: NumberCardProps[] = [
  {
    title: 'Signups',
    value: 1284,
    delta: 12.5,
    deltaSuffix: '%',
    deltaCaption: 'vs last month',
    sparkline: { data: revenue, color: '#22c55e' },
  },
  {
    title: 'Orders shipped',
    value: 2560,
    sparkline: { data: orders, type: 'bar' },
  },
  {
    title: 'Pipeline',
    value: 18_450_000,
    prefix: '$',
    compact: true,
    sparkline: { data: revenue },
  },
  {
    title: 'Storage used',
    value: 61,
    suffix: '%',
    sparkline: { data: orders, type: 'bar', color: '#f59e0b' },
  },
]
</script>

<template>
  <div class="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
    <NumberCard v-for="card in cards" :key="card.title" v-bind="card" />
  </div>
</template>
