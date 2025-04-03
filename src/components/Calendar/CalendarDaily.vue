<template>
  <div class="h-[90%] min-h-[500px] min-w-[600px]">
    <slot name="header" v-bind="{ parseDateWithDay, currentDate, fullDay }">
      <p class="pb-2 text-base font-semibold text-ink-gray-8">
        {{ parseDateWithDay(currentDate, (fullDay = true)) }}
      </p>
    </slot>
    <div class="h-full overflow-hidden">
      <div
        class="flex h-full w-full overflow-scroll border-outline-gray-1"
        :class="[
          config.noBorder ? 'border-t-[1px]' : 'border-[1px] border-r-0',
        ]"
        ref="gridRef"
      >
        <!-- Left column -->
        <div class="grid h-full w-16 grid-cols-1">
          <span
            v-for="time in 24"
            class="flex h-[72px] items-end justify-center text-center text-sm font-normal text-ink-gray-5"
            :style="{ height: `${hourHeight}px` }"
          />
        </div>

        <!-- Calendar Grid / Right Column -->
        <div class="grid h-full w-full grid-cols-1 pb-2">
          <div
            class="calendar-column relative border-r-[1px] border-l-[1px] border-outline-gray-1"
          >
            <!-- Top Redundant Cell before time starts for giving the calendar some space -->
            <div
              class="flex h-[50px] w-full flex-wrap gap-2 overflow-y-scroll border-b-[1px] border-outline-gray-1 transition-all"
              :style="{ height: `${config.redundantCellHeight}px` }"
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
              class="relative flex text-ink-gray-8"
              v-for="time in timeArray"
              :key="time"
              :data-time-attr="time"
              @dblclick="
                calendarActions.handleCellDblClick($event, currentDate, time)
              "
            >
              <div
                class="w-full border-b-[1px] border-outline-gray-1"
                :style="{ height: `${hourHeight}px` }"
              />
            </div>
            <CalendarEvent
              v-for="(calendarEvent, idx) in timedEvents[
                parseDate(currentDate)
              ]"
              class="absolute mb-2 cursor-pointer"
              :event="calendarEvent"
              :key="calendarEvent.id"
              :date="currentDate"
            />
            <!-- Current time Marker -->
            <CalendarTimeMarker
              :date="currentDate"
              :redundantCellHeight="config.redundantCellHeight"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, inject, onMounted, ref } from 'vue'
import CalendarEvent from './CalendarEvent.vue'
import CalendarTimeMarker from './CalendarTimeMarker.vue'
import {
  parseDate,
  parseDateWithDay,
  twelveHoursFormat,
  twentyFourHoursFormat,
} from './calendarUtils'
import useCalendarData from './composables/useCalendarData'

const props = defineProps({
  events: {
    type: Object,
    required: false,
  },
  config: {
    type: Object,
  },
  currentDate: {
    type: Object,
    required: true,
  },
})
const timedEvents = computed(
  () => useCalendarData(props.events).timedEvents.value,
)
const fullDayEvents = computed(
  () => useCalendarData(props.events).fullDayEvents.value,
)
const gridRef = ref(null)
const hourHeight = props.config.hourHeight
const minuteHeight = hourHeight / 60

const timeArray =
  props.config.timeFormat == '24h' ? twentyFourHoursFormat : twelveHoursFormat

onMounted(() => {
  const currentHour = new Date().getHours()
  gridRef.value.scrollBy(0, currentHour * 60 * minuteHeight)
})

const calendarActions = inject('calendarActions')
</script>
