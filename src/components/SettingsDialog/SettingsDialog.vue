<template>
  <Dialog v-model="modelValue" :size="size" bare>
    <div class="flex" style="height: calc(100vh - 12rem)">
      <Sidebar class="w-52" :sections="sidebarSections" disable-collapse />
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
import type { SettingsDialogProps, SettingsTab } from './types'

const props = withDefaults(defineProps<SettingsDialogProps>(), {
  size: '4xl',
})

/** Controls whether the dialog is open. */
const modelValue = defineModel<boolean>({ default: false })

defineSlots<{
  /** Overrides the content area. Receives the active `{ tab }`. */
  'tab-content'?: (props: { tab: SettingsTab | undefined }) => any
}>()

const allItems = computed(() => props.sections.flatMap((s) => s.items))

const activeTab = shallowRef<SettingsTab | undefined>(allItems.value[0])

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
