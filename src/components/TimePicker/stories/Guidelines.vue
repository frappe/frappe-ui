<script setup lang="ts">
import { ref } from 'vue'
import { TimePicker } from 'frappe-ui'

// Separate models so interacting with one example doesn't move the others.
const withMessage = ref('20:00')
const withoutMessage = ref('20:00')
const separated = ref('09:30')
const runTogether = ref('09:30')
</script>

<template>
  <div class="flex flex-col gap-8">
    <!-- 1. Pair the error state with a message -->
    <Guideline
      layout="stack"
      caption="Always pair an error state with a message explaining what went wrong."
    >
      <template #do>
        <TimePicker
          v-model="withMessage"
          class="w-64"
          error="Choose a time within business hours (09:00–18:00)."
        >
          <template #prefix>
            <span class="lucide-clock size-4 text-ink-gray-5" />
          </template>
        </TimePicker>
      </template>
      <template #dont>
        <TimePicker v-model="withoutMessage" class="w-64">
          <template #prefix>
            <span class="lucide-clock size-4 text-ink-gray-5" />
          </template>
        </TimePicker>
      </template>
    </Guideline>

    <!-- 2. Clear separator in the time format -->
    <Guideline
      layout="stack"
      caption="Use a clear separator in the time format so the value is unambiguous."
    >
      <template #do>
        <TimePicker v-model="separated" class="w-64" format="HH:mm">
          <template #prefix>
            <span class="lucide-clock size-4 text-ink-gray-5" />
          </template>
        </TimePicker>
      </template>
      <template #dont>
        <TimePicker v-model="runTogether" class="w-64" format="HHmm">
          <template #prefix>
            <span class="lucide-clock size-4 text-ink-gray-5" />
          </template>
        </TimePicker>
      </template>
    </Guideline>
  </div>
</template>
