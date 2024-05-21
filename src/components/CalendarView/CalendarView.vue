<template>
  <div class="h-full p-5">
    <div class="mb-2 flex justify-between">
      <!-- left side  -->
      <!-- Year, Month -->
      <span class="text-xl font-medium"> {{ currentMonthYear }}</span>
      <!-- right side -->
      <!-- actions buttons for calendar -->
      <div class="flex gap-x-1">
        <!-- Increment and Decrement Button-->
        <Button
          @click="decrementClickEvents[activeView]"
          variant="ghost"
          class="h-4 w-4"
          icon="chevron-left"
        />
        <Button
          @click="incrementClickEvents[activeView]"
          variant="ghost"
          class="h-4 w-4"
          icon="chevron-right"
        />
        <!--  View change button default is months or can be set via props!  -->
        <TabButtons :buttons="enabledModes" class="ml-2" v-model="activeView" />
      </div>
    </div>
    <CalendarMonthly
      v-if="activeView === 'Month'"
      :events="events"
      :currentYear="currentYear"
      :currentMonthDates="currentMonthDates"
      :currentMonth="currentMonth"
      :config="overrideConfig"
    />

    <CalendarWeekly
      v-else-if="activeView === 'Week'"
      :events="events"
      :weeklyDates="datesInWeeks[week]"
      :config="overrideConfig"
    />

    <CalendarDaily
      v-else
      :events="events"
      :current-date="currentMonthDates[date]"
      :config="overrideConfig"
    />
  </div>
</template>
<script setup>
import { computed, provide, ref } from 'vue'
import Button from '../Button.vue'
import TabButtons from '../TabButtons.vue'
import {
  groupBy,
  getCalendarDates,
  monthList,
  handleSeconds,
} from './calendarUtils'
import CalendarMonthly from './CalendarMonthly.vue'
import CalendarWeekly from './CalendarWeekly.vue'
import CalendarDaily from './CalendarDaily.vue'

const emit = defineEmits(['updateEvent', 'createEvent', 'deleteEvent'])

const props = defineProps({
  events: {
    type: Object,
    required: false,
    default: [],
  },
  config: {
    type: Object,
  },
})

const defaultConfig = {
  scrollToHour: 15,
  disableModes: [],
  defaultMode: 'Month',
  isEditMode: false,
  eventIcons: {},
}

const overrideConfig = { ...defaultConfig, ...props.config }
overrideConfig['redundantCellHeight'] = 50
overrideConfig['hourHeight'] = 72
let activeView = ref(overrideConfig.defaultMode)

provide('activeView', activeView)
provide('config', overrideConfig)

let events = ref(props.events)
events.value.forEach((event) => {
  if (!event.from_time || !event.to_time) {
    return
  }
  event.from_time = handleSeconds(event.from_time)
  event.to_time = handleSeconds(event.to_time)
})

provide('eventActions', { createNewEvent, updateEventState, deleteEvent })
// CRUD actions on an event
function createNewEvent(event) {
  events.value.push(event)
  emit('createEvent', event)
}

function updateEventState(event) {
  const eventID = event.id
  let eventIndex = events.value.findIndex((e) => e.id === eventID)
  events.value[eventIndex] = event
  emit('updateEvent', events.value[eventIndex])
}

function deleteEvent(eventID) {
  events.value = events.value.filter((event) => event.id !== eventID)
  emit('deleteEvent', eventID)
}

// Calendar View Options
const actionOptions = [
  { label: 'Day', variant: 'solid' },
  { label: 'Week', variant: 'solid' },
  { label: 'Month', variant: 'solid' },
]
let enabledModes = actionOptions.filter(
  (mode) => !overrideConfig.disableModes.includes(mode.label)
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
        new Date(date).toLocaleDateString().split('T')[0]
    )
  )
}

let week = ref(findCurrentWeek(currentDate.value))

let date = ref(
  currentMonthDates.value.findIndex(
    (date) => new Date(date).toDateString() === currentDate.value.toDateString()
  )
)

let incrementClickEvents = {
  Month: incrementMonth,
  Week: incrementWeek,
  Day: incrementDay,
}

let decrementClickEvents = {
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
    (d) => d.getMonth() !== currentMonth.value
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
    (date) => new Date(date).toDateString() === inputDate.toDateString()
  )
  return lastDateIndex
}

function findFirstDateOfMonth(month, year) {
  let inputDate = new Date(year, month, 1)
  let firstDateIndex = currentMonthDates.value.findIndex(
    (date) => new Date(date).toDateString() === inputDate.toDateString()
  )
  return firstDateIndex
}

function findIndexOfDate(date) {
  return currentMonthDates.value.findIndex(
    (d) => new Date(d).toDateString() === new Date(date).toDateString()
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

<style></style>
