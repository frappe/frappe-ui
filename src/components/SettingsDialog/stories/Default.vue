<script setup lang="ts">
import { markRaw, ref } from 'vue'
import {
  Button,
  SettingsContent,
  SettingsDialog,
  SettingsNavGroup,
  SettingsNavItem,
  SettingsSidebar,
} from 'frappe-ui'
import GeneralPanel from './panels/GeneralPanel.vue'
import MembersPanel from './panels/MembersPanel.vue'
import ProfilePanel from './panels/ProfilePanel.vue'

const open = ref(false)

const groups = [
  {
    label: 'Account',
    tabs: [
      {
        label: 'Profile',
        icon: 'lucide-circle-user',
        component: markRaw(ProfilePanel),
      },
    ],
  },
  {
    label: 'Workspace',
    tabs: [
      {
        label: 'General',
        icon: 'lucide-settings',
        component: markRaw(GeneralPanel),
      },
      {
        label: 'Members',
        icon: 'lucide-users',
        component: markRaw(MembersPanel),
      },
    ],
  },
]

const activeTab = ref(groups[0].tabs[0])
</script>

<template>
  <Button @click="open = true">Open settings</Button>
  <SettingsDialog v-model="open">
    <SettingsSidebar>
      <SettingsNavGroup
        v-for="group in groups"
        :key="group.label"
        :label="group.label"
      >
        <SettingsNavItem
          v-for="tab in group.tabs"
          :key="tab.label"
          :active="activeTab.label === tab.label"
          @click="activeTab = tab"
        >
          <template #prefix>
            <span :class="[tab.icon, 'size-4 text-ink-gray-6']" />
          </template>
          {{ tab.label }}
        </SettingsNavItem>
      </SettingsNavGroup>
    </SettingsSidebar>
    <SettingsContent>
      <component :is="activeTab.component" />
    </SettingsContent>
  </SettingsDialog>
</template>
