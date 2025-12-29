<script setup lang="ts">
import { computed } from 'vue'
import type { SelectProps } from './types'
import LucideChevronDown from '~icons/lucide/chevron-down'
import LucideCheck from '~icons/lucide/check'

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
    outline:
      'border border-outline-gray-2 bg-surface-white hover:border-outline-gray-3',
    ghost:
      'bg-transparent border-transparent hover:bg-surface-gray-3 focus:bg-surface-gray-3',
    disabled: [
      'border',
      props.variant !== 'ghost' ? 'bg-surface-gray-1' : '',
      props.variant === 'outline'
        ? 'border-outline-gray-2'
        : 'border-transparent',
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
</script>

<template>
  <SelectRoot v-model="model">
    <SelectTrigger
      class="inline-flex items-center gap-2 outline-none text-base text-ink-gray-7 data-[placeholder]:text-ink-gray-4 data-[disabled]:text-ink-gray-4"
      aria-label="Customise options"
      :class="[selectClasses, $attrs.class]"
      :disabled="disabled"
    >
      <slot name="prefix" />
      <SelectValue :placeholder="placeholder" class="truncate" />
      <slot name="suffix">
        <LucideChevronDown class="size-4 text-ink-gray-4 ml-auto shrink-0" />
      </slot>
    </SelectTrigger>

    <SelectPortal>
      <SelectContent
        class="bg-surface-modal border rounded-lg shadow-lg will-change-[opacity,transform] z-[100] overflow-hidden origin-center data-[state=open]:animate-[fadeInScale_150ms] data-[state=closed]:animate-[fadeOutScale_150ms]"
      >
        <SelectViewport class="p-1 flex flex-col">
          <SelectItem
            v-for="option in selectOptions"
            :disabled="option.disabled"
            :key="option.value"
            :value="option.value"
            :class="[sizeClasses, paddingClasses, fontSizeClasses]"
            class="text-base text-ink-gray-9 flex items-center data-[highlighted]:bg-surface-gray-2 border-0 data-[state=checked]:bg-surface-gray-2 data-[disabled]:text-ink-gray-4 select-none"
          >
            <SelectItemText>
              <slot name="option" v-bind="{ option }">{{ option.label }}</slot>
            </SelectItemText>
            <SelectItemIndicator :as="LucideCheck" class="size-4 ml-auto" />
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
