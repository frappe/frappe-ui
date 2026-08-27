<template>
  <!--
    The Month view on a phone. Seven columns do not fit, so the days stack:
    one row per day with its events written out in full, and a heading where
    each month begins. The week strip above keeps track of where in the month
    the list is.
  -->
  <div class="flex min-h-0 flex-1 flex-col">
    <div class="grid grid-cols-7 border-b border-outline-gray-1 px-2 pb-2">
      <button
        v-for="date in weekStripDays"
        :key="parseDate(date)"
        class="flex flex-col items-center text-xs text-ink-gray-4"
        @click="scrollToDate(date)"
      >
        {{ daysList[date.getDay()]!.charAt(0) }}
        <span
          class="relative mt-0.5 flex size-7 items-center justify-center rounded-full text-sm"
          :class="
            isToday(date)
              ? 'bg-surface-gray-10 text-ink-gray-2'
              : 'text-ink-gray-8'
          "
        >
          {{ date.getDate() }}
          <span
            v-if="eventsOn(events, date).length"
            class="absolute -bottom-px left-1/2 size-[3px] -translate-x-1/2 rounded-full"
            :class="isToday(date) ? 'bg-surface-white' : 'bg-ink-gray-5'"
          />
        </span>
      </button>
    </div>

    <div ref="scroller" class="relative min-h-0 flex-1 overflow-y-auto">
      <template v-for="row in rows" :key="row.key">
        <div
          v-if="row.seam"
          class="flex items-center gap-2.5 px-4 pb-1.5 pt-3 text-sm font-medium text-ink-gray-8 after:flex-1 after:border-t after:border-outline-gray-2"
          :data-strip-date="row.key"
        >
          {{ row.seam }}
        </div>

        <div
          class="flex gap-3 border-b border-outline-gray-1 px-4 py-2.5"
          :data-strip-date="row.key"
        >
          <button class="w-10 shrink-0 text-center" @click="openDay(row.date)">
            <span class="block text-xs uppercase tracking-wide text-ink-gray-4">
              {{ daysList[row.date.getDay()] }}
            </span>
            <span
              class="mt-px inline-flex size-7 items-center justify-center rounded-full text-base font-medium"
              :class="
                isToday(row.date)
                  ? 'bg-surface-gray-10 text-ink-gray-2'
                  : 'text-ink-gray-8'
              "
            >
              {{ row.date.getDate() }}
            </span>
          </button>

          <div
            class="flex min-w-0 flex-1 flex-col gap-1.5"
            @click="calendarActions.handleCellClick($event, row.date)"
          >
            <CalendarMonthEvent
              v-for="event in row.events"
              :key="event.id"
              :event="event"
              :date="row.date"
              wrap
              :subtitle="subtitle(event, row.date)"
              class="cursor-pointer"
            >
              <template #event-popover-content="slotProps">
                <slot name="event-popover-content" v-bind="slotProps" />
              </template>
            </CalendarMonthEvent>
            <p v-if="!row.events.length" class="py-1 text-sm text-ink-gray-4">
              No events
            </p>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, ref } from 'vue'
import { daysList, formatTime, monthList, parseDate } from './calendarUtils'
import { daysBetween, eventDays } from './eventSpan'
import { eventsOn, isSpan, stripWeeks, weekStart } from './monthStrip'
import { useNow } from './composables/useNow'
import { useStripScroll } from './composables/useStripScroll'
import CalendarMonthEvent from './CalendarMonthEvent.vue'
import {
  CALENDAR_ACTIONS_KEY,
  type CalendarConfig,
  type CalendarEvent,
} from './types'

const props = defineProps<{
  events: CalendarEvent[]
  currentMonth: number
  currentYear: number
  currentDate?: Date
  jumpDate?: Date
  config: CalendarConfig
}>()

interface StackRow {
  key: string
  date: Date
  events: CalendarEvent[]
  /** The month beginning here, written as a heading above the row. */
  seam?: string
}

const now = useNow()

function isToday(date: Date) {
  return parseDate(date) === parseDate(now.value)
}

const rows = computed<StackRow[]>(() =>
  stripWeeks(props.currentMonth, props.currentYear)
    .flat()
    .map((date) => ({
      key: parseDate(date),
      date,
      events: eventsOn(props.events, date),
      seam: date.getDate() === 1 ? monthList[date.getMonth()] : undefined,
    })),
)

/** A time for a timed event; a stay says which of its days this is. */
function subtitle(event: CalendarEvent, date: Date) {
  if (isSpan(event)) {
    const { start, end } = eventDays(event)
    const day = daysBetween(start, parseDate(date)) + 1
    const total = daysBetween(start, end) + 1
    return `Day ${day} of ${total} · all day`
  }
  if (event.isFullDay || !event.fromTime) return 'All day'
  const from = formatTime(event.fromTime, props.config.timeFormat)
  if (!event.toTime) return from
  return `${from} – ${formatTime(event.toTime, props.config.timeFormat)}`
}

const calendarActions = inject(CALENDAR_ACTIONS_KEY)

if (!calendarActions) {
  throw new Error('CalendarMonthStack must be rendered inside Calendar.')
}

function openDay(date: Date) {
  calendarActions!.setCalendarDate(date)
  calendarActions!.updateActiveView('Day', date)
}

const scroller = ref<HTMLElement | null>(null)

const { topDate, scrollToDate } = useStripScroll(scroller, {
  target: () => props.currentDate,
  jump: () => props.jumpDate,
})

/** The week of the day at the top of the list. */
const weekStripDays = computed(() => {
  const top = topDate.value ? new Date(topDate.value + 'T00:00:00') : now.value
  const start = weekStart(top)
  return Array.from(
    { length: 7 },
    (_, i) =>
      new Date(start.getFullYear(), start.getMonth(), start.getDate() + i),
  )
})
</script>
