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
            'flex flex-1 justify-center gap-2 whitespace-nowrap rounded-[7px] px-3 py-[5px] leading-none transition-colors focus:outline-none',
          ]"
        >
          <FeatherIcon
            class="h-4 w-4"
            v-if="button.icon"
            :name="button.icon"
            :label="button.label"
            :aria-label="button.label"
          />
          <RadioGroupLabel
            as="span"
            class="flex h-4 items-center"
            v-show="button.label && !button.hideLabel"
            >{{ button.label }}</RadioGroupLabel
          >
        </button>
      </RadioGroupOption>
    </div>
  </RadioGroup>
</template>
<script>
import { RadioGroup, RadioGroupLabel, RadioGroupOption } from '@headlessui/vue'
import FeatherIcon from './FeatherIcon.vue'

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
    FeatherIcon,
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
