<script setup lang="ts">
import { ref } from 'vue'
import {
  Button,
  SettingsBody,
  SettingsHeader,
  SettingsPanel,
  SettingsRow,
  Switch,
} from 'frappe-ui'

const publicProfile = ref(true)
const indexing = ref(false)
</script>

<template>
  <div class="h-96 w-full overflow-hidden rounded border border-outline-gray-2">
    <SettingsPanel>
      <SettingsHeader title="General" description="Workspace-wide preferences.">
        <template #actions>
          <Button variant="solid">Save</Button>
        </template>
      </SettingsHeader>
      <SettingsBody>
        <div class="divide-y divide-outline-gray-1">
          <SettingsRow
            title="Public profile"
            description="Allow others to view your workspace and its members."
          >
            <Switch v-model="publicProfile" />
          </SettingsRow>
          <SettingsRow
            title="Search indexing"
            description="Let search engines index public pages."
          >
            <Switch v-model="indexing" />
          </SettingsRow>
        </div>
      </SettingsBody>
    </SettingsPanel>
  </div>
</template>
