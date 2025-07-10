<template>
  <Combobox
    v-model="selectedValue"
    :multiple="multiple"
    nullable
    v-slot="{ open: isComboboxOpen }"
  >
    <Popover
      class="w-full"
      v-model:show="showOptions"
      ref="rootRef"
      :placement="placement"
    >
      <template
        #target="{ open: openPopover, togglePopover, close: closePopover }"
      >
        <slot
          name="target"
          v-bind="{
            open: openPopover,
            close: closePopover,
            togglePopover,
            isOpen: isComboboxOpen,
          }"
        >
          <div class="w-full space-y-1.5">
            <label v-if="props.label" class="block text-xs text-ink-gray-5">
              {{ props.label }}
            </label>
            <button
              class="flex h-7 w-full items-center justify-between gap-2 rounded bg-surface-gray-2 px-2 py-1 transition-colors hover:bg-surface-gray-3 border border-transparent focus:border-outline-gray-4 focus:outline-none focus:ring-2 focus:ring-outline-gray-3"
              :class="{ 'bg-surface-gray-3': isComboboxOpen }"
              @click="() => togglePopover()"
            >
              <div class="flex items-center overflow-hidden">
                <slot name="prefix" />
                <span
                  class="truncate text-base leading-5 text-ink-gray-8"
                  v-if="displayValue"
                >
                  {{ displayValue }}
                </span>
                <span class="text-base leading-5 text-ink-gray-4" v-else>
                  {{ placeholder || '' }}
                </span>
                <slot name="suffix" />
              </div>
              <FeatherIcon
                name="chevron-down"
                class="h-4 w-4 text-ink-gray-5"
                aria-hidden="true"
              />
            </button>
          </div>
        </slot>
      </template>
      <template #body="{ isOpen, togglePopover }">
        <div v-show="isOpen">
          <div
            class="relative mt-1 rounded-lg bg-surface-modal text-base shadow-2xl"
            :class="bodyClasses"
          >
            <ComboboxOptions
              class="max-h-[15rem] overflow-y-auto px-1.5 pb-1.5"
              :class="{ 'pt-1.5': hideSearch }"
              static
            >
              <div
                v-if="!hideSearch"
                class="sticky top-0 z-10 flex items-stretch space-x-1.5 bg-surface-modal py-1.5"
              >
                <div class="relative w-full">
                  <ComboboxInput
                    ref="searchInput"
                    class="form-input w-full focus:bg-surface-gray-3 hover:bg-surface-gray-4 text-ink-gray-8"
                    type="text"
                    :value="query"
                    @change="query = $event.target.value"
                    autocomplete="off"
                    placeholder="Search"
                  />
                  <div
                    class="absolute right-0 inline-flex h-7 w-7 items-center justify-center"
                  >
                    <LoadingIndicator
                      v-if="props.loading"
                      class="h-4 w-4 text-ink-gray-5"
                    />
                    <button v-else @click="clearAll">
                      <FeatherIcon name="x" class="w-4 text-ink-gray-8" />
                    </button>
                  </div>
                </div>
              </div>
              <div
                v-for="group in groups"
                :key="group.key"
                v-show="group.items.length > 0"
              >
                <div
                  v-if="group.group && !group.hideLabel"
                  class="sticky top-10 truncate bg-surface-modal px-2.5 py-1.5 text-sm font-medium text-ink-gray-5"
                >
                  {{ group.group }}
                </div>
                <ComboboxOption
                  as="template"
                  v-for="(option, idx) in group.items.slice(0, 50)"
                  :key="idx"
                  :value="option"
                  :disabled="option.disabled"
                  v-slot="{ active, selected }"
                >
                  <li
                    :class="[
                      'flex cursor-pointer items-center justify-between rounded px-2.5 py-1.5 text-base',
                      {
                        'bg-surface-gray-3': active,
                        'opacity-50': option.disabled,
                      },
                    ]"
                  >
                    <div class="flex flex-1 gap-2 overflow-hidden items-center">
                      <div
                        v-if="$slots['item-prefix'] || props.multiple"
                        class="flex flex-shrink-0"
                      >
                        <slot
                          name="item-prefix"
                          v-bind="{ active, selected, option }"
                        >
                          <FeatherIcon
                            name="check"
                            v-if="isOptionSelected(option)"
                            class="h-4 w-4 text-ink-gray-7"
                          />
                          <div v-else class="h-4 w-4" />
                        </slot>
                      </div>
                      <span class="flex-1 truncate text-ink-gray-7">
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
                          class="text-sm text-ink-gray-5"
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
                class="rounded-md px-2.5 py-1.5 text-base text-ink-gray-5"
              >
                No results found
              </li>
            </ComboboxOptions>

            <div
              v-if="$slots.footer || props.showFooter || multiple"
              class="border-t p-1"
            >
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
                  />
                </div>
                <div v-else class="flex items-center justify-end">
                  <Button label="Clear" @click.stop="clearAll" />
                </div>
              </slot>
            </div>
          </div>
        </div>
      </template>
    </Popover>
  </Combobox>
</template>

<script setup lang="ts">
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from '@headlessui/vue'
import { computed, nextTick, ref, watch } from 'vue'
import { Popover } from '../Popover'
import { Button } from '../Button'
import FeatherIcon from '../FeatherIcon.vue'
import LoadingIndicator from '../LoadingIndicator.vue'
import type {
  AutocompleteOptionGroup,
  AutocompleteOption,
  AutocompleteProps,
  Option,
} from './types'

const props = withDefaults(defineProps<AutocompleteProps>(), {
  multiple: false,
  hideSearch: false,
})
const emit = defineEmits(['update:modelValue', 'update:query', 'change'])

const searchInput = ref()
const showOptions = ref(false)
const query = ref('')

const groups = computed(() => {
  if (!props.options?.length) return []

  let groups: AutocompleteOptionGroup[]
  if (isOptionGroup(props.options[0])) {
    groups = props.options as AutocompleteOptionGroup[]
  } else {
    groups = [
      {
        group: '',
        items: sanitizeOptions(props.options as AutocompleteOption[]),
        hideLabel: false,
      },
    ]
  }

  return groups
    .map((group, i) => {
      return {
        key: i,
        group: group.group,
        hideLabel: group.hideLabel,
        items: filterOptions(sanitizeOptions(group.items || [])),
      }
    })
    .filter((group) => group.items.length > 0)
})

const allOptions = computed(() => {
  return groups.value.flatMap((group) => group.items)
})

const sanitizeOptions = (options: AutocompleteOption[]) => {
  if (!options) return []
  // in case the options are just values, convert them to objects
  return options.map((option) => {
    return isOption(option)
      ? option
      : { label: option.toString(), value: option }
  })
}

const filterOptions = (options: Option[]) => {
  if (!query.value) return options
  return options.filter((option) => {
    return (
      option.label.toLowerCase().includes(query.value.trim().toLowerCase()) ||
      option.value
        .toString()
        .toLowerCase()
        .includes(query.value.trim().toLowerCase())
    )
  })
}

const selectedValue = computed({
  get() {
    if (!props.multiple) {
      return (
        findOption(props.modelValue as AutocompleteOption) ||
        // if the modelValue is not found in the option list
        // return the modelValue as is
        makeOption(props.modelValue as AutocompleteOption)
      )
    }
    // in case of `multiple`, modelValue is an array of values
    // if the modelValue is a list of values, convert them to options
    const values = (props.modelValue || []) as AutocompleteOption[]
    return isOption(values[0])
      ? values
      : values.map((v) => findOption(v) || makeOption(v))
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

const findOption = (option: AutocompleteOption) => {
  if (!option) return option
  const value = isOption(option) ? option.value : option
  return allOptions.value.find((o) => o.value === value)
}

const makeOption = (option: AutocompleteOption) => {
  return isOption(option) ? option : { label: option, value: option }
}

const getLabel = (option: AutocompleteOption) => {
  if (isOption(option)) {
    return option?.label || option?.value
  }
  return option
}

const displayValue = computed(() => {
  if (!selectedValue.value) return ''
  if (!props.multiple) {
    return getLabel(selectedValue.value as AutocompleteOption)
  }
  return (selectedValue.value as AutocompleteOption[])
    .map((v) => getLabel(v))
    .join(', ')
})

const isOptionSelected = (option: AutocompleteOption) => {
  if (!selectedValue.value) return false
  const value = isOption(option) ? option.value : option
  if (!props.multiple) {
    return selectedValue.value === value
  }
  return (selectedValue.value as AutocompleteOption[]).find((v) =>
    isOption(v) ? v.value === value : v === value,
  )
}

const areAllOptionsSelected = computed(() => {
  if (!props.multiple) return false
  return (
    allOptions.value.length ===
    (selectedValue.value as AutocompleteOption[])?.length
  )
})

const selectAll = () => {
  selectedValue.value = allOptions.value
}

const clearAll = () => {
  selectedValue.value = props.multiple ? [] : undefined
}

const isOption = (option: AutocompleteOption) => {
  return typeof option === 'object'
}

const isOptionGroup = (option: any) => {
  return typeof option === 'object' && 'items' in option && 'group' in option
}

watch(
  () => query.value,
  () => {
    emit('update:query', query.value)
  },
)

watch(
  () => showOptions.value,
  () => {
    if (showOptions.value) {
      nextTick(() => searchInput.value?.$el.focus())
    }
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
