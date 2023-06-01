<template>
  <Combobox v-model="selectedValue" nullable v-slot="{ open: isComboboxOpen }">
    <Popover class="w-full">
      <template #target="{ open: openPopover }">
        <div class="w-full">
          <ComboboxButton
            class="flex w-full items-center justify-between rounded-md bg-gray-100 py-1 pl-3 pr-2"
            :class="{ 'rounded-b-none': isComboboxOpen }"
            @click="() => openPopover()"
          >
            <span
              class="overflow-hidden text-ellipsis text-base leading-5"
              v-if="selectedValue"
            >
              {{ displayValue(selectedValue) }}
            </span>
            <span class="text-base leading-5 text-gray-500" v-else>
              {{ placeholder || '' }}
            </span>
            <FeatherIcon
              name="chevron-down"
              class="h-4 w-4 text-gray-500"
              aria-hidden="true"
            />
          </ComboboxButton>
        </div>
      </template>
      <template #body>
        <ComboboxOptions
          class="max-h-[15rem] overflow-y-auto rounded-md rounded-t-none bg-white px-1.5 pb-1.5 shadow-md"
          static
          v-show="isComboboxOpen"
        >
          <div
            class="items-st sticky top-0 mb-1.5 flex items-stretch space-x-1.5 bg-white pt-1.5"
          >
            <ComboboxInput
              class="form-input w-full placeholder-gray-500"
              type="text"
              @change="
                (e) => {
                  query = e.target.value
                }
              "
              :value="query"
              autocomplete="off"
              placeholder="Search by keyword"
            />
            <Button icon="x" @click="selectedValue = null" />
          </div>
          <div
            v-for="group in groups"
            :key="group.key"
            v-show="group.items.length > 0"
          >
            <div
              v-if="group.group && !group.hideLabel"
              class="px-2 py-1 text-xs font-semibold uppercase tracking-wider text-gray-500"
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
                  'rounded-md px-2.5 py-1.5 text-base',
                  { 'bg-gray-100': active },
                ]"
              >
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
        return option
      }
      return option?.label
    },
  },
}
</script>
