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
          class="flex items-center gap-1.5 py-3 text-base text-ink-gray-5 duration-300 ease-in-out hover:text-ink-gray-9"
          :class="[
            selected ? 'text-ink-gray-9' : '',
            vertical
              ? 'py-2 px-3'
              : 'border-b border-transparent hover:border-outline-gray-3',
          ]"
        >
          <component v-if="tab.icon" :is="tab.icon" class="size-4" />
          {{ tab.label }}
        </button>
      </slot>
    </Tab>
    <div
      v-if="!vertical"
      ref="indicator"
      class="tab-indicator absolute bottom-0 h-px bg-surface-gray-7"
      :class="transitionClass"
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
  indicator.value.style.width = `${selectedTab.offsetWidth}px`
  indicator.value.style.left = `${selectedTab.offsetLeft}px`
}

watch(tabIndex, (index) => {
  if (index >= tabsLength.value) {
    tabIndex.value = tabsLength.value - 1
  }
  if (vertical) return
  transitionClass.value = 'transition-all duration-300 ease-in-out'
  nextTick(() => moveIndicator(index))
})

onMounted(() => {
  if (vertical) return
  nextTick(() => moveIndicator(tabIndex.value))
  // Fix for indicator not moving on initial load
  setTimeout(() => moveIndicator(tabIndex.value), 100)
})
</script>
