<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  Avatar,
  Badge,
  Button,
  SettingsBody,
  SettingsHeader,
  TextInput,
} from 'frappe-ui'

// Demonstrates the fixed header: the title, search box and column header stay
// pinned while the (long) user list scrolls underneath.
const names = [
  'Alex Rivera',
  'Priya Nair',
  'Sam Okafor',
  'Mei Chen',
  'Diego Santos',
  'Lena Fischer',
]
const search = ref('')
const users = Array.from({ length: 28 }, (_, i) => {
  const name = names[i % names.length]
  return {
    name,
    email: `${name.split(' ')[0].toLowerCase()}${i + 1}@example.com`,
    role: i === 0 ? 'Admin' : 'Member',
  }
})
const filtered = computed(() =>
  users.filter((u) =>
    u.name.toLowerCase().includes(search.value.toLowerCase()),
  ),
)
</script>

<template>
  <SettingsHeader>
    <div class="flex flex-col gap-4">
      <div class="flex items-center justify-between gap-3">
        <h2 class="text-lg font-semibold text-ink-gray-8">Users</h2>
        <Button variant="solid" icon-left="lucide-plus">Invite</Button>
      </div>
      <TextInput v-model="search" placeholder="Search by name or email">
        <template #prefix>
          <span class="lucide-search size-4 text-ink-gray-4" />
        </template>
      </TextInput>
      <div
        class="grid h-8 grid-cols-[1fr_8rem] items-center border-b text-sm text-ink-gray-5"
      >
        <div>User</div>
        <div>Role</div>
      </div>
    </div>
  </SettingsHeader>
  <SettingsBody>
    <div class="divide-y divide-outline-gray-1">
      <div
        v-for="user in filtered"
        :key="user.email"
        class="grid grid-cols-[1fr_8rem] items-center py-2.5"
      >
        <div class="flex min-w-0 items-center gap-3">
          <Avatar size="lg" :label="user.name" />
          <div class="min-w-0">
            <div class="truncate text-base text-ink-gray-8">
              {{ user.name }}
            </div>
            <div class="truncate text-sm text-ink-gray-5">{{ user.email }}</div>
          </div>
        </div>
        <Badge
          theme="gray"
          :variant="user.role === 'Admin' ? 'solid' : 'subtle'"
        >
          {{ user.role }}
        </Badge>
      </div>
    </div>
  </SettingsBody>
</template>
