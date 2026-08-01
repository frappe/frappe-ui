<template>
  <!--
    Adapter for `Sidebar`'s deprecated `sections` config prop, and the direct
    building block for collapsible groups: bind `v-model:collapsed` to own a
    section's state. Plain (non-collapsible) groups compose `SidebarLabel` +
    `SidebarItem` directly instead of this component.
  -->
  <div class="mt-2 flex flex-col">
    <div
      v-if="label"
      class="relative flex items-center gap-1 px-2 py-1.5"
      :class="collapsible ? 'cursor-pointer' : ''"
      @click="collapsible ? (isSectionCollapsed = !isSectionCollapsed) : null"
    >
      <h3
        class="h-4 text-sm text-ink-gray-5 transition-all duration-300 ease-in-out"
        :class="
          isSidebarCollapsed
            ? 'w-0 overflow-hidden opacity-0'
            : 'w-auto opacity-100'
        "
      >
        {{ label }}
      </h3>
      <div v-if="collapsible">
        <span
          v-if="!isSidebarCollapsed"
          class="lucide-chevron-right size-4 text-ink-gray-5 transition-all duration-300 ease-in-out"
          :class="{ 'rotate-90': !isSectionCollapsed }"
        />
      </div>
      <div
        v-if="isSidebarCollapsed"
        aria-hidden="true"
        class="absolute inset-0 flex items-center"
      >
        <hr class="w-full border-t border-ink-gray-3" />
      </div>
    </div>

    <transition
      enter-active-class="duration-300 ease-in"
      leave-active-class="duration-300 ease-[cubic-bezier(0,1,0.5,1)]"
      enter-to-class="max-h-[200px] overflow-hidden"
      leave-from-class="max-h-[200px] overflow-hidden"
      enter-from-class="max-h-0 overflow-hidden"
      leave-to-class="max-h-0 overflow-hidden"
    >
      <nav v-if="!isSectionCollapsed" class="flex flex-col gap-0.5">
        <template v-for="item in visibleItems" :key="item.label">
          <slot
            name="sidebar-item"
            :item="item"
            :isCollapsed="isSidebarCollapsed"
          >
            <SidebarItem
              :label="item.label"
              :accessKey="item.accessKey"
              :icon="item.icon"
              :suffix="item.suffix"
              :to="item.to"
              :isActive="item.isActive"
              :onClick="item.onClick"
            />
          </slot>
        </template>
      </nav>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, toValue } from 'vue'
import SidebarItem from './SidebarItem.vue'
import { SidebarSectionProps, sidebarCollapsedKey } from './types'

const props = defineProps<SidebarSectionProps>()

const isSidebarCollapsed = inject(
  sidebarCollapsedKey,
  computed(() => false),
)
// Per-section open/closed state for `collapsible` sections — distinct from the
// whole-sidebar collapse above. A model so apps can own it (start a section
// collapsed, persist the choice); left unbound it behaves as before — local
// state starting expanded.
const isSectionCollapsed = defineModel<boolean>('collapsed', { default: false })

const visibleItems = computed(() =>
  props.items.filter((item) => toValue(item.condition) !== false),
)
</script>
