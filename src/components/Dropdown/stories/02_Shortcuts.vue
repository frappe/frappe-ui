<script setup lang="ts">
import { Dropdown } from 'frappe-ui'

type FileAction = {
  label: string
  icon: string
  shortcut: string[]
  theme?: 'red'
  onClick?: () => void
}

const actions: FileAction[] = [
  { label: 'New document', icon: 'lucide-plus', shortcut: ['⌘', 'N'] },
  { label: 'Rename', icon: 'lucide-pen', shortcut: ['F2'] },
  { label: 'Duplicate', icon: 'lucide-copy', shortcut: ['⌘', 'D'] },
  {
    label: 'Delete',
    icon: 'lucide-trash-2',
    shortcut: ['⌫'],
    theme: 'red',
  },
]
</script>

<template>
  <Dropdown :options="actions" :button="{ label: 'File' }">
    <template #item-suffix="{ item }">
      <div
        v-if="(item as FileAction).shortcut"
        class="flex items-center gap-px"
      >
        <kbd
          v-for="(key, i) in (item as FileAction).shortcut"
          :key="i"
          class="font-sans text-xs leading-4 text-ink-gray-6"
        >
          {{ key }}
        </kbd>
      </div>
    </template>
  </Dropdown>
</template>
