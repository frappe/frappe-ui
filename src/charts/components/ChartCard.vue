<template>
  <!-- `relative` and `overflow-hidden` are structure. A chart draws inside this
       box and expects the box to clip it. `card: false` removes the surface
       classes only. -->
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
import type { ChartCardProps } from '../types'

const SURFACE =
  'rounded-7 border border-outline-gray-1 bg-surface-elevation-2 px-4 py-3'

withDefaults(defineProps<ChartCardProps>(), { card: true })

defineSlots<{ default: () => unknown }>()
</script>
