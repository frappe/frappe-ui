<script setup lang="ts">
import { computed, ref } from 'vue'
import { Avatar, Divider } from 'frappe-ui'

type Comment = { name: string; email: string; text: string; time: string }

const older: Comment[] = [
  {
    name: 'Priya Shah',
    email: 'priya@example.com',
    text: 'Can we move the launch to Thursday?',
    time: '3 days ago',
  },
  {
    name: 'Tom Baker',
    email: 'tom@example.com',
    text: 'Thursday works for the design team.',
    time: '2 days ago',
  },
]

const recent: Comment[] = [
  {
    name: 'Jane Cooper',
    email: 'jane@example.com',
    text: 'Release notes are ready for review.',
    time: '1 hour ago',
  },
]

const showOlder = ref(false)

const olderAction = computed(() => ({
  label: `Show ${older.length} older comments`,
  onClick: () => {
    showOlder.value = true
  },
}))
</script>

<template>
  <div class="flex w-full max-w-md flex-col gap-4">
    <Divider v-if="!showOlder" :action="olderAction" />
    <div
      v-for="comment in showOlder ? [...older, ...recent] : recent"
      :key="comment.text"
      class="flex gap-3"
    >
      <Avatar
        :label="comment.name"
        :image="`https://i.pravatar.cc/80?u=${comment.email}`"
        size="md"
      />
      <div class="min-w-0">
        <div class="flex items-baseline gap-2">
          <span class="text-base-medium text-ink-gray-8">
            {{ comment.name }}
          </span>
          <span class="text-sm text-ink-gray-5">{{ comment.time }}</span>
        </div>
        <p class="mt-1 text-p-base text-ink-gray-7">{{ comment.text }}</p>
      </div>
    </div>
  </div>
</template>
