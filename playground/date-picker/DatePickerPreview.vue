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
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import dayjs from 'dayjs/esm'
import { Button, Select, TextInput } from '../../src'
import DateCalendar from '../../src/components/DatePicker/DateCalendar.vue'
import DateRangeCalendar from '../../src/components/DatePicker/DateRangeCalendar.vue'
import type { DateRangeValue } from '../../src/components/DatePicker/types'
import { parseDate } from './parseDate'
import iconLeft from './icons/small-left.svg?url'
import iconRight from './icons/small-right.svg?url'
import iconToday from './icons/tomorrow.svg?url'
import iconDown from './icons/small-down.svg?url'
import iconUp from './icons/small-up.svg?url'
import iconSelect from './icons/small-select.svg?url'
import iconCalendar from './icons/calendar.svg?url'

export type DatePickerVariant = 'default' | 'inline' | 'date-time'

const props = withDefaults(
  defineProps<{
    variant: DatePickerVariant
    range?: boolean
    doublePane?: boolean
    header?: boolean
    footer?: boolean
    sidebar?: boolean
    /** A date (`YYYY-MM-DD`) or a range, when the picker is put to use
     * elsewhere — the calendar's month switcher and its event panel. Left
     * out, the picker shows the file's own dates. */
    modelValue?: string | DateRangeValue
    /** Keep the top edge where it is when the month list opens (the page
     * centres the picker); a picker in a popover hangs from its top anyway. */
    holdTop?: boolean
  }>(),
  {
    range: false,
    doublePane: false,
    header: false,
    footer: false,
    sidebar: false,
    modelValue: undefined,
    holdTop: true,
  },
)
const emit = defineEmits<{ 'update:modelValue': [string | DateRangeValue] }>()

// the file's dates: June 9, 2023; the range 5–11 June; double pane 26 June
// to 4 July
const START_DATE = '2023-06-09'
const startRange = (): DateRangeValue =>
  props.doublePane ? ['2023-06-26', '2023-07-04'] : ['2023-06-05', '2023-06-11']

const given = props.modelValue
const date = ref(typeof given === 'string' ? given : START_DATE)
const range = ref<DateRangeValue>(
  Array.isArray(given) ? [...given] : startRange(),
)
watch(
  () => props.doublePane,
  () => given === undefined && (range.value = startRange()),
)
// in use: the value follows the owner's, and a pick goes back to it — a
// range once both its ends are in
watch(
  () => props.modelValue,
  (v) => {
    if (typeof v === 'string') date.value = v
    else if (Array.isArray(v)) range.value = [...v]
  },
)
watch(date, (v) => {
  if (typeof props.modelValue === 'string' && v && v !== props.modelValue)
    emit('update:modelValue', v)
})
watch(range, (r) => {
  const v = props.modelValue
  if (Array.isArray(v) && r[0] && r[1] && (r[0] !== v[0] || r[1] !== v[1]))
    emit('update:modelValue', [r[0], r[1]])
})

// the weekday letters follow the week's start: the file's Monday, or
// Sunday where the page keeps dayjs's default (the calendar)
const sundayFirst = (dayjs.Ls.en?.weekStart ?? 0) === 0

// the file's time, 10:30 AM
const hour = ref('10')
const minute = ref('30')
const meridiem = ref('AM')
const hours = Array.from({ length: 12 }, (_, i) => String(i + 1))
const minutes = Array.from({ length: 12 }, (_, i) =>
  String(i * 5).padStart(2, '0'),
)
const meridiems = ['AM', 'PM']

// ---- the time lists open over their field, the current value sitting
// exactly on it (the macOS way), six options tall, scrolling for the rest.
// reka's own item-aligned placement does the first part but runs the list to
// the window's edges; once it has placed the list, it is cut to six rows
// around the current one and moved so that row stays on the field
const ITEM = 28
const ROWS = 6
const PAD = 4
let observer: MutationObserver | null = null
function fitTimeList(viewport: HTMLElement) {
  const trigger = document.querySelector<HTMLElement>(
    '.dp-time button[aria-expanded="true"]',
  )
  const wrapper = viewport.closest<HTMLElement>(
    '[data-slot="content"]',
  )?.parentElement
  if (!trigger || !wrapper) return
  const options = [...viewport.querySelectorAll<HTMLElement>('[role="option"]')]
  const k = options.findIndex((o) => o.getAttribute('data-state') === 'checked')
  if (k < 0) return
  const rows = Math.min(ROWS, options.length)
  // the current row 4th from the top where the list allows (07 08 09 [10] 11 12)
  const start = Math.max(0, Math.min(k - 3, options.length - rows))
  const height = rows * ITEM + PAD * 2
  const t = trigger.getBoundingClientRect()
  const top = t.top + t.height / 2 - (PAD + (k - start) * ITEM + ITEM / 2)
  const set = (prop: string, value: string) =>
    wrapper.style.setProperty(prop, value, 'important')
  set('top', `${Math.round(top)}px`)
  set('bottom', 'auto')
  set('margin', '0')
  set('height', `${height}px`)
  set('min-height', `${height}px`)
  set('max-height', `${height}px`)
  viewport.scrollTop = start * ITEM
}
onMounted(() => {
  observer = new MutationObserver(() => {
    const viewport = document.querySelector<HTMLElement>(
      '[data-slot="content"] [data-reka-select-viewport]',
    )
    if (!viewport || viewport.dataset.dpFitted) return
    if (!document.querySelector('.dp-time button[aria-expanded="true"]')) return
    viewport.dataset.dpFitted = '1'
    // marks the list as a time list, for its 28px rows (style below)
    viewport.closest('[data-slot="content"]')?.classList.add('dp-time-list')
    // after reka's own placement (it runs on the next frames)
    requestAnimationFrame(() =>
      requestAnimationFrame(() => fitTimeList(viewport)),
    )
  })
  observer.observe(document.body, { childList: true, subtree: true })
})
onUnmounted(() => observer?.disconnect())

// ---- the month list opens in place: the picker's top edge stays where the
// calendar's was (the user's call 2026-10-13). The page centres the picker,
// so a taller month list would push its top up; the difference is taken back
// from the margin below, and the picker grows downward instead
const root = ref<HTMLElement | null>(null)
let calendarHeight = 0
let sizer: ResizeObserver | null = null
let watcher: MutationObserver | null = null
let watcher2: MutationObserver | null = null
// set on the element directly and from a MutationObserver — it runs as the
// month list goes in, before the frame is laid out and drawn — so no frame
// shows the picker moved (a ResizeObserver alone let one through)
function holdInPlace() {
  fadeLists()
  const el = root.value
  if (!el || !props.holdTop) return
  el.style.marginBottom = '0px'
  const h = el.offsetHeight
  if (el.querySelector('[aria-label="Select month and year"]'))
    el.style.marginBottom = `${calendarHeight - h}px`
  else calendarHeight = h
}
// ---- the month list's columns fade at an edge they can scroll past — the
// 16px fade Agenda V2 hangs under its stuck week label — and stay crisp at
// an edge they rest on (the user's call 2026-10-13)
function fadeLists() {
  root.value
    ?.querySelectorAll<HTMLElement>(
      '[aria-label="Select month and year"] > div',
    )
    .forEach((col) => {
      const top = col.scrollTop > 0
      const bottom = col.scrollTop + col.clientHeight < col.scrollHeight - 1
      if (top !== col.hasAttribute('data-fade-top'))
        col.toggleAttribute('data-fade-top', top)
      if (bottom !== col.hasAttribute('data-fade-bottom'))
        col.toggleAttribute('data-fade-bottom', bottom)
    })
}
onMounted(() => {
  if (!root.value) return
  // scroll doesn't bubble: caught on the way down
  root.value.addEventListener('scroll', fadeLists, true)
  sizer = new ResizeObserver(holdInPlace)
  sizer.observe(root.value)
  watcher = new MutationObserver(holdInPlace)
  watcher.observe(root.value, { childList: true, subtree: true })
  // the library scrolls the current year into view after it opens
  watcher2 = new MutationObserver(() => requestAnimationFrame(fadeLists))
  watcher2.observe(root.value, { childList: true, subtree: true })
})
onUnmounted(() => {
  sizer?.disconnect()
  watcher?.disconnect()
  watcher2?.disconnect()
  root.value?.removeEventListener('scroll', fadeLists, true)
})

// ---- header: type a date, Enter (or leaving the field) picks it
// in plain language: see parseDate.ts for what it reads
const DISPLAY = 'D MMM YYYY'
const parse = (text: string, from?: string) =>
  parseDate(
    text,
    dayjs(),
    dayjs(date.value || range.value[0] || undefined),
    from ? dayjs(from) : dayjs(),
  )
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
// after a commit the field always shows the date it picked, written out
// (on the next tick: the field's own text has to land first, or setting it
// back to the same formatted value is a no-op and the typed text stays)
function commitTyped() {
  const v = parse(typed.value)
  if (v) date.value = v
  nextTick(() => (typed.value = show(date.value)))
}
// one pane, one field, shortened where the dates share a month or a year:
// "5 – 11 Jun 2023", "26 Jun – 4 Jul 2023"
function showRange([from, to]: DateRangeValue) {
  if (!from) return ''
  if (!to) return `${show(from)} – `
  const a = dayjs(from)
  const b = dayjs(to)
  const head = !a.isSame(b, 'year')
    ? show(from)
    : !a.isSame(b, 'month')
      ? a.format('D MMM')
      : a.format('D')
  return `${head} – ${show(to)}`
}
const typedRange = ref('')
watch(range, (r) => (typedRange.value = showRange(r)), { immediate: true })
function commitTypedRange() {
  const [a = '', b = ''] = typedRange.value.split(/\s+[–-]\s+|\s+to\s+/)
  // a bare start ("5 – 11 Jun") borrows its month and year from the end
  const parts = b.trim().split(/\s+/)
  const borrowed =
    parse(`${a} ${parts.slice(-2).join(' ')}`) ||
    parse(`${a} ${parts.slice(-1)}`)
  const from = /^\d{1,2}$/.test(a.trim()) ? borrowed : parse(a) || borrowed
  // the end counts from the start ("8 jun – 4 thursdays")
  const to = parse(b, from || undefined)
  if (from && to) range.value = from <= to ? [from, to] : [to, from]
  nextTick(() => (typedRange.value = showRange(range.value)))
}
function commitRange(which: 0 | 1) {
  // the end, typed relatively, counts from the start already picked
  const v = which
    ? parse(typedTo.value, range.value[0] || undefined)
    : parse(typedFrom.value)
  if (v) {
    const next: DateRangeValue = [...range.value]
    next[which] = v
    if (next[0] && next[1] && next[0] > next[1]) next.reverse()
    range.value = next
  }
  nextTick(() => {
    typedFrom.value = show(range.value[0])
    typedTo.value = show(range.value[1])
  })
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

// the sun button goes back to today's month — it doesn't pick a date; today
// shows in its outline (the date states, node 23667:9349). The library's
// Today button picks today instead, so its click is taken here and the
// calendar is stepped month by month with its own prev / next buttons
const calendarKey = ref(0)
// a fresh calendar on every variant change, so a month list left open in
// Default doesn't carry into Inline (which has none)
watch(
  () => props.variant,
  () => calendarKey.value++,
)
const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]
function goToToday(e: MouseEvent) {
  const btn = (e.target as HTMLElement).closest('button')
  // inline has no month list: the month is only a label
  if (
    props.variant === 'inline' &&
    btn?.getAttribute('aria-label') === 'cycle-calendar-view'
  ) {
    e.stopPropagation()
    e.preventDefault()
    return
  }
  const nav = btn?.parentElement
  if (!btn || !nav || btn !== nav.children[1] || nav.children.length !== 3)
    return
  e.stopPropagation()
  e.preventDefault()
  const root = btn.closest('.dp-cal')!
  const label = root.querySelector('[aria-label="cycle-calendar-view"]')
  const [m, y] = (label?.textContent ?? '').trim().split(/\s+/)
  const shown = Number(y) * 12 + MONTHS.indexOf(m)
  const now = dayjs()
  let steps = now.year() * 12 + now.month() - shown
  const step = nav.children[steps > 0 ? 2 : 0] as HTMLButtonElement
  while (steps !== 0) {
    step.click()
    steps += steps > 0 ? -1 : 1
  }
}

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
    ref="root"
    class="dp inline-flex flex-col"
    :style="icons"
    :class="[
      variant === 'inline'
        ? 'dp--inline'
        : 'rounded-6 bg-surface-elevation-2 shadow-xl',
      isRange && doublePane && 'dp--double',
      isRange && range[0] && !range[1] && 'dp--picking',
      sundayFirst && 'dp--sun',
    ]"
  >
    <!-- header: type a date -->
    <div
      v-if="header"
      class="flex w-0 min-w-full gap-2 border-b border-outline-gray-1 p-2 pb-[7px]"
    >
      <template v-if="isRange && doublePane">
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
        v-else-if="isRange"
        v-model="typedRange"
        size="xs"
        variant="subtle"
        class="w-full"
        placeholder="Type a range"
        aria-label="Type a range"
        @keydown.enter="commitTypedRange"
        @blur="commitTypedRange"
      >
        <template #prefix>
          <img :src="iconCalendar" alt="" class="dp-glyph size-3.5" />
        </template>
      </TextInput>
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
        @click.capture="goToToday"
        :class="isRange && doublePane ? 'w-[392px]' : 'w-[196px]'"
      >
        <DateRangeCalendar
          v-if="isRange"
          :key="`${doublePane}-${calendarKey}`"
          v-model="range"
          :dual-pane="doublePane"
          today-label="Today"
        />
        <DateCalendar
          v-else
          :key="calendarKey"
          v-model="date"
          today-label="Today"
        />
      </div>
    </div>

    <!-- date & time: hour, minute, AM/PM -->
    <div
      v-if="variant === 'date-time'"
      class="dp-time flex w-0 min-w-full gap-1 border-t border-outline-gray-1 p-2 pt-[7px]"
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
      class="flex w-0 min-w-full items-center justify-between border-t border-outline-gray-1 p-2 pt-[7px]"
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
/* Sunday first (the calendar's week): S M T W T F S */
.dp--sun
  .dp-cal
  :deep([role='grid'] > div:first-child > div:nth-child(1)::after),
.dp--sun
  .dp-cal
  :deep([role='grid'] > div:first-child > div:nth-child(7)::after) {
  content: 'S';
}
.dp--sun
  .dp-cal
  :deep([role='grid'] > div:first-child > div:nth-child(2)::after) {
  content: 'M';
}
.dp--sun
  .dp-cal
  :deep([role='grid'] > div:first-child > div:nth-child(3)::after),
.dp--sun
  .dp-cal
  :deep([role='grid'] > div:first-child > div:nth-child(5)::after) {
  content: 'T';
}
.dp--sun
  .dp-cal
  :deep([role='grid'] > div:first-child > div:nth-child(4)::after) {
  content: 'W';
}
.dp--sun
  .dp-cal
  :deep([role='grid'] > div:first-child > div:nth-child(6)::after) {
  content: 'F';
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

/* today inside the range keeps its own rounded ring (the user's call
   2026-10-13): the bar runs on square behind it, the ring drawn over it */
.dp-cal :deep([role='row'] > button.bg-surface-gray-3[aria-label$='(Today)']) {
  position: relative;
  box-shadow: -2px 0 0 var(--surface-gray-1);
}
.dp-cal
  :deep(
    [role='row'] > button.bg-surface-gray-3[aria-label$='(Today)']::before
  ) {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 5px;
  box-shadow: inset 0 0 0 1px var(--outline-gray-6);
  pointer-events: none;
}
.dp-cal
  :deep(
    [role='row'] > button.bg-surface-gray-3:first-child[aria-label$='(Today)']
  ),
.dp-cal
  :deep([role='row'] > div + button.bg-surface-gray-3[aria-label$='(Today)']) {
  box-shadow: none;
}

/* while the end is being picked, the hovered day is the bar's end: it
   rounds on its open side — the right, or the left when it comes before
   the start */
.dp--picking .dp-cal :deep([role='row'] > button.bg-surface-gray-3:hover) {
  border-radius: 0 5px 5px 0;
}
.dp--picking
  .dp-cal
  :deep(
    [role='row']
      > button.bg-surface-gray-3:hover:is(
        :has(+ button.bg-surface-gray-3),
        :has(+ button[aria-selected='true'])
      )
  ) {
  border-radius: 5px 0 0 5px;
  box-shadow: none;
}
.dp--picking
  .dp-cal
  :deep(
    [role='row']
      > div
      + button.bg-surface-gray-3:hover:not(
        :has(+ button.bg-surface-gray-3)
      ):not(:has(+ button[aria-selected='true']))
  ),
.dp--picking
  .dp-cal
  :deep(
    [role='row']
      > button.bg-surface-gray-3:first-child:hover:not(
        :has(+ button.bg-surface-gray-3)
      ):not(:has(+ button[aria-selected='true']))
  ) {
  border-radius: 5px;
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

/* the fade: 16px at whichever edge has more list past it */
.dp-cal :deep([aria-label='Select month and year'] > div) {
  --fade-top: 0px;
  --fade-bottom: 0px;
  -webkit-mask-image: linear-gradient(
    to bottom,
    transparent 0,
    #000 var(--fade-top),
    #000 calc(100% - var(--fade-bottom)),
    transparent 100%
  );
  mask-image: linear-gradient(
    to bottom,
    transparent 0,
    #000 var(--fade-top),
    #000 calc(100% - var(--fade-bottom)),
    transparent 100%
  );
}
.dp-cal :deep([aria-label='Select month and year'] > div[data-fade-top]) {
  --fade-top: 16px;
}
.dp-cal :deep([aria-label='Select month and year'] > div[data-fade-bottom]) {
  --fade-bottom: 16px;
}

/* the month list is the whole body: the time row steps aside */
.dp:has([aria-label='Select month and year']) .dp-time {
  display: none;
}

/* inline: the month is a plain label — no month list, so no chevron and no
   button look; the arrows still move between months */
.dp--inline .dp-cal :deep([aria-label='cycle-calendar-view']) {
  pointer-events: none;
}
.dp--inline .dp-cal :deep([aria-label='cycle-calendar-view']::after) {
  display: none;
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
/* the time lists' options are the file's menu items: 28 tall, radius 8 (the
   list is portalled out of the picker; the page marks it) */
.dp-time-list [role='option'] {
  min-height: 28px !important;
  height: 28px !important;
  border-radius: 8px !important;
}
/* the row's content centred in the taller row */
.dp-time-list [role='option'] {
  display: flex;
  align-items: center;
}
.dp-time-list [role='option'] > * {
  flex: 1;
  min-height: 0 !important;
  height: auto !important;
}
</style>
