<template>
  <div class="relative flex items-center">
    <div
      :class="[
        'absolute inset-y-0 left-0 flex items-center',
        textColor,
        prefixClasses,
      ]"
      v-if="$slots.prefix"
    >
      <slot name="prefix"> </slot>
    </div>
    <input
      ref="inputRef"
      :type="type"
      :placeholder="placeholder"
      :class="inputClasses"
      :disabled="disabled"
      :id="id"
      :value="modelValue"
      @input="handleChange"
      @change="handleChange"
      v-bind="attrs"
    />
    <div
      :class="[
        'absolute inset-y-0 right-0 flex items-center',
        textColor,
        suffixClasses,
      ]"
      v-if="$slots.suffix"
    >
      <slot name="suffix"> </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, useSlots, useAttrs, ref } from 'vue'
import type { TextInputTypes } from './types/TextInput'
import debounce from '../utils/debounce'

interface TextInputProps {
  type?: TextInputTypes
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'subtle' | 'outline'
  placeholder?: string
  disabled?: boolean
  id?: string
  modelValue?: string | number
  debounce?: number
}

const props = withDefaults(defineProps<TextInputProps>(), {
  type: 'text',
  size: 'sm',
  variant: 'subtle',
})

const emit = defineEmits(['update:modelValue'])

const slots = useSlots()
const attrs = useAttrs()

const inputRef = ref<HTMLInputElement | null>(null)

defineExpose({ el: inputRef })

const textColor = computed(() => {
  return props.disabled ? 'text-gray-600' : 'text-gray-800'
})

const inputClasses = computed(() => {
  let sizeClasses = {
    sm: 'text-base rounded h-7',
    md: 'text-base rounded h-8',
    lg: 'text-lg rounded-md h-10',
    xl: 'text-xl rounded-md h-10',
  }[props.size]

  let paddingClasses = {
    sm: [
      'py-1.5',
      slots.prefix ? 'pl-8' : 'pl-2',
      slots.suffix ? 'pr-8' : 'pr-2',
    ],
    md: [
      'py-1.5',
      slots.prefix ? 'pl-9' : 'pl-2.5',
      slots.suffix ? 'pr-9' : 'pr-2.5',
    ],
    lg: [
      'py-1.5',
      slots.prefix ? 'pl-10' : 'pl-3',
      slots.suffix ? 'pr-10' : 'pr-3',
    ],
    xl: [
      'py-1.5',
      slots.prefix ? 'pl-10' : 'pl-3',
      slots.suffix ? 'pr-10' : 'pr-3',
    ],
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
    textColor.value,
    'transition-colors w-full',
  ]
})

let prefixClasses = computed(() => {
  return {
    sm: 'pl-2',
    md: 'pl-2.5',
    lg: 'pl-3',
    xl: 'pl-3',
  }[props.size]
})

let suffixClasses = computed(() => {
  return {
    sm: 'pr-2',
    md: 'pr-2.5',
    lg: 'pr-3',
    xl: 'pr-3',
  }[props.size]
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
</script>
