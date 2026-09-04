<template>
  <div class="flex flex-1 flex-col overflow-y-auto isolate">
    <!-- Day List. Outside the box: the dates head the week rather than sitting
         inside it, so the box starts at the all-day line. -->
    <div class="flex pb-1">
      <div class="w-20"></div>
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

    <div
      class="flex min-h-0 flex-1 flex-col overflow-hidden rounded-6 border-outline-gray-1"
      :class="config.noBorder ? '' : 'border-[1px]'"
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
          class="flex w-20 shrink-0 items-center justify-center border-r-[1px] border-outline-gray-1 py-0.5 text-center text-base text-ink-gray-6"
        >
          <component
            :is="showCollapsable ? Button : 'div'"
            :class="{ '!pl-1.5 pr-1 py-1 !gap-1': showCollapsable }"
            variant="ghost"
            :iconRight="
              showCollapsable
                ? isCollapsed
                  ? 'lucide-chevron-down'
                  : 'lucide-chevron-up'
                : ''
            "
            @click="showCollapsable && (isCollapsed = !isCollapsed)"
          >
            <div
              class="text-sm text-ink-gray-6 h-[29px] inline-flex items-center"
            >
              All day
            </div>
          </component>
        </div>
        <div
          class="relative grid w-full grid-cols-7 overflow-hidden py-1"
          :style="{ minHeight: `${allDayHeight}px` }"
          data-day-columns="7"
        >
          <!-- `-my-1` cancels the row's own padding for the cells alone, so their
             rules run the full height and meet the grid's below. The bars are
             positioned against that padding and keep it. -->
          <div
            v-for="(date, col) in weeklyDates"
            :key="parseDate(date)"
            class="cell -my-1 flex w-full cursor-pointer flex-col border-outline-gray-1"
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
            <Button
              v-if="hiddenCount(col)"
              :label="hiddenCount(col) + ' more'"
              variant="ghost"
              class="w-fit text-sm !py-0.5 !h-5 !justify-start cursor-pointer"
              :style="{ marginTop: `${visibleLanes * LANE_PITCH}px` }"
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
            class="grid w-20 shrink-0 grid-cols-1 border-r-[1px] border-outline-gray-1"
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
                    calendarActions.handleCellClick($event, date, time)
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
import { LANE_PITCH, barsInColumn, layoutRow } from './eventSpan'

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
/** Height of the "n more" button under the collapsed lanes. */
const MORE_HEIGHT = 20

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
const allDayHeight = computed(
  () =>
    visibleLanes.value * LANE_PITCH +
    (visibleLanes.value < allDayRow.value.laneCount ? MORE_HEIGHT : 0) +
    8,
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
