<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  Button,
  SettingsBody,
  SettingsHeader,
  SettingsPanel,
  TextInput,
} from 'frappe-ui'

// Demonstrates the fixed header: the title, search box and column header stay
// pinned while the (long) member list scrolls underneath.
const search = ref('')
const members = Array.from({ length: 30 }, (_, i) => ({
  name: `Teammate ${i + 1}`,
  email: `teammate${i + 1}@example.com`,
  role: i === 0 ? 'Admin' : 'Member',
}))
const filtered = computed(() =>
  members.filter((m) =>
    m.name.toLowerCase().includes(search.value.toLowerCase()),
  ),
)
</script>

<template>
  <SettingsPanel>
    <SettingsHeader>
      <div class="flex flex-col gap-4">
        <div class="flex items-center justify-between gap-3">
          <h2 class="text-lg font-semibold text-ink-gray-8">Members</h2>
          <Button variant="solid" icon-left="lucide-plus">Invite</Button>
        </div>
        <TextInput v-model="search" placeholder="Search members">
          <template #prefix>
            <span class="lucide-search size-4 text-ink-gray-4" />
          </template>
        </TextInput>
        <div
          class="grid h-8 grid-cols-[1fr_8rem] items-center border-b text-sm text-ink-gray-5"
        >
          <div>Member</div>
          <div>Role</div>
        </div>
      </div>
    </SettingsHeader>
    <SettingsBody>
      <div class="divide-y divide-outline-gray-1">
        <div
          v-for="member in filtered"
          :key="member.email"
          class="grid grid-cols-[1fr_8rem] items-center py-2.5"
        >
          <div class="min-w-0">
            <div class="truncate text-base text-ink-gray-8">
              {{ member.name }}
            </div>
            <div class="truncate text-sm text-ink-gray-5">
              {{ member.email }}
            </div>
          </div>
          <div class="text-base text-ink-gray-6">{{ member.role }}</div>
        </div>
      </div>
    </SettingsBody>
  </SettingsPanel>
</template>
