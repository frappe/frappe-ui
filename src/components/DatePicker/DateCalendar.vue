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
import { computed, ref } from 'vue'
import type { Dayjs } from 'dayjs/esm'
import { dayjs, dayjsLocal } from '../../utils/dayjs'
import CalendarPanel from './CalendarPanel.vue'
import {
  makeUnavailableCheck,
  useCalendarView,
  useFocusedDate,
} from './composables'
import { generateWeeks } from './utils'
import type {
  CalendarPanelCell,
  CalendarPanelExposed,
  DateCalendarEmits,
  DateCalendarExposed,
  DateCalendarProps,
} from './calendarTypes'

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

const panelRef = ref<CalendarPanelExposed | null>(null)

const { focusedDate, markOwnCommit, focus } = useFocusedDate({
  key: () => model.value,
  anchor: () => (model.value ? dayjs(model.value) : null),
  months: () => [{ year: currentYear.value, month: currentMonth.value }],
  isUnavailable: checkUnavailable,
  focusOn,
  resetView,
  panels: () => [panelRef.value],
})

// `v-model` does not emit when the value is unchanged. `select` and `today`
// fire on every click, so a parent can react to re-selecting the current value.
function commit(value: string): void {
  markOwnCommit(value)
  model.value = value
}

function select(date: Dayjs): void {
  if (checkUnavailable(date)) return
  const value = date.format(DATE_FORMAT)
  commit(value)
  emit('select', value)
}

function selectToday(): void {
  const today = dayjsLocal()
  if (checkUnavailable(today)) return
  const value = today.format(DATE_FORMAT)
  commit(value)
  emit('today', value)
}

defineExpose<DateCalendarExposed>({ focus })
</script>
