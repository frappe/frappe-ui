<script setup>
import { ref } from 'vue'
import { TabButtons } from 'frappe-ui'

const timeFormat = ref('12hrs')
const startDay = ref('sunday')

const timeFormats = [
  { label: '12hrs', value: '12hrs' },
  { label: '24hrs', value: '24hrs' },
]

const startDays = [
  { label: 'Sunday', value: 'sunday' },
  { label: 'Monday', value: 'monday' },
]
</script>

<template>
  <div class="w-full max-w-lg">
    <h3 class="text-lg font-semibold text-ink-gray-9">General</h3>
    <div class="mt-2 divide-y divide-outline-gray-1">
      <div class="flex items-center justify-between gap-4 py-3">
        <div>
          <div class="text-base font-medium text-ink-gray-8">Time format</div>
          <div class="mt-1 text-base text-ink-gray-6">
            Choose the way times are displayed
          </div>
        </div>
        <TabButtons v-model="timeFormat" :options="timeFormats" />
      </div>
      <div class="flex items-center justify-between gap-4 py-3">
        <div>
          <div class="text-base font-medium text-ink-gray-8">Start day</div>
          <div class="mt-1 text-base text-ink-gray-6">
            Choose what day the calendar week should start
          </div>
        </div>
        <TabButtons v-model="startDay" :options="startDays" />
      </div>
    </div>
  </div>
</template>
