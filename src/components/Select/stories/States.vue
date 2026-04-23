<script setup lang="ts">
import { ref } from 'vue'
import { Select } from 'frappe-ui'

const sortOrder = ref('')

const sortOptions = [
  {
    label: 'Sort by',
    value: '',
    disabled: true,
  },
  {
    label: 'Newest first',
    value: 'newest',
  },
  {
    label: 'Oldest first',
    value: 'oldest',
  },
  {
    label: 'Most popular',
    value: 'popular',
  },
]
</script>

<template>
  <div class="w-full max-w-md py-4">
    <div class="text-sm font-medium text-ink-gray-7">Disabled label option</div>
    <div class="mt-1 text-p-sm text-ink-gray-5">
      Common sorting pattern where a disabled first option keeps an empty string
      value without breaking the select.
    </div>

    <div class="mt-4">
      <Select v-model="sortOrder" :options="sortOptions" variant="outline" />
    </div>

    <div class="mt-4 text-sm text-ink-gray-5">
      Value:
      <span class="text-ink-gray-8">
        {{ sortOrder === '' ? 'Empty string' : sortOrder }}
      </span>
    </div>
  </div>
</template>
