<template>
  <!-- Calendar's foot (31304:79302): the file's date-picker, 204 × 200 at
       p 8 — a 24px head (the month, 13 medium gray-800, and a three-button
       group of 22 × 24: back · today · forward) · 6px · the grid, rows 24
       tall and 2px apart, seven 24px cells spread across the 188px. Weekday
       letters and the days outside the month are 12 gray-500; the month's
       own days gray-800, and the picked day sits on gray-900 in white, r5.
       It opens on the file's June 2023 with the 9th picked, and it works:
       the arrows walk the months, the middle button comes back to today,
       and any day takes the pick. -->
  <div class="flex flex-col gap-1.5 p-2">
    <div class="flex h-6 items-center justify-between">
      <button
        type="button"
        class="flex h-6 items-center rounded-4 px-1.5 text-sm-medium text-ink-gray-7 outline-none transition-colors hover:bg-surface-gray-2 focus-visible:focus-ring"
        @click="showPick"
      >
        {{ monthLabel }}
      </button>
      <div class="flex">
        <button
          v-for="nav in NAV"
          :key="nav.icon"
          type="button"
          class="flex h-6 w-[22px] items-center justify-center rounded-4 text-ink-gray-7 outline-none transition-colors hover:bg-surface-gray-2 focus-visible:focus-ring"
          :aria-label="nav.label"
          @click="nav.go()"
        >
          <EIcon :name="nav.icon" class="size-3.5" />
        </button>
      </div>
    </div>

    <div class="flex flex-col gap-0.5">
      <div class="flex h-6 items-center justify-between" aria-hidden="true">
        <span
          v-for="(day, i) in WEEKDAYS"
          :key="i"
          class="grid size-6 place-items-center text-xs text-ink-gray-4"
        >
          {{ day }}
        </span>
      </div>
      <div
        v-for="(week, w) in weeks"
        :key="w"
        class="flex h-6 items-center justify-between"
      >
        <button
          v-for="cell in week"
          :key="cell.key"
          type="button"
          class="grid size-6 place-items-center rounded-2 text-xs outline-none transition-colors focus-visible:focus-ring"
          :class="
            cell.selected
              ? 'bg-surface-gray-9 text-ink-base'
              : cell.muted
                ? 'text-ink-gray-4 hover:bg-surface-gray-2'
                : 'text-ink-gray-7 hover:bg-surface-gray-2'
          "
          :aria-label="cell.label"
          :aria-pressed="cell.selected"
          @click="pick(cell.date)"
        >
          {{ cell.date.getDate() }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import EIcon from './EIcon.vue'

const WEEKDAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

// The month in view and the picked day, as the file opens: June 2023, the 9th.
const view = ref(new Date(2023, 5, 1))
const selected = ref(new Date(2023, 5, 9))

const monthLabel = computed(() =>
  view.value.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
)

function shiftMonth(by: number) {
  view.value = new Date(view.value.getFullYear(), view.value.getMonth() + by, 1)
}

// the month's own button brings the picked day back into view
function showPick() {
  view.value = new Date(
    selected.value.getFullYear(),
    selected.value.getMonth(),
    1,
  )
}

function goToday() {
  const now = new Date()
  selected.value = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  view.value = new Date(now.getFullYear(), now.getMonth(), 1)
}

function pick(date: Date) {
  selected.value = date
  // a day from the month before or after brings that month into view
  if (date.getMonth() !== view.value.getMonth())
    view.value = new Date(date.getFullYear(), date.getMonth(), 1)
}

const NAV = [
  {
    icon: 'small-left-chevron-14',
    label: 'Previous month',
    go: () => shiftMonth(-1),
  },
  { icon: 'tomorrow-14', label: 'Today', go: goToday },
  {
    icon: 'small-right-chevron-14',
    label: 'Next month',
    go: () => shiftMonth(1),
  },
]

const sameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate()

// Monday-first weeks, from the Monday on or before the 1st to the Sunday on
// or after the month's last day — five rows for June 2023, six when a month
// needs them.
const weeks = computed(() => {
  const year = view.value.getFullYear()
  const month = view.value.getMonth()
  const first = new Date(year, month, 1)
  const start = new Date(first)
  start.setDate(first.getDate() - ((first.getDay() + 6) % 7))
  const last = new Date(year, month + 1, 0)
  const end = new Date(last)
  end.setDate(last.getDate() + ((7 - last.getDay()) % 7))

  const rows: {
    key: string
    date: Date
    label: string
    muted: boolean
    selected: boolean
  }[][] = []
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const date = new Date(d)
    const cell = {
      key: `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`,
      date,
      label: date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
      muted: date.getMonth() !== month,
      selected: sameDay(date, selected.value),
    }
    if (rows.length === 0 || rows[rows.length - 1].length === 7) rows.push([])
    rows[rows.length - 1].push(cell)
  }
  return rows
})
</script>
