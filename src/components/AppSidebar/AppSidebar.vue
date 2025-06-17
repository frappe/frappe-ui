<template>
  <div
    class="flex h-full flex-col overflow-y-auto border-r bg-surface-menu-bar transition-all duration-300 ease-in-out"
    :class="isCollapsed ? 'w-12' : 'w-60'"
  >
    <div class="p-2">
      <AppSidebarHeader
        :isCollapsed="isCollapsed"
        :title="props.headerTitle"
        :subtitle="props.headerSubtitle"
      >
    </AppSidebarHeader>
    </div>
    <div class="flex-1">
      <template v-for="section in props.sidebarItems" :key="section.group">
        <div
          v-if="section.group"
          class="mt-3 flex items-center justify-between px-2 mb-1"
        >
          <h3
            class="px-2 py-1.5 text-sm text-ink-gray-5 transition-all duration-300 ease-in-out"
            :class="isCollapsed ? 'w-0 overflow-hidden opacity-0' : 'w-auto opacity-100'"
          >
            {{ section.group }}
          </h3>
        </div>
        <nav class="space-y-0.5 px-2">
          <AppSidebarItem
            v-for="item in section.items"
            :key="item.label"
            :label="item.label"
            :to="item.to"
            :isActive="item.isActive"
            :isCollapsed="isCollapsed"
            :onClick="item.label === 'Search' ? () => {} : undefined"
          >
            <template #icon>
              <component :is="item.icon" class="size-4 text-ink-gray-6" />
            </template>
            <template #suffix>
              <span v-if="item.label === 'Search'" class="!ml-auto text-sm text-ink-gray-4"> ⌘K </span>
            </template>
          </AppSidebarItem>
        </nav>
      </template>
    </div>
    <div class="p-2">
      <AppSidebarItem
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
      </AppSidebarItem>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import AppSidebarHeader from './AppSidebarHeader.vue';
import AppSidebarItem from './AppSidebarItem.vue';

import LucidePanelRightOpen from '~icons/lucide/panel-right-open';

const props = defineProps<{
  headerTitle: string;
  headerSubtitle: string;
  sidebarItems?: Array<{
    group: string;
    items: Array<{
      label: string;
      icon?: any; // Icon component
      to?: { name: string };
      isActive?: boolean;
      onClick?: () => void;
    }>;
  }>;
}>()

const isCollapsed = ref(false);
</script>
