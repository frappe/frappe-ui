<script setup lang="ts">
import { ref } from 'vue'
import {
  FormControl,
  SettingsBody,
  SettingsHeader,
  SettingsPanel,
  SettingsRow,
  Switch,
} from 'frappe-ui'

const orgName = ref('Frappe')
const publicProfile = ref(true)
</script>

<template>
  <SettingsPanel>
    <SettingsHeader title="General" description="Workspace-wide preferences." />
    <SettingsBody>
      <div class="divide-y divide-outline-gray-1">
        <SettingsRow
          title="Organization name"
          description="Shown across the workspace."
        >
          <FormControl v-model="orgName" class="w-56" />
        </SettingsRow>
        <SettingsRow
          title="Public profile"
          description="Allow others to view your workspace and its members."
        >
          <Switch v-model="publicProfile" />
        </SettingsRow>
      </div>
    </SettingsBody>
  </SettingsPanel>
</template>
