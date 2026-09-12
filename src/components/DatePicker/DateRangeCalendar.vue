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
import { computed, ref } from 'vue'
import type { Dayjs } from 'dayjs/esm'
import { dayjs, dayjsLocal } from '../../utils/dayjs'
import CalendarPanel from './CalendarPanel.vue'
import {
  makeUnavailableCheck,
  useCalendarView,
  useFocusedDate,
} from './composables'
import { generateRangeWeeks, rangeKey, stepRange } from './utils'
import type {
  CalendarPanelCell,
  CalendarPanelExposed,
  DateRangeCalendarEmits,
  DateRangeCalendarExposed,
  DateRangeCalendarProps,
} from './calendarTypes'
import type { DateRangeValue } from './types'

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

// The date under the cursor after the first click, for previewing the range.
const hoverDate = ref<Dayjs | null>(null)

function buildRangeWeeks(year: number, month: number): CalendarPanelCell[][] {
  // Until the end is picked, the previewed date and the cells between it and
  // `from` render as in-range. Only committed endpoints render as selected.
  // Hover takes priority over keyboard focus as the preview.
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
// The second pane renders only for the day grid. The month-year view falls
// back to one panel.

const isDualPaneActive = computed(() => props.dualPane && view.value === 'date')

const rightAnchor = computed(() =>
  dayjs().year(currentYear.value).month(currentMonth.value).add(1, 'month'),
)
const rightYear = computed(() => rightAnchor.value.year())
const rightMonth = computed(() => rightAnchor.value.month())
const rightWeeks = computed<CalendarPanelCell[][]>(() =>
  buildRangeWeeks(rightYear.value, rightMonth.value),
)

// ── Keyboard focus ───────────────────────────────────────────────────────────

const leftPanelRef = ref<CalendarPanelExposed | null>(null)
const rightPanelRef = ref<CalendarPanelExposed | null>(null)

const { focusedDate, markOwnCommit, focus } = useFocusedDate({
  key: () => rangeKey(model.value),
  anchor: () => (fromDate.value ? dayjs(fromDate.value) : null),
  months: () =>
    isDualPaneActive.value
      ? [
          { year: currentYear.value, month: currentMonth.value },
          { year: rightYear.value, month: rightMonth.value },
        ]
      : [{ year: currentYear.value, month: currentMonth.value }],
  isUnavailable: checkUnavailable,
  focusOn,
  resetView,
  panels: () => [leftPanelRef.value, rightPanelRef.value],
})

function onPanelNavigate(target: Dayjs): void {
  // In dual pane the target may be visible in the other panel. Then only the
  // focused date moves, and that panel focuses its matching cell.
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

// ── Selection ────────────────────────────────────────────────────────────────

// `v-model` does not emit when the range is unchanged. `select` and `today`
// fire on every click, so a parent can react to re-selecting the current range.
function commit(range: DateRangeValue): void {
  if (range[0] && range[1]) hoverDate.value = null
  markOwnCommit(rangeKey(range))
  model.value = range
}

function select(date: Dayjs): void {
  if (checkUnavailable(date)) return
  const range = stepRange([fromDate.value, toDate.value], date)
  commit(range)
  emit('select', range)
}

function selectToday(): void {
  const today = dayjsLocal().startOf('day')
  if (checkUnavailable(today)) return
  const value = today.format(DATE_FORMAT)
  const range: DateRangeValue = [value, value]
  commit(range)
  emit('today', range)
}

function onCellHover(d: Dayjs | null): void {
  hoverDate.value = fromDate.value && !toDate.value ? d : null
}

defineExpose<DateRangeCalendarExposed>({ focus })
</script>
