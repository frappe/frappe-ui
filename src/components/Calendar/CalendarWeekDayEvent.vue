<template>
  <Popover
    :placement="popoverPlacement"
    transition="default"
    :style="containerStyle"
    @open="registerDeleteShortcut"
    @close="unregisterDeleteShortcut"
  >
    <template #target="{ togglePopover, isOpen, close }">
      <div
        ref="eventRef"
        class="event min-h-6 mx-px shadow rounded transition-all duration-75 shrink-0"
        :class="{
          active: activeEvent == (props.event?.id || props.event?.name),
        }"
        :style="innerStyle"
        @click.prevent="handleEventClick($event, togglePopover)"
        @dblclick.prevent="handleEventEdit($event)"
        @mousedown="handleRepositionMouseDown($event, isOpen, close)"
      >
        <div class="flex gap-1.5 h-full p-[5px]">
          <div
            v-if="props.event.fromTime"
            class="event-border h-full w-[2px] rounded shrink-0"
            :style="eventBorderStyle"
          />
          <div
            class="relative flex h-full select-none items-start gap-2 overflow-hidden"
          >
            <div v-if="config.showIcon && eventIcon">
              <component :is="eventIcon" class="h-4 w-4" />
            </div>
            <div class="flex w-fit flex-col gap-0.5 overflow-hidden">
              <p
                ref="eventTitleRef"
                class="text-sm-medium event-title"
                :class="lineClampClass"
              >
                {{ props.event.title || '[No title]' }}
              </p>
              <p
                ref="eventTimeRef"
                v-if="!props.event.isFullDay"
                class="text-xs event-subtitle"
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
          v-if="config.isEditMode && !props.event.isFullDay"
          class="absolute -bottom-1 h-3 w-full cursor-ns-resize"
          @mousedown="handleResizeMouseDown"
        />
      </div>
    </template>

    <template #body-main="{ close }">
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

import { ref, inject, computed, reactive } from 'vue'
import EventModalContent from './EventModalContent.vue'
import NewEventModal from './NewEventModal.vue'
import Popover from '../Popover/Popover.vue'
import { useEventBase } from './useEventBase'
import {
  calculateMinutes,
  convertMinutesToHours,
  calculateDiff,
  parseDate,
  formattedDuration,
} from './calendarUtils'
import { ACTIVE_VIEW_KEY, type CalendarEvent } from './types'

const props = defineProps<{
  event: CalendarEvent
  date: Date
}>()

const {
  activeEvent,
  config,
  calendarActions,
  calendarEvent,
  updatedEvent,
  eventIcons,
  showEventModal,
  eventBgStyle,
  eventBorderStyle,
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

const popoverPlacement = computed(
  () => (activeView.value === 'Week' ? 'left' : 'center') as any,
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
const state = reactive({ xAxis: 0, yAxis: 0 })

// ── Position styles ───────────────────────────────────────────────────────

const containerStyle = computed(() => {
  if (props.event.isFullDay) {
    return {
      transform: `translate(${state.xAxis}px, ${state.yAxis}px)`,
      zIndex: isRepositioning.value ? 100 : (props.event.idx || 0) + 1,
    }
  }

  const diff = calculateDiff(
    calendarEvent.value.fromTime || '00:00',
    calendarEvent.value.toTime || '00:00',
  )
  let height = diff * minuteHeight
  if (height < heightThreshold) height = minimumHeight

  const top =
    calculateMinutes(calendarEvent.value.fromTime || '00:00') * minuteHeight
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

const lineClampClass = computed(() => {
  if (props.event.isFullDay) return 'line-clamp-1'
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

function newEventEndTime(newHeight: string) {
  let newEndTime =
    parseFloat(newHeight) / minuteHeight +
    calculateMinutes(calendarEvent.value.fromTime || '00:00')
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
    updatedEvent.toTime = newEventEndTime(eventRef.value.style.height)
    calendarEvent.value.toTime = newEventEndTime(eventRef.value.style.height)
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
    if (!props.event.isFullDay) handleVerticalMovement(e.clientY, prevY, rect)

    isEventUpdated.value =
      calendarEvent.value.fromTime !== updatedEvent.fromTime ||
      calendarEvent.value.toTime !== updatedEvent.toTime
  }

  function mouseup(e: MouseEvent) {
    e.preventDefault()
    isRepositioning.value = false
    if (!eventRef.value) return

    if (calendarEvent.value.isFullDay && activeView.value === 'Week') {
      eventRef.value.style.width = '90%'
    }
    if (calendarEvent.value.date !== updatedEvent.date)
      isEventUpdated.value = true

    if (isEventUpdated.value) {
      calendarEvent.value.date = updatedEvent.date
      calendarEvent.value.fromDate = updatedEvent.date
      calendarEvent.value.toDate = updatedEvent.date
      calendarEvent.value.fromDateTime =
        updatedEvent.date + ' ' + updatedEvent.fromTime
      calendarEvent.value.toDateTime =
        updatedEvent.date + ' ' + updatedEvent.toTime
      calendarEvent.value.fromTime = updatedEvent.fromTime
      calendarEvent.value.toTime = updatedEvent.toTime
      calendarActions.updateEventState(calendarEvent.value)
      isEventUpdated.value = false
      state.xAxis = 0
      state.yAxis = 0
    }

    window.removeEventListener('mousemove', mousemove)
    window.removeEventListener('mouseup', mouseup)
  }
}

function handleHorizontalMovement(clientX: number, rect: DOMRect) {
  const currentDate = new Date(props.event.date || props.date)
  if (!eventRef.value) return
  if (props.event.isFullDay) eventRef.value.style.width = '100%'

  const eventWidth = eventRef.value.clientWidth
  let diff = Math.floor((clientX - rect.left) / eventWidth)

  const leftBoundary = currentDate.getDay()
  const rightBoundary = 6 - currentDate.getDay()
  diff = Math.max(-leftBoundary, Math.min(diff, rightBoundary))

  state.xAxis = Math.ceil(diff * eventWidth)
  updatedEvent.date = parseDate(
    new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() + diff,
    ),
  )
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

  updatedEvent.fromTime = convertMinutesToHours(
    calculateMinutes(calendarEvent.value.fromTime || '00:00') +
      Math.round(diffY / minuteHeight),
  )
  updatedEvent.toTime = convertMinutesToHours(
    calculateMinutes(calendarEvent.value.toTime || '00:00') +
      Math.round(diffY / minuteHeight),
  )

  for (const key of ['fromTime', 'toTime'] as const) {
    const value = updatedEvent[key] || ''
    if (value < '00:00:00') updatedEvent[key] = '00:00:00'
    if (value > '24:00:00') updatedEvent[key] = '24:00:00'
  }
}
</script>
