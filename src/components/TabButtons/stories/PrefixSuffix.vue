<script setup>
import { ref } from 'vue'
import { TabButtons } from 'frappe-ui'

const current = ref('mentions')
const compact = ref('calendar')

const buttons = [
  { label: 'Inbox', value: 'inbox' },
  { label: 'Mentions', value: 'mentions' },
  { label: 'Done', value: 'done' },
]

const counts = {
  inbox: 8,
  mentions: 14,
  done: 2,
}

const icons = {
  inbox: 'lucide-inbox',
  mentions: 'lucide-at-sign',
  done: 'lucide-check-circle',
}

const iconButtons = [
  { label: 'Calendar', value: 'calendar', icon: 'lucide-calendar' },
  { label: 'List', value: 'list', icon: 'lucide-list' },
  { label: 'Grid', value: 'grid', icon: 'lucide-grid' },
]
</script>

<template>
  <div class="flex flex-col gap-6 p-2">
    <TabButtons v-model="current" :options="buttons" size="md">
      <template #prefix="{ button }">
        <span :class="icons[button.modelValue]" class="size-4 shrink-0" />
      </template>
      <template #suffix="{ button }">
        <span
          class="rounded-full bg-surface-gray-2 px-1.5 text-xs text-ink-gray-7"
        >
          {{ counts[button.modelValue] }}
        </span>
      </template>
    </TabButtons>
    <TabButtons v-model="current" :options="buttons" type="underline" size="md">
      <template #prefix="{ button }">
        <span :class="icons[button.modelValue]" class="size-4 shrink-0" />
      </template>
      <template #suffix="{ button }">
        <span
          class="rounded-full bg-surface-gray-2 px-1.5 text-xs text-ink-gray-7"
        >
          {{ counts[button.modelValue] }}
        </span>
      </template>
    </TabButtons>
    <TabButtons v-model="compact" :options="iconButtons" />
  </div>
</template>
