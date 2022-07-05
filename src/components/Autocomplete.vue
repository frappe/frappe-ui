<template>
  <Combobox v-model="selectedValue" v-slot="{ open: isComboBoxOpen }" nullable>
    <Popover class="w-full">
      <template #target="{ open: openPopover }">
        <ComboboxInput
          :displayValue="displayValue"
          :class="['w-full form-input', { 'rounded-b-none': isComboBoxOpen }]"
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
              showCombobox = true
            }
          "
          @keydown.enter="showCombobox = false"
          autocomplete="off"
          v-bind="$attrs"
        />
      </template>
      <template #body>
        <ComboboxOptions
          :class="[
            'p-1.5 bg-white rounded-md shadow-md rounded-t-none',
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
} from '@headlessui/vue'
import Popover from './Popover.vue'

export default {
  name: 'Autocomplete',
  inheritAttrs: false,
  props: ['modelValue', 'options', 'value'],
  emits: ['update:modelValue', 'change'],
  components: {
    Popover,
    Combobox,
    ComboboxInput,
    ComboboxOptions,
    ComboboxOption,
  },
  data() {
    return {
      showCombobox: false,
      query: '',
    }
  },
  computed: {
    valuePropPassed() {
      return 'value' in this.$props && this.$props.value !== undefined
    },
    selectedValue: {
      get() {
        return this.valuePropPassed ? this.value : this.modelValue
      },
      set(val) {
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
  },
}
</script>
