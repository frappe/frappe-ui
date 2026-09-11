<template>
  <!--
    Controlled rather than trigger-driven: a single click opens the popover only
    after a 200ms wait, so a double click can edit the event instead, and a
    mousedown can start a reposition drag. Reka's trigger toggles on click with
    no such delay, so `update:open` is honoured only on the way down — Escape
    and outside-click still close it.
  -->
  <Popover
    :open="isPopoverOpen"
    :side="popoverSide"
    align="center"
    @update:open="(value) => !value && (isPopoverOpen = false)"
    @open="registerDeleteShortcut"
    @close="unregisterDeleteShortcut"
  >
    <!--
      The positioning wrapper is explicit now. It used to arrive as an attr on
      <Popover>, which the legacy anchor put on a wrapper it rendered itself;
      #trigger is as-child and renders no wrapper of its own.
    -->
    <template #trigger>
      <div class="flex" :style="containerStyle">
        <!-- Flat: the tint is the event and the bar is its calendar, and a drop
             shadow under each one made a grid of hours look like a pile of
             cards. What the shadow was really doing — telling two overlapping
             events of one calendar apart — an event laid over another does,
             by carrying a ring of the page's own colour, so the edge it lands
             on is a cut rather than a join.

             .stop as well as .prevent on the click below: the grid cell under
             this pill reads a click as "make an event here", and a click on an
             event is not that. It was covered up rather than handled — a pill
             that opens a popover sets isAnyPopoverOpen, which the cell then
             declines on — so it surfaced only where the popover never opens,
             which is a phone: every tap on an event opened a new-event form
             behind the sheet it had just asked for. -->
        <div
          ref="eventRef"
          class="event mx-px rounded-4 transition-all duration-75 shrink-0"
          :class="{
            // An all-day pill is read as a row of the day's own list, so it is
            // exactly the height of one — a lane's — rather than as tall as its
            // own padding and line happen to come to. The week's lane is the
            // shorter of the two: a bar there is one line read across the row,
            // where the day's pill stands in a stack of them. A timed pill is as
            // tall as its event is long, and only needs a floor to stay legible
            // when that is minutes.
            'h-full': isAllDay && !!bar,
            'h-7': isAllDay && !bar,
            'min-h-6': !isAllDay,
            'event-raised': isRaised,
            active: activeEvent == (props.event?.id || props.event?.name),
            'rounded-l-none': bar && !bar.isStart,
            'rounded-r-none': bar && !bar.isEnd,
            'rounded-b-none': !isAllDay && props.event.segIsEnd === false,
            'rounded-t-none': !isAllDay && props.event.segIsStart === false,
            'event-draft': !!props.event.isDraft,
          }"
          :style="innerStyle"
          @click.stop.prevent="
            handleEventClick($event, () => (isPopoverOpen = !isPopoverOpen))
          "
          @dblclick.prevent="handleEventEdit($event)"
          @mousedown="
            handleRepositionMouseDown(
              $event,
              isPopoverOpen,
              () => (isPopoverOpen = false),
            )
          "
        >
          <div class="flex gap-1.5 h-full" :class="padClass">
            <!-- The calendar's own colour, down the pill's left edge — and the
                 first thing a tight pill gives up: the bar and the air beside it
                 are 8px of a pill some 40px wide, a fifth of it spent saying
                 what the fill it is drawn on says already. Where the column has
                 room — a desktop week, the day at any size — those 8px cost
                 nothing and the stripe is worth having.

                 By the view's answer rather than by the pill's own width, as
                 everything else in the tight tier is: a narrow week draws
                 single-day pills and bars three days wide in one row, and a
                 stripe on the wide ones alone read as two kinds of event. -->
            <div
              v-if="props.event.fromTime && !props.event.isDraft && !isTight"
              class="event-border h-full w-[2px] rounded-4 shrink-0"
            />
            <!-- An all-day pill is one line in a box built to hold it, so the
                 line sits in the middle of the box: a 20px line 2px inside a
                 24px bar has nowhere else to be, and asking for the top left it
                 a pixel high at the least convenient moment. A timed pill is as
                 tall as its event, which is usually taller than what it has to
                 say, and that starts at the top. -->
            <div
              class="relative flex h-full select-none gap-2 overflow-hidden"
              :class="isAllDay ? 'items-center' : 'items-start'"
            >
              <div v-if="config.showIcon && eventIcon">
                <component :is="eventIcon" class="h-4 w-4" />
              </div>
              <!-- A short event has one line's worth of height, so the time
                   sits beside the title there instead of under it, where it
                   would be cut off. -->
              <div
                class="flex min-w-0 overflow-hidden"
                :class="
                  isCompact
                    ? 'items-baseline gap-1.5'
                    : 'w-full flex-col gap-0.5'
                "
              >
                <!-- Declined: struck through and muted; the fill and bar stay,
                     so the event still reads as the one you said no to. -->
                <!-- `break-words` so a word wider than the pill breaks and
                     carries on underneath rather than running off the edge and
                     being clipped: at a tight pill's width most titles have a
                     word in them that no line can hold, and half of one against
                     the pill's edge reads as a rendering fault where a broken
                     one reads as a word that did not fit. It costs nothing
                     where a line does hold, which is every wider pill. -->
                <p
                  ref="eventTitleRef"
                  class="event-title break-words"
                  :class="[
                    // A size down where the pill is tight, with the line height
                    // that goes with it: 20px of leading under a 12px face
                    // wasted one of the two or three lines such a pill has.
                    isTight
                      ? 'text-xs-medium leading-4'
                      : 'text-sm-medium leading-5',
                    isCompact || (isNarrow && !isTight)
                      ? 'truncate'
                      : lineClampClass,
                    props.event.isDeclined
                      ? 'line-through text-ink-gray-5'
                      : 'text-ink-gray-8',
                  ]"
                >
                  {{ props.event.title || '[No title]' }}
                </p>
                <!-- `truncate`, so a range with nowhere left to go ends in an
                     ellipsis rather than at the pill's edge: below the width
                     the small size needs there is no size left to step down to,
                     and a glyph sliced down the middle reads as a bug where
                     "10:15 am – 12:30 p…" reads as a range that did not fit.
                     In the compact row the time is shrink-0 and the title gives
                     up the characters instead, so this never fires there. -->
                <p
                  ref="eventTimeRef"
                  v-if="!isAllDay && !isTight"
                  class="event-subtitle truncate"
                  :class="[
                    isNarrow ? 'text-2xs' : 'text-xs',
                    isCompact && 'shrink-0',
                  ]"
                >
                  {{ timeLabel }}
                </p>
              </div>
            </div>
          </div>
          <div
            v-if="
              config.isEditMode && !isAllDay && props.event.segIsEnd !== false
            "
            class="absolute -bottom-1 h-3 w-full cursor-ns-resize"
            @mousedown="handleResizeMouseDown"
          />
        </div>
      </div>
    </template>

    <template #default="{ close }">
      <slot
        name="event-popover-content"
        :calendarEvent
        :date
        :isEditMode="config.isEditMode"
        :close
      >
        <EventModalContent
          :calendarEvent="calendarEvent"
          :date="date"
          :isEditMode="config.isEditMode"
          @close="close"
          @edit="
            (e) => {
              close()
              handleEventEdit(e)
            }
          "
          @delete="
            () => {
              close()
              handleEventDelete()
            }
          "
        />
      </slot>
    </template>
  </Popover>

  <NewEventModal v-model="showEventModal" :event="updatedEvent" />
</template>

<script setup lang="ts">
import './style.css'

import { ref, inject, computed, reactive, type CSSProperties } from 'vue'
import EventModalContent from './EventModalContent.vue'
import NewEventModal from './NewEventModal.vue'
import Popover from '#components/Popover/Popover.vue'
import type { PopoverSide } from '#components/Popover/types'
import { useEventBase } from './useEventBase'
import { useElementSize } from '@vueuse/core'
import {
  calculateMinutes,
  convertMinutesToHours,
  calculateDiff,
  formattedDuration,
  paintedEventHeight,
  EVENT_HEIGHT_THRESHOLD,
} from './calendarUtils'
import {
  ALL_DAY_LANE_GAP,
  COLUMN_INSET,
  PILL_MARGIN,
  weekLaneHeight,
  weekLanePitch,
  isAllDayLike,
  shiftEventDays,
  shiftEventMinutes,
} from './eventSpan'
import {
  ACTIVE_VIEW_KEY,
  type CalendarEvent,
  type CalendarRowBar,
} from './types'

const props = defineProps<{
  /**
   * The event, or one day's piece of it: an overnight event arrives once per
   * day with `segFromTime`/`segToTime` clipped to that day.
   */
  event: CalendarEvent
  date: Date
  /**
   * Places the card as a bar across a row of day columns (the Week view's
   * all-day row). Without it an all-day card sits in normal flow.
   */
  bar?: CalendarRowBar
  /**
   * Drawn in a week whose columns are narrow, which is what a pill spanning
   * several of them cannot tell from its own width: a three-day bar is wide and
   * still belongs to a week where nothing else is.
   */
  narrow?: boolean
  /**
   * How far inside its column the pill's own edge lands, in pixels. The view
   * decides it — a phone's day and a narrow week sit on the 2px the month cells
   * use, where a roomy column keeps the 3 the pill's margin adds to the inset —
   * and the view lays out anything standing beside the pills from the same
   * number, so a "+n more" button lands on their line.
   */
  inset?: number
}>()

const isPopoverOpen = ref(false)

const {
  activeEvent,
  config,
  calendarActions,
  calendarEvent,
  updatedEvent,
  eventIcons,
  showEventModal,
  eventBgStyle,
  preventClick,
  handleEventClick,
  handleEventEdit,
  handleEventDelete,
  registerDeleteShortcut,
  unregisterDeleteShortcut,
} = useEventBase(props)

const activeView = inject(ACTIVE_VIEW_KEY)!

if (!activeView) {
  throw new Error('CalendarWeekDayEvent must be rendered inside Calendar.')
}

const minuteHeight = config.hourHeight / 60
const height15Min = minuteHeight * 15

// Week view puts the card beside the event; the other views centre it below.
// `align` is always 'center' — the old `placement="center"` was never a valid
// side and reached reka as one.
const popoverSide = computed<PopoverSide>(() =>
  activeView.value === 'Week' ? 'left' : 'bottom',
)
const eventIcon = computed(() =>
  props.event.type ? eventIcons[props.event.type] : null,
)

// ── Refs ─────────────────────────────────────────────────────────────────

const eventRef = ref<HTMLElement | null>(null)
const eventTitleRef = ref<HTMLElement | null>(null)
const eventTimeRef = ref<HTMLElement | null>(null)

// ── Drag state ────────────────────────────────────────────────────────────

const isResizing = ref(false)
const isRepositioning = ref(false)
const isEventUpdated = ref(false)
// Pixel offset of the card while dragged, and the move it stands for: whole
// days sideways, minutes up or down. Both ends of the event follow together.
const state = reactive({ xAxis: 0, yAxis: 0, dayShift: 0, minuteShift: 0 })

const isAllDay = computed(() => isAllDayLike(props.event))

/** Times that place this card: the day's clipped piece when there is one. */
const placedFromTime = () =>
  String(
    calendarEvent.value.segFromTime || calendarEvent.value.fromTime || '00:00',
  )
const placedToTime = () =>
  String(calendarEvent.value.segToTime || calendarEvent.value.toTime || '00:00')

// ── Position styles ───────────────────────────────────────────────────────

/**
 * Where the pill's own edge lands inside its column, and what the positioning
 * wrapper gives up so that it does — on both sides.
 *
 * The pill is the wrapper's width with `mx-px` besides, and `shrink-0`, so it
 * hangs a pixel past the wrapper's right edge. The wrapper therefore starts a
 * pixel inside the inset and gives the whole of it up twice over: the pill's
 * own edges then land on the inset, left and right.
 *
 * The view's number, or the 3px a wide column keeps — the inset plus the pill's
 * own margin. A phone reads the week, the day and the month as one grid, and 3
 * against the month's 2 is a difference it can see without being able to name.
 */
const pillInset = computed(() => props.inset ?? COLUMN_INSET + PILL_MARGIN)
const wrapperInset = computed(() => pillInset.value - PILL_MARGIN)

const containerStyle = computed<CSSProperties>(() => {
  if (props.bar) {
    const span = props.bar.endCol - props.bar.startCol + 1
    return {
      position: 'absolute',
      left: `calc(${(props.bar.startCol / DAY_COLUMNS) * 100}% + ${wrapperInset.value}px)`,
      width: `calc(${(span / DAY_COLUMNS) * 100}% - ${pillInset.value * 2}px)`,
      top: `${ALL_DAY_LANE_GAP + props.bar.lane * weekLanePitch(props.narrow)}px`,
      height: `${weekLaneHeight(props.narrow)}px`,
      transform: `translate(${state.xAxis}px, 0)`,
      zIndex: isRepositioning.value ? 100 : 1,
      transition: isRepositioning.value ? 'none' : 'all 0.1s ease',
    }
  }

  if (isAllDay.value) {
    return {
      transform: `translate(${state.xAxis}px, ${state.yAxis}px)`,
      zIndex: isRepositioning.value ? 100 : (props.event.idx || 0) + 1,
    }
  }

  const diff = calculateDiff(placedFromTime(), placedToTime())
  const height = paintedEventHeight(diff, minuteHeight)

  // The last piece of the day is held to the day: an event ending at midnight
  // is padded up to the minimum height like any short one, and since the pill
  // hangs from its start time that padding hangs past the last hour rule, where
  // the grid scrolls to reach it and the box below the week ends in a strip of
  // nothing. Padded up against the bottom rather than down past it.
  const top = Math.min(
    calculateMinutes(placedFromTime()) * minuteHeight,
    24 * config.hourHeight - height,
  )
  const hallNumber = calendarEvent.value.hallNumber || 0

  // Inset by the same 2px an all-day bar is, so the two read off one left
  // edge: the all-day pill above and the events under it are the same day's,
  // and a reader sees where the day starts once. The inset comes off the width
  // so only the left edge moves; the right is where the column's own air
  // begins. It holds through a drag as well — a pill that shifts 2px the
  // moment it is picked up reads as a nudge the reader did not make.
  const width =
    isResizing.value || isRepositioning.value
      ? `calc(100% - ${pillInset.value}px)`
      : `calc(${93 - hallNumber * 20}% - ${pillInset.value}px)`
  const left =
    isResizing.value || isRepositioning.value
      ? `${wrapperInset.value}px`
      : `calc(${hallNumber * 20}% + ${wrapperInset.value}px)`

  return {
    position: 'absolute',
    top: `${top}px`,
    left,
    width,
    height: `${height}px`,
    zIndex: isResizing.value || isRepositioning.value ? 100 : 0,
    transform: `translate(${state.xAxis}px, ${state.yAxis}px)`,
    transition:
      isResizing.value || isRepositioning.value ? 'none' : 'all 0.1s ease',
  }
})

/**
 * Drawn over another event, and so in need of an edge against it.
 *
 * Two ways that happens. `hallNumber` is the column an overlap puts an event in,
 * 0 for the one at the back — anything past that is laid over what came before.
 * And `idx` is its place within its own column, where events follow each other
 * in time and should not collide at all: they do because an event shorter than
 * the grid can draw is padded to a minimum height, so a quarter of an hour ends
 * a good deal further down the column than it does on the clock.
 */
const isRaised = computed(
  () =>
    (calendarEvent.value.hallNumber || 0) > 0 ||
    (calendarEvent.value.idx || 0) > 0,
)

const innerStyle = computed(() => ({
  ...eventBgStyle.value,
  height: '100%',
  width: '100%',
  cursor: isRepositioning.value ? 'grabbing' : 'pointer',
}))

// ── Line clamp ────────────────────────────────────────────────────────────

/**
 * Whether the event's slot is too short for a title line and a time line:
 * below the threshold the pill is held at its minimum height, which fits
 * one line, so the two go side by side.
 */
/**
 * The pill's own width, watched: a cascaded pill in the Week view can end up
 * narrower than a full range needs, and the range is what gets cut.
 */
const { width } = useElementSize(eventRef)

/**
 * Narrower than a full range fits at the ordinary size.
 *
 * Measured, not guessed: the longest label the formatter writes —
 * "10:15 am – 12:30 pm", both ends with minutes and a meridiem each — is 114px
 * at `text-xs`, and the pill spends 18px on either side of its text (5px of
 * padding each way, the 2px bar, and the 6px between the bar and the text). At
 * the 116 this was, the step down came 17px after the range had already
 * stopped fitting, so the widest pill it was meant to save was the one that
 * lost its "pm".
 */
const NARROW_PILL = 133

/**
 * A pill too narrow for its own range. The range then takes a size down rather
 * than losing its end to the pill's edge: a time cut in half is worse than a
 * small one, and the title above it can give up characters instead.
 */
const isNarrow = computed(() => !!width.value && width.value < NARROW_PILL)

/**
 * What a pill keeps between its edge and its text.
 *
 * 4px above and below on the day's all-day pill, against the 5 a timed one
 * takes: 5 and a 20px line come to 30, which is two past the lane the pill is
 * laid in. A bar takes the same 4, its lane being the day's own, and 2 in a
 * narrow week, whose lane is 20 and whose title is set at 16. The padding is
 * what holds the colour bar off the pill's top and bottom edges — `h-full` is
 * the height it is given, and given the whole pill it ran edge to edge and read
 * as a rule drawn through the row.
 *
 * A tight pill gives a pixel back on each side, which is a character of title on
 * a pill that has room for four.
 */
const padClass = computed(() => {
  if (!isAllDay.value) return isTight.value ? 'p-1' : 'p-[5px]'
  return isTight.value ? 'px-1 py-0.5' : 'px-1.5 py-1'
})

/**
 * Drawn where there is no room for everything a pill can say: a week at phone
 * width, where seven columns share some 330px and a pill is about 40 of them.
 * What goes is the time, not the title — a pill's place on the grid already
 * says when it is, to the quarter hour, and its title is the one thing only it
 * can say. The padding comes down with it, and the title a size.
 *
 * The view's answer, handed in, rather than the pill's own width. A pill
 * measures 40px for either of two reasons — a column that narrow, or a title
 * that short, since the day's all-day lane sizes its pills to their text — and
 * only the first is a reason to say less. Read from the width, "Holiday" and
 * "Conference" sat in one row of one day at two sizes.
 */
const isTight = computed(() => !!props.narrow)

const timeLabel = computed(() =>
  formattedDuration(
    updatedEvent.fromTime || '',
    updatedEvent.toTime || '',
    config.timeFormat,
  ),
)

const isCompact = computed(() => {
  if (isAllDay.value) return false
  return (
    calculateDiff(placedFromTime(), placedToTime()) * minuteHeight <
    EVENT_HEIGHT_THRESHOLD
  )
})

const lineClampClass = computed(() => {
  if (isAllDay.value) return 'line-clamp-1'
  if (!eventRef.value || !eventTitleRef.value) return
  if (!props.event.fromTime && !props.event.toTime) return

  const containerHeight = eventRef.value.clientHeight
  // A tight pill draws no time, so the whole of it is the title's to fill.
  const subtitleHeight = eventTimeRef.value?.offsetHeight ?? 0
  const availableHeightForTitle = containerHeight - subtitleHeight - 8

  const computedStyle = getComputedStyle(eventTitleRef.value)
  const lineHeight = parseFloat(computedStyle.lineHeight)
  const maxLines = Math.max(1, Math.floor(availableHeightForTitle / lineHeight))
  const clampMap: Record<number, string> = {
    1: 'line-clamp-1',
    2: 'line-clamp-2',
    3: 'line-clamp-3',
    4: 'line-clamp-4',
    5: 'line-clamp-5',
    6: 'line-clamp-6',
  }
  return clampMap[Math.min(maxLines, 6)]
})

// ── Resize ────────────────────────────────────────────────────────────────

// Measured from where this piece starts on its day: for the tail of an
// overnight event that is midnight, not the event's own start.
function newEventEndTime(newHeight: string) {
  let newEndTime =
    parseFloat(newHeight) / minuteHeight + calculateMinutes(placedFromTime())
  newEndTime = Math.floor(newEndTime)
  if (newEndTime > 1440) newEndTime = 1440
  return convertMinutesToHours(newEndTime)
}

function handleResizeMouseDown() {
  if (!eventRef.value) return
  isResizing.value = true
  isRepositioning.value = false

  const oldTime = calendarEvent.value.toTime
  window.addEventListener('mousemove', resize)
  window.addEventListener('mouseup', stopResize, { once: true })

  function resize(e: MouseEvent) {
    preventClick.value = true
    if (!eventRef.value) return
    const diffX = e.clientY - eventRef.value.getBoundingClientRect().top
    eventRef.value.style.height =
      Math.round(diffX / height15Min) * height15Min + 'px'
    eventRef.value.style.width = '100%'
    const toTime = newEventEndTime(eventRef.value.style.height)
    updatedEvent.toTime = toTime
    calendarEvent.value.toTime = toTime
    if (calendarEvent.value.segToTime) calendarEvent.value.segToTime = toTime
  }

  function stopResize() {
    isResizing.value = false
    if (oldTime !== calendarEvent.value.toTime) {
      calendarActions.updateEventState(calendarEvent.value)
    }
    window.removeEventListener('mousemove', resize)
  }
}

// ── Reposition ────────────────────────────────────────────────────────────

function handleRepositionMouseDown(
  e: MouseEvent,
  isPopoverOpen: boolean,
  closePopover: () => void,
) {
  if (!config.isEditMode) return

  e.preventDefault()
  const prevY = e.clientY
  if (!eventRef.value) return
  const rect = eventRef.value.getBoundingClientRect()

  if (isResizing.value) return

  window.addEventListener('mousemove', mousemove)
  window.addEventListener('mouseup', mouseup)

  function mousemove(e: MouseEvent) {
    if (isPopoverOpen) closePopover()
    isRepositioning.value = true
    preventClick.value = true
    if (!eventRef.value) return

    if (activeView.value === 'Week') handleHorizontalMovement(e.clientX, rect)
    if (!isAllDay.value) handleVerticalMovement(e.clientY, prevY, rect)

    // The subtitle previews where the event would land.
    const preview = shiftEventMinutes(
      { ...calendarEvent.value },
      state.minuteShift,
    )
    updatedEvent.fromTime = preview.fromTime
    updatedEvent.toTime = preview.toTime

    isEventUpdated.value = state.dayShift !== 0 || state.minuteShift !== 0
  }

  function mouseup(e: MouseEvent) {
    e.preventDefault()
    isRepositioning.value = false
    if (!eventRef.value) return

    if (isEventUpdated.value) {
      if (state.minuteShift) {
        shiftEventMinutes(calendarEvent.value, state.minuteShift)
      }
      if (state.dayShift) shiftEventDays(calendarEvent.value, state.dayShift)
      calendarActions.updateEventState(calendarEvent.value)
      isEventUpdated.value = false
    }
    state.xAxis = 0
    state.yAxis = 0
    state.dayShift = 0
    state.minuteShift = 0

    window.removeEventListener('mousemove', mousemove)
    window.removeEventListener('mouseup', mouseup)
  }
}

/** Number of day columns the card can move across sideways. */
const DAY_COLUMNS = 7

/** Width of one day column: the enclosing row's share, or the card's own. */
function columnWidth(): number {
  const row = eventRef.value?.closest(
    '[data-day-columns]',
  ) as HTMLElement | null
  if (row) return row.clientWidth / DAY_COLUMNS
  return eventRef.value?.clientWidth || 1
}

// Sideways movement is in whole days and stays inside the week: the card's
// own column bounds how far left or right it can go. A bar's column is the
// first day it shows in this row, so a stay that began last week can still
// move right but not left past the row's edge.
function handleHorizontalMovement(clientX: number, rect: DOMRect) {
  if (!eventRef.value) return
  const width = columnWidth()
  let diff = Math.floor((clientX - rect.left) / width)

  const column = props.bar ? props.bar.startCol : new Date(props.date).getDay()
  diff = Math.max(-column, Math.min(diff, DAY_COLUMNS - 1 - column))

  state.xAxis = Math.ceil(diff * width)
  state.dayShift = diff
}

function handleVerticalMovement(clientY: number, prevY: number, rect: DOMRect) {
  if (!eventRef.value) return
  let diffY = clientY - prevY

  const parentRect = eventRef.value
    .closest('[data-time-grid]')
    ?.getBoundingClientRect()
  if (!parentRect) return
  if (clientY < parentRect.top) diffY = parentRect.top - rect.top
  if (clientY > parentRect.bottom) diffY = parentRect.bottom - rect.bottom

  diffY = Math.round(diffY / height15Min) * height15Min
  state.yAxis = diffY
  state.minuteShift = Math.round(diffY / minuteHeight)
}
</script>
