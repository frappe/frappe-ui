<template>
  <!-- The box's own edge is drawn here, on the element that carries the corner;
       the sections inside keep their separators only. -->
  <div
    class="flex flex-col flex-1 overflow-y-auto rounded-6 border-outline-gray-1"
    :class="config.noBorder ? '' : 'border-[1px]'"
  >
    <!-- Full day events -->
    <div
      class="flex shrink-0 h-fit"
      :class="[config.noBorder ? 'border-t-[1px]' : 'border-b-[1px]']"
    >
      <!-- The same rule the hour gutter draws below, carried up through the
           all-day row so the day's left edge is one line. -->
      <div
        class="flex w-20 shrink-0 items-start justify-center border-r-[1px] border-outline-gray-1 pt-[3px] text-center text-base text-ink-gray-6"
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
        class="flex w-full flex-wrap gap-1 overflow-hidden p-1"
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
        :class="[config.noBorder ? 'border-t-[1px]' : '']"
        ref="gridRef"
      >
        <!-- Left column. `shrink-0`, or the flex row squeezes the gutter and
             its rule drifts out of line with the all-day label above it; and
             the rule is this column's right edge, not the day column's left,
             so it lands on the same pixel as the label's above. -->
        <!-- `self-start`, so the gutter is as tall as its 24 hours rather than
             stretched to the scroll viewport: its rule is the day's left edge,
             and a stretched box paints one that stops at the fold. -->
        <div
          class="grid w-20 shrink-0 self-start grid-cols-1 border-r-[1px] border-outline-gray-1"
        >
          <span
            v-for="time in 24"
            class="flex h-[72px] items-end justify-center text-center text-sm text-ink-gray-5"
            :style="{ height: `${hourHeight}px` }"
          />
        </div>

        <!-- Calendar Grid / Right Column -->
        <div class="grid h-full w-full grid-cols-1 pb-2">
          <div
            class="calendar-column relative"
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
              v-for="(calendarEvent, idx) in timedEvents[
                parseDate(currentDate)
              ]"
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
</template>

<script setup lang="ts">
import { computed, inject, onMounted, ref, watch } from 'vue'
import CalendarTimeMarker from './CalendarTimeMarker.vue'
import { Button } from '#components/Button'
import {
  parseDate,
  twelveHoursFormat,
  twentyFourHoursFormat,
} from './calendarUtils'
import useCalendarData from './composables/useCalendarData'
import { eventDays } from './eventSpan'
import CalendarWeekDayEvent from './CalendarWeekDayEvent.vue'
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
