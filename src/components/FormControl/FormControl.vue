<template>
  <div v-if="type != 'checkbox'" :class="rootClasses" :style="rootStyle">
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
    <Combobox
      v-else-if="type === 'combobox'"
      :id="id"
      v-bind="{ ...controlAttrs, size, variant }"
    >
      <template #prefix v-if="$slots.prefix">
        <slot name="prefix" />
      </template>
    </Combobox>
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
    <DatePicker
      v-else-if="type === 'date'"
      :input-id="id"
      v-bind="{ ...controlAttrs, size, variant, required }"
    >
      <template #prefix v-if="$slots.prefix">
        <slot name="prefix" />
      </template>
      <template #suffix v-if="$slots.suffix">
        <slot name="suffix" />
      </template>
    </DatePicker>
    <DateTimePicker
      v-else-if="type === 'datetime-local'"
      :input-id="id"
      :model-value="dateTimeModelValue"
      v-bind="{ ...dateTimeControlAttrs, size, variant, required }"
      @update:model-value="handleDateTimeUpdate"
      @change="handleDateTimeChange"
    >
      <template #prefix v-if="$slots.prefix">
        <slot name="prefix" />
      </template>
      <template #suffix v-if="$slots.suffix">
        <slot name="suffix" />
      </template>
    </DateTimePicker>
    <TimePicker
      v-else-if="type === 'time'"
      :input-id="id"
      v-bind="{ ...controlAttrs, size, variant, required }"
    >
      <template #prefix v-if="$slots.prefix">
        <slot name="prefix" />
      </template>
      <template #suffix v-if="$slots.suffix">
        <slot name="suffix" />
      </template>
    </TimePicker>

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
import { useAttrs, computed, provide, watchEffect } from 'vue'
import { useId } from '../../utils/useId'
import { TextInput } from '../TextInput'
import { Select } from '../Select'
import { Textarea } from '../Textarea'
import { Checkbox } from '../Checkbox'
import { Autocomplete } from '../Autocomplete'
import { autocompleteDeprecationSuppressed } from '../Autocomplete/deprecationKey'
import { Combobox } from '../Combobox'
import { DatePicker, DateTimePicker } from '../DatePicker'
import { TimePicker } from '../TimePicker'
import FormLabel from '../FormLabel.vue'
import { warnDeprecated } from '../../utils/warnDeprecated'
import type { StyleValue } from 'vue'
import type { FormControlProps } from './types'

defineOptions({
  inheritAttrs: false,
})

const id = useId()
const props = withDefaults(defineProps<FormControlProps>(), {
  type: 'text',
  size: 'sm',
  variant: 'subtle',
})

provide(autocompleteDeprecationSuppressed, true)

watchEffect(() => {
  if (props.type === 'autocomplete') {
    warnDeprecated('FormControl type="autocomplete"', 'Combobox')
  }
})

const attrs = useAttrs()
const rootClasses = computed(() => ['space-y-1.5', attrs.class])
const rootStyle = computed(() => attrs.style as StyleValue)

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

const dateTimeControlAttrs = computed(() => {
  let _attrs: typeof attrs = {}
  for (let key in controlAttrs.value) {
    if (
      key !== 'modelValue' &&
      key !== 'onUpdate:modelValue' &&
      key !== 'onChange'
    ) {
      _attrs[key] = controlAttrs.value[key]
    }
  }
  return _attrs
})

const dateTimeModelValue = computed<string | undefined>(() => {
  let value = controlAttrs.value.modelValue
  return typeof value === 'string' ? value.replace('T', ' ') : undefined
})

function normalizeDateTimeLocalValue(value: string) {
  if (!value) return value

  let normalized = value.replace(' ', 'T')
  let step = controlAttrs.value.step
  let keepsSeconds =
    (typeof step === 'number' && step % 60 !== 0) ||
    (typeof step === 'string' && Number(step) % 60 !== 0) ||
    /T\d{2}:\d{2}:\d{2}/.test(String(controlAttrs.value.modelValue || ''))

  if (!keepsSeconds) {
    normalized = normalized.replace(/(:\d{2})$/, '')
  }

  return normalized
}

function callAttrHandler(handler: unknown, ...args: any[]) {
  if (Array.isArray(handler)) {
    handler.forEach((fn) => callAttrHandler(fn, ...args))
    return
  }
  if (typeof handler === 'function') {
    handler(...args)
  }
}

function handleDateTimeUpdate(value: string) {
  callAttrHandler(
    controlAttrs.value['onUpdate:modelValue'],
    normalizeDateTimeLocalValue(value),
  )
}

function handleDateTimeChange(value: string) {
  callAttrHandler(
    controlAttrs.value.onChange,
    normalizeDateTimeLocalValue(value),
  )
}

const descriptionClasses = computed(() => {
  return [
    {
      sm: 'text-p-xs',
      md: 'text-p-base',
    }[props.size],
    'text-ink-gray-5',
  ]
})

defineSlots<{
  /** Custom content rendered before the input (prefix icon/content) */
  prefix?: () => any
  /** Custom content rendered after the input (suffix icon/content) */
  suffix?: () => any
  /** Custom description slot (replaces description prop) */
  description?: () => any
  /** Custom slot for autocomplete items prefix (if using Autocomplete type) */
  'item-prefix'?: (props: { item: any }) => any
  /** Default slot override for full input rendering */
  default?: () => any
}>()
</script>
