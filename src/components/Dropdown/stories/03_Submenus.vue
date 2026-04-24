<script setup lang="ts">
import { Dropdown } from 'frappe-ui'
import LucideShare2 from '~icons/lucide/share-2'
import LucideLink from '~icons/lucide/link'
import LucideUserPlus from '~icons/lucide/user-plus'
import LucideMail from '~icons/lucide/mail'
import LucideMessageCircle from '~icons/lucide/message-circle'
import LucideFolderInput from '~icons/lucide/folder-input'
import LucideInbox from '~icons/lucide/inbox'
import LucideCheckCircle from '~icons/lucide/check-circle'
import LucideTrash2 from '~icons/lucide/trash-2'

const actions = [
  {
    group: 'Manage',
    items: [
      {
        label: 'Share',
        icon: LucideShare2,
        submenu: [
          {
            label: 'Copy link',
            icon: LucideLink,
            onClick: () => console.log('copy link'),
          },
          {
            label: 'Invite people',
            icon: LucideUserPlus,
            submenu: [
              {
                label: 'By email',
                icon: LucideMail,
                onClick: () => console.log('invite by email'),
              },
              {
                label: 'Send to Slack',
                icon: LucideMessageCircle,
                onClick: () => console.log('send to slack'),
              },
            ],
          },
        ],
      },
      {
        label: 'Move to',
        icon: LucideFolderInput,
        submenu: [
          {
            label: 'Backlog',
            icon: LucideInbox,
            onClick: () => console.log('move to backlog'),
          },
          {
            label: 'Done',
            icon: LucideCheckCircle,
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
        icon: LucideTrash2,
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
