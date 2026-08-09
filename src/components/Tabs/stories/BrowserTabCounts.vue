<script setup lang="ts">
import { ref } from 'vue'
import { Tabs, TabList, TabTrigger, Badge } from 'frappe-ui'

const tab = ref('contact')

const tabs = [
  { value: 'deals', label: 'Deals', count: '14' },
  { value: 'contact', label: 'Contact', count: '25' },
  { value: 'organizations', label: 'Organizations', count: '02' },
]
</script>

<template>
  <Tabs v-model="tab">
    <TabList variant="browser-tab">
      <TabTrigger
        v-for="t in tabs"
        :key="t.value"
        :value="t.value"
        :label="t.label"
      >
        <template #suffix>
          <Badge size="sm">{{ t.count }}</Badge>
        </template>
      </TabTrigger>
    </TabList>
  </Tabs>
</template>
