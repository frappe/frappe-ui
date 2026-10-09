<script setup lang="ts">
// The date picker (node 29745:39578), shown open the way the emoji picker
// is — no field to click. The calendar is frappe-ui's own: DateCalendar for
// one date, DateRangeCalendar for a range (with `dual-pane` for the file's
// double pane) — the bodies the library's DatePicker and DateRangePicker
// open in their popovers. The file's look is laid over them in the styles
// below; what the library can't be made to do from outside is listed in
// the page's report.
//
//   card       196 wide (392 double), radius 12, the xl shadow, on the
//              raised surface; `inline` drops the card
//   calendar   8 in, 6 between the month row and the grid; the month row
//              24 tall: the month as a ghost xs button, 13 medium
//              ink-gray-7, the file's small-down after it (small-up when the
//              month list is open); at the right three xs ghost icon
//              buttons 22 wide — small-left, tomorrow (back to today),
//              small-right
//   grid       24 cells 2 apart, Monday first, the weekday letters 12
//              ink-gray-4, days 12 ink-gray-7 (outside the month
//              ink-gray-4), radius 5; the picked day surface-gray-9 with
//              white text; only the weeks the month touches
//   range      the days between on surface-gray-1, one bar from end to end
//   months     two lists 88 wide, 4 apart, rows 28 tall, 1 apart, 8 in,
//              left aligned; the current year and month on surface-gray-2
//   time       (date & time) under the calendar, a rule, 8 in: three xs
//              subtle selects filling the row, 4 apart — hour, minute, AM/PM
//   header     (optional) a rule under it, 8 in: an xs subtle field, two
//              with the calendar glyph for a range
//   footer     (optional) a rule over it, 8 in: Reset ghost, then a subtle
//              and a solid xs button at the right
//   sidebar    (optional) 122 wide, 4 in, a rule at its right: sm ghost
//              buttons 28 tall, 1 apart — shortcuts that pick a date
import { computed, ref, watch } from 'vue'
import dayjs from 'dayjs/esm'
import { Button, Select, TextInput } from '../../src'
import DateCalendar from '../../src/components/DatePicker/DateCalendar.vue'
import DateRangeCalendar from '../../src/components/DatePicker/DateRangeCalendar.vue'
import type { DateRangeValue } from '../../src/components/DatePicker/types'
import iconLeft from './icons/small-left.svg?url'
import iconRight from './icons/small-right.svg?url'
import iconToday from './icons/tomorrow.svg?url'
import iconDown from './icons/small-down.svg?url'
import iconUp from './icons/small-up.svg?url'
import iconSelect from './icons/small-select.svg?url'
import iconCalendar from './icons/calendar.svg?url'

export type DatePickerVariant = 'default' | 'inline' | 'date-time'

const props = defineProps<{
  variant: DatePickerVariant
  range: boolean
  doublePane: boolean
  header: boolean
  footer: boolean
  sidebar: boolean
}>()

// the file's dates: June 9, 2023; the range 5–11 June; double pane 26 June
// to 4 July
const START_DATE = '2023-06-09'
const startRange = (): DateRangeValue =>
  props.doublePane ? ['2023-06-26', '2023-07-04'] : ['2023-06-05', '2023-06-11']

const date = ref(START_DATE)
const range = ref<DateRangeValue>(startRange())
watch(
  () => props.doublePane,
  () => (range.value = startRange()),
)

// the file's time, 10:30 AM
const hour = ref('10')
const minute = ref('30')
const meridiem = ref('AM')
const hours = Array.from({ length: 12 }, (_, i) => String(i + 1))
const minutes = Array.from({ length: 12 }, (_, i) =>
  String(i * 5).padStart(2, '0'),
)
const meridiems = ['AM', 'PM']

// ---- header: type a date, Enter (or leaving the field) picks it
const FORMATS = [
  'YYYY-MM-DD',
  'D MMM YYYY',
  'MMM D YYYY',
  'D/M/YYYY',
  'D-M-YYYY',
]
const DISPLAY = 'D MMM YYYY'
const parse = (text: string) => {
  const d = dayjs(text.trim(), FORMATS)
  return d.isValid() ? d.format('YYYY-MM-DD') : null
}
const show = (value: string) => (value ? dayjs(value).format(DISPLAY) : '')
const typed = ref('')
const typedFrom = ref('')
const typedTo = ref('')
watch(date, (v) => (typed.value = show(v)), { immediate: true })
watch(
  range,
  ([from, to]) => {
    typedFrom.value = show(from)
    typedTo.value = show(to)
  },
  { immediate: true },
)
function commitTyped() {
  const v = parse(typed.value)
  if (v) date.value = v
  else typed.value = show(date.value)
}
function commitRange(which: 0 | 1) {
  const text = which ? typedTo.value : typedFrom.value
  const v = parse(text)
  if (!v) {
    typedFrom.value = show(range.value[0])
    typedTo.value = show(range.value[1])
    return
  }
  const next: DateRangeValue = [...range.value]
  next[which] = v
  if (next[0] && next[1] && next[0] > next[1]) next.reverse()
  range.value = next
}

// ---- sidebar: shortcuts, counted back from today (the calendar moves to
// the picked month)
const base = computed(() => dayjs())
const fmt = (d: dayjs.Dayjs) => d.format('YYYY-MM-DD')
// the file's shortcuts (node 35942:69507): a window back from today — the range it spans, or its first day for a single date; Custom
// leaves the pick to the calendar
const SHORTCUTS = [
  { label: 'Yesterday', days: 1 },
  { label: 'Last 3 days', days: 3 },
  { label: 'Last 7 days', days: 7 },
  { label: 'Last 30 days', days: 30 },
  { label: 'Custom', days: 0 },
]
function pickShortcut(days: number) {
  if (!days) return
  const from = fmt(base.value.subtract(days, 'day'))
  const to = fmt(base.value.subtract(days === 1 ? 1 : 0, 'day'))
  if (isRange.value) range.value = [from, to]
  else date.value = from
}
const isRange = computed(() => props.range)

// the sun button picks today; the library keeps showing the month it was
// on, so the calendar is redrawn — it opens on the picked date's month
const calendarKey = ref(0)

// ---- footer: Reset clears, Cancel goes back to the file's date, Apply keeps
function reset() {
  if (isRange.value) range.value = ['', '']
  else date.value = ''
}
function cancel() {
  date.value = START_DATE
  range.value = startRange()
}

// the file's glyphs, handed to the styles below as masks
const icons = {
  '--dp-left': `url("${iconLeft}")`,
  '--dp-right': `url("${iconRight}")`,
  '--dp-today': `url("${iconToday}")`,
  '--dp-down': `url("${iconDown}")`,
  '--dp-up': `url("${iconUp}")`,
  '--dp-select': `url("${iconSelect}")`,
}
</script>

<template>
  <div
    class="dp inline-flex flex-col"
    :class="[
      variant === 'inline'
        ? 'dp--inline'
        : 'rounded-6 bg-surface-elevation-2 shadow-xl',
      isRange && doublePane && 'dp--double',
    ]"
    :style="icons"
  >
    <!-- header: type a date -->
    <div
      v-if="header"
      class="flex gap-2 border-b border-outline-gray-1 p-2 pb-[7px]"
    >
      <template v-if="isRange">
        <TextInput
          v-for="i in [0, 1] as const"
          :key="i"
          :model-value="i ? typedTo : typedFrom"
          size="xs"
          variant="subtle"
          class="min-w-0 flex-1"
          :placeholder="i ? 'End date' : 'Start date'"
          :aria-label="i ? 'End date' : 'Start date'"
          @update:model-value="i ? (typedTo = $event) : (typedFrom = $event)"
          @keydown.enter="commitRange(i)"
          @blur="commitRange(i)"
        >
          <template #prefix>
            <img :src="iconCalendar" alt="" class="dp-glyph size-3.5" />
          </template>
        </TextInput>
      </template>
      <TextInput
        v-else
        v-model="typed"
        size="xs"
        variant="subtle"
        class="w-full"
        placeholder="Type a date"
        aria-label="Type a date"
        @keydown.enter="commitTyped"
        @blur="commitTyped"
      />
    </div>

    <div class="flex">
      <!-- sidebar: shortcuts -->
      <div
        v-if="sidebar"
        class="flex w-[122px] shrink-0 flex-col gap-px p-1 shadow-[inset_-1px_0_0_var(--outline-gray-1)]"
        aria-label="Shortcuts"
      >
        <Button
          v-for="s in SHORTCUTS"
          :key="s.label"
          variant="ghost"
          size="sm"
          class="dp-shortcut w-full !justify-start"
          :label="s.label"
          @click="pickShortcut(s.days)"
        />
      </div>

      <!-- a fixed width: 196 for one month, 392 for two -->
      <div
        class="dp-cal shrink-0"
        :class="isRange && doublePane ? 'w-[392px]' : 'w-[196px]'"
      >
        <DateRangeCalendar
          v-if="isRange"
          :key="`${doublePane}-${calendarKey}`"
          v-model="range"
          :dual-pane="doublePane"
          today-label="Today"
          @today="calendarKey++"
        />
        <DateCalendar
          v-else
          :key="calendarKey"
          v-model="date"
          today-label="Today"
          @today="calendarKey++"
        />
      </div>
    </div>

    <!-- date & time: hour, minute, AM/PM -->
    <div
      v-if="variant === 'date-time'"
      class="dp-time flex gap-1 border-t border-outline-gray-1 p-2 pt-[7px]"
    >
      <Select
        v-model="hour"
        :options="hours"
        size="xs"
        variant="subtle"
        aria-label="Hour"
      />
      <Select
        v-model="minute"
        :options="minutes"
        size="xs"
        variant="subtle"
        aria-label="Minute"
      />
      <Select
        v-model="meridiem"
        :options="meridiems"
        size="xs"
        variant="subtle"
        aria-label="AM or PM"
      />
    </div>

    <!-- footer -->
    <div
      v-if="footer"
      class="flex items-center justify-between border-t border-outline-gray-1 p-2 pt-[7px]"
    >
      <Button
        variant="ghost"
        size="xs"
        class="!text-sm"
        label="Reset"
        @click="reset"
      />
      <div class="flex gap-1">
        <Button
          variant="subtle"
          size="xs"
          class="!text-sm"
          label="Cancel"
          @click="cancel"
        />
        <Button variant="solid" size="xs" class="!text-sm" label="Apply" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.dp-glyph {
  filter: none;
}

/* the shortcuts: menu items, 13 regular ink-gray-6 (node 35942:69507) */
.dp-shortcut {
  font-size: 13px;
  font-weight: 420;
  color: var(--ink-gray-6);
}

/* ---- the calendar body: 8 in, 6 under the month row ---- */
.dp-cal :deep(.select-none) {
  font-size: 12px;
}
.dp-cal :deep(.select-none > div:first-child) {
  padding: 8px 8px 0;
  height: 32px;
  gap: 0;
}
.dp-cal :deep(.select-none > div:last-child) {
  padding: 6px 8px 8px;
}

/* the month: an xs ghost button, 13 medium ink-gray-7, small-down after */
.dp-cal :deep(.select-none > div:first-child > button:first-child),
.dp-cal :deep(.select-none > div:first-child > span) {
  display: inline-flex;
  align-items: center;
  height: 24px;
  padding: 0 6px;
  gap: 2px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.02em;
  color: var(--ink-gray-7);
}
.dp-cal :deep([aria-label='cycle-calendar-view']::after) {
  content: '';
  width: 14px;
  height: 14px;
  background: currentColor;
  -webkit-mask: var(--dp-down) center / contain no-repeat;
  mask: var(--dp-down) center / contain no-repeat;
}
.dp-cal
  :deep(
    .select-none:has([aria-label='Select month and year'])
      [aria-label='cycle-calendar-view']::after
  ) {
  -webkit-mask-image: var(--dp-up);
  mask-image: var(--dp-up);
}

/* prev · today · next: xs ghost icon buttons, 22 wide, the file's glyphs */
.dp-cal :deep(.select-none > div:first-child button:has(.lucide-chevron-left)),
.dp-cal
  :deep(.select-none > div:first-child button:has(.lucide-chevron-right)) {
  height: 24px;
  width: 22px;
  min-width: 0;
  padding: 0;
  border-radius: 8px;
}
.dp-cal :deep(.select-none .lucide-chevron-left),
.dp-cal :deep(.select-none .lucide-chevron-right) {
  width: 14px;
  height: 14px;
  color: var(--ink-gray-7);
  -webkit-mask-image: var(--dp-left);
  mask-image: var(--dp-left);
}
.dp-cal :deep(.select-none .lucide-chevron-right) {
  -webkit-mask-image: var(--dp-right);
  mask-image: var(--dp-right);
}
/* the library's "Today" text button becomes the file's tomorrow glyph */
.dp-cal
  :deep(
    .select-none
      > div:first-child
      > div
      > button:not(:has(.lucide-chevron-left)):not(:has(.lucide-chevron-right))
  ) {
  height: 24px;
  width: 22px;
  min-width: 0;
  padding: 0;
  border-radius: 8px;
  justify-content: center;
  gap: 0;
  font-size: 0;
  color: var(--ink-gray-7);
}
.dp-cal
  :deep(
    .select-none
      > div:first-child
      > div
      > button:not(:has(.lucide-chevron-left)):not(
        :has(.lucide-chevron-right)
      )::before
  ) {
  content: '';
  width: 14px;
  height: 14px;
  background: currentColor;
  -webkit-mask: var(--dp-today) center / contain no-repeat;
  mask: var(--dp-today) center / contain no-repeat;
}

/* ---- the grid: 24 cells 2 apart, Monday first ---- */
.dp-cal :deep([role='grid'] > div:first-child) {
  margin-bottom: 2px;
  font-size: 0;
  font-weight: 420;
  text-transform: none;
}
.dp-cal :deep([role='grid'] > div:first-child > div) {
  width: 24px;
  height: 24px;
}
/* the library's letters are fixed Sunday-first; the weeks below are
   Monday-first (the page sets the locale), so the letters are relabelled */
.dp-cal :deep([role='grid'] > div:first-child > div::after) {
  font-size: 12px;
  letter-spacing: 0.02em;
  color: var(--ink-gray-4);
}
.dp-cal :deep([role='grid'] > div:first-child > div:nth-child(1)::after) {
  content: 'M';
}
.dp-cal :deep([role='grid'] > div:first-child > div:nth-child(2)::after) {
  content: 'T';
}
.dp-cal :deep([role='grid'] > div:first-child > div:nth-child(3)::after) {
  content: 'W';
}
.dp-cal :deep([role='grid'] > div:first-child > div:nth-child(4)::after) {
  content: 'T';
}
.dp-cal :deep([role='grid'] > div:first-child > div:nth-child(5)::after) {
  content: 'F';
}
.dp-cal :deep([role='grid'] > div:first-child > div:nth-child(6)::after) {
  content: 'S';
}
.dp-cal :deep([role='grid'] > div:first-child > div:nth-child(7)::after) {
  content: 'S';
}
/* only the weeks the month touches: the library always draws six */
.dp-cal :deep([role='row']:not(:has(button:not([data-outside-view])))) {
  display: none;
}
.dp-cal :deep([role='row'] > *) {
  width: 24px;
  height: 24px;
  border-radius: 5px;
  font-size: 12px;
  font-weight: 420;
  letter-spacing: 0.02em;
}
.dp-cal :deep([role='row'] > button:not([aria-selected='true'])) {
  color: var(--ink-gray-7);
}
.dp-cal
  :deep([role='row'] > button[data-outside-view]:not([aria-selected='true'])) {
  color: var(--ink-gray-4);
}

/* the date states (node 23667:9349): hover surface-gray-3; today a 1px
   outline-gray-6 ring, regular weight, ink-gray-7; disabled ink-gray-3 at
   full opacity (the library bolds today and fades disabled days) */
.dp-cal :deep([role='row'] > button:not([aria-selected='true']):hover) {
  background: var(--surface-gray-3);
}
.dp-cal :deep([role='row'] > button[aria-label$='(Today)']) {
  font-weight: 420;
}
.dp-cal
  :deep(
    [role='row'] > button[aria-label$='(Today)']:not([aria-selected='true'])
  ) {
  color: var(--ink-gray-7);
  box-shadow: inset 0 0 0 1px var(--outline-gray-6);
}
.dp-cal :deep([role='row'] > button[data-disabled]) {
  opacity: 1;
  color: var(--ink-gray-3);
}

/* the range: one surface-gray-1 bar from end to end */
.dp-cal :deep([role='row'] > button.bg-surface-gray-3) {
  background: var(--surface-gray-1);
  border-radius: 0;
  box-shadow: -2px 0 0 var(--surface-gray-1);
}
.dp-cal :deep([role='row'] > button.bg-surface-gray-3:first-child),
.dp-cal :deep([role='row'] > div + button.bg-surface-gray-3) {
  border-radius: 5px 0 0 5px;
  box-shadow: none;
}
/* the bar ends round at a week's end, or where the month's days stop
   (double pane leaves the days outside the month empty) */
.dp-cal :deep([role='row'] > button.bg-surface-gray-3:last-child),
.dp-cal :deep([role='row'] > button.bg-surface-gray-3:has(+ div)) {
  border-radius: 0 5px 5px 0;
}
.dp-cal :deep([role='row'] > div + button.bg-surface-gray-3:has(+ div)) {
  border-radius: 5px;
}
.dp-cal
  :deep(
    [role='row'] > button.bg-surface-gray-3 + button[aria-selected='true']
  ) {
  box-shadow: -2px 0 0 var(--surface-gray-1);
}

/* the month list: two columns 88 wide, 4 apart, rows 28 tall, 1 apart; the
   lists scroll without a bar, as the file's */
.dp-cal :deep([aria-label='Select month and year'] > div) {
  scrollbar-width: none;
}
.dp-cal :deep([aria-label='Select month and year']) {
  width: 180px;
  height: 202px;
  gap: 4px;
}
.dp-cal :deep([aria-label='Select month and year'] > div) {
  width: 88px;
  gap: 1px;
  padding: 0;
}
.dp-cal :deep([aria-label='Select month and year'] button) {
  height: 28px;
  padding: 0 8px;
  border-radius: 8px;
  font-size: 13px;
  color: var(--ink-gray-7);
}
.dp-cal :deep([aria-label='Select month and year'] button[data-selected]) {
  background: var(--surface-gray-2);
}

/* ---- double pane: a rule between, the month centred, no Today ---- */
.dp--double .dp-cal :deep(.divide-x > * + *) {
  border-color: var(--outline-gray-1);
}
.dp--double .dp-cal :deep(.select-none > div:first-child > button) {
  height: 24px;
  width: 24px;
  min-width: 0;
  padding: 0;
  border-radius: 8px;
}

/* ---- the time: the file's small-select chevrons, the selects 57 wide ---- */
/* the three selects share the row: fill, 4 apart (the user's call
   2026-10-09 — the file's 57 each left a gap once the picker grew) */
.dp-time > * {
  flex: 1 1 0;
  min-width: 0;
}
.dp-time :deep(button) {
  width: 100%;
}
.dp-time :deep([data-slot='chevron']) {
  width: 14px;
  height: 14px;
  color: var(--ink-gray-7);
  -webkit-mask-image: var(--dp-select);
  mask-image: var(--dp-select);
}
</style>

<style>
/* the time selects' lists show six options and scroll for the rest; the
   list is portalled out of the picker, so this is gated on the time row */
body:has(.dp-time) [data-slot='content'] [data-reka-select-viewport] {
  max-height: calc(6 * 24px + 8px);
}
</style>
