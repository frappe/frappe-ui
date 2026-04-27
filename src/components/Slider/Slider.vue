<script setup lang="ts">
import { computed, useSlots } from 'vue'
import { SliderRange, SliderRoot, SliderThumb, SliderTrack } from 'reka-ui'
import { useInputLabeling } from '../../composables/useInputLabeling'
import InputLabel from '../InputLabeling/InputLabel.vue'
import InputDescription from '../InputLabeling/InputDescription.vue'
import InputError from '../InputLabeling/InputError.vue'
import LabelingWrapper from '../InputLabeling/LabelingWrapper.vue'
import type { SliderEmits, SliderProps, SliderValue } from './types'

const props = withDefaults(defineProps<SliderProps>(), {
  step: 1,
  max: 100,
  min: 0,
  size: 'sm',
  disabled: false,
})

const emit = defineEmits<SliderEmits>()
const model = defineModel<SliderValue>()
const slots = useSlots()

defineSlots<{
  /** Overrides the rendered label content. Receives `{ required }`. */
  label?: (props: { required: boolean }) => any
  /** Overrides the rendered description content. */
  description?: () => any
}>()

const sliderValue = computed<SliderValue>({
  get() {
    return model.value?.length ? model.value : [props.min]
  },
  set(value) {
    model.value = value
  },
})

const {
  inputId,
  labelId,
  labelledBy,
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
})

const trackClasses = computed(() => {
  return [
    'relative grow rounded',
    props.size === 'md' ? 'h-1.5' : 'h-1',
    props.disabled ? 'bg-surface-gray-2' : 'bg-surface-gray-3',
  ]
})

const rangeClasses = computed(() => {
  return [
    'absolute h-full rounded',
    props.disabled ? 'bg-surface-gray-4' : 'bg-surface-gray-7',
  ]
})

const thumbClasses = computed(() => {
  return [
    'rounded-full bg-surface-white shadow-md ring-gray-600/20 transition-shadow duration-200 ease-out hover:ring-[6px] focus:outline-none dark:bg-surface-gray-7 dark:ring-gray-100/20',
    props.size === 'md' ? 'size-5' : 'size-4',
    props.disabled
      ? 'cursor-not-allowed opacity-60 hover:ring-0'
      : 'cursor-pointer',
  ]
})

const onValueCommit = (value: SliderValue) => {
  emit('value-commit', value)
}

const hasLabeling = computed(() => {
  return Boolean(
    props.label ||
      slots.label ||
      showDescription.value ||
      slots.description ||
      hasError.value,
  )
})
</script>

<template>
  <LabelingWrapper :enabled="hasLabeling" wrapper-class="space-y-1.5 w-full">
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
    <SliderRoot
      :id="inputId"
      v-model="sliderValue"
      class="relative flex w-full select-none touch-none items-center"
      :max="props.max"
      :min="props.min"
      :step="props.step"
      :disabled="props.disabled"
      :aria-disabled="props.disabled || undefined"
      :aria-labelledby="labelledBy"
      :aria-describedby="describedBy"
      :aria-errormessage="hasError ? errorMessageId : undefined"
      :aria-invalid="hasError || undefined"
      data-slot="control"
      v-bind="dataAttrs"
      @value-commit="onValueCommit"
    >
      <SliderTrack :class="trackClasses">
        <SliderRange :class="rangeClasses" />
      </SliderTrack>

      <SliderThumb
        v-for="(_, i) in sliderValue"
        :key="`slider-thumb-${i}`"
        :class="thumbClasses"
      />
    </SliderRoot>
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
