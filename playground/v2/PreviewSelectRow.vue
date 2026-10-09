<script setup lang="ts">
// A row of the preview control (35537:171483): a 28px row, the 14/16
// gray-700 setting at its start and, at its end, the file's input-select —
// the library's Select at sm, subtle: 28px on gray-100, 8px corners, 8px
// in, the 14 gray-600 value and a 16px gray-600 chevron.
import { Select } from '../../src'

defineProps<{
  label: string
  options: { label: string; value: string }[]
}>()

const model = defineModel<string>({ required: true })
</script>

<template>
  <div class="v2-preview-row flex h-7 items-center justify-between gap-4">
    <span class="truncate text-base leading-4 text-ink-gray-7">{{
      label
    }}</span>
    <Select
      v-model="model"
      :options="options"
      size="sm"
      variant="subtle"
      class="v2-preview-select shrink-0"
      :aria-label="label"
    />
  </div>
</template>

<style>
/* the file's value and chevron are both gray-600 */
.v2-preview-select,
.v2-preview-select [data-slot='chevron'] {
  color: var(--ink-gray-6);
}
</style>
