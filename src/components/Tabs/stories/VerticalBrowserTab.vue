<script setup lang="ts">
import { ref } from 'vue'
import { Tabs, TabList, TabTrigger, TabPanel } from 'frappe-ui'

const left = ref('inbox')
const right = ref('inbox')

const tabs = [
  { value: 'inbox', label: 'Inbox' },
  { value: 'drafts', label: 'Drafts' },
  { value: 'archive', label: 'Archive' },
]
</script>

<template>
  <div class="flex items-start gap-10 p-2">
    <div class="flex flex-col gap-3">
      <div class="text-sm text-ink-gray-6">Attached left</div>
      <Tabs v-model="left" vertical class="flex">
        <TabList variant="browser-tab" side="left">
          <TabTrigger
            v-for="t in tabs"
            :key="t.value"
            :value="t.value"
            :label="t.label"
          />
        </TabList>
        <TabPanel v-for="t in tabs" :key="t.value" :value="t.value">
          <div class="w-32 p-4 text-base text-ink-gray-7">{{ t.label }} panel</div>
        </TabPanel>
      </Tabs>
    </div>

    <div class="flex flex-col gap-3">
      <div class="text-sm text-ink-gray-6">Attached right</div>
      <Tabs v-model="right" vertical class="flex">
        <TabPanel v-for="t in tabs" :key="t.value" :value="t.value">
          <div class="w-32 p-4 text-base text-ink-gray-7">{{ t.label }} panel</div>
        </TabPanel>
        <TabList variant="browser-tab" side="right">
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
