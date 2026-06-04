<script setup lang="ts">
import { ContextMenu, Avatar, type ContextMenuOptions } from 'frappe-ui'

const actions: ContextMenuOptions = [
  {
    group: 'Actions',
    options: [
      {
        label: 'Edit',
        icon: 'lucide-pen',
        onClick: () => console.log('edit'),
      },
      {
        label: 'Duplicate',
        icon: 'lucide-copy',
        onClick: () => console.log('duplicate'),
      },
      {
        label: 'Share',
        icon: 'lucide-share-2',
        submenu: [
          {
            label: 'Copy link',
            icon: 'lucide-link',
            onClick: () => console.log('copy link'),
          },
          {
            label: 'Invite people',
            icon: 'lucide-user-plus',
            onClick: () => console.log('invite'),
          },
        ],
      },
      {
        label: 'Move to',
        icon: 'lucide-folder-input',
        submenu: [
          {
            label: 'In Progress',
            icon: 'lucide-loader-circle',
            onClick: () => console.log('in progress'),
          },
          {
            label: 'Done',
            icon: 'lucide-circle-check',
            onClick: () => console.log('done'),
          },
          {
            label: 'Backlog',
            icon: 'lucide-inbox',
            onClick: () => console.log('backlog'),
          },
        ],
      },
    ],
  },
  {
    group: 'Danger',
    options: [
      {
        label: 'Delete',
        icon: 'lucide-trash-2',
        theme: 'red',
        onClick: () => console.log('delete'),
      },
    ],
  },
]
</script>

<template>
  <ContextMenu :options="actions">
    <div
      class="w-72 cursor-default select-none rounded-xl border border-outline-gray-2 bg-surface-white p-4 shadow-sm"
    >
      <div class="mb-3 flex items-start justify-between gap-2">
        <span
          class="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700"
        >
          In Progress
        </span>
        <span class="text-p-sm text-ink-gray-4">Due Friday</span>
      </div>
      <p class="mb-2 text-sm font-medium text-ink-gray-8">
        Redesign onboarding flow
      </p>
      <p class="text-p-sm text-ink-gray-5">
        Update the sign-up steps and add the new welcome screen from Figma.
      </p>
      <div class="mt-3">
        <Avatar
          label="John Doe"
          image="https://avatars.githubusercontent.com/u/499550?s=60&v=4"
          size="xs"
        />
      </div>
    </div>
  </ContextMenu>
</template>
