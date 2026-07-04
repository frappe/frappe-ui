<template>
  <div class="w-80 rounded-lg bg-surface-elevation-2 text-ink-gray-8 p-4">
    <div class="flex flex-row-reverse gap-2">
      <span class="cursor-pointer" @click.stop="$emit('close')">
        <span class="lucide-x size-4" aria-hidden="true" />
      </span>
      <span
        v-if="isEditMode"
        class="cursor-pointer"
        @click.stop="$emit('edit')"
      >
        <span class="lucide-edit-2 size-4" aria-hidden="true" />
      </span>
      <span
        v-if="isEditMode"
        class="cursor-pointer"
        @click.stop="$emit('delete')"
      >
        <span class="lucide-trash-2 size-4" aria-hidden="true" />
      </span>
    </div>
    <div class="flex flex-col gap-5">
      <div class="flex justify-between text-2xl-semibold">
        <span>{{ calendarEvent.title || 'New Event' }}</span>
      </div>
      <div class="flex flex-col gap-4">
        <div class="flex items-center gap-2">
          <span class="lucide-calendar size-4" aria-hidden="true" />
          <span class="text-sm">
            {{ parseDateEventPopupFormat(date) }}
          </span>
        </div>
        <div class="flex items-center gap-2" v-if="calendarEvent.participant">
          <span class="lucide-user size-4" aria-hidden="true" />
          <span class="text-sm">
            {{ calendarEvent.participant }}
          </span>
        </div>
        <div
          class="flex items-center gap-2"
          v-if="calendarEvent.fromTime && calendarEvent.toTime"
        >
          <span class="lucide-clock size-4" aria-hidden="true" />
          <span class="text-sm">
            {{ calendarEvent.fromTime }} - {{ calendarEvent.toTime }}
          </span>
        </div>
        <div class="flex items-center gap-2" v-if="calendarEvent.venue">
          <span class="lucide-map-pin size-4" aria-hidden="true" />
          <span class="text-sm">
            {{ calendarEvent.venue }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { parseDateEventPopupFormat } from './calendarUtils'
import type { CalendarEvent } from './types'

const props = defineProps<{
  calendarEvent: CalendarEvent
  date: Date
  isEditMode?: boolean
}>()

const emits = defineEmits<{
  close: []
  edit: [event?: MouseEvent]
  delete: []
}>()
</script>
