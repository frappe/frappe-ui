<script setup lang="ts">
import { ref } from 'vue'
import { Tabs, TabList, TabTrigger, TabPanel } from 'frappe-ui'

const tab = ref('home')

const tabs = [
  { value: 'search', label: 'Search', icon: 'lucide-search' },
  { value: 'inbox', label: 'Inbox', icon: 'lucide-inbox' },
  { value: 'home', label: 'Home', icon: 'lucide-house' },
  { value: 'people', label: 'People', icon: 'lucide-users' },
  { value: 'settings', label: 'Settings', icon: 'lucide-settings' },
]
</script>

<template>
  <Tabs v-model="tab" vertical class="flex gap-4">
    <TabList variant="ghost">
      <TabTrigger
        v-for="t in tabs"
        :key="t.value"
        :value="t.value"
        :label="t.label"
        :icon="t.icon"
      />
    </TabList>
    <TabPanel v-for="t in tabs" :key="t.value" :value="t.value">
      <!-- Fixed width so the rail doesn't move when panel text changes. -->
      <div class="w-40 p-4 text-base text-ink-gray-7">{{ t.label }} panel</div>
    </TabPanel>
  </Tabs>
</template>
