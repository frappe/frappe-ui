<template>
  <!--
    The month as a list of days.

    A grid spends the same room on every day whether or not anything is in it.
    The agenda spends room where the events are: quiet days collapse into a
    line, and the row that is left has width enough to say where an event is and
    who is coming — the things a pill has no space for.
  -->
  <div
    ref="scroller"
    class="flex flex-1 flex-col overflow-y-auto"
    :class="[config.noBorder ? 'border-t-[1px]' : 'border-[1px]']"
  >
    <!-- A month with nothing in it says so once, rather than as a lone
         collapsed row naming a span you can already see. -->
    <p v-if="isEmpty" class="p-10 text-center text-sm text-ink-gray-4">
      Nothing on in {{ monthName }}.
    </p>

    <div
      v-for="row in isEmpty ? [] : rows"
      :key="row.key"
      :data-strip-date="row.key"
      class="flex border-b border-outline-gray-1 px-4 py-2.5 last:border-b-0"
      :class="row.isToday && 'bg-surface-gray-1'"
    >
      <div class="flex w-[150px] shrink-0 items-start gap-2.5 pt-1">
        <span
          class="inline-flex size-[30px] items-center justify-center rounded-full text-base font-medium"
          :class="
            row.isToday
              ? 'bg-surface-gray-10 text-ink-white'
              : 'text-ink-gray-8'
          "
        >
          {{ row.date.getDate() }}
        </span>
        <span class="pt-0.5 text-xs leading-relaxed text-ink-gray-5">
          <span class="block text-sm font-medium text-ink-gray-8">
            {{ weekday(row.date) }}
          </span>
          {{ subLabel(row) }}
        </span>
      </div>

      <div class="flex min-w-0 flex-1 flex-col gap-0.5">
        <p
          v-if="!row.events.length"
          class="px-2 py-1.5 text-xs text-ink-gray-4"
        >
          {{ emptyLabel(row) }}
        </p>
        <CalendarEventRow
          v-for="event in row.events"
          :key="String(event.id ?? event.name)"
          :event="event"
          :date="row.date"
          surface="agenda"
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
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import './style.css'

import { computed, inject, ref } from 'vue'
import { agendaRows, type AgendaRow } from './agendaDays'
import { daysList, daysListFull, monthList } from './calendarUtils'
import { useNow } from './composables/useNow'
import CalendarEventRow from './CalendarEventRow.vue'
import {
  CALENDAR_ACTIONS_KEY,
  type CalendarConfig,
  type CalendarEvent,
} from './types'

const props = defineProps<{
  events?: CalendarEvent[]
  config: CalendarConfig
  currentMonth: number
  currentYear: number
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
  agendaRows(
    props.events ?? [],
    props.currentMonth,
    props.currentYear,
    props.config,
    now.value,
  ),
)

const isEmpty = computed(() => rows.value.every((row) => !row.events.length))

const monthName = computed(() => monthList[props.currentMonth])

const weekday = (date: Date) => daysListFull[date.getDay()]

const subLabel = (row: AgendaRow) => {
  if (row.isToday) return 'Today'
  return row.isWeekend ? 'Weekend' : ''
}

/** "No events · Sat 22 – Sun 23", or the single day when the run is one. */
const emptyLabel = (row: AgendaRow) => {
  const from = row.date
  const to = row.emptyThrough ?? row.date
  const day = (d: Date) => `${daysList[d.getDay()]} ${d.getDate()}`
  return to.getDate() === from.getDate()
    ? `No events · ${day(from)}`
    : `No events · ${day(from)} – ${day(to)}`
}
</script>
