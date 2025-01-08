<template>
  <TabPanels class="flex flex-1 overflow-hidden">
    <TabPanel
      class="flex flex-1 flex-col overflow-y-auto focus:outline-none"
      v-for="(tab, i) in t.tabs"
      :key="i"
    >
      <slot v-bind="{ tab }" />
    </TabPanel>
  </TabPanels>
</template>
<script setup>
import { TabPanels, TabPanel } from '@headlessui/vue'
import { inject } from 'vue'

const t = inject('tab')
</script>
