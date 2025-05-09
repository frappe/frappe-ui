<template>
  <label class="block" :class="labelClasses" :for="id">
    {{ label }}
    <template v-if="required">
      <span class="text-ink-red-3 select-none" aria-hidden="true">*</span>
      <span class="sr-only">(required)</span>
    </template>
  </label>
</template>
<script setup lang="ts">
import { computed } from 'vue'

interface FormLabelProps {
  label: string
  size?: 'sm' | 'md'
  id?: string
  required?: boolean
}

const props = withDefaults(defineProps<FormLabelProps>(), {
  size: 'sm',
})

const labelClasses = computed(() => {
  return [
    {
      sm: 'text-xs',
      md: 'text-base',
    }[props.size],
    'text-ink-gray-5',
  ]
})
</script>
