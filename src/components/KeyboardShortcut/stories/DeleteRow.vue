<script setup>
import { KeyboardShortcut } from 'frappe-ui'

const rows = [
  { label: 'Edit', icon: 'lucide-pencil', combo: 'E' },
  { label: 'Duplicate', icon: 'lucide-copy', combo: 'Mod+D' },
]
</script>

<template>
  <div
    class="w-64 rounded-6 bg-surface-elevation-2 p-1.5 text-base shadow-2xl ring-1 ring-outline-gray-1"
  >
    <div
      v-for="row in rows"
      :key="row.label"
      class="flex items-center justify-between rounded-4 px-2 py-1.5 text-ink-gray-7 hover:bg-surface-gray-3"
    >
      <span class="flex items-center gap-2">
        <span :class="row.icon" class="size-4" aria-hidden="true" />
        {{ row.label }}
      </span>
      <KeyboardShortcut :combo="row.combo" />
    </div>
    <div
      class="flex items-center justify-between rounded-4 px-2 py-1.5 text-ink-red-7 hover:bg-surface-red-1"
    >
      <span class="flex items-center gap-2">
        <span class="lucide-trash-2 size-4" aria-hidden="true" />
        Delete task
      </span>
      <KeyboardShortcut combo="Mod+Backspace" :alt-combos="['Delete']" />
    </div>
  </div>
</template>
