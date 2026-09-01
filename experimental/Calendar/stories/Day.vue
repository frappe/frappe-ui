<script setup>
import { ref } from 'vue'
import { Calendar } from '..'

const config = {
  defaultMode: 'Day',
  isEditMode: true,
  enableShortcuts: false,
  scrollToHour: 9,
}

function today() {
  const date = new Date()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${String(date.getDate()).padStart(2, '0')}`
}

function tomorrow() {
  const date = new Date()
  date.setDate(date.getDate() + 1)
  const month = String(date.getMonth() + 1).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${String(date.getDate()).padStart(2, '0')}`
}

const events = ref([
  {
    id: 'D-1',
    title: 'Mural Painting – Frappeverse Mumbai 2026',
    fromDate: today(),
    toDate: today(),
    isFullDay: true,
    color: 'green',
  },
  // Two abreast: the column splits in half rather than one hiding the other.
  {
    id: 'D-2',
    title: 'Design review – meridiem check',
    participant: '2 participants',
    fromDate: today(),
    toDate: today(),
    fromTime: '11:00',
    toTime: '13:00',
    color: 'green',
  },
  {
    id: 'D-3',
    title: 'Volunteer Briefing',
    venue: 'Hall 2',
    participant: '14 going',
    fromDate: today(),
    toDate: today(),
    fromTime: '11:00',
    toTime: '12:00',
    color: 'blue',
  },
  // A long clear afternoon, then an event the grid scrolls past — the rail
  // shows it either way, and says which day it ends on.
  {
    id: 'D-4',
    title: 'Afterparty – Frappeverse',
    fromDate: today(),
    toDate: tomorrow(),
    fromTime: '23:00',
    toTime: '02:00',
    color: 'violet',
  },
])
</script>

<template>
  <div class="h-[600px]">
    <Calendar :events="events" :config="config" />
  </div>
</template>
