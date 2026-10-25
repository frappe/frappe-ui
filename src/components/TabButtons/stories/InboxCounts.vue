<script setup>
import { ref } from 'vue'
import { TabButtons } from 'frappe-ui'

const tab = ref('unread')

const tabs = [
  { label: 'Unread', value: 'unread' },
  { label: 'Mentions', value: 'mentions' },
  { label: 'All', value: 'all' },
]

const icons = {
  unread: 'lucide-mail',
  mentions: 'lucide-at-sign',
  all: 'lucide-inbox',
}

const counts = { unread: 8, mentions: 3, all: 124 }
</script>

<template>
  <div class="flex w-full max-w-lg items-center justify-between gap-4">
    <h3 class="text-lg font-semibold text-ink-gray-9">Notifications</h3>
    <TabButtons v-model="tab" :options="tabs">
      <template #prefix="{ button }">
        <span
          :class="icons[button.value]"
          class="size-4 shrink-0"
          aria-hidden="true"
        />
      </template>
      <template #suffix="{ button, active }">
        <span
          class="rounded-full px-1.5 text-xs"
          :class="
            active
              ? 'bg-surface-gray-3 text-ink-gray-8'
              : 'bg-surface-gray-2 text-ink-gray-6'
          "
        >
          {{ counts[button.value] }}
        </span>
      </template>
    </TabButtons>
  </div>
</template>
