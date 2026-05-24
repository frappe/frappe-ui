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
      class="rating-stars inline-flex shrink-0 gap-0.5 leading-none rounded-sm focus:outline-none focus-visible:focus-ring"
      :class="hasLabeling ? null : (attrs.class as any)"
      :style="hasLabeling ? null : (attrs.style as any)"
      :role="isSliderMode ? 'slider' : 'radiogroup'"
      :tabindex="rootTabindex"
      :aria-labelledby="labelledBy"
      :aria-describedby="describedBy"
      :aria-errormessage="hasError ? errorMessageId : undefined"
      :aria-required="props.required || undefined"
      :aria-invalid="hasError || undefined"
      :aria-disabled="isDisabled || undefined"
      :aria-orientation="isSliderMode ? 'horizontal' : undefined"
      :aria-valuemin="isSliderMode ? 0 : undefined"
      :aria-valuemax="isSliderMode ? starCount : undefined"
      :aria-valuenow="isSliderMode ? savedValue : undefined"
      :aria-valuetext="isSliderMode ? formatValue(savedValue) : undefined"
      data-slot="control"
      v-bind="dataAttrs"
      @mouseleave="onLeave"
      @keydown="onKeydown"
    >
      <button
        v-for="index in starCount"
        :key="index"
        type="button"
        class="rating-star relative inline-flex shrink-0 focus:outline-none focus-visible:focus-ring rounded-sm"
        :class="[
          sizeClass,
          isDisabled ? 'cursor-default' : 'cursor-pointer',
        ]"
        data-slot="star"
        :data-index="index"
        :data-state="starState(index)"
        :tabindex="starTabindex(index)"
        :role="isSliderMode ? undefined : 'radio'"
        :aria-checked="isSliderMode ? undefined : index === savedValue"
        :aria-posinset="isSliderMode ? undefined : index"
        :aria-setsize="isSliderMode ? undefined : starCount"
        :aria-label="isSliderMode ? undefined : `${index} of ${starCount}`"
        @pointermove="onStarMove($event, index)"
        @click="onStarClick($event, index)"
        @focus="focusedIndex = index"
      >
        <span
          class="rating-half rating-half-left"
          :class="halfColorClass(halfState(index - 0.5))"
          :data-state="halfState(index - 0.5)"
          aria-hidden="true"
        >
          <slot
            name="icon"
            :index="index"
            side="left"
            :state="halfState(index - 0.5)"
            :left-state="halfState(index - 0.5)"
            :right-state="halfState(index)"
            :value="savedValue"
            :preview-value="hoveredValue"
            :max="starCount"
          >
            <span
              v-if="typeof props.icon === 'string'"
              :class="[props.icon, 'rating-icon', sizeClass]"
            />
            <component
              v-else
              :is="props.icon"
              fill="currentColor"
              :class="['rating-icon', sizeClass]"
            />
          </slot>
        </span>
        <span
          class="rating-half rating-half-right"
          :class="halfColorClass(halfState(index))"
          :data-state="halfState(index)"
          aria-hidden="true"
        >
          <slot
            name="icon"
            :index="index"
            side="right"
            :state="halfState(index)"
            :left-state="halfState(index - 0.5)"
            :right-state="halfState(index)"
            :value="savedValue"
            :preview-value="hoveredValue"
            :max="starCount"
          >
            <span
              v-if="typeof props.icon === 'string'"
              :class="[props.icon, 'rating-icon', sizeClass]"
            />
            <component
              v-else
              :is="props.icon"
              fill="currentColor"
              :class="['rating-icon', sizeClass]"
            />
          </slot>
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
import { computed, ref, useAttrs, useSlots, watchEffect, nextTick } from 'vue'
import { useInputLabeling } from '../../composables/useInputLabeling'
import { warnDeprecated } from '../../utils/warnDeprecated'
import InputLabel from '../InputLabeling/InputLabel.vue'
import InputDescription from '../InputLabeling/InputDescription.vue'
import InputError from '../InputLabeling/InputError.vue'
import LabelingWrapper from '../InputLabeling/LabelingWrapper.vue'
import LucideStar from '~icons/lucide/star'
import type { RatingProps, RatingIconSlotProps } from './types'

const props = withDefaults(defineProps<RatingProps>(), {
  size: 'md',
  disabled: false,
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
  if (props.readonly === true) {
    warnDeprecated('Rating.readonly', 'disabled')
  }
})

const isDisabled = computed(() => props.disabled || props.readonly === true)

defineSlots<{
  /** Overrides the rendered label content. Receives `{ required }`. */
  label?: (props: { required: boolean }) => any
  /** Overrides the rendered description content. */
  description?: () => any
  /**
   * Overrides the per-star icon. Called once per star and stamped into both
   * half-spans (so half-step clipping still works). Use `state` to color the
   * icon, or `index` to render different content per position (e.g. emojis).
   */
  icon?: (props: RatingIconSlotProps) => any
}>()

const starCount = computed(() => props.max ?? props.rating_from ?? 5)
const isSliderMode = computed(() => props.step === 0.5)

const hoveredValue = ref<number | null>(null)
const focusedIndex = ref<number>(0)
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
  disabled: () => isDisabled.value,
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

function halfColorClass(state: 'filled' | 'preview' | 'removing' | 'empty') {
  switch (state) {
    case 'filled':
      return 'text-yellow-500'
    case 'preview':
      return 'text-yellow-200'
    case 'removing':
      return 'text-yellow-300'
    case 'empty':
      return 'text-gray-300 dark:text-gray-600'
  }
}

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

function formatValue(v: number) {
  if (v == null) return ''
  const max = starCount.value
  const display = v % 1 === 0 ? String(v) : v.toFixed(1)
  if (v === 0) return `No rating, out of ${max} stars`
  return `${display} of ${max} stars`
}

function hitTestValue(event: MouseEvent, index: number) {
  if (props.step !== 0.5) return index
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
  const isLeftHalf = event.clientX - rect.left < rect.width / 2
  return isLeftHalf ? index - 0.5 : index
}

function onStarMove(event: MouseEvent, index: number) {
  if (isDisabled.value) return
  hoveredValue.value = hitTestValue(event, index)
}

function onLeave() {
  hoveredValue.value = null
}

function commit(next: number) {
  let value = Math.max(0, Math.min(starCount.value, roundToStep(next)))
  if (value === savedValue.value) value = 0
  model.value = value
}

function onStarClick(event: MouseEvent, index: number) {
  if (isDisabled.value) return
  commit(hitTestValue(event, index))
}

// In radiogroup mode the currently-selected star (or the first one when no
// value is set) is the only tabbable button. In slider mode the root is the
// tabstop and individual buttons are removed from the tab order.
function starTabindex(index: number) {
  if (isSliderMode.value) return -1
  if (isDisabled.value) return -1
  const selected = Math.ceil(savedValue.value)
  const tabbable = selected > 0 ? selected : 1
  return index === tabbable ? 0 : -1
}

const rootTabindex = computed(() => {
  if (!isSliderMode.value) return undefined
  return isDisabled.value ? -1 : 0
})

function onKeydown(e: KeyboardEvent) {
  if (isDisabled.value) return
  const max = starCount.value
  const step = props.step ?? 1

  if (isSliderMode.value) {
    let next: number | null = null
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        next = Math.min(max, savedValue.value + step)
        break
      case 'ArrowLeft':
      case 'ArrowDown':
        next = Math.max(0, savedValue.value - step)
        break
      case 'Home':
        next = 0
        break
      case 'End':
        next = max
        break
      case 'PageUp':
        next = Math.min(max, savedValue.value + 1)
        break
      case 'PageDown':
        next = Math.max(0, savedValue.value - 1)
        break
      default:
        if (/^[0-9]$/.test(e.key)) {
          next = Math.min(max, parseInt(e.key, 10))
        }
    }
    if (next !== null) {
      e.preventDefault()
      model.value = next
    }
    return
  }

  // Radiogroup mode — arrows move focus AND selection (WAI-ARIA "automatic"
  // pattern), Home/End jump to ends, Space/Enter selects the focused star.
  const current =
    focusedIndex.value ||
    Math.max(1, Math.min(max, Math.ceil(savedValue.value) || 1))
  let next: number | null = null
  switch (e.key) {
    case 'ArrowRight':
    case 'ArrowDown':
      next = Math.min(max, current + 1)
      break
    case 'ArrowLeft':
    case 'ArrowUp':
      next = Math.max(1, current - 1)
      break
    case 'Home':
      next = 1
      break
    case 'End':
      next = max
      break
    case ' ':
    case 'Enter':
      next = current
      break
    default:
      if (/^[0-9]$/.test(e.key)) {
        const n = parseInt(e.key, 10)
        if (n === 0) {
          e.preventDefault()
          model.value = 0
          return
        }
        next = Math.min(max, n)
      }
  }
  if (next !== null) {
    e.preventDefault()
    model.value = next
    focusedIndex.value = next
    nextTick(() => {
      const btn = rootRef.value?.querySelector(
        `[data-index="${next}"]`,
      ) as HTMLButtonElement | null
      btn?.focus()
    })
  }
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

.rating-icon {
  width: 100%;
  height: 100%;
}
</style>
