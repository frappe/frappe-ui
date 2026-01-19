<script setup>
import { h, reactive } from 'vue'
import { Avatar, ListView } from 'frappe-ui'

const cols = reactive([
  {
    label: 'Name',
    key: 'name',
    width: 3,
    getLabel: ({ row }) => row.name,
    prefix: ({ row }) =>
      h(Avatar, { shape: 'circle', image: row.user_image, size: 'sm' }),
  },
  { label: 'Email', key: 'email', width: '200px' },
  { label: 'Role', key: 'role' },
  { label: 'Status', key: 'status' },
])
</script>

<template>
  <ListView
    class="h-[250px]"
    :columns="cols"
    :rows="[]"
    :options="{
      selectable: true,
      showTooltip: true,
      resizeColumn: true,
      emptyState: {
        title: 'No records found',
        description: 'Create a new record to get started',
        button: {
          label: 'New Record',
          variant: 'solid',
          onClick: () => console.log('New Record'),
        },
      },
    }"
  />
</template>
