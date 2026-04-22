<script setup lang="ts">
import { ref } from 'vue'
import { TabButtons } from 'frappe-ui'

interface ComponentPreviewProps {
  name: string
  css?: string
}

defineProps<ComponentPreviewProps>()
const activeTab = ref('preview')

const previewTabs = [
  { label: 'Preview', value: 'preview' },
  { label: 'Code', value: 'code' },
]
</script>

<template>
  <div class="grid not-prose -mx-1">
    <div class="p-1">
      <TabButtons :buttons="previewTabs" v-model="activeTab" />
    </div>
    <div class="mt-2 rounded-xl bg-surface-gray-1 p-1">
      <div v-if="activeTab === 'preview'">
        <div class="">
          <div
            :class="[
              'rounded-lg border border-outline-gray-2 bg-surface-white p-8 overflow-auto scrollbar flex gap-3 items-center',
              css,
            ]"
          >
            <slot />
          </div>
        </div>
      </div>

      <div v-else>
        <slot name="code" />
      </div>
    </div>
  </div>
</template>
