<script setup lang="ts">
import { Dropdown } from 'frappe-ui'

const groupedActions = [
  {
    group: 'Actions',
    items: [
      {
        label: 'Edit',
        icon: 'edit',
        onClick: () => console.log('Edit clicked'),
      },
      {
        label: 'Duplicate',
        icon: 'copy',
        onClick: () => console.log('Duplicate clicked'),
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
</script>

<template>
  <Dropdown :options="groupedActions" />
</template>
