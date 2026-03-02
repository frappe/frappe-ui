<script setup>
import { ContextMenu } from 'frappe-ui'

const items = [
  {
    group: 'File Operations',
    items: [
      {
        label: 'Open',
        icon: 'folder-open',
        onClick: () => alert('Open clicked'),
      },
      {
        label: 'Save',
        icon: 'save',
        shortcut: '⌘S',
        onClick: () => alert('Save clicked'),
      },
      { separator: true },
      {
        label: 'Export',
        icon: 'download',
        onClick: () => alert('Export clicked'),
      },
    ],
  },
  {
    group: 'Edit',
    items: [
      {
        label: 'Copy',
        icon: 'copy',
        shortcut: '⌘C',
        onClick: () => alert('Copy clicked'),
      },
      {
        label: 'Paste',
        icon: 'clipboard',
        shortcut: '⌘V',
        onClick: () => alert('Paste clicked'),
      },
    ],
  },
]
</script>

<template>
  <ContextMenu :items="items">
    <div class="flex h-32 w-full items-center justify-center rounded-lg border-2 border-dashed border-gray-300 text-sm text-gray-500 hover:border-gray-400 hover:bg-gray-50 transition-colors cursor-context-menu">
      Right click for grouped items
    </div>
  </ContextMenu>
</template>
