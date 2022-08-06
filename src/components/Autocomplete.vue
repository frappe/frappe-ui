<template>
  <Combobox v-model="selectedValue" nullable>
    <Popover class="w-full">
      <template #target="{ open: openPopover }">
        <div class="relative w-full">
          <ComboboxInput
            :displayValue="displayValue"
            class="w-full placeholder-gray-500 form-input"
            type="text"
            @change="
              (e) => {
                query = e.target.value
                openPopover()
              }
            "
            @focus="
              () => {
                openPopover()
                toggleCombobox(true)
              }
            "
            @keydown="toggleCombobox(true)"
            autocomplete="off"
            v-bind="$attrs"
          />
          <ComboboxButton
            class="absolute inset-y-0 right-0 flex items-center pr-2"
          >
            <FeatherIcon
              name="chevron-down"
              class="w-4 h-4 text-gray-500"
              aria-hidden="true"
            />
          </ComboboxButton>
        </div>
      </template>
      <template #body>
        <ComboboxOptions
          :class="[
            'p-1.5 bg-white rounded-md shadow-md rounded-t-none max-h-[11rem] overflow-y-auto',
            { hidden: !showCombobox },
          ]"
          :static="true"
        >
          <ComboboxOption
            as="template"
            v-for="option in filteredOptions"
            :key="option.value"
            :value="option"
            v-slot="{ active, selected }"
          >
            <li
              :class="[
                'px-2.5 py-1.5 rounded-md text-base',
                { 'bg-gray-100': active },
              ]"
            >
              {{ option.label }}
            </li>
          </ComboboxOption>
          <li
            v-if="filteredOptions.length == 0"
            class="px-2.5 py-1.5 rounded-md text-base text-gray-600"
          >
            No results found
          </li>
        </ComboboxOptions>
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

export default {
  name: 'Autocomplete',
  inheritAttrs: false,
  props: ['modelValue', 'options'],
  emits: ['update:modelValue', 'change'],
  components: {
    Popover,
    Combobox,
    ComboboxInput,
    ComboboxOptions,
    ComboboxOption,
    ComboboxButton,
  },
  data() {
    return {
      showCombobox: false,
      query: '',
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
        setTimeout(() => this.toggleCombobox(false), 0)
        this.$emit(this.valuePropPassed ? 'change' : 'update:modelValue', val)
      },
    },
    filteredOptions() {
      if (!this.query) {
        return this.options
      }
      return this.options.filter((option) => {
        let searchTexts = [option.label, option.value]
        return searchTexts.some((text) =>
          (text || '').toLowerCase().includes(this.query.toLowerCase())
        )
      })
    },
  },
  methods: {
    displayValue(option) {
      if (typeof option === 'string') {
        return option
      }
      return option?.label
    },
    toggleCombobox(value) {
      value = Boolean(value)
      if (this.showCombobox !== value) {
        this.showCombobox = value
      }
    },
  },
}
</script>
