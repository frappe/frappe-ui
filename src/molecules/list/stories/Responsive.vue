<script setup lang="ts">
import { Avatar } from 'frappe-ui'
import {
  List,
  ListRow,
  ListCell,
  ListHeader,
  ListHeaderCell,
  ListRows,
} from 'frappe-ui/list'

const members = [
  { name: 'Rosa Diaz', email: 'rosa@example.com', role: 'Admin', since: '2021-06' },
  { name: 'Jake Peralta', email: 'jake@example.com', role: 'Member', since: '2022-01' },
  { name: 'Amy Santiago', email: 'amy@example.com', role: 'Admin', since: '2020-11' },
  { name: 'Terry Jeffords', email: 'terry@example.com', role: 'Member', since: '2023-03' },
]
</script>

<template>
  <!-- Narrow: name and date only. From md: the role column joins, and the
       fixed tracks widen again at lg. Dropping a track never hides its cells
       on its own, so the Role header and cell carry `max-md:hidden` to match. -->
  <List
    class="w-full list-row-px-3"
    :columns="{
      base: ['minmax(0,1fr)', '6.5rem'],
      md: ['minmax(0,1fr)', '7rem', '6rem'],
      lg: ['minmax(0,2fr)', '9rem', '8rem'],
    }"
    :row-height="56"
  >
    <ListHeader>
      <ListHeaderCell>Member</ListHeaderCell>
      <ListHeaderCell class="max-md:hidden">Role</ListHeaderCell>
      <ListHeaderCell class="justify-end">Member since</ListHeaderCell>
    </ListHeader>
    <ListRows :items="members" v-slot="{ item: member, value }">
      <ListRow :value="value">
        <ListCell>
          <Avatar :label="member.name" size="xl" />
          <div class="ml-3 min-w-0">
            <div class="truncate text-base text-ink-gray-8">{{ member.name }}</div>
            <div class="mt-0.5 truncate text-sm text-ink-gray-5">{{ member.email }}</div>
          </div>
        </ListCell>
        <ListCell class="max-md:hidden">
          <span class="text-base text-ink-gray-7">{{ member.role }}</span>
        </ListCell>
        <ListCell class="justify-end">
          <span class="text-base text-ink-gray-6">{{ member.since }}</span>
        </ListCell>
      </ListRow>
    </ListRows>
  </List>
</template>
