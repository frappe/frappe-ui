<script setup lang="ts">
import { markRaw, ref } from 'vue'
import {
  Avatar,
  Button,
  SettingsContent,
  SettingsDialog,
  SettingsNavGroup,
  SettingsNavItem,
  SettingsPanel,
  SettingsSidebar,
} from 'frappe-ui'
import ProfilePanel from './panels/ProfilePanel.vue'
import PreferencesPanel from './panels/PreferencesPanel.vue'
import NotificationsPanel from './panels/NotificationsPanel.vue'
import UsersPanel from './panels/UsersPanel.vue'

const open = ref(false)

// Modeled on Gameplan's settings: grouped tabs, an avatar on the Profile tab,
// and panels that range from simple forms to a long, searchable user table.
const groups = [
  {
    label: 'User settings',
    tabs: [
      {
        label: 'Profile',
        value: 'profile',
        avatar: true,
        component: markRaw(ProfilePanel),
      },
      {
        label: 'Preferences',
        value: 'preferences',
        icon: 'lucide-sliders-horizontal',
        component: markRaw(PreferencesPanel),
      },
      {
        label: 'Notifications',
        value: 'notifications',
        icon: 'lucide-bell',
        component: markRaw(NotificationsPanel),
      },
    ],
  },
  {
    label: 'Administration',
    tabs: [
      {
        label: 'Users',
        value: 'users',
        icon: 'lucide-users',
        component: markRaw(UsersPanel),
      },
    ],
  },
]

const tabs = groups.flatMap((group) => group.tabs)
const activeTab = ref(tabs[0].value)
</script>

<template>
  <Button @click="open = true">Open settings</Button>
  <SettingsDialog v-model="open" v-model:tab="activeTab">
    <SettingsSidebar>
      <SettingsNavGroup
        v-for="group in groups"
        :key="group.label"
        :label="group.label"
      >
        <SettingsNavItem
          v-for="tab in group.tabs"
          :key="tab.value"
          :value="tab.value"
        >
          <template #prefix>
            <Avatar
              v-if="tab.avatar"
              size="xs"
              label="Alex Rivera"
              class="shrink-0"
            />
            <span
              v-else
              :class="[tab.icon, 'size-4 shrink-0 text-ink-gray-6']"
            />
          </template>
          {{ tab.label }}
        </SettingsNavItem>
      </SettingsNavGroup>
    </SettingsSidebar>
    <SettingsContent>
      <SettingsPanel v-for="tab in tabs" :key="tab.value" :value="tab.value">
        <component :is="tab.component" />
      </SettingsPanel>
    </SettingsContent>
  </SettingsDialog>
</template>
