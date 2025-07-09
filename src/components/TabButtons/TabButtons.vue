<template>
  <RadioGroup v-model="value">
    <div class="flex space-x-1 rounded bg-surface-gray-2 h-7 p-[1px] text-sm">
      <RadioGroupOption
        as="div"
        v-for="button in buttons"
        :key="button.label"
        :disabled="button.disabled"
        :value="button.value ?? button.label"
        v-slot="{ active, checked }"
      >
        <Button
          @click="button.onClick"
          v-bind="button"
          class="!h-6"
          :class="[
            active ? 'ring-outline-gray-2 focus-visible:ring' : '',
            checked && '!bg-surface-white',
            button.disabled
              ? ''
              : checked
              ? ' text-ink-gray-9 shadow'
              : 'text-ink-gray-7',
          ]"
        >
          <RadioGroupLabel
            as="span"
            class="flex h-4 items-center"
            v-show="button.label && !button.hideLabel"
            >{{ button.label }}</RadioGroupLabel
          >
        </Button>
      </RadioGroupOption>
    </div>
  </RadioGroup>
</template>
<script>
import { RadioGroup, RadioGroupLabel, RadioGroupOption } from '@headlessui/vue'
import FeatherIcon from '../FeatherIcon.vue'

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
