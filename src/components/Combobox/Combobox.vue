<script setup lang="ts">
import {
  computed,
  type Component,
  type VNode,
  ref,
  watch,
  h,
  FunctionalComponent,
} from 'vue'
import {
  ComboboxAnchor,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxLabel,
  ComboboxPortal,
  ComboboxRoot,
  ComboboxTrigger,
  ComboboxViewport,
} from 'reka-ui'
import LucideCheck from '~icons/lucide/check'
import LucideChevronDown from '~icons/lucide/chevron-down'
import type {
  CustomOption,
  SimpleOption,
  GroupedOption,
  ComboboxOption,
  ComboboxProps,
} from './types'

const props = withDefaults(defineProps<ComboboxProps>(), {
  variant: 'subtle',
  options: () => [],
})
const emit = defineEmits([
  'update:modelValue',
  'update:selectedOption',
  'focus',
  'blur',
  'input',
])

const searchTerm = ref(getDisplayValue(props.modelValue))
const internalModelValue = ref(props.modelValue)
const isOpen = ref(false)
const userHasTyped = ref(false)
const lastSearchTerm = ref('') // Preserve search context for custom option onClick handlers

watch(
  () => props.modelValue,
  (newValue) => {
    internalModelValue.value = newValue
    searchTerm.value = getDisplayValue(newValue)
  },
)
watch(
  () => getDisplayValue(props.modelValue),
  (newDisplay) => {
    if (!userHasTyped.value) searchTerm.value = newDisplay
  },
)

const onUpdateModelValue = (value: string | null) => {
  const selectedOpt = value
    ? allOptionsFlat.value.find((opt) => getKey(opt) === value) || null
    : null

  if (selectedOpt && isCustomOption(selectedOpt)) {
    const context = { searchTerm: lastSearchTerm.value }
    selectedOpt.onClick(context)

    if (selectedOpt.keepOpen) {
      // Defer opening to prevent interference with default close behavior
      setTimeout(() => {
        isOpen.value = true
      }, 0)
    } else {
      isOpen.value = false
      searchTerm.value = getDisplayValue(internalModelValue.value)
      lastSearchTerm.value = ''
      userHasTyped.value = false
    }

    return
  }
  internalModelValue.value = value
  emit('update:modelValue', value)
  searchTerm.value = getDisplayValue(value)
  lastSearchTerm.value = ''
  userHasTyped.value = false
  emit('update:selectedOption', selectedOpt)
}

function isGroup(option: ComboboxOption): option is GroupedOption {
  return typeof option === 'object' && 'group' in option
}

function isCustomOption(option: SimpleOption): option is CustomOption {
  return typeof option === 'object' && option.type === 'custom'
}

function getLabel(option: SimpleOption): string {
  return typeof option === 'string' ? option : option.label
}

function getValue(option: SimpleOption): string | undefined {
  if (typeof option === 'string') return option
  if (isCustomOption(option)) return undefined
  return option.value
}

function getKey(option: SimpleOption): string {
  if (typeof option === 'string') return option
  if (isCustomOption(option)) return option.key
  return option.value
}

function isDisabled(option: SimpleOption): boolean {
  return typeof option === 'object' && !!option.disabled
}

function getIcon(option: SimpleOption): string | Component | undefined {
  return typeof option === 'object' ? option.icon : undefined
}

function getSlotName(option: SimpleOption): string | undefined {
  return isCustomOption(option) ? option.slotName : undefined
}

function getRenderFunction(option: SimpleOption): (() => VNode) | undefined {
  return isCustomOption(option) ? option.render : undefined
}

const allOptionsFlat = computed(() => {
  const flatOptions: SimpleOption[] = []
  props.options.forEach((optionOrGroup) => {
    if (isGroup(optionOrGroup)) {
      flatOptions.push(...optionOrGroup.options)
    } else {
      flatOptions.push(optionOrGroup)
    }
  })
  return flatOptions
})

function getDisplayValue(selectedValue: string | null | undefined): string {
  if (!selectedValue) return ''
  const options = props.options.flatMap((opt) =>
    isGroup(opt) ? opt.options : opt,
  )
  const selectedOption = options.find((opt) => getValue(opt) === selectedValue)
  return selectedOption ? getLabel(selectedOption) : selectedValue || ''
}

const selectedOption = computed(() => {
  if (!internalModelValue.value) return null
  return allOptionsFlat.value.find(
    (opt) => getValue(opt) === internalModelValue.value,
  )
})

const selectedOptionIcon = computed(() => {
  return selectedOption.value ? getIcon(selectedOption.value) : undefined
})

const RenderIcon: FunctionalComponent<{ icon?: string | Component }> = (
  props,
) => {
  if (!props.icon) return null
  const iconContent =
    typeof props.icon === 'string'
      ? h('span', props.icon)
      : h(props.icon, { class: 'w-4 h-4' })

  return h(
    'span',
    {
      class: 'flex-shrink-0 w-4 h-4 inline-flex items-center justify-center',
    },
    [iconContent],
  )
}

const shouldShowOption = (
  option: SimpleOption,
  search: string,
  context: { searchTerm: string },
) => {
  if (isCustomOption(option)) {
    if (option.condition) {
      return option.condition(context)
    }
    if (!search) return true
    return getLabel(option).toLowerCase().includes(search.toLowerCase())
  }

  if (!search) return true
  const label = getLabel(option).toLowerCase()
  const value = getValue(option)?.toLowerCase() || ''
  const lowerSearch = search.toLowerCase()
  return label.includes(lowerSearch) || value.includes(lowerSearch)
}

const filterFunction = (options: ComboboxOption[], search: string) => {
  const context = { searchTerm: search }
  const filtered: ComboboxOption[] = []

  options.forEach((optionOrGroup) => {
    if (isGroup(optionOrGroup)) {
      const filteredGroupOptions = optionOrGroup.options.filter((opt) =>
        shouldShowOption(opt, search, context),
      )
      if (filteredGroupOptions.length > 0) {
        filtered.push({ ...optionOrGroup, options: filteredGroupOptions })
      }
    } else if (shouldShowOption(optionOrGroup, search, context)) {
      filtered.push(optionOrGroup)
    }
  })

  return filtered
}

const filteredOptions = computed(() => {
  if (isOpen.value && !userHasTyped.value && internalModelValue.value) {
    return props.options
  }
  return filterFunction(props.options, searchTerm.value)
})

const handleInputChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  searchTerm.value = target.value
  lastSearchTerm.value = target.value
  userHasTyped.value = true

  if (searchTerm.value === '') {
    internalModelValue.value = null
    emit('update:modelValue', null)
  }
  emit('input', searchTerm.value)
}

const handleOpenChange = (open: boolean) => {
  isOpen.value = open
  if (!open) {
    searchTerm.value = getDisplayValue(internalModelValue.value)
    userHasTyped.value = false
  } else {
    userHasTyped.value = false
  }
}

const handleFocus = (event: FocusEvent) => {
  if (props.openOnFocus) {
    isOpen.value = true
  }
  emit('focus', event)
}

const handleBlur = (event: FocusEvent) => {
  emit('blur', event)
}

const handleClick = () => {
  if (props.openOnClick) {
    isOpen.value = true
  }
}

const reset = () => {
  searchTerm.value = ''
  userHasTyped.value = false
  internalModelValue.value = null
  emit('update:modelValue', null)
  emit('update:selectedOption', null)
}

const variantClasses = computed(() => {
  const borderCss =
    'border focus-within:border-outline-gray-4 focus-within:ring-2 focus-within:ring-outline-gray-3'

  return {
    subtle: `${borderCss} bg-surface-gray-2 hover:bg-surface-gray-3 border-transparent`,
    outline: `${borderCss} border-outline-gray-2`,
    ghost: '',
  }[props.variant]
})

defineExpose({
  reset,
})
</script>

<template>
  <div class="relative">
    <ComboboxRoot
      :model-value="internalModelValue"
      @update:modelValue="onUpdateModelValue"
      @update:open="handleOpenChange"
      :ignore-filter="true"
      :open="isOpen"
    >
      <ComboboxAnchor
        class="flex h-7 w-full items-center justify-between gap-2 rounded px-2 py-1 transition-colors"
        :class="{
          'opacity-50 pointer-events-none': disabled,
          [variantClasses]: true,
        }"
        @click="handleClick"
      >
        <div class="flex items-center gap-2 flex-1 overflow-hidden">
          <slot name="prefix" />
          <RenderIcon v-if="selectedOptionIcon" :icon="selectedOptionIcon" />
          <ComboboxInput
            :value="searchTerm"
            @input="handleInputChange"
            @focus="handleFocus"
            @blur="handleBlur"
            class="bg-transparent p-0 focus:outline-0 border-0 focus:border-0 focus:ring-0 text-base text-ink-gray-8 h-full placeholder:text-ink-gray-4 w-full"
            :placeholder="placeholder || ''"
            :disabled="disabled"
            autocomplete="off"
          />
        </div>
        <ComboboxTrigger :disabled="disabled">
          <LucideChevronDown class="h-4 w-4 text-ink-gray-5" />
        </ComboboxTrigger>
      </ComboboxAnchor>
      <ComboboxPortal>
        <ComboboxContent
          class="z-10 min-w-[--reka-combobox-trigger-width] mt-1 bg-surface-modal overflow-hidden rounded-lg shadow-2xl"
          position="popper"
          @openAutoFocus.prevent
          @closeAutoFocus.prevent
          :align="props.placement || 'start'"
        >
          <ComboboxViewport
            class="max-h-60 overflow-auto pb-1.5"
            :class="{ 'px-1.5 pt-1.5': !isGroup(filteredOptions[0]) }"
          >
            <ComboboxEmpty
              class="text-ink-gray-5 text-base text-center py-1.5 px-2.5"
            >
              No results found for "{{ searchTerm }}"
            </ComboboxEmpty>
            <template
              v-for="(optionOrGroup, index) in filteredOptions"
              :key="index"
            >
              <ComboboxGroup class="px-1.5" v-if="isGroup(optionOrGroup)">
                <ComboboxLabel
                  class="px-2.5 pt-3 pb-1.5 text-sm font-medium text-ink-gray-5 sticky top-0 bg-surface-modal z-10"
                >
                  {{ optionOrGroup.group }}
                </ComboboxLabel>
                <ComboboxItem
                  v-for="(option, idx) in optionOrGroup.options"
                  :key="`${index}-${idx}`"
                  :value="getKey(option)"
                  :disabled="isDisabled(option)"
                  class="text-base leading-none text-ink-gray-7 rounded flex items-center h-7 px-2.5 py-1.5 relative select-none data-[disabled]:opacity-50 data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-surface-gray-3"
                >
                  <slot
                    v-if="getSlotName(option)"
                    :name="getSlotName(option)"
                    :option="option"
                    :searchTerm="searchTerm"
                  />
                  <component
                    v-else-if="getRenderFunction(option)"
                    :is="getRenderFunction(option)"
                  />
                  <template v-else>
                    <span class="flex items-center gap-2 pr-6 flex-1">
                      <RenderIcon :icon="getIcon(option)" />
                      {{ getLabel(option) }}
                    </span>
                    <ComboboxItemIndicator
                      class="absolute right-0 w-6 inline-flex items-center justify-center"
                    >
                      <LucideCheck class="size-4" />
                    </ComboboxItemIndicator>
                  </template>
                </ComboboxItem>
              </ComboboxGroup>
              <ComboboxItem
                v-else
                :key="index"
                :value="getKey(optionOrGroup)"
                :disabled="isDisabled(optionOrGroup)"
                class="text-base leading-none text-ink-gray-7 rounded flex items-center h-7 px-2.5 py-1.5 relative select-none data-[disabled]:opacity-50 data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-surface-gray-3"
              >
                <slot
                  v-if="getSlotName(optionOrGroup)"
                  :name="getSlotName(optionOrGroup)"
                  :option="optionOrGroup"
                  :searchTerm="searchTerm"
                />
                <component
                  v-else-if="getRenderFunction(optionOrGroup)"
                  :is="getRenderFunction(optionOrGroup)"
                />
                <template v-else>
                  <span class="flex items-center gap-2 pr-6 flex-1">
                    <RenderIcon
                      v-if="getIcon(optionOrGroup)"
                      :icon="getIcon(optionOrGroup)"
                    />
                    {{ getLabel(optionOrGroup) }}
                  </span>
                  <ComboboxItemIndicator
                    class="absolute right-0 w-6 inline-flex items-center justify-center"
                  >
                    <LucideCheck class="h-4 w-4" />
                  </ComboboxItemIndicator>
                </template>
              </ComboboxItem>
            </template>
          </ComboboxViewport>
        </ComboboxContent>
      </ComboboxPortal>
    </ComboboxRoot>
  </div>
</template>
