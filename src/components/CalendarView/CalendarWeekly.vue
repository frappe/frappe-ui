<template>
  <div class="h-[90%]">
    <div class="h-full min-h-[500px] min-w-[600px] overflow-auto">
      <!-- Day List -->
      <div class="flex">
        <div class="w-16"></div>
        <div class="mb-2 grid w-full grid-cols-7">
          <span
            v-for="date in weeklyDates"
            class="text-center text-sm text-gray-600"
            :class="
              new Date(date).toDateString() === new Date().toDateString()
                ? 'font-bold'
                : 'font-normal'
            "
          >
            {{ parseDateWithDay(date) }}
          </span>
        </div>
      </div>

      <!-- <div class="h-8 border-[1px]">
        <p class="w-16 text-center">All Day</p>
      </div> -->

      <div
        class="flex w-full overflow-scroll border-b-[1px] border-l-[1px] border-t-[1px]"
        ref="gridRef"
      >
        <!-- Time List form 0 - 24 -->
        <div class="grid h-full w-16 grid-cols-1">
          <span
            v-for="time in 24"
            class="flex h-[72px] items-end justify-center text-center text-sm font-normal text-gray-600"
            :style="{ height: `${hourHeight}px` }"
          />
        </div>

        <!-- Grid -->
        <div class="grid w-full grid-cols-7">
          <!-- full day events -->
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
                  v-for="(calendarEvent, idx) in fullDayEvents[parseDate(date)]"
                  class="mb-1 w-[90%] cursor-pointer"
                  :event="{ ...calendarEvent, idx }"
                  :key="calendarEvent.id"
                  :date="date"
                />
              </div>
              <div v-else class="flex flex-col justify-between">
                <ShowMoreCalendarEvent
                  v-if="fullDayEvents[parseDate(date)]?.length > 0"
                  :event="fullDayEvents[parseDate(date)][0]"
                  :date="date"
                  :totalEventsCount="fullDayEvents[parseDate(date)].length"
                  @showMoreEvents="isCollapsed = !isCollapsed"
                />
              </div>
            </div>
          </div>

          <!-- time events -> not full day events -->
          <div
            v-for="(date, idx) in weeklyDates"
            class="relative border-r-[1px]"
            :class="idx === 0 && 'calendar-column'"
            :data-date-attr="date"
          >
            <!-- Time Grid -->
            <div
              class="cell relative flex cursor-pointer"
              v-for="time in twentyFourHoursFormat"
              :data-time-attr="time"
              @dblclick="
                openNewEventModal($event, 'Week', date, config.isEditMode, time)
              "
            >
              <div
                class="w-full border-b-[1px] border-gray-200"
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
  <NewEventModal
    v-if="showEventModal"
    v-model="showEventModal"
    :event="newEvent"
  />
</template>
<script setup>
import { ref, onMounted, watch } from 'vue'
import CalendarEvent from './CalendarEvent.vue'
import NewEventModal from './NewEventModal.vue'
import CalendarTimeMarker from './CalendarTimeMarker.vue'
import {
  twentyFourHoursFormat,
  parseDateWithDay,
  parseDate,
} from './calendarUtils'

import Button from '../Button.vue'
import ShowMoreCalendarEvent from './ShowMoreCalendarEvent.vue'
import useEventModal from './composables/useEventModal'
import useCalendarData from './composables/useCalendarData'
import { computed } from 'vue'

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
  () => useCalendarData(props.events).timedEvents.value
)
const fullDayEvents = computed(
  () => useCalendarData(props.events).fullDayEvents.value
)

const { showEventModal, newEvent, openNewEventModal } = useEventModal()

const getCellHeight = (length) => 49 + 36 * (length - 1)
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
    weeklyDates
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
  setFullDayEventsHeight(fullDayEvents.value, props.weeklyDates)
  let scrollTop = props.config.scrollToHour * 60 * minuteHeight
  gridRef.value.scrollBy(0, scrollTop)
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
  }
)

watch(
  () => props.weeklyDates,
  (newWeeklyDates) => {
    setFullDayEventsHeight(fullDayEvents.value, newWeeklyDates)
  }
)
</script>

<style>
.calendar-column {
  border-left: 1px solid #e5e5e5;
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
