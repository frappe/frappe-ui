<template>
  <SidebarItem :label="isCollapsed ? 'Expand' : 'Collapse'" @click="toggle">
    <template #prefix>
      <span
        class="lucide-panel-right-open size-4 text-ink-gray-6 transition-transform duration-300 ease-in-out"
        :class="{ 'rotate-180': isCollapsed }"
      />
    </template>
  </SidebarItem>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import SidebarItem from './SidebarItem.vue'
import { sidebarCollapsedKey, sidebarToggleKey } from './types'

const isCollapsed = inject(
  sidebarCollapsedKey,
  computed(() => false),
)
// No-op fallback keeps a standalone toggle from throwing outside a Sidebar.
const toggle = inject(sidebarToggleKey, () => {})
</script>
