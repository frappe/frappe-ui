<script setup lang="ts">
import { ref } from 'vue'
import { Tabs, TabList, TabTrigger, TabPanel } from 'frappe-ui'

const tab = ref('overview')
</script>

<template>
  <div class="w-full max-w-md">
    <Tabs v-model="tab">
      <TabList variant="underline">
        <TabTrigger value="overview" label="Overview" />
        <TabTrigger value="billing" label="Billing" disabled />
        <TabTrigger value="settings" label="Settings" />
      </TabList>
      <TabPanel value="overview">
        <div class="p-4 text-base text-ink-gray-7">Overview panel</div>
      </TabPanel>
      <TabPanel value="billing">
        <div class="p-4 text-base text-ink-gray-7">Billing panel</div>
      </TabPanel>
      <TabPanel value="settings">
        <div class="p-4 text-base text-ink-gray-7">Settings panel</div>
      </TabPanel>
    </Tabs>
  </div>
</template>
