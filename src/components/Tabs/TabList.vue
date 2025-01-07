<template>
  <TabList
    class="relative flex"
    :class="
      vertical
        ? 'flex-col border-r overflow-y-auto'
        : 'gap-7.5 border-b overflow-x-auto items-center px-5'
    "
  >
    <Tab
      ref="tabRef"
      as="template"
      v-for="(tab, i) in tabs"
      :key="i"
      v-slot="{ selected }"
      class="focus:outline-none focus:transition-none"
    >
      <slot v-bind="{ tab, selected }">
        <button
          class="flex items-center gap-1.5 text-base text-ink-gray-5 duration-300 ease-in-out hover:text-ink-gray-9"
          :class="[
            selected ? 'text-ink-gray-9' : '',
            vertical
              ? 'py-2.5 px-4 border-r border-transparent hover:border-outline-gray-3'
              : 'py-3 border-b border-transparent hover:border-outline-gray-3',
          ]"
        >
          <component v-if="tab.icon" :is="tab.icon" class="size-4" />
          {{ tab.label }}
        </button>
      </slot>
    </Tab>
    <div
      ref="indicator"
      class="tab-indicator absolute bg-surface-gray-7"
      :class="[vertical ? 'right-0 w-px' : 'bottom-0 h-px', transitionClass]"
    />
  </TabList>
</template>
<script setup>
import { TabList, Tab } from '@headlessui/vue'
import { ref, watch, computed, onMounted, nextTick, inject } from 'vue'

const tabIndex = inject('tabIndex')
const tabs = inject('tabs')
const vertical = inject('vertical')

const tabRef = ref([])
const indicator = ref(null)
const tabsLength = computed(() => tabs.value?.length)

const transitionClass = ref('')

function moveIndicator(index) {
  if (index >= tabsLength.value) {
    index = tabsLength.value - 1
  }
  const selectedTab = tabRef.value[index].el
  if (vertical) {
    indicator.value.style.height = `${selectedTab.offsetHeight}px`
    indicator.value.style.top = `${selectedTab.offsetTop}px`
  } else {
    indicator.value.style.width = `${selectedTab.offsetWidth}px`
    indicator.value.style.left = `${selectedTab.offsetLeft}px`
  }
}

watch(tabIndex, (index) => {
  if (index >= tabsLength.value) {
    tabIndex.value = tabsLength.value - 1
  }
  transitionClass.value = 'transition-all duration-300 ease-in-out'
  nextTick(() => moveIndicator(index))
})

onMounted(() => {
  nextTick(() => moveIndicator(tabIndex.value))
  // Fix for indicator not moving on initial load
  setTimeout(() => moveIndicator(tabIndex.value), 100)
})
</script>
