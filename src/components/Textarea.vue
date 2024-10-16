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
import debounce from '../utils/debounce'

interface TextareaProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'subtle' | 'outline'
  placeholder?: string
  disabled?: boolean
  id?: string
  modelValue?: string
  debounce?: number
  rows?: number
  label?: string
}

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
      'border border-gray-100 bg-gray-100 placeholder-gray-500 hover:border-gray-200 hover:bg-gray-200 focus:bg-white focus:border-gray-500 focus:shadow-sm focus:ring-0 focus-visible:ring-2 focus-visible:ring-gray-400',
    outline:
      'border border-gray-300 bg-white placeholder-gray-500 hover:border-gray-400 hover:shadow-sm focus:bg-white focus:border-gray-500 focus:shadow-sm focus:ring-0 focus-visible:ring-2 focus-visible:ring-gray-400',
    disabled: [
      'border bg-gray-50 placeholder-gray-400',
      props.variant === 'outline' ? 'border-gray-300' : 'border-transparent',
    ],
  }[variant]

  return [
    sizeClasses,
    paddingClasses,
    variantClasses,
    props.disabled ? 'text-gray-600' : 'text-gray-800',
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
    'text-gray-600',
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
