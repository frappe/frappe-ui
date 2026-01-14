<script setup lang="ts">
import { Dropdown } from 'frappe-ui'

const options = [
  { label: 'Edit', icon: 'edit', onClick: () => console.log('Edit clicked') },
  {
    label: 'Delete',
    icon: 'trash-2',
    theme: 'red',
    onClick: () => console.log('Delete clicked'),
  },
]
</script>

<template>
  <Dropdown :options />
</template>
