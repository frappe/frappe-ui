<template>
  <!--
    Three months as a list of days, each day a card.

    A grid spends the same room on every day whether or not anything is in it.
    The agenda spends room only where the events are: a quiet day is not listed,
    and the rows that remain have width enough to say where an event is and who
    is coming — the things a pill has no space for.

    The days are cards rather than rows against a rule, and they are grouped
    under the week they fall in. The box closes with a real bottom border, not
    the inset shadow the list used when its rows were transparent: a card
    carries an opaque fill, and content paints over an inset shadow — so the
    line vanished exactly when a card was cut by the bottom of the scroll. A card is a day you can take
    in whole — its name, its date, how much is on it, then its events — where a
    run of ruled rows leaves the reader to find where one day stops and the next
    begins. The week labels replace the month dividers the list used to carry:
    "Week of Sep 13" names the month too, and does it every seven days rather
    than every thirty.
  -->
  <div
    ref="scroller"
    class="flex min-h-0 flex-1 flex-col overflow-y-auto rounded-6 bg-surface-base"
    :class="[config.noBorder ? 'border-t-[1px]' : 'border-[1px]']"
  >
    <!-- A span with nothing in it says so once, rather than as a lone
         collapsed row naming dates you can already see. -->
    <p v-if="isEmpty" class="p-10 text-center text-sm text-ink-gray-4">
      Nothing on between {{ spanLabel }}.
    </p>

    <div v-else class="flex flex-col gap-3.5 p-3">
      <template v-for="block in blocks" :key="block.key">
        <!-- The week the cards below it fall in. -mb-1 against the canvas gap:
             a label belongs to what follows it, so it sits closer to its first
             card than to the last card of the week above.

             A size above the day names it heads, in sentence case rather than
             as an uppercase eyebrow: an eyebrow is a label *on* what follows
             it, and a week is the level *above* the days in it. Read small and
             set in caps, it lost to the 13px day names under it however dark
             the ink was — the fix is rank, not contrast. Its range always
             follows it, muted: the label names the week and the range dates
             it. -->
        <div
          v-if="block.kind === 'week'"
          data-strip-week
          class="calendar-week-label -mb-1 mt-1 px-0.5 text-base-semibold text-ink-gray-9"
          :class="{ past: block.isPast }"
        >
          {{ weekName(block) ?? weekLabel(block) }}
          <span v-if="weekName(block)" class="ml-2 text-xs text-ink-gray-4">
            {{ agendaRangeLabel(block.start, block.end) }}
          </span>
        </div>

        <!-- One day. Today's card is the one edged in blue, with a dot of the
             same blue in its header.

             Its header rule is blue too: that rule runs edge to edge and meets
             the card's own border at both ends, so leaving it gray broke the
             outline in two places on the one card meant to read as whole.

             The header carries the wash as well, a rung lower in dark than in
             light. The blue ramp is not perceptually even between the themes:
             `blue-1` against white is a step you have to look for, while
             `blue-1` against near-black is already a band — so the rung that
             reads as a highlight in one reads as chrome in the other. Same
             mark, different rung, because the ground is different. -->
        <div
          v-else
          :data-strip-date="block.row.key"
          :data-today="block.row.isToday || undefined"
          class="overflow-hidden rounded-5 border bg-surface-base"
          :class="
            block.row.isToday
              ? 'border-outline-blue-2'
              : 'border-outline-gray-2'
          "
        >
          <div
            class="calendar-day-header flex items-baseline gap-2 border-b px-3.5 py-2.5"
            :class="{
              'border-outline-blue-2 bg-surface-blue-1': block.row.isToday,
              'border-outline-gray-1': !block.row.isToday,
              past: block.row.isPast,
            }"
          >
            <!-- Today, in the one mark a header has room for beside the name
                 it already carries — the same blue as the card's own edge, so
                 the two read as one signal. Centred rather than baselined: a
                 dot has no baseline of its own to sit on. -->
            <span
              v-if="block.row.isToday"
              class="size-2 shrink-0 self-center rounded-full bg-surface-blue-5"
            />
            <!-- Three levels, three distinctions: the week above is a size
                 larger and a weight heavier, the event titles below share this
                 size and weight and are separated by ink alone. That last step
                 is the quiet one, and it is the one holding a card apart from
                 its own contents. -->
            <span class="text-sm-medium text-ink-gray-9">
              {{ weekday(block.row.date) }}
            </span>
            <span class="text-xs text-ink-gray-5">
              {{ dayLabel(block.row) }}
            </span>
            <!-- How much is on the day, from the header rather than from
                 counting rows — a card scrolled to its own header still says
                 how far it runs. Only once there is more than one: "1 event"
                 over a single row counts what the reader is already looking
                 at. -->
            <span
              v-if="block.row.events.length > 1"
              class="ml-auto text-2xs text-ink-gray-4"
            >
              {{ block.row.events.length }} events
            </span>
          </div>

          <CalendarEventRow
            v-for="event in block.row.events"
            :key="String(event.id ?? event.name)"
            :event="event"
            :date="block.row.date"
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
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import './style.css'

import { computed, inject, nextTick, onMounted, ref, watch } from 'vue'
import {
  agendaBlocks,
  agendaRange,
  agendaRangeLabel,
  type AgendaDayBlock,
  type AgendaWeekBlock,
} from './agendaDays'
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

/** The canvas's own padding, in pixels — what the list keeps above what it scrolls to. */
const LIST_INSET = 12

// The clock, not `new Date()` in the computed: the list is scoped from today,
// so it has to re-scope itself when today changes rather than stranding a
// viewer on yesterday's range.
const now = useNow()

const blocks = computed(() =>
  agendaBlocks(props.events ?? [], props.anchor, props.config, now.value),
)

const isEmpty = computed(() => !blocks.value.length)

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
  const target = [
    ...box.querySelectorAll<HTMLElement>('[data-strip-date]'),
  ].find((el) => (el.dataset.stripDate ?? '') >= todayKey)
  // Nothing ahead: the span is behind the reader, so leave it where it opened
  // rather than jumping to the bottom.
  if (!target) return

  // A card that opens its week is scrolled to from its label, not from its own
  // top edge: putting the card flush against the top of the box would hide the
  // heading that says which week the reader has landed in.
  const previous = target.previousElementSibling
  const top = previous?.hasAttribute('data-strip-week') ? previous : target

  // Measured, not offsetTop: that is relative to the nearest positioned
  // ancestor, which is not this box, and the list landed a row short of the mark.
  // Less the canvas's own top padding: landed flush against the top edge, a week
  // label reads as cut off rather than as the top of what follows it, and the
  // list opens with the air above it that it has when scrolled to the very top.
  box.scrollTop +=
    top.getBoundingClientRect().top -
    box.getBoundingClientRect().top -
    LIST_INSET
}

// On mount, and again when the span changes under it — paging either way, or a
// day turning over while the view is left open. nextTick so the rows for the new
// span exist before the list is put where it belongs.
onMounted(() => nextTick(positionList))
watch(
  () => [props.anchor, blocks.value.length],
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

/**
 * The word for a day near enough to have one — today and the day either side of
 * it. Beyond that a name is worse than a date: "in three days" is arithmetic
 * the date has already done.
 */
const dayName = (row: AgendaDayBlock['row']) => {
  if (row.isToday) return 'Today'
  if (row.isTomorrow) return 'Tomorrow'
  if (row.isYesterday) return 'Yesterday'
  return null
}

/** "7 September", and "· Today" on the days that have a word of their own. */
const dayLabel = (row: AgendaDayBlock['row']) => {
  const date = `${row.date.getDate()} ${monthList[row.date.getMonth()]}`
  const name = dayName(row)
  return name ? `${date} \u00b7 ${name}` : date
}

/** "Sep 13 – 19" — the days the week covers, which is its name. */
const weekLabel = (block: AgendaWeekBlock) =>
  agendaRangeLabel(block.start, block.end)

/**
 * The word for a week near enough to have one — the one under way and the one
 * either side of it. Beyond that the names stop meaning anything ("the week
 * after next" is already a date lookup), so those weeks go by their dates
 * alone.
 */
const weekName = (block: AgendaWeekBlock) => {
  if (block.isCurrent) return 'This week'
  if (block.isNext) return 'Next week'
  if (block.isPrevious) return 'Last week'
  return null
}
</script>
