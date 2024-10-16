<template>
  <div class="flex h-full flex-col overflow-hidden">
    <slot
      name="header"
      v-bind="{
        currentMonthYear,
        enabledModes,
        activeView,
        decrement,
        increment,
        updateActiveView,
      }"
    >
      <div class="mb-2 flex justify-between">
        <!-- left side  -->
        <!-- Year, Month -->
        <span class="text-xl font-medium"> {{ currentMonthYear }}</span>
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
    />

    <NewEventModal
      v-if="showEventModal"
      v-model="showEventModal"
      :event="newEvent"
    />
  </div>
</template>
<script setup>
import { computed, onMounted, onUnmounted, provide, ref, watch } from 'vue'
import Button from '../Button.vue'
import TabButtons from '../TabButtons.vue'
import {
  getCalendarDates,
  monthList,
  handleSeconds,
  parseDate,
} from './calendarUtils'
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
  create: {
    type: Function,
    required: false,
  },
  update: {
    type: Function,
    required: false,
  },
  delete: {
    type: Function,
    required: false,
  },
  onClick: {
    type: Function,
    required: false,
  },
  onDblClick: {
    type: Function,
    required: false,
  },
  onCellDblClick: {
    type: Function,
    required: false,
  },
})

const defaultConfig = {
  scrollToHour: 15,
  disableModes: [],
  defaultMode: 'Month',
  isEditMode: false,
  eventIcons: {},
  redundantCellHeight: 50,
  hourHeight: 50,
  enableShortcuts: true,
  showIcon: true,
}

const overrideConfig = { ...defaultConfig, ...props.config }
let activeView = ref(overrideConfig.defaultMode)

function updateActiveView(value) {
  console.log(value)
  activeView.value = value
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
  return props.events.map((event) => {
    const { fromDate, toDate, ...rest } = event
    const date = parseDate(fromDate)
    const from_time = new Date(fromDate).toLocaleTimeString()
    const to_time = new Date(toDate).toLocaleTimeString()
    if (event.isFullDay) {
      return { ...rest, date }
    }
    return { ...rest, date, from_time, to_time }
  })
})
const events = ref(parseEvents.value)

events.value.forEach((event) => {
  if (!event.from_time || !event.to_time) {
    return
  }
  event.from_time = handleSeconds(event.from_time)
  event.to_time = handleSeconds(event.to_time)
})

const { showEventModal, newEvent, openNewEventModal } = useEventModal()

provide('calendarActions', {
  createNewEvent,
  updateEventState,
  deleteEvent,
  handleCellDblClick,
  props,
})

// CRUD actions on an event
function createNewEvent(event) {
  events.value.push(event)
  props.create && props.create(event)
}

function updateEventState(event) {
  const eventID = event.id
  let eventIndex = events.value.findIndex((e) => e.id === eventID)
  events.value[eventIndex] = event
  props.update && props.update(events.value[eventIndex])
}

function deleteEvent(eventID) {
  // Delete event
  const eventIndex = events.value.findIndex((event) => event.id === eventID)
  events.value.splice(eventIndex, 1)
  props.delete && props.delete(eventID)
}

function openModal(data) {
  const { e, view, date, time } = data
  const config = overrideConfig.isEditMode
  openNewEventModal(e, view, date, config, time)
}

function handleCellDblClick(e, date, time = '') {
  const data = {
    e,
    view: activeView.value,
    date,
    time,
  }

  if (props.onCellDblClick) {
    props.onCellDblClick(data)
    return
  }
  openModal(data)
}

// Calendar View Options
const actionOptions = [
  { label: 'Day', variant: 'solid' },
  { label: 'Week', variant: 'solid' },
  { label: 'Month', variant: 'solid' },
]
let enabledModes = actionOptions.filter(
  (mode) => !overrideConfig.disableModes.includes(mode.label),
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
  date.value = findFirstDateOfMonth(currentMonth.value, currentYear.value)
  week.value = findCurrentWeek(currentMonthDates.value[date.value]) + 1
  if (currentMonth.value > 11) {
    currentMonth.value = 0
    currentYear.value++
  }
}

function decrementMonth() {
  currentMonth.value--
  date.value = findLastDateOfMonth(currentMonth.value, currentYear.value)
  week.value = findCurrentWeek(currentMonthDates.value[date.value])
  if (currentMonth.value < 0) {
    currentMonth.value = 11
    currentYear.value--
  }
}

function increment() {
  incrementClickEvents[activeView.value]()
}

function decrement() {
  decrementClickEvents[activeView.value]()
}

function incrementWeek() {
  week.value += 1
  if (week.value < datesInWeeks.value.length) {
    date.value = findIndexOfDate(datesInWeeks.value[week.value][0])
  }
  if (week.value > datesInWeeks.value.length - 1) {
    incrementMonth()
  }
  let nextMonthDates = filterCurrentWeekDates()
  if (nextMonthDates.length > 0) {
    incrementMonth()
    week.value = findCurrentWeek(nextMonthDates[0])
  }
}

function decrementWeek() {
  week.value -= 1
  if (week.value < 0) {
    decrementMonth()
    return
  }

  if (week.value > 0) {
    date.value = findIndexOfDate(datesInWeeks.value[week.value][0])
  }

  let previousMonthDates = filterCurrentWeekDates()
  if (previousMonthDates.length > 0) {
    decrementMonth()
    week.value = findCurrentWeek(previousMonthDates[0])
  }
}

function filterCurrentWeekDates() {
  let currentWeekDates = datesInWeeks.value[week.value]
  let differentMonthDates = currentWeekDates.filter(
    (d) => d.getMonth() !== currentMonth.value,
  )
  return differentMonthDates
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
</script>
