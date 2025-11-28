<script setup lang="ts">
import { computed } from 'vue'
import type { SelectProps } from './types'
import LucideChevronDown from '~icons/lucide/chevron-down'

import {
  SelectContent,
  SelectItem,
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
    'transition-colors w-full data-[state=open]:ring-2 ring-outline-gray-2 ',
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
      class="inline-flex items-center gap-2 outline-none text-base data-[placeholder]:text-ink-gray-4 data-[disabled]:text-ink-gray-4"
      aria-label="Customise options"
      :class="selectClasses"
      :disabled="props.disabled"
    >
      <slot name="prefix" />
      <SelectValue :placeholder="props.placeholder" />
      <LucideChevronDown class="size-4 text-ink-gray-4 ml-auto" />
    </SelectTrigger>

    <SelectPortal>
      <SelectContent
        class="bg-surface-modal border rounded-lg shadow-lg will-change-[opacity,transform] z-[100] min-w-[--reka-select-trigger-width] max-h-[--reka-select-content-available-height] overflow-auto"
        :side-offset="5"
        position="popper"
      >
        <SelectViewport class="p-1 flex flex-col">
          <SelectItem
            v-for="(option, index) in selectOptions"
            :disabled="option.disabled"
            :key="index"
            :value="option.value"
            :class="[sizeClasses, paddingClasses, fontSizeClasses]"
            class="text-base text-ink-gray-9 flex items-center relative data-[highlighted]:bg-surface-gray-2 border-0 [data-state=checked]:bg-surface-gray-2 data-[disabled]:text-ink-gray-4"
          >
            <SelectItemText>
              {{ option.label }}
            </SelectItemText>
          </SelectItem>
        </SelectViewport>
      </SelectContent>
    </SelectPortal>
  </SelectRoot>
</template>

<style>
@keyframes slideDownFade {
  from {
    opacity: 0;
    transform: translateY(-4px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes slideUpFade {
  from {
    opacity: 0;
    transform: translateY(4px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

[data-side='top'] {
  animation: slideDownFade 280ms;
}

[data-side='bottom'] {
  animation: slideUpFade 280ms;
}

[data-highlighted],
[data-state='checked'] {
  outline: none !important;
}
</style>
