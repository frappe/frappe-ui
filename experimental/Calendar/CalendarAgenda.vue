<template>
  <!--
    Three months as a list of weeks, each week a card of the days that have
    something on them.

    A grid spends the same room on every day whether or not anything is in it.
    The agenda spends room only where the events are: a quiet day is not listed,
    and the rows that remain have width enough to say where an event is and who
    is coming — the things a pill has no space for.

    The list has no frame of its own and no padding around the cards: the cards
    are the frames, and a border around a column of bordered things is a line
    parallel to another line a few pixels away. The panel's edges are the
    window's — `noBorder` has nothing left to switch off here.

    The card is the week, and the days inside it are sections divided by a rule.
    A card per day drew a box around every one of them, so a fortnight of one
    standup a day came to a dozen boxes and the eye had nothing left to catch on
    — the week was named in the gaps between the boxes rather than held by
    anything. Grouping at the week means one bordered thing per label, days
    reading as its parts: the level a reader scrolls by is the level with an
    outline. The box closes with a real bottom border, not the inset shadow the
    list used when its rows were transparent: a card carries an opaque fill, and
    content paints over an inset shadow — so the line vanished exactly when a
    card was cut by the bottom of the scroll. The week labels replace the month
    dividers the list used to carry: "Sep 13 – 19" names the month too, and does
    it every seven days rather than every thirty.
  -->
  <div
    ref="scroller"
    class="flex min-h-0 flex-1 flex-col overflow-y-auto bg-surface-base"
  >
    <!-- Nothing yet, as against nothing at all: a list is a blank panel either way,
         and "nothing on between September and November" is a claim about a range
         whose events have not arrived. It waits to say it. -->
    <div v-if="isEmpty && loading" class="flex justify-center p-10">
      <Spinner size="lg" class="text-ink-gray-4" />
    </div>
    <!-- A span with nothing in it says so once, rather than as a lone
         collapsed row naming dates you can already see. -->
    <p v-else-if="isEmpty" class="p-10 text-center text-sm text-ink-gray-4">
      Nothing on between {{ spanLabel }}.
    </p>

    <div v-else class="flex flex-col gap-5">
      <div v-for="week in weeks" :key="week.key">
        <!-- The week the card below it holds. A size above the day names inside
             it, in sentence case rather than as an uppercase eyebrow: an eyebrow
             is a label *on* what follows it, and a week is the level *above* the
             days in it. Read small and set in caps, it lost to the 13px day
             names under it however dark the ink was — the fix is rank, not
             contrast. Its range always follows it, muted: the label names the
             week and the range dates it.

             It is the way into the week, as a gutter is the way into its day:
             the two labels in the list are the two spans the list is made of,
             so pressing one opens the view that spans it. inline-flex so the
             hover fill stops where the words do — a label is not a row, and a
             band the width of the card would read as one.

             py-1.5 so the fill reads as a target rather than as a highlight
             behind the words, and mb-1.5 under it to pay the padding back: the
             label keeps its 12px of air to the card it heads, against the 24px
             above it, which is the grouping — a label belongs to what follows
             it.

             ml-[3px] does the same for the horizontal. The card's text column
             starts at 15px — its own 1px border, then the gutter's 14px of
             padding — and the label's fill is inset 12, so 3px of margin is
             what puts its first letter over the day names below it. Spelled in
             pixels because it is not a spacing decision: it is the difference
             between two paddings and a border, and the scale has no step at
             it. -->
        <button
          type="button"
          data-strip-week
          class="calendar-week-label mb-1.5 ml-[3px] inline-flex cursor-pointer items-baseline gap-2 rounded-4 px-3 py-1.5 text-base-semibold text-ink-gray-9 hover:bg-surface-gray-2"
          :class="{ past: week.isPast }"
          @click="openWeek(week.start)"
        >
          {{ weekName(week) ?? weekLabel(week) }}
          <span v-if="weekName(week)" class="text-xs text-ink-gray-4">
            {{ agendaRangeLabel(week.start, week.end) }}
          </span>
        </button>

        <div
          class="overflow-hidden rounded-5 border border-outline-gray-2 bg-surface-base"
        >
          <!-- One day, as a row of its week: the day in a column down the
               left, its events in the wider one beside it.

               Headed, a day cost a full row of height to say a date, and a day
               with one event on it spent half its height saying which day the
               event was on. Beside them, the same words cost nothing the events
               were using — the gutter is as tall as the day is, however many
               rows that is, and the reader scans a single column of dates
               rather than one interleaved with the events under each.

               The gutter is the way into the day as well: it is the one part
               of a row that names the day rather than an event on it, so it is
               the part that can carry "go there" without taking the click a row
               already has. Pressing it opens that day in the Day view.

               Today's is the gutter washed blue, and the one whose label opens
               with a word rather than a weekday. Every other gutter carries no
               wash at all: the rule down its edge is what makes it a column,
               and a fill behind every day as well left the one day that is
               marked competing with a gray band running the length of the list.
               Unwashed, the blue is the only fill in the gutter, and the gray
               step is free for what a gutter does when you point at it.

               The rules stay with the wash: today is boxed in blue on every
               side it owns — the rule above it, the one closing its gutter, and
               the rule below it, which belongs to the day after and is drawn
               blue because of what it divides *from*. A gray line along any of
               them cut the blue band open along the side the eye arrives from,
               and three blue edges with a gray fourth read as an unfinished
               box rather than a highlight. Where today meets the top or bottom
               of its card the card's own gray border stands — the week is the
               thing outlined, and a day cannot take that outline over without
               breaking it. The hairlines *inside* today stay gray as well: they
               divide one event from the next, which is not what the blue is
               saying.

               The wash sits a rung lower in dark than in light. The blue ramp is
               not perceptually even between the themes: `blue-1` against white
               is a step you have to look for, while `blue-1` against near-black
               is already a band — so the rung that reads as a highlight in one
               reads as chrome in the other. Same mark, different rung, because
               the ground is different. -->
          <div
            v-for="(row, index) in week.days"
            :key="row.key"
            :data-strip-date="row.key"
            :data-today="row.isToday || undefined"
            class="flex"
            :class="{
              'border-t': index,
              'border-outline-blue-2':
                index && (row.isToday || !!week.days[index - 1]?.isToday),
              'border-outline-gray-2':
                index && !row.isToday && !week.days[index - 1]?.isToday,
            }"
          >
            <!-- 224px, less its own padding: enough for the longest thing a
                 gutter has to say — "Yesterday" beside "Wednesday, 10 Sep" — on
                 one line. The weekday is spelled out and the month is not, so
                 the column is sized to that pair; abbreviating the month is
                 what keeps it from needing another 40px.

                 One line is the point, not a saving. The gutter and the rows
                 beside it are the two halves of a flex row, so a day stands as
                 tall as whichever is taller: stacked over two lines the gutter
                 was 52px against a row's 36, and every day with a single event
                 on it carried 16px of blank beside that event. At one line the
                 two are the same height and a day is exactly as tall as what is
                 on it, however much that is.

                 It costs the count that used to head the day. That count was
                 worth its line when the day was a band above its rows and could
                 be scrolled away from; a label beside the rows is level with
                 them, and a reader looking at the label is looking at the rows
                 it dates. -->
            <button
              type="button"
              class="calendar-day-header flex w-56 shrink-0 cursor-pointer items-baseline gap-2 border-r px-3.5 py-2.5 text-left"
              :class="{
                'border-outline-blue-2 bg-surface-blue-1 hover:bg-surface-blue-2':
                  row.isToday,
                'border-outline-gray-2 hover:bg-surface-gray-1': !row.isToday,
                past: row.isPast,
              }"
              @click="openDay(row.date)"
            >
              <!-- The gutter is a margin note, so it is set below the events
                   it heads — but in ink rather than in size. It shares the
                   title's 13px, and gives up a step of ink instead: `gray-8`
                   against `gray-9`, and the date behind that again at `gray-5`.
                   In the darkest ink it read as the loudest thing on a day, a
                   column of "Today"s running down the side of events they were
                   only there to date; a size down quieted it, but a column of
                   dates is a thing you read, and it went small enough to squint
                   at. The week label above stays a size larger, so the levels
                   still descend.

                   leading-5 on both, and the same py a row takes: the day and
                   the first event beside it sit on one baseline, which is what
                   makes the gutter read as heading the rows rather than as a
                   column of its own — and what keeps a one-event day exactly one
                   row tall. The two paddings move together or the gutter pulls
                   the day taller than what is on it.

                   The date truncates rather than wraps. A second line would put
                   the day back to 52px and the blank beside a lone event back
                   with it; a clipped word says the same thing the visible ones
                   do. -->
              <span class="shrink-0 text-sm-medium leading-5 text-ink-gray-8">
                {{ dayName(row) ?? weekday(row.date) }}
              </span>
              <span class="min-w-0 truncate text-sm leading-5 text-ink-gray-5">
                {{ dayLabel(row) }}
              </span>
            </button>

            <div class="min-w-0 flex-1">
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
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import './style.css'

import { computed, inject, nextTick, onMounted, ref, watch } from 'vue'
import {
  agendaRange,
  agendaRangeLabel,
  agendaWeeks,
  type AgendaRow,
  type AgendaWeek,
} from './agendaDays'
import { daysListFull, monthList, parseDate } from './calendarUtils'
import { shortMonth } from './monthStrip'
import { useNow } from './composables/useNow'
import CalendarEventRow from './CalendarEventRow.vue'
import { Spinner } from '#components/Spinner'
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
  /** Whether the events for this span are still on their way. */
  loading?: boolean
  /**
   * Bumped by the calendar each time it is told to go to a date. The list scrolls
   * back to where that date belongs even when it is the date the list is already
   * anchored on: a list is scrolled, so "go to today" from halfway down November is
   * a real instruction, and the anchor alone cannot tell it from nothing happening.
   */
  jump?: number
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

const weeks = computed(() =>
  agendaWeeks(props.events ?? [], props.anchor, props.config, now.value),
)

const isEmpty = computed(() => !weeks.value.length)

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
 * The span the list has been put in place for: the months it is anchored on and
 * the jump that sent it there. Anything the list is asked to position for again
 * under this same key is a redraw, not a move, and a redraw leaves the scroll
 * where the reader left it.
 */
const spanKey = computed(
  () =>
    `${props.anchor.getFullYear()}-${props.anchor.getMonth()}|${props.jump ?? 0}`,
)

/** The span `positionList` last acted on; '' until it has acted at all. */
let positionedFor = ''

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
  // Nothing to aim at yet — the events are still on their way. The span is
  // positioned when they land, not against the empty list they land in.
  if (!weeks.value.length) return

  positionedFor = spanKey.value
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

  // A day that opens its week is scrolled to from that week's label, not from
  // its own top edge: putting the card flush against the top of the box would
  // hide the heading that says which week the reader has landed in. The label
  // is a sibling of the card, so it is reached past the card — a day further
  // down has a day above it inside the card instead, and stands for itself.
  const previous =
    target.previousElementSibling ??
    target.parentElement?.previousElementSibling
  const top = previous?.hasAttribute('data-strip-week') ? previous : target

  // Measured, not offsetTop: that is relative to the nearest positioned
  // ancestor, which is not this box, and the list landed a row short of the mark.
  box.scrollTop +=
    top.getBoundingClientRect().top - box.getBoundingClientRect().top
}

// On mount, and again when the reader is sent somewhere — paged either way, or
// told to go to a date — and once more when the events for such a span finally
// arrive. nextTick so the rows exist before the list is put where it belongs.
//
// The guard is what keeps a redraw from being read as a move: the list is
// re-rendered by things that are none of its business — an event opening beside
// it, a refetch returning the same days, the clock ticking over — and every one
// of those used to scroll the reader back to today from wherever they had got
// to. A span is positioned once, and then left alone until it is a different
// span.
onMounted(() => nextTick(positionList))
watch([spanKey, () => weeks.value.length], () => {
  if (positionedFor === spanKey.value) return
  nextTick(positionList)
})

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

/**
 * The day the gutter names, opened in the Day view — the same pair of actions
 * the Month view's date button takes, so a day reached from the list and a day
 * reached from the grid leave the calendar in the same state.
 */
const openDay = (date: Date) => {
  calendarActions.setCalendarDate(date)
  calendarActions.updateActiveView('Day', date)
}

/**
 * The week the label names, opened in the Week view.
 *
 * The date first, then the view, and the view a tick later: `updateActiveView`
 * picks the week out of the calendar's own selected date, and `setCalendarDate`
 * only settles that date on the next tick — asked in the same one, the Week view
 * opened on whichever week the reader had been looking at before.
 */
const openWeek = (start: Date) => {
  calendarActions.setCalendarDate(start)
  nextTick(() => calendarActions.updateActiveView('Week', start))
}

const weekday = (date: Date) => daysListFull[date.getDay()]

/**
 * The word for a day near enough to have one — today and the day either side of
 * it. Beyond that a name is worse than a date: "in three days" is arithmetic
 * the date has already done.
 *
 * It heads the day in place of the weekday, the way "This week" heads a week in
 * place of its dates: every other day opens with a weekday, so the one that does
 * not is the one the eye stops on — and the word that makes a day findable
 * belongs in the slot a reader is scanning, not trailing the date in the
 * lightest ink on the line.
 */
const dayName = (row: AgendaRow) => {
  if (row.isToday) return 'Today'
  if (row.isTomorrow) return 'Tomorrow'
  if (row.isYesterday) return 'Yesterday'
  return null
}

/**
 * "7 Sep" — with the weekday in front of it on a day that gave its name away to
 * `dayName`, so no day loses the word it is called by.
 *
 * The month is abbreviated, as it is in the week label above: the reader is
 * inside a span the header has already named, so "September" spelled out is the
 * longest word in the gutter saying the least. The weekday is not — it is the
 * thing the line is looked up by, and "Wed" is a lookup of its own.
 */
const dayLabel = (row: AgendaRow) => {
  const date = `${row.date.getDate()} ${shortMonth(row.date)}`
  return dayName(row) ? `${weekday(row.date)}, ${date}` : date
}

/** "Sep 13 – 19" — the days the week covers, which is its name. */
const weekLabel = (week: AgendaWeek) => agendaRangeLabel(week.start, week.end)

/**
 * The word for a week near enough to have one — the one under way and the one
 * either side of it. Beyond that the names stop meaning anything ("the week
 * after next" is already a date lookup), so those weeks go by their dates
 * alone.
 */
const weekName = (week: AgendaWeek) => {
  if (week.isCurrent) return 'This week'
  if (week.isNext) return 'Next week'
  if (week.isPrevious) return 'Last week'
  return null
}
</script>
