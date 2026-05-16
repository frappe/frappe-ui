<script setup lang="ts">
import { ref } from 'vue'
import { TimePicker } from 'frappe-ui'
import LucideClock from '~icons/lucide/clock'

// "When should we sync?" — typical meeting scheduler time slot
const meetingTime = ref('14:30')
</script>

<template>
  <div class="flex w-72 flex-col gap-1.5">
    <span class="text-sm text-ink-gray-7">Meeting time</span>
    <TimePicker
      v-model="meetingTime"
      placeholder="Pick a time"
      side="bottom"
      align="start"
    >
      <template #prefix>
        <LucideClock class="size-4 text-ink-gray-5" />
      </template>
    </TimePicker>
    <span class="text-xs text-ink-gray-5">
      Selected: {{ meetingTime || '—' }}
    </span>
  </div>
</template>
