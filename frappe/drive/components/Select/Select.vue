<script setup lang="ts">
import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectItemText,
  SelectItemIndicator,
  SelectLabel,
  SelectPortal,
  SelectRoot,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  SelectViewport,
} from 'reka-ui'
import { computed } from 'vue'
import LucideChevronDown from '~icons/lucide/chevron-down'

import type { SimpleOption } from '../TagInput/types'
import {
  isGroup,
  getLabel,
  getMultipleLabel,
  getValue,
  getIcon,
  RenderIcon,
  isDisabled,
} from '../TagInput/utils'
import type { SelectProps, SelectValue as SelectValue_ } from './types'

const props = withDefaults(defineProps<SelectProps>(), {
  placeholder: 'Select an option',
})

const selected = defineModel<SelectValue_>()
const selectedOption = computed<SimpleOption | SimpleOption[]>(() => {
  if (!selected.value) return null
  if (props.multiple) {
    return selected.value.map((k) => flatOptions.value.find((opt) => getValue(opt) === k))
  }
  return flatOptions.value.find((opt) => getValue(opt) === selected.value)
})
const selectedOptionIcon = computed(() =>
  selectedOption.value && !props.multiple ? getIcon(selectedOption.value) : null,
)

const flatOptions = computed<SimpleOption[]>(() =>
  props.options.flatMap((opt) => (isGroup(opt) ? opt.options : opt)),
)

const labelFunction = (val: SelectValue_, selected = false) => {
  if (props.getLabel) return props.getLabel(val, selected)
  if (!val || (val.map && !val.length)) return props.placeholder
  return (val.map ? getMultipleLabel : getLabel)(val)
}
</script>

<template>
  <div class="relative">
    <SelectRoot v-model="selected" :multiple>
      <SelectTrigger
        :disabled
        class="flex h-7 w-full overflow-hidden rounded bg-surface-gray-2 px-2 py-1 transition-colors hover:bg-surface-gray-3 focus:outline-0 focus:ring-0"
        :class="{ 'pointer-events-none opacity-50': disabled }"
      >
        <!-- Using SelectValue alone renders the icon too -->
        <SelectValue
          :placeholder
          class="flex h-full w-full items-center gap-2 text-base text-ink-gray-8 focus:outline-0 data-[placeholder]:text-ink-gray-4"
        >
          <RenderIcon v-if="selectedOptionIcon" :icon="selectedOptionIcon" />
          <div class="flex flex-1 justify-start truncate">
            {{ labelFunction(selectedOption, true) }}
          </div>
          <RenderIcon :icon="LucideChevronDown" />
        </SelectValue>
      </SelectTrigger>

      <SelectPortal>
        <SelectContent
          :hide-when-detached="true"
          :align="'start'"
          class="z-10 mt-1 min-w-[--reka-select-trigger-width] overflow-hidden rounded-lg bg-surface-modal shadow-2xl"
        >
          <SelectViewport
            class="max-h-60 overflow-auto p-1.5"
            :class="{ 'pt-0': isGroup(options[0]) }"
          >
            <template v-for="(optionOrGroup, index) in options" :key="index">
              <component
                :is="isGroup(optionOrGroup) ? SelectGroup : 'div'"
                :class="{ '': isGroup(optionOrGroup) }"
              >
                <template v-if="isGroup(optionOrGroup)">
                  <hr v-if="optionOrGroup.group === true" class="my-1.5" />
                  <SelectLabel
                    v-else
                    class="sticky top-0 z-10 bg-surface-modal px-2.5 pb-1.5 pt-3 text-sm font-medium text-ink-gray-5"
                  >
                    {{ optionOrGroup.group }}
                  </SelectLabel>
                </template>
                <SelectItem
                  v-for="(option, idx) in optionOrGroup.options || [optionOrGroup]"
                  :key="idx"
                  :value="getValue(option)"
                  :disabled="isDisabled(option)"
                  class="relative flex h-7 select-none items-center rounded px-2.5 py-1.5 text-base leading-none text-ink-gray-7 data-[disabled]:pointer-events-none data-[highlighted]:bg-surface-gray-3 data-[disabled]:opacity-50 data-[highlighted]:outline-none"
                >
                  <SelectItemText>
                    <span class="flex flex-1 items-center gap-2 pr-6">
                      <RenderIcon :icon="getIcon(option)" />
                      {{ labelFunction(option) }}
                    </span>
                  </SelectItemText>
                  <SelectItemIndicator class="ml-auto inline-flex items-center justify-center">
                    <LucideCheck class="size-4" />
                  </SelectItemIndicator>
                </SelectItem>
              </component>
              <SelectSeparator />
            </template>
          </SelectViewport>
        </SelectContent>
      </SelectPortal>
    </SelectRoot>
  </div>
</template>
