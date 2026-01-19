<script setup lang="ts">
import { h, ref } from 'vue'
import { Combobox } from 'frappe-ui'
import LucideSettings from '~icons/lucide/settings'

const value = ref('')

const options = [
  { label: 'John Doe', value: 'john-doe' },
  { label: 'Jane Doe', value: 'jane-doe' },
  { label: 'John Smith', value: 'john-smith' },
  {
    type: 'custom',
    key: 'help',
    render: () => [
      h(LucideSettings, { class: 'size-4' }),
      h('span', { class: 'ml-2 font-medium' }, 'Need Help?'),
    ],
    onClick: () => alert('Help clicked'),
  },
]
</script>

<template>
  <Combobox v-model="value" :options="options" placeholder="Search…" />
</template>
