<script setup lang="ts">
import {
  SelectContent,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectPortal,
  SelectRoot,
  SelectTrigger,
  SelectValue,
  SelectViewport,
} from 'reka-ui'
import { computed } from 'vue'
import LucideCheck from '~icons/lucide/check'
import LucideChevronDown from '~icons/lucide/chevron-down'

import type { SelectProps, SelectOption } from './types'

const model = defineModel<String>()

const props = withDefaults(defineProps<SelectProps>(), {
  size: 'sm',
  variant: 'subtle',
  placeholder: 'Select option',
})

const fontSizeClasses = computed(() => {
  return {
    sm: 'text-base',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
  }[props.size]
})

const paddingClasses = computed(() => {
  return {
    sm: 'px-2',
    md: 'px-2.5 ',
    lg: 'px-3',
    xl: 'px-3',
  }[props.size]
})

let sizeClasses = {
  sm: 'rounded min-h-7',
  md: 'rounded min-h-8',
  lg: 'rounded-md min-h-10',
  xl: 'rounded-md min-h-10',
}[props.size]

const selectClasses = computed(() => {
  let variant = props.disabled ? 'disabled' : props.variant
  let variantClasses = {
    subtle:
      'border border-[--surface-gray-2] bg-surface-gray-2 hover:border-outline-gray-modals hover:bg-surface-gray-3',
    outline: 'border border-outline-gray-2 bg-surface-white hover:border-outline-gray-3',
    ghost: 'bg-transparent border-transparent hover:bg-surface-gray-3 focus:bg-surface-gray-3',
    disabled: [
      'border cursor-not-allowed',
      props.variant !== 'ghost' ? 'bg-surface-gray-1' : '',
      props.variant === 'outline' ? 'border-outline-gray-2' : 'border-transparent',
    ],
  }[variant]

  return [
    sizeClasses,
    fontSizeClasses.value,
    paddingClasses.value,
    variantClasses,
    'transition-colors w-full focus:ring-2 data-[state=open]:ring-2 ring-outline-gray-3 ',
  ]
})

const selectOptions = computed(() => {
  const str = typeof props.options?.[0] == 'string'
  const tmp = props.options?.map((x) => ({ label: x, value: x }))
  return (str ? tmp : props.options)?.filter((x) => x && String(x.value)) || []
})

defineSlots<{
  /** Content rendered before the selected value (e.g., left icon or custom content) */
  prefix?: () => any

  /** Content rendered after the selected value (e.g., right icon or custom content) */
  suffix?: () => any

  /** Custom rendering for each dropdown option */
  option?: (props: { option: SelectOption }) => any

  /** Custom content at the bottom of the dropdown */
  footer?: () => any
}>()
</script>

<template>
  <SelectRoot v-model="model">
    <SelectTrigger
      class="inline-flex items-center gap-2 text-base text-ink-gray-7 outline-none data-[disabled]:text-ink-gray-4 data-[placeholder]:text-ink-gray-4"
      aria-label="Customise options"
      :class="[selectClasses, $attrs.class]"
      :disabled="disabled"
    >
      <slot name="prefix" />
      <SelectValue :placeholder="placeholder" class="truncate" />
      <slot name="suffix">
        <LucideChevronDown class="ml-auto size-4 shrink-0 text-ink-gray-4" />
      </slot>
    </SelectTrigger>

    <SelectPortal>
      <SelectContent
        class="z-[100] origin-center overflow-hidden rounded-lg bg-surface-modal shadow-2xl ring-1 ring-black ring-opacity-5 will-change-[opacity,transform] data-[state=closed]:animate-[fadeOutScale_100ms] data-[state=open]:animate-[fadeInScale_100ms]"
      >
        <SelectViewport class="flex flex-col p-1">
          <SelectItem
            v-for="option in selectOptions"
            :disabled="option.disabled"
            :key="option.value"
            :value="option.value"
            :class="[sizeClasses, paddingClasses, fontSizeClasses]"
            class="flex select-none items-center border-0 text-base text-ink-gray-9 data-[highlighted]:bg-surface-gray-2 data-[state=checked]:bg-surface-gray-2 data-[disabled]:text-ink-gray-4"
          >
            <SelectItemText>
              <slot name="option" v-bind="{ option }">{{ option.label }}</slot>
            </SelectItemText>
            <SelectItemIndicator :as="LucideCheck" class="ml-auto size-4" />
          </SelectItem>
          <slot name="footer" />
        </SelectViewport>
      </SelectContent>
    </SelectPortal>
  </SelectRoot>
</template>

<style scoped>
[data-highlighted],
[data-state='checked'] {
  outline: none !important;
}
</style>

<style>
@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes fadeOutScale {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.95);
  }
}
</style>
