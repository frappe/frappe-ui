<template>
  <Popover placement="left" transition="default" @open="registerDeleteShortcut" @close="unregisterDeleteShortcut">
    <template #target="{ togglePopover, isOpen }">
      <div
        v-bind="$attrs"
        class="event flex gap-1.5 min-h-6 mx-px rounded p-[5px] transition-all duration-75 w-full overflow-hidden"
        :class="{ active: activeEvent == (props.event?.id || props.event?.name) }"
        :style="eventBgStyle"
        @click.stop="handleEventClick($event, togglePopover, isOpen)"
        @dblclick.prevent="handleEventEdit($event)"
      >
        <div
          v-if="props.event.fromTime"
          class="event-border w-[2px] rounded shrink-0"
          :style="eventBorderStyle"
        />
        <div class="relative flex h-full select-none items-start gap-2 overflow-hidden">
          <div v-if="config.showIcon && eventIcons[props.event.type]">
            <component :is="eventIcons[props.event.type]" class="h-4 w-4 text-black" />
          </div>
          <p class="text-sm font-medium truncate" :class="{ italic: !props.event.title }">
            {{ props.event.title || '[No title]' }}
          </p>
        </div>
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

<script setup>
import './style.css'

import EventModalContent from './EventModalContent.vue'
import NewEventModal from './NewEventModal.vue'
import Popover from '../Popover/Popover.vue'
import { eventProps, useEventBase } from './useEventBase.js'

const props = defineProps(eventProps)

const {
  activeEvent,
  config,
  calendarEvent,
  updatedEvent,
  eventIcons,
  showEventModal,
  eventBgStyle,
  eventBorderStyle,
  handleEventClick,
  handleEventEdit,
  handleEventDelete,
  registerDeleteShortcut,
  unregisterDeleteShortcut,
} = useEventBase(props)
</script>
