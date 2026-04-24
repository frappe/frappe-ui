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
        class="flex items-center gap-1"
      >
        <kbd
          v-for="(key, i) in (item as FileAction).shortcut"
          :key="i"
          class="inline-flex min-w-[1.25rem] items-center justify-center rounded border border-outline-gray-2 bg-surface-white px-1 font-mono text-[10px] font-medium leading-4 text-ink-gray-6 shadow-sm"
        >
          {{ key }}
        </kbd>
      </div>
    </template>
  </Dropdown>
</template>
