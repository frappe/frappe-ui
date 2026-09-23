<script setup>
import { KeyboardShortcut } from 'frappe-ui'
</script>

<template>
  <div
    class="flex w-72 items-center justify-between rounded-5 px-2 py-1.5 text-base text-ink-red-7 hover:bg-surface-red-1"
  >
    <span class="flex items-center gap-2">
      <span class="lucide-trash-2 size-4" aria-hidden="true" />
      Delete task
    </span>
    <KeyboardShortcut combo="Mod+Backspace" :alt-combos="['Delete']" />
  </div>
</template>
