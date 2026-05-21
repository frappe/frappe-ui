<script setup lang="ts">
import { ref } from 'vue'
import { DatePicker, Button } from 'frappe-ui'
import { dayjs } from '../../../utils/dayjs'
import type { Dayjs } from 'dayjs/esm'

// 1. Flight booking — can't fly into the past
const departure = ref('')
const today = dayjs().format('YYYY-MM-DD')
const oneYearOut = dayjs().add(1, 'year').format('YYYY-MM-DD')

// 2. Date of birth — can't be born in the future
const dob = ref('1995-08-14')
const longAgo = dayjs().subtract(120, 'year').format('YYYY-MM-DD')

// 3. Appointment — weekdays only, next 30 days, with quick actions and
//    a few slots already taken.
const appointment = ref('')
const inThirtyDays = dayjs().add(30, 'day').format('YYYY-MM-DD')
const fullyBooked = new Set([
  dayjs().add(2, 'day').format('YYYY-MM-DD'),
  dayjs().add(5, 'day').format('YYYY-MM-DD'),
  dayjs().add(11, 'day').format('YYYY-MM-DD'),
])
function isUnavailable(date: Dayjs) {
  const day = date.day()
  if (day === 0 || day === 6) return true
  return fullyBooked.has(date.format('YYYY-MM-DD'))
}
function nextMonday(from: Dayjs = dayjs()) {
  const diff = (8 - from.day()) % 7 || 7
  return from.add(diff, 'day')
}

// 4. Fun — pick a Stardate for a time-travel destination
const stardate = ref('')
const stardateFloor = dayjs('1800-01-01').format('YYYY-MM-DD')
const stardateCeil = dayjs('2300-12-31').format('YYYY-MM-DD')

// 5. Custom trigger — "Add due date" button on a task card
const dueDate = ref('')

const rowCls =
  'w-full rounded px-2 py-1.5 text-left text-base hover:bg-surface-gray-2'
</script>

<template>
  <div class="grid w-full max-w-sm gap-6 py-10">
    <!-- 1. Flight booking -->
    <DatePicker
      v-model="departure"
      label="Departure"
      placeholder="When are you flying?"
      format="ddd, MMM D"
      :min="today"
      :max="oneYearOut"
    >
      <template #prefix>
        <span class="lucide-plane size-4 text-ink-gray-5" />
      </template>
    </DatePicker>

    <!-- 2. Date of birth -->
    <DatePicker
      v-model="dob"
      label="Date of birth"
      placeholder="MM/DD/YYYY"
      format="MMM D, YYYY"
      :min="longAgo"
      :max="today"
      :clearable="false"
    >
      <template #prefix>
        <span class="lucide-cake size-4 text-ink-gray-5" />
      </template>
    </DatePicker>

    <!-- 3. Appointment booking -->
    <DatePicker
      v-model="appointment"
      label="Book appointment"
      description="Weekdays only, next 30 days. Greyed-out slots are full."
      placeholder="Pick a slot"
      :min="today"
      :max="inThirtyDays"
      :is-date-unavailable="isUnavailable"
    >
      <template #prefix>
        <span class="lucide-stethoscope size-4 text-ink-gray-5" />
      </template>
      <template #actions="{ setDate, close }">
        <button
          type="button"
          :class="rowCls"
          @click="
            () => {
              setDate(dayjs().add(1, 'day'))
              close()
            }
          "
        >
          Tomorrow
        </button>
        <button
          type="button"
          :class="rowCls"
          @click="
            () => {
              setDate(nextMonday())
              close()
            }
          "
        >
          Next Monday
        </button>
      </template>
    </DatePicker>

    <!-- 4. Fun: Time-travel destination -->
    <DatePicker
      v-model="stardate"
      label="Time-travel destination"
      placeholder="When to?"
      format="[Stardate] YYYY.MM.DD"
      variant="outline"
      :min="stardateFloor"
      :max="stardateCeil"
    >
      <template #prefix>
        <span class="lucide-rocket size-4 text-ink-gray-5" />
      </template>
    </DatePicker>

    <!-- 5. Custom trigger — feels like a task-card affordance -->
    <div class="flex flex-col gap-1.5">
      <span class="text-sm text-ink-gray-7">Task card affordance</span>
      <DatePicker v-model="dueDate" format="MMM D">
        <template #trigger="{ togglePopover, displayLabel }">
          <Button
            :variant="dueDate ? 'subtle' : 'ghost'"
            @click="togglePopover"
          >
            <template #prefix>
              <span class="lucide-calendar-plus size-4" />
            </template>
            {{ dueDate ? `Due ${displayLabel}` : 'Add due date' }}
          </Button>
        </template>
      </DatePicker>
    </div>
  </div>
</template>
