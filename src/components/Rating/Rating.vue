<template>
  <div class="space-y-1">
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
      :id="inputId"
      class="flex"
      role="radiogroup"
      :aria-labelledby="labelledBy"
      :aria-describedby="describedBy"
      :aria-errormessage="hasError ? errorMessageId : undefined"
      :aria-required="props.required || undefined"
      :aria-invalid="hasError || undefined"
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
        <span
          class="lucide-star block fill-gray-300 text-transparent"
          :class="iconClasses(index)"
          aria-hidden="true"
        />
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
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'
import { useInputLabeling } from '../../composables/useInputLabeling'
import { warnDeprecated } from '../../utils/warnDeprecated'
import InputLabel from '../InputLabeling/InputLabel.vue'
import InputDescription from '../InputLabeling/InputDescription.vue'
import InputError from '../InputLabeling/InputError.vue'
import type { RatingEmits, RatingProps } from './types'

const props = withDefaults(defineProps<RatingProps>(), {
  size: 'md',
  readonly: false,
})

defineEmits<RatingEmits>()
const model = defineModel<number>({ default: 0 })

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
} = useInputLabeling(props, {
  size: () => props.size,
  disabled: () => props.readonly,
})

const iconClasses = (index: number) => {
  let classes = [
    {
      sm: 'size-4',
      md: 'size-5',
      lg: 'size-6',
      xl: 'size-7',
    }[props.size],
  ]

  if (index <= hoveredRating.value && index > model.value) {
    classes.push('!fill-yellow-200')
  } else if (index <= model.value) {
    classes.push('!fill-yellow-500')
  }

  return classes.join(' ')
}

const markRating = (index: number) => {
  if (props.readonly) return
  model.value = index
}
</script>
