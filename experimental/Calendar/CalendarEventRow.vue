<template>
  <!--
    One listed event, on the Day view's rail or in the Agenda. Both read an
    event as a row rather than a pill, and the only thing that separates them is
    how much room the time column gets — so this is one component with a
    `surface`, not two that would drift.

    Same popover as a grid pill, so `#event-popover-content` behaves the same
    wherever an event is shown, and the same 200ms click delay, so a double
    click still edits.
  -->
  <Popover
    :open="isPopoverOpen"
    side="bottom"
    align="center"
    @update:open="(value) => !value && (isPopoverOpen = false)"
    @open="registerDeleteShortcut"
    @close="unregisterDeleteShortcut"
  >
    <template #trigger>
      <div
        class="calendar-row flex w-full items-baseline gap-2.5 rounded-8 px-2 py-1.5 text-left"
        :class="{
          active: activeEvent == (props.event?.id || props.event?.name),
          now: happeningNow,
        }"
        :style="eventBgStyle"
        role="button"
        tabindex="0"
        @click.prevent="onClick($event)"
        @dblclick.prevent="handleEventEdit($event)"
        @keydown.enter.prevent="onKeydown($event)"
        @keydown.space.prevent="onKeydown($event)"
      >
        <span
          class="calendar-row-time shrink-0 text-right text-xs tabular-nums text-ink-gray-5"
          :class="surface === 'agenda' ? 'w-26' : 'w-[58px]'"
        >
          {{ timeLabel }}
        </span>
        <span class="calendar-row-bar w-0.5 shrink-0 self-stretch rounded-4" />
        <span class="flex min-w-0 flex-1 flex-col gap-0.5">
          <span class="flex min-w-0 items-baseline gap-2">
            <!-- Declined reads the same here as on a pill: struck through and
                 muted, still plainly the event you said no to. -->
            <span
              class="calendar-row-title truncate text-sm-medium"
              :class="
                props.event.isDeclined
                  ? 'line-through text-ink-gray-5'
                  : 'text-ink-gray-8'
              "
            >
              {{ props.event.title || '[No title]' }}
            </span>
            <span class="flex shrink-0 items-center gap-1">
              <slot name="event-suffix" v-bind="slotProps">
                <span
                  v-for="tag in tags"
                  :key="tag.label"
                  class="calendar-row-tag"
                  :data-tone="tag.tone || 'gray'"
                >
                  {{ tag.label }}
                </span>
              </slot>
            </span>
          </span>
          <span
            v-if="hasDescription"
            class="calendar-row-description truncate text-xs text-ink-gray-5"
          >
            <slot name="event-description" v-bind="slotProps">
              {{ description }}
            </slot>
          </span>
        </span>
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
</template>

<script setup lang="ts">
import './style.css'

import { computed, ref, useSlots } from 'vue'
import Popover from '#components/Popover/Popover.vue'
import EventModalContent from './EventModalContent.vue'
import { useEventBase } from './useEventBase'
import { useNow } from './composables/useNow'
import {
  isHappeningNow,
  rowDescription,
  rowTags,
  rowTimeLabel,
} from './eventRow'
import type { CalendarEvent, CalendarRowSurface } from './types'

const props = defineProps<{
  event: CalendarEvent
  /** The day the row belongs to; a multi-day event has one row per day. */
  date: Date
  surface: CalendarRowSurface
}>()

const emit = defineEmits<{ select: [event: CalendarEvent] }>()

const slots = useSlots()
const now = useNow()

const {
  activeEvent,
  config,
  calendarActions,
  calendarEvent,
  eventBgStyle,
  handleEventClick,
  handleEventEdit,
  handleEventDelete,
  registerDeleteShortcut,
  unregisterDeleteShortcut,
} = useEventBase(props)

const isPopoverOpen = ref(false)

const timeLabel = computed(() => rowTimeLabel(props.event, config.timeFormat))
const description = computed(() => rowDescription(props.event, props.date))
const tags = computed(() => rowTags(props.event, props.date, now.value))

// An empty description line would still take its leading, so the row only
// grows one when there is something to put on it.
const hasDescription = computed(
  () => !!description.value || !!slots['event-description'],
)

const happeningNow = computed(() =>
  isHappeningNow(props.event, props.date, now.value),
)

const slotProps = computed(() => ({
  calendarEvent: calendarEvent.value,
  date: props.date,
  surface: props.surface,
  description: description.value,
  tags: tags.value,
}))

// A row is a way to reach the event, so selecting it says so — the Day view
// scrolls its grid to the event. What the click itself does is the pill's
// business exactly: `handleEventClick` waits 200ms for a double click, then
// hands the event to the host's `onClick` if it set one, or opens the popover.
function onClick(e: MouseEvent) {
  emit('select', props.event)
  handleEventClick(e, togglePopover, isPopoverOpen.value)
}

// Keyboards do not double click, and `handleEventClick` reads `e.detail` — 0
// for a key — so activation from the keyboard takes the short way round rather
// than sitting in a timer that never fires.
function onKeydown(e: KeyboardEvent) {
  emit('select', props.event)
  if (calendarActions.props.onClick)
    calendarActions.props.onClick({ e, calendarEvent: calendarEvent.value })
  else togglePopover()
}

function togglePopover() {
  isPopoverOpen.value = !isPopoverOpen.value
}
</script>
