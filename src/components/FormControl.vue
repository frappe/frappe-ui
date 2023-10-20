<template>
  <div v-if="type != 'checkbox'" :class="['space-y-1.5', attrs.class]">
    <label class="block" :class="labelClasses" v-if="label" :for="id">
      {{ label }}
    </label>
    <Select
      v-if="type === 'select'"
      :id="id"
      v-bind="{ ...controlAttrs, size }"
    >
      <template #prefix v-if="$slots.prefix">
        <slot name="prefix" />
      </template>
    </Select>
    <Autocomplete
      v-else-if="type === 'autocomplete'"
      v-bind="{ ...controlAttrs }"
    >
      <template #prefix v-if="$slots.prefix">
        <slot name="prefix" />
      </template>
      <template #item-prefix="itemPrefixProps" v-if="$slots['item-prefix']">
        <slot name="item-prefix" v-bind="itemPrefixProps" />
      </template>
    </Autocomplete>
    <Textarea
      v-else-if="type === 'textarea'"
      :id="id"
      v-bind="{ ...controlAttrs, size }"
    />
    <TextInput v-else :id="id" v-bind="{ ...controlAttrs, type, size }">
      <template #prefix v-if="$slots.prefix">
        <slot name="prefix" />
      </template>
      <template #suffix v-if="$slots.suffix">
        <slot name="suffix" />
      </template>
    </TextInput>
    <slot name="description">
      <p v-if="description" :class="descriptionClasses">{{ description }}</p>
    </slot>
  </div>
  <Checkbox
    v-else
    :id="id"
    v-bind="{ ...controlAttrs, label, size, class: attrs.class }"
  />
</template>
<script setup lang="ts">
import { useAttrs, computed } from 'vue'
import { useId } from '../utils/useId'
import TextInput from './TextInput.vue'
import type { TextInputTypes } from './types/TextInput'
import Select from './Select.vue'
import Textarea from './Textarea.vue'
import Checkbox from './Checkbox.vue'
import Autocomplete from './Autocomplete.vue'

interface FormControlProps {
  label?: string
  description?: string
  type?: TextInputTypes | 'textarea' | 'select' | 'checkbox' | 'autocomplete'
  size?: 'sm' | 'md'
}

const id = useId()
const props = withDefaults(defineProps<FormControlProps>(), {
  type: 'text',
  size: 'sm',
})

const attrs = useAttrs()
const controlAttrs = computed(() => {
  // pass everything except class and style
  let _attrs: typeof attrs = {}
  for (let key in attrs) {
    if (key !== 'class' && key !== 'style') {
      _attrs[key] = attrs[key]
    }
  }
  return _attrs
})

const labelClasses = computed(() => {
  return [
    {
      sm: 'text-xs',
      md: 'text-base',
    }[props.size],
    'text-gray-600',
  ]
})

const descriptionClasses = computed(() => {
  return [
    {
      sm: 'text-xs',
      md: 'text-base',
    }[props.size],
    'text-gray-600',
  ]
})
</script>
<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>
