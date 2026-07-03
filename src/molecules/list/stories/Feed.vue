<script setup lang="ts">
import { ref } from 'vue'
import { Avatar, Badge, Button } from 'frappe-ui'
import { List, ListRow, ListCell } from 'frappe-ui/list'

const discussions = [
  {
    name: '1',
    title: 'Weekly sync notes',
    author: 'Rosa Diaz',
    comment: 'Sounds good, let us ship it on Monday',
    time: '2 h',
    comments: 4,
    unread: true,
  },
  {
    name: '2',
    title: 'Redesigning the onboarding flow',
    author: 'Jake Peralta',
    comment: 'I added the new mockups to the page',
    time: '5 h',
    comments: 12,
    unread: false,
  },
  {
    name: '3',
    title: 'Q3 hiring plan',
    author: 'Amy Santiago',
    comment: 'Two backend roles and one designer',
    time: '1 d',
    comments: 7,
    unread: true,
  },
  {
    name: '4',
    title: 'Incident review: search downtime',
    author: 'Terry Jeffords',
    comment: 'Root cause was the index rebuild',
    time: '2 d',
    comments: 9,
    unread: false,
  },
  {
    name: '5',
    title: 'Docs sprint retrospective',
    author: 'Raymond Holt',
    comment: 'Velocity was acceptable.',
    time: '4 d',
    comments: 3,
    unread: false,
  },
]

const selectable = ref(false)
const selection = ref<string[]>([])

function toggleSelectMode() {
  selectable.value = !selectable.value
  selection.value = []
}
</script>

<template>
  <div class="w-full">
    <div class="mb-2 flex h-7 items-center justify-end gap-3">
      <span v-if="selection.length" class="text-sm text-ink-gray-5">
        {{ selection.length }} selected
      </span>
      <Button @click="toggleSelectMode">
        {{ selectable ? 'Done' : 'Select' }}
      </Button>
    </div>
    <List :selectable="selectable" v-model:selection="selection" :row-height="60">
      <ListRow
        v-for="discussion in discussions"
        :key="discussion.name"
        :value="discussion.name"
        @click="() => {}"
      >
        <ListCell>
          <Avatar :label="discussion.author" size="2xl" />
        </ListCell>
        <ListCell>
          <div class="min-w-0">
            <div
              class="truncate text-base text-ink-gray-8"
              :class="discussion.unread && 'font-semibold'"
            >
              {{ discussion.title }}
            </div>
            <div class="mt-1 truncate text-base text-ink-gray-5">
              {{ discussion.author }}: {{ discussion.comment }}
            </div>
          </div>
        </ListCell>
        <ListCell class="justify-end">
          <div class="flex flex-col items-end gap-1">
            <span class="text-sm text-ink-gray-5">{{ discussion.time }}</span>
            <Badge>{{ discussion.comments }}</Badge>
          </div>
        </ListCell>
      </ListRow>
    </List>
  </div>
</template>
