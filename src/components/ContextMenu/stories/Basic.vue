<script setup>
import { ContextMenu } from 'frappe-ui'

const items = [
  {
    label: 'Open',
    onClick: () => alert('Open clicked'),
  },
  {
    label: 'Save',
    onClick: () => alert('Save clicked'),
  },
]
</script>

<template>
  <ContextMenu :items="items">
    <div class="flex h-32 w-full items-center justify-center rounded-lg border-2 border-dashed border-gray-300 text-sm text-gray-500 hover:border-gray-400 hover:bg-gray-50 transition-colors cursor-context-menu">
      Right click here
    </div>
  </ContextMenu>
</template>
