<template>
  <LabelingWrapper
    :enabled="hasLabeling"
    :wrapper-class="['space-y-1', attrs.class]"
    :wrapper-style="attrs.style"
  >
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
      ref="rootRef"
      class="rating-stars inline-flex shrink-0 gap-0.5 leading-none focus:outline-none"
      :class="hasLabeling ? null : (attrs.class as any)"
      :style="hasLabeling ? null : (attrs.style as any)"
      role="radiogroup"
      :aria-labelledby="labelledBy"
      :aria-describedby="describedBy"
      :aria-errormessage="hasError ? errorMessageId : undefined"
      :aria-required="props.required || undefined"
      :aria-invalid="hasError || undefined"
      :aria-readonly="props.readonly || undefined"
      data-slot="control"
      v-bind="dataAttrs"
      @mouseleave="onLeave"
    >
      <button
        v-for="index in starCount"
        :key="index"
        type="button"
        class="rating-star relative inline-flex shrink-0 focus:outline-none focus-visible:ring focus-visible:ring-outline-gray-3 rounded-sm"
        :class="[
          sizeClass,
          props.readonly ? 'cursor-default' : 'cursor-pointer',
        ]"
        data-slot="star"
        :data-index="index"
        :data-state="starState(index)"
        :tabindex="starTabindex(index)"
        role="radio"
        :aria-checked="index === savedValue"
        :aria-posinset="index"
        :aria-setsize="starCount"
        :aria-label="`${index} of ${starCount}`"
        @mousemove="onStarMove($event, index)"
        @click="onStarClick($event, index)"
      >
        <span
          class="rating-half rating-half-left"
          :data-state="halfState(index - 0.5)"
          aria-hidden="true"
        >
          <component
            :is="props.icon"
            fill="currentColor"
            :class="['rating-icon', sizeClass]"
          />
        </span>
        <span
          class="rating-half rating-half-right"
          :data-state="halfState(index)"
          aria-hidden="true"
        >
          <component
            :is="props.icon"
            fill="currentColor"
            :class="['rating-icon', sizeClass]"
          />
        </span>
      </button>
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
import { computed, ref, useAttrs, useSlots, watchEffect } from 'vue'
import { useInputLabeling } from '../../composables/useInputLabeling'
import { warnDeprecated } from '../../utils/warnDeprecated'
import InputLabel from '../InputLabeling/InputLabel.vue'
import InputDescription from '../InputLabeling/InputDescription.vue'
import InputError from '../InputLabeling/InputError.vue'
import LabelingWrapper from '../InputLabeling/LabelingWrapper.vue'
import LucideStar from '~icons/lucide/star'
import type { RatingProps } from './types'

const props = withDefaults(defineProps<RatingProps>(), {
  size: 'md',
  readonly: false,
  step: 1,
  icon: () => LucideStar,
})

const model = defineModel<number>({ default: 0 })
const slots = useSlots()
const attrs = useAttrs()

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

const hoveredValue = ref<number | null>(null)
const rootRef = ref<HTMLElement>()

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

const sizeClass = computed(
  () =>
    ({
      sm: 'size-4',
      md: 'size-5',
      lg: 'size-6',
      xl: 'size-7',
    })[props.size],
)

function roundToStep(v: number) {
  const s = props.step ?? 1
  return Math.round(v / s) * s
}

const savedValue = computed(() => {
  const v = Math.max(0, Math.min(starCount.value, model.value ?? 0))
  return roundToStep(v)
})

function halfState(half: number): 'filled' | 'preview' | 'removing' | 'empty' {
  const saved = savedValue.value
  const hovered = hoveredValue.value
  if (hovered === null) {
    return half <= saved ? 'filled' : 'empty'
  }
  if (half <= Math.min(saved, hovered)) return 'filled'
  if (half <= hovered) return 'preview'
  if (half <= saved) return 'removing'
  return 'empty'
}

function starState(index: number) {
  return halfState(index)
}

function hitTestValue(event: MouseEvent, index: number) {
  if (props.step !== 0.5) return index
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
  const isLeftHalf = event.clientX - rect.left < rect.width / 2
  return isLeftHalf ? index - 0.5 : index
}

function onStarMove(event: MouseEvent, index: number) {
  if (props.readonly) return
  hoveredValue.value = hitTestValue(event, index)
}

function onLeave() {
  hoveredValue.value = null
}

function commit(next: number) {
  const value = Math.max(0, Math.min(starCount.value, roundToStep(next)))
  model.value = value
}

function onStarClick(event: MouseEvent, index: number) {
  if (props.readonly) return
  commit(hitTestValue(event, index))
}

function starTabindex(index: number) {
  if (props.readonly) return -1
  const selected = Math.ceil(savedValue.value)
  const tabbable = selected > 0 ? selected : 1
  return index === tabbable ? 0 : -1
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

<style scoped>
.rating-star {
  background: transparent;
  padding: 0;
  border: 0;
}

.rating-half {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.rating-half-left {
  clip-path: inset(0 50% 0 0);
}

.rating-half-right {
  clip-path: inset(0 0 0 50%);
}

/* Defaults are passed as the var() fallback rather than set on
   `.rating-stars` — that way callers can override the color tokens by
   setting them on any ancestor (e.g. inline style on <Rating>), and
   inheritance wins instead of being defeated by a direct rule. */
.rating-half[data-state='filled'] {
  color: var(--rating-filled, #eab308); /* yellow-500 */
}
.rating-half[data-state='preview'] {
  color: var(--rating-preview, #fde68a); /* yellow-200 */
}
.rating-half[data-state='removing'] {
  color: var(--rating-removing, #fcd34d); /* yellow-300 */
}
.rating-half[data-state='empty'] {
  color: var(--rating-empty, #d1d5db); /* gray-300 */
}

:global([data-theme='dark']) .rating-half[data-state='empty'] {
  color: var(--rating-empty, #4b5563); /* gray-600 — visible on dark surfaces */
}

.rating-icon {
  width: 100%;
  height: 100%;
}
</style>
