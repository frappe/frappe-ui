<script setup lang="ts">
import { ref } from 'vue'
import {
  DatePicker,
  DateRangePicker,
  Select,
  type DateRangeValue,
} from 'frappe-ui'

// Card 1, from HRMS's leave form: two separate date fields let the end land
// before the start, and HRMS needs extra code to catch it ("To Date cannot be
// before From Date"). A DateRangePicker keeps the earlier date first on its
// own. The "don't" side opens on that silent mistake: Mar 13 to Mar 9.
const leave = ref<DateRangeValue>(['2026-03-09', '2026-03-13'])
const fromDate = ref('2026-03-13')
const toDate = ref('2026-03-09')

// Card 2, from Frappe Builder's analytics: most people want a standard range,
// so the common ones come first and "Custom" opens the calendar.
const rangeOptions = [
  { label: 'Today', value: 'today' },
  { label: 'Last 7 days', value: 'last_7_days' },
  { label: 'Last 30 days', value: 'last_30_days' },
  { label: 'This year', value: 'this_year' },
  { label: 'Custom', value: 'custom' },
]
const range = ref('last_30_days')
const custom = ref<DateRangeValue>(['2026-02-01', '2026-02-28'])
const bare = ref<DateRangeValue>([])

// Card 3: without `format` the field shows the stored value, 2026-03-05.
// Builder passes "MMM D, YYYY" so people read a date, not a key.
const wordMonth = ref('2026-03-05')
const rawValue = ref('2026-03-05')

const calendarIcon = 'lucide-calendar size-4 text-ink-gray-5'
</script>

<template>
  <div class="flex flex-col gap-8">
    <!-- 1. One range picker instead of From and To fields. Both sides are
         live; the "don't" side opens on an end date before the start. -->
    <Guideline
      layout="stack"
      caption="Pick a date range with one DateRangePicker, not two date fields."
    >
      <template #do>
        <DateRangePicker
          format="MMM D, YYYY"
          v-model="leave"
          class="w-[344px]"
          label="Leave dates"
        >
          <template #prefix>
            <span :class="calendarIcon" aria-hidden="true" />
          </template>
        </DateRangePicker>
      </template>
      <template #dont>
        <div class="flex w-[344px] items-start gap-2">
          <DatePicker
            format="MMM D, YYYY"
            v-model="fromDate"
            class="flex-1"
            label="From date"
          >
            <template #prefix>
              <span :class="calendarIcon" aria-hidden="true" />
            </template>
          </DatePicker>
          <DatePicker
            format="MMM D, YYYY"
            v-model="toDate"
            class="flex-1"
            label="To date"
          >
            <template #prefix>
              <span :class="calendarIcon" aria-hidden="true" />
            </template>
          </DatePicker>
        </div>
      </template>
    </Guideline>

    <!-- 2. Common ranges first, the calendar only for "Custom". Pick Custom
         on the "do" side to see the calendar appear. -->
    <Guideline
      layout="stack"
      caption="Offer common ranges, like Last 7 days, before a custom range."
    >
      <template #do>
        <div class="flex w-[344px] items-center gap-2">
          <Select
            v-model="range"
            class="w-36"
            aria-label="Date range"
            :options="rangeOptions"
          />
          <DateRangePicker
            v-if="range === 'custom'"
            format="MMM D, YYYY"
            v-model="custom"
            class="flex-1"
            aria-label="Custom range"
          />
        </div>
      </template>
      <template #dont>
        <DateRangePicker
          format="MMM D, YYYY"
          v-model="bare"
          class="w-[344px]"
          aria-label="Date range"
          placeholder="Select date range"
        >
          <template #prefix>
            <span :class="calendarIcon" aria-hidden="true" />
          </template>
        </DateRangePicker>
      </template>
    </Guideline>

    <!-- 3. The month as a word reads at a glance. `format` only changes
         what's shown; the value stays YYYY-MM-DD. "Don't" has no format. -->
    <Guideline
      layout="stack"
      caption="Pass a format with the month as a word, like “MMM&nbsp;D,&nbsp;YYYY”. Without one, the field shows the raw value."
    >
      <template #do>
        <DatePicker
          v-model="wordMonth"
          class="w-56"
          aria-label="Due date"
          format="MMM D, YYYY"
        >
          <template #prefix>
            <span :class="calendarIcon" aria-hidden="true" />
          </template>
        </DatePicker>
      </template>
      <template #dont>
        <DatePicker
          v-model="rawValue"
          class="w-56"
          aria-label="Due date"
        >
          <template #prefix>
            <span :class="calendarIcon" aria-hidden="true" />
          </template>
        </DatePicker>
      </template>
    </Guideline>
  </div>
</template>
