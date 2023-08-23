<template>
  <Combobox v-model="selectedValue" nullable v-slot="{ open: isComboboxOpen }">
    <Popover class="w-full" v-model:show="showOptions">
      <template #target="{ open: openPopover, togglePopover }">
        <slot name="target" v-bind="{ open: openPopover, togglePopover }">
          <div class="w-full">
            <button
              class="flex h-7 w-full items-center justify-between gap-2 rounded bg-gray-100 px-2 py-1 transition-colors hover:bg-gray-200 focus:ring-2 focus:ring-gray-400"
              :class="{ 'bg-gray-200': isComboboxOpen }"
              @click="() => togglePopover()"
            >
              <div class="flex items-center">
                <slot name="prefix" />
                <span
                  class="overflow-hidden text-ellipsis whitespace-nowrap text-base leading-5"
                  v-if="selectedValue"
                >
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
      <template #body="{ isOpen }">
        <div v-show="isOpen">
          <ComboboxOptions
            class="mt-1 max-h-[15rem] overflow-y-auto rounded-lg bg-white px-1.5 pb-1.5 shadow-2xl"
            static
          >
            <div
              class="sticky top-0 z-10 flex items-stretch space-x-1.5 bg-white pt-1.5"
            >
              <div class="relative w-full">
                <ComboboxInput
                  ref="search"
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
                  @click="selectedValue = null"
                >
                  <FeatherIcon name="x" class="w-4" />
                </button>
              </div>
            </div>
            <div
              class="mt-1.5"
              v-for="group in groups"
              :key="group.key"
              v-show="group.items.length > 0"
            >
              <div
                v-if="group.group && !group.hideLabel"
                class="px-2.5 py-1.5 text-sm font-medium text-gray-500"
              >
                {{ group.group }}
              </div>
              <ComboboxOption
                as="template"
                v-for="option in group.items"
                :key="option.value"
                :value="option"
                v-slot="{ active, selected }"
              >
                <li
                  :class="[
                    'flex items-center rounded px-2.5 py-1.5 text-base',
                    { 'bg-gray-100': active },
                  ]"
                >
                  <slot
                    name="item-prefix"
                    v-bind="{ active, selected, option }"
                  />
                  {{ option.label }}
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
        </div>
      </template>
    </Popover>
  </Combobox>
</template>
<script>
import {
  Combobox,
  ComboboxInput,
  ComboboxOptions,
  ComboboxOption,
  ComboboxButton,
} from '@headlessui/vue'
import Popover from './Popover.vue'
import Button from './Button.vue'
import FeatherIcon from './FeatherIcon.vue'

export default {
  name: 'Autocomplete',
  props: ['modelValue', 'options', 'placeholder'],
  emits: ['update:modelValue', 'update:query', 'change'],
  components: {
    Popover,
    Button,
    FeatherIcon,
    Combobox,
    ComboboxInput,
    ComboboxOptions,
    ComboboxOption,
    ComboboxButton,
  },
  data() {
    return {
      query: '',
      showOptions: false,
    }
  },
  computed: {
    valuePropPassed() {
      return 'value' in this.$attrs
    },
    selectedValue: {
      get() {
        return this.valuePropPassed ? this.$attrs.value : this.modelValue
      },
      set(val) {
        this.query = ''
        if (val) {
          this.showOptions = false
        }
        this.$emit(this.valuePropPassed ? 'change' : 'update:modelValue', val)
      },
    },
    groups() {
      if (!this.options || this.options.length == 0) return []

      let groups = this.options[0]?.group
        ? this.options
        : [{ group: '', items: this.options }]

      return groups
        .map((group, i) => {
          return {
            key: i,
            group: group.group,
            hideLabel: group.hideLabel || false,
            items: this.filterOptions(group.items),
          }
        })
        .filter((group) => group.items.length > 0)
    },
  },
  watch: {
    query(q) {
      this.$emit('update:query', q)
    },
    showOptions(val) {
      if (val) {
        this.$nextTick(() => {
          this.$refs.search.el.focus()
        })
      }
    },
  },
  methods: {
    filterOptions(options) {
      if (!this.query) {
        return options
      }
      return options.filter((option) => {
        let searchTexts = [option.label, option.value]
        return searchTexts.some((text) =>
          (text || '')
            .toString()
            .toLowerCase()
            .includes(this.query.toLowerCase())
        )
      })
    },
    displayValue(option) {
      if (typeof option === 'string') {
        let allOptions = this.groups.flatMap((group) => group.items)
        let selectedOption = allOptions.find((o) => o.value === option)
        return selectedOption?.label || option
      }
      return option?.label
    },
  },
}
</script>
