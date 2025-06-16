<template>
  <div
    v-if="type != 'checkbox'"
    :class="['space-y-1.5', attrs.class]"
    :style="attrs.style"
  >
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
      v-bind="{ ...controlAttrs, size, variant }"
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
      v-bind="{ ...controlAttrs, size, variant }"
    />
    <TextInput
      v-else
      :id="id"
      v-bind="{ ...controlAttrs, type, size, variant, required }"
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
  />
</template>
<script setup lang="ts">
import { useAttrs, computed } from 'vue'
import { useId } from '../../utils/useId'
import { TextInput } from '../TextInput'
import { Select } from '../Select'
import { Textarea } from '../Textarea'
import { Checkbox } from '../Checkbox'
import { Autocomplete } from '../Autocomplete'
import FormLabel from '../FormLabel.vue'
import type { FormControlProps } from './types'

const id = useId()
const props = withDefaults(defineProps<FormControlProps>(), {
  type: 'text',
  size: 'sm',
  variant: 'subtle',
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
