<script setup lang="ts">
import { FormControl, SettingsPanel, Switch } from 'frappe-ui';
import { ref } from 'vue';

const orgName = ref('Frappe')
const publicProfile = ref(true)
</script>

<template>
  <SettingsPanel title="General" description="Workspace-wide preferences.">
    <FormControl label="Organization name" v-model="orgName" class="w-64" />
    <Switch
      label="Public Profile"
      description="Allow others to view your workspace and its members."
      v-model="publicProfile"
    />
  </SettingsPanel>
</template>
