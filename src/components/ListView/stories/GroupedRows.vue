<script setup>
import { reactive, ref } from 'vue'
import { ListView } from 'frappe-ui'

const group_columns = reactive([
  { label: 'Name', key: 'name', width: 3 },
  { label: 'Email', key: 'email', width: '200px' },
  { label: 'Role', key: 'role' },
  { label: 'Status', key: 'status' },
])

const grouped_rows = ref([
  {
    group: 'Developer',
    collapsed: false,
    rows: [
      {
        id: 2,
        name: 'Gary Fox',
        email: 'gary@fox.com',
        status: 'Inactive',
        role: 'Developer',
      },
      {
        id: 6,
        name: 'Emily Davis',
        email: 'emily@davis.com',
        status: 'Active',
        role: 'Developer',
      },
      {
        id: 9,
        name: 'David Lee',
        email: 'david@lee.com',
        status: 'Inactive',
        role: 'Developer',
      },
    ],
  },
  {
    group: 'Manager',
    collapsed: false,
    rows: [
      {
        id: 3,
        name: 'John Doe',
        email: 'john@doe.com',
        status: 'Active',
        role: 'Manager',
      },
      {
        id: 8,
        name: 'Sarah Wilson',
        email: 'sarah@wilson.com',
        status: 'Active',
        role: 'Manager',
      },
    ],
  },
  {
    group: 'Designer',
    collapsed: false,
    rows: [
      {
        id: 4,
        name: 'Alice Smith',
        email: 'alice@smith.com',
        status: 'Active',
        role: 'Designer',
      },
      {
        id: 10,
        name: 'Olivia Taylor',
        email: 'olivia@taylor.com',
        status: 'Active',
        role: 'Designer',
      },
    ],
  },
  {
    group: 'HR',
    collapsed: false,
    rows: [
      {
        id: 1,
        name: 'Jane Mary',
        email: 'jane@doe.com',
        status: 'Inactive',
        role: 'HR',
      },
      {
        id: 7,
        name: 'Michael Brown',
        email: 'michael@brown.com',
        status: 'Inactive',
        role: 'HR',
      },
      {
        id: 12,
        name: 'Sophia Martinez',
        email: 'sophia@martinez.com',
        status: 'Active',
        role: 'HR',
      },
    ],
  },
  {
    group: 'Tester',
    collapsed: false,
    rows: [
      {
        id: 5,
        name: 'Bob Johnson',
        email: 'bob@johnson.com',
        status: 'Inactive',
        role: 'Tester',
      },
      {
        id: 11,
        name: 'James Anderson',
        email: 'james@anderson.com',
        status: 'Inactive',
        role: 'Tester',
      },
    ],
  },
])
</script>

<template>
  <ListView
    class="h-[250px]"
    :columns="group_columns"
    :rows="grouped_rows"
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
  >
    <template #group-header="{ group }">
      <span class="text-base font-medium leading-6 text-ink-gray-9">
        {{ group.group }} ({{ group.rows.length }})
      </span>
    </template>
  </ListView>
</template>
