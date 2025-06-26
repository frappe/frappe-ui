<template>
  <div
    class="flex h-full flex-col overflow-y-auto border-r bg-surface-menu-bar transition-all duration-300 ease-in-out"
    :class="isCollapsed ? 'w-12' : 'w-60'"
  >
    <div class="p-2">
      <SidebarHeader
        :isCollapsed="isCollapsed"
        :title="props.header.title"
        :subtitle="props.header.subtitle"
        :menu-items="props.header.menuItems"
      >
    </SidebarHeader>
    </div>
    <div class="flex-1 flex flex-col gap-2">
      <SidebarSection
        v-for="section in props.sections"
        :key="section.label"
        :label="section.label"
        :items="section.items"
        :collapsible="section.collapsible"
      />
    </div>
    <div class="p-2">
      <SidebarItem
        :label="isCollapsed ? 'Expand' : 'Collapse'"
        :isCollapsed="isCollapsed"
        @click="isCollapsed = !isCollapsed"
      >
        <template #icon>
          <span class="grid h-4 w-4 flex-shrink-0 place-items-center">
            <LucidePanelRightOpen
              class="size-4 text-ink-gray-6 duration-300 ease-in-out"
              :class="{ '[transform:rotateY(180deg)]': isCollapsed }"
            />
          </span>
        </template>
      </SidebarItem>
    </div>
  </div>
</template>

<script setup lang="ts">
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';
import { provide, ref, watchEffect } from 'vue';
import SidebarHeader from './SidebarHeader.vue';
import SidebarItem from './SidebarItem.vue';
import { SidebarProps } from './types';

import LucidePanelRightOpen from '~icons/lucide/panel-right-open';
import SidebarSection from './SidebarSection.vue';

const props = defineProps<SidebarProps>()

const isCollapsed = ref(false)
provide('isSidebarCollapsed', isCollapsed);

const breakpoints = useBreakpoints(breakpointsTailwind)
const isMobile = breakpoints.smaller('sm')
watchEffect(() => {
  isCollapsed.value = isMobile.value
})
</script>
