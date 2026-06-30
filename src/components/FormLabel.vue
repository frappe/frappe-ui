<template>
  <label class="block text-base text-ink-gray-5" :for="id">
    {{ label }}
    <RequiredIndicator :required="required" />
  </label>
</template>
<script setup lang="ts">
import RequiredIndicator from './InputLabeling/RequiredIndicator.vue'

interface FormLabelProps {
  label: string
  size?: 'sm' | 'md'
  id?: string
  required?: boolean
}

withDefaults(defineProps<FormLabelProps>(), {
  size: 'sm',
})
</script>
