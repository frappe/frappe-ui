<script setup>
import { ContextMenu } from 'frappe-ui'

const items = [
  {
    label: 'Default Theme',
    icon: 'info',
    theme: 'gray',
    onClick: () => alert('Gray theme'),
  },
  {
    label: 'Blue Theme',
    icon: 'info',
    theme: 'blue',
    onClick: () => alert('Blue theme'),
  },
  {
    label: 'Green Theme',
    icon: 'check-circle',
    theme: 'green',
    onClick: () => alert('Green theme'),
  },
  {
    label: 'Red Theme',
    icon: 'trash-2',
    theme: 'red',
    onClick: () => alert('Red theme'),
  },
]
</script>

<template>
  <ContextMenu :items="items">
    <div class="flex h-32 w-full items-center justify-center rounded-lg border-2 border-dashed border-gray-300 text-sm text-gray-500 hover:border-gray-400 hover:bg-gray-50 transition-colors cursor-context-menu">
      Right click for themes
    </div>
  </ContextMenu>
</template>
