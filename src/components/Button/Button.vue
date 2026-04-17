<template>
  <Tooltip :text="tooltip" :disabled="!tooltip?.length">
    <button
      v-bind="$attrs"
      ref="rootRef"
      :class="buttonClasses"
      :disabled="isDisabled"
      :aria-label="label"
      :type="props.type"
      @click="handleClick"
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
      <slot name="prefix" v-else-if="$slots.prefix || iconLeftComponent">
        <component
          v-if="iconLeftComponent"
          :is="iconLeftComponent"
          :class="slotClasses"
          aria-hidden="true"
        />
      </slot>

      <template v-if="loading && loadingText">{{ loadingText }}</template>
      <template v-else-if="isIconButton && !loading">
        <component
          v-if="iconComponent"
          :is="iconComponent"
          :class="slotClasses"
        />
        <slot name="icon" v-else-if="$slots.icon" />
        <div v-else-if="hasLucideIconInDefaultSlot" :class="slotClasses">
          <slot>{{ label }}</slot>
        </div>
      </template>
      <span v-else :class="{ 'sr-only': isIconButton }" class="truncate">
        <slot>{{ label }}</slot>
      </span>

      <slot name="suffix">
        <component
          v-if="iconRightComponent"
          :is="iconRightComponent"
          :class="slotClasses"
          aria-hidden="true"
        />
      </slot>
    </button>
  </Tooltip>
</template>

<script lang="ts" setup>
import { computed, ref, useSlots, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import LoadingIndicator from '../LoadingIndicator.vue'
import Tooltip from '../Tooltip/Tooltip.vue'
import type { ButtonProps, ThemeVariant } from './types'

const warnedRuntimeStringIcons = new Set<string>()

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<ButtonProps>(), {
  theme: 'gray',
  size: 'sm',
  variant: 'subtle',
  loading: false,
  disabled: false,
  type: 'button',
})

const slots = useSlots()
const router = useRouter()

const buttonClasses = computed(() => {
  const solidClasses = {
    gray: 'text-ink-white bg-surface-gray-7 hover:bg-surface-gray-6 active:bg-surface-gray-5',
    blue: 'text-ink-white bg-blue-500 hover:bg-surface-blue-3 active:bg-blue-700',
    green:
      'text-ink-white bg-surface-green-3 hover:bg-green-700 active:bg-green-800',
    red: 'text-ink-white bg-surface-red-5 hover:bg-surface-red-6 active:bg-surface-red-7',
  }[props.theme]

  const subtleClasses = {
    gray: 'text-ink-gray-8 bg-surface-gray-2 hover:bg-surface-gray-3 active:bg-surface-gray-4',
    blue: 'text-ink-blue-3 bg-surface-blue-2 hover:bg-blue-200 active:bg-blue-300',
    green:
      'text-green-800 bg-surface-green-2 hover:bg-green-200 active:bg-green-300',
    red: 'text-red-700 bg-surface-red-2 hover:bg-surface-red-3 active:bg-surface-red-4',
  }[props.theme]

  const outlineClasses = {
    gray: 'text-ink-gray-8 bg-surface-white bg-surface-white border border-outline-gray-2 hover:border-outline-gray-3 active:border-outline-gray-3 active:bg-surface-gray-4',
    blue: 'text-ink-blue-3 bg-surface-white border border-outline-blue-1 hover:border-blue-400 active:border-blue-400 active:bg-blue-300',
    green:
      'text-green-800 bg-surface-white border border-outline-green-2 hover:border-green-500 active:border-green-500 active:bg-green-300',
    red: 'text-red-700 bg-surface-white border border-outline-red-1 hover:border-outline-red-2 active:border-outline-red-2 active:bg-surface-red-3',
  }[props.theme]

  const ghostClasses = {
    gray: 'text-ink-gray-8 bg-transparent hover:bg-surface-gray-3 active:bg-surface-gray-4',
    blue: 'text-ink-blue-3 bg-transparent hover:bg-blue-200 active:bg-blue-300',
    green:
      'text-green-800 bg-transparent hover:bg-green-200 active:bg-green-300',
    red: 'text-red-700 bg-transparent hover:bg-surface-red-3 active:bg-surface-red-4',
  }[props.theme]

  const focusClasses = {
    gray: 'focus-visible:ring focus-visible:ring-outline-gray-3',
    blue: 'focus-visible:ring focus-visible:ring-blue-400',
    green: 'focus-visible:ring focus-visible:ring-outline-green-2',
    red: 'focus-visible:ring focus-visible:ring-outline-red-2',
  }[props.theme]

  const variantClasses = {
    subtle: subtleClasses,
    solid: solidClasses,
    outline: outlineClasses,
    ghost: ghostClasses,
  }[props.variant]

  const themeVariant: ThemeVariant = `${props.theme}-${props.variant}`

  const disabledClassesMap: Record<ThemeVariant, string> = {
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
  const disabledClasses = disabledClassesMap[themeVariant]

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
    'inline-flex items-center justify-center gap-2 transition-colors focus:outline-none shrink-0',
    isDisabled.value ? disabledClasses : variantClasses,
    focusClasses,
    sizeClasses,
  ]
})

const slotClasses = computed(() => {
  return {
    sm: 'h-4',
    md: 'h-4.5',
    lg: 'h-5',
    xl: 'h-6',
    '2xl': 'h-6',
  }[props.size]
})

const isDisabled = computed(() => {
  return props.disabled || props.loading
})

const iconComponent = computed(() => getRenderableIcon(props.icon))
const iconLeftComponent = computed(() => getRenderableIcon(props.iconLeft))
const iconRightComponent = computed(() => getRenderableIcon(props.iconRight))

const isIconButton = computed(() => {
  return Boolean(
    iconComponent.value || slots.icon || hasLucideIconInDefaultSlot.value,
  )
})

const hasLucideIconInDefaultSlot = computed(() => {
  if (!slots.default) return false

  const slotContent = slots.default()
  if (!Array.isArray(slotContent)) return false

  const firstVNode = slotContent[0]
  return (
    typeof firstVNode.type?.name === 'string' &&
    firstVNode.type.name.startsWith('lucide-')
  )
})

if (import.meta.env.DEV) {
  watchEffect(() => {
    warnForRuntimeStringIcon('icon', props.icon)
    warnForRuntimeStringIcon('iconLeft', props.iconLeft)
    warnForRuntimeStringIcon('iconRight', props.iconRight)
  })
}

function getRenderableIcon(icon?: ButtonProps['icon']) {
  if (!icon || typeof icon === 'string') return null
  return icon
}

function warnForRuntimeStringIcon(
  propName: 'icon' | 'iconLeft' | 'iconRight',
  icon?: string | ButtonProps['icon'],
) {
  if (!icon || typeof icon !== 'string') return

  const key = `${propName}:${icon}`
  if (warnedRuntimeStringIcons.has(key)) return

  warnedRuntimeStringIcons.add(key)
  console.warn(
    `[frappe-ui] Button ${propName}="${icon}" requires the frappe-ui/vite transform or a component binding like :${propName}="LucideX".`,
  )
}

function handleClick() {
  if (props.route) {
    return router.push(props.route)
  }

  if (props.link) {
    return window.open(props.link, '_blank')
  }
}

const rootRef = ref<HTMLElement | null>(null)
defineExpose({ rootRef })

defineSlots<{
  /** Content shown before the button label (left icon / custom content) */
  prefix?: () => any

  /** Icon-only content for icon buttons */
  icon?: () => any

  /** Main button content (overrides `label`) */
  default?: () => any

  /** Content shown after the button label (right icon / custom content) */
  suffix?: () => any
}>()
</script>
