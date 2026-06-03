<script setup lang="ts">
import type { SettingsSection } from 'frappe-ui'
import { Button, SettingsDialog } from 'frappe-ui'
import { ref } from 'vue'
import GeneralPanel from './panels/GeneralPanel.vue'
import MembersPanel from './panels/MembersPanel.vue'
import ProfilePanel from './panels/ProfilePanel.vue'

const open = ref(false)

const sections: SettingsSection[] = [
  {
    label: 'Account',
    items: [{ label: 'Profile', icon: 'lucide-circle-user', component: ProfilePanel }],
  },
  {
    label: 'Workspace',
    items: [
      { label: 'General', icon: 'lucide-settings', component: GeneralPanel },
      { label: 'Members', icon: 'lucide-users', component: MembersPanel },
    ],
  },
]
</script>

<template>
  <Button @click="open = true">Open settings</Button>
  <SettingsDialog v-model="open" :sections="sections" />
</template>
