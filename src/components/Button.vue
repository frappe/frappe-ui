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
        v-if="iconLeft"
        :name="iconLeft"
        :class="slotClasses"
        aria-hidden="true"
      />
    </slot>

    <template v-if="loading && loadingText">{{ loadingText }}</template>
    <template v-else-if="isIconButton && !loading">
      <FeatherIcon
        v-if="icon"
        :name="icon"
        :class="slotClasses"
        :aria-label="label"
      />
      <slot name="icon" v-else-if="$slots.icon" />
    </template>
    <span v-else :class="{ 'sr-only': isIconButton }">
      <slot>{{ label }}</slot>
    </span>

    <slot name="suffix">
      <FeatherIcon
        v-if="iconRight"
        :name="iconRight"
        :class="slotClasses"
        aria-hidden="true"
      />
    </slot>
  </button>
</template>
<script lang="ts" setup>
import { computed, useSlots } from 'vue'
import FeatherIcon from './FeatherIcon.vue'
import LoadingIndicator from './LoadingIndicator.vue'
import { useRouter } from 'vue-router'

interface ButtonProps {
  theme?: 'gray' | 'blue' | 'green' | 'red'
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  variant?: 'solid' | 'subtle' | 'outline' | 'ghost'
  label?: string
  icon?: string
  iconLeft?: string
  iconRight?: string
  loading?: boolean
  loadingText?: string
  disabled?: boolean
  route?: string | object
  link?: string
}

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
    gray: 'text-white bg-gray-900 hover:bg-gray-800 active:bg-gray-700',
    blue: 'text-white bg-blue-500 hover:bg-blue-600 active:bg-blue-700',
    green: 'text-white bg-green-600 hover:bg-green-700 active:bg-green-800',
    red: 'text-white bg-red-600 hover:bg-red-700 active:bg-red-800',
  }[props.theme]

  let subtleClasses = {
    gray: 'text-gray-800 bg-gray-100 hover:bg-gray-200 active:bg-gray-300',
    blue: 'text-blue-600 bg-blue-100 hover:bg-blue-200 active:bg-blue-300',
    green: 'text-green-800 bg-green-100 hover:bg-green-200 active:bg-green-300',
    red: 'text-red-700 bg-red-100 hover:bg-red-200 active:bg-red-300',
  }[props.theme]

  let outlineClasses = {
    gray: 'text-gray-800 bg-white border border-gray-300 hover:border-gray-400 active:border-gray-400 active:bg-gray-300',
    blue: 'text-blue-600 bg-white border border-blue-300 hover:border-blue-400 active:border-blue-400 active:bg-blue-300',
    green:
      'text-green-800 bg-white border border-green-400 hover:border-green-500 active:border-green-500 active:bg-green-300',
    red: 'text-red-700 bg-white border border-red-300 hover:border-red-400 active:border-red-400 active:bg-red-200',
  }[props.theme]

  let ghostClasses = {
    gray: 'text-gray-800 bg-transparent hover:bg-gray-200 active:bg-gray-300',
    blue: 'text-blue-600 bg-transparent hover:bg-blue-200 active:bg-blue-300',
    green:
      'text-green-800 bg-transparent hover:bg-green-200 active:bg-green-300',
    red: 'text-red-700 bg-transparent hover:bg-red-200 active:bg-red-300',
  }[props.theme]

  let focusClasses = {
    gray: 'focus-visible:ring focus-visible:ring-gray-400',
    blue: 'focus-visible:ring focus-visible:ring-blue-400',
    green: 'focus-visible:ring focus-visible:ring-green-400',
    red: 'focus-visible:ring focus-visible:ring-red-400',
  }[props.theme]

  let variantClasses = {
    subtle: subtleClasses,
    solid: solidClasses,
    outline: outlineClasses,
    ghost: ghostClasses,
  }[props.variant]

  let themeVariant = `${props.theme}-${props.variant}`

  let disabledClassesMap = {
    gray: 'bg-gray-100 text-gray-500',
    'gray-outline': 'bg-gray-100 text-gray-500 border border-gray-300',
    'gray-ghost': 'text-gray-500',

    'blue-solid': 'bg-blue-300 text-white',
    'blue-subtle': 'bg-blue-100 text-blue-400',
    'blue-outline': 'bg-blue-100 text-blue-400 border border-blue-300',
    'blue-ghost': 'text-blue-400',

    green: 'bg-green-100 text-green-500',
    'green-outline': 'bg-green-100 text-green-500 border border-green-400',
    'green-ghost': 'text-green-500',

    red: 'bg-red-100 text-red-400',
    'red-outline': 'bg-red-100 text-red-400 border border-red-300',
    'red-ghost': 'text-red-400',
  }
  let disabledClasses =
    disabledClassesMap[themeVariant] || disabledClassesMap[props.theme]

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
