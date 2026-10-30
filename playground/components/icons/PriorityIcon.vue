<script setup lang="ts">
/**
 * Espresso's `icon/solid/priority-*`, exported from the design file: three
 * bars rising left to right, inked up to the level and left light beyond it.
 * The fills are the theme's own variables, so it follows light and dark.
 */
defineProps<{ level: 'Low' | 'Medium' | 'High' }>()

const bars = [
  { x: 6.5, y: 20, height: 8 },
  { x: 14.5, y: 12, height: 16 },
  { x: 22.5, y: 4, height: 24 },
]

const rank = { Low: 1, Medium: 2, High: 3 }
</script>

<template>
  <svg
    viewBox="0 0 32 32"
    class="size-4 shrink-0"
    fill="none"
    aria-hidden="true"
  >
    <rect
      v-for="(bar, index) in bars"
      :key="index"
      :x="bar.x"
      :y="bar.y"
      width="3"
      :height="bar.height"
      rx="0.5"
      :fill="
        index < rank[level] ? 'var(--ink-gray-7)' : 'var(--surface-gray-4)'
      "
    />
  </svg>
</template>
