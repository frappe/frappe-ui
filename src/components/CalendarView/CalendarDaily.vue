<template>
  <div class="h-[90%] min-h-[500px] min-w-[600px]">
    <span class="font-bold">{{ parseDateWithComma(currentDate) }}</span>
    <div class="h-full overflow-hidden">
      <div
        class="flex h-full w-full overflow-scroll border-b-[1px] border-l-[1px] border-t-[1px]"
        ref="gridRef"
      >
        <!-- Left column -->
        <div class="grid h-full w-16 grid-cols-1">
          <span
            v-for="time in 24"
            class="flex h-[72px] items-end justify-center text-center text-sm font-normal text-gray-600"
            :style="{ height: `${hourHeight}px` }"
          />
        </div>

        <!-- Calendar Grid / Right Column -->
        <div class="grid h-full w-full grid-cols-1 pb-2">
          <div class="calendar-column relative border-r-[1px]">
            <!-- Top Redundant Cell before time starts for giving the calendar some space -->
            <div
              class="flex h-[50px] w-full flex-wrap gap-2 overflow-y-scroll border-b-[1px] border-gray-200 transition-all"
            >
              <CalendarEvent
                v-for="(calendarEvent, idx) in fullDayEvents[
                  parseDate(currentDate)
                ]"
                class="mb-1 w-[20%] cursor-pointer"
                :event="{ ...calendarEvent, idx }"
                :key="calendarEvent.id"
                :date="currentDate"
              />
            </div>
            <!-- Day Grid -->
            <div
              class="relative flex"
              v-for="time in twentyFourHoursFormat"
              :data-time-attr="time"
              @dblclick="openNewEventModal($event, time)"
            >
              <div
                class="w-full border-b-[1px] border-gray-200"
                :style="{ height: `${hourHeight}px` }"
              />
            </div>
            <CalendarEvent
              v-for="(calendarEvent, idx) in parsedData[parseDate(currentDate)]"
              class="absolute mb-2 cursor-pointer"
              :event="calendarEvent"
              :key="calendarEvent.id"
              :date="currentDate"
            />
            <!-- Current time style  -->
            <div
              class="absolute top-20 z-50 w-full pl-2"
              v-if="
                new Date(currentDate).toDateString() ===
                new Date().toDateString()
              "
              :style="setCurrentTime"
            >
              <div class="current-time relative h-0.5 bg-red-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <NewEventModal
    v-if="showEventModal"
    v-model="showEventModal"
    :event="newEvent"
  />
</template>

<script setup>
import { computed, ref, reactive } from 'vue'
import CalendarEvent from './CalendarEvent.vue'
import NewEventModal from './NewEventModal.vue'

import {
  parseDate,
  parseDateWithComma,
  groupBy,
  calculateMinutes,
  twentyFourHoursFormat,
  convertMinutesToHours,
  findOverlappingEventsCount,
} from './calendarUtils'

const props = defineProps({
  events: {
    type: Object,
    required: false,
  },
  currentMonthEvents: {
    type: Object,
    required: true,
  },
  config: {
    type: Object,
  },
  currentDate: {
    type: Object,
    required: true,
  },
})

const parsedData = computed(() => {
  let sortedArray = {}

  for (let [key, value] of Object.entries(props.currentMonthEvents)) {
    value = value.filter((event) => !event.isFullDay)
    value.forEach((task) => {
      task.startTime = calculateMinutes(task.from_time)
      task.endTime = calculateMinutes(task.to_time)
    })
    let sortedEvents = value
      .filter((event) => !event.isFullDay)
      .sort((a, b) => a.startTime - b.startTime)

    sortedArray[key] = findOverlappingEventsCount(sortedEvents)
  }
  return sortedArray
})

const fullDayEvents = computed(() => {
  let fullDay = props.events.filter((event) => event.isFullDay)
  let dateGroup = groupBy(fullDay, (row) => row.date)
  return dateGroup
})

let redundantCellHeight = props.config.redundantCellHeight
let hourHeight = props.config.hourHeight
let minuteHeight = hourHeight / 60
let increaseZIndex = ref(false)

const setCurrentTime = computed(() => {
  let d = new Date()
  let hour = d.getHours()
  let minutes = d.getMinutes()
  let top = (hour * 60 + minutes) * minuteHeight + redundantCellHeight + 'px'
  return { top }
})

const showEventModal = ref(false)
const newEvent = reactive({
  date: '',
  participant: '',
  from_time: '',
  to_time: '',
  venue: '',
  title: '',
})
function openNewEventModal(event, from_time) {
  if (!props.config.isEditMode) return
  let date = props.currentDate
  let to_time = convertMinutesToHours(calculateMinutes(from_time) + 60).slice(
    0,
    -3
  )

  newEvent.date = parseDate(date)
  newEvent.from_time = from_time
  newEvent.to_time = to_time
  showEventModal.value = true
}

function handleClick(e) {
  // change the event z-index to 100
  increaseZIndex.value = true
  e.target.parentElement.style.zIndex = 100
}

function handleBlur(e, calendarEvent) {
  // change the event z-index to 0
  increaseZIndex.value = false
  e.target.parentElement.style.zIndex = 0
}
</script>
