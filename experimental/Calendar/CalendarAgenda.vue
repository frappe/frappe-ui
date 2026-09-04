<template>
  <!--
    Three months as a list of days.

    A grid spends the same room on every day whether or not anything is in it.
    The agenda spends room only where the events are: a quiet day is not listed,
    and the rows that remain have width enough to say where an event is and who
    is coming — the things a pill has no space for.

    Every day row carries its own bottom border, so there is a line under the
    last one wherever the list happens to end. The box's own bottom edge is an
    inset shadow rather than a border, so it stays pinned to the bottom of the
    scroll — closing off a list cut mid-row — and lands on the same pixel as a
    row's border when the two meet, instead of drawing the line twice.
  -->
  <div
    ref="scroller"
    class="flex flex-1 flex-col overflow-y-auto rounded-6"
    :class="[
      config.noBorder
        ? 'border-t-[1px]'
        : 'calendar-list-edge border-[1px] border-b-0',
    ]"
  >
    <!-- A span with nothing in it says so once, rather than as a lone
         collapsed row naming dates you can already see. -->
    <p v-if="isEmpty" class="p-10 text-center text-sm text-ink-gray-4">
      Nothing on between {{ spanLabel }}.
    </p>

    <div
      v-for="row in isEmpty ? [] : rows"
      :key="row.key"
      :data-strip-date="row.key"
      class="flex border-b border-outline-gray-1 px-4 py-2.5"
    >
      <!-- Baselines, not box centres: the date is a size larger than the
           weekday and sits in a 30px circle, so centring the two boxes leaves
           the numeral riding above the word beside it. The exception is a row
           naming its month, where the words beside the date are two lines and
           the date belongs against the middle of them. -->
      <div
        class="flex w-[150px] shrink-0 gap-2.5"
        :class="row.opensMonth ? 'items-center' : 'items-baseline'"
      >
        <span
          class="inline-flex size-[30px] items-center justify-center rounded-full text-base font-medium"
          :class="
            row.isToday ? 'bg-surface-gray-10 text-ink-base' : 'text-ink-gray-8'
          "
        >
          {{ row.date.getDate() }}
        </span>
        <!-- The month, on the row that opens one: the window spans three, and a
             column of bare numerals running 24, 1, 8 has crossed a month end
             without saying so. -->
        <span class="flex min-w-0 flex-col">
          <span class="text-sm font-medium text-ink-gray-8">
            {{ weekday(row.date) }}
          </span>
          <span v-if="row.opensMonth" class="text-2xs text-ink-gray-5">
            {{ monthList[row.date.getMonth()] }}
          </span>
        </span>
      </div>

      <div class="flex min-w-0 flex-1 flex-col gap-0.5">
        <!-- The same red rule the grid draws: the clock's own place in a list
             ordered by start, so what has begun is above it. -->
        <template
          v-for="(event, index) in row.events"
          :key="String(event.id ?? event.name)"
        >
          <span v-if="row.isToday && index === nowAt(row)" class="calendar-now" />
          <CalendarEventRow :event="event" :date="row.date">
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
        <span
          v-if="row.isToday && nowAt(row) === row.events.length"
          class="calendar-now"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import './style.css'

import { computed, inject, ref } from 'vue'
import { agendaRange, agendaRows, type AgendaRow } from './agendaDays'
import { daysListFull, monthList } from './calendarUtils'
import { useNow } from './composables/useNow'
import CalendarEventRow from './CalendarEventRow.vue'
import { nowRowIndex } from './eventRow'
import {
  CALENDAR_ACTIONS_KEY,
  type CalendarConfig,
  type CalendarEvent,
} from './types'

const props = defineProps<{
  events?: CalendarEvent[]
  config: CalendarConfig
  /** The day the list runs from. */
  anchor: Date
}>()

const calendarActions = inject(CALENDAR_ACTIONS_KEY)

if (!calendarActions) {
  throw new Error('CalendarAgenda must be rendered inside Calendar.')
}

const scroller = ref<HTMLElement | null>(null)

// The clock, not `new Date()` in the computed: the list is scoped from today,
// so it has to re-scope itself when today changes rather than stranding a
// viewer on yesterday's range.
const now = useNow()

const rows = computed(() =>
  agendaRows(props.events ?? [], props.anchor, props.config, now.value),
)

const isEmpty = computed(() => !rows.value.length)

/** "4 September and 31 October" — the ends of the window, for the empty state. */
const spanLabel = computed(() => {
  const { start, end } = agendaRange(props.anchor, now.value)
  const on = (d: Date) => `${d.getDate()} ${monthList[d.getMonth()]}`
  return `${on(start)} and ${on(end)}`
})

const weekday = (date: Date) => daysListFull[date.getDay()]

/** Which row of today's list the now-marker goes above. */
const nowAt = (row: AgendaRow) => nowRowIndex(row.events, now.value)
</script>
