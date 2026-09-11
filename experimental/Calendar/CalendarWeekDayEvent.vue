<template>
  <!--
    Controlled rather than trigger-driven: a single click opens the popover only
    after a 200ms wait, so a double click can edit the event instead, and a
    mousedown can start a reposition drag. Reka's trigger toggles on click with
    no such delay, so `update:open` is honoured only on the way down — Escape
    and outside-click still close it.
  -->
  <!-- The cut between this pill and each event it is drawn over: a rounded
       rect 2.5px larger than this pill on every side, in the page's own
       colour, clipped to the exact rounded shape of the pill beneath — so what
       shows is a ring of even width, only where it lies on the other event,
       and never on the grid. Its own element rather than a shadow on the pill:
       a shadow falls on whatever is beside the pill and cannot be told to stop
       at another's edge. Before the pill in the DOM and after the one beneath,
       which is where the pill's fill covers the ring's inside and the other
       pill's fill shows through the ring's outside. -->
  <div
    v-for="cut in cuts"
    :key="cut.id"
    class="pointer-events-none absolute inset-0"
    :style="{ clipPath: cut.clip }"
  >
    <div class="absolute bg-surface-base" :style="cut.ring" />
  </div>
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
                 stripe on the wide ones alone read as two kinds of event.

                 A pixel shorter at either end than the text beside it — 5px in
                 from the pill's edge where the padding alone would put it 4 —
                 so it reads as a mark set on the pill rather than a rule run
                 through it. Sized by the row's stretch with the margin taken
                 off, not `h-full` with a margin added on, which would run it
                 past the bottom. -->
            <div
              v-if="props.event.fromTime && !props.event.isDraft && !isTight"
              class="event-border my-px w-[2px] rounded-4 shrink-0"
            />
            <!-- An all-day pill is one line in a box built to hold it, so the
                 line sits in the middle of the box: a 20px line 2px inside a
                 24px bar has nowhere else to be, and asking for the top left it
                 a pixel high at the least convenient moment. A timed pill is as
                 tall as its event, which is usually taller than what it has to
                 say, and that starts at the top. -->
            <div
              ref="contentRef"
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
                <!-- Not drawn at all where the row has no room for even a
                     letter and an ellipsis — see `showTitle` — since what a
                     narrower row shows is the sliver of a letter, which reads
                     as a fault, and an empty pill reads as a pill too narrow
                     to say anything, which it is. -->
                <p
                  v-if="showTitle"
                  ref="eventTitleRef"
                  class="event-title break-words"
                  :class="[
                    // A size down where the pill is tight, with the line height
                    // that goes with it: 20px of leading under a 12px face
                    // wasted one of the two or three lines such a pill has.
                    //
                    // A title with room to wrap sets its lines snug, ~18px on
                    // the 13px face: at the 20 a one-line pill keeps, its lines
                    // sat further from each other than the last of them sat
                    // from the time, and the pair read as two things. Snug
                    // puts the two distances within a pixel. The one-line
                    // pills — compact, all-day — keep 20, which is what their
                    // lanes are built round.
                    isTight
                      ? 'text-xs-medium leading-4'
                      : isCompact || isAllDay
                        ? 'text-sm-medium leading-5'
                        : 'text-sm-medium leading-snug',
                    // One line only where the pill has one line's height. A
                    // narrow pill is not a short one: it wraps into whatever
                    // height it has, and the clamp is reckoned from what is
                    // left after the time line, so the range keeps its end
                    // either way.
                    // In the compact row the title gives up its characters
                    // before the time gives up any: it shrinks a hundred times
                    // as readily, which is the only order flex knows, and only
                    // once it is down to its floor does the time start to go.
                    // The floor is one letter and an ellipsis — 24px holds a W
                    // and the dots at this size — so the row always says what
                    // the event is, if only by its initial, and never shows an
                    // ellipsis on its own, or the sliver of a letter that a
                    // title squeezed to nothing was.
                    isCompact
                      ? `${TITLE_FLOOR_CLASS} shrink-[100] truncate`
                      : lineClampClass,
                    props.event.isDeclined
                      ? 'line-through text-ink-gray-5'
                      : 'text-ink-gray-8',
                  ]"
                >
                  {{ props.event.title || '[No title]' }}
                </p>
                <!-- Under the title the range wraps into the lines the title
                     leaves — see `timeClampClass` — and beside it, in the
                     compact row, it is one line, and gone altogether where
                     the title's floor leaves it less than a digit and an
                     ellipsis — see `showTime`.
                     `truncate`, so a range with nowhere left to go ends in an
                     ellipsis rather than at the pill's edge: a glyph sliced
                     down the middle reads as a bug where "10:15 am – 12:30 p…"
                     reads as a range that did not fit. One size, whatever the
                     pill's width: a cascaded or sidebar-squeezed pill is the
                     same event at the same distance from the reader, and its
                     type does not get smaller for being in a narrower column —
                     only the tight tier, which the view hands in, sets type
                     down, and it drops the time altogether. In the compact
                     row this fires only after the title is down to
                     its initial — see the title's shrink — since a pill too
                     narrow for both has to cut one, and a range with its end
                     gone still says when the event starts. -->
                <p
                  ref="eventTimeRef"
                  v-if="!isAllDay && !isTight && showTime"
                  class="event-subtitle text-xs"
                  :class="
                    isCompact ? `${TIME_FLOOR_CLASS} truncate` : timeClampClass
                  "
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
import { useElementSize } from '@vueuse/core'
import EventModalContent from './EventModalContent.vue'
import NewEventModal from './NewEventModal.vue'
import Popover from '#components/Popover/Popover.vue'
import type { PopoverSide } from '#components/Popover/types'
import { useEventBase } from './useEventBase'
import {
  calculateMinutes,
  convertMinutesToHours,
  calculateDiff,
  formattedDuration,
  paintedEventHeight,
  EVENT_HEIGHT_THRESHOLD,
} from './calendarUtils'
import {
  COLUMN_RULE,
  PILL_INSET,
  PILL_MARGIN,
  weekLaneGap,
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
const contentRef = ref<HTMLElement | null>(null)
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
 * The view's number, or the standard gap. A bar laid against the column boundary
 * asks for the rule's own pixel back on its right, so that the white either side
 * of a divider is the same width — see `COLUMN_RULE`.
 */
const pillInset = computed(() => props.inset ?? PILL_INSET)
const wrapperInset = computed(() => pillInset.value - PILL_MARGIN)

/** The ring's width, and the pill's corner radius it runs concentric with. */
const CUT = 2.5
const PILL_RADIUS = 8

/**
 * Where a timed pill sits in its column, from its start, its length and its
 * overlap column — the one reckoning for this pill and for the cuts it draws
 * against the pills beneath it, so the two cannot come apart.
 *
 * The last piece of the day is held to the day: an event ending at midnight
 * is padded up to the minimum height like any short one, and since the pill
 * hangs from its start time that padding hangs past the last hour rule, where
 * the grid scrolls to reach it and the box below the week ends in a strip of
 * nothing. Padded up against the bottom rather than down past it.
 *
 * Across, the pill's own edges: its wrapper starts a pixel inside the inset and
 * the pill's margin puts its edge on it. The pill at the back ends on 93% of
 * the column, and each pill laid over another starts a fifth of the column
 * further in and ends two ring-widths sooner — so its ring lies wholly on the
 * pill beneath, with a ring's width of that pill's fill still showing past it.
 * Ending on the same line, the ring's outer arc could not reach the corner it
 * turned, and the other pill's fill showed in the wedge between the two, cut
 * off square by its own edge; no shape of corner mends a shared edge.
 *
 * A right edge rather than a width, so that the pills resolve the same `7%`
 * against the same column: as `left + width`, 20% + 73% and 3px + 93% came out
 * a sixty-fourth of a pixel apart, a device pixel on a good screen.
 */
const timedBox = (startMinutes: number, minutes: number, hall?: number) => {
  // Whole pixels, so the pill and the ring drawn round it snap to the same
  // line: a quarter past the hour is 12.5px down a 50px hour, and a pill on a
  // half pixel rounds one way while a ring set 2px off it rounds the other,
  // and the ring came out 2px on one side and 3 on the next.
  const height = Math.round(paintedEventHeight(minutes, minuteHeight))
  const top = Math.round(
    Math.min(startMinutes * minuteHeight, 24 * config.hourHeight - height),
  )
  const hallNumber = hall || 0
  return {
    top,
    height,
    hallNumber,
    left: (extra = 0) => `calc(${hallNumber * 20}% + ${pillInset.value + extra}px)`,
    right: (extra = 0) => `calc(7% + ${hallNumber * 2 * CUT - extra}px)`,
  }
}

/**
 * One cut per event this pill lies on — see the template. Nothing while the
 * pill is being dragged or resized: it is out of the layout's hands then, and
 * its cuts would be drawn against where it was.
 */
const cuts = computed(() => {
  if (isAllDay.value || isResizing.value || isRepositioning.value) return []
  const over = (calendarEvent.value.over || []) as CalendarEvent[]
  if (!over.length) return []
  const own = timedBox(
    calculateMinutes(placedFromTime()),
    calculateDiff(placedFromTime(), placedToTime()),
    calendarEvent.value.hallNumber,
  )
  // The pill's own box, a ring's width larger on every side, its corners
  // concentric with the pill's: a ring of one width all the way round. It is
  // never on an edge of the pill beneath — see `timedBox` — so it is whole
  // wherever it shows.
  const ring: CSSProperties = {
    top: `${own.top - CUT}px`,
    left: own.left(-CUT),
    right: own.right(CUT),
    height: `${own.height + 2 * CUT}px`,
    borderRadius: `${PILL_RADIUS + CUT}px`,
  }
  return over.map((other) => {
    const box = timedBox(
      other.startTime || 0,
      (other.endTime || 0) - (other.startTime || 0),
      other.hallNumber,
    )
    // `inset()` clips this element — the whole column — to the other pill's
    // box: its top and bottom in pixels from the column's edges, its left and
    // right the pill's own, and its corners the pill's own.
    const clip = `inset(${box.top}px ${box.right()} calc(100% - ${box.top + box.height}px) ${box.left()} round ${PILL_RADIUS}px)`
    return { id: `${other.id}-${other.hallNumber}-${other.idx}`, clip, ring }
  })
})


const containerStyle = computed<CSSProperties>(() => {
  if (props.bar) {
    const span = props.bar.endCol - props.bar.startCol + 1
    return {
      position: 'absolute',
      left: `calc(${(props.bar.startCol / DAY_COLUMNS) * 100}% + ${wrapperInset.value}px)`,
      width: `calc(${(span / DAY_COLUMNS) * 100}% - ${pillInset.value * 2 + COLUMN_RULE}px)`,
      top: `${weekLaneGap(props.narrow) + props.bar.lane * weekLanePitch(props.narrow)}px`,
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

  const { top, height, hallNumber } = timedBox(
    calculateMinutes(placedFromTime()),
    calculateDiff(placedFromTime(), placedToTime()),
    calendarEvent.value.hallNumber,
  )

  // Inset by the same measure an all-day bar is, so the two read off one left
  // edge: the all-day pill above and the events under it are the same day's,
  // and a reader sees where the day starts once. The inset comes off the width
  // so only the left edge moves; the right is where the column's own air
  // begins, at 93%, which is where the cascade of overlapping pills is read
  // from — each pill laid over another starts a fifth of the column further
  // in. It holds through a drag as well — a pill that shifts on being picked
  // up reads as a nudge the reader did not make.
  // The wrapper's edges are the pill's less its margin either side — see
  // `timedBox`. Dragged, it runs the column's width.
  const dragging = isResizing.value || isRepositioning.value
  const box = timedBox(0, 0, hallNumber)
  const left = dragging
    ? `${wrapperInset.value}px`
    : `calc(${hallNumber * 20}% + ${wrapperInset.value}px)`
  const right = dragging ? `${PILL_MARGIN}px` : box.right(-PILL_MARGIN)

  return {
    position: 'absolute',
    top: `${top}px`,
    left,
    right,
    height: `${height}px`,
    zIndex: isResizing.value || isRepositioning.value ? 100 : 0,
    transform: `translate(${state.xAxis}px, ${state.yAxis}px)`,
    transition:
      isResizing.value || isRepositioning.value ? 'none' : 'all 0.1s ease',
  }
})

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
 * What a pill keeps between its edge and its text.
 *
 * 4px across, on every pill in either view. The two were 5 on a timed pill and 6
 * on an all-day one, which put their titles a pixel apart in a column where the
 * all-day row sits directly over the hours — everything else about the two edges
 * is the same, the inset, the colour bar and the air beside it, so that pixel
 * was the whole of the misalignment.
 *
 * 4px above and below as well, where the pill's height is its own: a 20px line
 * in the 28px lane the day's all-day pills and the week's bars are laid in. Two
 * in a narrow week, whose lane is 20 and whose title is set at 16. That padding
 * is what holds the colour bar off the pill's top and bottom edges — `h-full` is
 * the height it is given, and given the whole pill it ran edge to edge and read
 * as a rule drawn through the row.
 */
const padClass = computed(() =>
  isAllDay.value ? (isTight.value ? 'px-1 py-0.5' : 'p-1') : 'p-1',
)

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

const clampMap: Record<number, string> = {
  1: 'line-clamp-1',
  2: 'line-clamp-2',
  3: 'line-clamp-3',
  4: 'line-clamp-4',
  5: 'line-clamp-5',
  6: 'line-clamp-6',
}
const clampClass = (lines: number) =>
  clampMap[Math.min(Math.max(1, Math.floor(lines)), 6)]

const lineHeightOf = (el: HTMLElement) =>
  parseFloat(getComputedStyle(el).lineHeight)

/**
 * The pill's content box, watched: the counts and floors below read the DOM,
 * which nothing reactive tracks, and its width is what changes underneath
 * them — the sidebar opening, a cascade forming — so they are reckoned again
 * when it does. The content box rather than the pill, so the icon, when there
 * is one, is already out of the width.
 */
const { width: contentWidth } = useElementSize(contentRef)

/**
 * How many lines the pill's height affords, less its padding and the gap
 * between title and time, laid out in some mix of the two faces.
 */
const contentHeight = () => (eventRef.value?.clientHeight ?? 0) - 8 - 2

/**
 * The lines the title may run to: what the pill's height holds once a single
 * line of the time is set aside. One line and not the time's rendered height,
 * since the time wraps too — into what the title leaves, and the title is
 * reckoned first, so the pair cannot chase each other round.
 */
const titleLines = computed(() => {
  if (isAllDay.value) return 1
  // Read so the count follows the column's width.
  void contentWidth.value
  if (!eventRef.value || !eventTitleRef.value) return
  if (!props.event.fromTime && !props.event.toTime) return

  // A tight pill draws no time, so the whole of it is the title's to fill.
  const timeLine = eventTimeRef.value ? lineHeightOf(eventTimeRef.value) : 0
  return Math.max(
    1,
    Math.floor((contentHeight() - timeLine) / lineHeightOf(eventTitleRef.value)),
  )
})

const lineClampClass = computed(() =>
  titleLines.value === undefined ? undefined : clampClass(titleLines.value),
)

/**
 * The lines the time may run to: what is left under the lines the title
 * actually takes — its natural count, or its clamp, whichever is fewer. A
 * range that fits on one line takes one; one that does not wraps at its dash
 * as far as the height goes, "2:30 –" over "5:30 pm", and ends in an ellipsis
 * only where there is no line left to wrap onto.
 */
const timeClampClass = computed(() => {
  void contentWidth.value
  if (
    titleLines.value === undefined ||
    !eventTitleRef.value ||
    !eventTimeRef.value
  )
    return 'line-clamp-1'
  const titleLine = lineHeightOf(eventTitleRef.value)
  const natural = Math.round(eventTitleRef.value.scrollHeight / titleLine)
  const taken = Math.min(natural, titleLines.value) * titleLine
  return clampClass((contentHeight() - taken) / lineHeightOf(eventTimeRef.value))
})

// ── Compact row ───────────────────────────────────────────────────────────

/**
 * The least each of the compact row's two texts is drawn at: a letter and an
 * ellipsis. 24px holds a W and the dots on the title's 13px face; 16 holds a
 * digit and the dots on the time's 12px. The class is what the flex layout
 * shrinks each down to and no further; the number is what says whether there
 * is room to draw it at all, since the row's overflow-hidden would otherwise
 * clip what does not fit to the sliver of a glyph.
 */
const TITLE_FLOOR = 24
const TITLE_FLOOR_CLASS = 'min-w-6'
const TIME_FLOOR = 16
const TIME_FLOOR_CLASS = 'min-w-4'
/** `gap-1.5` between the two. */
const COMPACT_GAP = 6

/**
 * Whether the compact row is wide enough for the title's floor. Anything
 * narrower draws nothing: a pill too narrow for one letter of its title has
 * nothing to say but its place on the grid, and it says that by being there.
 */
const showTitle = computed(() => {
  if (!isCompact.value) return true
  if (!contentWidth.value) return true
  return contentWidth.value >= TITLE_FLOOR
})

/**
 * Whether the compact row has room for the time's floor beside the title.
 * The title shrinks first and to its floor, so the room is what lies past the
 * gap and past the narrower of the title's own width and that floor. The
 * title has the first claim, so no title means no time either.
 */
const showTime = computed(() => {
  if (!isCompact.value) return true
  if (!contentWidth.value || !showTitle.value) return showTitle.value
  const title = Math.min(
    eventTitleRef.value?.scrollWidth ?? TITLE_FLOOR,
    TITLE_FLOOR,
  )
  return contentWidth.value - COMPACT_GAP - title >= TIME_FLOOR
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
