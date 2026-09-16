<template>
  <CalendarEventPopover
    v-model:open="isPopoverOpen"
    side="left"
    :calendar-event="calendarEvent"
    :date="date"
    @open="registerDeleteShortcut"
    @close="unregisterDeleteShortcut"
    @edit="handleEventEdit"
    @delete="handleEventDelete"
  >
    <div
      v-bind="$attrs"
      class="event flex rounded-4 transition-all duration-75 overflow-hidden"
      :class="{
        'h-5 gap-1 px-1 py-0.5': dense,
        'h-7 gap-1.5 px-1 py-1': !dense,
        active: activeEvent == (props.event?.id || props.event?.name),
        'rounded-l-none': bar && !bar.isStart,
        'rounded-r-none': bar && !bar.isEnd,
        'event-draft': !!props.event.isDraft,
      }"
      :style="eventBgStyle"
      @click.stop="
        handleEventClick(
          $event,
          () => (isPopoverOpen = !isPopoverOpen),
          isPopoverOpen,
        )
      "
      @dblclick.prevent="handleEventEdit($event)"
    >
      <!-- The colour bar goes where the cell is narrow: 2px of it plus the gap
           beside it is a tenth of a phone's column, spent saying in a second
           way what the fill already says. The title takes some of that back as
           padding — without the bar in front of it, 3px left it against the
           pill's own edge. A pixel shorter at either end than the text beside
           it, as in the week — a mark set on the pill, not a rule through it.
           Hidden on a draft rather than left out, as in the week, so a
           draft's title stays in line with the pills above and below it. -->
      <div
        v-if="props.event.fromTime && !dense"
        class="event-border my-px w-[2px] rounded-4 shrink-0"
        :class="{ invisible: props.event.isDraft }"
      />
      <div
        class="relative flex h-full min-w-0 select-none items-center gap-2 overflow-hidden"
      >
        <div v-if="config.showIcon && eventIcon">
          <component :is="eventIcon" class="h-4 w-4 text-ink-gray-8" />
        </div>
        <p
          class="event-title min-w-0 truncate"
          :class="[
            dense ? 'text-xs-medium leading-4' : 'text-sm-medium leading-5',
            props.event.isDeclined
              ? 'line-through text-ink-gray-5'
              : 'text-ink-gray-8',
            { italic: !props.event.title },
          ]"
        >
          {{ props.event.title || '[No title]' }}
        </p>
      </div>
    </div>
    <template #event-popover-content="slotProps">
      <slot name="event-popover-content" v-bind="slotProps" />
    </template>
  </CalendarEventPopover>

  <NewEventModal v-model="showEventModal" :event="updatedEvent" />
</template>

<script setup lang="ts">
import './style.css'

import CalendarEventPopover from './CalendarEventPopover.vue'
import NewEventModal from './NewEventModal.vue'
import { useEventBase } from './useEventBase'
import { computed, ref } from 'vue'
import type { CalendarEvent, CalendarRowBar } from './types'

const isPopoverOpen = ref(false)

const props = defineProps<{
  event: CalendarEvent
  date: Date
  /**
   * The bar this pill draws in a week row. A side the event runs past is
   * squared off, so a stay that began last week reads as continuing.
   */
  bar?: CalendarRowBar
  /**
   * Drawn for a cell a seventh of a phone's width: a size down and a couple of
   * pixels off every side, which is two more events in the same cell.
   *
   * Either way the pill is exactly as tall as the lane it is laid in — 28px, or
   * 20 dense — rather than as tall as what is in it. A month cell is a stack of
   * rows and they have to be one rhythm; a floor let a pill grow past its lane
   * the moment its padding and line came to more.
   */
  dense?: boolean
}>()

defineOptions({ inheritAttrs: false })

const {
  activeEvent,
  config,
  calendarEvent,
  updatedEvent,
  eventIcons,
  showEventModal,
  eventBgStyle,
  handleEventClick,
  handleEventEdit,
  handleEventDelete,
  registerDeleteShortcut,
  unregisterDeleteShortcut,
} = useEventBase(props)

const eventIcon = computed(() =>
  props.event.type ? eventIcons[props.event.type] : null,
)
</script>
