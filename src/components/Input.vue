<template>
  <label :class="[type == 'checkbox' ? 'flex' : 'block', $attrs.class]">
    <span
      v-if="label && type != 'checkbox'"
      class="block mb-2 text-sm leading-4 text-gray-700"
    >
      {{ label }}
    </span>
    <input
      v-if="
        ['text', 'number', 'checkbox', 'email', 'password', 'date'].includes(
          type
        )
      "
      v-bind="inputAttributes"
      class="placeholder-gray-500 border-gray-400"
      ref="input"
      :class="[
        {
          'block w-full form-input': type != 'checkbox',
          'form-checkbox': type == 'checkbox',
        },
        inputClass,
      ]"
      :type="type || 'text'"
      :disabled="disabled"
      :placeholder="placeholder"
      :value="passedInputValue"
    />
    <textarea
      v-if="type === 'textarea'"
      v-bind="inputAttributes"
      :placeholder="placeholder"
      class="placeholder-gray-500"
      :class="['block w-full resize-none form-textarea', inputClass]"
      ref="input"
      :value="passedInputValue"
      :disabled="disabled"
      :rows="rows || 3"
    ></textarea>
    <select
      v-bind="inputAttributes"
      class="block w-full form-select"
      ref="input"
      v-if="type === 'select'"
      :disabled="disabled"
    >
      <option
        v-for="option in selectOptions"
        :key="option.value"
        :value="option.value"
        :disabled="option.disabled || false"
        :selected="passedInputValue === option.value"
      >
        {{ option.label }}
      </option>
    </select>
    <span
      v-if="label && type == 'checkbox'"
      class="inline-block ml-2 text-base leading-4"
    >
      {{ label }}
    </span>
  </label>
</template>

<script>
import { debounce } from 'frappe-ui'

export default {
  name: 'Input',
  inheritAttrs: false,
  expose: ['getInputValue'],
  props: {
    label: {
      type: String,
    },
    type: {
      type: String,
      validator(value) {
        let isValid = [
          'text',
          'number',
          'checkbox',
          'textarea',
          'select',
          'email',
          'password',
          'date',
        ].includes(value)
        if (!isValid) {
          console.warn(`Invalid value "${value}" for "type" prop for Input`)
        }
        return isValid
      },
    },
    modelValue: {
      type: [String, Number, Boolean, Object, Array],
    },
    inputClass: {
      type: [String, Array, Object],
    },
    debounce: {
      type: Number,
    },
    options: {
      type: Array,
    },
    disabled: {
      type: Boolean,
    },
    rows: {
      type: Number,
    },
    placeholder: {
      type: String,
    },
  },
  emits: ['input', 'change', 'update:modelValue'],
  methods: {
    focus() {
      this.$refs.input.focus()
    },
    blur() {
      this.$refs.input.blur()
    },
    getInputValue(e) {
      let $input = e ? e.target : this.$refs.input
      let value = $input.value
      if (this.type == 'checkbox') {
        value = $input.checked
      }
      return value
    },
  },
  computed: {
    passedInputValue() {
      if ('value' in this.$attrs) {
        return this.$attrs.value
      }
      return this.modelValue || null
    },
    inputAttributes() {
      let attrs = {}
      let onInput = (e) => {
        this.$emit('input', this.getInputValue(e))
      }
      if (this.debounce) {
        onInput = debounce(onInput, this.debounce)
      }
      if (this.type == 'checkbox') {
        attrs.checked = this.passedInputValue
      }
      return Object.assign(attrs, this.$attrs, {
        onInput,
        onChange: (e) => {
          this.$emit('change', this.getInputValue(e))
          this.$emit('update:modelValue', this.getInputValue(e))
        },
      })
    },
    selectOptions() {
      return this.options
        .map((option) => {
          if (typeof option === 'string') {
            return {
              label: option,
              value: option,
            }
          }
          return option
        })
        .filter(Boolean)
    },
  },
}
</script>
<style>
.form-select {
  background-image: url("data:image/svg+xml;utf8,<svg fill='none' width='8' xmlns='http://www.w3.org/2000/svg' viewBox='-4 -2 16 16'><path d='M4.5 3.636 6.136 2l1.637 1.636M4.5 8.364 6.136 10l1.637-1.636' stroke='%23333C44' stroke-linecap='round' stroke-linejoin='round'/></svg>");
}
</style>
