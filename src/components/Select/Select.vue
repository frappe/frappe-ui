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
  options: SelectOption[]
  placeholder?: string
  disabled?: boolean
  multiple?: boolean
  getLabel?: Function
}

const props = withDefaults(defineProps<SelectProps>(), {
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
