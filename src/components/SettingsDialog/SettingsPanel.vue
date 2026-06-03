<template>
  <div class="flex h-full w-full flex-col overflow-y-auto p-8">
    <div class="flex items-start justify-between gap-4">
      <div class="flex flex-col gap-1">
        <h1 class="text-xl font-semibold text-ink-gray-9">{{ title }}</h1>
        <p v-if="description" class="text-p-base text-ink-gray-6">
          {{ description }}
        </p>
      </div>
      <div
        v-if="$slots.actions"
        class="flex flex-shrink-0 items-center gap-2"
      >
        <slot name="actions" />
      </div>
    </div>
    <div class="mt-6 flex flex-1 flex-col gap-6">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SettingsPanelProps } from './types'

defineProps<SettingsPanelProps>()

defineSlots<{
  /** Panel body — the settings controls for this tab. */
  default?: () => any
  /** Actions rendered on the right of the panel header. */
  actions?: () => any
}>()
</script>
