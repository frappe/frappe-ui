<script setup lang="ts">
import { ref } from 'vue'
import { Tabs, TabList, TabTrigger, TabPanel } from 'frappe-ui'

const tab = ref('emails')

const tabs = [
  { value: 'activity', label: 'Activity', icon: 'lucide-activity' },
  { value: 'emails', label: 'Emails', icon: 'lucide-mail' },
  { value: 'calls', label: 'Calls', icon: 'lucide-phone' },
  { value: 'tasks', label: 'Tasks', icon: 'lucide-circle-check' },
  { value: 'notes', label: 'Notes', icon: 'lucide-file-text' },
  { value: 'files', label: 'Files', icon: 'lucide-file' },
]
</script>

<template>
  <div class="w-full max-w-2xl">
    <Tabs v-model="tab">
      <TabList variant="underline">
        <TabTrigger
          v-for="t in tabs"
          :key="t.value"
          :value="t.value"
          :label="t.label"
          :icon-left="t.icon"
        />
      </TabList>
      <TabPanel v-for="t in tabs" :key="t.value" :value="t.value">
        <div class="p-4 text-base text-ink-gray-7">
          {{ t.label }} content for this record shows up here.
        </div>
      </TabPanel>
    </Tabs>
  </div>
</template>
