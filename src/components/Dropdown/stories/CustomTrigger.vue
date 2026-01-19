<script setup lang="ts">
import { Button, Dropdown } from 'frappe-ui'

const actions = [
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
  <Dropdown :options="actions">
    <Button variant="solid">Custom Trigger</Button>
  </Dropdown>
</template>
