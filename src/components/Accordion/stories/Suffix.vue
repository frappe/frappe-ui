<script setup lang="ts">
import { Accordion, Badge } from 'frappe-ui'

const items = [
  { value: 'inbox', title: 'Inbox', content: 'Messages waiting for a reply.' },
  {
    value: 'drafts',
    title: 'Drafts',
    content: 'Unsent messages saved for later.',
  },
  {
    value: 'spam',
    title: 'Spam',
    content: 'Filtered messages we think are junk.',
  },
]

// Aligned to `items` by index — the slot exposes `{ item, index }`.
const badges = [
  { label: '12', theme: 'blue' },
  { label: '3', theme: 'gray' },
  { label: 'New', theme: 'red' },
] as const
</script>

<template>
  <div class="w-full max-w-lg">
    <Accordion :items="items" default-value="inbox">
      <template #item-suffix="{ index }">
        <Badge
          :label="badges[index].label"
          :theme="badges[index].theme"
          variant="subtle"
        />
      </template>
    </Accordion>
  </div>
</template>
