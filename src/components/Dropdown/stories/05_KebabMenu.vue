<script setup lang="ts">
import { Button, Dropdown } from 'frappe-ui'
import LucideMoreHorizontal from '~icons/lucide/more-horizontal'
import LucidePen from '~icons/lucide/pen'
import LucideCopy from '~icons/lucide/copy'
import LucideShare2 from '~icons/lucide/share-2'
import LucideArchive from '~icons/lucide/archive'
import LucideTrash2 from '~icons/lucide/trash-2'

type Task = { title: string; meta: string }

const tasks: Task[] = [
  { title: 'Ship Combobox v1', meta: 'Due Friday · Engineering' },
  { title: 'Write migration guide', meta: 'In review · Design' },
  { title: 'Audit selection components', meta: 'Backlog · Platform' },
]

function rowActions(task: Task) {
  return [
    {
      group: 'Manage',
      items: [
        {
          label: 'Rename',
          icon: LucidePen,
          onClick: () => console.log('rename', task.title),
        },
        {
          label: 'Duplicate',
          icon: LucideCopy,
          onClick: () => console.log('duplicate', task.title),
        },
        {
          label: 'Share',
          icon: LucideShare2,
          onClick: () => console.log('share', task.title),
        },
      ],
    },
    {
      group: 'Move',
      items: [
        {
          label: 'Archive',
          icon: LucideArchive,
          onClick: () => console.log('archive', task.title),
        },
        {
          label: 'Delete',
          icon: LucideTrash2,
          theme: 'red',
          onClick: () => console.log('delete', task.title),
        },
      ],
    },
  ]
}
</script>

<template>
  <div class="w-80 divide-y divide-outline-gray-1 rounded-lg border border-outline-gray-1 bg-surface-white">
    <div
      v-for="task in tasks"
      :key="task.title"
      class="flex items-center gap-3 px-3 py-2.5"
    >
      <div class="min-w-0 flex-1">
        <div class="truncate text-base text-ink-gray-8">{{ task.title }}</div>
        <div class="truncate text-p-sm text-ink-gray-5">{{ task.meta }}</div>
      </div>

      <Dropdown placement="right" :options="rowActions(task)">
        <template #trigger="{ open }">
          <Button
            variant="ghost"
            :icon="LucideMoreHorizontal"
            :active="open"
            aria-label="Row actions"
          />
        </template>
      </Dropdown>
    </div>
  </div>
</template>
