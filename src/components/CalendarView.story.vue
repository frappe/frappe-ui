<template>
  <Story>
    <div class="h-full w-full flex-1 overflow-auto">
      <CalendarView
        :config="config"
        :events="events"
        @createEvent="createEvent"
        @updateEvent="updateEvent"
        @deleteEvent="deleteEvent"
      />
    </div>
  </Story>
</template>
<script setup>
import CalendarView from './CalendarView/CalendarView.vue'

const config = {
  defaultMode: 'Month',
  isEditMode: true,
}

const events = [
  {
    title: 'Maths by Sheldon',
    participant: 'Sheldon',
    id: 'EDU-CSH-2024-00013',
    venue: 'Room No: HTL-ROOM-2024-00002',
    date: '2024-05-01',
    from_time: '12:00:00',
    to_time: '13:00:00',
    color: 'pink',
  },
  {
    title: 'Maths by Sheldon',
    participant: 'Sheldon',
    id: 'EDU-CSH-2024-00014',
    venue: 'Room No: HTL-ROOM-2024-00002',
    date: '2024-05-02',
    from_time: '12:00:00',
    to_time: '13:00:00',
    color: 'purple',
  },
  {
    title: 'English by Ryan Mathew',
    participant: 'Ryan Mathew',
    id: 'EDU-CSH-2024-00001',
    venue: 'Room No: HTL-ROOM-2024-00001',
    date: '2024-05-05',
    from_time: '16:00:00',
    to_time: '17:00:00',
    color: 'violet',
  },
  {
    title: 'Maths by Sheldon',
    participant: 'Sheldon',
    id: 'EDU-CSH-2024-00115',
    venue: 'Room No: HTL-ROOM-2024-00002',
    date: '2024-05-05',
    from_time: '12:00:00',
    to_time: '13:00:00',
    color: 'blue',
  },
  {
    title: 'English by Ryan Mathew',
    participant: 'Ryan Mathew',
    id: 'EDU-CSH-2024-00002',
    venue: 'Room No: HTL-ROOM-2024-00001',
    date: '2024-05-06',
    from_time: '16:00:00',
    to_time: '17:00:00',
    color: 'cyan',
  },
  {
    title: 'English by Ryan Mathew',
    participant: 'Ryan Mathew',
    id: 'EDU-CSH-2024-00099',
    venue: 'Room No: HTL-ROOM-2024-00001',
    date: '2024-05-06',
    from_time: '16:30:00',
    to_time: '17:30:00',
    color: 'green',
  },
  {
    title: 'Google Meet with John ',
    date: '2024-05-21',
    participant: 'John',
    venue: 'Google Meet',
    color: 'amber',
    id: '#htrht4',
    isFullDay: true,
  },
]

function createEvent(event) {
  console.log('createEvent', event)
}

function updateEvent(event) {
  console.log('updateEvent', event)
}

function deleteEvent(event) {
  console.log('deleteEvent', event)
}
</script>
<style></style>
