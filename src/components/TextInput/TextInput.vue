<template>
  <LabelingWrapper
    :enabled="hasLabeling"
    :wrapper-class="['space-y-1.5', attrs.class]"
    :wrapper-style="attrs.style as StyleValue"
  >
    <InputLabel
      v-if="props.label || $slots.label"
      :id="labelId"
      :for-id="inputId"
      :label="props.label"
      :required="props.required"
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
        data-slot="control"
        autocomplete="off"
        v-bind="{ ...dataAttrs, ...attrsWithoutClassStyle }"
        @input="handleChange"
        @change="handleChange"
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
    <InputError v-if="hasError" :id="errorMessageId" :lines="errorLines" />
  </LabelingWrapper>
</template>

<script setup lang="ts">
import { computed, ref, useAttrs } from 'vue'
import type { StyleValue } from 'vue'
import debounce from '../../utils/debounce'
import { useInputClasses } from '../../composables/useInputClasses'
import { useInputLabeling } from '../../composables/useInputLabeling'
import { useReactiveSlots } from '../../composables/useReactiveSlots'
import InputLabel from '../InputLabeling/InputLabel.vue'
import InputDescription from '../InputLabeling/InputDescription.vue'
import InputError from '../InputLabeling/InputError.vue'
import LabelingWrapper from '../InputLabeling/LabelingWrapper.vue'
import type { TextInputEmits, TextInputExposed, TextInputProps } from './types'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<TextInputProps>(), {
  type: 'text',
  size: 'sm',
  variant: 'subtle',
})

const emit = defineEmits<TextInputEmits>()
const slots = useReactiveSlots<typeof declaredSlots>()

const declaredSlots = defineSlots<{
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
  dataAttrs,
} = useInputLabeling(props, {
  size: () => props.size,
  variant: () => props.variant,
  disabled: () => props.disabled,
  hasLabelSlot: () => Boolean(slots.label),
  hasDescriptionSlot: () => Boolean(slots.description),
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

const { inputClasses, textColor, prefixClasses, suffixClasses } =
  useInputClasses({
    size: () => props.size,
    variant: () => props.variant,
    disabled: () => props.disabled,
    hasPrefix: () => Boolean(slots.prefix),
    hasSuffix: () => Boolean(slots.suffix),
    component: 'TextInput',
  })

const inputRef = ref<HTMLInputElement | null>(null)

function focus(options?: FocusOptions) {
  inputRef.value?.focus(options)
}

// A getter rather than `computed(...)`: Vue unwraps a handed-back ref/computed
// at the proxy boundary regardless, but `defineExpose<TextInputExposed>`
// type-checks the object literal itself, and a ComputedRef doesn't
// structurally match the plain `HTMLInputElement | null` the type declares.
defineExpose<TextInputExposed>({
  focus,
  get inputElement() {
    return inputRef.value
  },
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
