<template>
  <div
    class="flex h-full flex-col flex-shrink-0 overflow-y-auto overflow-x-hidden border-r border-outline-gray-1 bg-surface-menu-bar transition-all duration-300 ease-in-out p-2"
    :class="isCollapsed ? 'w-12' : 'w-60'"
  >
    <SidebarHeader
      v-if="props.header"
      :isCollapsed="isCollapsed"
      :title="props.header.title"
      :subtitle="props.header.subtitle"
      :logo="props.header.logo"
      :menu-items="props.header.menuItems"
    >
      <template #logo>
        <slot name="header-logo"></slot>
      </template>
    </SidebarHeader>

    <SidebarSection
      v-for="section in props.sections"
      :key="section.label"
      :label="section.label"
      :items="section.items"
      :collapsible="section.collapsible"
    />

    <div class="mt-auto flex flex-col gap-2">
      <slot name="footer-items" v-bind="{ isCollapsed, isMobile }"/>
      <SidebarItem
        :label="isCollapsed ? 'Expand' : 'Collapse'"
        :isCollapsed="isCollapsed"
        @click="isCollapsed = !isCollapsed"
      >
        <template #icon>
          <LucidePanelRightOpen
            class="size-4 text-ink-gray-6 duration-300 ease-in-out"
            :class="{ 'rotate-180': isCollapsed }"
          />
        </template>
      </SidebarItem>
    </div>
  </div>
</template>

<script setup lang="ts">
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'
import { provide, watch } from 'vue'
import SidebarHeader from './SidebarHeader.vue'
import SidebarItem from './SidebarItem.vue'
import { SidebarProps } from './types'

import LucidePanelRightOpen from '~icons/lucide/panel-right-open'
import SidebarSection from './SidebarSection.vue'

const props = defineProps<SidebarProps>()

const isCollapsed = defineModel('collapsed', {
  type: Boolean,
  default: false,
})
provide('isSidebarCollapsed', isCollapsed)

const breakpoints = useBreakpoints(breakpointsTailwind)
const isMobile = breakpoints.smaller('sm')
if (isMobile.value) {
  isCollapsed.value = true
}
watch(isMobile, () => {
  isCollapsed.value = isMobile.value
})
</script>
