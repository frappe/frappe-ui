<template>
  <div class="space-y-1.5">
    <label class="block" :class="labelClasses" v-if="label" :for="id">
      {{ label }}
    </label>
    <textarea
      ref="textareaRef"
      :placeholder="placeholder"
      :class="inputClasses"
      :disabled="disabled"
      :id="id"
      :value="modelValue"
      :rows="rows"
      @input="handleChange"
      @change="handleChange"
      v-bind="attrs"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, useAttrs, ref } from 'vue'
import debounce from '../../utils/debounce'
import type { TextareaProps } from './types'

const props = withDefaults(defineProps<TextareaProps>(), {
  type: 'text',
  size: 'sm',
  variant: 'subtle',
  rows: 3,
})

const emit = defineEmits(['update:modelValue'])
const attrs = useAttrs()
const textareaRef = ref<HTMLTextAreaElement | null>(null)

const inputClasses = computed(() => {
  let sizeClasses = {
    sm: 'text-base rounded',
    md: 'text-base rounded',
    lg: 'text-lg rounded-md',
    xl: 'text-xl rounded-md',
  }[props.size]

  let paddingClasses = {
    sm: ['py-1.5 px-2'],
    md: ['py-1.5 px-2.5'],
    lg: ['py-1.5 px-3'],
    xl: ['py-1.5 px-3'],
  }[props.size]

  let variant = props.disabled ? 'disabled' : props.variant
  let variantClasses = {
    subtle:
      'border border-[--surface-gray-2] bg-surface-gray-2 placeholder-ink-gray-4 hover:border-outline-gray-modals hover:bg-surface-gray-3 focus:bg-surface-white focus:border-outline-gray-4 focus:shadow-sm focus:ring-0 focus-visible:ring-2 focus-visible:ring-outline-gray-3',
    outline:
      'border border-outline-gray-2 bg-surface-white placeholder-ink-gray-4 hover:border-outline-gray-3 hover:shadow-sm focus:bg-surface-white focus:border-outline-gray-4 focus:shadow-sm focus:ring-0 focus-visible:ring-2 focus-visible:ring-outline-gray-3',
    disabled: [
      'border bg-surface-gray-1 placeholder-ink-gray-3',
      props.variant === 'outline'
        ? 'border-outline-gray-2'
        : 'border-transparent',
    ],
  }[variant]

  return [
    sizeClasses,
    paddingClasses,
    variantClasses,
    props.disabled ? 'text-ink-gray-5' : 'text-ink-gray-8',
    'transition-colors w-full block',
  ]
})

const labelClasses = computed(() => {
  return [
    {
      sm: 'text-xs',
      md: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
    }[props.size],
    'text-ink-gray-5',
  ]
})

let emitChange = (value: string) => {
  emit('update:modelValue', value)
}
if (props.debounce) {
  emitChange = debounce(emitChange, props.debounce)
}

let handleChange = (e: Event) => {
  emitChange((e.target as HTMLInputElement).value)
}

defineExpose({ el: textareaRef })
</script>
