<script setup lang="ts">
import { Avatar } from 'frappe-ui'

const avatarFor = (seed: string) => `https://i.pravatar.cc/80?u=${seed}`

const people = {
  jane: { label: 'Jane Cooper', image: avatarFor('jane@example.com') },
  rahul: { label: 'Rahul Mehta', image: avatarFor('rahul@example.com') },
  sara: { label: 'Sara Khan', image: '' },
  leo: { label: 'Leo Park', image: avatarFor('leo@example.com') },
  mia: { label: 'Mia Wong', image: avatarFor('mia@example.com') },
}

const tasks = [
  {
    title: 'Redesign the invoice page',
    assignees: [people.jane, people.rahul],
  },
  {
    title: 'Migrate reports to the new API',
    assignees: [people.sara, people.leo, people.mia, people.jane, people.rahul],
  },
  { title: 'Write release notes', assignees: [people.mia] },
]

const shown = 3

// A ring in the page color cuts each avatar out of the one under it.
const cutout = { boxShadow: '0 0 0 2px var(--surface-base)' }
</script>

<template>
  <div class="flex w-full max-w-md flex-col divide-y divide-outline-gray-1">
    <div
      v-for="task in tasks"
      :key="task.title"
      class="flex items-center gap-3 py-2.5"
    >
      <span class="lucide-circle size-4 text-ink-gray-4" aria-hidden="true" />
      <span class="flex-1 truncate text-base text-ink-gray-8">
        {{ task.title }}
      </span>
      <div class="flex -space-x-1.5">
        <Avatar
          v-for="person in task.assignees.slice(0, shown)"
          :key="person.label"
          :image="person.image"
          :label="person.label"
          size="lg"
          :style="cutout"
        />
        <span
          v-if="task.assignees.length > shown"
          class="grid size-7 place-items-center rounded-full bg-surface-gray-2 text-xs font-medium text-ink-gray-6"
          :style="cutout"
        >
          +{{ task.assignees.length - shown }}
        </span>
      </div>
    </div>
  </div>
</template>
