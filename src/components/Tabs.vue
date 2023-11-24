<template>
  <TabGroup
    as="div"
    class="flex flex-1 flex-col"
    :defaultIndex="changedIndex"
    :selectedIndex="changedIndex"
    @change="(idx) => (changedIndex = idx)"
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
        :class="transitionClass"
        :style="{ left: `${indicatorLeft}px` }"
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
import { ref, watch, computed, onMounted, nextTick } from 'vue'

const props = defineProps({
  tabs: {
    type: Array,
    required: true,
  },
  modelValue: {
    type: Number,
    default: 0,
  },
  options: {
    type: Object,
    default: () => ({
      indicatorLeft: 20,
    }),
  },
})

const emit = defineEmits(['update:modelValue'])

const changedIndex = computed({
  get: () => props.modelValue,
  set: (index) => emit('update:modelValue', index),
})

const tabRef = ref([])
const indicator = ref(null)
const tabsLength = ref(props.tabs?.length)

const indicatorLeft = ref(props.options?.indicatorLeft)
const transitionClass = ref('')

function moveIndicator(index) {
  if (index >= tabsLength.value) {
    index = tabsLength.value - 1
  }
  const selectedTab = tabRef.value[index].el
  indicator.value.style.width = `${selectedTab.offsetWidth}px`
  indicatorLeft.value = selectedTab.offsetLeft
}

watch(changedIndex, (index) => {
  if (index >= tabsLength.value) {
    changedIndex.value = tabsLength.value - 1
  }
  nextTick(() => moveIndicator(index))
})

onMounted(() => {
  moveIndicator(changedIndex.value)
  nextTick(() => {
    transitionClass.value = 'transition-all duration-300 ease-in-out'
  })
})
</script>
