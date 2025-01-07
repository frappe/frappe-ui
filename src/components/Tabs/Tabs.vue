<template>
  <TabGroup
    v-bind="
      as == 'div'
        ? {
            as: 'div',
            class: vertical ? 'flex flex-1' : 'flex flex-1 flex-col',
          }
        : {}
    "
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
  vertical: {
    type: Boolean,
    default: false,
  },
})

const tabIndex = defineModel()

provide('tabIndex', tabIndex)
provide('tabs', props.tabs)
provide('vertical', props.vertical)
</script>
