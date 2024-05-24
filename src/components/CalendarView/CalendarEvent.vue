<template>
  <!-- TODO: v if else for monthly  -->
  <div
    class="h-min-[18px] rounded-lg p-2 transition-all duration-75"
    ref="eventRef"
    v-bind="$attrs"
    :class="[
      colorMap[props.event?.color]?.background_color || 'bg-green-100',
      activeView !== 'Month' && 'shadow-lg',
      opened && activeView !== 'Month' && '!z-20 drop-shadow-xl',
    ]"
    :style="activeView !== 'Month' && setEventStyles"
    @dblclick.prevent="handleEventEdit()"
    @click="handleEventClick()"
    v-on="{
      mousedown:
        config.isEditMode &&
        activeView !== 'Month' &&
        handleRepositionMouseDown,
    }"
  >
    <div
      class="relative flex h-full select-none items-start gap-2 overflow-hidden px-2"
      :class="
        props.event.from_time && [
          'border-l-2',
          colorMap[props.event?.color]?.border_color || 'border-green-600',
        ]
      "
    >
      <component
        v-if="eventIcons[props.event.type]"
        :is="eventIcons[props.event.type]"
        class="h-4 w-4 text-black"
      />
      <FeatherIcon v-else name="circle" class="h-4 text-black" />

      <div class="flex w-fit flex-col overflow-hidden whitespace-nowrap">
        <p class="text-ellipsis text-sm font-medium text-gray-800">
          {{ props.event.title || 'New Event' }}
        </p>
        <p
          class="text-ellipsis text-xs font-normal text-gray-800"
          v-if="props.event.from_time"
        >
          {{ updatedEvent.from_time }} - {{ updatedEvent.to_time }}
        </p>
      </div>
    </div>
    <div
      v-if="config.isEditMode && activeView !== 'Month' && !event.isFullDay"
      class="absolute h-[8px] w-[100%] cursor-row-resize"
      ref="resize"
      @mousedown="handleResizeMouseDown"
    />
  </div>

  <div ref="floating" :style="{ ...floatingStyles, zIndex: 100 }" v-if="opened">
    <EventModalContent
      :calendarEvent="calendarEvent"
      :date="date"
      :isEditMode="config.isEditMode"
      @close="close"
      @edit="handleEventEdit"
      @delete="handleEventDelete"
    />
  </div>
  <NewEventModal
    v-if="showEventModal"
    v-model="showEventModal"
    :event="props.event"
  />
</template>

<script setup>
import FeatherIcon from '../FeatherIcon.vue'
import EventModalContent from './EventModalContent.vue'
import NewEventModal from './NewEventModal.vue'
import { useFloating, shift, flip, offset, autoUpdate } from '@floating-ui/vue'

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
const { updateEventState, deleteEvent } = inject('eventActions')

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
  date: props.event.date,
  from_time: props.event.from_time,
  to_time: props.event.to_time,
})

watch(
  () => props.event,
  (newVal) => {
    updatedEvent.from_time = newVal.from_time
    updatedEvent.to_time = newVal.to_time
    calendarEvent.value = newVal
  },
  { deep: true }
)

const eventIcons = config.eventIcons
const minuteHeight = config.hourHeight / 60
const height_15_min = minuteHeight * 15

const state = reactive({
  xAxis: 0,
  yAxis: 0,
})

const setEventStyles = computed(() => {
  if (props.event.isFullDay) {
    return {
      transform: `translate(${state.xAxis}px, ${state.yAxis}px)`,
      zIndex: props.event.idx + 1,
    }
  }

  let diff = calculateDiff(
    calendarEvent.value.from_time,
    calendarEvent.value.to_time
  )
  let height =
    activeView.value === 'Month' ? 'auto' : diff * minuteHeight + 'px'

  let top = calculateMinutes(calendarEvent.value.from_time) * minuteHeight
  if (activeView.value === 'Day') {
    top += config.redundantCellHeight
  }

  let hallNumber = calendarEvent.value.hallNumber
  let width =
    isResizing.value || isRepositioning.value
      ? '100%'
      : `${80 - hallNumber * 20}%`
  let left =
    isResizing.value || isRepositioning.value ? '0' : `${hallNumber * 20}%`
  let zIndex =
    isResizing.value || isRepositioning.value
      ? 100
      : (props.event.idx || 1) * hallNumber + 1
  // border: 1px solid #fff;
  let border = hallNumber >= 1 ? '1px solid #fff' : ''

  return {
    height,
    top: top + 'px',
    zIndex: zIndex,
    left,
    width,
    transform: `translate(${state.xAxis}px, ${state.yAxis}px)`,
    borderLeft: border,
    borderTop: border,
  }
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
    calculateMinutes(calendarEvent.value.from_time)
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

  let oldTime = calendarEvent.value.to_time
  window.addEventListener('mousemove', resize)
  window.addEventListener('mouseup', stopResize, { once: true })

  function resize(e) {
    preventClick.value = true
    // difference between where mouse is and where event's top is, to find the new height
    let diffX = e.clientY - eventRef.value.getBoundingClientRect().top
    eventRef.value.style.height =
      Math.round(diffX / height_15_min) * height_15_min + 'px'

    eventRef.value.style.width = '100%'
    updatedEvent.to_time = newEventEndTime(eventRef.value.style.height)
    calendarEvent.value.to_time = newEventEndTime(eventRef.value.style.height)
  }

  function stopResize() {
    isResizing.value = false
    if (oldTime !== calendarEvent.value.to_time) {
      updateEventState(calendarEvent.value)
    }

    window.removeEventListener('mousemove', resize)
  }
}

function handleRepositionMouseDown(e) {
  e.preventDefault()
  if (activeView.value === 'Month') return
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
    if (!props.event.isFullDay) handleVerticalMovement(e.clientY, prevY)

    if (
      calendarEvent.value.from_time !== updatedEvent.from_time ||
      calendarEvent.value.to_time !== updatedEvent.to_time
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
      calendarEvent.value.from_time = updatedEvent.from_time
      calendarEvent.value.to_time = updatedEvent.to_time
      updateEventState(calendarEvent.value)
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
    date.getDate() + nextDate
  )
  return newDate
}

function handleHorizontalMovement(clientX, rect) {
  const currentDate = new Date(
    props.event.isFullDay
      ? eventRef.value.parentNode.parentNode.getAttribute('data-date-attr')
      : eventRef.value.parentNode.getAttribute('data-date-attr')
  )
  const leftPadding = currentDate.getDay()
  const rightPadding = 6 - currentDate.getDay()

  if (props.event.isFullDay) {
    eventRef.value.style.width = '100%'
  }

  let eventWidth = eventRef.value.clientWidth
  let diff = Math.floor((clientX - rect.left) / eventWidth)
  if (diff < -leftPadding) {
    diff = -leftPadding
  } else if (diff > rightPadding) {
    diff = rightPadding
  }
  let xPos = Math.ceil(diff * eventWidth)
  state.xAxis = xPos
  updatedEvent.date = parseDate(getDate(currentDate, diff))
}

function handleVerticalMovement(clientY, prevY) {
  let diffY = clientY - prevY
  diffY = Math.round(diffY / height_15_min) * height_15_min

  state.yAxis = diffY

  updatedEvent.from_time = convertMinutesToHours(
    calculateMinutes(calendarEvent.value.from_time) +
      Math.round(diffY / minuteHeight)
  )
  updatedEvent.to_time = convertMinutesToHours(
    calculateMinutes(calendarEvent.value.to_time) +
      Math.round(diffY / minuteHeight)
  )
  handleTimeConstraints()
}

function handleTimeConstraints() {
  if (updatedEvent.from_time < '00:00:00') {
    updatedEvent.from_time = '00:00:00'
  }
  if (updatedEvent.from_time > '24:00:00') {
    updatedEvent.from_time = '24:00:00'
  }
  if (updatedEvent.to_time < '00:00:00') {
    updatedEvent.to_time = '00:00:00'
  }
  if (updatedEvent.to_time > '24:00:00') {
    updatedEvent.to_time = '24:00:00'
  }
}

const toggle = () => (opened.value = !opened.value)
const close = () => (opened.value = false)

function handleEventClick() {
  // hack to prevent event modal from opening when resizing or repositioning
  if (preventClick.value) {
    preventClick.value = false
    return
  }
  toggle()
}

const showEventModal = ref(false)
function handleEventEdit() {
  if (!config.isEditMode) return
  close()
  showEventModal.value = true
}

function handleEventDelete() {
  deleteEvent(calendarEvent.value.id)
}
</script>
