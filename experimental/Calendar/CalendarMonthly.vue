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

    <!--
      Date Grid. Each week is a row of seven cells with the row's events laid
      over it as bars: an event covering several days is one bar across them,
      packed into a lane it keeps for the whole row, and a single-day event is
      a one-column bar in the same lane system. The cells beneath take clicks
      and drops, and show how many lanes did not fit.
    -->
    <div
      class="grid w-full flex-1 border-outline-gray-1"
      :class="[
        weeks.length > 5 ? 'grid-rows-6' : 'grid-rows-5',
        !config.noBorder && 'border-[0.5px]',
      ]"
    >
      <div
        v-for="(week, weekIdx) in weeks"
        :key="parseDate(week[0])"
        :ref="(el) => weekIdx === 0 && (firstRow = el as HTMLElement)"
        class="relative grid grid-cols-7"
        :style="{ minHeight: `${rowMinHeight(weekIdx)}px` }"
        data-week-row
        @dragover.prevent
        @dragenter.prevent
        @drop="onDrop($event, week)"
      >
        <div
          v-for="(date, col) in week"
          :key="parseDate(date)"
          class="flex flex-col overflow-hidden"
          :class="[
            config.noBorder ? 'border-l border-t border-0' : 'border-[0.5px]',
            config.noBorder && col === 0 && 'border-l-0',
            isWeekend(date, config) && 'bg-surface-gray-1',
          ]"
          @click="calendarActions.handleCellClick($event, date)"
        >
          <!-- The today pill is a 25px box around the number, so it gets a
               tighter inset that keeps its digits in the same column as the
               bare numbers on the other days. -->
          <div
            class="flex w-full shrink-0 items-center justify-end text-xs"
            :class="isToday(date) ? 'px-[3px]' : 'px-2'"
            :style="{ height: `${HEADER_HEIGHT}px` }"
          >
            <div
              class="cursor-pointer"
              :class="[
                !isCurrentMonth(date)
                  ? 'text-ink-gray-4'
                  : isToday(date)
                    ? 'flex items-center justify-center bg-surface-gray-10 text-ink-gray-2 rounded-4 size-[25px]'
                    : 'text-ink-gray-8',
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
          </div>

          <button
            v-if="hiddenCount(weekIdx, col)"
            class="mx-1 w-fit rounded-1 px-1.5 text-base-medium text-ink-gray-6 hover:bg-surface-gray-1"
            :style="{
              marginTop: `${visibleLanes(weekIdx) * LANE_PITCH}px`,
              height: `${MORE_HEIGHT}px`,
            }"
            @click.stop="emit('setCurrentDate', date)"
          >
            {{ hiddenCount(weekIdx, col) }} more
          </button>
        </div>

        <CalendarMonthEvent
          v-for="bar in visibleBars(weekIdx)"
          :key="bar.event.id"
          :event="bar.event"
          :date="week[bar.startCol]"
          :bar="bar"
          class="absolute cursor-pointer"
          :style="barStyle(bar)"
          :draggable="config.isEditMode"
          @dragstart="onDragStart($event, bar.event, week)"
          @dragend="$event.target.style.opacity = '1'"
        >
          <template #event-popover-content="slotProps">
            <slot name="event-popover-content" v-bind="slotProps" />
          </template>
        </CalendarMonthEvent>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, ref } from 'vue'
import { useElementSize } from '@vueuse/core'
import { daysList, parseDate, isWeekend } from './calendarUtils'
import {
  LANE_HEIGHT,
  LANE_PITCH,
  barsInColumn,
  daysBetween,
  layoutRow,
  shiftEventDays,
} from './eventSpan'
import { useNow } from './composables/useNow'
import CalendarMonthEvent from './CalendarMonthEvent.vue'
import {
  CALENDAR_ACTIONS_KEY,
  type CalendarConfig,
  type CalendarEvent,
  type CalendarRowBar,
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

/** The date-number strip at the top of every cell. */
const HEADER_HEIGHT = 32
/** The "n more" button that stands in for the lanes that did not fit. */
const MORE_HEIGHT = 20

/**
 * Lanes every row makes room for whatever the calendar's height. A row grows
 * past this when the grid has height to spare, and the outer scroll takes
 * over when it has too little.
 */
const DEFAULT_LANES = 2

const weeks = computed(() => {
  const dates = [...props.currentMonthDates]
  const rows: Date[][] = []
  while (dates.length) rows.push(dates.splice(0, 7))
  return rows
})

const rows = computed(() =>
  weeks.value.map((week) => layoutRow(props.events, week)),
)

// All rows share a height, so measuring the first is measuring every one.
const firstRow = ref<HTMLElement | null>(null)
const { height: rowHeight } = useElementSize(firstRow)

function rowMinHeight(weekIdx: number) {
  const laneCount = rows.value[weekIdx]?.laneCount ?? 0
  const lanes = Math.min(laneCount, DEFAULT_LANES)
  const more = laneCount > lanes ? MORE_HEIGHT : 0
  return HEADER_HEIGHT + lanes * LANE_PITCH + more
}

/**
 * Lanes a row can show. When they all fit, every lane; otherwise as many as
 * leave room for the "n more" button beneath them. Before the first measure
 * the default allowance keeps the grid from flashing empty.
 */
function visibleLanes(weekIdx: number) {
  const laneCount = rows.value[weekIdx]?.laneCount ?? 0
  if (!rowHeight.value) return Math.min(laneCount, DEFAULT_LANES)
  const room = rowHeight.value - HEADER_HEIGHT
  if (laneCount * LANE_PITCH <= room) return laneCount
  return Math.max(0, Math.floor((room - MORE_HEIGHT) / LANE_PITCH))
}

function visibleBars(weekIdx: number) {
  const visible = visibleLanes(weekIdx)
  return rows.value[weekIdx]?.bars.filter((bar) => bar.lane < visible) ?? []
}

function hiddenCount(weekIdx: number, col: number) {
  const visible = visibleLanes(weekIdx)
  const bars = rows.value[weekIdx]?.bars ?? []
  return barsInColumn(bars, col).filter((bar) => bar.lane >= visible).length
}

function barStyle(bar: CalendarRowBar) {
  const span = bar.endCol - bar.startCol + 1
  return {
    left: `calc(${(bar.startCol / 7) * 100}% + 2px)`,
    width: `calc(${(span / 7) * 100}% - 4px)`,
    top: `${HEADER_HEIGHT + bar.lane * LANE_PITCH}px`,
    height: `${LANE_HEIGHT}px`,
  }
}

const now = useNow()

function isToday(date: Date) {
  return parseDate(date) === parseDate(now.value)
}

function isCurrentMonth(date: Date) {
  return date.getMonth() === props.currentMonth
}

function isPreviousMonth(date: Date) {
  return date.getMonth() === props.currentMonth - 1
}

function isNextMonth(date: Date) {
  return date.getMonth() === props.currentMonth + 1
}

const calendarActions = inject(CALENDAR_ACTIONS_KEY)

if (!calendarActions) {
  throw new Error('CalendarMonthly must be rendered inside Calendar.')
}

/** The day under a pointer, from its position across a week row. */
function dateAtPointer(row: HTMLElement, clientX: number, week: Date[]) {
  const rect = row.getBoundingClientRect()
  const col = Math.floor(((clientX - rect.left) / rect.width) * 7)
  return parseDate(week[Math.max(0, Math.min(6, col))])
}

// A drag carries the event and the day it was picked up on, so that a drop
// moves the event by the distance dragged rather than snapping its start to
// wherever it landed — grabbing the third day of a stay and moving it one
// cell right should move the stay one day, not three.
const onDragStart = (
  event: DragEvent,
  calendarEvent: CalendarEvent,
  week: Date[],
) => {
  if (!calendarEvent.id) return
  const target = event.target as HTMLElement | null
  if (target) {
    target.style.opacity = '0.5'
    target.style.cursor = 'move'
  }
  if (!event.dataTransfer) return
  const row = target?.closest('[data-week-row]') as HTMLElement | null
  event.dataTransfer.dropEffect = 'move'
  event.dataTransfer.effectAllowed = 'move'
  event.dataTransfer.setData('calendarEventID', String(calendarEvent.id))
  event.dataTransfer.setData(
    'calendarGrabDate',
    row ? dateAtPointer(row, event.clientX, week) : parseDate(week[0]),
  )
}

const onDrop = (event: DragEvent, week: Date[]) => {
  const calendarEventID = event.dataTransfer?.getData('calendarEventID')
  const grabDate = event.dataTransfer?.getData('calendarGrabDate')
  if (!calendarEventID || !grabDate) return
  const target = event.target as HTMLElement | null
  if (target) target.style.cursor = 'default'
  const calendarEvent = props.events.find(
    (e) => String(e.id) === calendarEventID,
  )
  if (!calendarEvent) return
  const dropDate = dateAtPointer(
    event.currentTarget as HTMLElement,
    event.clientX,
    week,
  )
  const shift = daysBetween(grabDate, dropDate)
  if (!shift) return
  shiftEventDays(calendarEvent, shift)
  calendarActions.updateEventState(calendarEvent)
}
</script>
