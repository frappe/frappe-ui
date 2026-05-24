<script setup>
import { ref } from 'vue'
import { TabButtons } from 'frappe-ui'

const inboxTab = ref('comments')
const viewTab = ref('list')

const inboxButtons = [
  { label: 'Inbox', value: 'inbox' },
  { label: 'Comments', value: 'comments' },
]

const inboxIcons = {
  inbox: 'lucide-inbox',
  comments: 'lucide-message-square',
}

const inboxCounts = {
  inbox: 8,
  comments: 14,
}

const viewButtons = [
  { label: 'List', value: 'list', icon: 'lucide-list' },
  { label: 'Board', value: 'board', icon: 'lucide-columns-3' },
  { label: 'Calendar', value: 'calendar', icon: 'lucide-calendar' },
]
</script>

<template>
  <div class="flex flex-col gap-6 p-2">
    <TabButtons v-model="inboxTab" :options="inboxButtons" size="md">
      <template #prefix="{ button }">
        <span :class="inboxIcons[button.modelValue]" class="size-4 shrink-0" />
      </template>
      <template #suffix="{ button }">
        <span
          class="rounded-full bg-surface-gray-2 px-1.5 text-xs text-ink-gray-7"
        >
          {{ inboxCounts[button.modelValue] }}
        </span>
      </template>
    </TabButtons>

    <TabButtons
      v-model="inboxTab"
      :options="inboxButtons"
      type="underline"
      size="md"
    >
      <template #prefix="{ button }">
        <span :class="inboxIcons[button.modelValue]" class="size-4 shrink-0" />
      </template>
      <template #suffix="{ button }">
        <span
          class="rounded-full bg-surface-gray-2 px-1.5 text-xs text-ink-gray-7"
        >
          {{ inboxCounts[button.modelValue] }}
        </span>
      </template>
    </TabButtons>

    <TabButtons v-model="viewTab" :options="viewButtons" />
  </div>
</template>
