<template>
  <div class="h-[92%]">
    <!-- Day List -->
    <div class="grid w-full grid-cols-7 pb-2">
      <span
        v-for="day in daysList"
        class="text-center text-sm font-normal text-gray-600"
        >{{ day }}</span
      >
    </div>

    <!-- Date Grid -->
    <div
      class="grid h-full w-full grid-cols-7 grid-rows-6 border-l-[1px] border-t-[1px]"
    >
      <div
        v-for="date in currentMonthDates"
        class="h-28 overflow-scroll border-b-[1px] border-r-[1px] border-gray-200"
        @dblclick.prevent="
          openNewEventModal($event, 'Month', date, config.isEditMode)
        "
        @dragover.prevent
        @drageneter.prevent
        @drop="onDrop($event, date)"
      >
        <div
          class="mx-2 flex h-full justify-center font-normal"
          :class="currentMonthDate(date) ? 'text-gray-700' : 'text-gray-200'"
        >
          <div
            v-if="currentMonthDate(date)"
            class="flex w-full flex-col items-center"
          >
            <span
              class="z-10 w-full bg-white py-1 text-center"
              :class="
                date.toDateString() === new Date().toDateString() && 'font-bold'
              "
            >
              {{ date.getDate() }}
            </span>

            <div class="w-full overflow-y-auto">
              <CalendarEvent
                v-for="calendarEvent in parsedData[parseDate(date)]"
                :event="calendarEvent"
                :date="date"
                class="z-10 mb-2 w-full cursor-pointer"
                :key="calendarEvent.id"
                :draggable="config.isEditMode"
                @dragstart="dragStart($event, calendarEvent.id)"
                @dragend="$event.target.style.opacity = '1'"
                @dragover.prevent
              />
            </div>
          </div>
          <span v-else>{{
            parseDateEventPopupFormat(date, (showDay = false))
          }}</span>
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
import {
  groupBy,
  parseDateEventPopupFormat,
  daysList,
  calculateMinutes,
  parseDate,
} from './calendarUtils'
import { computed, inject, ref, reactive } from 'vue'
import CalendarEvent from './CalendarEvent.vue'
import NewEventModal from './NewEventModal.vue'
import useNewEventModal from './composables/useNewEventModal'
const props = defineProps({
  events: {
    type: Object,
    required: true,
  },
  currentMonthDates: {
    type: Array,
    required: true,
  },
  currentMonth: {
    type: Number,
    required: true,
  },
  currentYear: {
    type: Number,
    required: true,
  },
  config: {
    type: Object,
  },
})

const config = inject('config')

const parsedData = computed(() => {
  let groupByDate = groupBy(props.events, (row) => row.date)
  let sortedArray = {}
  for (const [date, events] of Object.entries(groupByDate)) {
    let sortedEvents = sortEvents(events)
    sortedArray[date] = sortedEvents
  }
  return sortedArray
})

function sortEvents(events) {
  let fullDayEvents = events.filter((event) => event.isFullDay)

  let sortedEvents = events
    .filter((event) => !event.isFullDay)
    .sort((a, b) =>
      a.from_time !== b.from_time
        ? calculateMinutes(a.from_time) > calculateMinutes(b.from_time)
          ? 1
          : -1
        : calculateMinutes(a.to_time) > calculateMinutes(b.to_time)
        ? 1
        : -1
    )
  // full day events should be at the top in month view
  return [...fullDayEvents, ...sortedEvents]
}

function currentMonthDate(date) {
  return date.getMonth() === props.currentMonth
}

const { updateEventState } = inject('eventActions')

const dragStart = (event, calendarEventID) => {
  event.target.style.opacity = '0.5'
  event.target.style.cursor = 'move'
  event.dataTransfer.dropEffect = 'move'
  event.dataTransfer.effectAllowed = 'move'
  event.dataTransfer.setData('calendarEventID', calendarEventID)
}

const onDrop = (event, date) => {
  let calendarEventID = event.dataTransfer.getData('calendarEventID')
  event.target.style.cursor = 'default'
  // if same date then return
  let e = props.events.find((e) => e.id === calendarEventID)
  if (parseDate(date) === e.date) return
  let calendarEvent = props.events.find((e) => e.id === calendarEventID)
  calendarEvent.date = parseDate(date)
  updateEventState(calendarEvent)
}
const { showEventModal, newEvent, openNewEventModal } = useNewEventModal()
</script>
