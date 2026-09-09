<template>
  <label class="block text-sm text-ink-gray-6" :for="id">
    {{ label }}
    <RequiredIndicator :required="required" />
  </label>
</template>
<script setup lang="ts">
// Label type and colour are fixed: 13px, `ink-gray-6`. `FormLabel` used to
// carry its own `size` axis (12px `sm` / 14px `md`) while `InputLabel` — what
// `FormControl` actually renders through — was a flat 14px, so "the label
// size" had two answers and neither was the accepted one. With the size fixed
// the axis is degenerate, so it is gone rather than left as a no-op prop.
import RequiredIndicator from '../InputLabeling/RequiredIndicator.vue'
import type { FormLabelProps } from './types'

defineProps<FormLabelProps>()
</script>
