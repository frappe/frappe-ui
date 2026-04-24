<script setup lang="ts">
import { ref } from 'vue'
import { Combobox } from 'frappe-ui'

type Space = { label: string; value: string; accent: string }

const value = ref<string>('platform-infra')

const spaces: { group: string; options: Space[] }[] = [
  {
    group: 'Engineering',
    options: [
      { label: 'Platform Infra', value: 'platform-infra', accent: 'bg-blue-500' },
      { label: 'Mobile 2.0', value: 'mobile-2', accent: 'bg-red-500' },
      { label: 'Growth', value: 'growth', accent: 'bg-amber-500' },
    ],
  },
  {
    group: 'Product',
    options: [
      { label: 'Discovery', value: 'discovery', accent: 'bg-cyan-500' },
      { label: 'Roadmap', value: 'roadmap', accent: 'bg-green-500' },
      { label: 'Feedback', value: 'feedback', accent: 'bg-violet-500' },
    ],
  },
  {
    group: 'Design',
    options: [
      { label: 'System', value: 'system', accent: 'bg-teal-500' },
      { label: 'Research', value: 'research', accent: 'bg-pink-500' },
      { label: 'Brand', value: 'brand', accent: 'bg-orange-500' },
    ],
  },
]
</script>

<template>
  <Combobox
    v-model="value"
    :options="spaces"
    placeholder="Move to space…"
    class="w-72"
  >
    <template #item-prefix="{ item }">
      <div
        :class="['size-2.5 rounded-[3px]', (item as Space).accent]"
        aria-hidden="true"
      />
    </template>
  </Combobox>
</template>
