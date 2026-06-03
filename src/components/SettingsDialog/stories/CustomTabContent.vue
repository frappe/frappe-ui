<script setup lang="ts">
import { ref } from 'vue'
import { Button, SettingsDialog } from 'frappe-ui'
import type { SettingsSection } from 'frappe-ui'

// Instead of per-item `component`s, render the content area yourself via the
// `#tab-content` slot. The slot receives the active `{ tab }`.
const open = ref(false)

const sections: SettingsSection[] = [
  {
    label: 'Preferences',
    items: [
      { label: 'Appearance', icon: 'lucide-palette' },
      { label: 'Notifications', icon: 'lucide-bell' },
      { label: 'Language', icon: 'lucide-languages' },
    ],
  },
]
</script>

<template>
  <Button @click="open = true">Open settings</Button>
  <SettingsDialog v-model="open" :sections="sections">
    <template #tab-content="{ tab }">
      <div class="p-6">
        <h2 class="text-lg font-semibold text-ink-gray-9">{{ tab?.label }}</h2>
        <p class="mt-1 text-base text-ink-gray-6">
          Custom content for the “{{ tab?.label }}” tab.
        </p>
      </div>
    </template>
  </SettingsDialog>
</template>
