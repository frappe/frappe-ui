<script setup lang="ts">
import { computed, ref } from 'vue'
import { Avatar, Button } from 'frappe-ui'
import {
  List,
  ListRow,
  ListCell,
  ListHeader,
  ListHeaderCell,
  ListHeaderCellSort,
  ListRows,
} from 'frappe-ui/list'

const members = [
  { name: 'Rosa Diaz', email: 'rosa@example.com', role: 'Admin', since: '2021-06' },
  { name: 'Jake Peralta', email: 'jake@example.com', role: 'Member', since: '2022-01' },
  { name: 'Amy Santiago', email: 'amy@example.com', role: 'Admin', since: '2020-11' },
  { name: 'Terry Jeffords', email: 'terry@example.com', role: 'Member', since: '2023-03' },
  { name: 'Raymond Holt', email: 'holt@example.com', role: 'Guest', since: '2024-08' },
]

// Sort state, toggle rules, comparator, and direction icons are all app
// code — the header cells only render the chrome for whatever `direction`
// you hand them.
type Field = 'name' | 'role' | 'since'

function sortIcon(direction: 'asc' | 'desc' | null) {
  if (!direction) return 'lucide-arrow-up-down'
  return direction === 'asc' ? 'lucide-arrow-up' : 'lucide-arrow-down'
}
const sortField = ref<Field>('name')
const sortDirection = ref<'asc' | 'desc'>('asc')

function toggleSort(field: Field, firstDirection: 'asc' | 'desc' = 'asc') {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortDirection.value = firstDirection
  }
}

function directionFor(field: Field) {
  return sortField.value === field ? sortDirection.value : null
}

const sortedMembers = computed(() => {
  const factor = sortDirection.value === 'desc' ? -1 : 1
  return [...members].sort(
    (a, b) => factor * a[sortField.value].localeCompare(b[sortField.value]),
  )
})
</script>

<template>
  <List class="w-full" :columns="['minmax(0,1fr)', '7rem', '8rem', '3rem']" :row-height="56">
    <ListHeader>
      <ListHeaderCellSort :direction="directionFor('name')" @click="toggleSort('name')">
        Member
        <template #suffix="{ direction }">
          <span class="block size-3.5" :class="sortIcon(direction)" />
        </template>
      </ListHeaderCellSort>
      <ListHeaderCellSort :direction="directionFor('role')" @click="toggleSort('role')">
        Role
        <template #suffix="{ direction }">
          <span class="block size-3.5" :class="sortIcon(direction)" />
        </template>
      </ListHeaderCellSort>
      <ListHeaderCellSort
        :direction="directionFor('since')"
        class="justify-end"
        @click="toggleSort('since', 'desc')"
      >
        Member since
        <template #suffix="{ direction }">
          <span class="block size-3.5" :class="sortIcon(direction)" />
        </template>
      </ListHeaderCellSort>
      <ListHeaderCell />
    </ListHeader>
    <ListRows :items="sortedMembers" v-slot="{ item: member }">
      <ListRow>
        <ListCell>
          <Avatar :label="member.name" size="xl" />
          <div class="ml-3 min-w-0">
            <div class="truncate text-base text-ink-gray-8">{{ member.name }}</div>
            <div class="mt-0.5 truncate text-sm text-ink-gray-5">{{ member.email }}</div>
          </div>
        </ListCell>
        <ListCell>
          <span class="text-base text-ink-gray-7">{{ member.role }}</span>
        </ListCell>
        <ListCell class="justify-end">
          <span class="text-base text-ink-gray-6">{{ member.since }}</span>
        </ListCell>
        <ListCell class="justify-end">
          <Button variant="ghost" icon="lucide-trash-2" label="Remove member" />
        </ListCell>
      </ListRow>
    </ListRows>
  </List>
</template>
