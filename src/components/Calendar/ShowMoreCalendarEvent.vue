<template>
  <CalendarEvent
    :event="event"
    :date="date"
    :key="event.id"
    class="mb-1 cursor-pointer"
    v-bind="$attrs"
  />
  <span
    v-if="totalEventsCount > 1"
    class="w-fit rounded-sm p-px px-1.5 mx-1 text-base font-medium text-ink-gray-6 hover:cursor-pointer hover:bg-surface-gray-1"
    @click="emit('showMoreEvents')"
  >
    +{{ totalEventsCount - 1 }} more
  </span>
</template>
<script setup>
import CalendarEvent from './CalendarEvent.vue'

const props = defineProps({
  event: {
    type: Object,
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
