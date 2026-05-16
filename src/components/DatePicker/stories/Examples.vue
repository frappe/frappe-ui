<script setup lang="ts">
import { ref } from 'vue'
import { DatePicker, Button } from 'frappe-ui'
import { dayjs } from '../../../utils/dayjs'
import type { Dayjs } from 'dayjs/esm'
import LucidePlane from '~icons/lucide/plane'
import LucideCake from '~icons/lucide/cake'
import LucideTruck from '~icons/lucide/truck'
import LucideStethoscope from '~icons/lucide/stethoscope'
import LucideGhost from '~icons/lucide/ghost'
import LucideRocket from '~icons/lucide/rocket'
import LucideCalendarPlus from '~icons/lucide/calendar-plus'

// 1. Flight booking — can't fly into the past
const departure = ref('')
const today = dayjs().format('YYYY-MM-DD')
const oneYearOut = dayjs().add(1, 'year').format('YYYY-MM-DD')

// 2. Date of birth — can't be born in the future
const dob = ref('1995-08-14')
const longAgo = dayjs().subtract(120, 'year').format('YYYY-MM-DD')

// 3. Delivery — weekdays only with custom quick actions
const delivery = ref('')
function isWeekend(date: Dayjs) {
  const day = date.day()
  return day === 0 || day === 6
}
function nextMonday(from: Dayjs = dayjs()) {
  const diff = (8 - from.day()) % 7 || 7
  return from.add(diff, 'day')
}

// 4. Appointment — bookable in next 30 days, doc unavailable on a few dates
const appointment = ref('')
const inThirtyDays = dayjs().add(30, 'day').format('YYYY-MM-DD')
const fullyBooked = new Set([
  dayjs().add(2, 'day').format('YYYY-MM-DD'),
  dayjs().add(5, 'day').format('YYYY-MM-DD'),
  dayjs().add(11, 'day').format('YYYY-MM-DD'),
  dayjs().add(18, 'day').format('YYYY-MM-DD'),
])
function isFullyBooked(date: Dayjs) {
  return fullyBooked.has(date.format('YYYY-MM-DD'))
}

// 5. Fun — only Friday the 13ths are pickable
const spookyDate = ref('')
function notFridayThe13th(date: Dayjs) {
  return !(date.day() === 5 && date.date() === 13)
}

// 6. Fun — pick a Stardate for a time-travel destination
const stardate = ref('')
const stardateFloor = dayjs('1800-01-01').format('YYYY-MM-DD')
const stardateCeil = dayjs('2300-12-31').format('YYYY-MM-DD')

// 7. Custom trigger — "Add due date" button on a task card
const dueDate = ref('')

// Canonical sidebar row styling for #actions.
const rowCls =
  'w-full rounded px-2 py-1.5 text-left text-base hover:bg-surface-gray-2'
</script>

<template>
  <div class="grid w-full max-w-3xl grid-cols-1 gap-6 sm:grid-cols-2">
    <!-- 1. Flight booking -->
    <DatePicker
      v-model="departure"
      label="Departure"
      placeholder="When are you flying?"
      format="ddd, MMM D"
      :min-date="today"
      :max-date="oneYearOut"
    >
      <template #prefix>
        <LucidePlane class="size-4 text-ink-gray-5" />
      </template>
    </DatePicker>

    <!-- 2. Date of birth -->
    <DatePicker
      v-model="dob"
      label="Date of birth"
      placeholder="MM/DD/YYYY"
      format="MMM D, YYYY"
      :min-date="longAgo"
      :max-date="today"
      :clearable="false"
    >
      <template #prefix>
        <LucideCake class="size-4 text-ink-gray-5" />
      </template>
    </DatePicker>

    <!-- 3. Delivery scheduling -->
    <DatePicker
      v-model="delivery"
      label="Delivery date"
      placeholder="Weekdays only"
      :min-date="today"
      :is-date-unavailable="isWeekend"
    >
      <template #prefix>
        <LucideTruck class="size-4 text-ink-gray-5" />
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

    <!-- 4. Doctor's appointment -->
    <DatePicker
      v-model="appointment"
      label="Book appointment"
      description="Next 30 days. Greyed-out slots are full."
      placeholder="Pick a slot"
      :min-date="today"
      :max-date="inThirtyDays"
      :is-date-unavailable="isFullyBooked"
    >
      <template #prefix>
        <LucideStethoscope class="size-4 text-ink-gray-5" />
      </template>
    </DatePicker>

    <!-- 5. Fun: Friday the 13th -->
    <DatePicker
      v-model="spookyDate"
      label="Spooky date"
      description="Only Friday the 13ths qualify."
      placeholder="Pick if you dare"
      format="dddd, MMM D, YYYY"
      :is-date-unavailable="notFridayThe13th"
    >
      <template #prefix>
        <LucideGhost class="size-4 text-ink-gray-5" />
      </template>
    </DatePicker>

    <!-- 6. Fun: Time-travel destination -->
    <DatePicker
      v-model="stardate"
      label="Time-travel destination"
      placeholder="When to?"
      format="[Stardate] YYYY.MM.DD"
      variant="outline"
      :min-date="stardateFloor"
      :max-date="stardateCeil"
    >
      <template #prefix>
        <LucideRocket class="size-4 text-ink-gray-5" />
      </template>
    </DatePicker>

    <!-- 7. Custom trigger — feels like a task-card affordance -->
    <div class="flex flex-col gap-1.5 sm:col-span-2">
      <span class="text-sm text-ink-gray-7">Task card affordance</span>
      <DatePicker v-model="dueDate" format="MMM D">
        <template #trigger="{ togglePopover, displayLabel }">
          <Button
            :variant="dueDate ? 'subtle' : 'ghost'"
            @click="togglePopover"
          >
            <template #prefix>
              <LucideCalendarPlus class="size-4" />
            </template>
            {{ dueDate ? `Due ${displayLabel}` : 'Add due date' }}
          </Button>
        </template>
      </DatePicker>
    </div>
  </div>
</template>
