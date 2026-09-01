<template>
  <!--
    The day as a list, beside the grid rather than instead of it.

    The grid can only show the hours on screen, and it spends its width on time
    it has nothing to put in. The rail reads the day whole: what is on, how much
    of the day that comes to, where the free stretches are, and — the thing the
    grid cannot do at all — what runs past the bottom of the scroll.
  -->
  <div
    class="flex w-80 shrink-0 flex-col gap-1 overflow-y-auto border-l border-outline-gray-1 bg-surface-gray-1 p-3.5"
  >
    <h3 class="text-base font-medium text-ink-gray-9">{{ heading }}</h3>
    <p class="mb-2 text-xs text-ink-gray-5">{{ summary }}</p>

    <template v-if="allDayEvents.length">
      <p class="calendar-rail-section">All day</p>
      <CalendarEventRow
        v-for="event in allDayEvents"
        :key="String(event.id ?? event.name)"
        :event="event"
        :date="date"
        surface="rail"
        @select="(e) => emit('select', e)"
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
      </CalendarEventRow>
    </template>

    <p class="calendar-rail-section">Schedule</p>
    <p v-if="!rows.length" class="px-2 py-1.5 text-xs text-ink-gray-4">
      Nothing on the clock today.
    </p>
    <template v-for="row in rows" :key="row.key">
      <!-- A gap is drawn where it falls, so the list keeps the shape of the
           day rather than closing up over its quiet parts. -->
      <p v-if="row.gap" class="calendar-rail-gap">
        <span>{{ gapLabel(row.gap) }}</span>
      </p>
      <CalendarEventRow
        :event="row.event"
        :date="date"
        surface="rail"
        @select="(e) => emit('select', e)"
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
      </CalendarEventRow>
    </template>
  </div>
</template>

<script setup lang="ts">
import './style.css'

import { computed } from 'vue'
import { daysListFull, monthList } from './calendarUtils'
import { daySummary, freeGaps, gapLabel, type Interval } from './dayRail'
import CalendarEventRow from './CalendarEventRow.vue'
import type { CalendarEvent } from './types'

const props = defineProps<{
  /** The day's timed events, in the order the grid holds them. */
  events: CalendarEvent[]
  allDayEvents: CalendarEvent[]
  date: Date
}>()

const emit = defineEmits<{ select: [event: CalendarEvent] }>()

const heading = computed(
  () =>
    `${daysListFull[props.date.getDay()]}, ${props.date.getDate()} ${monthList[props.date.getMonth()]}`,
)

const summary = computed(() =>
  daySummary([...props.events, ...props.allDayEvents]),
)

const byStart = computed(() =>
  [...props.events].sort((a, b) => (a.startTime || 0) - (b.startTime || 0)),
)

/** Each row, with the free stretch that opens immediately before it. */
const rows = computed(() => {
  const gaps = freeGaps(props.events)
  return byStart.value.map((event) => {
    const gap = gaps.find((g: Interval) => g.to === (event.startTime || 0))
    return {
      key: `${String(event.id ?? event.name)}-${event.startTime}`,
      event,
      gap,
    }
  })
})
</script>
