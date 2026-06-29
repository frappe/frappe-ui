<script setup lang="ts">
import { ref } from 'vue'
import { ContextMenu, type ContextMenuOptions } from 'frappe-ui'

type FileItem = {
  name: string
  type: 'folder' | 'doc' | 'image' | 'sheet'
  meta: string
}

const files: FileItem[] = [
  { name: 'Design Assets', type: 'folder', meta: '14 items' },
  { name: 'Q3 Report.docx', type: 'doc', meta: 'Edited 2h ago' },
  { name: 'Campaign Banner.png', type: 'image', meta: '2.4 MB' },
  { name: 'Budget 2025.xlsx', type: 'sheet', meta: 'Edited yesterday' },
  { name: 'Archive', type: 'folder', meta: '3 items' },
]

const iconMap: Record<FileItem['type'], string> = {
  folder: 'lucide-folder',
  doc: 'lucide-file-text',
  image: 'lucide-image',
  sheet: 'lucide-table',
}

function getActions(file: FileItem): ContextMenuOptions {
  const base: ContextMenuOptions = [
    {
      label: 'Open',
      icon: 'lucide-external-link',
      onClick: () => console.log('open', file.name),
    },
    {
      label: 'Rename',
      icon: 'lucide-pen',
      onClick: () => console.log('rename', file.name),
    },
    {
      label: 'Copy link',
      icon: 'lucide-link',
      onClick: () => console.log('copy link', file.name),
    },
  ]
  if (file.type === 'folder') {
    base.push({
      label: 'New file',
      icon: 'lucide-file-plus',
      onClick: () => console.log('new file in', file.name),
    })
  } else {
    base.push({
      label: 'Download',
      icon: 'lucide-download',
      onClick: () => console.log('download', file.name),
    })
  }
  if (file.type === 'image') {
    base.push({
      label: 'Set as cover',
      icon: 'lucide-image',
      onClick: () => console.log('set as cover', file.name),
    })
  }
  base.push({
    label: 'Delete',
    icon: 'lucide-trash-2',
    theme: 'red',
    onClick: () => console.log('delete', file.name),
  })
  return base
}

const activeOptions = ref<ContextMenuOptions>([])
</script>

<template>
  <div
    class="w-80 overflow-hidden rounded-xl border border-outline-gray-2 bg-surface-base shadow-sm"
  >
    <div class="border-b border-outline-gray-1 px-3 py-2">
      <p class="text-p-sm-medium text-ink-gray-5">Recents</p>
    </div>
    <ContextMenu :options="activeOptions">
      <ul class="divide-y divide-outline-gray-1">
        <li
          v-for="file in files"
          :key="file.name"
          class="flex cursor-default select-none items-center gap-2.5 px-3 py-2 hover:bg-surface-gray-1"
          @contextmenu="activeOptions = getActions(file)"
        >
          <span
            class="size-4 shrink-0 text-ink-gray-4"
            :class="iconMap[file.type]"
          />
          <div class="min-w-0 flex-1">
            <p class="truncate text-sm text-ink-gray-8">{{ file.name }}</p>
          </div>
          <span class="shrink-0 text-p-sm text-ink-gray-4">{{
            file.meta
          }}</span>
        </li>
      </ul>
    </ContextMenu>
  </div>
</template>
