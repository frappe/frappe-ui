<script setup lang="ts">
import { Dropdown } from 'frappe-ui'

const switchActions = [
  {
    label: 'Rename',
    icon: 'edit',
    onClick: () => console.log('Rename clicked'),
  },
  {
    label: 'Lock',
    icon: 'lock',
    switch: true,
    switchValue: true,
    onClick: (val) => console.log('Lock:', val),
  },
  {
    label: 'Collaborate',
    icon: 'users',
    switch: true,
    onClick: (val) => console.log('Collaborate:', val),
  },
]
</script>

<template>
  <Dropdown :options="switchActions" />
</template>
