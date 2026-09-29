<script setup lang="ts">
import { ref } from 'vue'
import { Duration, TextInput } from 'frappe-ui'

// From LMS's live class and quiz forms: "Duration (in minutes)" is a number
// field, so a 1 hour 30 minute class has to be entered as 90. Duration takes
// 1h 30m, 90m or 1:30:00, and saves seconds. Both sides are live and hold the
// same length of time.
const seconds = ref<number | null>(5400)
const minutes = ref('90')

// Labels sit beside the fields, as in a settings row, so each row is one
// field tall and its mark lines up with the field. The visible text is
// repeated as aria-label, since a bare span doesn't name the field.
const row = 'flex items-center gap-3'
const labelClass = 'w-36 text-sm leading-tighter text-ink-gray-6'
</script>

<template>
  <div class="flex flex-col gap-8">
    <!-- 1. A number field with the unit in its label makes people convert
         hours to minutes themselves. -->
    <Guideline
      layout="stack"
      caption="Use Duration for a length of time, not a number field with the unit in its label."
    >
      <template #do>
        <div :class="row">
          <span :class="labelClass" aria-hidden="true">Duration</span>
          <Duration v-model="seconds" class="w-40" aria-label="Duration" />
        </div>
      </template>
      <template #dont>
        <div :class="row">
          <span :class="labelClass" aria-hidden="true">
            Duration (in minutes)
          </span>
          <TextInput
            v-model="minutes"
            type="number"
            class="w-40"
            aria-label="Duration (in minutes)"
          />
        </div>
      </template>
    </Guideline>
  </div>
</template>
