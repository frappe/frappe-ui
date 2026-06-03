<script setup lang="ts">
import { Button, FormControl, SettingsPanel, Switch } from 'frappe-ui';
import { ref } from 'vue';

const orgName = ref('Frappe')
const publicProfile = ref(true)
</script>

<template>
  <div class="h-96 w-full overflow-hidden rounded border border-outline-gray-2">
    <SettingsPanel title="General" description="Workspace-wide preferences.">
      <template #actions>
        <Button variant="solid">Save</Button>
      </template>

      <FormControl label="Organization name" v-model="orgName" class="w-64" />
      <Switch label="Public profile" description="Allow others to view your workspace and its members." v-model="publicProfile" />
    </SettingsPanel>
  </div>
</template>
