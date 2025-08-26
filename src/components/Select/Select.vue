<script setup lang="ts">
import { computed, useSlots, useAttrs } from 'vue'
import LucideChevronDown from '~icons/lucide/chevron-down'
import LucideChevronUp from '~icons/lucide/chevron-up'

import {
  type SimpleOption,
  isGroup,
  getLabel,
  getValue,
  getIcon,
  isDisabled,
  RenderIcon,
} from '../Combobox/utils'

import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectItemText,
  SelectItemIndicator,
  SelectLabel,
  SelectPortal,
  SelectRoot,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  SelectViewport,
} from 'reka-ui'

type SelectOption =
  | string
  | {
      label: string
      value: string
      icon?: any
      disabled?: boolean
    }

interface SelectProps {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'subtle' | 'outline' | 'ghost'
  placeholder?: string
  disabled?: boolean
  id?: string
  modelValue?: string | number
  options: SelectOption[]
}

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<SelectProps>(), {
  size: 'sm',
  variant: 'subtle',
})

const emit = defineEmits(['update:modelValue'])
const slots = useSlots()
const attrs = useAttrs()
const selected = defineModel<string>()
const flatOptions = computed<SimpleOption[]>(() =>
  props.options.flatMap((opt) => (isGroup(opt) ? opt.options : opt)),
)
const selectedOption = computed<SimpleOption>(() => {
  if (!selected.value) return { label: 'Select an option...', value: null }
  return flatOptions.value.find((opt) => getValue(opt) === selected.value)
})
const selectedOptionIcon = computed(() => getIcon(selectedOption.value))
</script>

<template>
  <SelectRoot v-model="selected">
    <SelectTrigger
      class="flex h-7 items-center justify-between gap-2 rounded bg-surface-gray-2 px-2 py-1 transition-colors hover:bg-surface-gray-3 border border-transparent focus-within:border-outline-gray-4 focus-within:ring-2 focus-within:ring-outline-gray-3"
    >
      <div class="flex items-center flex-1 gap-2 overflow-hidden">
        <RenderIcon v-if="selectedOptionIcon" :icon="selectedOptionIcon" />
        <SelectValue
          placeholder="Select an option..."
          class="text-base text-ink-gray-8 h-full placeholder:text-ink-gray-4"
        />
        <RenderIcon :icon="LucideChevronDown" class="ml-auto" />
      </div>
    </SelectTrigger>

    <SelectPortal>
      <SelectContent
        position="popper"
        class="z-10 min-w-[--reka-combobox-trigger-width] mt-1 bg-surface-modal overflow-hidden rounded-lg shadow-2xl"
      >
        <SelectScrollUpButton
          class="flex items-center justify-center py-0.5 bg-white cursor-default"
        >
          <RenderIcon :icon="LucideChevronUp" />
        </SelectScrollUpButton>
        <SelectViewport class="max-h-60 overflow-auto py-1.5">
          <SelectGroup class="px-1.5">
            <SelectLabel />

            <SelectItem
              v-for="(option, idx) in options"
              :key="idx"
              :value="option.value"
              class="text-base leading-none text-ink-gray-7 rounded flex items-center h-7 px-2.5 py-1.5 relative select-none data-[disabled]:opacity-50 data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-surface-gray-3"
            >
              <SelectItemText
                ><span class="flex items-center gap-2 pr-6 flex-1">
                  <RenderIcon :icon="getIcon(option)" />
                  {{ getLabel(option) }}
                </span></SelectItemText
              >
              <SelectItemIndicator
                class="inline-flex ml-auto items-center justify-center"
              >
                <LucideCheck class="size-4" />
              </SelectItemIndicator>
            </SelectItem>
          </SelectGroup>
          <SelectSeparator />
        </SelectViewport>
        <SelectScrollDownButton />
        <SelectScrollDownButton
          class="flex items-center justify-center py-0.5 bg-white cursor-default"
        >
          <RenderIcon :icon="LucideChevronDown" />
        </SelectScrollDownButton>
      </SelectContent>
    </SelectPortal>
  </SelectRoot>
</template>
<!-- <template>
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
    <div
      v-if="placeholder"
      v-show="!modelValue"
      class="pointer-events-none absolute text-ink-gray-4 truncate w-full"
      :class="[fontSizeClasses, paddingClasses]"
    >
      {{ placeholder }}
    </div>
    <select
      :class="selectClasses"
      :disabled="disabled"
      :id="id"
      :value="modelValue"
      @change="handleChange"
      v-bind="attrs"
    >
      <option
        v-for="option in selectOptions"
        :key="option.value"
        :value="option.value"
        :disabled="option.disabled || false"
        :selected="modelValue === option.value"
      >
        {{ option.label }}
      </option>
    </select>
  </div>
</template> -->

<!-- <script setup lang="ts">
import { computed, useSlots, useAttrs } from 'vue'





function handleChange(e: Event) {
  emit('update:modelValue', (e.target as HTMLInputElement).value)
}

const selectOptions = computed(() => {
  return (
    props.options
      ?.map((option) => {
        if (typeof option === 'string') {
          return {
            label: option,
            value: option,
          }
        }
        return option
      })
      .filter(Boolean) || []
  )
})

const textColor = computed(() => {
  return props.disabled ? 'text-ink-gray-4' : 'text-ink-gray-8'
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
    sm: 'pl-2 pr-5',
    md: 'pl-2.5 pr-5.5',
    lg: 'pl-3 pr-6',
    xl: 'pl-3 pr-6',
  }[props.size]
})

const selectClasses = computed(() => {
  let sizeClasses = {
    sm: 'rounded h-7',
    md: 'rounded h-8',
    lg: 'rounded-md h-10',
    xl: 'rounded-md h-10',
  }[props.size]

  let variant = props.disabled ? 'disabled' : props.variant
  let variantClasses = {
    subtle:
      'border border-[--surface-gray-2] bg-surface-gray-2 hover:border-outline-gray-modals hover:bg-surface-gray-3 focus:border-outline-gray-4 focus:ring-0 focus-visible:ring-2 focus-visible:ring-outline-gray-3',
    outline:
      'border border-outline-gray-2 bg-surface-white hover:border-outline-gray-3 focus:border-outline-gray-4 focus:ring-0 focus-visible:ring-2 focus-visible:ring-outline-gray-3',
    ghost:
      'bg-transparent border-transparent hover:bg-surface-gray-3 focus:bg-surface-gray-3 focus:border-outline-gray-4 focus:ring-0 focus-visible:ring-2 focus-visible:ring-outline-gray-3',
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
    textColor.value,
    'transition-colors w-full py-0 truncate',
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
</script> -->
