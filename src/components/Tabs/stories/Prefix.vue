<script setup lang="ts">
import { ref } from 'vue'
import { Tabs, TabList, TabTrigger, TabPanel } from 'frappe-ui'

const tab = ref('open')

const tabs = [
  { value: 'open', label: 'Open', dot: 'bg-surface-green-5' },
  { value: 'pending', label: 'Pending', dot: 'bg-surface-amber-5' },
  { value: 'closed', label: 'Closed', dot: 'bg-surface-gray-5' },
]
</script>

<template>
  <div class="w-full max-w-md">
    <Tabs v-model="tab">
      <TabList variant="underline">
        <TabTrigger
          v-for="t in tabs"
          :key="t.value"
          :value="t.value"
          :label="t.label"
        >
          <template #prefix>
            <span class="size-2 rounded-full" :class="t.dot" />
          </template>
        </TabTrigger>
      </TabList>
      <TabPanel v-for="t in tabs" :key="t.value" :value="t.value">
        <div class="p-4 text-base text-ink-gray-7">
          {{ t.label }} tickets show up here.
        </div>
      </TabPanel>
    </Tabs>
  </div>
</template>
