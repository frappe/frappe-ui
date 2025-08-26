<script setup lang="ts">
import { computed } from 'vue'
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

import {
  type SimpleOption,
  isGroup,
  getLabel,
  getMultipleLabel,
  getValue,
  getIcon,
  isDisabled,
  RenderIcon,
} from '../Combobox/utils'

import LucideChevronDown from '~icons/lucide/chevron-down'
import LucideChevronUp from '~icons/lucide/chevron-up'

type SelectOption =
  | string
  | {
      label: string
      value: string
      icon?: any
      disabled?: boolean
    }

type Value = string | string[] | undefined

interface SelectProps {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'subtle' | 'outline' | 'ghost'
  placeholder?: string
  disabled?: boolean
  multiple?: boolean
  id?: string
  modelValue?: string | [String]
  options: SelectOption[]
  getLabel?: Function
}

const props = withDefaults(defineProps<SelectProps>(), {
  size: 'sm',
  variant: 'subtle',
  placeholder: 'Select an option...',
})

const selected = defineModel<Value>()
const selectedOption = computed<SimpleOption | SimpleOption[]>(() => {
  if (!selected.value) return null
  if (props.multiple) {
    return selected.value.map((k) =>
      flatOptions.value.find((opt) => getValue(opt) === k),
    )
  }
  return flatOptions.value.find((opt) => getValue(opt) === selected.value)
})
const selectedOptionIcon = computed(() =>
  selectedOption.value && !props.multiple
    ? getIcon(selectedOption.value)
    : null,
)

const flatOptions = computed<SimpleOption[]>(() =>
  props.options.flatMap((opt) => (isGroup(opt) ? opt.options : opt)),
)

const labelFunction = (val: Value, selected = false) => {
  if (props.getLabel) return props.getLabel(val, selected)
  if (!val || (val.map && !val.length)) return props.placeholder
  return (val.map ? getMultipleLabel : getLabel)(val)
}
</script>

<template>
  <div class="relative">
    <SelectRoot v-model="selected" :multiple>
      <SelectTrigger
        :disabled="disabled"
        class="flex h-7 w-full items-center justify-between gap-2 rounded bg-surface-gray-2 px-2 py-1 transition-colors hover:bg-surface-gray-3 focus:outline-0 focus:ring-0"
        :class="{ 'opacity-50 pointer-events-none': disabled }"
      >
        <div
          class="flex items-center flex-1 gap-2 overflow-hidden focus:ring-0"
        >
          <RenderIcon v-if="selectedOptionIcon" :icon="selectedOptionIcon" />
          <!-- Using plain renders the icon too -->
          <SelectValue
            :placeholder
            class="text-base h-full flex w-full focus:outline-0 text-ink-gray-8 data-[placeholder]:text-ink-gray-4"
          >
            <div>{{ labelFunction(selectedOption, true) }}</div>
            <RenderIcon :icon="LucideChevronDown" class="ml-auto" />
          </SelectValue>
        </div>
      </SelectTrigger>

      <SelectPortal class="w-full">
        <SelectContent
          :hideWhenDetached="true"
          :align="'start'"
          position="popper"
          class="z-10 min-w-[--reka-select-trigger-width] mt-1 bg-surface-modal overflow-hidden rounded-lg shadow-2xl"
        >
          <SelectScrollUpButton
            class="absolute left-[calc(50%-0.5rem)] py-1 z-[11] cursor-default"
          >
            <RenderIcon :icon="LucideChevronUp" />
          </SelectScrollUpButton>
          <SelectViewport
            class="max-h-60 overflow-auto p-1.5"
            :class="{ 'pt-0': isGroup(options[0]) }"
          >
            <template v-for="(optionOrGroup, index) in options" :key="index">
              <component
                :is="isGroup(optionOrGroup) ? SelectGroup : 'div'"
                :class="{ '': isGroup(optionOrGroup) }"
              >
                <SelectLabel
                  v-if="isGroup(optionOrGroup)"
                  class="px-2.5 pt-3 pb-1.5 text-sm font-medium text-ink-gray-5 sticky top-0 bg-surface-modal z-10"
                >
                  {{ optionOrGroup.group }}
                </SelectLabel>

                <SelectItem
                  v-for="(option, idx) in optionOrGroup.options || [
                    optionOrGroup,
                  ]"
                  :key="idx"
                  :value="getValue(option)"
                  :disabled="isDisabled(option)"
                  class="text-base leading-none text-ink-gray-7 rounded flex items-center h-7 px-2.5 py-1.5 relative select-none data-[disabled]:opacity-50 data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-surface-gray-3"
                >
                  <SelectItemText
                    ><span class="flex items-center gap-2 pr-6 flex-1">
                      <RenderIcon :icon="getIcon(option)" />
                      {{ labelFunction(option) }}
                    </span></SelectItemText
                  >
                  <SelectItemIndicator
                    class="inline-flex ml-auto items-center justify-center"
                  >
                    <LucideCheck class="size-4" />
                  </SelectItemIndicator>
                </SelectItem>
              </component>
              <SelectSeparator />
            </template>
          </SelectViewport>
          <SelectScrollDownButton
            class="absolute bottom-0 left-[calc(50%-0.5rem)] z-[11] cursor-default"
          >
            <RenderIcon :icon="LucideChevronDown" />
          </SelectScrollDownButton>
        </SelectContent>
      </SelectPortal>
    </SelectRoot>
  </div>
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
