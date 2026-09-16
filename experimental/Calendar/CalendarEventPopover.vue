<template>
  <!--
    The popover every drawn event opens — a grid pill, a month pill, an agenda
    row — so `#event-popover-content` behaves the same wherever an event is
    shown. Controlled rather than trigger-driven: a single click opens it only
    after a 200ms wait, so a double click can edit the event instead. Reka's
    trigger toggles on click with no such delay, so `update:open` is honoured
    only on the way down — Escape and outside-click still close it.
  -->
  <Popover
    :open="open"
    :side="side"
    align="center"
    @update:open="(value) => !value && emit('update:open', false)"
    @open="emit('open')"
    @close="emit('close')"
  >
    <template #trigger>
      <slot />
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
          :calendarEvent
          :date
          :isEditMode="config.isEditMode"
          @close="close"
          @edit="
            (e) => {
              close()
              emit('edit', e)
            }
          "
          @delete="
            () => {
              close()
              emit('delete')
            }
          "
        />
      </slot>
    </template>
  </Popover>
</template>

<script setup lang="ts">
import { inject } from 'vue'
import Popover from '#components/Popover/Popover.vue'
import type { PopoverSide } from '#components/Popover/types'
import EventModalContent from './EventModalContent.vue'
import { CALENDAR_CONFIG_KEY, type CalendarEvent } from './types'

defineProps<{
  open: boolean
  side: PopoverSide
  calendarEvent: CalendarEvent
  date: Date
}>()

const emit = defineEmits<{
  'update:open': [open: boolean]
  open: []
  close: []
  edit: [e: MouseEvent]
  delete: []
}>()

const config = inject(CALENDAR_CONFIG_KEY)!
</script>
