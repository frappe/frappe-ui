<template>
  <Dialog v-model="modelValue" :size="size" bare>
    <div class="flex" style="height: calc(100vh - 12rem)">
      <Sidebar :sections="sidebarSections" disable-collapse />
      <div class="flex h-full flex-1 flex-col overflow-hidden">
        <slot name="tab-content" :tab="activeTab">
          <component v-if="activeTab?.component" :is="activeTab.component" />
        </slot>
      </div>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { computed, shallowRef } from 'vue'
import { Dialog } from '../Dialog'
import { Sidebar } from '../Sidebar'
import type { DialogSize } from '../Dialog/types'
import type { SettingsItem, SettingsSection } from './types'

const props = withDefaults(
  defineProps<{
    sections: SettingsSection[]
    title?: string
    size?: DialogSize
  }>(),
  {
    size: '4xl',
  },
)

const modelValue = defineModel<boolean>({ default: false })

const allItems = computed(() => props.sections.flatMap((s) => s.items))

const activeTab = shallowRef<SettingsItem | undefined>(allItems.value[0])

const sidebarSections = computed(() =>
  props.sections.map((section) => ({
    ...section,
    items: section.items.map((item) => ({
      ...item,
      isActive: activeTab.value?.label === item.label,
      onClick: () => {
        activeTab.value = item
        item.onClick?.()
      },
    })),
  })),
)
</script>
