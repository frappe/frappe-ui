<script setup lang="ts">
import { reactive } from 'vue'
import { Tabs } from 'frappe-ui'

const state = reactive({
  index: 0,

  tabs: [
    {
      label: 'Home',
      content:
        'Welcome to the home tab. This is a simple example showing how tabs can be paired with icons to give each section a clear, scannable identity.',
      icon: 'lucide-house',
    },
    {
      label: 'Messages',
      content:
        'The messages tab groups all your conversations in one place. Use it to keep track of unread threads and pick up where you left off.',
      icon: 'lucide-message-circle',
    },
    {
      label: 'Settings',
      content:
        'Adjust your preferences in the settings tab — change your theme, manage notifications, and configure how the app behaves.',
      icon: 'lucide-settings',
    },
  ],
})
</script>

<template>
  <Tabs class="border rounded" v-model="state.index" :tabs="state.tabs">
    <template #tab-panel="{ tab }">
      <div class="p-5">{{ tab.content }}</div>
    </template>
  </Tabs>
</template>
