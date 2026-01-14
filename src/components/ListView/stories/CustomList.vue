<script setup>
import { reactive } from 'vue'
import LucideAtSign from '~icons/lucide/at-sign'
import LucideCheckCircle from '~icons/lucide/check-circle'
import LucideUsers from '~icons/lucide/users'
import LucideUser from '~icons/lucide/user'

import {
  Avatar,
  Badge,
  Button,
  ListHeader,
  ListHeaderItem,
  ListRow,
  ListRowItem,
  ListRows,
  ListSelectBanner,
  ListView,
} from 'frappe-ui'

const custom_columns = reactive([
  // { label: "Name", key: "name", width: 3, icon: "user" },
  // { label: "Email", key: "email", width: "200px", icon: "at-sign" },
  // { label: "Role", key: "role", icon: "users" },
  // { label: "Status", key: "status", icon: "check-circle" },
  { label: 'Name', key: 'name', width: 3, icon: LucideUser },
  { label: 'Email', key: 'email', width: '200px', icon: LucideAtSign },
  { label: 'Role', key: 'role', icon: LucideUsers },
  { label: 'Status', key: 'status', icon: LucideCheckCircle },
])

const custom_rows = [
  {
    id: 1,
    name: {
      label: 'John Doe',
      image: 'https://avatars.githubusercontent.com/u/499550',
    },
    email: 'john@doe.com',
    status: { label: 'Active', bg_color: 'bg-surface-green-3' },
    role: { label: 'Developer', color: 'green' },
  },
  {
    id: 2,
    name: {
      label: 'Jane Doe',
      image: 'https://avatars.githubusercontent.com/u/499120',
    },
    email: 'jane@doe.com',
    status: { label: 'Inactive', bg_color: 'bg-surface-red-5' },
    role: { label: 'HR', color: 'red' },
  },
]
</script>

<template>
  <ListView
    class="h-[150px]"
    :columns="custom_columns"
    :rows="custom_rows"
    :options="{
      onRowClick: (row) => console.log(row),
      selectable: true,
      showTooltip: true,
      resizeColumn: true,
    }"
    row-key="id"
  >
    <ListHeader>
      <ListHeaderItem
        v-for="column in custom_columns"
        :key="column.key"
        :item="column"
      >
        <template #prefix="{ item }">
          <component :is="item.icon" class="size-4" />
        </template>
      </ListHeaderItem>
    </ListHeader>
    <ListRows>
      <ListRow
        v-for="row in custom_rows"
        :key="row.id"
        v-slot="{ column, item }"
        :row="row"
      >
        <ListRowItem :item="item" :align="column.align">
          <template #prefix>
            <div
              v-if="column.key === 'status'"
              class="h-3 w-3 rounded-full"
              :class="item.bg_color"
            />
            <Avatar
              v-if="column.key === 'name'"
              shape="circle"
              :image="item.image"
              size="sm"
            />
          </template>
          <Badge
            v-if="column.key === 'role'"
            variant="subtle"
            :theme="item.color"
            size="md"
            :label="item.label"
          />
        </ListRowItem>
      </ListRow>
    </ListRows>
    <ListSelectBanner>
      <template #actions="{ unselectAll }">
        <div class="flex gap-2">
          <Button variant="ghost" label="Delete" />
          <Button variant="ghost" label="Unselect all" @click="unselectAll" />
        </div>
      </template>
    </ListSelectBanner>
  </ListView>
</template>
