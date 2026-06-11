<script setup>
import { ref } from 'vue'
import { TabButtons } from 'frappe-ui'

const buttons = [
  { label: 'Home', value: 'home', iconLeft: 'lucide-home' },
  { label: 'Task', value: 'task', iconLeft: 'lucide-list-checks' },
  { label: 'Contact', value: 'contact', iconLeft: 'lucide-contact' },
  { label: 'Others', value: 'others', iconLeft: 'lucide-globe' },
]

const subtle = ref('task')
const ghost = ref('task')
const underline = ref('task')
const browserTab = ref('task')
</script>

<template>
  <div class="flex flex-col gap-6 p-2">
    <div class="flex items-center gap-6">
      <div class="w-24 text-sm text-ink-gray-6">Subtle</div>
      <TabButtons v-model="subtle" :options="buttons" type="subtle" />
    </div>

    <div class="flex items-center gap-6">
      <div class="w-24 text-sm text-ink-gray-6">Ghost</div>
      <TabButtons v-model="ghost" :options="buttons" type="ghost" />
    </div>

    <div class="flex items-center gap-6">
      <div class="w-24 text-sm text-ink-gray-6">Underline</div>
      <TabButtons v-model="underline" :options="buttons" type="underline" />
    </div>

    <div class="flex items-center gap-6">
      <div class="w-24 text-sm text-ink-gray-6">Browser tab</div>
      <TabButtons v-model="browserTab" :options="buttons" type="browser-tab" />
    </div>
  </div>
</template>
