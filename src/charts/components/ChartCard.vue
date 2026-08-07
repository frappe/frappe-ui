<template>
  <!-- `relative` and `overflow-hidden` are structure, not decoration: a chart
       draws inside this box and expects to be clipped by it, so both survive
       `card: false`. Only the surface itself goes. -->
  <div
    data-slot="chart-card"
    :dir="dir"
    class="relative w-full min-w-0 overflow-hidden"
    :class="card ? SURFACE : undefined"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import type { ChartCardProps } from '../props'

const SURFACE =
  'rounded-7 border border-outline-gray-1 bg-surface-elevation-2 px-4 py-3'

withDefaults(defineProps<ChartCardProps>(), { card: true })

defineSlots<{ default: () => unknown }>()
</script>
