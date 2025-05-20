<template>
  <div v-if="type != 'checkbox'" :class="['space-y-1.5', attrs.class]">
    <FormLabel
      v-if="label"
      :label="label"
      :size="size"
      :id="id"
      :required="required"
    />
    <Select
      v-if="type === 'select'"
      :id="id"
      v-bind="{ ...controlAttrs, size }"
      v-model="model"
    >
      <template #prefix v-if="$slots.prefix">
        <slot name="prefix" />
      </template>
    </Select>
    <Autocomplete
      v-else-if="type === 'autocomplete'"
      v-bind="{ ...controlAttrs }"
      v-model="model"
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
      v-model="model"
    />
    <TextInput
      v-else
      :id="id"
      v-bind="{ ...controlAttrs, type, size, required }"
      v-model="model"
    >
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
    v-model="model"
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
import FormLabel from './FormLabel.vue'

interface FormControlProps {
  label?: string
  description?: string
  type?: TextInputTypes | 'textarea' | 'select' | 'checkbox' | 'autocomplete'
  size?: 'sm' | 'md'
  required?: boolean
}

const id = useId()
const props = withDefaults(defineProps<FormControlProps>(), {
  type: 'text',
  size: 'sm',
})

const model = defineModel()

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

const descriptionClasses = computed(() => {
  return [
    {
      sm: 'text-xs',
      md: 'text-base',
    }[props.size],
    'text-ink-gray-5',
  ]
})
</script>
<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>
