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
    <Tooltip
      :text="tooltipText ?? ''"
      :disabled="!props.showValueTooltip"
      :hoverDelay="0"
      :placement="placement"
    >
      <div
        :id="inputId"
        ref="rootRef"
      class="rating-stars inline-flex shrink-0 gap-0.5 leading-none focus:outline-none"
      :class="hasLabeling ? null : (attrs.class as any)"
      :style="hasLabeling ? null : (attrs.style as any)"
      :role="isSliderMode ? 'slider' : 'radiogroup'"
      :tabindex="rootTabindex"
      :aria-labelledby="labelledBy"
      :aria-describedby="describedBy"
      :aria-errormessage="hasError ? errorMessageId : undefined"
      :aria-required="props.required || undefined"
      :aria-invalid="hasError || undefined"
      :aria-readonly="props.readonly || undefined"
      :aria-orientation="isSliderMode ? 'horizontal' : undefined"
      :aria-valuemin="isSliderMode ? 0 : undefined"
      :aria-valuemax="isSliderMode ? starCount : undefined"
      :aria-valuenow="isSliderMode ? savedValue : undefined"
      :aria-valuetext="isSliderMode ? formatValue(savedValue) : undefined"
      :data-readonly="props.readonly || undefined"
      data-slot="control"
      v-bind="dataAttrs"
      @mouseleave="onLeave"
      @keydown="onKeydown"
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
    </Tooltip>
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
import Tooltip from '../Tooltip/Tooltip.vue'
import LucideStar from '~icons/lucide/star'
import type { RatingProps } from './types'

const props = withDefaults(defineProps<RatingProps>(), {
  size: 'md',
  readonly: false,
  step: 1,
  allowClear: false,
  showValueTooltip: false,
  placement: 'right',
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

function formatValue(v: number) {
  if (v == null) return ''
  return v % 1 === 0 ? String(v) : v.toFixed(1)
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

const tooltipText = computed(() => {
  const display = props.readonly ? savedValue.value : hoveredValue.value
  if (!display) return null
  return `${formatValue(display)} / ${starCount.value}`
})

function commit(next: number) {
  let value = Math.max(0, Math.min(starCount.value, roundToStep(next)))
  if (props.allowClear && value === savedValue.value) value = 0
  model.value = value
}

function onStarClick(event: MouseEvent, index: number) {
  if (props.readonly) return
  commit(hitTestValue(event, index))
}

// In radiogroup mode the currently-selected star (or the first one when no
// value is set) is the only tabbable button. In slider mode the root is the
// tabstop and individual buttons are removed from the tab order.
function starTabindex(index: number) {
  if (isSliderMode.value) return -1
  if (props.readonly) return -1
  const selected = Math.ceil(savedValue.value)
  const tabbable = selected > 0 ? selected : 1
  return index === tabbable ? 0 : -1
}

const rootTabindex = computed(() => {
  if (!isSliderMode.value) return undefined
  return props.readonly ? -1 : 0
})

function onKeydown(e: KeyboardEvent) {
  if (props.readonly) return
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
          if (props.allowClear) {
            e.preventDefault()
            model.value = 0
          }
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
