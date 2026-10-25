<script setup lang="ts">
import { ref } from 'vue'
import { Duration } from 'frappe-ui'

// Service targets for a support team. `format="long"` spells the saved value
// out in words, which reads better in a settings form than `4h`.
const firstResponse = ref<number | null>(4 * 3600)
const resolution = ref<number | null>(24 * 3600)
</script>

<template>
  <div class="flex w-full max-w-md flex-col divide-y divide-outline-gray-1">
    <div class="flex items-center justify-between gap-6 py-3">
      <div class="flex flex-col gap-0.5">
        <span class="text-base font-medium text-ink-gray-8"
          >First response</span
        >
        <span class="text-p-sm text-ink-gray-5"
          >Reply to a new ticket within</span
        >
      </div>
      <Duration v-model="firstResponse" format="long" class="w-44" />
    </div>
    <div class="flex items-center justify-between gap-6 py-3">
      <div class="flex flex-col gap-0.5">
        <span class="text-base font-medium text-ink-gray-8">Resolution</span>
        <span class="text-p-sm text-ink-gray-5">Close the ticket within</span>
      </div>
      <Duration v-model="resolution" format="long" class="w-44" />
    </div>
  </div>
</template>
