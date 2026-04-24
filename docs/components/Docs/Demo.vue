<script setup lang="ts">
import { ref } from 'vue'
import { TabButtons } from 'frappe-ui'

interface ComponentPreviewProps {
  name: string
  css?: string
  /**
   * `tabs` (default): preview and code in a tab switcher.
   * `stacked`: preview on top, code directly below — shown together.
   */
  layout?: 'tabs' | 'stacked'
}

const props = withDefaults(defineProps<ComponentPreviewProps>(), {
  layout: 'tabs',
})

const activeTab = ref('preview')

const previewTabs = [
  { label: 'Preview', value: 'preview' },
  { label: 'Code', value: 'code' },
]
</script>

<template>
  <div class="grid not-prose">
    <template v-if="props.layout === 'stacked'">
      <div
        class="rounded-xl overflow-hidden border border-outline-gray-1 divide-y divide-outline-gray-1"
      >
        <div
          :class="[
            'bg-surface-white p-8 overflow-auto scrollbar flex gap-3 items-center',
            css,
          ]"
        >
          <slot />
        </div>

        <div>
          <slot name="code" />
        </div>
      </div>
    </template>

    <template v-else>
      <TabButtons :buttons="previewTabs" v-model="activeTab" />
      <div class="mt-2 rounded-xl overflow-hidden border border-outline-gray-1">
        <div v-if="activeTab === 'preview'">
          <div
            :class="[
              'bg-surface-white p-8 overflow-auto scrollbar flex gap-3 items-center',
              css,
            ]"
          >
            <slot />
          </div>
        </div>

        <div v-else>
          <slot name="code" />
        </div>
      </div>
    </template>
  </div>
</template>
