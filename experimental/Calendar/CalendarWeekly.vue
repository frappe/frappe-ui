<template>
  <div class="flex flex-1 flex-col overflow-y-auto isolate">
    <!-- Day List. Outside the box: the dates head the week rather than sitting
         inside it, so the box starts at the all-day line. -->
    <div class="flex pb-1">
      <div class="w-14"></div>
      <div ref="headRef" class="grid w-full grid-cols-7">
        <!-- Nothing marks a weekend. It was a wash down the column, which is a
             ground, and every part of a column has something drawn on it — an
             event's fill is a step of its colour barely above white, and on gray
             it had almost nothing left to be read by. Moved to the day's name it
             read as a day switched off rather than as a Saturday, and a week
             whose columns are named and dated does not have to say which two of
             them are the weekend twice. -->
        <!-- A day is its name and its date on one line where the column has
             the width, and the date under the name where it does not. On one
             line a narrow column had to give up the name — "W 9" — and set the
             rest at a size that fought the numerals under it; stacked, the
             name is spelled and the date is read at a glance, which is what
             the row is for, and the row it costs is a row a phone has.

             48px tall when stacked, and padded rather than centred: the
             name's line is set to 16 and the disc is 20, 2px apart, and the
             rest is 6 above and 4 below. Not the same above and below, on
             purpose: the two lines of text are what should stand evenly off
             the rules, and the disc is not text. It is a 20px box around a
             numeral on a 16px line, so it reaches 2px past where the line
             box would end — the bottom pays 2px less so the numeral, not the
             disc, is what sits as far off the rule below as the name sits
             off the bar above. Centred, the disc's edge was what got the
             even air, and the numerals inside it read as sitting high.
             Wide, one line in 32 stays centred: with nothing under the name
             there is nothing for it to sit off. -->
        <span
          v-for="date in weeklyDates"
          :key="parseDate(date)"
          class="group relative flex cursor-pointer items-center text-center text-ink-gray-7"
          :class="
            isNarrow
              ? 'h-12 flex-col gap-0.5 pb-1 pt-1.5 text-xs'
              : 'h-8 justify-center gap-1.5 text-base'
          "
          @click="calendarActions.updateActiveView('Day', date)"
        >
          <span :class="isNarrow && 'leading-4'">{{ dayName(date) }}</span>
          <!-- A circle, and the numeral's own line across: the same mark today
               wears in the Month grid and in a month card, so a reader who has
               learnt it in one view has learnt it in all of them. It was a
               rounded square of 25px — a shape of its own, at a size off the
               scale. A size down in a narrow column, where a 24px disc beside
               the name is most of the day's width. Every date takes the
               disc's box, filled on today alone, so the numerals of the week
               sit on one line whether or not one of them is today.

               Under the pointer the disc fills gray, as a number in the Month
               grid does: the whole header is the way into its day, and the
               bubble on the number is what says so before the click — the
               same disc today wears, so a hovered day reads as "this could be
               the marked one". Today's darkens a step instead. `group` on the
               header rather than hover on the disc, so pointing anywhere at
               the day lights its number. -->
          <span
            class="inline-flex items-center justify-center rounded-full"
            :class="[
              isNarrow ? 'size-5' : 'size-6',
              isToday(date)
                ? 'bg-surface-gray-10 text-ink-gray-1 group-hover:bg-surface-gray-9'
                : 'group-hover:bg-surface-gray-2',
            ]"
          >
            {{ date.getDate() }}
          </span>
        </span>
      </div>
    </div>

    <!-- The corner goes with the border: `overflow-hidden` clips to the radius,
         so a rounded box with no border of its own cuts the ends off the rules
         its own rows draw. Unbordered it keeps the top one, as the Month grid
         and the day do: that rule is what divides the dates heading the week
         from the all-day row under them, and without it the bars ran straight on
         from the numerals. -->
    <div
      class="flex min-h-0 flex-1 flex-col overflow-hidden border-outline-gray-1"
      :class="config.noBorder ? 'border-t-[1px]' : 'rounded-6 border-[1px]'"
    >
      <!--
        All-day row. Full-day events and timed ones of a day or more are packed
        into lanes across the week, each a bar over the days it covers; the
        seven cells beneath take clicks.
      -->
      <div class="flex shrink-0 h-fit border-b-[1px]">
        <!-- The same rule the hour gutter draws below, carried up through the
           all-day row so the week's left edge is one line. -->
        <div
          class="flex w-14 shrink-0 justify-center border-r-[1px] border-outline-gray-1 pl-px pt-1"
        >
          <!-- A label, and only that. The chevron that used to sit beside it
               toggled a row it was not in, from a column whose job is to say
               what the row is. What is hidden says so itself, in the day it is
               hidden on.

               The day view's label, to the letter: centred across the gutter
               with `pl-px` against the rule on the right, which is inside the
               box and so is not part of what centring divides, and the hours'
               own type from `.calendar-all-day-label`, so the label and the
               column it heads cannot drift apart.

               Down 4px and a lane tall — this row's own padding and its first
               bar, so the label's middle is that bar's middle. The day view's
               label is the same 4 and 28 beside the same lane. -->
          <div
            class="calendar-all-day-label inline-flex items-center text-ink-gray-8"
            :style="{ height: `${laneHeight}px` }"
          >
            All day
          </div>
        </div>
        <div
          class="relative grid w-full grid-cols-7 overflow-hidden py-2"
          :style="{ minHeight: `${allDayHeight}px` }"
          data-day-columns="7"
        >
          <!-- `-my-2` cancels the row's own padding for the cells alone, so their
             rules run the full height and meet the grid's below. The bars are
             positioned against that padding and keep it. -->
          <div
            v-for="(date, col) in weeklyDates"
            :key="parseDate(date)"
            class="cell -my-2 flex w-full cursor-pointer flex-col border-outline-gray-1"
            :class="col === weeklyDates.length - 1 ? '' : 'border-r-[1px]'"
            :data-date-attr="date"
            @click.prevent="
              (e) => {
                if (hiddenCount(col)) isCollapsed = false
                calendarActions.handleCellClick(e, date, '', true)
              }
            "
          >
            <!-- What this day has past the lanes on show: an outline button,
                 dashed where the bars are filled, so it reads as a control among
                 them rather than as one more of them — and as a thing standing
                 for what is not drawn, which is what a broken line says. Its corners are the
                 bars' own 8px, and so is its height — a lane, taken from the
                 constant the bars themselves are laid out by, so the two cannot
                 end up a few pixels apart. Its left edge is theirs too, margin
                 and all — `barInset` is where a bar's own edge lands, which is
                 not the same in a narrow column as in a wide one, and a button
                 that read the inset alone started a pixel to their left. It says
                 how many are hidden and then it is gone — the lanes it opened
                 are the answer.

                 As wide as the day in a narrow column, where the bars above it
                 are: "+3" is 30-odd pixels of a 40px lane, so a button sized to
                 its own label left a sliver of column beside it that read as a
                 bar cut short rather than as air. Its label sits in the middle
                 there rather than at the left edge the bars' titles start on: a
                 count is not a title, and two characters held against one end of
                 a box that wide read as text that had been pushed. -->
            <Button
              v-if="hiddenCount(col)"
              :label="
                isNarrow ? `+${hiddenCount(col)}` : `+${hiddenCount(col)} more`
              "
              variant="outline"
              class="cursor-pointer border-dashed !rounded-4 !text-xs !text-ink-gray-6"
              :class="isNarrow ? 'self-stretch !px-1' : 'w-fit !justify-start'"
              :style="{
                marginTop: `${visibleLanes * lanePitch + laneGap}px`,
                marginLeft: `${barInset}px`,
                marginRight: isNarrow ? `${barInset}px` : undefined,
                height: `${laneHeight}px`,
              }"
              @click.stop="isCollapsed = false"
            />
          </div>
          <CalendarWeekDayEvent
            v-for="bar in visibleBars"
            :key="bar.event.id"
            :event="bar.event"
            :date="weeklyDates[bar.startCol]"
            :bar="bar"
            :narrow="isNarrow"
            :inset="barInset"
            @click.stop
          >
            <template #event-popover-content="slotProps">
              <slot name="event-popover-content" v-bind="slotProps" />
            </template>
          </CalendarWeekDayEvent>
        </div>
      </div>

      <div
        class="relative flex h-full flex-col overflow-auto border-outline-gray-1"
        ref="gridRef"
      >
        <div class="flex">
          <!-- The hour gutter, a spacer as tall as the 24 hours beside it: the
             labels hang off the first day column's rows (see `.calendar-column`
             in style.css). `shrink-0`, or the flex row squeezes it out of line
             with the all-day label above; and the rule is this column's right
             edge, not the first day's left, so the two land on the same pixel. -->
          <div
            class="w-14 shrink-0 border-r-[1px] border-outline-gray-1"
            :style="{ height: `${24 * hourHeight}px` }"
          />

          <!-- Grid -->
          <div class="relative z-0 flex w-full flex-col">
            <!-- time events => not full day events => overflow-scroll here -->
            <div class="grid w-full grid-cols-7" data-day-columns="7">
              <!-- 7 Columns.

                   No weekend wash. -->
              <div
                v-for="(date, idx) in weeklyDates"
                class="relative w-full border-outline-gray-1"
                :class="[
                  idx === 0 && 'calendar-column',
                  // The last column's right edge is the box's own, and the box
                  // draws that itself.
                  idx === weeklyDates.length - 1 ? '' : 'border-r-[1px]',
                ]"
                :data-date-attr="date"
                data-time-grid
              >
                <!-- Time Grid -->
                <div
                  class="cell relative flex cursor-pointer text-ink-gray-8"
                  v-for="(time, i) in timeArray"
                  :key="time"
                  :data-time-attr="i == 0 ? '' : time"
                  @click.prevent="
                    calendarActions.handleCellClick(
                      $event,
                      date,
                      slotTime($event, i),
                    )
                  "
                >
                  <div
                    class="border-outline-gray-1 w-full"
                    :class="i !== timeArray.length - 1 && 'border-b-[1px]'"
                    :style="{ height: `${hourHeight}px` }"
                  />
                </div>

                <!-- Calendar Events populations  -->
                <CalendarWeekDayEvent
                  v-for="calendarEvent in timedEvents[parseDate(date)]"
                  :event="calendarEvent"
                  :key="`${calendarEvent.id}-${calendarEvent.date}`"
                  :date="date"
                  :narrow="isNarrow"
                  :inset="barInset"
                >
                  <template #event-popover-content="slotProps">
                    <slot name="event-popover-content" v-bind="slotProps" />
                  </template>
                </CalendarWeekDayEvent>

                <!-- Current time Marker  -->
                <CalendarTimeMarker :date="date" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, inject } from 'vue'
import { useElementSize } from '@vueuse/core'
import CalendarTimeMarker from './CalendarTimeMarker.vue'
import { parseDate, daysList } from './calendarUtils'
import {
  COLUMN_INSET,
  PILL_INSET,
  barsInColumn,
  layoutRow,
  weekLaneGap,
  weekLaneHeight,
  weekLanePitch,
} from './eventSpan'

import { Button } from '#components/Button'
import useCalendarData from './composables/useCalendarData'
import { useHourGrid } from './composables/useHourGrid'
import { useNow } from './composables/useNow'
import CalendarWeekDayEvent from './CalendarWeekDayEvent.vue'
import {
  CALENDAR_ACTIONS_KEY,
  type CalendarConfig,
  type CalendarEvent,
} from './types'

const props = withDefaults(
  defineProps<{
    events: CalendarEvent[]
    config: CalendarConfig
    weeklyDates?: Date[]
  }>(),
  {
    weeklyDates: () => [],
  },
)

const gridRef = ref<HTMLElement | null>(null)
const headRef = ref<HTMLElement | null>(null)
const isCollapsed = ref(true)

/**
 * How wide a day is drawn, and the two points at which the week's furniture
 * steps down to fit it — the phone, where the seven days share what is left of
 * the screen once the hour gutter has had its 56px, and any tablet held the
 * short way.
 *
 * Measured rather than asked of the viewport: the week is a box on a page, and
 * how wide it is drawn is the page's business — a sidebar opening takes the
 * same 200px off the columns that a smaller screen does. The head row is what
 * is measured because it is the day columns' own width, gutter already taken
 * off, and it is laid out before the grid under it has anything in it.
 *
 * 64px is where "Wed 30" stops fitting on one line at `text-base`: the name and
 * the date come to some 50px, and on today, whose date is a 24px circle beside
 * the name, to some 60. Below it the date goes under the name, set at
 * `text-xs` with a 20px circle, which asks 26 of any column — a width every
 * column the grid can draw has.
 */
const NARROW_COLUMN = 64

const { width: headWidth } = useElementSize(headRef)

const isNarrow = computed(
  () =>
    !!headWidth.value &&
    headWidth.value / (props.weeklyDates.length || 7) < NARROW_COLUMN,
)

/**
 * The lane the bars are drawn in, which a narrow week draws shorter: the title
 * is set a size down there, and a row of three lanes is that much of the phone's
 * screen not spent on the hours below it.
 */
const laneHeight = computed(() => weekLaneHeight(isNarrow.value))
const laneGap = computed(() => weekLaneGap(isNarrow.value))
const lanePitch = computed(() => weekLanePitch(isNarrow.value))

/**
 * Where a bar's own left edge lands, inside its day: the column's inset, and the
 * the standard gap, or the 2px a narrow week comes down to. Anything laid out
 * beside the bars rather than being one reads it, or it starts on a different
 * line to them.
 *
 * The same measure that tells a pill it is tight, so the two are answering the
 * same question.
 */
const barInset = computed(() => (isNarrow.value ? COLUMN_INSET : PILL_INSET))

const dayName = (date: Date) => daysList[date.getDay()]

const { hourHeight, minuteHeight, timeArray, slotTime } = useHourGrid(
  props.config,
  gridRef,
)
const { timedEvents, allDayEvents } = useCalendarData(
  () => props.events,
  minuteHeight,
)

const allDayRow = computed(() =>
  layoutRow(allDayEvents.value, props.weeklyDates),
)

/** Past three lanes the row folds to two, with a count of what is hidden. */
const COLLAPSE_ABOVE = 3
const COLLAPSED_LANES = 2

const showCollapsable = computed(
  () => allDayRow.value.laneCount > COLLAPSE_ABOVE,
)
const visibleLanes = computed(() =>
  showCollapsable.value && isCollapsed.value
    ? COLLAPSED_LANES
    : allDayRow.value.laneCount,
)
const visibleBars = computed(() =>
  allDayRow.value.bars.filter((bar) => bar.lane < visibleLanes.value),
)
const hiddenCount = (col: number) =>
  barsInColumn(allDayRow.value.bars, col).filter(
    (bar) => bar.lane >= visibleLanes.value,
  ).length
/**
 * The row's height: its lanes at their pitch, the lane a "+n more" button
 * stands in where the row is folded, and the air below the last of them — the
 * lanes' own gap, so the row is padded by the same measure that separates what
 * is in it, and the same on both edges. A lane's pitch carries its gap below
 * it; the row once added more, and the band sat tight at the top and loose at
 * the bottom.
 */
const allDayHeight = computed(
  () =>
    visibleLanes.value * lanePitch.value +
    (visibleLanes.value < allDayRow.value.laneCount
      ? laneGap.value + laneHeight.value
      : 0) +
    laneGap.value,
)

const now = useNow()

const isToday = (date: Date) => parseDate(date) === parseDate(now.value)

const calendarActions = inject(CALENDAR_ACTIONS_KEY)

if (!calendarActions) {
  throw new Error('CalendarWeekly must be rendered inside Calendar.')
}
</script>
