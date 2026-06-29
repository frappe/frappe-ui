<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { Button } from 'frappe-ui'
import { state } from '../../state'
import CommandPalette from './CommandPalette.vue'

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
  <Button aria-label="Open search" @click="state.searchDialog = true">
    <template #prefix>
      <span class="lucide-search size-4" />
    </template>
    Search
    <template #suffix>
      <span class="flex items-center gap-1 text-xs text-ink-gray-5">
        <span class="lucide-command size-3" />
        K
      </span>
    </template>
  </Button>

  <CommandPalette v-model:open="state.searchDialog" />
</template>
