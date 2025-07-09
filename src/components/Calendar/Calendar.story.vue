<template>
  <Story :layout="{ type: 'grid', width: '100%' }">
    <Variant title="default">
      <div class="flex h-screen flex-col overflow-hidden p-5">
        <Calendar
          :config="config"
          :events="events"
          @create="(event) => logEvent('createEvent', event)"
          @update="(event) => logEvent('updateEvent', event)"
          @delete="(eventID) => logEvent('deleteEvent', eventID)"
        >
        </Calendar>
      </div>
    </Variant>
    <Variant title="custom-header">
      <div class="flex h-screen flex-col overflow-hidden p-5">
        <Calendar
          :config="config"
          :events="events"
          @create="(event) => logEvent('createEvent', event)"
          @update="(event) => logEvent('updateEvent', event)"
          @delete="(eventID) => logEvent('deleteEvent', eventID)"
        >
          <template
            #header="{
              currentMonthYear,
              enabledModes,
              activeView,
              decrement,
              increment,
              updateActiveView,
            }"
          >
            <TabButtons
              :buttons="enabledModes"
              class="ml-2"
              :modelValue="activeView"
              @update:modelValue="updateActiveView($event)"
            />

            <button @click="decrement">Previous</button>
            <button @click="increment">Next</button>
            <h1>
              {{ currentMonthYear }}
            </h1>
          </template>
        </Calendar>
      </div>
    </Variant>
    <Variant title="custom-click-events">
      <div class="flex h-screen flex-col overflow-hidden p-5">
        <Calendar
          :config="config"
          :events="events"
          :onClick="(event) => logEvent('onClick', event)"
          :onDblClick="(event) => logEvent('onDblClick', event)"
          :onCellDblClick="(data) => logEvent('onCellDblClick', data)"
        >
        </Calendar>
      </div>
    </Variant>
  </Story>
</template>
<script setup>
import { ref } from 'vue'
import Calendar from './Calendar.vue'
import { logEvent } from 'histoire/client'
import { TabButtons } from '../TabButtons'

const config = {
  defaultMode: 'Month',
  isEditMode: true,
  eventIcons: {},
  allowCustomClickEvents: true,
  redundantCellHeight: 100,
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
    fromDate: currentMonthYear + '-02 16:30:00', //can be a date object
    toDate: currentMonthYear + '-02 17:30:00',
    color: 'violet',
  },
  {
    title: 'English by Ryan Mathew',
    participant: 'Ryan Mathew',
    id: 'EDU-CSH-2024-00092',
    venue: 'CNF-ROOM-2024-00002',
    fromDate: currentMonthYear + '-04 13:30:00',
    toDate: currentMonthYear + '-04 17:30:00',
    color: 'green',
  },
  {
    title: 'English by Sheldon',
    participant: 'Sheldon',
    id: 'EDU-CSH-2024-00093',
    venue: 'CNF-ROOM-2024-00001',
    fromDate: currentMonthYear + '-16 10:30:00',
    toDate: currentMonthYear + '-16 11:30:00',
    color: 'blue',
  },
  {
    title: 'English by Ryan Mathew',
    participant: 'Ryan Mathew',
    id: 'EDU-CSH-2024-00094',
    venue: 'CNF-ROOM-2024-00001',
    fromDate: currentMonthYear + '-21 16:30:00',
    toDate: currentMonthYear + '-21 17:30:00',
    color: 'red',
  },
  {
    title: 'Google Meet with John ',
    participant: 'John',
    id: '#htrht41',
    venue: 'Google Meet',
    fromDate: currentMonthYear + '-11 00:00:00',
    toDate: currentMonthYear + '-11 23:59:59',
    color: 'amber',
    isFullDay: true,
  },
  {
    title: 'Zoom Meet with Sheldon',
    participant: 'Sheldon',
    id: '#htrht42',
    venue: 'Google Meet',
    fromDate: currentMonthYear + '-07 00:00:00',
    toDate: currentMonthYear + '-07 23:59:59',
    color: 'amber',
    isFullDay: true,
  },
])
</script>
<style></style>
