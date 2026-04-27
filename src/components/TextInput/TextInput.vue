<template>
  <LabelingWrapper
    :enabled="hasLabeling"
    :wrapper-class="['space-y-1.5', attrs.class]"
    :wrapper-style="attrs.style"
  >
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
    <div
      class="relative flex items-center"
      :class="hasLabeling ? null : (attrs.class as any)"
      :style="hasLabeling ? null : (attrs.style as any)"
    >
      <div
        :class="[
          'absolute inset-y-0 start-0 flex items-center',
          textColor,
          prefixClasses,
        ]"
        v-if="$slots.prefix"
      >
        <slot name="prefix"> </slot>
      </div>
      <input
        ref="inputRef"
        :type="type"
        :placeholder="placeholder"
        :class="inputClasses"
        :disabled="disabled"
        :id="inputId"
        :value="modelValue"
        :required="required"
        :aria-required="required || undefined"
        :aria-invalid="hasError || undefined"
        :aria-errormessage="hasError ? errorMessageId : undefined"
        :aria-describedby="describedBy"
        @input="handleChange"
        @change="handleChange"
        v-bind="attrsWithoutClassStyle"
      />
      <div
        :class="[
          'absolute inset-y-0 end-0 flex items-center',
          textColor,
          suffixClasses,
        ]"
        v-if="$slots.suffix"
      >
        <slot name="suffix"> </slot>
      </div>
    </div>
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
  </LabelingWrapper>
</template>

<script setup lang="ts">
import { computed, ref, useAttrs, useSlots } from 'vue'
import debounce from '../../utils/debounce'
import { useInputLabeling } from '../../composables/useInputLabeling'
import InputLabel from '../InputLabeling/InputLabel.vue'
import InputDescription from '../InputLabeling/InputDescription.vue'
import InputError from '../InputLabeling/InputError.vue'
import LabelingWrapper from '../InputLabeling/LabelingWrapper.vue'
import type { TextInputEmits, TextInputProps } from './types'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<TextInputProps>(), {
  type: 'text',
  size: 'sm',
  variant: 'subtle',
})

const emit = defineEmits<TextInputEmits>()
const slots = useSlots()

defineSlots<{
  /** Content rendered before the input (left side) */
  prefix?: () => any

  /** Content rendered after the input (right side) */
  suffix?: () => any

  /** Overrides the rendered label content. Receives `{ required }`. */
  label?: (props: { required: boolean }) => any

  /** Overrides the rendered description content. */
  description?: () => any
}>()

const attrs = useAttrs()

const attrsWithoutClassStyle = computed(() => {
  return Object.fromEntries(
    Object.entries(attrs).filter(([key]) => key !== 'class' && key !== 'style'),
  )
})

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

const hasLabeling = computed(() => {
  return Boolean(
    props.label ||
      props.description ||
      hasError.value ||
      slots.label ||
      slots.description,
  )
})

const inputRef = ref<HTMLInputElement | null>(null)

defineExpose({ el: inputRef })

const textColor = computed(() => {
  return props.disabled ? 'text-ink-gray-5' : 'text-ink-gray-8'
})

const inputClasses = computed(() => {
  let sizeClasses = {
    sm: 'text-base rounded h-7',
    md: 'text-base rounded h-8',
    lg: 'text-lg rounded-md h-10',
    xl: 'text-xl rounded-md h-10',
  }[props.size]

  let paddingClasses = {
    sm: [
      'py-1.5',
      slots.prefix ? 'ps-8' : 'ps-2',
      slots.suffix ? 'pe-8' : 'pe-2',
    ],
    md: [
      'py-1.5',
      slots.prefix ? 'ps-9' : 'ps-2.5',
      slots.suffix ? 'pe-9' : 'pe-2.5',
    ],
    lg: [
      'py-1.5',
      slots.prefix ? 'ps-10' : 'ps-3',
      slots.suffix ? 'pe-10' : 'pe-3',
    ],
    xl: [
      'py-1.5',
      slots.prefix ? 'ps-10' : 'ps-3',
      slots.suffix ? 'pe-10' : 'pe-3',
    ],
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
    textColor.value,
    'transition-colors w-full dark:[color-scheme:dark]',
  ]
})

let prefixClasses = computed(() => {
  return {
    sm: 'ps-2',
    md: 'ps-2.5',
    lg: 'ps-3',
    xl: 'ps-3',
  }[props.size]
})

let suffixClasses = computed(() => {
  return {
    sm: 'pe-2',
    md: 'pe-2.5',
    lg: 'pe-3',
    xl: 'pe-3',
  }[props.size]
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
</script>
