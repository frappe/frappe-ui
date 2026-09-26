<script setup>
import { KeyboardShortcut } from 'frappe-ui'

const hints = [
  { combo: 'ArrowUp', altCombos: ['ArrowDown'], label: 'to navigate' },
  { combo: 'Enter', label: 'to open' },
  { combo: 'Escape', label: 'to close' },
]
</script>

<template>
  <div
    class="flex w-full max-w-md items-center gap-4 rounded-6 border border-outline-gray-2 px-3 py-2 text-sm text-ink-gray-5"
  >
    <div
      v-for="hint in hints"
      :key="hint.combo"
      class="flex items-center gap-1.5"
    >
      <KeyboardShortcut
        :combo="hint.combo"
        :alt-combos="hint.altCombos"
        bg
      />
      <span>{{ hint.label }}</span>
    </div>
  </div>
</template>
