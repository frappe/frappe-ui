<template>
  <div class="inline-flex flex-col">
    <div
      class="inline-flex gap-2 rounded transition"
      :class="rowClasses"
    >
      <input
        class="rounded-sm mt-[1px] bg-surface-white"
        :class="inputClasses"
        type="checkbox"
        :disabled="disabled"
        :id="inputId"
        :checked="checked"
        :required="required"
        :aria-required="required || undefined"
        :aria-invalid="hasError || undefined"
        :aria-errormessage="hasError ? errorMessageId : undefined"
        :aria-describedby="describedBy"
        data-slot="control"
        v-bind="{ ...dataAttrs, ...attrs }"
        @change="onChange"
      />
      <InputLabel
        v-if="props.label || $slots.label"
        :id="labelId"
        :for-id="inputId"
        :label="props.label"
        :required="props.required"
        :class="labelClasses"
      >
        <template v-if="$slots.label" #default="slotProps">
          <slot name="label" v-bind="slotProps" />
        </template>
      </InputLabel>
    </div>
    <div v-if="showDescription || hasError" class="ps-6 mt-1">
      <InputDescription
        v-if="showDescription || $slots.description"
        :id="descriptionId"
        :description="props.description"
      >
        <slot v-if="$slots.description" name="description" />
      </InputDescription>
      <InputError
        v-if="hasError"
        :id="errorMessageId"
        :lines="errorLines"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, useAttrs, watchEffect } from 'vue'
import { useInputLabeling } from '../../composables/useInputLabeling'
import { warnDeprecated } from '../../utils/warnDeprecated'
import InputLabel from '../InputLabeling/InputLabel.vue'
import InputDescription from '../InputLabeling/InputDescription.vue'
import InputError from '../InputLabeling/InputError.vue'
import type { CheckboxEmits, CheckboxProps } from './types'

const props = withDefaults(defineProps<CheckboxProps>(), {
  size: 'sm',
  padding: false,
})

const emit = defineEmits<CheckboxEmits>()
const model = defineModel<boolean | 1 | 0>()
const attrs = useAttrs()

watchEffect(() => {
  if (props.padding) {
    warnDeprecated('Checkbox.padding', 'data-* styling hooks')
  }
})

const checked = computed(() => Boolean(model.value))

function onChange(e: Event) {
  const next = (e.target as HTMLInputElement).checked
  model.value = next
  emit('update:modelValue', next)
}

defineSlots<{
  /** Overrides the rendered label content. Receives `{ required }`. */
  label?: (props: { required: boolean }) => any
  /** Overrides the rendered description content. */
  description?: () => any
}>()

const {
  inputId,
  labelId,
  descriptionId,
  errorMessageId,
  describedBy,
  hasError,
  errorLines,
  showDescription,
  dataAttrs,
} = useInputLabeling(props, {
  size: () => props.size,
  disabled: () => props.disabled,
  state: () => (checked.value ? 'checked' : 'unchecked'),
})

const labelClasses = computed(() => {
  return [
    {
      sm: 'text-base',
      md: 'text-lg',
    }[props.size],
    'font-medium',
    props.disabled ? 'text-ink-gray-4' : 'text-ink-gray-8',
    'select-none',
  ]
})

const rowClasses = computed(() => {
  return {
    'px-2.5 py-1.5': props.padding && props.size === 'sm',
    'px-3 py-2': props.padding && props.size === 'md',
    'focus-within:bg-surface-gray-2 focus-within:ring-2 focus-within:ring-outline-gray-3 hover:bg-surface-gray-3 active:bg-surface-gray-4':
      props.padding && !props.disabled,
  }
})

const inputClasses = computed(() => {
  let baseClasses = props.disabled
    ? 'border-outline-gray-2 bg-surface-menu-bar text-ink-gray-3'
    : 'border-outline-gray-4 text-ink-gray-9 hover:border-outline-gray-5 focus:ring-offset-0 focus:border-outline-gray-8 active:border-outline-gray-6 transition'

  let interactionClasses = props.disabled
    ? ''
    : props.padding
      ? 'focus:ring-0'
      : 'hover:shadow-sm focus:ring-0 focus-visible:ring-2 focus-visible:ring-outline-gray-3 active:bg-surface-gray-2'

  let sizeClasses = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
  }[props.size]

  return [baseClasses, interactionClasses, sizeClasses]
})
</script>
