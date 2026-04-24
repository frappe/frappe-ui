<script setup lang="ts">
import { ref } from 'vue'
import { Dropdown } from 'frappe-ui'
import LucidePen from '~icons/lucide/pen'
import LucideCopy from '~icons/lucide/copy'
import LucideTrash2 from '~icons/lucide/trash-2'

const lastAction = ref('')

const actions = [
  {
    label: 'Edit',
    icon: LucidePen,
    onClick: () => (lastAction.value = 'Edited'),
  },
  {
    label: 'Duplicate',
    icon: LucideCopy,
    onClick: () => (lastAction.value = 'Duplicated'),
  },
  {
    label: 'Delete',
    icon: LucideTrash2,
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
