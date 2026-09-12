<template>
  <div
    class="flex"
    :class="isDualPaneActive ? 'divide-x divide-outline-gray-2' : ''"
  >
    <CalendarPanel
      ref="leftPanelRef"
      :view="view"
      :current-year="currentYear"
      :current-month="currentMonth"
      :weeks="weeks"
      :today-label="isDualPaneActive ? '' : props.todayLabel"
      :hide-next="isDualPaneActive"
      :hide-out-of-month="isDualPaneActive"
      :center-header="isDualPaneActive"
      :min="props.min"
      :max="props.max"
      v-model:focused-date="focusedDate"
      @prev="prev"
      @next="next"
      @today="selectToday"
      @cycle-view="cycleView"
      @select-month="selectMonth"
      @select-year="selectYear"
      @select-date="select"
      @hover-cell="onCellHover"
      @navigate="onPanelNavigate"
    />
    <CalendarPanel
      v-if="isDualPaneActive"
      ref="rightPanelRef"
      :view="view"
      :current-year="rightYear"
      :current-month="rightMonth"
      :weeks="rightWeeks"
      hide-prev
      hide-today
      hide-out-of-month
      center-header
      :min="props.min"
      :max="props.max"
      v-model:focused-date="focusedDate"
      @next="next"
      @cycle-view="cycleView"
      @select-date="select"
      @hover-cell="onCellHover"
      @navigate="onPanelNavigate"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { Dayjs } from 'dayjs/esm'
import { dayjs, dayjsLocal } from '../../utils/dayjs'
import CalendarPanel from './CalendarPanel.vue'
import { makeUnavailableCheck, useCalendarView } from './composables'
import { generateRangeWeeks, stepRange } from './utils'
import type {
  CalendarPanelCell,
  DateRangeCalendarEmits,
  DateRangeCalendarProps,
  DateRangeValue,
} from './types'

const props = withDefaults(defineProps<DateRangeCalendarProps>(), {
  todayLabel: 'Today',
  dualPane: false,
})

const emit = defineEmits<DateRangeCalendarEmits>()

/** Selected range as `[from, to]` in `YYYY-MM-DD` format, or `[]` when empty. */
const model = defineModel<DateRangeValue>({ default: () => [] })

const DATE_FORMAT = 'YYYY-MM-DD'

const fromDate = computed<string>(() => model.value[0] ?? '')
const toDate = computed<string>(() => model.value[1] ?? '')

const {
  view,
  currentYear,
  currentMonth,
  prev,
  next,
  cycleView,
  selectMonth,
  selectYear,
  focusOn,
  resetView,
} = useCalendarView()

const checkUnavailable = makeUnavailableCheck(
  () => props.min,
  () => props.max,
  () => props.isDateUnavailable,
)

// Tracks the date under the cursor while the user is mid-selection (start
// picked, end not yet) so the in-progress range can be previewed.
const hoverDate = ref<Dayjs | null>(null)

function buildRangeWeeks(year: number, month: number): CalendarPanelCell[][] {
  // While picking the end date, the previewed cell and everything between
  // `from` and it render as in-range — only committed endpoints get the dark
  // "selected" treatment. Mouse hover and keyboard focus both act as the
  // preview anchor; mouse wins when both exist.
  return generateRangeWeeks({
    year,
    monthIndex: month,
    from: fromDate.value,
    to: toDate.value,
    preview: hoverDate.value ?? focusedDate.value,
    isUnavailable: checkUnavailable,
  })
}

const weeks = computed<CalendarPanelCell[][]>(() =>
  buildRangeWeeks(currentYear.value, currentMonth.value),
)

// ── Dual pane ────────────────────────────────────────────────────────────────
// The second pane only renders for the day grid; cycling to the month-year
// split view falls back to a single panel to avoid duplicate selectors.

const isDualPaneActive = computed(() => props.dualPane && view.value === 'date')

const rightAnchor = computed(() =>
  dayjs().year(currentYear.value).month(currentMonth.value).add(1, 'month'),
)
const rightYear = computed(() => rightAnchor.value.year())
const rightMonth = computed(() => rightAnchor.value.month())
const rightWeeks = computed<CalendarPanelCell[][]>(() =>
  buildRangeWeeks(rightYear.value, rightMonth.value),
)

// ── Selection ────────────────────────────────────────────────────────────────

// A range this calendar committed itself is not followed into view: the click
// that made it already landed in a month the user can see, and following it
// would drag the view along when that click was on an out-of-month cell or on
// the second pane.
let committed: string | null = null

function serialize(range: DateRangeValue): string {
  return `${range[0] ?? ''},${range[1] ?? ''}`
}

function commit(range: DateRangeValue): void {
  if (range[0] && range[1]) hoverDate.value = null
  committed = serialize(range)
  model.value = range
}

function select(date: Dayjs): void {
  if (checkUnavailable(date)) return
  commit(stepRange([fromDate.value, toDate.value], date))
}

function selectToday(): void {
  const today = dayjsLocal().startOf('day')
  if (checkUnavailable(today)) return
  // Ahead of the commit, so a parent can fold its own state into the value
  // the commit carries instead of emitting a second time.
  emit('today')
  const value = today.format(DATE_FORMAT)
  commit([value, value])
}

function onCellHover(d: Dayjs | null): void {
  hoverDate.value = fromDate.value && !toDate.value ? d : null
}

// ── Keyboard focus ───────────────────────────────────────────────────────────
// CalendarPanel keeps the roving tabindex controlled, so the focused date is
// seeded here — at setup, so both panels' very first render already agrees on
// which cell carries `tabindex=0` instead of racing each other to seed it.

const leftPanelRef = ref<{ focusInitialCell: () => void } | null>(null)
const rightPanelRef = ref<{ focusInitialCell: () => void } | null>(null)
const focusedDate = ref<Dayjs | null>(null)

function seedFocusedDate(): void {
  if (fromDate.value) {
    const d = dayjs(fromDate.value)
    if (d.isValid() && !checkUnavailable(d)) {
      focusedDate.value = d
      return
    }
  }
  const cells = [...weeks.value.flat(), ...rightWeeks.value.flat()]
  const today = cells.find((c) => c.isToday && c.inMonth && !c.isUnavailable)
  if (today) {
    focusedDate.value = today.date
    return
  }
  const first = cells.find((c) => c.inMonth && !c.isUnavailable)
  if (first) focusedDate.value = first.date
}

// The grid follows the value into its month, drops the month-year split view
// and hands the roving tabindex to the start date, so `focus()` and Tab land
// on it rather than on a cell of the month left behind. Immediate, so a
// calendar mounted on a range opens on the month its start falls in.
watch(
  () => serialize(model.value),
  (value) => {
    if (value === committed) return
    resetView()
    const d = fromDate.value ? dayjs(fromDate.value) : null
    if (d?.isValid()) focusOn(d)
    seedFocusedDate()
  },
  { immediate: true },
)

function onPanelNavigate(target: Dayjs): void {
  // In dual-pane the target may already be visible in the sibling panel. Then
  // the view stays put and only the focused date moves, so the sibling's watch
  // picks it up and focuses its own matching cell.
  if (isDualPaneActive.value) {
    const inLeft =
      target.month() === currentMonth.value &&
      target.year() === currentYear.value
    const inRight =
      target.month() === rightMonth.value && target.year() === rightYear.value
    if (inLeft || inRight) {
      focusedDate.value = target
      return
    }
  }
  focusOn(target)
}

/** Move keyboard focus into the day grid. */
function focus(): void {
  leftPanelRef.value?.focusInitialCell()
  rightPanelRef.value?.focusInitialCell()
}

defineExpose({ focus })
</script>
