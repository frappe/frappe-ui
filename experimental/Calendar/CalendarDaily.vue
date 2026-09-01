<template>
  <!--
    A day is one column of events, and it used to be drawn across the whole
    width the app could spare — an hour-long meeting as a 1400px bar, saying
    nothing the same bar at a third the width would not. The grid is capped
    now, and the room that frees goes to the rail, which reads the day as a
    list. Below `lg` there is not enough width for both, so the rail steps
    aside and the grid has the space back.
  -->
  <div class="flex min-h-0 flex-1">
    <div class="flex min-w-0 max-w-[764px] flex-1 flex-col overflow-y-auto">
      <!-- Full day events -->
      <div
        class="flex shrink-0 h-fit"
        :class="[
          config.noBorder ? 'border-t-[1px]' : 'border-[1px] border-b-0',
        ]"
      >
        <div
          class="flex justify-center items-start pt-[3px] w-20 text-base text-ink-gray-6 text-center"
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
            <div class="text-sm text-ink-gray-6 h-7 inline-flex items-center">
              All day
            </div>
          </component>
        </div>
        <div
          class="flex flex-wrap gap-1 py-1 w-full overflow-hidden"
          :data-date-attr="currentDate"
          @click.prevent="
            calendarActions.handleCellClick($event, currentDate, '', true)
          "
        >
          <CalendarWeekDayEvent
            v-for="(calendarEvent, idx) in !showCollapsable || !isCollapsed
              ? dayFullDayEvents
              : dayFullDayEvents.slice(0, 4)"
            :event="{ ...calendarEvent, idx }"
            :key="calendarEvent.id"
            :date="currentDate"
            @click.stop
          >
            <template #event-popover-content="slotProps">
              <slot name="event-popover-content" v-bind="slotProps" />
            </template>
          </CalendarWeekDayEvent>
          <Button
            v-if="showCollapsable && isCollapsed && dayFullDayEvents.length > 4"
            :label="dayFullDayEvents.length - 4 + ' more'"
            variant="ghost"
            class="w-fit text-sm !h-6 !justify-start cursor-pointer"
            @click.stop="isCollapsed = false"
          />
        </div>
      </div>
      <div class="h-full overflow-hidden">
        <div
          class="flex h-full w-full overflow-scroll border-outline-gray-1"
          :class="[
            config.noBorder ? 'border-t-[1px]' : 'border-[1px] border-r-0',
          ]"
          ref="gridRef"
        >
          <!-- Left column -->
          <div class="grid h-full w-20 grid-cols-1">
            <span
              v-for="time in 24"
              class="flex h-[72px] items-end justify-center text-center text-sm text-ink-gray-5"
              :style="{ height: `${hourHeight}px` }"
            />
          </div>

          <!-- Calendar Grid / Right Column -->
          <div class="grid h-full w-full grid-cols-1 pb-2">
            <div
              class="calendar-column relative border-l-[1px] border-outline-gray-1"
              :class="[config.noBorder ? '' : ' border-r-[1px]']"
              data-time-grid
            >
              <!-- Day Grid -->
              <div
                class="relative flex text-ink-gray-8"
                v-for="(time, i) in timeArray"
                :key="time"
                :data-time-attr="i == 0 ? '' : time"
                @click="
                  calendarActions.handleCellClick($event, currentDate, time)
                "
              >
                <div
                  class="w-full border-outline-gray-1"
                  :class="i !== timeArray.length - 1 && 'border-b-[1px]'"
                  :style="{ height: `${hourHeight}px` }"
                />
              </div>
              <CalendarWeekDayEvent
                v-for="calendarEvent in dayGridEvents"
                :event="calendarEvent"
                :key="calendarEvent.id"
                :date="currentDate"
              >
                <template #event-popover-content="slotProps">
                  <slot name="event-popover-content" v-bind="slotProps" />
                </template>
              </CalendarWeekDayEvent>
              <!-- Current time Marker -->
              <CalendarTimeMarker :date="currentDate" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <CalendarScheduleRail
      v-if="showRail"
      :events="dayGridEvents"
      :all-day-events="dayFullDayEvents"
      :date="currentDate"
      @select="scrollToEvent"
    >
      <template #event-description="slotProps">
        <slot name="event-description" v-bind="slotProps" />
      </template>
      <template #event-suffix="slotProps">
        <slot name="event-suffix" v-bind="slotProps" />
      </template>
      <template #event-popover-content="slotProps">
        <slot name="event-popover-content" v-bind="slotProps" />
      </template>
    </CalendarScheduleRail>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, onMounted, ref, watch } from 'vue'
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'
import CalendarTimeMarker from './CalendarTimeMarker.vue'
import { Button } from '#components/Button'
import {
  calculateMinutes,
  parseDate,
  twelveHoursFormat,
  twentyFourHoursFormat,
} from './calendarUtils'
import useCalendarData, { activeEvent } from './composables/useCalendarData'
import { eventDays } from './eventSpan'
import CalendarWeekDayEvent from './CalendarWeekDayEvent.vue'
import CalendarScheduleRail from './CalendarScheduleRail.vue'
import {
  CALENDAR_ACTIONS_KEY,
  type CalendarConfig,
  type CalendarEvent,
} from './types'

const props = defineProps<{
  events?: CalendarEvent[]
  config: CalendarConfig
  currentDate: Date
}>()
const timedEvents = computed(
  () => useCalendarData(props.events).timedEvents.value,
)
const allDayEvents = computed(
  () => useCalendarData(props.events).allDayEvents.value,
)
const gridRef = ref<HTMLElement | null>(null)
const hourHeight = props.config.hourHeight
const minuteHeight = hourHeight / 60

/** This day's timed events, laid out side by side rather than cascaded. */
const dayGridEvents = computed(
  () => timedEvents.value[parseDate(props.currentDate)] ?? [],
)

// The rail needs 320px and the grid wants its 764; below `lg` there is not
// enough for both, so the rail goes and the grid takes the width back.
const showRail = useBreakpoints(breakpointsTailwind).greater('lg')

/**
 * Bring an event the rail names into view on the grid, and light it up there,
 * so picking it off the list answers "where does that sit in my day".
 */
function scrollToEvent(event: CalendarEvent) {
  activeEvent.value = event.id ?? event.name ?? ''
  const from = String(event.segFromTime || event.fromTime || '')
  if (!from) return
  gridRef.value?.scrollTo({
    top: Math.max(calculateMinutes(from) * minuteHeight - hourHeight / 2, 0),
    behavior: 'smooth',
  })
}

const showCollapsable = ref(false)
const isCollapsed = ref(true)
// Every all-day-row event covering this day, a multi-day one included.
const dayFullDayEvents = computed(() => {
  const day = parseDate(props.currentDate)
  return allDayEvents.value.filter((event) => {
    const { start, end } = eventDays(event)
    return start <= day && day <= end
  })
})

function updateFullDayEventsState() {
  // Show collapsible if more than 4 events
  showCollapsable.value = dayFullDayEvents.value.length > 4
  if (!showCollapsable.value) {
    isCollapsed.value = true
  }
}

watch(dayFullDayEvents, updateFullDayEventsState, { immediate: true })

const timeArray =
  props.config.timeFormat == '24h' ? twentyFourHoursFormat : twelveHoursFormat

onMounted(() => {
  const currentHour = new Date().getHours()
  const scrollToHour = props.config.scrollToHour || currentHour
  gridRef.value?.scrollBy(0, scrollToHour * 60 * minuteHeight - 10)
})

const calendarActions = inject(CALENDAR_ACTIONS_KEY)

if (!calendarActions) {
  throw new Error('CalendarDaily must be rendered inside Calendar.')
}
</script>
