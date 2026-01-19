<script setup>
import { ref } from 'vue'
import { Calendar } from 'frappe-ui'

const config = {
  defaultMode: 'Month',
  isEditMode: true,
  eventIcons: {},
  allowCustomClickEvents: true,
  enableShortcuts: false,
}

function getCurrentMonthYear() {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  return `${year}-${month}`
}

const currentMonthYear = getCurrentMonthYear()

const events = ref([
  {
    title: 'English by Ryan Mathew',
    participant: 'Ryan Mathew',
    id: 'EDU-CSH-2024-00091',
    venue: 'CNF-ROOM-2024-00001',
    fromDate: currentMonthYear + '-02',
    toDate: currentMonthYear + '-02',
    fromTime: '16:30',
    toTime: '17:30',
    color: 'violet',
  },
  {
    title: 'English by Ryan Mathew',
    participant: 'Ryan Mathew',
    id: 'EDU-CSH-2024-00092',
    venue: 'CNF-ROOM-2024-00002',
    fromDate: currentMonthYear + '-04',
    toDate: currentMonthYear + '-04',
    fromTime: '13:30',
    toTime: '17:30',
    color: 'green',
  },
  {
    title: 'English by Sheldon',
    participant: 'Sheldon',
    id: 'EDU-CSH-2024-00093',
    venue: 'CNF-ROOM-2024-00001',
    fromDate: currentMonthYear + '-16',
    toDate: currentMonthYear + '-16',
    fromTime: '10:30',
    toTime: '11:30',
    color: 'blue',
  },
  {
    title: 'English by Ryan Mathew',
    participant: 'Ryan Mathew',
    id: 'EDU-CSH-2024-00094',
    venue: 'CNF-ROOM-2024-00001',
    fromDate: currentMonthYear + '-21',
    toDate: currentMonthYear + '-21',
    fromTime: '16:30',
    toTime: '17:30',
    color: 'red',
  },
  {
    title: 'Google Meet with John ',
    participant: 'John',
    id: '#htrht41',
    venue: 'Google Meet',
    fromDate: currentMonthYear + '-11',
    toDate: currentMonthYear + '-11',
    fromTime: '00:00',
    toTime: '02:00',
    color: 'amber',
    isFullDay: true,
  },
  {
    title: 'Zoom Meet with Sheldon',
    participant: 'Sheldon',
    id: '#htrht42',
    venue: 'Google Meet',
    fromDate: currentMonthYear + '-07',
    toDate: currentMonthYear + '-07',
    fromTime: '00:00',
    toTime: '02:00',
    color: 'amber',
    isFullDay: true,
  },
])
</script>

<template>
  <Calendar
    :config="config"
    :events="events"
    @create="(event) => console.log('createEvent', event)"
    @update="(event) => console.log('updateEvent', event)"
    @delete="(eventID) => console.log('deleteEvent', eventID)"
  />
</template>
