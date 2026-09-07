<template>
  <!--
    One listed event in the Agenda, read as a row rather than a pill.

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
        class="calendar-row flex w-full items-baseline gap-2.5 px-3.5 py-2 text-left"
        :class="{
          active: activeEvent == (props.event?.id || props.event?.name),
          past: isPast,
          'event-draft': !!props.event.isDraft,
        }"
        :style="eventBgStyle"
        role="button"
        tabindex="0"
        @click.prevent="onClick($event)"
        @dblclick.prevent="handleEventEdit($event)"
        @keydown.enter.prevent="onKeydown($event)"
        @keydown.space.prevent="onKeydown($event)"
      >
        <!-- The time, in a column of its own against the card's left edge: the
             bars line up under each other whatever each row's label says, which
             is what makes a card read as a day rather than as three sentences.

             132px holds the widest label ("11:30 am – 12:45 pm", 128px). A
             column sized to the common "2:30 – 3:30 pm" would let that one
             overrun the bar it is supposed to stop short of. -->
        <span
          class="calendar-row-time w-33 shrink-0 whitespace-nowrap text-xs tabular-nums text-ink-gray-5"
        >
          {{ timeLabel }}
        </span>
        <!-- 3px, not the 2 a pill's border takes: a row carries no fill, so the
             bar is the only colour on it and the only thing placing the event
             on a calendar. It is that width whether or not the row is the open
             one — a mark that thickens on click is a mark the reader has to
             have seen thin to read as thick. -->
        <span
          class="calendar-row-bar w-[3px] shrink-0 self-stretch rounded-4"
        />
        <!-- Title, then what the row can add about it, on one line: a row is
             wide and a title is short, so a second line spends the height of
             two rows to say what fits beside the first. -->
        <span class="flex min-w-0 flex-1 items-baseline gap-2">
          <!-- Declined reads the same here as on a pill: struck through and
               muted, still plainly the event you said no to. -->
          <!-- leading-5 and leading-4 below, rather than the sizes' own 1.15: at
               13px that leaves a 14.95px line box for glyphs that stand 16px, and
               truncate's overflow-hidden then slices the descender off a g or a y.
               The line box has to clear the ink before it can be clipped for width. -->
          <span
            class="calendar-row-title shrink-0 truncate text-sm-medium leading-5"
            :class="
              props.event.isDeclined
                ? 'line-through text-ink-gray-5'
                : 'text-ink-gray-8'
            "
          >
            {{ props.event.title || '[No title]' }}
          </span>
          <span
            v-if="hasDescription"
            class="calendar-row-description min-w-0 truncate text-xs leading-4 text-ink-gray-5"
          >
            <slot name="event-description" v-bind="slotProps">
              {{ description }}
            </slot>
          </span>
          <span class="flex shrink-0 items-center gap-1">
            <slot name="event-suffix" v-bind="slotProps">
              <Badge
                v-for="tag in tags"
                :key="tag.label"
                :theme="tag.theme"
                :label="tag.label"
                size="sm"
              />
            </slot>
          </span>
        </span>
        <!-- Where it stands against the clock, at the row's far end. It used to
             sit beside the time, which is where a reader scanning for "when" is
             looking — but a card gives the time a fixed column, and a badge in
             front of it pushes one row's time out of line with the rest. The
             card's right edge is the one other place a row is aligned. -->
        <Badge
          v-if="timing"
          :theme="timing.theme"
          :label="timing.label"
          size="sm"
          class="shrink-0"
        />
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
import { Badge } from '#components/Badge'
import EventModalContent from './EventModalContent.vue'
import { useEventBase } from './useEventBase'
import { useNow } from './composables/useNow'
import {
  hasEnded,
  rowDescription,
  rowTags,
  rowTimeLabel,
  rowTiming,
} from './eventRow'
import type { CalendarEvent } from './types'

const props = defineProps<{
  event: CalendarEvent
  /** The day the row belongs to; a multi-day event has one row per day. */
  date: Date
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
  markActive,
  handleEventClick,
  handleEventEdit,
  handleEventDelete,
  registerDeleteShortcut,
  unregisterDeleteShortcut,
} = useEventBase(props)

const isPopoverOpen = ref(false)

const timeLabel = computed(() =>
  rowTimeLabel(props.event, config.timeFormat, props.date),
)
const description = computed(() => rowDescription(props.event, props.date))
const tags = computed(() => rowTags(props.event, props.date, now.value))
const timing = computed(() => rowTiming(props.event, props.date, now.value))
const isPast = computed(() => hasEnded(props.event, props.date, now.value))

// An empty description line would still take its leading, so the row only
// grows one when there is something to put on it.
const hasDescription = computed(
  () => !!description.value || !!slots['event-description'],
)

const slotProps = computed(() => ({
  calendarEvent: calendarEvent.value,
  date: props.date,
  description: description.value,
  tags: tags.value,
  timing: timing.value,
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
  markActive()
  if (calendarActions.props.onClick)
    calendarActions.props.onClick({ e, calendarEvent: calendarEvent.value })
  else togglePopover()
}

function togglePopover() {
  isPopoverOpen.value = !isPopoverOpen.value
}
</script>
