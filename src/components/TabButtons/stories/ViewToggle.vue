<script setup>
import { ref } from 'vue'
import { TabButtons } from 'frappe-ui'

const view = ref('list')

const views = [
  { label: 'List view', value: 'list', icon: 'lucide-list' },
  { label: 'Calendar view', value: 'calendar', icon: 'lucide-calendar' },
]
</script>

<template>
  <div class="flex w-full items-center justify-between gap-4">
    <div>
      <h3 class="text-lg font-semibold text-ink-gray-9">Holidays</h3>
      <p class="mt-1 text-base text-ink-gray-6">
        Add holidays here to make sure they're excluded from SLA calculations
      </p>
    </div>
    <TabButtons v-model="view" :options="views" />
  </div>
</template>
