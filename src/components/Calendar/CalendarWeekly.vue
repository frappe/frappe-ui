<template>
  <div class="flex flex-col overflow-y-auto">
    <!-- Day List -->
    <div class="flex border-b-[1px]">
      <div class="w-16"></div>
      <div class="mb-2 grid w-full grid-cols-7">
        <span
          v-for="date in weeklyDates"
          class="relative p-2 text-center text-sm text-gray-600"
          :class="isToday(date) ? 'font-bold text-gray-800' : 'font-normal'"
        >
          <div
            v-if="isToday(date)"
            class="absolute left-[45%] top-0 h-[2px] w-5 bg-gray-800"
          />
          {{ parseDateWithDay(date) }}
        </span>
      </div>
    </div>

    <div class="relative flex h-full flex-col overflow-auto" ref="gridRef">
      <div class="flex border-b-[1px] border-l-[1px]">
        <!-- Time List form 0 - 24 -->
        <div class="grid w-16 grid-cols-1">
          <span
            v-for="time in 24"
            class="flex items-end justify-center text-center text-sm font-normal text-gray-600"
            :style="{ height: `${hourHeight}px` }"
          />
        </div>

        <!-- Grid -->
        <div class="flex w-full flex-col">
          <!-- full day events -->
          <div class="grid w-full grid-cols-7">
            <div v-for="(date, idx) in weeklyDates">
              <div
                class="flex w-full flex-col gap-1 border-b-[1px] border-r-[1px] border-gray-200 transition-all"
                :class="[idx === 0 && 'relative border-l-[1px]']"
                ref="allDayCells"
                :data-date-attr="date"
              >
                <Button
                  v-if="showCollapsable"
                  @click="isCollapsed = !isCollapsed"
                  class="absolute -left-[42px] bottom-[4px] cursor-pointer font-bold"
                  :icon="isCollapsed ? 'chevron-down' : 'chevron-up'"
                  variant="ghost"
                  size="lg"
                />
                <div class="w-full" v-if="!isCollapsed">
                  <CalendarEvent
                    v-for="(calendarEvent, idx) in fullDayEvents[
                      parseDate(date)
                    ]"
                    class="!z-1 mb-1 w-[90%] cursor-pointer"
                    :event="{ ...calendarEvent, idx }"
                    :key="calendarEvent.id"
                    :date="date"
                  />
                </div>
                <div v-else class="flex flex-col justify-between">
                  <ShowMoreCalendarEvent
                    v-if="fullDayEvents[parseDate(date)]?.length > 0"
                    :event="fullDayEvents[parseDate(date)][0]"
                    class="w-[90%]"
                    :date="date"
                    :totalEventsCount="fullDayEvents[parseDate(date)].length"
                    @showMoreEvents="isCollapsed = !isCollapsed"
                  />
                </div>
              </div>
            </div>
          </div>
          <!-- time events => not full day events => overflow-scroll here -->
          <div class="grid w-full grid-cols-7">
            <!-- 7 Columns -->
            <div
              v-for="(date, idx) in weeklyDates"
              class="relative w-full border-r-[1px]"
              :class="idx === 0 && 'calendar-column'"
              :data-date-attr="date"
            >
              <!-- Time Grid -->
              <div
                class="cell relative flex cursor-pointer"
                v-for="time in twentyFourHoursFormat"
                :data-time-attr="time"
                @dblclick.prevent="
                  calendarActions.handleCellDblClick($event, date, time)
                "
              >
                <div
                  class="border-gray-20 w-full border-b-[1px]"
                  :style="{ height: `${hourHeight}px` }"
                />
              </div>

              <!-- Calendar Events populations  -->
              <CalendarEvent
                v-for="(calendarEvent, idx) in timedEvents[parseDate(date)]"
                class="absolute mb-2 w-[90%] cursor-pointer"
                :event="calendarEvent"
                :key="calendarEvent.id"
                :date="date"
              />

              <!-- Current time Marker  -->
              <CalendarTimeMarker :date="date" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, watch, computed, inject } from 'vue'
import CalendarEvent from './CalendarEvent.vue'
import CalendarTimeMarker from './CalendarTimeMarker.vue'
import {
  twentyFourHoursFormat,
  parseDateWithDay,
  parseDate,
} from './calendarUtils'

import Button from '../Button.vue'
import ShowMoreCalendarEvent from './ShowMoreCalendarEvent.vue'
import useCalendarData from './composables/useCalendarData'

const props = defineProps({
  events: {
    type: Object,
    required: true,
  },
  config: {
    type: Object,
  },
  weeklyDates: {
    type: Array,
    required: false,
  },
})

const gridRef = ref(null)
const allDayCells = ref(null)
const showCollapsable = ref(false)
const isCollapsed = ref(false)

const hourHeight = props.config.hourHeight
const minuteHeight = hourHeight / 60

const timedEvents = computed(
  () => useCalendarData(props.events).timedEvents.value,
)
const fullDayEvents = computed(
  () => useCalendarData(props.events).fullDayEvents.value,
)

const isToday = (date) =>
  new Date(date).toDateString() === new Date().toDateString()

const calendarActions = inject('calendarActions')
const redundantCellHeight = props.config.redundantCellHeight
const getCellHeight = (length) => redundantCellHeight + 36 * (length - 1)
function getFullDayEventsInCurrentWeek(eventsObject, weeklyDates) {
  let currentWeekEvents = {}
  let weeklyFullDayEvents = Object.keys(eventsObject)
  weeklyDates.forEach((date) => {
    date = parseDate(date)

    if (weeklyFullDayEvents.includes(date)) {
      currentWeekEvents[date] = eventsObject[date]
    }
  })
  return currentWeekEvents
}

function getFullDayEventsCount(eventsObject) {
  let lengthArray = []
  Object.values(eventsObject).forEach((events) => {
    lengthArray.push(events.length)
  })
  let maxEventsInWeek = Math.max(...lengthArray, 1)
  return maxEventsInWeek
}

function setFullDayEventsHeight(eventsObject, weeklyDates) {
  let currentWeekEvents = getFullDayEventsInCurrentWeek(
    eventsObject,
    weeklyDates,
  )
  let maxEvents = getFullDayEventsCount(currentWeekEvents)
  if (maxEvents > 3) {
    showCollapsable.value = true
  } else {
    showCollapsable.value = false
  }
  let height = getCellHeight(maxEvents)
  if (isCollapsed.value) return
  allDayCells.value.forEach((cell) => {
    cell.style.height = height + 'px'
  })
}

onMounted(() => {
  // document.body.style.overflow = 'hidden'
  setFullDayEventsHeight(fullDayEvents.value, props.weeklyDates)
  const currentHour = new Date().getHours()
  gridRef.value.scrollBy(0, currentHour * 60 * minuteHeight)
})

watch(isCollapsed, (newVal) => {
  if (newVal) {
    allDayCells.value.forEach((cell) => {
      cell.style.height = '56px'
    })
  } else {
    setFullDayEventsHeight(fullDayEvents.value, props.weeklyDates)
  }
})

watch(
  () => fullDayEvents.value,
  (newFullDayEvents) => {
    setFullDayEventsHeight(newFullDayEvents, props.weeklyDates)
  },
)

watch(
  () => props.weeklyDates,
  (newWeeklyDates) => {
    setFullDayEventsHeight(fullDayEvents.value, newWeeklyDates)
  },
)
</script>

<style>
.calendar-column {
  border-left: 1px solid #e5e5e5;
  position: relative;
}

.calendar-column ::before {
  content: attr(data-time-attr);
  position: absolute;
  left: -45px;
  top: -9px;
  font-size: 12px;
  font-weight: 400;
}
</style>
