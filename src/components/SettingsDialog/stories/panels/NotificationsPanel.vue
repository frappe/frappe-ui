<script setup lang="ts">
import { ref } from 'vue'
import {
  SettingsBody,
  SettingsHeader,
  SettingsRow,
  Select,
  Switch,
} from 'frappe-ui'

// A digest can be turned off entirely; the frequency / day rows only make sense
// when it's on, so they appear conditionally — a common settings pattern.
const digestEnabled = ref(true)

const frequency = ref('Weekly')
const frequencyOptions = [
  { label: 'Weekly', value: 'Weekly' },
  { label: 'Fortnightly', value: 'Fortnightly' },
  { label: 'Monthly', value: 'Monthly' },
]

const day = ref('Monday')
const dayOptions = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(
  (d) => ({
    label: d,
    value: d,
  }),
)
</script>

<template>
  <SettingsHeader title="Notifications" />
  <SettingsBody>
    <div class="divide-y divide-outline-gray-1">
      <SettingsRow
        title="Enable email digests"
        description="Send a summary of missed activity."
      >
        <Switch v-model="digestEnabled" />
      </SettingsRow>
      <SettingsRow
        v-if="digestEnabled"
        title="Digest frequency"
        description="Choose how often you receive your digest."
      >
        <Select :options="frequencyOptions" v-model="frequency" />
      </SettingsRow>
      <SettingsRow
        v-if="digestEnabled"
        title="Send on"
        description="Choose the weekday for your digest."
      >
        <Select :options="dayOptions" v-model="day" />
      </SettingsRow>
    </div>
  </SettingsBody>
</template>
