<script setup>
import { ref } from 'vue'
import { TabButtons } from 'frappe-ui'

const subtle = ref('home')
const underline = ref('home')
const browserLeft = ref('home')
const sidebar = ref('home')

const navButtons = [
  { label: 'Home', value: 'home', iconLeft: 'lucide-home' },
  { label: 'Task', value: 'task', iconLeft: 'lucide-list-checks' },
  { label: 'Contact', value: 'contact', iconLeft: 'lucide-contact' },
  { label: 'Others', value: 'others', iconLeft: 'lucide-globe' },
]

const iconButtons = [
  { label: 'Search', value: 'search', icon: 'lucide-search' },
  { label: 'Inbox', value: 'inbox', icon: 'lucide-inbox' },
  { label: 'Home', value: 'home', icon: 'lucide-home' },
  { label: 'Team', value: 'team', icon: 'lucide-users' },
  { label: 'Settings', value: 'settings', icon: 'lucide-settings' },
]
</script>

<template>
  <div class="flex items-start gap-10 p-2">
    <div class="flex flex-col gap-3">
      <div class="text-sm text-ink-gray-6">Subtle</div>
      <TabButtons v-model="subtle" :options="navButtons" vertical />
    </div>

    <div class="flex flex-col gap-3">
      <div class="text-sm text-ink-gray-6">Underline</div>
      <TabButtons
        v-model="underline"
        :options="navButtons"
        type="underline"
        vertical
      />
    </div>

    <div class="flex flex-col gap-3">
      <div class="text-sm text-ink-gray-6">Browser tab</div>
      <TabButtons
        v-model="browserLeft"
        :options="navButtons"
        type="browser-tab"
        vertical
        direction="left"
      />
    </div>

    <div class="flex flex-col gap-3">
      <div class="text-sm text-ink-gray-6">Icon sidebar</div>
      <TabButtons
        v-model="sidebar"
        :options="iconButtons"
        type="ghost"
        vertical
      />
    </div>
  </div>
</template>
