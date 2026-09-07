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
    class="flex min-h-0 flex-1 flex-col overflow-y-auto rounded-6"
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
      :data-today="row.isToday || undefined"
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
        <CalendarEventRow
          v-for="event in row.events"
          :key="String(event.id ?? event.name)"
          :event="event"
          :date="row.date"
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

import { computed, inject, nextTick, onMounted, ref, watch } from 'vue'
import { agendaRange, agendaRows } from './agendaDays'
import { daysListFull, monthList, parseDate } from './calendarUtils'
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

/**
 * The month runs from its 1st, so the list opens on days already spent. What
 * the reader came for leads instead: the first day still to come, with the
 * earlier ones above it — present, a scroll away.
 *
 * The first row *on or after* today, not today's own: a quiet day has no row at
 * all, and anchoring on one that may not exist left the list sitting at the 1st
 * on exactly the days with nothing to push it down.
 *
 * scrollTop rather than scrollIntoView, which walks up the ancestors and can
 * take the page with it — this list is the only thing that should move.
 */
/**
 * Whether the span is the one the view opens on — anchored on today's own
 * month, not merely reaching far enough to include it. Paging back a month
 * still spans today (three months from August covers September), and scrolling
 * there would drag the reader forward out of the month they asked for.
 */
const anchoredOnThisMonth = computed(
  () =>
    props.anchor.getFullYear() === now.value.getFullYear() &&
    props.anchor.getMonth() === now.value.getMonth(),
)

/**
 * Where a span opens: on the months the view starts from, at the first day
 * still to come; on any other span, at its first day.
 *
 * That second case is not a no-op. One scroller serves every span, and paging
 * back prepends a month of rows above the viewport — the browser's scroll
 * anchoring then holds the old rows still by growing scrollTop, landing the
 * reader in the middle of months they just asked to see from the start.
 */
const positionList = () => {
  const box = scroller.value
  if (!box) return
  // Paged either way, the reader asked for those months as a whole, so the list
  // belongs at their first day; jumping to today would answer a question they
  // did not ask.
  if (!anchoredOnThisMonth.value) {
    box.scrollTop = 0
    return
  }

  const todayKey = parseDate(now.value)
  const target = [...box.querySelectorAll<HTMLElement>('[data-strip-date]')].find(
    (el) => (el.dataset.stripDate ?? '') >= todayKey,
  )
  // Nothing ahead: the span is behind the reader, so leave it where it opened
  // rather than jumping to the bottom.
  if (!target) return

  // Measured, not offsetTop: that is relative to the nearest positioned
  // ancestor, which is not this box, and the list landed a row short of the mark.
  box.scrollTop += target.getBoundingClientRect().top - box.getBoundingClientRect().top
}

// On mount, and again when the span changes under it — paging either way, or a
// day turning over while the view is left open. nextTick so the rows for the new
// span exist before the list is put where it belongs.
onMounted(() => nextTick(positionList))
watch(
  () => [props.anchor, rows.value.length],
  () => nextTick(positionList),
)

/** "4 September and 31 October" — the ends of the window, for the empty state. */
// The months, not the dates its ends land on — the same rule the header's title
// follows. The span is three whole months bar the days of the first already
// spent, so "7 September" names an implementation detail (today) rather than
// anything the reader chose; "September" is the span they actually asked for.
const spanLabel = computed(() => {
  const { start, end } = agendaRange(props.anchor)
  const name = (d: Date) => monthList[d.getMonth()]
  return start.getFullYear() === end.getFullYear()
    ? `${name(start)} and ${name(end)}`
    : `${name(start)} ${start.getFullYear()} and ${name(end)} ${end.getFullYear()}`
})

const weekday = (date: Date) => daysListFull[date.getDay()]
</script>
