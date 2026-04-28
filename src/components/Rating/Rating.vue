<template>
  <LabelingWrapper :enabled="hasLabeling" wrapper-class="space-y-1">
    <InputLabel
      v-if="props.label || $slots.label"
      :id="labelId"
      :label="props.label"
      :required="props.required"
      class="text-p-sm font-medium text-ink-gray-7"
    >
      <template v-if="$slots.label" #default="slotProps">
        <slot name="label" v-bind="slotProps" />
      </template>
    </InputLabel>
    <div
      :id="inputId"
      class="flex"
      role="radiogroup"
      :aria-labelledby="labelledBy"
      :aria-describedby="describedBy"
      :aria-errormessage="hasError ? errorMessageId : undefined"
      :aria-required="props.required || undefined"
      :aria-invalid="hasError || undefined"
      data-slot="control"
      v-bind="dataAttrs"
    >
      <div
        v-for="index in starCount"
        :key="index"
        :class="['mr-0.5', props.readonly ? '' : 'cursor-pointer']"
        @mouseover="() => !props.readonly && (hoveredRating = index)"
        @mouseleave="() => !props.readonly && (hoveredRating = 0)"
        @click="markRating(index)"
        role="radio"
        :aria-checked="index === model"
      >
        <svg
          :class="iconClasses(index)"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"
          />
        </svg>
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
import { computed, ref, useSlots, watchEffect } from 'vue'
import { useInputLabeling } from '../../composables/useInputLabeling'
import { warnDeprecated } from '../../utils/warnDeprecated'
import InputLabel from '../InputLabeling/InputLabel.vue'
import InputDescription from '../InputLabeling/InputDescription.vue'
import InputError from '../InputLabeling/InputError.vue'
import LabelingWrapper from '../InputLabeling/LabelingWrapper.vue'
import type { RatingProps } from './types'

const props = withDefaults(defineProps<RatingProps>(), {
  size: 'md',
  readonly: false,
})

const model = defineModel<number>({ default: 0 })
const slots = useSlots()

watchEffect(() => {
  if (props.rating_from != null) {
    warnDeprecated('Rating.rating_from', 'max')
  }
})

defineSlots<{
  /** Overrides the rendered label content. Receives `{ required }`. */
  label?: (props: { required: boolean }) => any
  /** Overrides the rendered description content. */
  description?: () => any
}>()

const starCount = computed(() => props.max ?? props.rating_from ?? 5)

const hoveredRating = ref(0)

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
  disabled: () => props.readonly,
})

const iconClasses = (index: number) => {
  const sizeClass = {
    sm: 'size-4',
    md: 'size-5',
    lg: 'size-6',
    xl: 'size-7',
  }[props.size]

  let colorClass = 'text-gray-300'
  if (index <= hoveredRating.value && index > model.value) {
    colorClass = 'text-yellow-200'
  } else if (index <= model.value) {
    colorClass = 'text-yellow-500'
  }

  return [sizeClass, colorClass]
}

const markRating = (index: number) => {
  if (props.readonly) return
  model.value = index
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
