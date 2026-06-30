<script setup lang="ts">
import { ref } from 'vue'
import { TabsRoot } from 'reka-ui'
import {
  Select,
  SettingsBody,
  SettingsHeader,
  SettingsPanel,
  SettingsRow,
  Switch,
} from 'frappe-ui'

const digestEnabled = ref(true)
const frequency = ref('Weekly')
const frequencyOptions = [
  { label: 'Weekly', value: 'Weekly' },
  { label: 'Fortnightly', value: 'Fortnightly' },
  { label: 'Monthly', value: 'Monthly' },
]
</script>

<template>
  <!--
    SettingsPanel is a reka-ui tabpanel, so it needs a TabsRoot ancestor. In the
    full dialog SettingsDialog provides it; here we add a minimal one to show a
    single panel in isolation.
  -->
  <div class="h-96 w-full overflow-hidden rounded border border-outline-gray-2">
    <TabsRoot default-value="notifications" class="flex h-full">
      <SettingsPanel value="notifications">
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
          </div>
        </SettingsBody>
      </SettingsPanel>
    </TabsRoot>
  </div>
</template>
