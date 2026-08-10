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
import type { ChartCardProps, ChartCardSlots } from '../types'

// 8px, the radius the library gives a bordered box. A chart card is one panel
// among the panels an app puts on a page — a dashboard tiles them — so it takes
// the same corner as the boxes beside it rather than a rounder one of its own.
const SURFACE =
  'rounded-4 border border-outline-gray-1 bg-surface-elevation-2 px-4 py-3'

withDefaults(defineProps<ChartCardProps>(), { card: true })

defineSlots<ChartCardSlots>()
</script>
