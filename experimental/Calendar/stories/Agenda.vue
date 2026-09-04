<script setup>
import { ref } from 'vue'
import { Calendar } from '..'
import { Badge } from '../../../src/components/Badge'

const config = {
  defaultMode: 'Agenda',
  isEditMode: true,
  enableShortcuts: false,
}

// Days relative to today, so the story reads the same whenever it is opened —
// and so the "starts at today" rule has something on either side of the line.
function day(offset) {
  const date = new Date()
  date.setDate(date.getDate() + offset)
  const month = String(date.getMonth() + 1).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${String(date.getDate()).padStart(2, '0')}`
}

const events = ref([
  {
    id: 'AG-1',
    title: 'Frappeverse Mock 2 – AV',
    venue: 'Hall 2',
    participant: '14 going',
    fromDate: day(0),
    toDate: day(0),
    fromTime: '12:00',
    toTime: '13:00',
    color: 'green',
  },
  {
    id: 'AG-2',
    title: 'Frappe Suite Standup',
    venue: 'Meet',
    fromDate: day(0),
    toDate: day(0),
    fromTime: '14:30',
    toTime: '15:30',
    color: 'green',
  },
  {
    id: 'AG-3',
    title: 'Untitled event',
    fromDate: day(0),
    toDate: day(0),
    isFullDay: true,
    isDraft: true,
    color: 'amber',
  },
  {
    id: 'AG-4',
    title: '1:1 with Faris',
    venue: 'Meet',
    fromDate: day(1),
    toDate: day(1),
    fromTime: '16:00',
    toTime: '16:30',
    color: 'amber',
  },
  // Nothing on days 2-3: the agenda collapses them into one line.
  {
    id: 'AG-5',
    title: 'Onsite sprint – Mumbai office',
    venue: 'BKC',
    fromDate: day(4),
    toDate: day(6),
    isFullDay: true,
    color: 'blue',
  },
  {
    id: 'AG-6',
    title: 'Fire Safety Training',
    participant: 'Invited · not responded',
    fromDate: day(4),
    toDate: day(4),
    fromTime: '13:45',
    toTime: '14:15',
    color: 'violet',
  },
])
</script>

<template>
  <div class="h-[600px]">
    <Calendar :events="events" :config="config">
      <!-- What the library cannot know: this app's own reading of an event. -->
      <template #event-suffix="{ tags, calendarEvent }">
        <Badge
          v-for="tag in tags"
          :key="tag.label"
          :theme="tag.theme"
          :label="tag.label"
          size="sm"
        />
        <Badge
          v-if="String(calendarEvent.participant).includes('not responded')"
          theme="amber"
          label="RSVP"
          size="sm"
        />
      </template>
    </Calendar>
  </div>
</template>
