<template>
  <Combobox
    v-model="selectedValue"
    :multiple="multiple"
    nullable
    v-slot="{ open: isComboboxOpen }"
  >
    <Popover class="w-full" v-model:show="showOptions" ref="rootRef">
      <template #target="{ open: openPopover, togglePopover }">
        <slot name="target" v-bind="{ open: openPopover, togglePopover }">
          <div class="w-full">
            <button
              class="flex h-7 w-full items-center justify-between gap-2 rounded bg-gray-100 px-2 py-1 transition-colors hover:bg-gray-200 focus:ring-2 focus:ring-gray-400"
              :class="{ 'bg-gray-200': isComboboxOpen }"
              @click="() => togglePopover()"
            >
              <div class="flex items-center overflow-hidden">
                <slot name="prefix" />
                <span class="truncate text-base leading-5" v-if="selectedValue">
                  {{ displayValue(selectedValue) }}
                </span>
                <span class="text-base leading-5 text-gray-500" v-else>
                  {{ placeholder || '' }}
                </span>
              </div>
              <FeatherIcon
                name="chevron-down"
                class="h-4 w-4 text-gray-600"
                aria-hidden="true"
              />
            </button>
          </div>
        </slot>
      </template>
      <template #body="{ isOpen, togglePopover }">
        <div v-show="isOpen">
          <div
            class="relative mt-1 rounded-lg bg-white text-base shadow-2xl"
            :class="bodyClasses"
          >
            <ComboboxOptions
              class="max-h-[15rem] overflow-y-auto px-1.5 pb-1.5"
              :class="{ 'pt-1.5': hideSearch }"
              static
            >
              <div
                v-if="!hideSearch"
                class="sticky top-0 z-10 flex items-stretch space-x-1.5 bg-white py-1.5"
              >
                <div class="relative w-full">
                  <ComboboxInput
                    ref="searchInput"
                    class="form-input w-full"
                    type="text"
                    @change="
                      (e) => {
                        query = e.target.value
                      }
                    "
                    :value="query"
                    autocomplete="off"
                    placeholder="Search"
                  />
                  <button
                    class="absolute right-0 inline-flex h-7 w-7 items-center justify-center"
                    @click="selectedValue = []"
                  >
                    <FeatherIcon name="x" class="w-4" />
                  </button>
                </div>
              </div>
              <div
                v-for="group in groups"
                :key="group.key"
                v-show="group.items.length > 0"
              >
                <div
                  v-if="group.group && !group.hideLabel"
                  class="sticky top-10 truncate bg-white px-2.5 py-1.5 text-sm font-medium text-gray-600"
                >
                  {{ group.group }}
                </div>
                <ComboboxOption
                  as="template"
                  v-for="(option, idx) in group.items.slice(0, 50)"
                  :key="option?.value || idx"
                  :value="option"
                  v-slot="{ active, selected }"
                >
                  <li
                    :class="[
                      'flex cursor-pointer items-center justify-between rounded px-2.5 py-1.5 text-base',
                      { 'bg-gray-100': active },
                    ]"
                  >
                    <div class="flex flex-1 gap-2 overflow-hidden">
                      <div
                        v-if="$slots['item-prefix'] || $props.multiple"
                        class="flex-shrink-0"
                      >
                        <slot
                          name="item-prefix"
                          v-bind="{ active, selected, option }"
                        >
                          <FeatherIcon
                            name="check"
                            v-if="isOptionSelected(option)"
                            class="h-4 w-4 text-gray-700"
                          />
                          <div v-else class="h-4 w-4" />
                        </slot>
                      </div>
                      <span class="flex-1 truncate">
                        {{ getLabel(option) }}
                      </span>
                    </div>

                    <div
                      v-if="$slots['item-suffix'] || option?.description"
                      class="ml-2 flex-shrink-0"
                    >
                      <slot
                        name="item-suffix"
                        v-bind="{ active, selected, option }"
                      >
                        <div
                          v-if="option?.description"
                          class="text-sm text-gray-600"
                        >
                          {{ option.description }}
                        </div>
                      </slot>
                    </div>
                  </li>
                </ComboboxOption>
              </div>
              <li
                v-if="groups.length == 0"
                class="rounded-md px-2.5 py-1.5 text-base text-gray-600"
              >
                No results found
              </li>
            </ComboboxOptions>

            <div v-if="$slots.footer || multiple" class="border-t p-1">
              <slot name="footer" v-bind="{ togglePopover }">
                <div v-if="multiple" class="flex items-center justify-end">
                  <Button
                    v-if="!areAllOptionsSelected"
                    label="Select All"
                    @click.stop="selectAll"
                  />
                  <Button
                    v-if="areAllOptionsSelected"
                    label="Clear All"
                    @click.stop="clearAll"
                  /></div
              ></slot>
            </div>
          </div>
        </div>
      </template>
    </Popover>
  </Combobox>
</template>

<script setup lang="ts">
import { computed, ref, nextTick, watch } from 'vue'
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from '@headlessui/vue'
import Popover from './Popover.vue'
import Button from './Button.vue'
import FeatherIcon from './FeatherIcon.vue'

type AutocompleteOption = {
  label: string
  value: string
  group?: string
  hideLabel?: boolean
  items?: AutocompleteOption[]
  description?: string
}

interface AutocompleteProps {
  modelValue: string | string[] | AutocompleteOption | AutocompleteOption[]
  options?: string[] | AutocompleteOption[]
  placeholder?: string
  bodyClasses?: string | string[]
  multiple?: boolean
  hideSearch?: boolean
}

const props = withDefaults(defineProps<AutocompleteProps>(), {
  multiple: false,
  hideSearch: false,
})

const emit = defineEmits(['update:modelValue', 'update:query', 'change'])

const searchInput = ref()

const query = ref('')

const showOptions = ref(false)

const groups = computed(() => {
  if (!props.options || props.options.length == 0) return []

  return props.options.map((option, i) => {
    if (typeof option === 'string') {
      return {
        key: i,
        group: '',
        hideLabel: false,
        items: [{ label: option, value: option }],
      }
    }
    return {
      key: i,
      group: option.group || '',
      hideLabel: option.hideLabel || false,
      items: filterOptions(sanitizeOptions(option.items || [option])),
    }
  })
})

const sanitizeOptions = (
  options: string[] | AutocompleteOption[],
): AutocompleteOption[] => {
  if (!options) return []
  // in case the options are just values, convert them to objects
  return options.map((option) => {
    if (isAutocompleteOption(option)) {
      return option as AutocompleteOption
    }
    return { label: option.toString(), value: option.toString() }
  })
}

const filterOptions = (options: AutocompleteOption[]) => {
  if (!query.value) return options
  return options.filter((option) => {
    return (
      option.label.toLowerCase().includes(query.value.trim().toLowerCase()) ||
      option.value.toLowerCase().includes(query.value.trim().toLowerCase())
    )
  })
}

const allOptions = computed(() => {
  return groups.value.flatMap((group) => group.items)
})

const selectedValue = computed({
  get() {
    if (!props.multiple) {
      return findOption(props.modelValue as string | AutocompleteOption)
    }
    // in case of `multiple`, modelValue is an array of values
    // if the modelValue is a list of values, convert them to options
    let values = props.modelValue as string[] | AutocompleteOption[]
    if (!values) return []
    return isAutocompleteOption(values[0])
      ? values
      : values?.map((v) => findOption(v))
  },
  set(val) {
    query.value = ''
    if (val && !props.multiple) showOptions.value = false
    if (!props.multiple) {
      emit('update:modelValue', val)
      return
    }
    emit('update:modelValue', val)
  },
})

const findOption = (option: AutocompleteOption | string) => {
  if (!option) return option
  const value = isAutocompleteOption(option) ? option.value : option
  return allOptions.value.find((o) => o.value === value)
}

const isAutocompleteOption = (optionOrValue: string | AutocompleteOption) => {
  return typeof optionOrValue === 'object'
}

const getLabel = (option: string | AutocompleteOption) => {
  if (isAutocompleteOption(option)) {
    return option?.label || option?.value || 'No label'
  }
  return option
}

const displayValue = (option: any) => {
  if (!option) return ''

  if (!props.multiple) {
    return getLabel(findOption(option) || '')
  }

  if (!Array.isArray(option)) return ''

  // in case of `multiple`, option is an array of values
  // so the display value should be comma separated labels
  return option.map((v) => getLabel(findOption(v) || '')).join(', ')
}

const isOptionSelected = (option: AutocompleteOption) => {
  if (!selectedValue.value) return false
  const value = isAutocompleteOption(option) ? option.value : option
  if (!props.multiple) {
    return selectedValue.value === value
  }
  return (selectedValue.value as AutocompleteOption[]).find(
    (v) => v && v.value === value,
  )
}

const areAllOptionsSelected = computed(() => {
  if (!props.multiple) return false
  return (
    allOptions.value.length ===
    (selectedValue.value as string[] | AutocompleteOption[])?.length
  )
})

const selectAll = () => {
  selectedValue.value = allOptions.value
}

const clearAll = () => {
  selectedValue.value = []
}

watch(
  () => query.value,
  () => {
    emit('update:query', query.value)
  },
)

watch(
  () => showOptions.value,
  (val) => {
    if (val) nextTick(() => searchInput.value?.$el.focus())
  },
)

const rootRef = ref()

const togglePopover = () => {
  showOptions.value = !showOptions.value
}

defineExpose({
  rootRef,
  togglePopover,
})
</script>
