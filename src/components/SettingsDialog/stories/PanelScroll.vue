<script setup lang="ts">
import { TabsRoot } from 'reka-ui'
import {
  SettingsBody,
  SettingsHeader,
  SettingsPanel,
  SettingsRow,
  Switch,
} from 'frappe-ui'

const settings = Array.from({ length: 12 }, (_, i) => ({
  title: `Setting ${i + 1}`,
  description: 'Scroll the pane to see the divider under the header.',
}))
</script>

<template>
  <div
    class="h-96 w-full overflow-hidden rounded-4 border border-outline-gray-2"
  >
    <TabsRoot default-value="long" class="flex h-full">
      <SettingsPanel value="long">
        <SettingsHeader
          title="Profile"
          description="Your name, photo and contact details."
        />
        <SettingsBody>
          <div class="divide-y divide-outline-gray-1">
            <SettingsRow
              v-for="row in settings"
              :key="row.title"
              :title="row.title"
              :description="row.description"
            >
              <Switch />
            </SettingsRow>
          </div>
        </SettingsBody>
      </SettingsPanel>
    </TabsRoot>
  </div>
</template>
