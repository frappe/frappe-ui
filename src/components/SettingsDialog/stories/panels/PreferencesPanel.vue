<script setup lang="ts">
import { ref } from 'vue'
import {
  SettingsBody,
  SettingsHeader,
  SettingsRow,
  Select,
  Switch,
} from 'frappe-ui'

const theme = ref('system')
const themeOptions = [
  { label: 'System', value: 'system' },
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' },
]

const badgeStyle = ref('count')
const badgeStyleOptions = [
  { label: 'Dot', value: 'dot' },
  { label: 'Count', value: 'count' },
]

const hideInactiveSpaces = ref(false)
</script>

<template>
  <SettingsHeader title="Preferences" />
  <SettingsBody>
    <div class="flex flex-col gap-8">
      <SettingsRow
        title="Appearance"
        description="Choose a light, dark, or system-matched interface."
      >
        <Select :options="themeOptions" v-model="theme" />
      </SettingsRow>

      <section>
        <h3 class="text-base font-semibold text-ink-gray-8">Sidebar</h3>
        <div class="mt-2 divide-y divide-outline-gray-1">
          <SettingsRow
            title="Unread badge"
            description="Show unread activity as a dot or a count."
          >
            <Select :options="badgeStyleOptions" v-model="badgeStyle" />
          </SettingsRow>
          <SettingsRow
            title="Inactive spaces"
            description="Hide spaces with no activity for the last 2 months."
          >
            <Switch v-model="hideInactiveSpaces" />
          </SettingsRow>
        </div>
      </section>
    </div>
  </SettingsBody>
</template>
