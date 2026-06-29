<script setup lang="ts">
import { ref } from 'vue'
import { Accordion, Button } from 'frappe-ui'

// "Controlled" means the parent owns the open state via v-model — the
// Accordion reflects `open`, and external controls can drive it too.
const items = [
  {
    value: 'overview',
    title: 'Overview',
    content: 'A short summary of the project.',
  },
  {
    value: 'specs',
    title: 'Specs',
    content: 'Detailed technical specifications.',
  },
  {
    value: 'pricing',
    title: 'Pricing',
    content: 'Plans, limits, and billing details.',
  },
]

const open = ref<string[]>(['overview'])

function expandAll() {
  open.value = items.map((item) => item.value)
}

function collapseAll() {
  open.value = []
}
</script>

<template>
  <div class="w-full max-w-lg space-y-3">
    <div class="flex items-center gap-2">
      <Button label="Expand all" @click="expandAll" />
      <Button label="Collapse all" @click="collapseAll" />
      <span class="ml-auto text-p-sm text-ink-gray-5">
        Open: {{ open.length ? open.join(', ') : 'none' }}
      </span>
    </div>
    <Accordion type="multiple" v-model="open" :items="items" />
  </div>
</template>
