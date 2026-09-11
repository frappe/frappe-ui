<template>
  <div class="flex min-h-0 flex-1 flex-col">
    <!-- Day List. Nothing marks a weekend: it was a wash down its cells, which
         is where the events are — an event's fill is a step of its colour barely
         above white, and on gray it had almost nothing left to be read by. Moved
         to the day's name it read as a day switched off rather than as a
         Saturday, and a grid whose columns are named does not have to say which
         two of them are the weekend twice. -->
    <div class="grid w-full grid-cols-7">
      <!-- A size down where the columns are: seven names across a phone is the
           widest thing in the grid, and the dates under them are 12px. -->
      <span
        v-for="day in daysList"
        class="inline-flex items-center justify-center text-ink-gray-6 h-8"
        :class="isNarrow ? 'text-sm' : 'text-base'"
      >
        {{ day }}
      </span>
    </div>

    <!--
      The strip. One row per week of the month, each at least as tall as its
      busiest day needs: a stay across several days is a bar in a lane at the
      top of the row, single-day events flow beneath it in their cells. Rows
      share whatever height is left over, and the strip scrolls once they
      outgrow it.
    -->
    <!-- Bordered, the box's corner goes with it — `overflow-y-auto` clips to the
         radius, so a rounded box with no border of its own cuts the ends off the
         rules its own rows draw. Unbordered it keeps the top one: that rule is
         what divides the weekday names from the first week under them, and
         without it the dates ran straight on from their own headings. -->
    <div
      ref="scroller"
      class="relative min-h-0 flex-1 overflow-y-auto border-outline-gray-1"
      :class="config.noBorder ? 'border-t-[0.5px]' : 'rounded-6 border-[0.5px]'"
    >
      <div class="flex min-h-full flex-col">
        <div
          v-for="row in laidOut"
          :key="row.key"
          class="relative grid flex-1 basis-0 grid-cols-7 border-b border-outline-gray-1 last:border-b-0"
          :data-strip-date="row.key"
          data-week-row
          @dragover.prevent
          @dragenter.prevent
          @drop="onDrop($event, row.week)"
        >
          <div
            v-for="(date, col) in row.week"
            :key="parseDate(date)"
            class="flex min-w-0 flex-col border-outline-gray-1"
            :class="col > 0 && 'border-l'"
            @click="calendarActions.handleCellClick($event, date)"
          >
            <!-- The today pill is a 25px box around the number, so it gets a
                 tighter inset that keeps its digits in the same column as the
                 bare numbers on the other days.

                 Centred where the cell is narrow, so a date sits under the
                 weekday letter that names its column; a seventh of a phone's
                 width has no margin to hang a number off. Wider, the number
                 keeps to the right, where a month grid has always put it. -->
            <div
              class="flex shrink-0 items-center text-xs"
              :class="[
                isToday(date) ? 'px-[3px]' : 'px-2',
                isNarrow ? 'justify-center' : 'justify-end',
              ]"
              :style="{ height: `${HEADER_HEIGHT}px` }"
            >
              <button
                class="cursor-pointer whitespace-nowrap"
                :class="[
                  isToday(date)
                    ? 'flex size-6 items-center justify-center rounded-full bg-surface-gray-10 text-ink-gray-2'
                    : 'text-ink-gray-8',
                ]"
                @click.stop="openDay(date)"
              >
                {{ dayLabel(date) }}
              </button>
            </div>

            <!-- Room for the lanes of bars laid over this column — the ones
                 the row is drawing, which in a full week is not all of them. -->
            <div
              v-if="row.cells[col]!.lanes"
              class="shrink-0"
              :style="{ height: `${row.cells[col]!.lanes * lanePitch}px` }"
            />

            <!-- One line a title, cut where the cell ends. A grid cell is a
                 seventh of the width and holds however many events the day has,
                 so a title on two lines spends another event's row to finish a
                 name the first line had mostly said — and at a phone's 50px it
                 came out as two lines of four letters and an ellipsis. The stack
                 is where a title has room to wrap, and that is where `wrap` is
                 still passed. -->
            <div
              v-if="row.cells[col]!.shown.length || row.cells[col]!.hidden"
              class="flex flex-col pb-1.5"
              :class="isNarrow ? 'gap-0.5' : 'gap-1'"
              :style="{ paddingInline: `${cellInset}px` }"
            >
              <CalendarMonthEvent
                v-for="event in row.cells[col]!.shown"
                :key="event.id"
                :event="event"
                :date="date"
                :dense="isNarrow"
                class="cursor-pointer"
                :class="draggingId === event.id && 'opacity-50'"
                :draggable="config.isEditMode"
                @dragstart="onDragStart($event, event, row.week)"
                @dragend="draggingId = null"
              >
                <template #event-popover-content="slotProps">
                  <slot name="event-popover-content" v-bind="slotProps" />
                </template>
              </CalendarMonthEvent>
              <!-- What the cell could not hold, and the way to it: the day view,
                   where the whole of it fits. The all-day rows' own button —
                   outlined where the events are filled, and dashed for the thing
                   standing in for what is not drawn.

                   The count alone, without the "more" those rows can afford: a
                   column this narrow truncated the word to an ellipsis, and "+5"
                   beside four events says what the sentence was going to.

                   Its height is a lane's, from the same value the bars and the
                   pills are drawn at, so the rows of a cell are one rhythm down
                   to the last of them. Centred, as the date above it is: a count
                   is not a name, so there is no first letter for the eye to line
                   up on. -->
              <Button
                v-if="row.cells[col]!.hidden"
                variant="outline"
                :label="`+${row.cells[col]!.hidden}`"
                class="w-full cursor-pointer border-dashed !justify-center !rounded-4 !text-xs !text-ink-gray-6"
                :style="{ height: `${laneHeight}px` }"
                @click.stop="openDay(date)"
              />
            </div>
          </div>

          <!-- The bars laid across the row, drawn by the cells' own component and
               at the cells' own density: a bar and a pill are the same event
               written two ways, and the two came out a size apart. -->
          <CalendarMonthEvent
            v-for="bar in row.shownBars"
            :key="bar.event.id"
            :event="bar.event"
            :date="row.week[bar.startCol]!"
            :bar="bar"
            :dense="isNarrow"
            class="absolute cursor-pointer"
            :class="draggingId === bar.event.id && 'opacity-50'"
            :style="barStyle(bar)"
            :draggable="config.isEditMode"
            @dragstart="onDragStart($event, bar.event, row.week)"
            @dragend="draggingId = null"
          >
            <template #event-popover-content="slotProps">
              <slot name="event-popover-content" v-bind="slotProps" />
            </template>
          </CalendarMonthEvent>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, onMounted, onUnmounted, ref } from 'vue'
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'
import { daysList, parseDate } from './calendarUtils'
import {
  LANE_HEIGHT,
  LANE_PITCH,
  COLUMN_INSET,
  COLUMN_RULE,
  barsInColumn,
  dayEvents,
  daysBetween,
  isSpan,
  layoutRow,
  shiftEventDays,
} from './eventSpan'
import { shortMonth, stripWeeks } from './monthStrip'
import { useNow } from './composables/useNow'
import { useStripScroll } from './composables/useStripScroll'
import CalendarMonthEvent from './CalendarMonthEvent.vue'
import { Button } from '#components/Button'
import {
  CALENDAR_ACTIONS_KEY,
  type CalendarConfig,
  type CalendarEvent,
  type CalendarRowBar,
} from './types'

const props = defineProps<{
  events: CalendarEvent[]
  currentMonth: number
  currentYear: number
  /** The day navigation last landed on; the strip scrolls to its row. */
  currentDate?: Date
  /** Set by Today and the month picker; scrolls there even if it is the same day. */
  jumpDate?: Date
  config: CalendarConfig
}>()

/**
 * The date-number strip at the top of every cell — a lane's height, like every
 * other row a cell stacks, so a date and the events under it keep one rhythm.
 * It also sets where the bars laid across the row begin.
 */
const HEADER_HEIGHT = 28

/**
 * Whether a cell is narrow enough to need the denser treatment: a phone's
 * seventh of the width, where a month is still a grid but a tight one.
 */
const isNarrow = useBreakpoints(breakpointsTailwind).smaller('sm')

/**
 * A bar's height, and the pitch of the lanes it is laid in.
 *
 * A bar and a single day's pill are the same thing said two ways, so they have
 * to be the same height: 20px is what a dense pill comes to — its 16px line and
 * 2px either side — where a bar kept the 30px the desktop lays its lanes at, two
 * rows of events at two heights in one cell.
 */
const DENSE_LANE_HEIGHT = 20

const laneHeight = computed(() =>
  isNarrow.value ? DENSE_LANE_HEIGHT : LANE_HEIGHT,
)
/**
 * The air between one row of a cell and the next, which the lanes carry as the
 * difference between their height and their pitch. Two pixels where a cell holds
 * three rows and a count; four where a cell has the room the desktop gives it.
 */
const DENSE_LANE_GAP = 2

/**
 * How far inside its cell an event is drawn, in pixels — the stacked pills and
 * the bars laid across the row alike, so the two read off one left edge.
 *
 * Four where the cell has the room the desktop gives it, and the 2px the grid's
 * other views inset by where it has not: a phone's cell is 50px wide, and 4
 * either side of a pill in it is a sixth of the column spent on air.
 */
const CELL_INSET = 4

const cellInset = computed(() =>
  isNarrow.value ? COLUMN_INSET : CELL_INSET,
)

const lanePitch = computed(
  () =>
    laneHeight.value +
    (isNarrow.value ? DENSE_LANE_GAP : LANE_PITCH - LANE_HEIGHT),
)

/**
 * The fewest rows a cell will draw, however little room it has. Below three,
 * a day with anything on it is mostly a count of what it is not showing.
 *
 * Rows, not events: the count is one of them, so a full cell at the floor shows
 * two events and says how many more. Three events and a count needs 130px a week
 * row — 780px of grid for six of them — which a phone does not have, and a month
 * that scrolls to be read is not a month at a glance.
 */
const MIN_CELL_ROWS = 3

/** The cell's own padding under its last row — `pb-1.5`. */
const CELL_PAD = 6

/**
 * A week row's height, measured rather than assumed.
 *
 * How much a cell holds is a question about the window, not a number to choose
 * in advance: a phone in portrait fits three events under the date, the same
 * phone turned over fits one, and a short desktop window is somewhere between.
 *
 * The strip over the number of weeks in it: a row's share, which is a row's
 * height, since `flex-1 basis-0` gives every week the same share whatever is in
 * it and nothing a cell draws now comes to more than that. (`flex-auto` gave
 * each row its content *plus* a share of what was left, so a busy week was
 * taller than a quiet one and this figure was neither.)
 *
 * The strip and not a row of it, though a row is what the question is about: a
 * row can be grown by its content and cannot then shrink back below it, so a
 * capacity read off one is a capacity reading its own last answer. The same
 * month in the same window came out with a different number of events shown on
 * a reload than on a switch from another view, having arrived at it from a
 * different height. The scroller has no such memory: it is as tall as the
 * window leaves it.
 */
const rowHeight = ref(0)

let stripObserver: ResizeObserver | null = null

onMounted(() => {
  if (typeof ResizeObserver === 'undefined' || !scroller.value) return
  stripObserver = new ResizeObserver(([entry]) => {
    rowHeight.value =
      (entry?.contentRect.height ?? 0) / Math.max(rows.value.length, 1)
  })
  stripObserver.observe(scroller.value)
})

onUnmounted(() => stripObserver?.disconnect())

/**
 * How many rows a cell can draw under its date — bars, events and the count
 * alike, since they are all a lane tall.
 *
 * Never fewer than `MIN_CELL_ROWS`, and otherwise whatever the window gives it.
 */
const cellCapacity = computed(() => {
  const room = rowHeight.value - HEADER_HEIGHT - CELL_PAD
  // n rows are n heights and the n-1 gaps between them, so the room is asked
  // about with one gap added back: dividing by the pitch alone charged a gap
  // under the last row, and a cell with exactly four rows' worth of space was
  // told it had three, leaving most of a row empty beneath them.
  const gap = lanePitch.value - laneHeight.value
  return Math.max(Math.floor((room + gap) / lanePitch.value), MIN_CELL_ROWS)
})

/**
 * What a cell shows, and how many it does not.
 *
 * The bars laid across the row count against the room: they are drawn over the
 * top of the cell, so a day under two of them holds two fewer of its own. And
 * the count itself takes a row, so a cell one event over its capacity hides two
 * — the last event, and the one whose place the count took. A bar the row is not
 * drawing is one of them too: it is over this day, and this day is not showing
 * it.
 */
const cellEvents = (row: StripRow, col: number, laneLimit: number) => {
  const days = row.days[col] ?? []
  const lanes = Math.min(row.lanes[col] ?? 0, laneLimit)
  if (!isNarrow.value) return { shown: days, hidden: 0, lanes }

  const hiddenBars = barsInColumn(row.bars, col).filter(
    (bar) => bar.lane >= laneLimit,
  ).length
  const room = Math.max(cellCapacity.value - lanes, 0)
  if (!hiddenBars && days.length <= room)
    return { shown: days, hidden: 0, lanes }

  const shown = Math.max(room - 1, 0)
  return {
    shown: days.slice(0, shown),
    hidden: days.length - shown + hiddenBars,
    lanes,
  }
}

/**
 * The rows, told how much of themselves to draw.
 *
 * A cell is a stack of rows — bars first, then the day's own events, then the
 * count — and the whole stack has to fit in `cellCapacity`, bars included. Left
 * out of the reckoning, they were what pushed a week past its share: the last
 * column stood under three lanes and still drew a count beneath them, so its
 * cell ran a row longer than the six beside it, the row stretched to hold it,
 * and those six — capped at a capacity measured before the stretch — left the
 * extra row empty.
 *
 * So a bar can be dropped, and the count is what says so. It goes from the row
 * rather than from a cell, since a bar is one thing drawn across several days
 * and cannot be shown in one of them and not the next. The row keeps as many
 * lanes as it can while every column still has somewhere to put its count:
 * a quiet week draws all its bars, a full one trades its last lane for the
 * seven counts that stand in for it.
 */
const laidOut = computed(() =>
  rows.value.map((row) => {
    const maxLanes = row.lanes.length ? Math.max(...row.lanes) : 0

    const fits = (limit: number) =>
      row.week.every((_, col) => {
        const lanes = Math.min(row.lanes[col] ?? 0, limit)
        const dropped = (row.lanes[col] ?? 0) > limit
        const needsRow = dropped || !!row.days[col]?.length
        return lanes + (needsRow ? 1 : 0) <= cellCapacity.value
      })

    let laneLimit = maxLanes
    if (isNarrow.value) while (laneLimit > 0 && !fits(laneLimit)) laneLimit--

    return {
      ...row,
      shownBars: row.bars.filter((bar) => bar.lane < laneLimit),
      cells: row.week.map((_, col) => cellEvents(row, col, laneLimit)),
    }
  }),
)

// Seven columns do not survive a phone's width; the days stack instead.

interface StripRow {
  key: string
  week: Date[]
  /** Multi-day events, packed into lanes across the row. */
  bars: CalendarRowBar[]
  /** Single-day events per column. */
  days: CalendarEvent[][]
  /** Lanes of bars each column has to leave room for. */
  lanes: number[]
}

const rows = computed<StripRow[]>(() => {
  const spans = props.events.filter(isSpan)
  return stripWeeks(props.currentMonth, props.currentYear).map((week) => {
    const { bars } = layoutRow(spans, week)
    return {
      key: parseDate(week[0]!),
      week,
      bars,
      days: week.map((date) => dayEvents(props.events, date)),
      lanes: week.map((_, col) => {
        const inColumn = barsInColumn(bars, col)
        return inColumn.length
          ? Math.max(...inColumn.map((bar) => bar.lane)) + 1
          : 0
      }),
    }
  })
})

function barStyle(bar: CalendarRowBar) {
  const span = bar.endCol - bar.startCol + 1
  return {
    // The rule's own pixel comes off the right as well: a bar is laid against
    // the boundary the cell's border sits on, where the stacked pills above it
    // are inside the content box and clear of it — see `COLUMN_RULE`.
    left: `calc(${(bar.startCol / 7) * 100}% + ${cellInset.value}px)`,
    width: `calc(${(span / 7) * 100}% - ${cellInset.value * 2 + COLUMN_RULE}px)`,
    top: `${HEADER_HEIGHT + bar.lane * lanePitch.value}px`,
    height: `${laneHeight.value}px`,
  }
}

const now = useNow()

function isToday(date: Date) {
  return parseDate(date) === parseDate(now.value)
}

/** The first of a month says which month, since the strip runs across them. */
function dayLabel(date: Date) {
  if (date.getDate() === 1 && !isToday(date)) {
    return `${shortMonth(date)} 1`
  }
  return date.getDate()
}

const calendarActions = inject(CALENDAR_ACTIONS_KEY)

if (!calendarActions) {
  throw new Error('CalendarMonthly must be rendered inside Calendar.')
}

function openDay(date: Date) {
  calendarActions!.setCalendarDate(date)
  calendarActions!.updateActiveView('Day', date)
}

const scroller = ref<HTMLElement | null>(null)

useStripScroll(scroller, {
  target: () => props.currentDate,
  jump: () => props.jumpDate,
})

/** The day under a pointer, from its position across a week row. */
function dateAtPointer(row: HTMLElement, clientX: number, week: Date[]) {
  const rect = row.getBoundingClientRect()
  const col = Math.floor(((clientX - rect.left) / rect.width) * 7)
  return parseDate(week[Math.max(0, Math.min(6, col))]!)
}

// A drag carries the event and the day it was picked up on, so that a drop
// moves the event by the distance dragged rather than snapping its start to
// wherever it landed — grabbing the third day of a stay and moving it one
// cell right should move the stay one day, not three.
/**
 * The event being dragged. A stay across several weeks is a bar per row, so
 * the fade is keyed on the event rather than on the piece that was grabbed.
 */
const draggingId = ref<CalendarEvent['id'] | null>(null)

const onDragStart = (
  event: DragEvent,
  calendarEvent: CalendarEvent,
  week: Date[],
) => {
  if (!calendarEvent.id) return
  draggingId.value = calendarEvent.id
  const target = event.target as HTMLElement | null
  if (target) target.style.cursor = 'move'
  if (!event.dataTransfer) return
  const row = target?.closest('[data-week-row]') as HTMLElement | null
  event.dataTransfer.dropEffect = 'move'
  event.dataTransfer.effectAllowed = 'move'
  event.dataTransfer.setData('calendarEventID', String(calendarEvent.id))
  event.dataTransfer.setData(
    'calendarGrabDate',
    row ? dateAtPointer(row, event.clientX, week) : parseDate(week[0]!),
  )
}

const onDrop = (event: DragEvent, week: Date[]) => {
  const calendarEventID = event.dataTransfer?.getData('calendarEventID')
  const grabDate = event.dataTransfer?.getData('calendarGrabDate')
  if (!calendarEventID || !grabDate) return
  const target = event.target as HTMLElement | null
  if (target) target.style.cursor = 'default'
  const calendarEvent = props.events.find(
    (e) => String(e.id) === calendarEventID,
  )
  if (!calendarEvent) return
  const dropDate = dateAtPointer(
    event.currentTarget as HTMLElement,
    event.clientX,
    week,
  )
  const shift = daysBetween(grabDate, dropDate)
  if (!shift) return
  shiftEventDays(calendarEvent, shift)
  calendarActions!.updateEventState(calendarEvent)
}
</script>
