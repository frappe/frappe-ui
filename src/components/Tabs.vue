<template>
  <TabGroup
    as="div"
    class="flex flex-1 flex-col"
    :defaultIndex="changedIndex"
    :selectedIndex="changedIndex"
    @change="onTabChange"
  >
    <TabList class="relative flex items-center gap-6 border-b pl-5">
      <Tab
        ref="tabRef"
        as="template"
        v-for="(tab, i) in tabs"
        :key="i"
        v-slot="{ selected }"
        class="focus:outline-none focus:transition-none focus-visible:rounded focus-visible:ring-2 focus-visible:ring-gray-400"
      >
        <slot name="tab" v-bind="{ tab, selected }">
          <button
            class="-mb-px flex items-center gap-2 border-b border-transparent py-2.5 text-base text-gray-600 duration-300 ease-in-out hover:border-gray-400 hover:text-gray-900"
            :class="{ 'text-gray-900': selected }"
          >
            <component v-if="tab.icon" :is="tab.icon" class="h-5" />
            {{ tab.label }}
          </button>
        </slot>
      </Tab>
      <div
        ref="indicator"
        class="absolute -bottom-px h-px bg-gray-900"
        :style="{ left: `${indicatorLeftValue}px` }"
      />
    </TabList>
    <TabPanels class="flex flex-1 overflow-hidden">
      <TabPanel
        class="flex flex-1 flex-col overflow-y-auto focus:outline-none"
        v-for="(tab, i) in tabs"
        :key="i"
      >
        <slot v-bind="{ tab }" />
      </TabPanel>
    </TabPanels>
  </TabGroup>
</template>

<script setup>
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@headlessui/vue'
import { TransitionPresets, useTransition } from '@vueuse/core'
import { ref, watch, nextTick } from 'vue'

const props = defineProps({
  tabs: {
    type: Array,
    required: true,
  },
})

const changedIndex = defineModel({
  type: Number,
  default: 0,
})

const tabRef = ref([])
const indicator = ref(null)

let indicatorLeft = ref(0)

const indicatorLeftValue = useTransition(indicatorLeft, {
  duration: 250,
  ease: TransitionPresets.easeOutCubic,
})

function onTabChange(index) {
  const selectedTab = tabRef.value[index].el
  indicator.value.style.width = `${selectedTab.offsetWidth}px`
  indicatorLeft.value = selectedTab.offsetLeft
}

watch(
  changedIndex,
  (index) => {
    index && nextTick(() => onTabChange(index))
  },
  { immediate: true }
)
</script>
