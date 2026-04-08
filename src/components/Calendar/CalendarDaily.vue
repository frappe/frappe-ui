<template>
  <div class="flex flex-1 flex-col overflow-y-auto">
    <!-- Full day events -->
    <div
      class="flex h-fit shrink-0"
      :class="[config.noBorder ? 'border-t-[1px]' : 'border-[1px] border-b-0']"
    >
      <div
        class="flex w-20 items-start justify-center pt-[3px] text-center text-base text-ink-gray-6"
      >
        <component
          :is="showCollapsable ? Button : 'div'"
          :class="{ '!gap-1 py-1 !pl-1.5 pr-1': showCollapsable }"
          variant="ghost"
          :iconRight="showCollapsable ? (isCollapsed ? 'chevron-down' : 'chevron-up') : ''"
          @click="showCollapsable && (isCollapsed = !isCollapsed)"
        >
          <div class="inline-flex h-7 items-center text-sm text-ink-gray-6">All day</div>
        </component>
      </div>
      <div
        class="flex w-full flex-wrap gap-1 overflow-hidden py-1"
        :data-date-attr="currentDate"
        @click.prevent="calendarActions.handleCellClick($event, currentDate, '', true)"
      >
        <CalendarEvent
          v-for="(calendarEvent, idx) in !showCollapsable || !isCollapsed
            ? dayFullDayEvents
            : dayFullDayEvents.slice(0, 4)"
          class="w-[21%] cursor-pointer"
          :event="{ ...calendarEvent, idx }"
          :key="calendarEvent.id"
          :date="currentDate"
          @click.stop
        />
        <Button
          v-if="showCollapsable && isCollapsed && dayFullDayEvents.length > 4"
          :label="dayFullDayEvents.length - 4 + ' more'"
          variant="ghost"
          class="!h-6 w-fit cursor-pointer !justify-start text-sm"
          @click.stop="isCollapsed = false"
        />
      </div>
    </div>
    <div class="h-full overflow-hidden">
      <div
        class="flex h-full w-full overflow-scroll border-outline-gray-1"
        :class="[config.noBorder ? 'border-t-[1px]' : 'border-[1px] border-r-0']"
        ref="gridRef"
      >
        <!-- Left column -->
        <div class="grid h-full w-20 grid-cols-1">
          <span
            v-for="time in 24"
            class="flex h-[72px] items-end justify-center text-center text-sm font-normal text-ink-gray-5"
            :style="{ height: `${hourHeight}px` }"
          />
        </div>

        <!-- Calendar Grid / Right Column -->
        <div class="grid h-full w-full grid-cols-1 pb-2">
          <div
            class="calendar-column relative border-l-[1px] border-outline-gray-1"
            :class="[config.noBorder ? '' : 'border-r-[1px]']"
          >
            <!-- Day Grid -->
            <div
              class="relative flex text-ink-gray-8"
              v-for="(time, i) in timeArray"
              :key="time"
              :data-time-attr="i == 0 ? '' : time"
              @click="calendarActions.handleCellClick($event, currentDate, time)"
            >
              <div
                class="w-full border-outline-gray-1"
                :class="i !== timeArray.length - 1 && 'border-b-[1px]'"
                :style="{ height: `${hourHeight}px` }"
              />
            </div>
            <CalendarEvent
              v-for="(calendarEvent, idx) in timedEvents[parseDate(currentDate)]"
              class="absolute mb-2 cursor-pointer"
              :event="calendarEvent"
              :key="calendarEvent.id"
              :date="currentDate"
            />
            <!-- Current time Marker -->
            <CalendarTimeMarker :date="currentDate" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, inject, onMounted, ref, watch } from 'vue'

import { Button } from '../Button'
import CalendarEvent from './CalendarEvent.vue'
import CalendarTimeMarker from './CalendarTimeMarker.vue'
import {
  parseDate,
  parseDateWithDay,
  twelveHoursFormat,
  twentyFourHoursFormat,
} from './calendarUtils'
import useCalendarData from './composables/useCalendarData'

const props = defineProps({
  events: {
    type: Object,
    required: false,
  },
  config: {
    type: Object,
  },
  currentDate: {
    type: Object,
    required: true,
  },
})
const timedEvents = computed(() => useCalendarData(props.events).timedEvents.value)
const fullDayEvents = computed(() => useCalendarData(props.events).fullDayEvents.value)
const gridRef = ref(null)
const hourHeight = props.config.hourHeight
const minuteHeight = hourHeight / 60

const showCollapsable = ref(false)
const isCollapsed = ref(true)
const dayFullDayEvents = computed(() => fullDayEvents.value?.[parseDate(props.currentDate)] || [])

function updateFullDayEventsState() {
  // Show collapsible if more than 4 events
  showCollapsable.value = dayFullDayEvents.value.length > 4
  if (!showCollapsable.value) {
    isCollapsed.value = true
  }
}

watch(dayFullDayEvents, updateFullDayEventsState, { immediate: true })

const timeArray = props.config.timeFormat == '24h' ? twentyFourHoursFormat : twelveHoursFormat

onMounted(() => {
  const currentHour = new Date().getHours()
  const scrollToHour = props.config.scrollToHour || currentHour
  gridRef.value.scrollBy(0, scrollToHour * 60 * minuteHeight - 10)
})

const calendarActions = inject('calendarActions')
</script>
