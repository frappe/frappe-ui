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
        @dragenter.prevent
        @drop="onDrop($event, date)"
        @click="calendarActions.handleCellClick($event, date)"
      >
        <div class="flex justify-center font-normal">
          <div
            class="flex gap-0.5 w-full flex-col items-center text-xs text-right"
          >
            <span
              class="w-full flex justify-between items-center"
              :class="[isToday(date) ? 'p-[3px] pb-0.5' : 'p-2']"
            >
              <div></div>
              <div
                class="cursor-pointer"
                :class="[
                  !isCurrentMonth(date)
                    ? 'bg-surface-base text-ink-gray-4'
                    : isToday(date)
                      ? 'flex items-center justify-center bg-surface-gray-10 text-ink-gray-2 rounded size-[25px]'
                      : 'bg-surface-base text-ink-gray-8',
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
              <CalendarMonthEvent
                v-for="calendarEvent in timedEvents[parseDate(date)]"
                :event="calendarEvent"
                :date="date"
                class="mb-2 cursor-pointer"
                :key="calendarEvent.id"
                :draggable="config.isEditMode"
                @dragstart="onDragStart($event, calendarEvent.id)"
                @dragend="$event.target.style.opacity = '1'"
                @dragover.prevent
              >
                <template #event-popover-content="slotProps">
                  <slot name="event-popover-content" v-bind="slotProps" />
                </template>
              </CalendarMonthEvent>
            </div>
            <div v-else class="flex w-full flex-col justify-between">
              <ShowMoreCalendarEvent
                v-if="timedEvents[parseDate(date)]"
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
              >
                <template #event-popover-content="slotProps">
                  <slot name="event-popover-content" v-bind="slotProps" />
                </template>
              </ShowMoreCalendarEvent>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { daysList, parseDate, isWeekend } from './calendarUtils'
import { inject } from 'vue'
import useCalendarData from './composables/useCalendarData'
import { computed } from 'vue'
import ShowMoreCalendarEvent from './ShowMoreCalendarEvent.vue'
import CalendarMonthEvent from './CalendarMonthEvent.vue'
import {
  CALENDAR_ACTIONS_KEY,
  type CalendarConfig,
  type CalendarEvent,
} from './types'

const props = defineProps<{
  events: CalendarEvent[]
  currentMonthDates: Date[]
  currentMonth: number
  config: CalendarConfig
}>()

const emit = defineEmits<{
  setCurrentDate: [date: Date]
}>()

const timedEvents = computed(
  () => useCalendarData(props.events, 'Month').timedEvents.value,
)

const maxEventsInCell = computed(() =>
  props.currentMonthDates.length > 35 ? 1 : 2,
)

function isToday(date: Date) {
  return date.toDateString() === new Date().toDateString()
}

function isCurrentMonth(date: Date) {
  return date.getMonth() === props.currentMonth
}

function isPreviousMonth(date: Date) {
  let previousMonth = false
  if (date.getMonth() === props.currentMonth - 1) {
    previousMonth = true
  }
  return previousMonth
}

function isNextMonth(date: Date) {
  let nextMonth = false
  if (date.getMonth() === props.currentMonth + 1) {
    nextMonth = true
  }
  return nextMonth
}

const calendarActions = inject(CALENDAR_ACTIONS_KEY)

if (!calendarActions) {
  throw new Error('CalendarMonthly must be rendered inside Calendar.')
}

const onDragStart = (
  event: DragEvent,
  calendarEventID?: CalendarEvent['id'],
) => {
  if (!calendarEventID) return
  const target = event.target as HTMLElement | null
  if (target) {
    target.style.opacity = '0.5'
    target.style.cursor = 'move'
  }
  if (!event.dataTransfer) return
  event.dataTransfer.dropEffect = 'move'
  event.dataTransfer.effectAllowed = 'move'
  event.dataTransfer.setData('calendarEventID', String(calendarEventID))
}

const onDrop = (event: DragEvent, date: Date) => {
  let calendarEventID = event.dataTransfer?.getData('calendarEventID')
  if (!calendarEventID) return
  const target = event.target as HTMLElement | null
  if (target) target.style.cursor = 'default'
  // if same date then return
  let e = props.events.find((e) => String(e.id) === calendarEventID)
  if (!e) return
  if (parseDate(date) === e.date) return
  let calendarEvent = props.events.find((e) => String(e.id) === calendarEventID)
  if (!calendarEvent) return
  calendarEvent.date = parseDate(date)
  calendarEvent.fromDate = calendarEvent.date
  calendarEvent.toDate = calendarEvent.date
  calendarEvent.fromDateTime = calendarEvent.date + ' ' + calendarEvent.fromTime
  calendarEvent.toDateTime = calendarEvent.date + ' ' + calendarEvent.toTime
  calendarActions.updateEventState(calendarEvent)
}
</script>
