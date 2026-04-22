<script setup lang="ts">
import { Dropdown } from 'frappe-ui'

const groupedSubmenuActions = [
  {
    group: 'Actions',
    items: [
      {
        label: 'Edit',
        icon: 'edit',
        onClick: () => console.log('Edit clicked'),
      },
      {
        label: 'Share',
        icon: 'share',
        submenu: [
          {
            label: 'Copy link',
            icon: 'link',
            onClick: () => console.log('Copy link clicked'),
          },
          {
            label: 'Invite people',
            icon: 'user-plus',
            submenu: [
              {
                label: 'Invite by email',
                icon: 'mail',
                onClick: () => console.log('Invite by email clicked'),
              },
              {
                label: 'Share in Slack',
                icon: 'message-circle',
                onClick: () => console.log('Share in Slack clicked'),
              },
            ],
          },
        ],
      },
      {
        label: 'Move to',
        icon: 'folder',
        submenu: [
          {
            label: 'Backlog',
            icon: 'inbox',
            onClick: () => console.log('Move to Backlog clicked'),
          },
          {
            label: 'Done',
            icon: 'check-circle',
            onClick: () => console.log('Move to Done clicked'),
          },
        ],
      },
    ],
  },
  {
    group: 'Danger',
    items: [
      {
        label: 'Delete',
        icon: 'trash-2',
        theme: 'red',
        onClick: () => console.log('Delete clicked'),
      },
    ],
  },
]

const switchActions = [
  {
    label: 'Rename',
    icon: 'edit',
    onClick: () => console.log('Rename clicked'),
  },
  {
    label: 'Lock comments',
    icon: 'lock',
    switch: true,
    switchValue: true,
    onClick: (value) => console.log('Lock comments:', value),
  },
  {
    label: 'Collaborative editing',
    icon: 'users',
    switch: true,
    onClick: (value) => console.log('Collaborative editing:', value),
  },
]
</script>

<template>
  <div class="grid w-full grid-cols-2 gap-10">
    <div class="flex flex-col items-start gap-3">
      <div class="text-base font-medium text-ink-gray-8">
        Grouped actions + nested submenus
      </div>
      <Dropdown :options="groupedSubmenuActions">
        <template #group-label="{ group }">
          {{ group.group }} · {{ group.items.length }}
        </template>
      </Dropdown>
    </div>

    <div class="flex flex-col items-start gap-3">
      <div class="text-base font-medium text-ink-gray-8">Switch rows</div>
      <Dropdown :options="switchActions" />
    </div>
  </div>
</template>
