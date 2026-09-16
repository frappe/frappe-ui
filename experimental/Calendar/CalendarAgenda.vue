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

    <!-- Inset from a hard edge where the list is narrow. Wide, the host puts
         its own padding round the calendar and the cards' edges are the
         window's; on a phone the grids are drawn to the screen's edge and the
         host gives none, which for a grid is right and for a rounded card is
         a corner cut off by the glass. 12px, and the same again under the last
         card so the scroll does not end on its border. -->
    <div v-else class="flex flex-col gap-5" :class="{ 'px-4 pb-4': isNarrow }">
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
             behind the words, and rounded-3, the corner the day gutters and
             the blocks under it take, so the three fills on the card are one
             family — a step rounder on the label alone read as a different
             kind of thing. mb-1.5 under it to pay the padding back: the
             label keeps its 12px of air to the card it heads, against the 24px
             above it, which is the grouping — a label belongs to what follows
             it.

             text-base, a size over the day names in the gutter, and semibold
             where they are medium: at their own size and a step heavier it
             read as one more day label, and a week's start went by unnoticed
             when scrolling. It was two sizes over for a while, which caught
             the eye but by too much — a heading has to be the largest thing
             on the card by a margin the eye catches without reading, and one
             size with the weight behind it is that margin. Any larger and the
             label outranked the phone's own title above the list.

             Narrow, a size larger again, and the range dropped to a line of
             its own under the name. On the phone the day labels stand alone
             over their blocks rather than in a gutter beside them, so a week
             label one size up and on one line with them read as another day:
             two names each followed by a muted date, a line apart. Two sizes
             up it is a heading, and the range under it rather than beside it
             is the second thing that says so — a day's date rides on its
             line, a week's does not. The phone's own title above the list is
             a size larger still, so the levels keep descending. mb-2 under it
             rather than mb-1.5, so the heading stands off the first day by a
             hair more than the day stands off its blocks.

             ml-[7px] does the same for the horizontal, for the fill and the
             text both. The gutter's fill starts 7px into the card — the card's
             own 1px border, then the gutter's 6px of margin — and the label
             takes the gutter's 8px of padding, so its fill starts where the
             gutters' do and its first letter stands over the day names below
             it, at 15px. A label whose fill sat 2px in from the gutters'
             read as a column of its own beside theirs. Spelled in pixels
             because it is not a spacing decision: it is a margin and a
             border added, and the scale has no step at it.

             Narrow there is no card and no margin. The gutters and the label
             take the 14px the block's text is inset by — its 6px of padding,
             the 2px bar and the 6px gap — so a day's name, a week's, and the
             titles under them stand in one column down the phone. Flush with
             the blocks' edges instead, the labels hung out past the text
             beneath them and the column the eye reads down was broken at
             every heading. -->
        <button
          type="button"
          data-strip-week
          class="calendar-week-label inline-flex cursor-pointer rounded-3 py-1.5 text-ink-gray-8 hover:bg-surface-gray-2"
          :class="{
            past: week.isPast,
            'mb-2 flex-col items-start gap-0.5 px-3.5 text-lg-semibold':
              isNarrow,
            'mb-1.5 ml-[7px] items-baseline gap-2 px-2 text-base-semibold':
              !isNarrow,
          }"
          @click="openWeek(week.start)"
        >
          {{ weekName(week) ?? agendaRangeLabel(week.start, week.end) }}
          <span
            v-if="weekName(week)"
            :class="
              isNarrow ? 'text-sm text-ink-gray-5' : 'text-xs text-ink-gray-4'
            "
          >
            {{ agendaRangeLabel(week.start, week.end) }}
          </span>
        </button>

        <!-- Wide, the week is a card: a border around its days, which are
             rows in a column beside their gutter. Narrow there is no card and
             no rule at all — the rows are tinted blocks that carry their own
             edges, and a day is its label over a stack of them, 16px from the
             next day's. A border around that boxed blocks inside a box. -->
        <div
          :class="
            isNarrow
              ? 'flex flex-col gap-4'
              : 'overflow-hidden rounded-5 border border-outline-gray-1 bg-surface-base'
          "
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

               Today's gutter is drawn like every other day's — no wash, no
               pill, no ink or weight of its own — and says one thing more:
               its name is "Today", and the weekday it would have opened with
               moves in front of the date, "Today  Tue, 15 Sep". The day
               either side of it is not named; a "Tomorrow" is a word for a
               day the reader has to work out, where "Today" is the one day
               they already know. Every mark tried on the words themselves —
               a blue wash boxed in blue rules, a black pill, blue ink, a
               heavier weight, an underline, a dot — was one more thing on
               the line the eye only scans; a word in the slot the eye is
               scanning is the one mark that is read rather than seen. No
               gutter carries a fill of
               its own, and none carries a rule down its edge either: the rows
               beside it are tinted blocks with edges of their own, and a rule
               between a column of text and a column of blocks was a third
               edge saying what the blocks' left edges already say. The
               hairline between one day and the next stays — it divides days,
               which nothing else does — and the gray step is free for what a
               gutter does when you point at it.

               Narrow, the day stacks: the gutter becomes a label across the
               top of its blocks, and the blocks go under it at the list's full
               width. A column beside the rows is bought with width, and a
               phone has none to sell — the gutter and the time column together
               took 356px of a 390px screen before a title had a letter. The
               label costs each day a line of height, the thing the column was
               chosen to save, but height is what a list scrolls through and
               width is what it cannot. No rule under it and none between days:
               the blocks and the 16px between one day's stack and the next are
               the whole structure, as they are in the grid. The label keeps
               4px of its own above and below, on top of the 4px the stack
               puts between its blocks: set exactly a block-gap off the first
               block it read as a block that had lost its fill, and a line of
               air is what tells a heading from a row. -->
          <div
            v-for="(row, index) in week.days"
            :key="row.key"
            :data-strip-date="row.key"
            :data-today="row.isToday || undefined"
            class="flex"
            :class="{
              'flex-col gap-1': isNarrow,
              'border-t border-outline-gray-1': index && !isNarrow,
            }"
          >
            <!-- 180px, less its own padding and the 6px of margin around it:
                 the longest thing a gutter has to say — "Wednesday" beside
                 "30 Sep", some 140px — on one line, with a little room left
                 over. The weekday is spelled out and the month is not;
                 abbreviating the month is what keeps the pair short of the
                 column's edge on every day of the year. It was 224 for a
                 while, and the 80px of white between a date and its first
                 block was the widest empty thing on the card.

                 The margin is the inset the blocks beside it have from the
                 card's edge, so the gutter's hover fill stands off the day's
                 rules above and below by exactly what the first block stands
                 off them — at 4px, the blocks' own gap, it sat 2px proud of
                 the block beside it and the two tops did not line up. Flush,
                 it ran into the first block's tint and read as one wide block
                 with a hole in it. The fill takes the blocks' own corner for
                 the same reason: it is one more rounded thing in a row of
                 them.

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
              class="calendar-day-header flex shrink-0 cursor-pointer items-baseline gap-2 text-left"
              :class="{
                'px-3.5 py-1': isNarrow,
                'm-1.5 w-42 rounded-3 px-2 py-1.5 hover:bg-surface-gray-2':
                  !isNarrow,
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

                   leading-5 on both, and m-1.5 py-1.5 to the block's py-1.5
                   inside the column's py-1.5: 12px either way, so the day and the
                   first event beside it sit on one baseline, which is what
                   makes the gutter read as heading the rows rather than as a
                   column of its own — and what keeps a one-event day exactly
                   one block tall. The paddings move together or the gutter
                   pulls the day taller than what is on it.

                   The date truncates rather than wraps. A second line would put
                   the day back to 52px and the blank beside a lone event back
                   with it; a clipped word says the same thing the visible ones
                   do. -->
              <!-- The weekday a size up on the phone, level with the block
                   titles under it: at the desktop's 13px, beside 14px titles,
                   the day read as a caption on the blocks rather than the
                   heading over them. The date keeps the desktop's size, a step
                   under the name it follows. -->
              <span
                class="shrink-0 leading-5 text-ink-gray-8"
                :class="isNarrow ? 'text-base-medium' : 'text-sm-medium'"
              >
                {{ row.isToday ? 'Today' : weekday(row.date) }}
              </span>
              <span class="min-w-0 truncate text-sm leading-5 text-ink-gray-5">
                {{ dayLabel(row) }}
              </span>
            </button>

            <!-- The blocks, 4px apart. Wide, inset from the card's edge above,
                 below and on the right by the 6px a block's own padding is,
                 so the first block's text lands on the gutter's baseline and
                 the tint stops short of the card's border; the gutter's own
                 padding keeps them off the left. Narrow there is no card to
                 stand off. -->
            <div
              class="flex min-w-0 flex-1 flex-col gap-1"
              :class="{ 'py-1.5 pr-1.5': !isNarrow }"
            >
              <CalendarEventRow
                v-for="event in row.events"
                :key="String(event.id ?? event.name)"
                :event="event"
                :date="row.date"
                :narrow="isNarrow"
              >
                <template #event-description="slotProps">
                  <slot name="event-description" v-bind="slotProps" />
                </template>
                <template #event-suffix="slotProps">
                  <slot name="event-suffix" v-bind="slotProps" />
                </template>
                <template #event-participant="slotProps">
                  <slot name="event-participant" v-bind="slotProps" />
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
import { useElementSize } from '@vueuse/core'
import {
  agendaMonths,
  agendaRangeLabel,
  agendaWeeks,
  type AgendaRow,
  type AgendaWeek,
} from './agendaDays'
import { daysList, daysListFull, monthList, parseDate } from './calendarUtils'
import { shortMonth } from './monthStrip'
import { useNow } from './composables/useNow'
import CalendarEventRow from './CalendarEventRow.vue'
import { Spinner } from '#components/Spinner'
import { CALENDAR_ACTIONS_KEY, type CalendarEvent } from './types'

const props = defineProps<{
  events?: CalendarEvent[]
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

/**
 * How wide the list is drawn, and the point below which it stops spending
 * width on columns.
 *
 * Measured rather than asked of the viewport, as the week measures its
 * columns: the list is a box on a page, and a sidebar opening beside it takes
 * the same width off it that a smaller screen does. The scroller is what is
 * measured because it is the list's own width, scrollbar already taken off.
 *
 * 640px is where the wide layout stops paying for itself. The gutter is 180,
 * the time column 132, and a block's padding, bar and gaps another 40, which
 * is some 350px spent before a title has a letter; at 640 the title, its
 * description and the faces at the row's end share the 290 that is left, and
 * much below it a title with a location beside it is truncating. It is also
 * the viewport's `sm`, so a phone held upright is narrow and a tablet is not.
 */
const NARROW_LIST = 640

const { width: listWidth } = useElementSize(scroller)

const isNarrow = computed(
  () => !!listWidth.value && listWidth.value < NARROW_LIST,
)

// The clock, not `new Date()` in the computed: the list is scoped from today,
// so it has to re-scope itself when today changes rather than stranding a
// viewer on yesterday's range.
const now = useNow()

const weeks = computed(() =>
  agendaWeeks(props.events ?? [], props.anchor, now.value),
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

/**
 * What a position is good for: the span, and the layout the rows were measured
 * in. The narrow layout stacks the gutter over its rows and breaks each row
 * over two lines, so a scrollTop found against the wide layout points at some
 * other day once the list reflows — and it does reflow, after the fact, on
 * every mount: the width is measured, and a measurement arrives a frame after
 * the rows do. Keyed on both, a reflow is a move and the list is put back where
 * the span opens; keyed on the span alone it was left a screen short of today
 * on the phone whenever the events were already in hand at mount.
 */
const positionKey = computed(() => `${spanKey.value}|${isNarrow.value}`)

/** The layout `positionList` last acted on; '' until it has acted at all. */
let positionedFor = ''

/**
 * The air above the day the list opens on, where the list is narrow — a day's
 * gap, see below. None where it is wide: there a day is a row of its card
 * with a rule over it, and 16px of air above the rule was the bottom of the
 * day before, its last block cut through, which read as the list having
 * stopped short rather than opened on today. Flush, the rule is the top edge
 * and today is the first thing under it.
 */
const openMargin = computed(() => (isNarrow.value ? 16 : 0))

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
  // Nor a layout to aim in: until the width is measured the rows are drawn
  // wide whatever the box is, and a position found in that layout is thrown
  // away the moment the measurement lands. Waiting for it costs a frame once.
  if (!listWidth.value) return

  positionedFor = positionKey.value
  // Paged either way, the reader asked for those months as a whole, so the list
  // belongs at their first day; jumping to today would answer a question they
  // did not ask.
  if (!anchoredOnThisMonth.value) {
    box.scrollTop = 0
    return
  }

  const todayKey = parseDate(now.value)
  const target = Array.from(
    box.querySelectorAll<HTMLElement>('[data-strip-date]'),
  ).find((el) => (el.dataset.stripDate ?? '') >= todayKey)
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
  //
  // Narrow, short of the mark by a day's gap, on purpose: landed flush, the
  // day's label sat hard against the top of the box with the tab bar above
  // pressing on it, and the list read as cut off rather than opened. The same
  // 16px the days stand apart by, so today opens with the air it would have
  // under the day before it. Wide, on the mark — see `openMargin`.
  box.scrollTop +=
    top.getBoundingClientRect().top -
    box.getBoundingClientRect().top -
    openMargin.value
}

// On mount, and again when the reader is sent somewhere — paged either way, or
// told to go to a date — once more when the events for such a span finally
// arrive, and once more when the list learns how wide it is. nextTick so the
// rows exist, in the layout they will keep, before the list is put where it
// belongs.
//
// The guard is what keeps a redraw from being read as a move: the list is
// re-rendered by things that are none of its business — an event opening beside
// it, a refetch returning the same days, the clock ticking over — and every one
// of those used to scroll the reader back to today from wherever they had got
// to. A span is positioned once in a layout, and then left alone until it is a
// different span or a different layout.
onMounted(() => nextTick(positionList))
watch([positionKey, () => weeks.value.length, listWidth], () => {
  if (positionedFor === positionKey.value) return
  nextTick(positionList)
})

/** "4 September and 31 October" — the ends of the window, for the empty state. */
// The months, not the dates its ends land on — the same rule the header's title
// follows. The span is three whole months bar the days of the first already
// spent, so "7 September" names an implementation detail (today) rather than
// anything the reader chose; "September" is the span they actually asked for.
const spanLabel = computed(() => {
  const { start, end } = agendaMonths(props.anchor)
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
 * "7 Sep", after the weekday every day opens with — and on today, whose slot
 * the word "Today" takes, the weekday comes first: "Tue, 15 Sep", so no day
 * loses the word it is called by. Short, where every other day spells its
 * weekday out: on this line the weekday is not the thing looked up — "Today"
 * is — and spelled out it ran the gutter to its edge on a Wednesday. Only
 * today: a "Tomorrow" or "Yesterday"
 * is a word for a day the reader has to work out, where "Today" is the one
 * day they already know, and naming three days made three days read
 * differently from the rest of a list whose point is that every day reads
 * the same.
 *
 * The month is abbreviated, as it is in the week label above: the reader is
 * inside a span the header has already named, so "September" spelled out is the
 * longest word in the gutter saying the least. The weekday is not — it is the
 * thing the line is looked up by, and "Wed" is a lookup of its own.
 */
const dayLabel = (row: AgendaRow) => {
  const date = `${row.date.getDate()} ${shortMonth(row.date)}`
  return row.isToday ? `${daysList[row.date.getDay()]}, ${date}` : date
}

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
