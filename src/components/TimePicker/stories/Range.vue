<script setup lang="ts">
import { ref } from 'vue'
import { TimePicker } from 'frappe-ui'

// Shift scheduling: each picker is limited to business hours, and the end
// time's `min` is the start time, so no end-before-start check is needed.
const shiftStart = ref('09:00')
const shiftEnd = ref('17:00')
</script>

<template>
  <div class="flex w-full max-w-md flex-col gap-3">
    <div class="grid grid-cols-2 gap-3">
      <TimePicker
        v-model="shiftStart"
        label="Shift starts"
        min="06:00"
        :max="shiftEnd"
        :interval="15"
      >
        <template #prefix>
          <span
            class="lucide-sunrise size-4 text-ink-gray-5"
            aria-hidden="true"
          />
        </template>
      </TimePicker>
      <TimePicker
        v-model="shiftEnd"
        label="Shift ends"
        :min="shiftStart"
        max="22:00"
        :interval="15"
      >
        <template #prefix>
          <span
            class="lucide-sunset size-4 text-ink-gray-5"
            aria-hidden="true"
          />
        </template>
      </TimePicker>
    </div>
    <span class="text-xs text-ink-gray-5">
      Working {{ shiftStart }} to {{ shiftEnd }}
    </span>
  </div>
</template>
