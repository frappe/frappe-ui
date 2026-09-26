<script setup lang="ts">
import { Avatar } from 'frappe-ui'

const avatarFor = (seed: string) => `https://i.pravatar.cc/80?u=${seed}`

// Sara has no photo, so her avatar falls back to her initial.
const comments = [
  {
    author: 'Jane Cooper',
    image: avatarFor('jane@example.com'),
    time: '2h',
    text: 'Pushed the new pricing table. Can someone check the mobile layout?',
  },
  {
    author: 'Sara Khan',
    image: '',
    theme: 'violet' as const,
    time: '1h',
    text: 'Looks good on my phone. The last column wraps a little early.',
  },
  {
    author: 'Rahul Mehta',
    image: avatarFor('rahul@example.com'),
    time: '12m',
    text: 'Fixed the wrap. Merging after lunch.',
  },
]
</script>

<template>
  <div class="flex w-full max-w-md flex-col gap-4">
    <div v-for="c in comments" :key="c.author" class="flex gap-2.5">
      <Avatar :image="c.image" :label="c.author" :theme="c.theme" size="lg" />
      <div class="flex flex-col gap-1">
        <div class="flex items-baseline gap-1.5">
          <span class="text-base font-medium text-ink-gray-9">{{
            c.author
          }}</span>
          <span class="text-sm text-ink-gray-5">{{ c.time }}</span>
        </div>
        <p class="text-p-base text-ink-gray-7">{{ c.text }}</p>
      </div>
    </div>
  </div>
</template>
