<script setup lang="ts">
import { Avatar, HoverCard } from 'frappe-ui'

const people = [
  { name: 'Jane Cooper', email: 'jane@example.com', role: 'Designer' },
  { name: 'Wade Warren', email: 'wade@example.com', role: 'Engineer' },
  {
    name: 'Esther Howard',
    email: 'esther@example.com',
    role: 'Product manager',
  },
]
</script>

<template>
  <div class="flex items-center gap-1">
    <HoverCard
      v-for="person in people"
      :key="person.email"
      :hover-delay="100"
      :leave-delay="100"
    >
      <template #trigger>
        <button type="button" class="rounded-full" :aria-label="person.name">
          <Avatar
            :label="person.name"
            :image="`https://i.pravatar.cc/80?u=${person.email}`"
            size="md"
          />
        </button>
      </template>
      <template #default>
        <div class="flex w-60 items-center gap-3 p-3">
          <Avatar
            :label="person.name"
            :image="`https://i.pravatar.cc/80?u=${person.email}`"
            size="xl"
          />
          <div class="min-w-0">
            <p class="text-base-medium text-ink-gray-8">{{ person.name }}</p>
            <p class="mt-1 text-sm text-ink-gray-5">{{ person.role }}</p>
            <p class="mt-1 truncate text-sm text-ink-gray-5">
              {{ person.email }}
            </p>
          </div>
        </div>
      </template>
    </HoverCard>
  </div>
</template>
