<template>
  <!-- The box's own edge is drawn here, on the element that carries the corner;
       the sections inside keep their separators only.

       The corner goes with the border. `overflow-y-auto` clips to the radius, so
       a rounded box with no border of its own still cut 12px off either end of
       the rule the all-day row draws along its top — a top border with a gap at
       each end, against nothing that explained the gap. Bordered, the radius has
       an edge to round and the clip lands on it. -->
  <div
    class="flex flex-col flex-1 overflow-y-auto border-outline-gray-1"
    :class="config.noBorder ? '' : 'rounded-6 border-[1px]'"
  >
    <!-- Full day events -->
    <div
      class="flex shrink-0 h-fit"
      :class="[config.noBorder ? 'border-t-[1px]' : 'border-b-[1px]']"
    >
      <!-- The same rule the hour gutter draws below, carried up through the
           all-day row so the day's left edge is one line. Same width as that
           gutter, at either size, or the two rules are two lines. -->
      <div
        class="flex w-14 shrink-0 justify-center border-r-[1px] border-outline-gray-1 pl-px pt-1"
      >
        <!-- A label, and only that. The chevron that used to sit beside it
             toggled a row it was not in, from a column whose job is to say what
             the row is — and on a narrow gutter the two together had no room to
             be either. What is hidden says so itself, at the end of the row,
             where the hidden things are. -->
        <!-- Centred across the gutter, with even air either side — `pl-px`
             against the rule on the right, which is inside the box and so is
             not part of what centring divides. Without it the label sat a pixel
             nearer the edge the eye has something to measure against. The hours
             under it are hung from the day column instead, so their left edge
             lands a pixel or so off this one — near enough that the column
             still reads as a column, and even air is what the eye checks on a
             word standing alone in a box. It takes the hours' type from
             `.calendar-all-day-label`, so the two cannot drift apart.

             Down 4px and a pill tall, which is the lane beside it: its padding
             and its first pill, so the label's middle is that pill's middle.
             It stays at the top when the lane grows — a label for a row of
             things belongs beside the first of them, not halfway down the
             pile. -->
        <div
          class="calendar-all-day-label inline-flex h-7 items-center text-ink-gray-8"
        >
          All day
        </div>
      </div>
      <!-- The week's all-day row, to the pixel: a bar there sits on the day's
           own inset and so twice that from the bar in the next day, and this
           lane is that row with one day in it. The pills carry a further 1px
           either side of their own, so the lane's padding is the inset less
           that pixel — 2px on a phone, where the whole grid insets by 2, and 3
           where a column has the room for it. It was 6px round and 6px between
           — a day whose all-day pills started further in than the week's did,
           on the same rule, in the same box.

           While it is being measured it keeps wrapping and is clipped to one row
           instead — 40px, a pill's 24px minimum and the lane's own padding. A
           lane told not to wrap is a lane whose content decides its width, and
           the width was the thing being asked; clipped, it is asked at the width
           it will actually be read at, and the reader sees no second row appear
           and vanish. -->
      <div
        ref="allDayLane"
        data-all-day-lane
        class="flex w-full flex-wrap gap-x-1 gap-y-1 overflow-hidden py-1"
        :class="measuring && 'max-h-10'"
        :style="{ paddingInline: `${pillInset - PILL_MARGIN}px` }"
        :data-date-attr="currentDate"
        @click.prevent="
          calendarActions.handleCellClick($event, currentDate, '', true)
        "
      >
        <CalendarWeekDayEvent
          v-for="(calendarEvent, idx) in shownFullDayEvents"
          :event="{ ...calendarEvent, idx }"
          :key="calendarEvent.id"
          :date="currentDate"
          @click.stop
        >
          <template #event-popover-content="slotProps">
            <slot name="event-popover-content" v-bind="slotProps" />
          </template>
        </CalendarWeekDayEvent>
        <!-- The rest of the day, as one more thing in the row: an outline
             button, dashed where the events are filled, so it reads as a control
             among them rather than as one more of them — and as a thing standing
             for what is not drawn, which is what a broken line says. Its corners
             are the events' own 8px — a fully round pill beside them read as a
             different kind of thing again.

             It says how many are hidden and then it is gone: the row it opened
             is the answer, and a button offering to close it again is a second
             thing to read on a row whose whole business is the first.

             What it hides is what would not fit on the line, measured, rather
             than everything past a fixed fourth: four pills is a full line of
             long names and half a line of short ones, and the lane wrapped or
             sat half empty depending on what the day was called.

             Its height is the line's, not a number of its own: a pill is 24px of
             minimum plus whatever its own padding and text come to, so a button
             fixed at 24 sat a few pixels short of everything beside it. And
             `mx-px` is the pills' own margin, so it sits the same distance from
             the pill before it as the pills do from each other, and from the
             lane's edge when it is the only thing in it. -->
        <Button
          v-if="hiddenFullDayEvents || measuring"
          variant="outline"
          data-all-day-more
          class="!h-auto !min-h-7 mx-px w-fit shrink-0 cursor-pointer self-stretch border-dashed !rounded-4 !text-xs !text-ink-gray-6"
          :label="`+${hiddenFullDayEvents || dayFullDayEvents.length} more`"
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
        <!-- 56px, at every size: the hours are the same "10 am" on a phone as
             on a desktop, so the column is sized to the label rather than to
             the screen. The labels hang 45px left of the day column (see
             style.css), which puts them 11px inside a 56px gutter against the
             9px "12 pm" leaves on the other side — a column with an even inset
             either way. At the 80px this was on a desktop the same label sat
             35px in, stranded in a margin a third as wide again as the word it
             was holding. -->
        <div
          class="grid w-14 shrink-0 self-start grid-cols-1 border-r-[1px] border-outline-gray-1"
        >
          <span
            v-for="time in 24"
            class="flex h-[72px] items-end justify-center text-center text-sm text-ink-gray-5"
            :style="{ height: `${hourHeight}px` }"
          />
        </div>

        <!-- Calendar Grid / Right Column -->
        <div class="grid h-full w-full grid-cols-1 pb-2">
          <div class="calendar-column relative" data-time-grid>
            <!-- Day Grid -->
            <div
              class="relative flex text-ink-gray-8"
              v-for="(time, i) in timeArray"
              :key="time"
              :data-time-attr="i == 0 ? '' : time"
              @click="
                calendarActions.handleCellClick(
                  $event,
                  currentDate,
                  slotTime($event, i),
                )
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
              :inset="pillInset"
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
import {
  computed,
  inject,
  nextTick,
  onMounted,
  onUnmounted,
  ref,
  watch,
} from 'vue'
import CalendarTimeMarker from './CalendarTimeMarker.vue'
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'
import { Button } from '#components/Button'
import {
  parseDate,
  twelveHoursFormat,
  twentyFourHoursFormat,
} from './calendarUtils'
import useCalendarData from './composables/useCalendarData'
import { COLUMN_INSET, PILL_MARGIN, eventDays } from './eventSpan'
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

/**
 * How far inside the day its pills are drawn.
 *
 * 4px on a phone — the inset a month cell keeps where it has room, which is
 * what the day has at every size: its column is the whole page, so where the
 * week's narrow columns come down to 2 to buy a character of title, the day
 * spends the same 4 the desktop's month does and reads as the roomiest of the
 * three. 3px otherwise, which is the inset the grid lays out on plus the margin
 * a pill carries.
 *
 * By the screen and not by the column: the day's column is the width of the
 * page at every size, so there is nothing in it to measure. The Month grid
 * chooses its dense rows the same way, at the same breakpoint.
 */
const PHONE_INSET = 4

const isNarrow = useBreakpoints(breakpointsTailwind).smaller('sm')
const pillInset = computed(() =>
  isNarrow.value ? PHONE_INSET : COLUMN_INSET + PILL_MARGIN,
)

const hourHeight = props.config.hourHeight
const minuteHeight = hourHeight / 60

const isCollapsed = ref(true)
// Every all-day-row event covering this day, a multi-day one included.
const dayFullDayEvents = computed(() => {
  const day = parseDate(props.currentDate)
  return allDayEvents.value.filter((event) => {
    const { start, end } = eventDays(event)
    return start <= day && day <= end
  })
})

/**
 * How many all-day pills fit on one line, and so how many the lane shows while
 * it is collapsed. -1 until it has been measured, and again whenever they all
 * fit: there is nothing to hide then, and no button to make room for.
 *
 * Measured rather than counted. A fixed fourth is a full line of "Frappe Suite
 * Standup"s and half a line of "Holiday"s, so the lane wrapped or sat half empty
 * depending on what the day happened to be called. What the reader is promised
 * is one line; what fits on one line is a question only the line can answer.
 */
const laneFits = ref(-1)

/** True for the tick the lane spends with everything in it, being measured. */
const measuring = ref(true)

const allDayLane = ref<HTMLElement | null>(null)

/** The lane's own `gap-2`, in pixels — the space between two pills. */
const LANE_GAP = 8

const shownFullDayEvents = computed(() =>
  measuring.value || !isCollapsed.value || laneFits.value < 0
    ? dayFullDayEvents.value
    : dayFullDayEvents.value.slice(0, laneFits.value),
)

const hiddenFullDayEvents = computed(
  () => dayFullDayEvents.value.length - shownFullDayEvents.value.length,
)

/**
 * Fit as many pills as the line holds, leaving room for the button that says how
 * many did not.
 *
 * One pass: with everything rendered, each pill's own width is what it wants,
 * whatever line it would land on, and the button is measured at its widest — its
 * label counts every event on the day, and every number it can end up showing is
 * shorter than that one.
 */
const measureLane = () => {
  const lane = allDayLane.value
  if (!lane) return

  // The lane's own children, not a marked class of them: a pill is rendered by
  // CalendarWeekDayEvent, whose root is a Popover, and an attribute put on that
  // never reaches an element to be found by. What the lane holds is the pills
  // and, at the end, the button — which is a Button, single-rooted, and does
  // carry its mark.
  const nodes = [...lane.children].filter(
    (node): node is HTMLElement => node instanceof HTMLElement,
  )
  const more = nodes.find((node) => node.matches('[data-all-day-more]')) ?? null
  const pills = nodes
    .filter((node) => node !== more)
    .map((pill) => pill.offsetWidth)
  const style = getComputedStyle(lane)
  const width =
    lane.clientWidth -
    parseFloat(style.paddingLeft) -
    parseFloat(style.paddingRight)

  // Nothing to measure against yet — the lane is laid out but has no width, or
  // has no pills in it. A width of nothing is not an answer, so it is asked
  // again on the next frame rather than answered with "everything fits".
  if (width <= 0) {
    requestAnimationFrame(measureLane)
    return
  }

  measuring.value = false
  laneWidth = width
  if (!pills.length) return

  const whole = pills.reduce(
    (sum, pill, i) => sum + pill + (i ? LANE_GAP : 0),
    0,
  )
  if (whole <= width) {
    laneFits.value = -1
    return
  }

  const room = width - ((more?.offsetWidth ?? 0) + LANE_GAP)
  let used = 0
  let fits = 0
  for (const pill of pills) {
    const next = used + pill + (fits ? LANE_GAP : 0)
    if (next > room) break
    used = next
    fits++
  }
  // One pill at the least: a lane too narrow for even that says "+n more" beside
  // something rather than beside nothing.
  laneFits.value = Math.max(fits, 1)
}

/** Render everything again, then measure it. */
const remeasureLane = () => {
  measuring.value = true
  nextTick(measureLane)
}

// The events change, the day changes, or the lane does: each is a different set
// of widths in a different space, and none of them can be answered from the last
// measurement.
watch(dayFullDayEvents, () => {
  isCollapsed.value = true
  remeasureLane()
})

let laneObserver: ResizeObserver | null = null

/**
 * The width the lane was last measured at.
 *
 * Only a change of width is worth a new measurement, and only a width is safe to
 * act on: measuring renders every pill, which changes the lane's *height*, which
 * the observer reports, which would measure again. The height is this code's own
 * echo; the width is the news.
 */
let laneWidth = 0

onMounted(() => {
  remeasureLane()
  if (typeof ResizeObserver === 'undefined' || !allDayLane.value) return
  laneObserver = new ResizeObserver(([entry]) => {
    const width = entry?.contentRect.width ?? 0
    if (Math.abs(width - laneWidth) < 1) return
    laneWidth = width
    remeasureLane()
  })
  laneObserver.observe(allDayLane.value)
})

onUnmounted(() => laneObserver?.disconnect())

const timeArray =
  props.config.timeFormat == '24h' ? twentyFourHoursFormat : twelveHoursFormat

/**
 * The time a click asks for: the mark it landed nearest, less the half hour that
 * puts that mark in the middle of the event rather than at its start.
 *
 * The row it was in is an hour tall and carries three marks — its own line, the
 * half hour, and the line below it — so where in the row the click fell is the
 * finer thing it already knows and the row label alone throws away. The top and
 * bottom quarters go to the lines that bound the row and the middle half to the
 * half hour, which is the widest target of the three because it is the one with
 * no line to aim at.
 *
 * Centred, not started, because a click is a point and an event is an hour: the
 * point is where the reader is looking, and an hour hung below it puts the thing
 * they were pointing at at its very top edge. So a click on the 7 line asks for
 * 6:30, which draws an event through the 7 it was aimed at; the middle of the
 * row asks for 7, which is the row itself; and the 8 line asks for 7:30.
 *
 * Half hours, not quarters: a quarter of a 72px row is an 18px target, under
 * what a thumb can be asked to hit.
 *
 * A whole hour hands back the row's own label, unchanged, so what a consumer
 * parses is what it always parsed. A half hour is spelled out in the format the
 * grid is read in: "7:30 am" beside "7 am", "07:30" beside "07:00".
 */
const LAST_START = 23 * 60 + 30

function slotTime(e: MouseEvent, hour: number): string {
  const row = e.currentTarget as HTMLElement | null
  const fraction = row
    ? (e.clientY - row.getBoundingClientRect().top) / hourHeight
    : 0
  const minutes = fraction < 0.25 ? 0 : fraction < 0.75 ? 30 : 60

  // Both ends are the day's own: midnight has nothing above it to centre on,
  // and the last row's line below it belongs to the day after — the date came
  // with the cell, so neither can be reached from here.
  const start = Math.min(Math.max(hour * 60 + minutes - 30, 0), LAST_START)
  const startHour = Math.floor(start / 60)
  if (start % 60 === 0) return timeArray[startHour]!

  if (props.config.timeFormat === '24h')
    return `${String(startHour).padStart(2, '0')}:30`
  return `${((startHour + 11) % 12) + 1}:30 ${startHour < 12 ? 'am' : 'pm'}`
}

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
