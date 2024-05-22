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
              @dblclick="
                openNewEventModal(
                  $event,
                  'Day',
                  currentDate,
                  config.isEditMode,
                  time
                )
              "
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
import useNewEventModal from './composables/useNewEventModal'
import CalendarTimeMarker from './CalendarTimeMarker.vue'
import {
  parseDate,
  parseDateWithComma,
  groupBy,
  calculateMinutes,
  twentyFourHoursFormat,
  findOverlappingEventsCount,
} from './calendarUtils'

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

const parsedData = computed(() => {
  let groupByDate = groupBy(props.events, (row) => row.date)
  let sortedArray = {}

  for (let [key, value] of Object.entries(groupByDate)) {
    value = value.filter((event) => !event.isFullDay)
    value.forEach((task) => {
      task.startTime = calculateMinutes(task.from_time)
      task.endTime = calculateMinutes(task.to_time)
    })
    let sortedEvents = value.sort((a, b) => a.startTime - b.startTime)
    sortedArray[key] = findOverlappingEventsCount(sortedEvents)
  }
  return sortedArray
})

const fullDayEvents = computed(() => {
  let fullDay = props.events.filter((event) => event.isFullDay)
  let dateGroup = groupBy(fullDay, (row) => row.date)
  return dateGroup
})

const hourHeight = props.config.hourHeight

const { showEventModal, newEvent, openNewEventModal } = useNewEventModal()
</script>
