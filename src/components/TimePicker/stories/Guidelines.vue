<script setup lang="ts">
import { ref } from 'vue'
import { TextInput, TimePicker } from 'frappe-ui'

// Card 1: LMS's batch and evaluator forms, and CRM's and Helpdesk's SLA work
// days, use the browser's time field. It looks different in every browser
// and can't list times or share TimePicker's format. Both sides are live.
const picked = ref('09:30')
const native = ref('09:30')

// Card 2: LMS shows a class as "2:00 PM - 14:30 PM", its start in 12-hour
// time and its end in 24-hour time with PM added. Pick one `format` and use
// it everywhere.
const classStart = ref('14:00')
const classEnd = ref('14:30')
const mixedStart = ref('14:00')
const mixedEnd = ref('14:30')

const row = 'flex items-center gap-3'
const labelClass = 'w-20 text-sm leading-tighter text-ink-gray-6'
</script>

<template>
  <div class="flex flex-col gap-8">
    <!-- 1. The same time in TimePicker and in the browser's time field. Open
         each to compare. -->
    <Guideline
      layout="stack"
      caption="Use TimePicker, not the browser's time field. It looks the same in every browser and lists times to pick from."
    >
      <template #do>
        <div :class="row">
          <span :class="labelClass" aria-hidden="true">Starts at</span>
          <TimePicker v-model="picked" class="w-40" aria-label="Starts at" />
        </div>
      </template>
      <template #dont>
        <div :class="row">
          <span :class="labelClass" aria-hidden="true">Starts at</span>
          <TextInput
            v-model="native"
            type="time"
            class="w-40"
            aria-label="Starts at"
          />
        </div>
      </template>
    </Guideline>

    <!-- 2. One clock for both ends of a range, and across the app. -->
    <Guideline
      layout="stack"
      caption="Use one clock, 12-hour or 24-hour, everywhere in the app."
    >
      <template #do>
        <div :class="row">
          <span :class="labelClass" aria-hidden="true">Class</span>
          <TimePicker
            v-model="classStart"
            class="w-32"
            format="h:mm A"
            aria-label="Class starts"
          />
          <span class="text-sm text-ink-gray-5">to</span>
          <TimePicker
            v-model="classEnd"
            class="w-32"
            format="h:mm A"
            aria-label="Class ends"
          />
        </div>
      </template>
      <template #dont>
        <div :class="row">
          <span :class="labelClass" aria-hidden="true">Class</span>
          <TimePicker
            v-model="mixedStart"
            class="w-32"
            format="h:mm A"
            aria-label="Class starts"
          />
          <span class="text-sm text-ink-gray-5">to</span>
          <TimePicker v-model="mixedEnd" class="w-32" aria-label="Class ends" />
        </div>
      </template>
    </Guideline>
  </div>
</template>
