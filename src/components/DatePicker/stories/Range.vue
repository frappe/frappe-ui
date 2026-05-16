<script setup lang="ts">
import { ref } from 'vue'
import { DateRangePicker, Button } from 'frappe-ui'
import { dayjs } from '../../../utils/dayjs'
import type { Dayjs } from 'dayjs'
import LucidePalmtree from '~icons/lucide/palmtree'
import LucideHotel from '~icons/lucide/hotel'
import LucideChartLine from '~icons/lucide/chart-line'
import LucideTimerReset from '~icons/lucide/timer-reset'

const today = dayjs().format('YYYY-MM-DD')
const oneYearOut = dayjs().add(1, 'year').format('YYYY-MM-DD')

// 1. PTO request — quick presets feel native to HR tools
const timeOff = ref<string[]>([])

// 2. Hotel booking — dual pane, check-in must be today or later
const stay = ref<string[]>([])

// 3. Analytics filter — preset-driven, displays compact format
const analyticsRange = ref<string[]>([
  dayjs().subtract(29, 'day').format('YYYY-MM-DD'),
  dayjs().format('YYYY-MM-DD'),
])

type SetDate = (d: Dayjs) => void

function setLastNDays(days: number, setDate: SetDate) {
  const end = dayjs()
  setDate(end.subtract(days - 1, 'day'))
  setDate(end)
}

function setLongWeekend(setDate: SetDate) {
  const fri = upcomingDay(5)
  setDate(fri)
  setDate(fri.add(2, 'day'))
}

function setWorkWeek(setDate: SetDate) {
  const mon = upcomingDay(1)
  setDate(mon)
  setDate(mon.add(4, 'day'))
}

function upcomingDay(weekday: number) {
  const t = dayjs()
  const diff = (weekday - t.day() + 7) % 7 || 7
  return t.add(diff, 'day')
}

// 4. Project sprint — weekdays only, span limited to ~2 weeks via maxDate
const sprint = ref<string[]>([])
const sprintEnd = dayjs().add(60, 'day').format('YYYY-MM-DD')
function isWeekend(date: Dayjs) {
  const d = date.day()
  return d === 0 || d === 6
}
</script>

<template>
  <div class="grid w-full max-w-3xl grid-cols-1 gap-6">
    <!-- 1. PTO request -->
    <DateRangePicker
      v-model="timeOff"
      label="Time off"
      placeholder="Pick your dates"
      :min-date="today"
    >
      <template #prefix>
        <LucidePalmtree class="size-4 text-ink-gray-5" />
      </template>
      <template #actions="{ setDate }">
        <Button
          size="sm"
          label="Long weekend"
          @click="setLongWeekend(setDate)"
        />
        <Button
          size="sm"
          label="Next week"
          @click="setWorkWeek(setDate)"
        />
      </template>
    </DateRangePicker>

    <!-- 2. Hotel booking — dual pane shines for >1 month stays -->
    <DateRangePicker
      v-model="stay"
      label="Check-in / Check-out"
      placeholder="Select your stay"
      dual-pane
      :min-date="today"
      :max-date="oneYearOut"
    >
      <template #prefix>
        <LucideHotel class="size-4 text-ink-gray-5" />
      </template>
    </DateRangePicker>

    <!-- 3. Analytics date range filter -->
    <DateRangePicker
      v-model="analyticsRange"
      label="Report range"
      description="Defaults to the last 30 days."
      format="MMM D"
      :max-date="today"
    >
      <template #prefix>
        <LucideChartLine class="size-4 text-ink-gray-5" />
      </template>
      <template #actions="{ setDate }">
        <Button size="sm" label="7d" @click="setLastNDays(7, setDate)" />
        <Button size="sm" label="30d" @click="setLastNDays(30, setDate)" />
        <Button size="sm" label="90d" @click="setLastNDays(90, setDate)" />
      </template>
    </DateRangePicker>

    <!-- 4. Sprint window — weekdays only -->
    <DateRangePicker
      v-model="sprint"
      label="Sprint window"
      description="Pick start and end. Weekends are skipped."
      :min-date="today"
      :max-date="sprintEnd"
      :is-date-unavailable="isWeekend"
    >
      <template #prefix>
        <LucideTimerReset class="size-4 text-ink-gray-5" />
      </template>
    </DateRangePicker>
  </div>
</template>
