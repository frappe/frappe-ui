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
        <div
          ref="eventRef"
          class="event min-h-6 mx-px shadow rounded-4 transition-all duration-75 shrink-0"
          :class="{
            active: activeEvent == (props.event?.id || props.event?.name),
            'rounded-l-none': bar && !bar.isStart,
            'rounded-r-none': bar && !bar.isEnd,
            'rounded-b-none': !isAllDay && props.event.segIsEnd === false,
            'rounded-t-none': !isAllDay && props.event.segIsStart === false,
            'event-draft': !!props.event.isDraft,
          }"
          :style="innerStyle"
          @click.prevent="
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
          <div class="flex gap-1.5 h-full p-[5px]">
            <div
              v-if="props.event.fromTime && !props.event.isDraft"
              class="event-border h-full w-[2px] rounded-4 shrink-0"
            />
            <div
              class="relative flex h-full select-none items-start gap-2 overflow-hidden"
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
                    : 'w-fit flex-col gap-0.5'
                "
              >
                <!-- Declined: struck through and muted; the fill and bar stay,
                     so the event still reads as the one you said no to. -->
                <p
                  ref="eventTitleRef"
                  class="event-title text-sm-medium"
                  :class="[
                    isCompact ? 'truncate' : lineClampClass,
                    props.event.isDeclined
                      ? 'line-through text-ink-gray-5'
                      : 'text-ink-gray-8',
                  ]"
                >
                  {{ props.event.title || '[No title]' }}
                </p>
                <p
                  ref="eventTimeRef"
                  v-if="!isAllDay"
                  class="text-xs event-subtitle"
                  :class="isCompact && 'shrink-0 whitespace-nowrap'"
                >
                  {{
                    formattedDuration(
                      updatedEvent.fromTime || '',
                      updatedEvent.toTime || '',
                      config.timeFormat,
                    )
                  }}
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
import {
  calculateMinutes,
  convertMinutesToHours,
  calculateDiff,
  formattedDuration,
} from './calendarUtils'
import {
  LANE_HEIGHT,
  LANE_PITCH,
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
const heightThreshold = 40
const minimumHeight = 32.5

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

const containerStyle = computed<CSSProperties>(() => {
  if (props.bar) {
    const span = props.bar.endCol - props.bar.startCol + 1
    return {
      position: 'absolute',
      left: `calc(${(props.bar.startCol / DAY_COLUMNS) * 100}% + 2px)`,
      width: `calc(${(span / DAY_COLUMNS) * 100}% - 4px)`,
      top: `${4 + props.bar.lane * LANE_PITCH}px`,
      height: `${LANE_HEIGHT}px`,
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
  let height = diff * minuteHeight
  if (height < heightThreshold) height = minimumHeight

  const top = calculateMinutes(placedFromTime()) * minuteHeight
  const hallNumber = calendarEvent.value.hallNumber || 0

  const width =
    isResizing.value || isRepositioning.value
      ? '100%'
      : `${93 - hallNumber * 20}%`
  const left =
    isResizing.value || isRepositioning.value ? '0' : `${hallNumber * 20}%`

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
const isCompact = computed(() => {
  if (isAllDay.value) return false
  return (
    calculateDiff(placedFromTime(), placedToTime()) * minuteHeight <
    heightThreshold
  )
})

const lineClampClass = computed(() => {
  if (isAllDay.value) return 'line-clamp-1'
  if (!eventRef.value || !eventTitleRef.value || !eventTimeRef.value) return
  if (!props.event.fromTime && !props.event.toTime) return

  const containerHeight = eventRef.value.clientHeight
  const subtitleHeight = eventTimeRef.value.offsetHeight
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
