<script setup lang="ts">
import { Spinner } from 'frappe-ui'

const tasks = [
  'Update onboarding copy',
  'Fix invoice rounding',
  'Review Q3 roadmap',
]
</script>

<template>
  <div
    class="w-80 divide-y divide-outline-gray-1 rounded-6 border border-outline-gray-1"
  >
    <div
      v-for="task in tasks"
      :key="task"
      class="px-3 py-2.5 text-base text-ink-gray-8"
    >
      {{ task }}
    </div>
    <div class="flex justify-center py-3">
      <Spinner size="md" theme="gray" />
    </div>
  </div>
</template>
