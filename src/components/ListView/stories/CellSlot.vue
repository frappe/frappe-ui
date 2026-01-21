<script setup>
import { h, reactive } from 'vue'
import { Avatar, Badge, ListView } from 'frappe-ui'

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

const rows = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@doe.com',
    status: 'Active',
    role: 'Developer',
    user_image: 'https://avatars.githubusercontent.com/u/499550',
  },
  {
    id: 2,
    name: 'Jane Doe',
    email: 'jane@doe.com',
    status: 'Inactive',
    role: 'HR',
    user_image: 'https://avatars.githubusercontent.com/u/499120',
  },
]
</script>

<template>
  <ListView
    class="h-[250px]"
    :columns="cols"
    :rows="rows"
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
    row-key="id"
  >
    <template #cell="{ item, row, column }">
      <Badge v-if="column.key === 'status'">{{ item }}</Badge>
      <span class="font-medium text-ink-gray-7" v-else>{{ item }}</span>
    </template>
  </ListView>
</template>
