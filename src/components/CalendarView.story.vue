<template>
  <Story :layout="{ type: 'grid', width: '95%' }">
    <Variant title="default">
      <div class="p-5">
        <CalendarView
          :config="config"
          :events="events"
          :create="(event) => logEvent('createEvent', event)"
          :update="(event) => logEvent('updateEvent', event)"
          :delete="(event) => logEvent('deleteEvent', event)"
        >
        </CalendarView>
      </div>
    </Variant>
    <Variant title="custom-header">
      <div class="p-5">
        <CalendarView
          :config="config"
          :events="events"
          @create="(event) => logEvent('createEvent', event)"
          @update="(event) => logEvent('updateEvent', event)"
          @delete="(event) => logEvent('deleteEvent', event)"
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
        </CalendarView>
      </div>
    </Variant>
    <Variant title="custom-click-events">
      <div class="p-5">
        <CalendarView
          :config="config"
          :events="events"
          :create="(event) => logEvent('createEvent', event)"
          :update="(event) => logEvent('updateEvent', event)"
          :delete="(event) => logEvent('deleteEvent', event)"
          :onClick="(event) => logEvent('onClick', event)"
          :onDblClick="(event) => logEvent('onDblClick', event)"
          :onCellDblClick="(data) => logEvent('onCellDblClick', data)"
        >
        </CalendarView>
      </div>
    </Variant>
  </Story>
</template>
<script setup>
import { ref } from 'vue'
import CalendarView from './CalendarView/CalendarView.vue'
import { logEvent } from 'histoire/client'
import TabButtons from './TabButtons.vue'

const activeView = ref('Week')

const config = {
  defaultMode: 'Week',
  isEditMode: true,
  eventIcons: {},
  allowCustomClickEvents: true,
}

const events = ref([
  {
    title: 'Maths by Sheldon',
    participant: 'Sheldon',
    id: 'EDU-CSH-2024-00013',
    venue: 'CNF-ROOM-2024-00002',
    date: '2024-07-01',
    from_time: '12:00:00',
    to_time: '13:00:00',
    color: 'pink',
  },
  {
    title: 'Maths by Sheldon',
    participant: 'Sheldon',
    id: 'EDU-CSH-2024-00014',
    venue: 'CNF-ROOM-2024-00002',
    date: '2024-07-02',
    from_time: '12:00:00',
    to_time: '13:00:00',
    color: 'purple',
  },
  {
    title: 'English by Ryan Mathew',
    participant: 'Ryan Mathew',
    id: 'EDU-CSH-2024-00001',
    venue: 'CNF-ROOM-2024-00001',
    date: '2024-07-07',
    from_time: '16:00:00',
    to_time: '17:00:00',
    color: 'violet',
  },
  {
    title: 'Maths by Sheldon',
    participant: 'Sheldon',
    id: 'EDU-CSH-2024-00115',
    venue: 'CNF-ROOM-2024-00002',
    date: '2024-07-05',
    from_time: '12:00:00',
    to_time: '13:00:00',
    color: 'blue',
  },
  {
    title: 'English by Ryan Mathew',
    participant: 'Ryan Mathew',
    id: 'EDU-CSH-2024-00002',
    venue: 'CNF-ROOM-2024-00001',
    date: '2024-07-05',
    from_time: '16:00:00',
    to_time: '17:00:00',
    color: 'cyan',
  },
  {
    title: 'English by Ryan Mathew',
    participant: 'Ryan Mathew',
    id: 'EDU-CSH-2024-00099',
    venue: 'CNF-ROOM-2024-00001',
    date: '2024-07-07',
    from_time: '16:30:00',
    to_time: '17:30:00',
    color: 'green',
  },
  {
    title: 'Google Meet with John ',
    date: '2024-07-21',
    participant: 'John',
    venue: 'Google Meet',
    color: 'amber',
    id: '#htrht4',
    isFullDay: true,
  },
])
</script>
<style></style>
