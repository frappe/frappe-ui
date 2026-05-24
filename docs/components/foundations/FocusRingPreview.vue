<script setup lang="ts">
const FOCUS_RINGS = ['default', 'red', 'green', 'amber', 'blue', 'violet'] as const

function focusRingClass(name: string) {
  return name === 'default' ? 'focus-ring' : `focus-ring-${name}`
}
</script>

<template>
  <div class="grid grid-cols-2 sm:grid-cols-3 gap-6">
    <div v-for="ring in FOCUS_RINGS" :key="ring" class="grid gap-3">
      <div
        class="h-16 rounded-md bg-surface-white border border-outline-gray-2"
        :class="focusRingClass(ring)"
      ></div>
      <div class="grid gap-0.5">
        <span class="text-2xs font-mono text-ink-gray-5">{{ focusRingClass(ring) }}</span>
        <span class="text-xs text-ink-gray-6">--focus-{{ ring }}</span>
      </div>
    </div>
  </div>
</template>
