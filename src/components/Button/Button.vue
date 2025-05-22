<template>
  <button
    v-bind="$attrs"
    :class="buttonClasses"
    @click="handleClick"
    :disabled="isDisabled"
    :ariaLabel="ariaLabel"
  >
    <LoadingIndicator
      v-if="loading"
      :class="{
        'h-3 w-3': size == 'sm',
        'h-[13.5px] w-[13.5px]': size == 'md',
        'h-[15px] w-[15px]': size == 'lg',
        'h-4.5 w-4.5': size == 'xl' || size == '2xl',
      }"
    />
    <slot name="prefix" v-else-if="$slots['prefix'] || iconLeft">
      <FeatherIcon
        v-if="iconLeft && typeof iconLeft === 'string'"
        :name="iconLeft"
        :class="slotClasses"
        aria-hidden="true"
      />
      <component v-else-if="iconLeft" :is="iconLeft" :class="slotClasses" />
    </slot>

    <template v-if="loading && loadingText">{{ loadingText }}</template>
    <template v-else-if="isIconButton && !loading">
      <FeatherIcon
        v-if="icon && typeof icon === 'string'"
        :name="icon"
        :class="slotClasses"
        :aria-label="label"
      />
      <component v-else-if="icon" :is="icon" :class="slotClasses" />
      <slot name="icon" v-else-if="$slots.icon" />
    </template>
    <span v-else :class="{ 'sr-only': isIconButton }" class="truncate">
      <slot>{{ label }}</slot>
    </span>

    <slot name="suffix">
      <FeatherIcon
        v-if="iconRight && typeof iconRight === 'string'"
        :name="iconRight"
        :class="slotClasses"
        aria-hidden="true"
      />
      <component v-else-if="iconRight" :is="iconRight" :class="slotClasses" />
    </slot>
  </button>
</template>
<script lang="ts" setup>
import { computed, useSlots } from 'vue'
import FeatherIcon from '../FeatherIcon.vue'
import LoadingIndicator from '../LoadingIndicator.vue'
import { useRouter } from 'vue-router'
import type { ButtonProps, ThemeVariant } from './types'

const props = withDefaults(defineProps<ButtonProps>(), {
  theme: 'gray',
  size: 'sm',
  variant: 'subtle',
  loading: false,
  disabled: false,
})

const slots = useSlots()
const router = useRouter()

const buttonClasses = computed(() => {
  let solidClasses = {
    gray: 'text-ink-white bg-surface-gray-7 hover:bg-surface-gray-6 active:bg-surface-gray-5',
    blue: 'text-ink-white bg-blue-500 hover:bg-surface-blue-3 active:bg-blue-700',
    green:
      'text-ink-white bg-surface-green-3 hover:bg-green-700 active:bg-green-800',
    red: 'text-ink-white bg-surface-red-5 hover:bg-surface-red-6 active:bg-surface-red-7',
  }[props.theme]

  let subtleClasses = {
    gray: 'text-ink-gray-8 bg-surface-gray-2 hover:bg-surface-gray-3 active:bg-surface-gray-4',
    blue: 'text-ink-blue-3 bg-surface-blue-2 hover:bg-blue-200 active:bg-blue-300',
    green:
      'text-green-800 bg-surface-green-2 hover:bg-green-200 active:bg-green-300',
    red: 'text-red-700 bg-surface-red-2 hover:bg-surface-red-3 active:bg-surface-red-4',
  }[props.theme]

  let outlineClasses = {
    gray: 'text-ink-gray-8 bg-surface-white bg-surface-white border border-outline-gray-2 hover:border-outline-gray-3 active:border-outline-gray-3 active:bg-surface-gray-4',
    blue: 'text-ink-blue-3 bg-surface-white border border-outline-blue-1 hover:border-blue-400 active:border-blue-400 active:bg-blue-300',
    green:
      'text-green-800 bg-surface-white border border-outline-green-2 hover:border-green-500 active:border-green-500 active:bg-green-300',
    red: 'text-red-700 bg-surface-white border border-outline-red-1 hover:border-outline-red-2 active:border-outline-red-2 active:bg-surface-red-3',
  }[props.theme]

  let ghostClasses = {
    gray: 'text-ink-gray-8 bg-transparent hover:bg-surface-gray-3 active:bg-surface-gray-4',
    blue: 'text-ink-blue-3 bg-transparent hover:bg-blue-200 active:bg-blue-300',
    green:
      'text-green-800 bg-transparent hover:bg-green-200 active:bg-green-300',
    red: 'text-red-700 bg-transparent hover:bg-surface-red-3 active:bg-surface-red-4',
  }[props.theme]

  let focusClasses = {
    gray: 'focus-visible:ring focus-visible:ring-outline-gray-3',
    blue: 'focus-visible:ring focus-visible:ring-blue-400',
    green: 'focus-visible:ring focus-visible:ring-outline-green-2',
    red: 'focus-visible:ring focus-visible:ring-outline-red-2',
  }[props.theme]

  let variantClasses = {
    subtle: subtleClasses,
    solid: solidClasses,
    outline: outlineClasses,
    ghost: ghostClasses,
  }[props.variant]

  let themeVariant: ThemeVariant = `${props.theme}-${props.variant}`

  let disabledClassesMap: Record<ThemeVariant, string> = {
    'gray-solid': 'bg-surface-gray-2 text-ink-gray-4',
    'gray-subtle': 'bg-surface-gray-2 text-ink-gray-4',
    'gray-outline':
      'bg-surface-gray-2 text-ink-gray-4 border border-outline-gray-2',
    'gray-ghost': 'text-ink-gray-4',

    'blue-solid': 'bg-blue-300 text-ink-white',
    'blue-subtle': 'bg-surface-blue-2 text-ink-blue-link',
    'blue-outline':
      'bg-surface-blue-2 text-ink-blue-link border border-outline-blue-1',
    'blue-ghost': 'text-ink-blue-link',

    'green-solid': 'bg-surface-green-2 text-ink-green-2',
    'green-subtle': 'bg-surface-green-2 text-ink-green-2',
    'green-outline':
      'bg-surface-green-2 text-ink-green-2 border border-outline-green-2',
    'green-ghost': 'text-ink-green-2',

    'red-solid': 'bg-surface-red-2 text-ink-red-2',
    'red-subtle': 'bg-surface-red-2 text-ink-red-2',
    'red-outline':
      'bg-surface-red-2 text-ink-red-2 border border-outline-red-1',
    'red-ghost': 'text-ink-red-2',
  }
  let disabledClasses = disabledClassesMap[themeVariant]

  let sizeClasses = {
    sm: 'h-7 text-base px-2 rounded',
    md: 'h-8 text-base font-medium px-2.5 rounded',
    lg: 'h-10 text-lg font-medium px-3 rounded-md',
    xl: 'h-11.5 text-xl font-medium px-3.5 rounded-lg',
    '2xl': 'h-13 text-2xl font-medium px-3.5 rounded-xl',
  }[props.size]

  if (isIconButton.value) {
    sizeClasses = {
      sm: 'h-7 w-7 rounded',
      md: 'h-8 w-8 rounded',
      lg: 'h-10 w-10 rounded-md',
      xl: 'h-11.5 w-11.5 rounded-lg',
      '2xl': 'h-13 w-13 rounded-xl',
    }[props.size]
  }

  return [
    'inline-flex items-center justify-center gap-2 transition-colors focus:outline-none',
    isDisabled.value ? disabledClasses : variantClasses,
    focusClasses,
    sizeClasses,
  ]
})

const slotClasses = computed(() => {
  let classes = {
    sm: 'h-4',
    md: 'h-4.5',
    lg: 'h-5',
    xl: 'h-6',
    '2xl': 'h-6',
  }[props.size]

  return classes
})

const isDisabled = computed(() => {
  return props.disabled || props.loading
})

const ariaLabel = computed(() => {
  return isIconButton.value ? props.label : null
})

const isIconButton = computed(() => {
  return props.icon || slots.icon
})

const handleClick = () => {
  if (props.route) {
    return router.push(props.route)
  } else if (props.link) {
    return window.open(props.link, '_blank')
  }
}
</script>
