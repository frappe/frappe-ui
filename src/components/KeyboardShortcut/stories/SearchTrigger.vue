<script setup>
import { KeyboardShortcut } from 'frappe-ui'
</script>

<template>
  <button
    type="button"
    class="flex h-7 w-60 items-center gap-2 rounded-4 bg-surface-gray-2 px-2 text-base text-ink-gray-5 hover:bg-surface-gray-3"
  >
    <span class="lucide-search size-4" aria-hidden="true" />
    <span class="flex-1 text-left">Search</span>
    <KeyboardShortcut :show-plus="false" combo="Mod+K" />
  </button>
</template>
