<template>
  <div class="flex flex-col mt-2">
    <div
      v-if="props.label"
      class="relative flex items-center gap-1 px-2 py-1.5"
      :class="props.collapsible ? 'cursor-pointer' : ''"
      @click="props.collapsible ? (isCollapsed = !isCollapsed) : null"
    >
      <h3
        class="h-4 text-sm text-ink-gray-5 transition-all duration-300 ease-in-out"
        :class="
          isSidebarCollapsed
            ? 'w-0 overflow-hidden opacity-0'
            : 'w-auto opacity-100'
        "
      >
        {{ props.label }}
      </h3>
      <div v-if="props.collapsible">
        <LucideChevronRight
          v-if="!isSidebarCollapsed"
          class="w-4 h-4 text-ink-gray-5 transition-all duration-300 ease-in-out"
          :class="{ 'rotate-90': !isCollapsed }"
        />
      </div>
      <div
        v-if="isSidebarCollapsed"
        class="absolute top-0 left-0 flex h-full w-full items-center justify-center transition-all duration-300 ease-in-out"
        :class="isSidebarCollapsed ? 'opacity-100' : 'opacity-0'"
      >
        <hr class="w-full border-t border-ink-gray-3" />
      </div>
    </div>
    <transition
      enter-active-class="duration-300 ease-in"
      leave-active-class="duration-300 ease-[cubic-bezier(0, 1, 0.5, 1)]"
      enter-to-class="max-h-[200px] overflow-hidden"
      leave-from-class="max-h-[200px] overflow-hidden"
      enter-from-class="max-h-0 overflow-hidden"
      leave-to-class="max-h-0 overflow-hidden"
    >
      <nav v-if="!isCollapsed" class="space-y-0.5">
        <SidebarItem
          v-for="item in props.items"
          :key="item.label"
          :label="item.label"
          :icon="item.icon"
          :suffix="item.suffix"
          :to="item.to"
          :isActive="item.isActive"
          :isCollapsed="isSidebarCollapsed"
          :onClick="item.onClick"
        >
        </SidebarItem>
      </nav>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { inject, ref } from 'vue'
import SidebarItem from './SidebarItem.vue'
import { SidebarSectionProps } from './types'

const props = defineProps<SidebarSectionProps>()

const isSidebarCollapsed = inject('isSidebarCollapsed', false)
const isCollapsed = ref(false)
</script>
