<script setup lang="ts">
import { ref } from 'vue'
import { ItemListRow } from 'frappe-ui'

const statuses = [
  { value: 'backlog', label: 'Backlog', dot: 'bg-surface-gray-5' },
  { value: 'todo', label: 'Todo', dot: 'bg-surface-blue-5' },
  { value: 'in-progress', label: 'In progress', dot: 'bg-surface-amber-5' },
  { value: 'done', label: 'Done', dot: 'bg-surface-green-5' },
  {
    value: 'archived',
    label: 'Archived',
    dot: 'bg-surface-gray-3',
    disabled: true,
  },
]

const selected = ref('todo')
const hovered = ref<string | null>(null)
</script>

<template>
  <div
    role="listbox"
    aria-label="Status"
    class="w-56 rounded-6 bg-surface-elevation-2 p-1.5 shadow-2xl"
    @mouseleave="hovered = null"
  >
    <ItemListRow
      v-for="status in statuses"
      :key="status.value"
      as="button"
      type="button"
      class="text-left"
      role="option"
      :aria-selected="selected === status.value"
      :disabled="status.disabled"
      :active="hovered === status.value"
      :selected="selected === status.value"
      :aria-disabled="status.disabled || undefined"
      @mouseenter="hovered = status.disabled ? null : status.value"
      @click="!status.disabled && (selected = status.value)"
    >
      <template #prefix>
        <span class="size-2 rounded-full" :class="status.dot" />
      </template>
      {{ status.label }}
      <template #suffix>
        <span
          v-if="selected === status.value"
          class="lucide-check size-4 text-ink-gray-6"
          aria-hidden="true"
        />
        <span v-else-if="status.disabled" class="text-xs text-ink-gray-4">
          Admins only
        </span>
      </template>
    </ItemListRow>
  </div>
</template>
