<template>
  <div class="flex flex-1 flex-col overflow-y-auto">
    <!-- Day List -->
    <div class="flex border-b-[1px]">
      <div class="w-20"></div>
      <div class="grid w-full grid-cols-7">
        <span
          v-for="date in weeklyDates"
          class="relative flex h-8 cursor-pointer items-center justify-center gap-1.5 text-center text-base text-ink-gray-7"
          @click="calendarActions.updateActiveView('Day', date)"
        >
          {{ isToday(date) ? daysList[date.getDay()] : parseDateWithDay(date) }}
          <span
            v-if="isToday(date)"
            class="inline-flex size-[25px] items-center justify-center rounded bg-surface-gray-7 text-ink-white"
          >
            {{ date.getDate() }}
          </span>
        </span>
      </div>
    </div>

    <!-- Full day events -->
    <div
      class="flex h-fit shrink-0"
      :class="[config.noBorder ? 'border-b-[1px]' : 'border-[1px] border-t-0']"
    >
      <div
        class="flex w-20 items-start justify-center py-0.5 text-center text-base text-ink-gray-6"
      >
        <component
          :is="showCollapsable ? Button : 'div'"
          :class="{ '!gap-1 py-1 !pl-1.5 pr-1': showCollapsable }"
          variant="ghost"
          :iconRight="showCollapsable ? (isCollapsed ? 'chevron-down' : 'chevron-up') : ''"
          @click="showCollapsable && (isCollapsed = !isCollapsed)"
        >
          <div class="inline-flex h-[29px] items-center text-sm text-ink-gray-6">All day</div>
        </component>
      </div>
      <div class="grid w-full grid-cols-7 overflow-hidden">
        <template v-for="(date, idx) in weeklyDates">
          <div
            class="cell flex w-full cursor-pointer flex-col gap-1 py-1"
            :data-date-attr="date"
            @click.prevent="
              (e) => {
                if (fullDayEvents[parseDate(date)]?.length > 1) {
                  isCollapsed = false
                }
                calendarActions.handleCellClick(e, date, '', true)
              }
            "
          >
            <CalendarEvent
              v-for="(calendarEvent, idx) in !showCollapsable || !isCollapsed
                ? fullDayEvents[parseDate(date)]
                : fullDayEvents[parseDate(date)]?.slice(0, 2)"
              class="w-[90%] cursor-pointer"
              :event="{ ...calendarEvent, idx }"
              :key="calendarEvent.id"
              :date="date"
              @click.stop
            />
            <Button
              v-if="showCollapsable && isCollapsed && fullDayEvents[parseDate(date)]?.length > 2"
              :label="fullDayEvents[parseDate(date)]?.length - 2 + ' more'"
              variant="ghost"
              class="!h-5 w-fit cursor-pointer !justify-start !py-0.5 text-sm"
              @click.stop="isCollapsed = false"
            />
          </div>
        </template>
      </div>
    </div>

    <div
      class="relative flex h-full flex-col overflow-auto border-outline-gray-1"
      :class="[config.noBorder ? '' : 'border-b-[1px] border-l-[1px]']"
      ref="gridRef"
    >
      <div class="flex">
        <!-- Time List form 0 - 24 -->
        <div class="grid w-20 grid-cols-1">
          <span
            v-for="time in 24"
            class="flex items-end justify-center text-center text-sm font-normal text-ink-gray-5"
            :style="{ height: `${hourHeight}px` }"
          />
        </div>

        <!-- Grid -->
        <div class="relative flex w-full flex-col">
          <!-- time events => not full day events => overflow-scroll here -->
          <div
            class="absolute left-0.5 z-[2] mt-[0.5px] h-px w-[calc(100%-4px)] bg-[#F79596]"
            :style="currentTime"
          />
          <div class="grid w-full grid-cols-7">
            <!-- 7 Columns -->
            <div
              v-for="(date, idx) in weeklyDates"
              class="relative w-full border-outline-gray-1"
              :class="[
                idx === 0 && 'calendar-column border-l-[1px]',
                config.noBorder && idx === weeklyDates.length - 1 ? '' : 'border-r-[1px]',
                isWeekend(date, config) && 'bg-surface-gray-1',
              ]"
              :data-date-attr="date"
            >
              <!-- Time Grid -->
              <div
                class="cell relative flex cursor-pointer text-ink-gray-8"
                v-for="(time, i) in timeArray"
                :key="time"
                :data-time-attr="i == 0 ? '' : time"
                @click.prevent="calendarActions.handleCellClick($event, date, time)"
              >
                <div
                  class="w-full border-outline-gray-1"
                  :class="i !== timeArray.length - 1 && 'border-b-[1px]'"
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

import { Button } from '../Button'
import CalendarEvent from './CalendarEvent.vue'
import CalendarTimeMarker from './CalendarTimeMarker.vue'
import {
  twelveHoursFormat,
  twentyFourHoursFormat,
  parseDateWithDay,
  parseDate,
  daysList,
  isWeekend,
} from './calendarUtils'
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
const showCollapsable = ref(false)
const isCollapsed = ref(true)

const hourHeight = props.config.hourHeight
const minuteHeight = hourHeight / 60

const timeArray = props.config.timeFormat == '24h' ? twentyFourHoursFormat : twelveHoursFormat

const timedEvents = computed(() => useCalendarData(props.events).timedEvents.value)
const fullDayEvents = computed(() => useCalendarData(props.events).fullDayEvents.value)

const isToday = (date) => new Date(date).toDateString() === new Date().toDateString()

const currentTime = computed(() => {
  let d = new Date()
  let hour = d.getHours()
  let minutes = d.getMinutes()
  let top = (hour * 60 + minutes) * minuteHeight + 'px'
  return { top }
})

const calendarActions = inject('calendarActions')

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
  let currentWeekEvents = getFullDayEventsInCurrentWeek(eventsObject, weeklyDates)
  let maxEvents = getFullDayEventsCount(currentWeekEvents)
  if (maxEvents > 3) {
    showCollapsable.value = true
  } else {
    showCollapsable.value = false
  }
}

onMounted(() => {
  // document.body.style.overflow = 'hidden'
  setFullDayEventsHeight(fullDayEvents.value, props.weeklyDates)
  const currentHour = new Date().getHours()
  const scrollToHour = props.config.scrollToHour || currentHour
  gridRef.value.scrollBy(0, scrollToHour * 60 * minuteHeight - 10)
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
