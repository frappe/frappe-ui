<template>
  <div class="flex flex-1 flex-col overflow-y-auto isolate">
    <!-- Day List. Outside the box: the dates head the week rather than sitting
         inside it, so the box starts at the all-day line. -->
    <div class="flex pb-1">
      <div class="w-14"></div>
      <div class="grid w-full grid-cols-7">
        <span
          v-for="date in weeklyDates"
          class="relative flex items-center justify-center gap-1.5 h-8 text-center text-base text-ink-gray-7 cursor-pointer"
          @click="calendarActions.updateActiveView('Day', date)"
        >
          {{ isToday(date) ? daysList[date.getDay()] : parseDateWithDay(date) }}
          <span
            v-if="isToday(date)"
            class="inline-flex items-center justify-center bg-surface-gray-10 text-ink-gray-1 rounded-4 size-[25px]"
          >
            {{ date.getDate() }}
          </span>
        </span>
      </div>
    </div>

    <!-- The corner goes with the border: `overflow-hidden` clips to the radius,
         so a rounded box with no border of its own cuts the ends off the rules
         its own rows draw. -->
    <div
      class="flex min-h-0 flex-1 flex-col overflow-hidden border-outline-gray-1"
      :class="config.noBorder ? '' : 'rounded-6 border-[1px]'"
    >
      <!--
        All-day row. Full-day events and timed ones of a day or more are packed
        into lanes across the week, each a bar over the days it covers; the
        seven cells beneath take clicks.
      -->
      <div class="flex shrink-0 h-fit border-b-[1px]">
        <!-- The same rule the hour gutter draws below, carried up through the
           all-day row so the week's left edge is one line. -->
        <div
          class="flex w-14 shrink-0 justify-center border-r-[1px] border-outline-gray-1 pl-px pt-1"
        >
          <!-- A label, and only that. The chevron that used to sit beside it
               toggled a row it was not in, from a column whose job is to say
               what the row is. What is hidden says so itself, in the day it is
               hidden on.

               The day view's label, to the letter: centred across the gutter
               with `pl-px` against the rule on the right, which is inside the
               box and so is not part of what centring divides, and the hours'
               own type from `.calendar-all-day-label`, so the label and the
               column it heads cannot drift apart.

               Down 4px and a lane tall — this row's own padding and its first
               bar, which is the day view's 8 and 24 read at this row's
               measurements. -->
          <div
            class="calendar-all-day-label inline-flex h-[30px] items-center text-ink-gray-8"
          >
            All day
          </div>
        </div>
        <div
          class="relative grid w-full grid-cols-7 overflow-hidden py-2"
          :style="{ minHeight: `${allDayHeight}px` }"
          data-day-columns="7"
        >
          <!-- `-my-2` cancels the row's own padding for the cells alone, so their
             rules run the full height and meet the grid's below. The bars are
             positioned against that padding and keep it. -->
          <div
            v-for="(date, col) in weeklyDates"
            :key="parseDate(date)"
            class="cell -my-2 flex w-full cursor-pointer flex-col border-outline-gray-1"
            :class="[
              col === weeklyDates.length - 1 ? '' : 'border-r-[1px]',
              // The same tint the column below carries: a weekend is one column
              // from the all-day row to the last hour, so the tint cannot stop at
              // the row's edge and leave a white notch at the top of the day.
              isWeekend(date, config) && 'bg-surface-gray-1',
            ]"
            :data-date-attr="date"
            @click.prevent="
              (e) => {
                if (hiddenCount(col)) isCollapsed = false
                calendarActions.handleCellClick(e, date, '', true)
              }
            "
          >
            <!-- What this day has past the lanes on show: an outline button,
                 bordered where the bars are filled, so it reads as a control
                 among them rather than as one more of them. Its corners are the
                 bars' own 8px, and so is its height — a lane, taken from the
                 constant the bars themselves are laid out by, so the two cannot
                 end up a few pixels apart. It says how many are hidden and then
                 it is gone — the lanes it opened are the answer. -->
            <Button
              v-if="hiddenCount(col)"
              :label="`+${hiddenCount(col)} more`"
              variant="outline"
              class="ml-0.5 w-fit cursor-pointer !justify-start !rounded-4 !text-xs !text-ink-gray-6"
              :style="{
                marginTop: `${visibleLanes * ALL_DAY_LANE_PITCH + ALL_DAY_LANE_GAP}px`,
                height: `${LANE_HEIGHT}px`,
              }"
              @click.stop="isCollapsed = false"
            />
          </div>
          <CalendarWeekDayEvent
            v-for="bar in visibleBars"
            :key="bar.event.id"
            :event="bar.event"
            :date="weeklyDates[bar.startCol]"
            :bar="bar"
            @click.stop
          >
            <template #event-popover-content="slotProps">
              <slot name="event-popover-content" v-bind="slotProps" />
            </template>
          </CalendarWeekDayEvent>
        </div>
      </div>

      <div
        class="relative flex h-full flex-col overflow-auto border-outline-gray-1"
        ref="gridRef"
      >
        <div class="flex">
          <!-- Time List form 0 - 24. `shrink-0`, or the flex row squeezes the
             gutter out of line with the all-day label above it; and the rule is
             this column's right edge, not the first day's left, so the two land
             on the same pixel. -->
          <div
            class="grid w-14 shrink-0 grid-cols-1 border-r-[1px] border-outline-gray-1"
          >
            <span
              v-for="time in 24"
              class="flex items-end justify-center text-center text-sm text-ink-gray-5"
              :style="{ height: `${hourHeight}px` }"
            />
          </div>

          <!-- Grid -->
          <div class="relative z-0 flex w-full flex-col">
            <!-- time events => not full day events => overflow-scroll here -->
            <div class="grid w-full grid-cols-7" data-day-columns="7">
              <!-- 7 Columns -->
              <div
                v-for="(date, idx) in weeklyDates"
                class="relative w-full border-outline-gray-1"
                :class="[
                  idx === 0 && 'calendar-column',
                  // The last column's right edge is the box's own, and the box
                  // draws that itself.
                  idx === weeklyDates.length - 1 ? '' : 'border-r-[1px]',
                  isWeekend(date, config) && 'bg-surface-gray-1',
                ]"
                :data-date-attr="date"
                data-time-grid
              >
                <!-- Time Grid -->
                <div
                  class="cell relative flex cursor-pointer text-ink-gray-8"
                  v-for="(time, i) in timeArray"
                  :key="time"
                  :data-time-attr="i == 0 ? '' : time"
                  @click.prevent="
                    calendarActions.handleCellClick(
                      $event,
                      date,
                      slotTime($event, i),
                    )
                  "
                >
                  <div
                    class="border-outline-gray-1 w-full"
                    :class="i !== timeArray.length - 1 && 'border-b-[1px]'"
                    :style="{ height: `${hourHeight}px` }"
                  />
                </div>

                <!-- Calendar Events populations  -->
                <CalendarWeekDayEvent
                  v-for="calendarEvent in timedEvents[parseDate(date)]"
                  :event="calendarEvent"
                  :key="`${calendarEvent.id}-${calendarEvent.date}`"
                  :date="date"
                >
                  <template #event-popover-content="slotProps">
                    <slot name="event-popover-content" v-bind="slotProps" />
                  </template>
                </CalendarWeekDayEvent>

                <!-- Current time Marker  -->
                <CalendarTimeMarker :date="date" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, computed, inject } from 'vue'
import CalendarTimeMarker from './CalendarTimeMarker.vue'
import {
  twelveHoursFormat,
  twentyFourHoursFormat,
  parseDateWithDay,
  parseDate,
  daysList,
  isWeekend,
} from './calendarUtils'
import {
  ALL_DAY_LANE_GAP,
  ALL_DAY_LANE_PITCH,
  LANE_HEIGHT,
  barsInColumn,
  layoutRow,
} from './eventSpan'

import { Button } from '#components/Button'
import useCalendarData from './composables/useCalendarData'
import { useNow } from './composables/useNow'
import CalendarWeekDayEvent from './CalendarWeekDayEvent.vue'
import {
  CALENDAR_ACTIONS_KEY,
  type CalendarConfig,
  type CalendarEvent,
} from './types'

const props = withDefaults(
  defineProps<{
    events: CalendarEvent[]
    config: CalendarConfig
    weeklyDates?: Date[]
  }>(),
  {
    weeklyDates: () => [],
  },
)

const gridRef = ref<HTMLElement | null>(null)
const isCollapsed = ref(true)

const hourHeight = props.config.hourHeight
const minuteHeight = hourHeight / 60

const timeArray =
  props.config.timeFormat == '24h' ? twentyFourHoursFormat : twelveHoursFormat

/**
 * The time a click asks for: the mark it landed nearest, less the half hour that
 * puts that mark in the middle of the event rather than at its start.
 *
 * The row it was in is an hour tall and carries three marks — its own line, the
 * half hour, and the line below it — so where in the row the click fell is the
 * finer thing it already knows and the row label alone throws away. The top and
 * bottom quarters go to the lines that bound the row and the middle half to the
 * half hour, which is the widest target of the three because it is the one with
 * no line to aim at.
 *
 * Centred, not started, because a click is a point and an event is an hour: the
 * point is where the reader is looking, and an hour hung below it puts the thing
 * they were pointing at at its very top edge. So a click on the 7 line asks for
 * 6:30, which draws an event through the 7 it was aimed at; the middle of the
 * row asks for 7, which is the row itself; and the 8 line asks for 7:30.
 *
 * Half hours, not quarters: a quarter of a 72px row is an 18px target, under
 * what a thumb can be asked to hit.
 *
 * A whole hour hands back the row's own label, unchanged, so what a consumer
 * parses is what it always parsed. A half hour is spelled out in the format the
 * grid is read in: "7:30 am" beside "7 am", "07:30" beside "07:00".
 */
const LAST_START = 23 * 60 + 30

function slotTime(e: MouseEvent, hour: number): string {
  const row = e.currentTarget as HTMLElement | null
  const fraction = row
    ? (e.clientY - row.getBoundingClientRect().top) / hourHeight
    : 0
  const minutes = fraction < 0.25 ? 0 : fraction < 0.75 ? 30 : 60

  // Both ends are the day's own: midnight has nothing above it to centre on,
  // and the last row's line below it belongs to the day after — the date came
  // with the cell, so neither can be reached from here.
  const start = Math.min(Math.max(hour * 60 + minutes - 30, 0), LAST_START)
  const startHour = Math.floor(start / 60)
  if (start % 60 === 0) return timeArray[startHour]!

  if (props.config.timeFormat === '24h')
    return `${String(startHour).padStart(2, '0')}:30`
  return `${((startHour + 11) % 12) + 1}:30 ${startHour < 12 ? 'am' : 'pm'}`
}

const timedEvents = computed(
  () => useCalendarData(props.events).timedEvents.value,
)
const allDayEvents = computed(
  () => useCalendarData(props.events).allDayEvents.value,
)

const allDayRow = computed(() =>
  layoutRow(allDayEvents.value, props.weeklyDates),
)

/** Past three lanes the row folds to two, with a count of what is hidden. */
const COLLAPSE_ABOVE = 3
const COLLAPSED_LANES = 2

const showCollapsable = computed(
  () => allDayRow.value.laneCount > COLLAPSE_ABOVE,
)
const visibleLanes = computed(() =>
  showCollapsable.value && isCollapsed.value
    ? COLLAPSED_LANES
    : allDayRow.value.laneCount,
)
const visibleBars = computed(() =>
  allDayRow.value.bars.filter((bar) => bar.lane < visibleLanes.value),
)
const hiddenCount = (col: number) =>
  barsInColumn(allDayRow.value.bars, col).filter(
    (bar) => bar.lane >= visibleLanes.value,
  ).length
/**
 * The air above the first lane and below the last thing in the row: the lanes'
 * own gap, so the row is padded by the same measure that separates what is in
 * it.
 *
 * The same on both edges, which it was not — a lane's pitch carries its gap
 * below it and the row then added more, so the band sat tight at the top and
 * loose at the bottom, reading as misaligned rather than as padded.
 */
const ROW_PAD = ALL_DAY_LANE_GAP

const allDayHeight = computed(
  () =>
    visibleLanes.value * ALL_DAY_LANE_PITCH +
    (visibleLanes.value < allDayRow.value.laneCount
      ? ALL_DAY_LANE_GAP + LANE_HEIGHT
      : 0) +
    ROW_PAD,
)

const now = useNow()

const isToday = (date: Date) => parseDate(date) === parseDate(now.value)

const calendarActions = inject(CALENDAR_ACTIONS_KEY)

if (!calendarActions) {
  throw new Error('CalendarWeekly must be rendered inside Calendar.')
}

onMounted(() => {
  const currentHour = new Date().getHours()
  const scrollToHour = props.config.scrollToHour || currentHour
  gridRef.value?.scrollBy(0, scrollToHour * 60 * minuteHeight - 10)
})
</script>
