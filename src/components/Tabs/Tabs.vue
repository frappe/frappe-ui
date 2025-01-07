<template>
  <TabGroup
    v-bind="as == 'div' ? { as: 'div', class: 'flex flex-col flex-1' } : {}"
    :defaultIndex="tabIndex"
    :selectedIndex="tabIndex"
    @change="(idx) => (tabIndex = idx)"
  >
    <slot>
      <TabList>
        <slot name="tab-item" />
      </TabList>
      <TabPanel>
        <slot name="tab-panel" />
      </TabPanel>
    </slot>
  </TabGroup>
</template>

<script setup>
import TabList from './TabList.vue'
import TabPanel from './TabPanel.vue'
import { TabGroup } from '@headlessui/vue'
import { provide } from 'vue'

const props = defineProps({
  as: {
    type: String,
    default: 'template',
  },
  tabs: {
    type: Array,
    required: true,
  },
})

const tabIndex = defineModel()

provide('tabIndex', tabIndex)
provide('tabs', props.tabs)
</script>
