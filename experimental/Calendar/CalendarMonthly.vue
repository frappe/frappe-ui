<template>
  <CalendarMonthStack
    v-if="isNarrow"
    :events="events"
    :currentMonth="currentMonth"
    :currentYear="currentYear"
    :currentDate="currentDate"
    :jumpDate="jumpDate"
    :config="config"
  >
    <template #event-popover-content="slotProps">
      <slot name="event-popover-content" v-bind="slotProps" />
    </template>
  </CalendarMonthStack>

  <div v-else class="flex min-h-0 flex-1 flex-col">
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
      The strip. One row per week of the month, each at least as tall as its
      busiest day needs: a stay across several days is a bar in a lane at the
      top of the row, single-day events flow beneath it in their cells. Rows
      share whatever height is left over, and the strip scrolls once they
      outgrow it.
    -->
    <div
      ref="scroller"
      class="relative min-h-0 flex-1 overflow-y-auto border-outline-gray-1"
      :class="!config.noBorder && 'border-[0.5px]'"
    >
      <div class="flex min-h-full flex-col">
        <div
          v-for="row in rows"
          :key="row.key"
          class="relative grid flex-auto grid-cols-7 border-b border-outline-gray-1 last:border-b-0"
          :data-strip-date="row.key"
          data-week-row
          @dragover.prevent
          @dragenter.prevent
          @drop="onDrop($event, row.week)"
        >
          <div
            v-for="(date, col) in row.week"
            :key="parseDate(date)"
            class="flex min-w-0 flex-col border-outline-gray-1"
            :class="[
              col > 0 && 'border-l',
              isWeekend(date, config) && 'bg-surface-gray-1',
            ]"
            @click="calendarActions.handleCellClick($event, date)"
          >
            <!-- The today pill is a 25px box around the number, so it gets a
                 tighter inset that keeps its digits in the same column as the
                 bare numbers on the other days. -->
            <div
              class="flex shrink-0 items-center justify-end text-xs"
              :class="isToday(date) ? 'px-[3px]' : 'px-2'"
              :style="{ height: `${HEADER_HEIGHT}px` }"
            >
              <button
                class="cursor-pointer whitespace-nowrap"
                :class="[
                  isToday(date)
                    ? 'flex items-center justify-center bg-surface-gray-10 text-ink-gray-2 rounded-4 size-[25px]'
                    : 'text-ink-gray-8',
                ]"
                @click.stop="openDay(date)"
              >
                {{ dayLabel(date) }}
              </button>
            </div>

            <!-- Room for the lanes of bars laid over this column. -->
            <div
              v-if="row.lanes[col]"
              class="shrink-0"
              :style="{ height: `${row.lanes[col]! * LANE_PITCH}px` }"
            />

            <div
              v-if="row.days[col]!.length"
              class="flex flex-col gap-1 px-0.5 pb-1.5"
            >
              <CalendarMonthEvent
                v-for="event in row.days[col]"
                :key="event.id"
                :event="event"
                :date="date"
                wrap
                class="cursor-pointer"
                :class="draggingId === event.id && 'opacity-50'"
                :draggable="config.isEditMode"
                @dragstart="onDragStart($event, event, row.week)"
                @dragend="draggingId = null"
              >
                <template #event-popover-content="slotProps">
                  <slot name="event-popover-content" v-bind="slotProps" />
                </template>
              </CalendarMonthEvent>
            </div>
          </div>

          <CalendarMonthEvent
            v-for="bar in row.bars"
            :key="bar.event.id"
            :event="bar.event"
            :date="row.week[bar.startCol]!"
            :bar="bar"
            class="absolute cursor-pointer"
            :class="draggingId === bar.event.id && 'opacity-50'"
            :style="barStyle(bar)"
            :draggable="config.isEditMode"
            @dragstart="onDragStart($event, bar.event, row.week)"
            @dragend="draggingId = null"
          >
            <template #event-popover-content="slotProps">
              <slot name="event-popover-content" v-bind="slotProps" />
            </template>
          </CalendarMonthEvent>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, ref } from 'vue'
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'
import { daysList, isWeekend, parseDate } from './calendarUtils'
import {
  LANE_HEIGHT,
  LANE_PITCH,
  barsInColumn,
  daysBetween,
  layoutRow,
  shiftEventDays,
} from './eventSpan'
import { dayEvents, isSpan, shortMonth, stripWeeks } from './monthStrip'
import { useNow } from './composables/useNow'
import { useStripScroll } from './composables/useStripScroll'
import CalendarMonthEvent from './CalendarMonthEvent.vue'
import CalendarMonthStack from './CalendarMonthStack.vue'
import {
  CALENDAR_ACTIONS_KEY,
  type CalendarConfig,
  type CalendarEvent,
  type CalendarRowBar,
} from './types'

const props = defineProps<{
  events: CalendarEvent[]
  currentMonth: number
  currentYear: number
  /** The day navigation last landed on; the strip scrolls to its row. */
  currentDate?: Date
  /** Set by Today and the month picker; scrolls there even if it is the same day. */
  jumpDate?: Date
  config: CalendarConfig
}>()

/** The date-number strip at the top of every cell. */
const HEADER_HEIGHT = 32

// Seven columns do not survive a phone's width; the days stack instead.
const isNarrow = useBreakpoints(breakpointsTailwind).smaller('sm')

interface StripRow {
  key: string
  week: Date[]
  /** Multi-day events, packed into lanes across the row. */
  bars: CalendarRowBar[]
  /** Single-day events per column. */
  days: CalendarEvent[][]
  /** Lanes of bars each column has to leave room for. */
  lanes: number[]
}

const rows = computed<StripRow[]>(() => {
  const spans = props.events.filter(isSpan)
  return stripWeeks(props.currentMonth, props.currentYear).map((week) => {
    const { bars } = layoutRow(spans, week)
    return {
      key: parseDate(week[0]!),
      week,
      bars,
      days: week.map((date) => dayEvents(props.events, date)),
      lanes: week.map((_, col) => {
        const inColumn = barsInColumn(bars, col)
        return inColumn.length
          ? Math.max(...inColumn.map((bar) => bar.lane)) + 1
          : 0
      }),
    }
  })
})

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

/** The first of a month says which month, since the strip runs across them. */
function dayLabel(date: Date) {
  if (date.getDate() === 1 && !isToday(date)) {
    return `${shortMonth(date)} 1`
  }
  return date.getDate()
}

const calendarActions = inject(CALENDAR_ACTIONS_KEY)

if (!calendarActions) {
  throw new Error('CalendarMonthly must be rendered inside Calendar.')
}

function openDay(date: Date) {
  calendarActions!.setCalendarDate(date)
  calendarActions!.updateActiveView('Day', date)
}

const scroller = ref<HTMLElement | null>(null)

useStripScroll(scroller, {
  target: () => props.currentDate,
  jump: () => props.jumpDate,
})

/** The day under a pointer, from its position across a week row. */
function dateAtPointer(row: HTMLElement, clientX: number, week: Date[]) {
  const rect = row.getBoundingClientRect()
  const col = Math.floor(((clientX - rect.left) / rect.width) * 7)
  return parseDate(week[Math.max(0, Math.min(6, col))]!)
}

// A drag carries the event and the day it was picked up on, so that a drop
// moves the event by the distance dragged rather than snapping its start to
// wherever it landed — grabbing the third day of a stay and moving it one
// cell right should move the stay one day, not three.
/**
 * The event being dragged. A stay across several weeks is a bar per row, so
 * the fade is keyed on the event rather than on the piece that was grabbed.
 */
const draggingId = ref<CalendarEvent['id'] | null>(null)

const onDragStart = (
  event: DragEvent,
  calendarEvent: CalendarEvent,
  week: Date[],
) => {
  if (!calendarEvent.id) return
  draggingId.value = calendarEvent.id
  const target = event.target as HTMLElement | null
  if (target) target.style.cursor = 'move'
  if (!event.dataTransfer) return
  const row = target?.closest('[data-week-row]') as HTMLElement | null
  event.dataTransfer.dropEffect = 'move'
  event.dataTransfer.effectAllowed = 'move'
  event.dataTransfer.setData('calendarEventID', String(calendarEvent.id))
  event.dataTransfer.setData(
    'calendarGrabDate',
    row ? dateAtPointer(row, event.clientX, week) : parseDate(week[0]!),
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
  calendarActions!.updateEventState(calendarEvent)
}
</script>
