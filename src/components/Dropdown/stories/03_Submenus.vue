<script setup lang="ts">
import { Dropdown, type DropdownOptions } from 'frappe-ui'

const actions: DropdownOptions = [
  {
    group: 'Manage',
    items: [
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
            submenu: [
              {
                label: 'By email',
                icon: 'lucide-mail',
                onClick: () => console.log('invite by email'),
              },
              {
                label: 'Send to Slack',
                icon: 'lucide-message-circle',
                onClick: () => console.log('send to slack'),
              },
            ],
          },
        ],
      },
      {
        label: 'Move to',
        icon: 'lucide-folder-input',
        submenu: [
          {
            label: 'Backlog',
            icon: 'lucide-inbox',
            onClick: () => console.log('move to backlog'),
          },
          {
            label: 'Done',
            icon: 'lucide-check-circle',
            onClick: () => console.log('move to done'),
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
        icon: 'lucide-trash-2',
        theme: 'red',
        onClick: () => console.log('delete'),
      },
    ],
  },
]
</script>

<template>
  <Dropdown :options="actions" :button="{ label: 'Actions' }" />
</template>
