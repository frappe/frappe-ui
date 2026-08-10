<script setup lang="ts">
import { ref } from 'vue'
import { Tabs, TabList, TabTrigger } from 'frappe-ui'

const smTab = ref('all')
const mdTab = ref('all')

const tabs = [
  { value: 'all', label: 'All' },
  { value: 'events', label: 'Events' },
  { value: 'tasks', label: 'Tasks' },
]
</script>

<template>
  <div class="flex flex-col gap-5 p-2">
    <div class="flex items-center gap-6">
      <div class="w-16 text-sm text-ink-gray-6">Small</div>
      <Tabs v-model="smTab">
        <TabList variant="subtle" size="sm">
          <TabTrigger
            v-for="t in tabs"
            :key="t.value"
            :value="t.value"
            :label="t.label"
          />
        </TabList>
      </Tabs>
    </div>
    <div class="flex items-center gap-6">
      <div class="w-16 text-sm text-ink-gray-6">Medium</div>
      <Tabs v-model="mdTab">
        <TabList variant="subtle" size="md">
          <TabTrigger
            v-for="t in tabs"
            :key="t.value"
            :value="t.value"
            :label="t.label"
          />
        </TabList>
      </Tabs>
    </div>
  </div>
</template>
