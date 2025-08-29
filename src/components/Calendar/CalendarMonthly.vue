<template>
  <div class="flex flex-1 flex-col overflow-scroll">
    <!-- Day List -->
    <div class="grid w-full grid-cols-7">
      <span
        v-for="day in daysList"
        class="inline-flex items-center justify-center text-base text-ink-gray-6 h-8"
      >
        {{ day }}
      </span>
    </div>

    <!-- Date Grid -->
    <div
      class="grid w-full flex-1 grid-cols-7 border-outline-gray-1"
      :class="[
        currentMonthDates.length > 35 ? 'grid-rows-6' : 'grid-rows-5',
        !config.noBorder && 'border-[0.5px]',
      ]"
    >
      <div
        v-for="(date, i) in currentMonthDates"
        class="overflow-y-auto"
        :class="[
          config.noBorder ? 'border-l border-t border-0' : 'border-[0.5px]',
          config.noBorder && i % 7 === 0 && 'border-l-0',
          isWeekend(date, config) && 'bg-surface-gray-1',
        ]"
        @dragover.prevent
        @drageneter.prevent
        @drop="onDrop($event, date)"
        @click="calendarActions.handleCellClick($event, date)"
      >
        <div
          class="flex justify-center font-normal"
          :class="isCurrentMonth(date) ? 'text-gray-700' : 'text-gray-200'"
        >
          <div
            class="flex gap-0.5 w-full flex-col items-center text-xs text-right"
          >
            <span
              class="z-10 w-full flex justify-between items-center"
              :class="[
                date.toDateString() === new Date().toDateString()
                  ? 'p-[3px] pb-0.5'
                  : 'p-2',
              ]"
            >
              <div></div>
              <div
                class="cursor-pointer"
                :class="[
                  date.toDateString() === new Date().toDateString()
                    ? 'flex items-center justify-center bg-surface-gray-7 text-ink-white rounded size-[25px]'
                    : 'bg-surface-white ',
                  isCurrentMonth(date) ? 'text-ink-gray-6' : 'text-ink-gray-4',
                ]"
                @click.stop="
                  isCurrentMonth(date)
                    ? calendarActions.updateActiveView('Day', date)
                    : calendarActions.updateActiveView(
                        'Day',
                        date,
                        isPreviousMonth(date),
                        isNextMonth(date),
                      )
                "
              >
                {{ date.getDate() }}
              </div>
            </span>

            <div
              class="flex w-full flex-col justify-between"
              v-if="timedEvents[parseDate(date)]?.length <= maxEventsInCell"
            >
              <CalendarEvent
                v-for="calendarEvent in timedEvents[parseDate(date)]"
                :event="calendarEvent"
                :date="date"
                class="z-10 mb-2 cursor-pointer"
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
                :events="timedEvents[parseDate(date)]"
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
import { daysList, parseDate, isWeekend } from './calendarUtils'
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

function isCurrentMonth(date) {
  return date.getMonth() === props.currentMonth
}

function isPreviousMonth(date) {
  let previousMonth = false
  if (date.getMonth() === props.currentMonth - 1) {
    previousMonth = true
  }
  return previousMonth
}

function isNextMonth(date) {
  let nextMonth = false
  if (date.getMonth() === props.currentMonth + 1) {
    nextMonth = true
  }
  return nextMonth
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
  calendarEvent.fromDate = calendarEvent.date
  calendarEvent.toDate = calendarEvent.date
  calendarEvent.fromDateTime = calendarEvent.date + ' ' + calendarEvent.fromTime
  calendarEvent.toDateTime = calendarEvent.date + ' ' + calendarEvent.toTime
  calendarActions.updateEventState(calendarEvent)
}
</script>
