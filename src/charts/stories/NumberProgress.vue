<script setup lang="ts">
import { NumberCard } from 'frappe-ui/charts'
import type { NumberCardProps } from 'frappe-ui/charts'

const compact = (value: number) =>
  new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value)

const cards: NumberCardProps[] = [
  {
    title: 'CPU busy',
    value: 51.3,
    suffix: '%',
    progress: { value: 51.3 },
  },
  {
    title: 'Revenue this quarter',
    value: 621_800,
    target: 750_000,
    prefix: '$',
    format: compact,
    delta: 12.4,
    deltaSuffix: '%',
    deltaCaption: 'vs last quarter',
    progress: { value: (621_800 / 750_000) * 100 },
  },
  {
    title: 'Tickets closed',
    value: 112,
    target: 100,
    progress: { value: 112 },
  },
  {
    title: 'Storage used',
    value: 61,
    suffix: '%',
    progress: { value: 61, color: '#f59e0b' },
  },
]
</script>

<template>
  <div class="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
    <NumberCard v-for="card in cards" :key="card.title" v-bind="card" />
  </div>
</template>
