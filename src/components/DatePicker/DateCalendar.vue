<template>
  <CalendarPanel
    ref="panelRef"
    :view="view"
    :current-year="currentYear"
    :current-month="currentMonth"
    :weeks="weeks"
    :today-label="props.todayLabel"
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
    @navigate="focusOn"
  />
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { Dayjs } from 'dayjs/esm'
import { dayjs, dayjsLocal } from '../../utils/dayjs'
import CalendarPanel from './CalendarPanel.vue'
import { makeUnavailableCheck, useCalendarView } from './composables'
import { generateWeeks } from './utils'
import type {
  CalendarPanelCell,
  DateCalendarEmits,
  DateCalendarProps,
} from './types'

const props = withDefaults(defineProps<DateCalendarProps>(), {
  todayLabel: 'Today',
})

const emit = defineEmits<DateCalendarEmits>()

/** Selected date in `YYYY-MM-DD` format, or `''` when nothing is selected. */
const model = defineModel<string>({ default: '' })

const DATE_FORMAT = 'YYYY-MM-DD'

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

const weeks = computed<CalendarPanelCell[][]>(() =>
  generateWeeks(currentYear.value, currentMonth.value, model.value).map(
    (week) =>
      week.map((d) => ({ ...d, isUnavailable: checkUnavailable(d.date) })),
  ),
)

function select(date: Dayjs): void {
  if (checkUnavailable(date)) return
  model.value = date.format(DATE_FORMAT)
}

function selectToday(): void {
  const today = dayjsLocal()
  if (checkUnavailable(today)) return
  // Ahead of the commit, so a parent can fold its own state into the value
  // the commit carries instead of emitting a second time.
  emit('today')
  select(today)
}

// ── Keyboard focus ───────────────────────────────────────────────────────────
// CalendarPanel keeps the roving tabindex controlled, so the focused date is
// seeded here — at setup, so the panel's very first render already puts
// `tabindex=0` on the cell `focus()` will land on.

const panelRef = ref<{ focusInitialCell: () => void } | null>(null)
const focusedDate = ref<Dayjs | null>(null)

function seedFocusedDate(): void {
  if (model.value) {
    const d = dayjs(model.value)
    if (d.isValid() && !checkUnavailable(d)) {
      focusedDate.value = d
      return
    }
  }
  const cells = weeks.value.flat()
  const today = cells.find((c) => c.isToday && c.inMonth && !c.isUnavailable)
  if (today) {
    focusedDate.value = today.date
    return
  }
  const first = cells.find((c) => c.inMonth && !c.isUnavailable)
  if (first) focusedDate.value = first.date
}

// The grid follows the value: a date brings its own month into view, drops the
// month-year split view and takes the roving tabindex, so `focus()` and Tab
// land on it rather than on a cell of the month left behind. Immediate, so a
// calendar mounted on a value opens on that value's month rather than today's.
watch(
  () => model.value,
  (val) => {
    resetView()
    const d = val ? dayjs(val) : null
    if (d?.isValid()) focusOn(d)
    seedFocusedDate()
  },
  { immediate: true },
)

/** Move keyboard focus into the day grid. */
function focus(): void {
  panelRef.value?.focusInitialCell()
}

defineExpose({ focus })
</script>
