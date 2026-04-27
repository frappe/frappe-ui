<template>
  <div class="space-y-1.5">
    <InputLabel
      v-if="props.label || $slots.label"
      :id="labelId"
      :for-id="inputId"
      :label="props.label"
      :required="props.required"
      class="text-p-sm font-medium text-ink-gray-7"
    >
      <template v-if="$slots.label" #default="slotProps">
        <slot name="label" v-bind="slotProps" />
      </template>
    </InputLabel>
    <textarea
      ref="textareaRef"
      :placeholder="placeholder"
      :class="inputClasses"
      :disabled="disabled"
      :id="inputId"
      :value="modelValue"
      :rows="rows"
      :required="required"
      :aria-required="required || undefined"
      :aria-invalid="hasError || undefined"
      :aria-errormessage="hasError ? errorMessageId : undefined"
      :aria-describedby="describedBy"
      @input="handleChange"
      @change="handleChange"
      v-bind="attrs"
    />
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
</template>

<script setup lang="ts">
import { computed, ref, useAttrs } from 'vue'
import debounce from '../../utils/debounce'
import { useInputLabeling } from '../../composables/useInputLabeling'
import InputLabel from '../InputLabeling/InputLabel.vue'
import InputDescription from '../InputLabeling/InputDescription.vue'
import InputError from '../InputLabeling/InputError.vue'
import type { TextareaEmits, TextareaProps } from './types'

const props = withDefaults(defineProps<TextareaProps>(), {
  size: 'sm',
  variant: 'subtle',
  rows: 3,
})

const emit = defineEmits<TextareaEmits>()
const attrs = useAttrs()
const textareaRef = ref<HTMLTextAreaElement | null>(null)

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
} = useInputLabeling(props, {
  size: () => props.size,
  variant: () => props.variant,
  disabled: () => props.disabled,
})

const inputClasses = computed(() => {
  let sizeClasses = {
    sm: 'text-base rounded',
    md: 'text-base rounded',
    lg: 'text-lg rounded-md',
    xl: 'text-xl rounded-md',
  }[props.size]

  let paddingClasses = {
    sm: ['py-1.5 px-2'],
    md: ['py-1.5 px-2.5'],
    lg: ['py-1.5 px-3'],
    xl: ['py-1.5 px-3'],
  }[props.size]

  let variant = props.disabled ? 'disabled' : props.variant
  let variantClasses = {
    subtle:
      'border border-[--surface-gray-2] bg-surface-gray-2 placeholder-ink-gray-4 hover:border-outline-gray-modals hover:bg-surface-gray-3 focus:bg-surface-white focus:border-outline-gray-4 focus:shadow-sm focus:ring-0 focus-visible:ring-2 focus-visible:ring-outline-gray-3',
    outline:
      'border border-outline-gray-2 bg-surface-white placeholder-ink-gray-4 hover:border-outline-gray-3 hover:shadow-sm focus:bg-surface-white focus:border-outline-gray-4 focus:shadow-sm focus:ring-0 focus-visible:ring-2 focus-visible:ring-outline-gray-3',
    disabled: [
      'border bg-surface-gray-1 placeholder-ink-gray-3',
      props.variant === 'outline'
        ? 'border-outline-gray-2'
        : 'border-transparent',
    ],
    ghost: 'border-0 focus:ring-0 focus-visible:ring-0',
  }[variant]

  return [
    sizeClasses,
    paddingClasses,
    variantClasses,
    props.disabled ? 'text-ink-gray-5' : 'text-ink-gray-8',
    'transition-colors w-full block',
  ]
})

let emitChange = (value: string) => {
  emit('update:modelValue', value)
}
if (props.debounce) {
  emitChange = debounce(emitChange, props.debounce)
}

let handleChange = (e: Event) => {
  emitChange((e.target as HTMLInputElement).value)
}

defineExpose({ el: textareaRef })
</script>
