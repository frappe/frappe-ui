<script setup lang="ts">
import { ref } from 'vue'
import { TimePicker } from 'frappe-ui'
import LucideSunrise from '~icons/lucide/sunrise'
import LucideSunset from '~icons/lucide/sunset'

// Shift scheduling — limit each picker to business hours.
const shiftStart = ref('09:00')
const shiftEnd = ref('17:00')
</script>

<template>
  <div class="flex w-full max-w-md flex-col gap-3">
    <span class="text-sm font-medium text-ink-gray-7">Shift hours</span>
    <div class="grid grid-cols-2 gap-3">
      <div class="flex flex-col gap-1.5">
        <span class="text-xs text-ink-gray-6">From</span>
        <TimePicker
          v-model="shiftStart"
          min="06:00"
          :max="shiftEnd"
          :interval="15"
        >
          <template #prefix>
            <LucideSunrise class="size-4 text-ink-gray-5" />
          </template>
        </TimePicker>
      </div>
      <div class="flex flex-col gap-1.5">
        <span class="text-xs text-ink-gray-6">To</span>
        <TimePicker
          v-model="shiftEnd"
          :min="shiftStart"
          max="22:00"
          :interval="15"
        >
          <template #prefix>
            <LucideSunset class="size-4 text-ink-gray-5" />
          </template>
        </TimePicker>
      </div>
    </div>
    <span class="text-xs text-ink-gray-5">
      Working {{ shiftStart }} – {{ shiftEnd }}
    </span>
  </div>
</template>
