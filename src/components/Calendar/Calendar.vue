<template>
  <div class="flex h-full flex-col overflow-hidden">
    <slot
      name="header"
      v-bind="{
        currentMonthYear,
        currentYear,
        currentMonth,
        enabledModes,
        activeView,
        decrement,
        increment,
        updateActiveView,
        setCalendarDate,
        onMonthYearChange,
        selectedMonthDate,
      }"
    >
      <div class="mb-2 flex justify-between">
        <!-- left side  -->
        <!-- Year, Month -->
        <div class="flex items-center">
          <DatePicker
            :modelValue="selectedMonthDate"
            @update:modelValue="(val) => onMonthYearChange(val)"
            :clearable="false"
          >
            <template #target="{ togglePopover }">
              <Button
                variant="ghost"
                class="text-lg font-medium text-ink-gray-7"
                :label="currentMonthYear"
                iconRight="chevron-down"
                @click="togglePopover"
              />
            </template>
          </DatePicker>
        </div>
        <!-- right side -->
        <!-- actions buttons for calendar -->
        <div class="flex gap-x-1">
          <!-- Increment and Decrement Button-->

          <Button @click="decrement" variant="ghost" icon="chevron-left" />
          <Button label="Today" @click="setCalendarDate()" variant="ghost" />
          <Button @click="increment" variant="ghost" icon="chevron-right" />

          <!--  View change button, default is months or can be set via props!  -->
          <TabButtons
            :buttons="enabledModes"
            class="ml-2"
            v-model="activeView"
          />
        </div>
      </div>
    </slot>

    <CalendarMonthly
      v-if="activeView === 'Month'"
      :events="events"
      :currentMonth="currentMonth"
      :currentMonthDates="currentMonthDates"
      :config="overrideConfig"
      @setCurrentDate="(d) => updateCurrentDate(d)"
    />

    <CalendarWeekly
      v-else-if="activeView === 'Week'"
      :events="events"
      :weeklyDates="datesInWeeks[week]"
      :config="overrideConfig"
    />

    <CalendarDaily
      v-else-if="activeView === 'Day'"
      :events="events"
      :current-date="selectedDay"
      :config="overrideConfig"
    >
      <template #header="{ parseDateWithDay, currentDate, fullDay }">
        <slot
          name="daily-header"
          v-bind="{ parseDateWithDay, currentDate, fullDay }"
        />
      </template>
    </CalendarDaily>

    <NewEventModal
      v-if="showEventModal"
      v-model="showEventModal"
      :event="newEvent"
    />
  </div>
</template>
<script setup>
import {
  computed,
  onMounted,
  onUnmounted,
  provide,
  ref,
  watch,
  nextTick,
} from 'vue'
import { Button } from '../Button'
import { TabButtons } from '../TabButtons'
import {
  getCalendarDates,
  monthList,
  handleSeconds,
  formatMonthYear,
  getWeekMonthParts,
} from './calendarUtils'
import { dayjs } from '../../utils/dayjs'
import DayIcon from './Icon/DayIcon.vue'
import WeekIcon from './Icon/WeekIcon.vue'
import MonthIcon from './Icon/MonthIcon.vue'
import DatePicker from '../DatePicker/DatePicker.vue'
import CalendarMonthly from './CalendarMonthly.vue'
import CalendarWeekly from './CalendarWeekly.vue'
import CalendarDaily from './CalendarDaily.vue'
import NewEventModal from './NewEventModal.vue'
import useEventModal from './composables/useEventModal'

const props = defineProps({
  events: {
    type: Object,
    required: false,
    default: [],
  },
  config: {
    type: Object,
  },
  onClick: {
    type: Function,
    required: false,
  },
  onDblClick: {
    type: Function,
    required: false,
  },
  onCellClick: {
    type: Function,
    required: false,
  },
})

const emit = defineEmits(['create', 'update', 'delete', 'rangeChange'])

const defaultConfig = {
  scrollToHour: 15,
  disableModes: [],
  defaultMode: 'Month',
  isEditMode: false,
  eventIcons: {},
  hourHeight: 50,
  enableShortcuts: true,
  showIcon: true,
  timeFormat: '12h',
  weekends: ['sunday'],
}

const overrideConfig = { ...defaultConfig, ...props.config }
let activeView = ref(overrideConfig.defaultMode)

function updateActiveView(value, d, isPreviousMonth, isNextMonth) {
  activeView.value = value
  if (value == 'Day' && d) {
    date.value = findIndexOfDate(d)
    isPreviousMonth && decrementMonth()
    isNextMonth && incrementMonth()
  }
}

const selectedMonthDate = ref(dayjs().format('YYYY-MM-DD'))

function onMonthYearChange(val = '') {
  const d = dayjs(val)
  selectedMonthDate.value = d.format('YYYY-MM-DD')

  setCalendarDate(selectedMonthDate.value)
}

function syncSelectedMonth(year, month) {
  // Keep same day if possible; otherwise clamp to last day
  if (typeof year === 'number' && typeof month === 'number') {
    const currentDay = dayjs(selectedMonthDate.value).date()

    let tentative = dayjs(
      `${year}-${String(month + 1).padStart(2, '0')}-01`,
    ).date(currentDay)

    if (tentative.month() !== month) {
      // overflowed into next month, use last day of target month
      tentative = tentative.startOf('month').month(month).endOf('month')
    }

    selectedMonthDate.value = tentative.format('YYYY-MM-DD')
  }
}

// shortcuts for changing the active view and navigating through the calendar
onMounted(() => {
  if (!overrideConfig.enableShortcuts) return
  window.addEventListener('keydown', handleShortcuts)
})
onUnmounted(() => {
  window.removeEventListener('keydown', handleShortcuts)
})
function handleShortcuts(e) {
  if (
    e.target.tagName === 'INPUT' ||
    e.target.tagName === 'TEXTAREA' ||
    e.target.isContentEditable
  ) {
    return
  }

  if (e.key.toLowerCase() === 'm') {
    activeView.value = 'Month'
  }
  if (e.key.toLowerCase() === 'w') {
    activeView.value = 'Week'
  }
  if (e.key.toLowerCase() === 'd') {
    activeView.value = 'Day'
  }
  if (e.key.toLowerCase() === 't') {
    setCalendarDate()
  }
  if (e.key === 'ArrowLeft') {
    decrement()
  }
  if (e.key === 'ArrowRight') {
    increment()
  }
}

provide('activeView', activeView)
provide('config', overrideConfig)

const parseEvents = computed(() => {
  return (
    props.events?.map((event) => {
      const { fromDate, toDate, fromTime, toTime, ...rest } = event
      const date = fromDate
      const fromDateTime = fromDate + ' ' + fromTime
      const toDateTime = toDate + ' ' + toTime

      return {
        ...rest,
        date,
        fromDateTime,
        toDateTime,
        fromDate,
        toDate,
        fromTime,
        toTime,
      }
    }) || []
  )
})
const events = ref(parseEvents.value)

watch(
  () => props.events,
  () => reloadEvents(),
  { deep: true },
)

function reloadEvents() {
  events.value = parseEvents.value
}

events.value.forEach((event) => {
  if (!event.fromTime || !event.toTime) return

  event.fromTime = handleSeconds(event.fromTime)
  event.toTime = handleSeconds(event.toTime)
})

const { showEventModal, newEvent, openNewEventModal } = useEventModal()

provide('calendarActions', {
  createNewEvent,
  updateEventState,
  deleteEvent,
  handleCellClick,
  updateActiveView,
  props,
})

// CRUD actions on an event
function createNewEvent(event) {
  events.value.push(event)
  event.fromDateTime = event.fromDate + ' ' + event.fromTime
  event.toDateTime = event.toDate + ' ' + event.toTime
  emit('create', event)
}

function updateEventState(event) {
  const eventID = event.id
  let eventIndex = events.value.findIndex((e) => e.id === eventID)
  event.fromDateTime = event.fromDate + ' ' + event.fromTime
  event.toDateTime = event.toDate + ' ' + event.toTime
  events.value[eventIndex] = event
  emit('update', event)
}

function deleteEvent(eventID) {
  // Delete event
  const eventIndex = events.value.findIndex((event) => event.id === eventID)
  events.value.splice(eventIndex, 1)
  emit('delete', eventID)
}

function openModal(data) {
  const { e, view, date, time, isFullDay } = data
  const config = overrideConfig.isEditMode
  openNewEventModal(e, view, date, config, time, isFullDay)
}

function handleCellClick(e, date, time = '', isFullDay = false) {
  const data = {
    e,
    view: activeView.value,
    date,
    time,
    isFullDay,
  }

  if (props.onCellClick) {
    props.onCellClick(data)
    return
  }
  openModal(data)
}

// Calendar View Options
const actionOptions = [
  { label: 'Day', value: 'Day', iconLeft: DayIcon },
  { label: 'Week', value: 'Week', iconLeft: WeekIcon },
  { label: 'Month', value: 'Month', iconLeft: MonthIcon },
]
let enabledModes = actionOptions.filter(
  (mode) => !overrideConfig.disableModes.includes(mode.value),
)

let currentYear = ref(new Date().getFullYear())
let currentMonth = ref(new Date().getMonth())
let currentDate = ref(new Date())

let currentMonthDates = computed(() => {
  let dates = getCalendarDates(currentMonth.value, currentYear.value)
  return dates
})

let datesInWeeks = computed(() => {
  let dates = [...currentMonthDates.value]
  let datesInWeeks = []
  while (dates.length) {
    let week = dates.splice(0, 7)
    datesInWeeks.push(week)
  }
  return datesInWeeks
})

function findCurrentWeek(date) {
  return datesInWeeks.value.findIndex((week) =>
    week.find(
      (d) =>
        new Date(d).toLocaleDateString().split('T')[0] ===
        new Date(date).toLocaleDateString().split('T')[0],
    ),
  )
}

let week = ref(findCurrentWeek(currentDate.value))

let date = ref(
  currentMonthDates.value.findIndex(
    (d) => new Date(d).toDateString() === currentDate.value.toDateString(),
  ),
)
let selectedDay = computed(() => currentMonthDates.value[date.value])

function updateCurrentDate(d) {
  activeView.value = 'Day'
  date.value = findIndexOfDate(d)
  week.value = findCurrentWeek(d)
}

function increment() {
  incrementClickEvents[activeView.value]()
  syncSelectedMonth(currentYear.value, currentMonth.value)
}

function decrement() {
  decrementClickEvents[activeView.value]()
  syncSelectedMonth(currentYear.value, currentMonth.value)
}

const incrementClickEvents = {
  Month: incrementMonth,
  Week: incrementWeek,
  Day: incrementDay,
}

const decrementClickEvents = {
  Month: decrementMonth,
  Week: decrementWeek,
  Day: decrementDay,
}

function incrementMonth() {
  currentMonth.value++
  if (currentMonth.value > 11) {
    currentMonth.value = 0
    currentYear.value++
  }
  // After month changes, recompute month dates and reset to first in-month day
  date.value = findFirstDateOfMonth(currentMonth.value, currentYear.value)
  week.value = findCurrentWeek(currentMonthDates.value[date.value])
}

function decrementMonth() {
  if (currentMonth.value === 0) {
    currentMonth.value = 11
    currentYear.value--
  } else {
    currentMonth.value--
  }
  // After adjusting month/year, pick last in-month date and its week
  date.value = findLastDateOfMonth(currentMonth.value, currentYear.value)
  week.value = findCurrentWeek(currentMonthDates.value[date.value])
}

function incrementWeek() {
  const nextWeek = week.value + 1 // target next week index

  // Case 1: still within current grid
  if (nextWeek < datesInWeeks.value.length) {
    week.value = nextWeek
    const weekDates = datesInWeeks.value[week.value]
    const spansNextMonth = weekDates.some(
      (d) => d.getMonth() !== currentMonth.value,
    ) // overlap into next month
    if (spansNextMonth) {
      // cross boundary -> advance month
      incrementMonth()
      week.value = 0 // first week row of new month
      const firstWeekDates = datesInWeeks.value[0]
      const day = firstInMonth(firstWeekDates, currentMonth.value) // first in-month day
      date.value = findIndexOfDate(day)
      return
    }
    const day = firstInMonth(weekDates, currentMonth.value) // first in-month day in target week
    date.value = findIndexOfDate(day)
    return
  }

  // Case 2: overflow -> next month first week
  incrementMonth()
  week.value = 0
  const firstWeekDates = datesInWeeks.value[0]
  const day = firstInMonth(firstWeekDates, currentMonth.value) // first valid in-month day
  date.value = findIndexOfDate(day)
}

function decrementWeek() {
  const prevWeek = week.value - 1 // target previous week index

  // Case 1: still within current grid
  if (prevWeek >= 0) {
    week.value = prevWeek
    const weekDates = datesInWeeks.value[week.value]
    const spansPrevMonth = weekDates.some(
      (d) => d.getMonth() !== currentMonth.value,
    ) // overlap into previous month
    if (spansPrevMonth) {
      // cross boundary -> go to previous month
      decrementMonth()
      week.value = datesInWeeks.value.length - 1 // last week row of new month
      const targetWeekDates = datesInWeeks.value[week.value]
      const day = firstInMonth(targetWeekDates, currentMonth.value) // first day actually in that month
      date.value = findIndexOfDate(day)
      return
    }
    const day = firstInMonth(weekDates, currentMonth.value) // first in-month day in target week
    date.value = findIndexOfDate(day)
    return
  }

  // Case 2: underflow -> jump to previous month
  decrementMonth()
  let targetIndex = datesInWeeks.value.length - 1 // start at last row
  const lastWeekDates = datesInWeeks.value[targetIndex]
  const hasNextMonthDates = lastWeekDates.some(
    (d) => d.getMonth() !== currentMonth.value,
  ) // overlap into next month
  if (hasNextMonthDates && targetIndex > 0) {
    targetIndex = targetIndex - 1 // skip overlap row
  }
  week.value = targetIndex
  const targetWeekDates = datesInWeeks.value[week.value]
  const day = firstInMonth(targetWeekDates, currentMonth.value) // first valid in-month day
  date.value = findIndexOfDate(day)
}

function incrementDay() {
  date.value++
  if (
    date.value > currentMonthDates.value.length - 1 ||
    !isCurrentMonthDate(currentMonthDates.value[date.value])
  ) {
    incrementMonth()
  }
}

function decrementDay() {
  date.value--
  if (
    date.value < 0 ||
    !isCurrentMonthDate(currentMonthDates.value[date.value])
  ) {
    decrementMonth()
  }
}

function firstInMonth(weekDates, month) {
  return weekDates.find((d) => d.getMonth() === month) || weekDates[0]
}

function findLastDateOfMonth(month, year) {
  let inputDate = new Date(year, month + 1, 0)
  let lastDateIndex = currentMonthDates.value.findIndex(
    (date) => new Date(date).toDateString() === inputDate.toDateString(),
  )
  return lastDateIndex
}

function findFirstDateOfMonth(month, year) {
  let inputDate = new Date(year, month, 1)
  let firstDateIndex = currentMonthDates.value.findIndex(
    (date) => new Date(date).toDateString() === inputDate.toDateString(),
  )
  return firstDateIndex
}

function findIndexOfDate(date) {
  return currentMonthDates.value.findIndex(
    (d) => new Date(d).toDateString() === new Date(date).toDateString(),
  )
}

const currentMonthYear = computed(() => {
  if (activeView.value === 'Day') {
    const dayDate = currentMonthDates.value[date.value]
    if (dayDate) {
      return dayjs(dayDate).format('ddd, D MMM YYYY')
    }
  }

  // Non-week views or empty week fallback
  if (activeView.value !== 'Week')
    return formatMonthYear(currentMonth.value, currentYear.value)

  const weekDates = datesInWeeks.value[week.value] || []
  if (!weekDates.length)
    return formatMonthYear(currentMonth.value, currentYear.value)

  const parts = getWeekMonthParts(weekDates)
  if (parts.length === 1) return formatMonthYear(parts[0].month, parts[0].year)

  const short = monthList.map((m) => m.slice(0, 3))
  const first = parts[0]
  const last = parts[parts.length - 1]

  return first.year === last.year
    ? `${short[first.month]} - ${short[last.month]} ${first.year}` // Same year span
    : `${short[first.month]} ${first.year} - ${short[last.month]} ${last.year}` // Cross-year span
})

function isCurrentMonthDate(date) {
  date = new Date(date)
  return date.getMonth() === currentMonth.value
}

function setCalendarDate(d) {
  const dt = d ? new Date(d) : new Date()
  if (dt.toString() === 'Invalid Date') return
  currentYear.value = dt.getFullYear()
  currentMonth.value = dt.getMonth()
  currentDate.value = dt
  // Wait for reactive recalculations of month dates
  nextTick(() => {
    week.value = findCurrentWeek(dt)
    const idx = findIndexOfDate(dt)
    if (idx >= 0) {
      date.value = idx
    } else {
      // Fallback: first date of month
      date.value = findFirstDateOfMonth(currentMonth.value, currentYear.value)
    }
  })
}

function getVisibleRange() {
  const toDateString = (date) => (date ? dayjs(date).format('YYYY-MM-DD') : '')

  if (activeView.value === 'Day') {
    const day = selectedDay.value
    if (!day) return null
    const start = dayjs(day).startOf('day')
    const end = dayjs(day).endOf('day')
    return {
      startDate: toDateString(start),
      endDate: toDateString(end),
    }
  }

  if (activeView.value === 'Week') {
    const weekDates = datesInWeeks.value[week.value] || []
    if (!weekDates.length) return null
    const orderedWeek = [...weekDates].sort((a, b) => a - b)
    const start = dayjs(orderedWeek[0]).startOf('day')
    const end = dayjs(orderedWeek[orderedWeek.length - 1]).endOf('day')
    return {
      startDate: toDateString(start),
      endDate: toDateString(end),
    }
  }

  const start = dayjs(
    new Date(currentYear.value, currentMonth.value, 1),
  ).startOf('day')
  const end = dayjs(
    new Date(currentYear.value, currentMonth.value + 1, 0),
  ).endOf('day')
  return {
    startDate: toDateString(start),
    endDate: toDateString(end),
  }
}

let lastRangeKey = ''
watch(
  () => {
    const range = getVisibleRange()
    if (!range) return null
    return {
      view: activeView.value,
      ...range,
    }
  },
  (payload) => {
    if (!payload) return
    const key = `${payload.view}-${payload.startDate}-${payload.endDate}`
    if (key === lastRangeKey) return
    lastRangeKey = key
    emit('rangeChange', payload)
  },
  { immediate: true },
)

defineExpose({
  reloadEvents,
  currentMonthYear,
  currentYear,
  currentMonth,
  enabledModes,
  activeView,
  decrement,
  increment,
  updateActiveView,
  setCalendarDate,
  onMonthYearChange,
  selectedMonthDate,
})
</script>
