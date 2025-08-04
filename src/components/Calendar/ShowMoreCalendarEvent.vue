<template>
  <CalendarEvent
    v-for="event in events.slice(0, 2)"
    :key="event.id"
    :event="event"
    :date="date"
    class="mb-1 cursor-pointer"
    v-bind="$attrs"
  />
  <span
    v-if="totalEventsCount > 2"
    class="w-fit rounded-sm p-px px-2 mx-px text-base font-medium text-ink-gray-6 hover:cursor-pointer hover:bg-surface-gray-1"
    @click="emit('showMoreEvents')"
  >
    {{ totalEventsCount - 2 }} more
  </span>
</template>
<script setup>
import CalendarEvent from './CalendarEvent.vue'

const props = defineProps({
  events: {
    type: Array,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  totalEventsCount: {
    type: Number,
    required: true,
  },
})

const emit = defineEmits(['showMoreEvents'])
</script>
<style></style>
