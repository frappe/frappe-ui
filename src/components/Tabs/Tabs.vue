<template>
  <TabGroup
    v-bind="
      as !== 'template'
        ? {
            as,
            class: ['flex flex-1 overflow-hidden', vertical ? '' : 'flex-col '],
          }
        : {}
    "
    :defaultIndex="tabIndex"
    :selectedIndex="tabIndex"
    @change="(idx) => (tabIndex = idx)"
  >
    <slot>
      <TabList v-slot="{ tab, selected }">
        <slot name="tab-item" v-bind="{ tab, selected }" />
      </TabList>
      <TabPanel v-slot="{ tab }">
        <slot name="tab-panel" v-bind="{ tab }" />
      </TabPanel>
    </slot>
  </TabGroup>
</template>

<script setup>
import TabList from './TabList.vue'
import TabPanel from './TabPanel.vue'
import { TabGroup } from '@headlessui/vue'
import { computed, provide } from 'vue'

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

provide(
  'tab',
  computed(() => ({
    tabIndex,
    tabs: props.tabs,
    vertical: props.vertical,
  })),
)
</script>
