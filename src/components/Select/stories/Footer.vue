<script setup lang="ts">
import { ref } from 'vue'
import { Select } from 'frappe-ui'

const value = ref('')

// A long list so the viewport scrolls — the footer should stay pinned to the
// bottom of the popover instead of scrolling away with the options.
const timezones = [
  'UTC-12:00',
  'UTC-11:00',
  'UTC-10:00',
  'UTC-09:00',
  'UTC-08:00',
  'UTC-07:00',
  'UTC-06:00',
  'UTC-05:00',
  'UTC-04:00',
  'UTC-03:00',
  'UTC-02:00',
  'UTC-01:00',
  'UTC+00:00',
  'UTC+01:00',
  'UTC+02:00',
  'UTC+03:00',
  'UTC+04:00',
  'UTC+05:00',
  'UTC+05:30',
  'UTC+06:00',
  'UTC+07:00',
  'UTC+08:00',
  'UTC+09:00',
  'UTC+10:00',
  'UTC+11:00',
  'UTC+12:00',
]
</script>

<template>
  <div class="grid gap-3">
    <Select v-model="value" :options="timezones" placeholder="Pick a timezone">
      <template #footer="{ selectedOption, clearSelection }">
        <div
          class="flex items-center justify-between border-t border-outline-gray-1 px-3 py-2 text-sm text-ink-gray-5"
        >
          <span>{{ timezones.length }} timezones</span>
          <button
            v-if="selectedOption"
            class="text-ink-gray-7 hover:text-ink-gray-8"
            @click="clearSelection"
          >
            Clear
          </button>
          <span v-else class="text-ink-gray-7">Footer stays fixed</span>
        </div>
      </template>
    </Select>

    <div class="text-sm text-ink-gray-5">
      Selected: <code class="text-ink-gray-7">{{ value || 'None' }}</code>
    </div>
  </div>
</template>
