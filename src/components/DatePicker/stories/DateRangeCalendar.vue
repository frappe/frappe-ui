<script setup lang="ts">
import { ref } from 'vue'
import DateRangeCalendar from '../DateRangeCalendar.vue'
import type { DateRangeValue } from 'frappe-ui'
import { dayjs } from '../../../utils/dayjs'

const stay = ref<DateRangeValue>([
  dayjs().format('YYYY-MM-DD'),
  dayjs().add(4, 'day').format('YYYY-MM-DD'),
])
const today = dayjs().format('YYYY-MM-DD')
const inSixtyDays = dayjs().add(60, 'day').format('YYYY-MM-DD')
</script>

<template>
  <div class="flex w-full flex-col items-center gap-3 py-10">
    <DateRangeCalendar
      v-model="stay"
      :min="today"
      :max="inSixtyDays"
      dual-pane
    />
    <span class="text-p-sm text-ink-gray-6">
      {{ stay[0] ? `${stay[0]} to ${stay[1] || '…'}` : 'No range selected' }}
    </span>
  </div>
</template>
