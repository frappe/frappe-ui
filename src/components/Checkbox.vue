<template>
  <div
    class="inline-flex items-center space-x-2 rounded transition"
    :class="{
      'px-2.5 py-1.5': padding && size === 'sm',
      'px-3 py-2': padding && size === 'md',
      'focus-within:bg-gray-100 focus-within:ring-2 focus-within:ring-gray-400 hover:bg-gray-200 active:bg-gray-300':
        padding && !disabled,
    }"
  >
    <input
      class="rounded-sm"
      :class="inputClasses"
      type="checkbox"
      :disabled="disabled"
      :id="htmlId"
      :checked="Boolean(modelValue)"
      @change="(e) => $emit('update:modelValue', (e.target as HTMLInputElement).checked)"
      v-bind="attrs"
    />
    <label class="block" :class="labelClasses" v-if="label" :for="htmlId">
      {{ label }}
    </label>
  </div>
</template>
<script lang="ts" setup>
import { computed, useAttrs } from 'vue'
import { useId } from '../utils/useId'

interface CheckboxProps {
  size?: 'sm' | 'md'
  label?: string
  checked?: boolean
  disabled?: boolean
  padding?: boolean
  modelValue?: boolean
  id?: string
}
const props = withDefaults(defineProps<CheckboxProps>(), {
  size: 'sm',
  padding: false,
})

const attrs = useAttrs()

const htmlId = props.id ?? useId()

const labelClasses = computed(() => {
  return [
    {
      sm: 'text-base font-medium',
      md: 'text-lg font-medium',
    }[props.size],
    props.disabled ? 'text-gray-500' : 'text-gray-800',
    'select-none',
  ]
})

const inputClasses = computed(() => {
  let baseClasses = props.disabled
    ? 'border-gray-300 bg-gray-50 text-gray-400'
    : 'border-gray-500 text-gray-900 hover:border-gray-600 focus:ring-offset-0 focus:border-gray-900 active:border-gray-700 transition'

  let interactionClasses = props.disabled
    ? ''
    : props.padding
    ? 'focus:ring-0'
    : 'hover:shadow-sm focus:ring-0 focus-visible:ring-2 focus-visible:ring-gray-400 active:bg-gray-100'

  let sizeClasses = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
  }[props.size]

  return [baseClasses, interactionClasses, sizeClasses]
})
</script>
