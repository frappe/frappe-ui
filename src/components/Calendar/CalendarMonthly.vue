<template>
  <div class="flex flex-1 flex-col overflow-scroll">
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
      class="grid w-full flex-1 grid-cols-7 border-l-[1px] border-t-[1px]"
      :class="currentMonthDates.length > 35 ? 'grid-rows-6' : 'grid-rows-5'"
    >
      <div
        v-for="date in currentMonthDates"
        class="overflow-y-auto border-b-[1px] border-r-[1px] border-gray-200"
        @dragover.prevent
        @drageneter.prevent
        @drop="onDrop($event, date)"
        @dblclick="calendarActions.handleCellDblClick($event, date)"
      >
        <div
          class="mx-2 flex justify-center font-normal"
          :class="currentMonthDate(date) ? 'text-gray-700' : 'text-gray-200'"
        >
          <div class="flex w-full flex-col items-center">
            <span
              v-if="currentMonthDate(date)"
              class="z-10 w-full bg-white py-1 text-center"
              :class="
                date.toDateString() === new Date().toDateString() && 'font-bold'
              "
            >
              {{ date.getDate() }}
            </span>
            <span v-else class="z-10 w-full bg-white py-1 text-center">
              {{ parseDateEventPopupFormat(date, (showDay = false)) }}
            </span>

            <div
              class="w-full"
              v-if="timedEvents[parseDate(date)]?.length <= maxEventsInCell"
            >
              <CalendarEvent
                v-for="calendarEvent in timedEvents[parseDate(date)]"
                :event="calendarEvent"
                :date="date"
                class="z-10 mb-2 w-full cursor-pointer"
                :key="calendarEvent.id"
                :draggable="config.isEditMode"
                @dragstart="onDragStart($event, calendarEvent.id)"
                @dragend="$event.target.style.opacity = '1'"
                @dragover.prevent
              />
            </div>
            <div v-else class="flex w-full flex-col justify-between">
              <ShowMoreCalendarEvent
                v-if="timedEvents[parseDate(date)]"
                class="z-10 mb-2 cursor-pointer"
                :draggable="config.isEditMode"
                @dragstart="
                  onDragStart($event, timedEvents[parseDate(date)][0].id)
                "
                @dragend="$event.target.style.opacity = '1'"
                @dragover.prevent
                :event="timedEvents[parseDate(date)][0]"
                :date="date"
                :totalEventsCount="timedEvents[parseDate(date)].length"
                @showMoreEvents="emit('setCurrentDate', date)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { parseDateEventPopupFormat, daysList, parseDate } from './calendarUtils'
import { inject } from 'vue'
import CalendarEvent from './CalendarEvent.vue'
import useCalendarData from './composables/useCalendarData'
import { computed } from 'vue'
import ShowMoreCalendarEvent from './ShowMoreCalendarEvent.vue'
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
  config: {
    type: Object,
  },
})

const emit = defineEmits(['setCurrentDate'])

const timedEvents = computed(
  () => useCalendarData(props.events, 'Month').timedEvents.value,
)

const maxEventsInCell = computed(() =>
  props.currentMonthDates.length > 35 ? 1 : 2,
)

function currentMonthDate(date) {
  return date.getMonth() === props.currentMonth
}

const calendarActions = inject('calendarActions')

const onDragStart = (event, calendarEventID) => {
  if (!calendarEventID) return
  event.target.style.opacity = '0.5'
  event.target.style.cursor = 'move'
  event.dataTransfer.dropEffect = 'move'
  event.dataTransfer.effectAllowed = 'move'
  event.dataTransfer.setData('calendarEventID', calendarEventID)
}

const onDrop = (event, date) => {
  let calendarEventID = event.dataTransfer.getData('calendarEventID')
  if (!calendarEventID) return
  event.target.style.cursor = 'default'
  // if same date then return
  let e = props.events.find((e) => e.id === calendarEventID)
  if (parseDate(date) === e.date) return
  let calendarEvent = props.events.find((e) => e.id === calendarEventID)
  calendarEvent.date = parseDate(date)
  calendarActions.updateEventState(calendarEvent)
}
</script>
