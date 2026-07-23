<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { state } from '../../state'
import CommandPalette from './CommandPalette.vue'

// Two roots (trigger + palette), so attrs go on the trigger explicitly.
defineOptions({ inheritAttrs: false })

// Cmd/Ctrl+K toggles the command palette.
function onKeydown(e: KeyboardEvent) {
  if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
    e.preventDefault()
    state.searchDialog = !state.searchDialog
  }
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <!-- Reads as a field rather than a button: search is the primary way to move
       around 60+ pages. Mirrors TextInput's `md`/`subtle` styling. -->
  <button
    v-bind="$attrs"
    aria-label="Open search"
    class="relative h-8 items-center rounded border border-[--surface-gray-2] bg-surface-gray-2 ps-9 pe-9 text-base text-ink-gray-4 transition-colors hover:border-outline-elevation-2 hover:bg-surface-gray-3"
    @click="state.searchDialog = true"
  >
    <span
      class="absolute inset-y-0 start-0 flex items-center ps-2.5 text-ink-gray-5"
    >
      <span class="lucide-search size-4" />
    </span>

    <span class="truncate">Search documentation</span>

    <span
      class="absolute inset-y-0 end-0 flex items-center gap-1 pe-2.5 text-xs text-ink-gray-5"
    >
      <span class="lucide-command size-3" />
      K
    </span>
  </button>

  <CommandPalette v-model:open="state.searchDialog" />
</template>
