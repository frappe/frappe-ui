<script setup lang="ts">
import { ref } from 'vue'
import { TimePicker } from 'frappe-ui'

const value = ref('14:30')
</script>

<template>
  <div class="flex w-72 flex-col gap-6 items-start">
    <div class="flex w-full flex-col gap-4 items-start">
      <span class="text-sm text-ink-gray-7">Sizes</span>
      <TimePicker v-model="value" size="sm" />
      <TimePicker v-model="value" size="md" />
      <TimePicker v-model="value" size="lg" />
      <TimePicker v-model="value" size="xl" />
    </div>
    <div class="flex w-full flex-col gap-4 items-start">
      <span class="text-sm text-ink-gray-7">Variants</span>
      <TimePicker v-model="value" variant="subtle" />
      <TimePicker v-model="value" variant="outline" />
    </div>
  </div>
</template>
