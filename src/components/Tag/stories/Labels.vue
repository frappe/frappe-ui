<script setup>
import { Tag } from 'frappe-ui'

const labels = [
  { label: 'Bug', theme: 'red' },
  { label: 'Design', theme: 'violet' },
  { label: 'Needs review', theme: 'amber' },
  { label: 'Shipped', theme: 'green' },
]
</script>

<template>
  <div class="flex flex-wrap items-center gap-1.5">
    <Tag
      v-for="item in labels"
      :key="item.label"
      :theme="item.theme"
      variant="outline"
      size="lg"
    >
      <template #prefix>
        <span class="rounded-full bg-current !size-1.5" aria-hidden="true" />
      </template>
      {{ item.label }}
    </Tag>
  </div>
</template>
