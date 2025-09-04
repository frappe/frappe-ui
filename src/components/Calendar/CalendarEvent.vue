<template>
  <!-- Weekly and Daily Event Template  -->
  <div
    class="event min-h-6 mx-px shadow rounded transition-all duration-75 shrink-0"
    ref="eventRef"
    v-if="activeView !== 'Month'"
    v-bind="$attrs"
    :class="[
      opened && '!z-20 drop-shadow-xl',
      activeEvent == (props.event?.id || props.event?.name) && 'active',
    ]"
    :style="[setEventStyles, eventBgStyle]"
    @dblclick.prevent="handleEventEdit($event)"
    @click.prevent="handleEventClick($event)"
    v-on="{
      mousedown: config.isEditMode && handleRepositionMouseDown,
    }"
  >
    <div class="flex gap-1.5 h-full p-[5px]" :class="isPastEvent && 'past'">
      <div
        v-if="props.event.fromTime"
        class="event-border h-full w-[2px] rounded shrink-0"
        :style="eventBorderStyle"
      />
      <div
        class="relative flex h-full select-none items-start gap-2 overflow-hidden"
      >
        <div v-if="config.showIcon && eventIcons[props.event.type]">
          <component
            v-if="eventIcons[props.event.type]"
            :is="eventIcons[props.event.type]"
            class="h-4 w-4"
          />
        </div>

        <div class="flex w-fit flex-col gap-0.5 overflow-hidden">
          <p
            ref="eventTitleRef"
            class="text-sm font-medium event-title"
            :class="lineClampClass"
          >
            {{ props.event.title || '(No title)' }}
          </p>
          <p
            ref="eventTimeRef"
            class="text-xs font-normal event-subtitle"
            v-if="!props.event.isFullDay"
          >
            {{
              formattedDuration(
                updatedEvent.fromTime,
                updatedEvent.toTime,
                config.timeFormat,
              )
            }}
          </p>
        </div>
      </div>
    </div>
    <div
      v-if="config.isEditMode && !event.isFullDay"
      class="absolute -bottom-1 h-3 w-full cursor-ns-resize"
      ref="resize"
      @mousedown="handleResizeMouseDown"
    />
  </div>

  <!-- Monthly Event Template -->
  <div
    v-else
    class="event flex gap-1.5 min-h-6 mx-px rounded p-[5px] transition-all duration-75"
    :class="[
      activeEvent == (props.event?.id || props.event?.name) && 'active',
      isPastEvent && 'past',
    ]"
    ref="eventRef"
    v-bind="$attrs"
    @dblclick.prevent="handleEventEdit($event)"
    @click.stop="handleEventClick($event)"
    :style="eventBgStyle"
  >
    <div
      v-if="props.event.fromTime"
      class="event-border w-[2px] rounded shrink-0"
      :style="eventBorderStyle"
    />
    <div
      class="relative flex h-full select-none items-start gap-2 overflow-hidden"
    >
      <div v-if="config.showIcon && eventIcons[props.event.type]">
        <component
          v-if="eventIcons[props.event.type]"
          :is="eventIcons[props.event.type]"
          class="h-4 w-4 text-black"
        />
      </div>

      <div
        class="flex w-fit flex-col text-start overflow-hidden whitespace-nowrap"
      >
        <p class="text-sm font-medium truncate">
          {{ props.event.title || 'New Event' }}
        </p>
      </div>
    </div>
  </div>

  <div
    ref="floating"
    :style="{ ...floatingStyles, zIndex: 100 }"
    v-if="opened"
    class="rounded shadow-xl"
  >
    <EventModalContent
      :calendarEvent="calendarEvent"
      :date="date"
      :isEditMode="config.isEditMode"
      @close="close"
      @edit="handleEventEdit"
      @delete="handleEventDelete"
      class="shadow-xl"
    />
  </div>
  <NewEventModal v-model="showEventModal" :event="updatedEvent" />
</template>

<script setup>
import EventModalContent from './EventModalContent.vue'
import NewEventModal from './NewEventModal.vue'
import { useFloating, shift, flip, offset, autoUpdate } from '@floating-ui/vue'
import { activeEvent } from './composables/useCalendarData.js'

import {
  ref,
  inject,
  computed,
  onMounted,
  onBeforeUnmount,
  watch,
  reactive,
} from 'vue'

import {
  calculateMinutes,
  convertMinutesToHours,
  calculateDiff,
  parseDate,
  colorMap,
  colorMapDark,
  formattedDuration,
} from './calendarUtils'

const props = defineProps({
  event: {
    type: Object,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
})

const activeView = inject('activeView')
const config = inject('config')
const calendarActions = inject('calendarActions')

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
function handleClickOutside(e) {
  const insidePopover = floating.value && floating.value.contains(e.target)
  if (insidePopover) return
  const insideTarget = eventRef.value && eventRef.value.contains(e.target)
  if (insideTarget) return
  close()
}

const calendarEvent = ref(props.event)

const updatedEvent = reactive({
  ...props.event,
})

watch(
  () => props.event,
  (newVal) => {
    updatedEvent.fromTime = newVal.fromTime
    updatedEvent.toTime = newVal.toTime
    updatedEvent.fromDate = newVal.fromDate
    updatedEvent.toDate = newVal.toDate
    updatedEvent.fromDateTime = newVal.fromDate + ' ' + newVal.fromTime
    updatedEvent.toDateTime = newVal.toDate + ' ' + newVal.toTime
    calendarEvent.value = newVal
  },
  { deep: true },
)

const eventIcons = config.eventIcons
const minuteHeight = config.hourHeight / 60
const height15Min = minuteHeight * 15

const state = reactive({
  xAxis: 0,
  yAxis: 0,
})

const heightThreshold = 40
const minimumHeight = 32.5
const setEventStyles = computed(() => {
  if (props.event.isFullDay) {
    return {
      transform: `translate(${state.xAxis}px, ${state.yAxis}px)`,
      zIndex: isRepositioning.value ? 100 : props.event.idx + 1,
    }
  }

  let diff = calculateDiff(
    calendarEvent.value.fromTime,
    calendarEvent.value.toTime,
  )
  let height = diff * minuteHeight
  if (height < heightThreshold) {
    height = minimumHeight
  }
  height += 'px'

  let top = calculateMinutes(calendarEvent.value.fromTime) * minuteHeight

  let hallNumber = calendarEvent.value.hallNumber
  let width =
    isResizing.value || isRepositioning.value
      ? '100%'
      : `${93 - hallNumber * 20}%`
  let left =
    isResizing.value || isRepositioning.value ? '0' : `${hallNumber * 20}%`
  let zIndex =
    isResizing.value || isRepositioning.value
      ? 100
      : (props.event.idx || 1) * hallNumber + 1

  return {
    height,
    top: top + 'px',
    zIndex: zIndex,
    left,
    width,
    transform: `translate(${state.xAxis}px, ${state.yAxis}px)`,
  }
})

const eventBgStyle = computed(() => {
  let _color = props.event.color || 'green'
  _color = color(_color)

  return {
    '--bg': _color.bg,
    '--text': _color.text,
    '--subtext': _color.subtext,
    '--text-active': _color.textActive,
    '--subtext-active': _color.subtextActive,
    '--bg-hover': _color.bgHover,
    '--bg-active': _color.bgActive,
  }
})

const eventBorderStyle = computed(() => {
  let _color = props.event.color || 'green'
  _color = color(_color)

  return { '--border': _color.border, '--border-active': _color.borderActive }
})

const getTheme = () => {
  const theme = document.documentElement.getAttribute('data-theme')

  if (theme) return theme
  return document.documentElement.classList.contains('htw-dark')
    ? 'dark'
    : 'light'
}

function color(color) {
  let map = getTheme() === 'dark' ? colorMapDark : colorMap

  if (!color?.startsWith('#')) {
    return map[color] || map['green']
  }

  for (const value of Object.values(map)) {
    if (value.color === color) return value
  }

  return map['green']
}

const eventTitleRef = ref(null)
const eventTimeRef = ref(null)

const lineClampClass = computed(() => {
  if (activeView.value === 'Month') return
  if (props.event.isFullDay) return 'line-clamp-1'
  if (!eventRef.value || !eventTitleRef.value || !eventTimeRef.value) return
  if (!props.event.fromTime && !props.event.toTime) return

  const containerHeight = eventRef.value.clientHeight
  const subtitleHeight = eventTimeRef.value.offsetHeight
  const availableHeightForTitle = containerHeight - subtitleHeight - 8 // margin

  const computedStyle = getComputedStyle(eventTitleRef.value)
  const lineHeight = parseFloat(computedStyle.lineHeight)

  const maxLines = Math.max(1, Math.floor(availableHeightForTitle / lineHeight))

  // Clamp between 1 and 6 lines (Tailwind supports line-clamp-1 to line-clamp-6 by default)
  const clampValue = Math.min(maxLines, 6)
  return `line-clamp-${clampValue}`
})

const eventRef = ref(null)
// Popover Element Config
const floating = ref(null)
const { floatingStyles } = useFloating(eventRef, floating, {
  placement: activeView.value === 'Day' ? 'top' : 'right',
  middleware: [offset(10), flip(), shift()],
  whileElementsMounted: autoUpdate,
})

const opened = ref(false)
const resize = ref(null)
const isResizing = ref(false)
const isRepositioning = ref(false)
const isEventUpdated = ref(false)

function newEventEndTime(newHeight) {
  let newEndTime =
    parseFloat(newHeight) / minuteHeight +
    calculateMinutes(calendarEvent.value.fromTime)
  newEndTime = Math.floor(newEndTime)
  if (newEndTime > 1440) {
    newEndTime = 1440
  }
  return convertMinutesToHours(newEndTime)
}

const preventClick = ref(false)
function handleResizeMouseDown(e) {
  isResizing.value = true
  isRepositioning.value = false

  let oldTime = calendarEvent.value.toTime
  window.addEventListener('mousemove', resize)
  window.addEventListener('mouseup', stopResize, { once: true })

  function resize(e) {
    preventClick.value = true
    // difference between where mouse is and where event's top is, to find the new height
    let diffX = e.clientY - eventRef.value.getBoundingClientRect().top
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

function handleRepositionMouseDown(e) {
  e.preventDefault()
  let prevY = e.clientY
  const rect = eventRef.value.getBoundingClientRect()

  if (isResizing.value) return

  window.addEventListener('mousemove', mousemove)
  window.addEventListener('mouseup', mouseup)

  function mousemove(e) {
    isRepositioning.value = true
    preventClick.value = true
    if (!eventRef.value) return
    close()
    eventRef.value.style.cursor = 'grabbing'

    // handle movement between days
    if (activeView.value === 'Week') {
      handleHorizontalMovement(e.clientX, rect)
    }

    // handle movement within the same day
    if (!props.event.isFullDay) handleVerticalMovement(e.clientY, prevY, rect)

    if (
      calendarEvent.value.fromTime !== updatedEvent.fromTime ||
      calendarEvent.value.toTime !== updatedEvent.toTime
    ) {
      isEventUpdated.value = true
    } else {
      isEventUpdated.value = false
    }
  }

  function mouseup(e) {
    e.preventDefault()
    isRepositioning.value = false
    if (!eventRef.value) return

    eventRef.value.style.cursor = 'pointer'
    if (calendarEvent.value.isFullDay && activeView.value === 'Week') {
      eventRef.value.style.width = '90%'
    }
    if (calendarEvent.value.date !== updatedEvent.date) {
      isEventUpdated.value = true
    }
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

function getDate(date, nextDate = 0) {
  let newDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() + nextDate,
  )
  return newDate
}

function handleHorizontalMovement(clientX, rect) {
  const currentDate = new Date(
    eventRef.value.parentNode.getAttribute('data-date-attr'),
  )

  if (props.event.isFullDay) {
    eventRef.value.style.width = '100%'
  }

  let eventWidth = eventRef.value.clientWidth
  let diff = Math.floor((clientX - rect.left) / eventWidth)

  const leftBoundary = currentDate.getDay()
  const rightBoundary = 6 - currentDate.getDay()
  diff = handleHorizontalBoundary(diff, leftBoundary, rightBoundary)
  let xPos = Math.ceil(diff * eventWidth)
  state.xAxis = xPos
  updatedEvent.date = parseDate(getDate(currentDate, diff))
}

function handleHorizontalBoundary(diff, leftBoundary, rightBoundary) {
  if (diff < -leftBoundary) {
    diff = -leftBoundary
  } else if (diff > rightBoundary) {
    diff = rightBoundary
  }
  return diff
}

function handleVerticalMovement(clientY, prevY, rect) {
  let diffY = clientY - prevY

  // handle boundaries for the calendar event
  let parentTop = eventRef.value.parentNode.getBoundingClientRect().top
  let parentBottom = eventRef.value.parentNode.getBoundingClientRect().bottom

  // to prevent event from going above the top of the parent cell
  if (clientY < parentTop) {
    diffY = parentTop - rect.top
  }
  // to prevent event from going below the bottom of the parent cell
  if (clientY > parentBottom) {
    diffY = parentBottom - rect.bottom
  }

  diffY = Math.round(diffY / height15Min) * height15Min
  state.yAxis = diffY

  updatedEvent.fromTime = convertMinutesToHours(
    calculateMinutes(calendarEvent.value.fromTime) +
      Math.round(diffY / minuteHeight),
  )
  updatedEvent.toTime = convertMinutesToHours(
    calculateMinutes(calendarEvent.value.toTime) +
      Math.round(diffY / minuteHeight),
  )
  handleTimeConstraints()
}

function handleTimeConstraints() {
  if (updatedEvent.fromTime < '00:00:00') {
    updatedEvent.fromTime = '00:00:00'
  }
  if (updatedEvent.fromTime > '24:00:00') {
    updatedEvent.fromTime = '24:00:00'
  }
  if (updatedEvent.toTime < '00:00:00') {
    updatedEvent.toTime = '00:00:00'
  }
  if (updatedEvent.toTime > '24:00:00') {
    updatedEvent.toTime = '24:00:00'
  }
}

const toggle = () => (opened.value = !opened.value)
const close = () => (opened.value = false)

function handleDeleteShortcut(e) {
  if (e.key === 'Delete' || e.key === 'Backspace') {
    opened.value = false
    handleEventDelete()
  }
}

watch(
  () => opened.value,
  (newVal) => {
    if (newVal) {
      if (!config.isEditMode) return
      if (!config.enableShortcuts) return
      document.addEventListener('keydown', handleDeleteShortcut, { once: true })
    }
  },
)

let clickTimer = null
function handleEventClick(e) {
  // hack to prevent event modal from opening when resizing or repositioning
  if (preventClick.value) {
    preventClick.value = false
    return
  }

  // hack: timeout to see whether it's a double click or a single click
  if (e.detail === 1) {
    clickTimer = setTimeout(() => {
      calendarActions.props.onClick
        ? calendarActions.props.onClick({
            e,
            calendarEvent: calendarEvent.value,
          })
        : toggle()
    }, 200)
  }
}

const showEventModal = ref(false)
function handleEventEdit(e = null) {
  e && (e.cancelBubble = true)
  // if it's a double click, clear the timeout
  clearTimeout(clickTimer)
  if (calendarActions.props.onDblClick) {
    calendarActions.props.onDblClick({
      e,
      calendarEvent: calendarEvent.value,
    })
    return
  }
  if (!config.isEditMode) return
  close()
  showEventModal.value = true
}

function handleEventDelete() {
  calendarActions.deleteEvent(calendarEvent.value.id)
  close()
}

const isPastEvent = computed(() => {
  try {
    // determine end date/time
    const endDateStr =
      calendarEvent.value.toDate ||
      calendarEvent.value.date ||
      calendarEvent.value.fromDate ||
      props.event.toDate ||
      props.event.date ||
      props.event.fromDate

    if (!endDateStr) return false
    // If event has a toTime use it; else if full day, treat end as end of day; fallback 00:00:00
    let endTimeStr = '00:00:00'
    if (calendarEvent.value.isFullDay || props.event.isFullDay)
      endTimeStr = '23:59:59'
    else if (calendarEvent.value.toTime) endTimeStr = calendarEvent.value.toTime

    const end = new Date(`${endDateStr}T${endTimeStr}`.replace(' ', 'T'))
    return end.getTime() < new Date().getTime()
  } catch (e) {
    return false
  }
})
</script>

<style scoped>
.event {
  background-color: var(--bg);
}
.event .event-title {
  color: var(--text);
}

.event .event-subtitle {
  color: var(--subtext);
}

.event .event-border {
  background-color: var(--border);
}

.event.active {
  background-color: var(--bg-active);
}

.event.active .event-title {
  color: var(--text-active, #fff);
}

.event.active .event-subtitle {
  color: var(--subtext-active);
}

.event.active .event-border {
  background-color: var(--border-active);
}

.event:not(.active):hover {
  background-color: var(--bg-hover);
}

.event:not(.active) .past,
.event.past:not(.active) {
  opacity: 0.5;
}
</style>
