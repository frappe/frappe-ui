<script setup>
import { ContextMenu } from 'frappe-ui'

const items = [
  {
    label: 'Share',
    icon: 'share-2',
    submenu: [
      {
        label: 'Email',
        icon: 'mail',
        onClick: () => alert('Share via Email'),
      },
      {
        label: 'Copy Link',
        icon: 'link',
        onClick: () => alert('Link copied'),
      },
      {
        label: 'Social',
        icon: 'share',
        submenu: [
          {
            label: 'Twitter',
            icon: 'twitter',
            onClick: () => alert('Twitter'),
          },
          {
            label: 'Facebook',
            icon: 'facebook',
            onClick: () => alert('Facebook'),
          },
        ],
      },
    ],
  },
  {
    label: 'Export',
    icon: 'download',
    onClick: () => alert('Export'),
  },
]
</script>

<template>
  <ContextMenu :items="items">
    <div class="flex h-32 w-full items-center justify-center rounded-lg border-2 border-dashed border-gray-300 text-sm text-gray-500 hover:border-gray-400 hover:bg-gray-50 transition-colors cursor-context-menu">
      Right click for submenus
    </div>
  </ContextMenu>
</template>
