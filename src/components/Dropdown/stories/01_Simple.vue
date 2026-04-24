<script setup lang="ts">
import { ref } from 'vue'
import { Dropdown, type DropdownOptions } from 'frappe-ui'

const lastAction = ref('')

const actions: DropdownOptions = [
  {
    label: 'Edit',
    icon: 'lucide-pen',
    onClick: () => (lastAction.value = 'Edited'),
  },
  {
    label: 'Duplicate',
    icon: 'lucide-copy',
    onClick: () => (lastAction.value = 'Duplicated'),
  },
  {
    label: 'Delete',
    icon: 'lucide-trash-2',
    theme: 'red',
    onClick: () => (lastAction.value = 'Deleted'),
  },
]
</script>

<template>
  <div class="grid gap-3">
    <Dropdown :options="actions" :button="{ label: 'Options' }" />

    <div class="text-sm text-ink-gray-5">
      {{ lastAction || 'Pick an action' }}
    </div>
  </div>
</template>
