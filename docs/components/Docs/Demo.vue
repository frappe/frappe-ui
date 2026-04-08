<script setup lang="ts">
import { Tabs } from 'frappe-ui'
import { ref } from 'vue'
import LucideCode from '~icons/lucide/code'
import LucidePreview from '~icons/lucide/square-mouse-pointer'

interface ComponentPreviewProps {
  name: string
  css?: string
}

defineProps<ComponentPreviewProps>()
const state = ref(0)

const tabs = [
  { label: 'Preview', icon: LucidePreview },
  { label: 'Code', icon: LucideCode },
]
</script>

<template>
  <div class="not-prose grid gap-5">
    <Tabs
      :tabs="tabs"
      v-model="state"
      class="[&>[role=tablist]]:gap-4 [&>[role=tablist]]:border-0 [&>[role=tablist]]:px-0"
    >
      <template #tab-panel="{ tab }">
        <div
          v-if="tab.label === 'Preview'"
          :class="[
            'scrollbar mt-3 flex items-center gap-3 overflow-auto rounded border border-outline-gray-2 p-5',
            css,
          ]"
        >
          <slot />
        </div>
        <div v-else class="mt-3">
          <slot name="code" />
        </div>
      </template>
    </Tabs>
  </div>
</template>
