<script setup>
import { ref } from 'vue'
import { Button, CommandPalette } from 'frappe-ui'

const open = ref(false)
const searchQuery = ref('')
const selected = ref('')

const groups = [
  {
    title: 'Pages',
    items: [
      { name: 'inbox', title: 'Inbox', icon: 'lucide-inbox' },
      { name: 'settings', title: 'Settings', icon: 'lucide-settings' },
    ],
  },
  {
    title: 'Actions',
    items: [
      {
        name: 'new-task',
        title: 'New task',
        description: 'Mod+N',
        icon: 'lucide-plus',
      },
    ],
  },
]

function select(item) {
  selected.value = item.title
}
</script>

<template>
  <div class="flex flex-col items-start gap-3">
    <Button @click="open = true">Open command palette (or press Mod+K)</Button>
    <p v-if="selected" class="text-sm text-ink-gray-6">
      Selected: {{ selected }}
    </p>
    <CommandPalette
      v-model:open="open"
      v-model:query="searchQuery"
      :groups="groups"
      @select="select"
    />
  </div>
</template>
