<script setup lang="ts">
import { ref } from 'vue'
import { ContextMenu, type ContextMenuOptions } from 'frappe-ui'

const starred = ref(false)

const actions: ContextMenuOptions = [
  {
    label: 'Open',
    icon: 'lucide-external-link',
    onClick: () => console.log('open'),
  },
  {
    label: 'Rename',
    icon: 'lucide-pen',
    onClick: () => console.log('rename'),
  },
  {
    label: 'Star',
    icon: 'lucide-star',
    onClick: () => (starred.value = !starred.value),
  },
  {
    label: 'Download',
    icon: 'lucide-download',
    onClick: () => console.log('download'),
  },
  {
    label: 'Delete',
    icon: 'lucide-trash-2',
    theme: 'red',
    onClick: () => console.log('delete'),
  },
]
</script>

<template>
  <ContextMenu :options="actions">
    <div
      class="flex w-64 cursor-default select-none items-center gap-3 rounded-xl border border-outline-gray-2 bg-surface-white p-3 shadow-sm"
    >
      <div
        class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#e8f0fe]"
      >
        <span class="lucide-file-text size-5 text-[#1a73e8]" />
      </div>
      <div class="min-w-0 flex-1">
        <div
          class="flex items-center gap-1.5 truncate text-sm font-medium text-ink-gray-8"
        >
          Q3 Report.docx
          <span
            v-if="starred"
            class="lucide-star size-3 fill-amber-400 text-amber-400"
          />
        </div>
        <div class="text-p-sm text-ink-gray-4">Edited 2 hours ago · 48 KB</div>
      </div>
    </div>
  </ContextMenu>
</template>
