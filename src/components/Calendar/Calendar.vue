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
      }"
    >
      <div class="mb-2 flex justify-between">
        <!-- left side  -->
        <!-- Year, Month -->
        <span class="text-lg font-medium text-ink-gray-8">
          {{ currentMonthYear }}
        </span>
        <!-- right side -->
        <!-- actions buttons for calendar -->
        <div class="flex gap-x-1">
          <!-- Increment and Decrement Button-->

          <Button
            @click="decrement()"
            variant="ghost"
            class="h-4 w-4"
            icon="chevron-left"
          />
          <Button
            @click="increment()"
            variant="ghost"
            class="h-4 w-4"
            icon="chevron-right"
          />

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
import { getCalendarDates, monthList, handleSeconds } from './calendarUtils'
import DayIcon from './Icon/DayIcon.vue'
import WeekIcon from './Icon/WeekIcon.vue'
import MonthIcon from './Icon/MonthIcon.vue'
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

const emit = defineEmits(['create', 'update', 'delete'])

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

// shortcuts for changing the active view and navigating through the calendar
onMounted(() => {
  if (!overrideConfig.enableShortcuts) return
  window.addEventListener('keydown', handleShortcuts)
})
onUnmounted(() => {
  window.removeEventListener('keydown', handleShortcuts)
})
function handleShortcuts(e) {
  if (e.key === 'm' || e.key === 'M') {
    activeView.value = 'Month'
  }
  if (e.key === 'w' || e.key === 'W') {
    activeView.value = 'Week'
  }
  if (e.key === 'd' || e.key === 'D') {
    activeView.value = 'Day'
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
}

function decrement() {
  decrementClickEvents[activeView.value]()
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
  const nextWeek = week.value + 1

  // Case 1: normal advance within current month grid
  if (nextWeek < datesInWeeks.value.length) {
    week.value = nextWeek
    const weekDates = datesInWeeks.value[week.value]
    // If week spans into next month, jump into that month (single increment)
    const spansNextMonth = weekDates.some(
      (d) => d.getMonth() !== currentMonth.value,
    )
    if (spansNextMonth) {
      incrementMonth()
      week.value = 0
      const firstWeekDates = datesInWeeks.value[0]
      const day = firstInMonth(firstWeekDates, currentMonth.value)
      date.value = findIndexOfDate(day)
      return
    }
    // Stay in same month
    const day = firstInMonth(weekDates, currentMonth.value)
    date.value = findIndexOfDate(day)
    return
  }

  // Case 2: overflow beyond last week -> move to next month first week
  incrementMonth()
  week.value = 0
  const firstWeekDates = datesInWeeks.value[0]
  const day = firstInMonth(firstWeekDates, currentMonth.value)
  date.value = findIndexOfDate(day)
}

function decrementWeek() {
  const prevWeek = week.value - 1

  // Case 1: normal move within current month grid
  if (prevWeek >= 0) {
    week.value = prevWeek
    const weekDates = datesInWeeks.value[week.value]
    const spansPrevMonth = weekDates.some(
      (d) => d.getMonth() !== currentMonth.value,
    )
    if (spansPrevMonth) {
      // Move to previous month once
      decrementMonth()
      week.value = datesInWeeks.value.length - 1
      const lastWeekDates = datesInWeeks.value[week.value]
      const day = firstInMonth(lastWeekDates, currentMonth.value)
      date.value = findIndexOfDate(day)
      return
    }
    const day = firstInMonth(weekDates, currentMonth.value)
    date.value = findIndexOfDate(day)
    return
  }

  // Case 2: underflow beyond first week -> previous month last week
  decrementMonth()
  week.value = datesInWeeks.value.length - 1
  const lastWeekDates = datesInWeeks.value[week.value]
  const day = firstInMonth(lastWeekDates, currentMonth.value)
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
  return monthList[currentMonth.value] + ', ' + currentYear.value
})

function isCurrentMonthDate(date) {
  date = new Date(date)
  return date.getMonth() === currentMonth.value
}

function setCalendarDate(d) {
  if (!d) return
  const dt = new Date(d)
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

defineExpose({ reloadEvents, setCalendarDate })
</script>
