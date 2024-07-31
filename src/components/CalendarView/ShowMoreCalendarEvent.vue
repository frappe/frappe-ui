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
    class="w-fit self-center rounded-sm p-[1px] text-sm font-bold text-gray-600 hover:cursor-pointer hover:bg-gray-200"
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
