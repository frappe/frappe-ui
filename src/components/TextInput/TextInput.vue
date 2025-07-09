<template>
  <div
    class="relative flex items-center"
    :class="attrs.class"
    :style="attrs.style"
  >
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
      :required="required"
      @input="handleChange"
      @change="handleChange"
      v-bind="attrsWithoutClassStyle"
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
import debounce from '../../utils/debounce'
import type { TextInputProps } from './types'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<TextInputProps>(), {
  type: 'text',
  size: 'sm',
  variant: 'subtle',
})

const emit = defineEmits(['update:modelValue'])

const slots = useSlots()
const attrs = useAttrs()

const attrsWithoutClassStyle = computed(() => {
  return Object.fromEntries(
    // class and style is passed to the root element
    Object.entries(attrs).filter(([key]) => key !== 'class' && key !== 'style'),
  )
})

const inputRef = ref<HTMLInputElement | null>(null)

defineExpose({ el: inputRef })

const textColor = computed(() => {
  return props.disabled ? 'text-ink-gray-5' : 'text-ink-gray-8'
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
    textColor.value,
    'transition-colors w-full dark:[color-scheme:dark]',
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
