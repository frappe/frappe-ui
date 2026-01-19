<script setup lang="ts">
import { ref } from 'vue'
import { Tabs } from 'frappe-ui'
import LucidePreview from '~icons/lucide/square-mouse-pointer'
import LucideCode from '~icons/lucide/code'

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
  <div class="grid gap-5 not-prose">
    <Tabs :tabs="tabs" v-model="state" class="[&>[role=tablist]]:border-0 [&>[role=tablist]]:gap-4 [&>[role=tablist]]:px-0">
      <template #tab-panel="{ tab }">
        <div
          v-if="tab.label === 'Preview'"
          :class='["border border-outline-gray-2 p-5 rounded overflow-auto scrollbar mt-3 flex gap-3 items-center", css]'
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
