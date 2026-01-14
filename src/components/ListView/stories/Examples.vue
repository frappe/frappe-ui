<script setup>
import { h, reactive } from 'vue'

import { Avatar, ListView } from 'frappe-ui'

const columns = reactive([
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
    class="h-[150px]"
    :columns="columns"
    :rows="rows"
    :options="{
      getRowRoute: (row) => ({
        name: 'User',
        params: { userId: row.id },
      }),
      selectable: true,
      showTooltip: true,
      resizeColumn: true,
    }"
    row-key="id"
  />
</template>
