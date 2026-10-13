<script setup lang="ts">
// A row of the preview control (35537:171483): a 28px row, the 14/16
// gray-700 setting at its start and the file's 26 × 16 switch at its end —
// the library's Switch at sm.
import { Switch } from '../../src'

defineProps<{ label: string; disabled?: boolean }>()

const model = defineModel<boolean>({ required: true })
</script>

<template>
  <div
    class="flex h-7 items-center justify-between gap-4"
    :class="disabled && 'opacity-50'"
  >
    <span class="truncate text-base leading-4 text-ink-gray-7">{{
      label
    }}</span>
    <Switch
      v-model="model"
      size="sm"
      :disabled="disabled"
      :aria-label="label"
      class="shrink-0"
    />
  </div>
</template>
