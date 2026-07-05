<template>
  <CalendarMonthEvent
    v-for="event in events.slice(0, 2)"
    :key="event.id"
    :event="event"
    :date="date"
    class="mb-1 cursor-pointer"
    v-bind="$attrs"
  >
    <template #event-popover-content="slotProps">
      <slot name="event-popover-content" v-bind="slotProps" />
    </template>
  </CalendarMonthEvent>
  <button
    v-if="totalEventsCount > 2"
    class="w-fit rounded-sm p-px px-2 mx-px text-base-medium text-ink-gray-6 hover:bg-surface-gray-1"
    @click.stop="emit('showMoreEvents')"
  >
    {{ totalEventsCount - 2 }} more
  </button>
</template>
<script setup lang="ts">
import CalendarMonthEvent from './CalendarMonthEvent.vue'
import type { CalendarEvent } from './types'

const props = defineProps<{
  events: CalendarEvent[]
  date: Date
  totalEventsCount: number
}>()

const emit = defineEmits<{
  showMoreEvents: []
}>()
</script>
