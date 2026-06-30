<template>
  <label
    v-if="label || $slots.default"
    :id="id"
    :for="forId"
    data-slot="label"
    :class="labelClasses"
  >
    <slot v-if="$slots.default" :required="!!required" />
    <template v-else>
      {{ label }}
      <RequiredIndicator :required="required" />
    </template>
  </label>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import RequiredIndicator from './RequiredIndicator.vue'

const props = withDefaults(
  defineProps<{
    id: string
    forId?: string
    label?: string
    required?: boolean
    color?: 'gray-5' | 'gray-7'
  }>(),
  {
    color: 'gray-5',
  },
)

const labelClasses = computed(() => {
  return [
    'block text-base',
    props.color === 'gray-7' ? 'text-ink-gray-7' : 'text-ink-gray-5',
  ]
})
</script>
