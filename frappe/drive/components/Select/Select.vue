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
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  SelectViewport,
} from 'reka-ui'
import { SimpleOption } from '../TagInput/types'
import {
  isGroup,
  getLabel,
  getMultipleLabel,
  getValue,
  getIcon,
  RenderIcon,
  isDisabled,
} from '../TagInput/utils'

import LucideChevronDown from '~icons/lucide/chevron-down'
import { SelectProps, SelectValue as SelectValue_ } from './types'

const props = withDefaults(defineProps<SelectProps>(), {
  placeholder: 'Select an option',
})

const selected = defineModel<SelectValue_>()
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
        class="flex h-7 w-full overflow-hidden focus:ring-0 rounded bg-surface-gray-2 px-2 py-1 transition-colors hover:bg-surface-gray-3 focus:outline-0 focus:ring-0"
        :class="{ 'opacity-50 pointer-events-none': disabled }"
      >
        <!-- Using SelectValue alone renders the icon too -->
        <SelectValue
          :placeholder
          class="gap-2 text-base h-full flex items-center w-full focus:outline-0 text-ink-gray-8 data-[placeholder]:text-ink-gray-4"
        >
          <RenderIcon v-if="selectedOptionIcon" :icon="selectedOptionIcon" />
          <div class="flex-1 flex justify-start truncate">
            {{ labelFunction(selectedOption, true) }}
          </div>
          <RenderIcon :icon="LucideChevronDown" />
        </SelectValue>
      </SelectTrigger>

      <SelectPortal>
        <SelectContent
          :hide-when-detached="true"
          :align="'start'"
          class="z-10 min-w-[--reka-select-trigger-width] mt-1 bg-surface-modal overflow-hidden rounded-lg shadow-2xl"
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
                    class="px-2.5 pt-3 pb-1.5 text-sm font-medium text-ink-gray-5 sticky top-0 bg-surface-modal z-10"
                  >
                    {{ optionOrGroup.group }}
                  </SelectLabel>
                </template>
                <SelectItem
                  v-for="(option, idx) in optionOrGroup.options || [
                    optionOrGroup,
                  ]"
                  :key="idx"
                  :value="getValue(option)"
                  :disabled="isDisabled(option)"
                  class="text-base leading-none text-ink-gray-7 rounded flex items-center h-7 px-2.5 py-1.5 relative select-none data-[disabled]:opacity-50 data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-surface-gray-3"
                >
                  <SelectItemText>
                    <span class="flex items-center gap-2 pr-6 flex-1">
                      <RenderIcon :icon="getIcon(option)" />
                      {{ labelFunction(option) }}
                    </span>
                  </SelectItemText>
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
        </SelectContent>
      </SelectPortal>
    </SelectRoot>
  </div>
</template>
