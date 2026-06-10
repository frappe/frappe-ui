<script setup lang="ts">
import { computed, ref } from 'vue'
import { DateRangePicker } from 'frappe-ui'
import { dayjs } from '../../../utils/dayjs'
import type { Dayjs } from 'dayjs/esm'

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

function longWeekend(): [Dayjs, Dayjs] {
  const fri = upcomingDay(5)
  return [fri, fri.add(2, 'day')]
}

function workWeek(): [Dayjs, Dayjs] {
  const mon = upcomingDay(1)
  return [mon, mon.add(4, 'day')]
}

function upcomingDay(weekday: number) {
  const t = dayjs()
  const diff = (weekday - t.day() + 7) % 7 || 7
  return t.add(diff, 'day')
}

function lastNDays(days: number): [Dayjs, Dayjs] {
  return [dayjs().subtract(days - 1, 'day'), dayjs()]
}

// Canonical sidebar row styling.
const rowCls =
  'w-full rounded px-2 py-1.5 text-left text-base hover:bg-surface-gray-2'

// 4. Project sprint — weekdays only, span limited to ~2 weeks via `max`
const sprint = ref<string[]>([])
const sprintEnd = dayjs().add(60, 'day').format('YYYY-MM-DD')
function isWeekend(date: Dayjs) {
  const d = date.day()
  return d === 0 || d === 6
}

// 5. Flight booking — custom #trigger renders two side-by-side inputs
// that share one popover, so the calendar still visualizes the range.
const flight = ref<string[]>([])
const depart = computed(() =>
  flight.value[0] ? dayjs(flight.value[0]).format('ddd, MMM D') : '',
)
const ret = computed(() =>
  flight.value[1] ? dayjs(flight.value[1]).format('ddd, MMM D') : '',
)
</script>

<template>
  <div class="grid w-full max-w-sm gap-6 py-10">
    <!-- 1. PTO request -->
    <DateRangePicker
      v-model="timeOff"
      label="Time off"
      placeholder="Pick your dates"
      :min="today"
    >
      <template #prefix>
        <span
          class="lucide-palmtree size-4 text-ink-gray-5"
          aria-hidden="true"
        />
      </template>
      <template #actions="{ setRange, close }">
        <button
          type="button"
          :class="rowCls"
          @click="
            () => {
              setRange(longWeekend())
              close()
            }
          "
        >
          Long weekend
        </button>
        <button
          type="button"
          :class="rowCls"
          @click="
            () => {
              setRange(workWeek())
              close()
            }
          "
        >
          Next week
        </button>
      </template>
    </DateRangePicker>

    <!-- 2. Hotel booking — dual pane shines for >1 month stays -->
    <DateRangePicker
      v-model="stay"
      label="Check-in / Check-out"
      placeholder="Select your stay"
      dual-pane
      :min="today"
      :max="oneYearOut"
    >
      <template #prefix>
        <span class="lucide-hotel size-4 text-ink-gray-5" aria-hidden="true" />
      </template>
    </DateRangePicker>

    <!-- 3. Analytics date range filter -->
    <DateRangePicker
      v-model="analyticsRange"
      label="Report range"
      description="Defaults to the last 30 days."
      format="MMM D"
      :max="today"
    >
      <template #prefix>
        <span
          class="lucide-chart-line size-4 text-ink-gray-5"
          aria-hidden="true"
        />
      </template>
      <template #actions="{ fromDate, toDate, setRange, clear, close }">
        <button
          type="button"
          :class="rowCls"
          @click="
            () => {
              setRange([dayjs(), dayjs()])
              close()
            }
          "
        >
          Today
        </button>
        <button
          type="button"
          :class="rowCls"
          @click="
            () => {
              setRange(lastNDays(7))
              close()
            }
          "
        >
          Last 7 days
        </button>
        <button
          type="button"
          :class="rowCls"
          @click="
            () => {
              setRange(lastNDays(28))
              close()
            }
          "
        >
          Last 4 weeks
        </button>
        <button
          type="button"
          :class="rowCls"
          @click="
            () => {
              setRange(lastNDays(90))
              close()
            }
          "
        >
          Last 3 months
        </button>
        <button
          type="button"
          :class="rowCls"
          @click="
            () => {
              setRange(lastNDays(365))
              close()
            }
          "
        >
          Last 12 months
        </button>
        <hr class="my-1 border-outline-gray-2" />
        <button
          v-if="fromDate || toDate"
          type="button"
          :class="rowCls"
          @click="
            () => {
              clear()
              close()
            }
          "
        >
          Clear
        </button>
      </template>
    </DateRangePicker>

    <!-- 4. Sprint window — weekdays only -->
    <DateRangePicker
      v-model="sprint"
      label="Sprint window"
      description="Pick start and end. Weekends are skipped."
      :min="today"
      :max="sprintEnd"
      :is-date-unavailable="isWeekend"
    >
      <template #prefix>
        <span
          class="lucide-timer-reset size-4 text-ink-gray-5"
          aria-hidden="true"
        />
      </template>
    </DateRangePicker>

    <!-- 5. Flight booking — split trigger over one shared popover -->
    <DateRangePicker v-model="flight" dual-pane :min="today">
      <template #trigger="{ togglePopover, isOpen }">
        <div
          class="grid grid-cols-2 divide-x divide-outline-gray-2 rounded border bg-surface-base text-sm transition-colors"
          :class="
            isOpen
              ? 'border-outline-gray-4 ring-2 ring-outline-gray-2'
              : 'border-outline-gray-2 hover:border-outline-gray-3'
          "
        >
          <button
            type="button"
            class="flex items-center gap-2 rounded-l px-3 py-2 text-left hover:bg-surface-gray-1"
            @click="togglePopover"
          >
            <span
              class="lucide-plane-takeoff size-4 text-ink-gray-5"
              aria-hidden="true"
            />
            <div class="flex flex-col leading-tight">
              <span class="text-xs text-ink-gray-5">Depart</span>
              <span class="text-ink-gray-9">
                {{ depart || 'Add date' }}
              </span>
            </div>
          </button>
          <button
            type="button"
            class="flex items-center gap-2 rounded-r px-3 py-2 text-left hover:bg-surface-gray-1"
            @click="togglePopover"
          >
            <span
              class="lucide-plane-landing size-4 text-ink-gray-5"
              aria-hidden="true"
            />
            <div class="flex flex-col leading-tight">
              <span class="text-xs text-ink-gray-5">Return</span>
              <span class="text-ink-gray-9">
                {{ ret || 'Add date' }}
              </span>
            </div>
          </button>
        </div>
      </template>
    </DateRangePicker>
  </div>
</template>
