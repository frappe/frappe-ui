<script setup lang="ts">
import { ref } from 'vue'
import { ContextMenu, type ContextMenuOptions } from 'frappe-ui'

const text = 'Ship it tomorrow?'
const deleted = ref(false)
const lastAction = ref('')

const messageActions: ContextMenuOptions = [
  {
    label: 'Reply',
    icon: 'lucide-reply',
    onClick: () => (lastAction.value = 'Replying to Alex'),
  },
  {
    label: 'Copy text',
    icon: 'lucide-copy',
    onClick: () => (lastAction.value = `Copied “${text}”`),
  },
  {
    label: 'Edit',
    icon: 'lucide-pen',
    onClick: () => (lastAction.value = 'Editing message'),
  },
  {
    label: 'Delete',
    icon: 'lucide-trash-2',
    theme: 'red',
    onClick: () => {
      deleted.value = true
      lastAction.value = 'Message deleted'
    },
  },
]

function restore() {
  deleted.value = false
  lastAction.value = ''
}
</script>

<template>
  <div class="grid gap-3 justify-items-center">
    <ContextMenu :options="messageActions">
      <div class="flex flex-col gap-1.5">
        <div class="flex items-baseline gap-2">
          <span class="text-sm font-medium text-ink-gray-8">Alex</span>
          <span class="text-xs text-ink-gray-4">9:41 AM</span>
        </div>
        <div
          v-if="!deleted"
          class="w-fit cursor-default select-none rounded-2xl rounded-tl-sm bg-surface-gray-3 px-3.5 py-2 text-sm text-ink-gray-8"
        >
          {{ text }}
        </div>
        <div v-else class="flex items-center gap-2 text-sm text-ink-gray-4">
          <span class="italic">Message deleted</span>
          <button
            class="font-medium text-ink-gray-6 underline underline-offset-2"
            @click="restore"
          >
            Undo
          </button>
        </div>
      </div>
    </ContextMenu>

    <div class="text-sm text-ink-gray-5">
      {{ lastAction || 'Right-click the message' }}
    </div>
  </div>
</template>
