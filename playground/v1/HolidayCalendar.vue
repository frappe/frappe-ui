<script setup lang="ts">
import { computed, ref } from 'vue'
import dayjs from 'dayjs'
import { Button, Dropdown } from '../../src'

/**
 * A year-at-a-glance calendar in the visual language of Espresso 2.0's
 * `date-picker` **inline** variant — frappe-ui ships only the popover
 * `DatePicker` (its `DateCalendar` is deliberately internal), so the grid is
 * assembled here from the design's own metrics:
 *
 *   date-cell  24×24, radius 5, 12px text
 *   date row   180px wide — 7 × 24 + 6 × 2 gap
 *   weeks      a uniform six rows, padded with outside dates, as the design does
 *
 * The fixed 180px is what keeps it scannable: letting each grid stretch to its
 * column pushes the day columns apart and the eye loses the week rhythm.
 */
const props = defineProps<{
  /** Dates to mark as holidays, `YYYY-MM-DD`. */
  holidays: string[]
}>()

const year = ref(dayjs().year())
/** The design pages six months at a time, opening on the half containing today. */
const page = ref(dayjs().month() < 6 ? 0 : 1)

const holidaySet = computed(() => new Set(props.holidays))
const today = dayjs().format('YYYY-MM-DD')

const yearOptions = computed(() =>
  [-2, -1, 0, 1, 2].map((d) => {
    const y = dayjs().year() + d
    return { label: String(y), onClick: () => (year.value = y) }
  }),
)

const WEEKDAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

type Cell = { label: number; outside: boolean; date: string }

function monthCells(monthIndex: number): Cell[] {
  const first = dayjs().year(year.value).month(monthIndex).date(1)
  // dayjs() is Sunday-first; shift so Monday is column 0.
  const lead = (first.day() + 6) % 7
  // Always six rows. A month spans four to six calendar weeks depending on its
  // length and start weekday, so six is the only count that is both uniform
  // and complete — five would clip real dates off the end of any month that
  // runs to a sixth week. The design pads the same way: its Jan 2025 needs
  // only five rows but still draws a trailing all-outside week.
  const start = first.subtract(lead, 'day')
  return Array.from({ length: 42 }, (_, i) => {
    const d = start.add(i, 'day')
    return {
      label: d.date(),
      outside: d.month() !== monthIndex,
      date: d.format('YYYY-MM-DD'),
    }
  })
}

const rows = computed(() =>
  [0, 1].map((rowIndex) =>
    Array.from({ length: 3 }, (_, i) => {
      const monthIndex = page.value * 6 + rowIndex * 3 + i
      return {
        index: monthIndex,
        label: dayjs().year(year.value).month(monthIndex).format('MMM YYYY'),
        cells: monthCells(monthIndex),
      }
    }),
  ),
)

function step(direction: number) {
  const next = page.value + direction
  if (next < 0) {
    year.value -= 1
    page.value = 1
  } else if (next > 1) {
    year.value += 1
    page.value = 0
  } else {
    page.value = next
  }
}

function goToday() {
  year.value = dayjs().year()
  page.value = dayjs().month() < 6 ? 0 : 1
}

function cellClasses(cell: Cell) {
  if (cell.date === today) return 'bg-surface-red-7 text-white'
  if (!cell.outside && holidaySet.value.has(cell.date))
    return 'bg-surface-amber-1 text-ink-amber-7'
  return cell.outside ? 'text-ink-gray-4' : 'text-ink-gray-8'
}
</script>

<template>
  <div
    class="flex flex-col gap-4 rounded-5 border border-outline-gray-1 bg-surface-elevation-1 p-6"
  >
    <!--
      `-ml-2` / `-mr-2` cancel the ghost buttons' own `px-2`, so the year reads
      flush with the month labels below it instead of sitting 8px inside them.
      `-mt-2` does the same job vertically. The button is 28px tall around a
      17px line box, and Inter's cap height sits a further ~2.5px below that
      box's top, so the year's glyphs would otherwise start 27px down while
      everything else is inset a flat 24 — the top reads heavier than the
      sides. Measured: 8px brings the ink to 25.1 top against 25.0 left. The
      negative margin shrinks the column's content, so the card simply gets
      8px shorter and `pb-6` still holds the dots 24px off the bottom.
    -->
    <div class="-mt-2 flex items-center justify-between gap-2">
      <Dropdown
        class="-ml-2"
        :options="yearOptions"
        :button="{
          label: String(year),
          variant: 'ghost',
          iconRight: 'lucide-chevron-down',
        }"
      />
      <div class="-mr-2 flex items-center gap-1">
        <Button
          variant="ghost"
          icon="lucide-chevron-left"
          aria-label="Previous months"
          @click="step(-1)"
        />
        <Button variant="ghost" label="Today" @click="goToday" />
        <Button
          variant="ghost"
          icon="lucide-chevron-right"
          aria-label="Next months"
          @click="step(1)"
        />
      </div>
    </div>

    <div class="flex flex-col gap-5">
      <div v-for="(row, i) in rows" :key="i" class="flex justify-between">
        <div
          v-for="month in row"
          :key="month.index"
          class="flex w-[180px] flex-col gap-1.5"
        >
          <!--
            Day cells centre their text in a 24px box, so the column's ink
            starts inside the grid's own left edge — 6.7px for the `M`, 4.2px
            for a two-digit date. A title flush with the grid box therefore
            reads as hanging off to the left. 6px splits the difference, so the
            title lines up with the weekday row and the dates alike.
          -->
          <div class="pl-1.5 text-sm-medium text-ink-gray-8">
            {{ month.label }}
          </div>

          <div class="grid grid-cols-7 gap-0.5">
            <div
              v-for="(day, d) in WEEKDAYS"
              :key="`wd-${d}`"
              class="flex size-6 items-center justify-center text-xs text-ink-gray-4"
            >
              {{ day }}
            </div>
            <div
              v-for="cell in month.cells"
              :key="cell.date"
              class="flex size-6 items-center justify-center rounded-2 text-xs tabular-nums"
              :class="cellClasses(cell)"
            >
              {{ cell.label }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Which half of the year is showing. -->
    <div class="flex items-center justify-center gap-1.5">
      <button
        v-for="p in [0, 1]"
        :key="p"
        type="button"
        class="size-1.5 rounded-full transition-colors"
        :class="page === p ? 'bg-surface-gray-7' : 'bg-surface-gray-4'"
        :aria-label="
          p === 0 ? 'First half of the year' : 'Second half of the year'
        "
        @click="page = p"
      />
    </div>
  </div>
</template>
