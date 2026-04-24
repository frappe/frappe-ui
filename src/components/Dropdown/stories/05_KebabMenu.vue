<script setup lang="ts">
import { Button, Dropdown, type DropdownOptions } from 'frappe-ui'

type Task = { title: string; meta: string }

const tasks: Task[] = [
  { title: 'Ship Combobox v1', meta: 'Due Friday · Engineering' },
  { title: 'Write migration guide', meta: 'In review · Design' },
  { title: 'Audit selection components', meta: 'Backlog · Platform' },
]

function rowActions(task: Task): DropdownOptions {
  return [
    {
      group: 'Manage',
      items: [
        {
          label: 'Rename',
          icon: 'lucide-pen',
          onClick: () => console.log('rename', task.title),
        },
        {
          label: 'Duplicate',
          icon: 'lucide-copy',
          onClick: () => console.log('duplicate', task.title),
        },
        {
          label: 'Share',
          icon: 'lucide-share-2',
          onClick: () => console.log('share', task.title),
        },
      ],
    },
    {
      group: 'Move',
      items: [
        {
          label: 'Archive',
          icon: 'lucide-archive',
          onClick: () => console.log('archive', task.title),
        },
        {
          label: 'Delete',
          icon: 'lucide-trash-2',
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
            icon="lucide-more-horizontal"
            :active="open"
            aria-label="Row actions"
          />
        </template>
      </Dropdown>
    </div>
  </div>
</template>
