<script setup>
import { ref } from 'vue'
import { TabButtons } from 'frappe-ui'

const subtle = ref('two')
const underline = ref('two')
const browserLeft = ref('two')
const browserRight = ref('two')

const buttons = [
  { label: 'Tab', value: 'one' },
  { label: 'Tab', value: 'two' },
  { label: 'Tab', value: 'three' },
  { label: 'Tab', value: 'four' },
]
</script>

<template>
  <div class="flex items-start gap-10 p-2">
    <div class="flex flex-col gap-3">
      <div class="text-sm text-ink-gray-6">Subtle</div>
      <TabButtons v-model="subtle" :options="buttons" vertical />
    </div>

    <div class="flex flex-col gap-3">
      <div class="text-sm text-ink-gray-6">Underline</div>
      <TabButtons
        v-model="underline"
        :options="buttons"
        type="underline"
        vertical
      />
    </div>

    <div class="flex flex-col gap-3">
      <div class="text-sm text-ink-gray-6">Browser left</div>
      <TabButtons
        v-model="browserLeft"
        :options="buttons"
        type="browser-tab"
        vertical
        direction="left"
      />
    </div>

    <div class="flex flex-col gap-3">
      <div class="text-sm text-ink-gray-6">Browser right</div>
      <TabButtons
        v-model="browserRight"
        :options="buttons"
        type="browser-tab"
        vertical
        direction="right"
      />
    </div>
  </div>
</template>
