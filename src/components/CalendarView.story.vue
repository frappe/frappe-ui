<template>
  <Story>
    <div class="h-full w-full flex-1 overflow-auto">
      <CalendarView :config="config" :events="events" />
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
    date: '2024-02-01',
    from_time: '12:00:00',
    to_time: '13:00:00',
    color: null,
  },
  {
    title: 'Maths by Sheldon',
    participant: 'Sheldon',
    id: 'EDU-CSH-2024-00014',
    venue: 'Room No: HTL-ROOM-2024-00002',
    date: '2024-02-02',
    from_time: '12:00:00',
    to_time: '13:00:00',
    color: null,
  },
  {
    title: 'English by Ryan Mathew',
    participant: 'Ryan Mathew',
    id: 'EDU-CSH-2024-00001',
    venue: 'Room No: HTL-ROOM-2024-00001',
    date: '2024-02-05',
    from_time: '16:00:00',
    to_time: '17:00:00',
    color: null,
  },
  {
    title: 'Maths by Sheldon',
    participant: 'Sheldon',
    id: 'EDU-CSH-2024-00015',
    venue: 'Room No: HTL-ROOM-2024-00002',
    date: '2024-02-05',
    from_time: '12:00:00',
    to_time: '13:00:00',
    color: null,
  },
  {
    title: 'English by Ryan Mathew',
    participant: 'Ryan Mathew',
    id: 'EDU-CSH-2024-00002',
    venue: 'Room No: HTL-ROOM-2024-00001',
    date: '2024-02-06',
    from_time: '16:00:00',
    to_time: '17:00:00',
    color: 'cyan',
  },
]
</script>
<style></style>
