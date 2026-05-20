<script setup lang="ts">
import { ref } from 'vue'
import { Button } from 'frappe-ui'

interface ComponentPreviewProps {
  name: string
}

defineProps<ComponentPreviewProps>()

const expanded = ref(false)
</script>

<template>
  <div class="not-prose">
    <div
      class="rounded-xl overflow-hidden border border-outline-gray-1 divide-y divide-outline-gray-1"
    >
      <div
        class="bg-surface-white p-4 sm:p-8 overflow-x-auto scrollbar flex flex-wrap gap-3 items-center"
      >
        <slot />
      </div>

      <div class="component-preview-code relative">
        <div
          :class="[
            expanded
              ? ''
              : 'max-h-[80px] sm:max-h-[96px] overflow-hidden [&_.shiki]:!max-h-none [&_.shiki]:!overflow-hidden [&_.copy]:hidden',
          ]"
        >
          <slot name="code" />
        </div>

        <div
          v-if="!expanded"
          class="pointer-events-none absolute inset-0 bg-gradient-to-t from-surface-gray-1 via-surface-gray-1/70 to-transparent dark:from-surface-black dark:via-surface-black/70"
        />

        <div
          v-if="!expanded"
          class="absolute inset-0 flex items-center justify-center"
        >
          <Button variant="outline" @click="expanded = true">View Code</Button>
        </div>
      </div>
    </div>
  </div>
</template>
