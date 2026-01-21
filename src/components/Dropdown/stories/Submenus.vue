<script setup lang="ts">
import { Dropdown } from 'frappe-ui'

const submenuActions = [
  {
    label: 'New',
    icon: 'plus',
    submenu: [
      {
        label: 'New Document',
        icon: 'file-plus',
        onClick: () => console.log('New Document clicked'),
      },
      {
        label: 'New Template',
        icon: 'file-text',
        onClick: () => console.log('New Template clicked'),
      },
    ],
  },
  {
    label: 'Edit',
    icon: 'edit',
    onClick: () => console.log('Edit clicked'),
  },
]
</script>

<template>
  <Dropdown :options="submenuActions" />
</template>
