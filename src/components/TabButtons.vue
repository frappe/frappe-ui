<template>
  <RadioGroup v-model="value">
    <div class="flex space-x-1 rounded bg-gray-100 p-0.5 text-sm">
      <RadioGroupOption
        as="template"
        v-for="button in buttons"
        :key="button.label"
        :value="button.value ?? button.label"
        v-slot="{ active, checked }"
      >
        <button
          :class="[
            active ? 'ring-gray-300 focus-visible:ring' : '',
            checked ? 'bg-white text-gray-900 shadow' : 'text-gray-700',
            'rounded-[7px] px-2 py-1.5 leading-none transition-colors focus:outline-none',
          ]"
        >
          <RadioGroupLabel as="span">{{ button.label }}</RadioGroupLabel>
        </button>
      </RadioGroupOption>
    </div>
  </RadioGroup>
</template>
<script>
import { RadioGroup, RadioGroupOption, RadioGroupLabel } from '@headlessui/vue'
export default {
  name: 'TabButtons',
  props: {
    buttons: {
      type: Array,
      required: true,
    },
    modelValue: {
      type: [String, Boolean, Number],
    },
  },
  emits: ['update:modelValue'],
  components: {
    RadioGroup,
    RadioGroupOption,
    RadioGroupLabel,
  },
  computed: {
    value: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit('update:modelValue', value)
      },
    },
  },
}
</script>
