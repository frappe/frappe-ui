<script setup>
import { ref } from 'vue'
import { TabButtons } from 'frappe-ui'

const current = ref('list')
const currentMd = ref('list')

const buttons = [
  { label: 'List', value: 'list', iconLeft: 'lucide-list' },
  { label: 'Board', value: 'board', iconLeft: 'lucide-columns-3' },
  { label: 'Calendar', value: 'calendar', iconLeft: 'lucide-calendar' },
]
</script>

<template>
  <div class="flex flex-col gap-5 p-2">
    <div class="flex items-center gap-6">
      <div class="w-16 text-sm text-ink-gray-6">Small</div>
      <TabButtons v-model="current" :options="buttons" size="sm" />
    </div>
    <div class="flex items-center gap-6">
      <div class="w-16 text-sm text-ink-gray-6">Medium</div>
      <TabButtons v-model="currentMd" :options="buttons" size="md" />
    </div>
  </div>
</template>
