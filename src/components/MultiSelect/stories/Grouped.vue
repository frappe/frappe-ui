<script setup lang="ts">
import { ref } from 'vue'
import { MultiSelect } from 'frappe-ui'

const state = ref<string[]>(['platform-infra'])

const options = [
  {
    group: 'Engineering',
    options: [
      { label: 'Platform Infra', value: 'platform-infra' },
      { label: 'Mobile 2.0', value: 'mobile-2' },
      { label: 'Growth', value: 'growth' },
    ],
  },
  {
    group: 'Product',
    options: [
      { label: 'Discovery', value: 'discovery' },
      { label: 'Roadmap', value: 'roadmap' },
      { label: 'Feedback', value: 'feedback' },
    ],
  },
  {
    group: 'Design',
    options: [
      { label: 'System', value: 'system' },
      { label: 'Research', value: 'research' },
      { label: 'Brand', value: 'brand' },
    ],
  },
]
</script>

<template>
  <MultiSelect
    v-model="state"
    :options="options"
    placeholder="Select spaces"
    class="w-72"
  />
</template>
