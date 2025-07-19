<script setup lang="ts">
import {
  computed,
  type Component,
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
  ComboboxSeparator,
  ComboboxTrigger,
  ComboboxViewport,
} from 'reka-ui'
import LucideCheck from '~icons/lucide/check'
import LucideChevronDown from '~icons/lucide/chevron-down'

type SimpleOption =
  | string
  | {
      label: string
      value: string
      icon?: string | Component
      disabled?: boolean
    }
type GroupedOption = { group: string; options: SimpleOption[] }
type ComboboxOption = SimpleOption | GroupedOption

interface ComboboxProps {
  options: Array<ComboboxOption>
  modelValue?: string | null
  placeholder?: string
  disabled?: boolean
}

const props = defineProps<ComboboxProps>()
const emit = defineEmits([
  'update:modelValue',
  'update:selectedOption',
  'focus',
  'blur',
])

const searchTerm = ref(getDisplayValue(props.modelValue))
const internalModelValue = ref(props.modelValue)
const isOpen = ref(false)
const userHasTyped = ref(false)

watch(
  () => props.modelValue,
  (newValue) => {
    internalModelValue.value = newValue
    searchTerm.value = getDisplayValue(newValue)
  },
)

const onUpdateModelValue = (value: string | null) => {
  internalModelValue.value = value
  emit('update:modelValue', value)
  searchTerm.value = getDisplayValue(value)
  userHasTyped.value = false

  const selectedOpt = value
    ? allOptionsFlat.value.find((opt) => getValue(opt) === value) || null
    : null
  emit('update:selectedOption', selectedOpt)
}

function isGroup(option: ComboboxOption): option is GroupedOption {
  return typeof option === 'object' && 'group' in option
}

function getLabel(option: SimpleOption): string {
  return typeof option === 'string' ? option : option.label
}

function getValue(option: SimpleOption): string {
  return typeof option === 'string' ? option : option.value
}

function isDisabled(option: SimpleOption): boolean {
  return typeof option === 'object' && !!option.disabled
}

function getIcon(option: SimpleOption): string | Component | undefined {
  return typeof option === 'object' ? option.icon : undefined
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

const filterFunction = (options: ComboboxOption[], search: string) => {
  if (!search) return options

  const lowerSearch = search.toLowerCase()
  const filtered: ComboboxOption[] = []

  options.forEach((optionOrGroup) => {
    if (isGroup(optionOrGroup)) {
      const filteredGroupOptions = optionOrGroup.options.filter((opt) => {
        const label = getLabel(opt).toLowerCase()
        const value = getValue(opt).toLowerCase()

        return label.includes(lowerSearch) || value.includes(lowerSearch)
      })
      if (filteredGroupOptions.length > 0) {
        filtered.push({ ...optionOrGroup, options: filteredGroupOptions })
      }
    } else {
      const label = getLabel(optionOrGroup).toLowerCase()
      const value = getValue(optionOrGroup).toLowerCase()
      if (label.includes(lowerSearch) || value.includes(lowerSearch)) {
        filtered.push(optionOrGroup)
      }
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
  userHasTyped.value = true

  if (searchTerm.value === '') {
    internalModelValue.value = null
    emit('update:modelValue', null)
  }
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
  emit('focus', event)
}

const handleBlur = (event: FocusEvent) => {
  emit('blur', event)
}
</script>

<template>
  <div class="relative">
    <ComboboxRoot
      :model-value="internalModelValue"
      @update:modelValue="onUpdateModelValue"
      @update:open="handleOpenChange"
      :ignore-filter="true"
    >
      <ComboboxAnchor
        class="flex h-7 w-full items-center justify-between gap-2 rounded bg-surface-gray-2 px-2 py-1 transition-colors hover:bg-surface-gray-3 border border-transparent focus-within:border-outline-gray-4 focus-within:ring-2 focus-within:ring-outline-gray-3"
        :class="{ 'opacity-50 pointer-events-none': disabled }"
      >
        <div class="flex items-center gap-2 flex-1 overflow-hidden">
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
          :align="'start'"
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
                  :value="getValue(option)"
                  :disabled="isDisabled(option)"
                  class="text-base leading-none text-ink-gray-7 rounded flex items-center h-7 px-2.5 py-1.5 relative select-none data-[disabled]:opacity-50 data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-surface-gray-3"
                >
                  <span class="flex items-center gap-2 pr-6 flex-1">
                    <RenderIcon :icon="getIcon(option)" />
                    {{ getLabel(option) }}
                  </span>
                  <ComboboxItemIndicator
                    class="inline-flex ml-2 items-center justify-center"
                  >
                    <LucideCheck class="size-4" />
                  </ComboboxItemIndicator>
                </ComboboxItem>
              </ComboboxGroup>
              <ComboboxItem
                v-else
                :key="index"
                :value="getValue(optionOrGroup)"
                :disabled="isDisabled(optionOrGroup)"
                class="text-base leading-none text-ink-gray-7 rounded flex items-center h-7 px-2.5 py-1.5 relative select-none data-[disabled]:opacity-50 data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-surface-gray-3"
              >
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
              </ComboboxItem>
            </template>
          </ComboboxViewport>
        </ComboboxContent>
      </ComboboxPortal>
    </ComboboxRoot>
  </div>
</template>
