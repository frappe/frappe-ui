<script setup lang="ts">
import { ref } from 'vue'
import DateCalendar from '../DateCalendar.vue'
import { dayjs } from '../../../utils/dayjs'

const shiftDate = ref(dayjs().format('YYYY-MM-DD'))
const today = dayjs().format('YYYY-MM-DD')
const inSixtyDays = dayjs().add(60, 'day').format('YYYY-MM-DD')
</script>

<template>
  <div class="flex w-full flex-col items-center gap-3 py-10">
    <DateCalendar v-model="shiftDate" :min="today" :max="inSixtyDays" />
    <span class="text-p-sm text-ink-gray-6">
      {{ shiftDate || 'No date selected' }}
    </span>
  </div>
</template>
