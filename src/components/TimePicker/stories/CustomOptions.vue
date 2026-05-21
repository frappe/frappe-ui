<script setup lang="ts">
import { ref } from 'vue'
import { TimePicker } from 'frappe-ui'

// A yoga studio offers only its scheduled class times — not free-form intervals
const classTime = ref('07:00')

const classOptions = [
  { value: '06:00', label: '6:00 AM — Sunrise Flow' },
  { value: '07:00', label: '7:00 AM — Vinyasa' },
  { value: '09:30', label: '9:30 AM — Gentle Hatha' },
  { value: '12:15', label: '12:15 PM — Lunch Power' },
  { value: '17:30', label: '5:30 PM — Restorative' },
  { value: '19:00', label: '7:00 PM — Candlelight Yin' },
]
</script>

<template>
  <div class="flex w-80 flex-col gap-1.5">
    <span class="text-sm text-ink-gray-7">Book a class</span>
    <TimePicker v-model="classTime" :options="classOptions">
      <template #prefix>
        <span class="lucide-dumbbell size-4 text-ink-gray-5" />
      </template>
    </TimePicker>
  </div>
</template>
