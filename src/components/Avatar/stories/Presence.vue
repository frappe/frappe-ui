<script setup lang="ts">
import { Avatar } from 'frappe-ui'

const avatarFor = (seed: string) => `https://i.pravatar.cc/80?u=${seed}`

const dot = {
  online: 'bg-surface-green-5',
  away: 'bg-surface-amber-5',
  offline: 'bg-surface-gray-4',
}

const members = [
  {
    name: 'Jane Cooper',
    status: 'online' as const,
    image: avatarFor('jane@example.com'),
  },
  {
    name: 'Rahul Mehta',
    status: 'away' as const,
    image: avatarFor('rahul@example.com'),
  },
  { name: 'Sara Khan', status: 'offline' as const, image: '' },
]
</script>

<template>
  <div class="flex w-60 flex-col gap-1">
    <div
      v-for="m in members"
      :key="m.name"
      class="flex items-center gap-2 rounded px-2 py-1.5 hover:bg-surface-gray-2"
    >
      <Avatar :image="m.image" :label="m.name" size="lg">
        <template #indicator>
          <span class="block size-full rounded-full" :class="dot[m.status]" />
        </template>
      </Avatar>
      <span class="flex-1 text-base text-ink-gray-8">{{ m.name }}</span>
      <span class="text-sm capitalize text-ink-gray-5">{{ m.status }}</span>
    </div>
  </div>
</template>
