<template>
  <Dropdown :options="props.menuItems">
    <template v-slot="{ open }">
      <button
        class="flex h-12 items-center rounded-md py-2 duration-300 ease-in-out w-[14rem]"
        :class="
          isCollapsed
            ? 'w-auto px-0'
            : open
              ? 'bg-surface-white px-2 shadow-sm'
              : 'px-2 hover:bg-surface-gray-3'
        "
      >
        <div class="w-8 h-8 rounded overflow-hidden">
          <slot name="logo">
            <img
              v-if="typeof props.logo === 'string'"
              :src="props.logo"
              class="w-full h-full object-cover"
              alt="Logo"
            />
            <div
              v-else-if="!props.logo"
              class="w-full h-full bg-surface-gray-4 flex items-center justify-center text-ink-gray-7"
            >
              {{ props.title.charAt(0).toUpperCase() }}
            </div>
            <component v-else :is="props.logo" class="w-full h-full" />
          </slot>
        </div>
        <div
          class="flex flex-1 flex-col text-left duration-300 ease-in-out truncate"
          :class="
            isCollapsed
              ? 'ml-0 w-0 overflow-hidden opacity-0'
              : 'ml-2 w-auto opacity-100'
          "
        >
          <div class="text-base font-medium text-ink-gray-8 leading-none">
            {{ props.title }}
          </div>
          <div class="mt-1 text-sm text-ink-gray-6 leading-none">
            {{ props.subtitle }}
          </div>
        </div>
        <div
          class="duration-300 ease-in-out"
          :class="
            isCollapsed
              ? 'ml-0 w-0 overflow-hidden opacity-0'
              : 'ml-2 w-auto opacity-100'
          "
        >
          <LucideChevronDown class="h-4 w-4 text-ink-gray-7" />
        </div>
      </button>
    </template>
  </Dropdown>
</template>

<script setup lang="ts">
import { inject } from 'vue'
import LucideChevronDown from '~icons/lucide/chevron-down'
import Dropdown from '../Dropdown/Dropdown.vue'
import { SidebarHeaderProps } from './types'

const props = defineProps<SidebarHeaderProps>()
const isCollapsed = inject('isSidebarCollapsed', false)
</script>
