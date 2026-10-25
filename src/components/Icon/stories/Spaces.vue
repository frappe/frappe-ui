<script setup lang="ts">
import { Icon } from 'frappe-ui'

// Each space stores its icon as a string. People pick either a lucide icon
// or an emoji, and Icon renders both.
const spaces = [
  { name: 'Engineering', icon: 'lucide-code' },
  { name: 'Design', icon: '🎨' },
  { name: 'Marketing', icon: 'lucide-megaphone' },
  { name: 'Offsite 2026', icon: '🏝️' },
]
</script>

<template>
  <div class="w-60 space-y-0.5">
    <div
      v-for="space in spaces"
      :key="space.name"
      class="flex h-7 items-center gap-2 rounded-4 px-2 text-base text-ink-gray-8 hover:bg-surface-gray-2"
    >
      <Icon :icon="space.icon" class="size-4 text-ink-gray-6" />
      {{ space.name }}
    </div>
  </div>
</template>
