<template>
  <div class="flex flex-1 flex-col overflow-scroll">
    <!-- Day List -->
    <div class="grid w-full grid-cols-7 py-2">
      <span
        v-for="day in daysList"
        class="text-center text-base text-ink-gray-5"
        >{{ day }}</span
      >
    </div>

    <!-- Date Grid -->
    <div
      class="grid w-full flex-1 grid-cols-7 border-outline-gray-1"
      :class="[
        currentMonthDates.length > 35 ? 'grid-rows-6' : 'grid-rows-5',
        config.noBorder ? 'border-t-[0.5px]' : 'border-[0.5px]',
      ]"
    >
      <div
        v-for="date in currentMonthDates"
        class="overflow-y-auto border-[0.5px]"
        @dragover.prevent
        @drageneter.prevent
        @drop="onDrop($event, date)"
        @dblclick="calendarActions.handleCellDblClick($event, date)"
      >
        <div
          class="flex justify-center font-normal"
          :class="currentMonthDate(date) ? 'text-gray-700' : 'text-gray-200'"
        >
          <div
            class="flex gap-1 w-full flex-col items-center text-xs text-right"
          >
            <span
              v-if="currentMonthDate(date)"
              class="z-10 w-full flex justify-between items-center"
              :class="[
                date.toDateString() === new Date().toDateString()
                  ? 'py-0.5 px-1'
                  : 'py-1 px-2',
              ]"
            >
              <div></div>
              <div
                :class="[
                  date.toDateString() === new Date().toDateString()
                    ? 'bg-surface-gray-7 text-ink-white rounded-sm p-[2px]'
                    : 'bg-surface-white text-ink-gray-6',
                ]"
              >
                {{ date.getDate() }}
              </div>
            </span>
            <span
              v-else
              class="z-10 w-full bg-surface-white py-1 px-2 text-ink-gray-4"
            >
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
                class="z-10 cursor-pointer"
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
