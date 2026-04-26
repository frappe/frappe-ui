<template>
  <label class="block" :class="labelClasses" :for="id">
    {{ label }}
    <RequiredIndicator :required="required" />
  </label>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import RequiredIndicator from './InputLabeling/RequiredIndicator.vue'

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
