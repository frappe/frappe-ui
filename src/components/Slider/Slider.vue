<script setup lang="ts">
import { computed, normalizeClass, useSlots, useAttrs } from 'vue'
import type { StyleValue } from 'vue'
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
/** The current slider value (controlled). */
const model = defineModel<SliderValue>()
const slots = useSlots()

const attrs = useAttrs()

defineOptions({
  inheritAttrs: false,
})

// `role="slider"` sits on the thumb, not the root, so every caller `aria-*`
// has to be re-routed there — on the root they describe a container that no
// assistive technology reports as the control. `aria-valuetext` is the one
// that would otherwise be silently dropped.
// `aria-hidden` is the exception: it scopes to a subtree rather than to a role.
// On the thumb it marks a `tabindex="0"` element hidden while leaving the
// widget in the accessibility tree, which is the axe `aria-hidden-focus`
// violation, and the caller's actual intent never reaches the root.
const rootOnlyAria = new Set(['aria-hidden'])

// Hiding the root is only half of it. reka gives every thumb `tabindex="0"`
// unless the slider is disabled (`SliderThumbImpl`), so `aria-hidden` alone
// leaves keyboard focus landing inside a subtree that assistive technology
// cannot see — the second clause of axe's `aria-hidden-focus`. `inert` takes
// them out of the tab order, which is what the caller asked for.
const isHiddenFromAria = computed(() => {
  const value = attrs['aria-hidden']
  return value === '' || value === true || value === 'true'
})
const isAriaKey = (key: string) => key.startsWith('aria-')
const isThumbAria = (key: string) => isAriaKey(key) && !rootOnlyAria.has(key)

const callerAria = computed(() => {
  return Object.fromEntries(
    Object.entries(attrs).filter(([k]) => isThumbAria(k)),
  )
})

// A slider has no intrinsic width, so it carries `w-full`. That is a default,
// not a rule — but two unprefixed width utilities in one class list are decided
// by stylesheet order, not by which one the caller wrote, and there is no class
// merger here. So drop ours when the caller brings their own.
//
// Prefixed tokens are excluded on purpose. Tailwind emits variant utilities
// after the base ones, so `w-full sm:w-64` already resolves the caller's way at
// `sm` without our help. Dropping `w-full` for them instead leaves `width:auto`
// everywhere the variant does not apply, which collapses the slider to zero
// inside a flex parent. `min-w-*` and `max-w-*` are excluded too: those pair
// with `w-full` rather than replace it.
const hasCallerWidth = computed(() => {
  return normalizeClass(attrs.class)
    .split(/\s+/)
    .some((token) => !token.includes(':') && /^!?-?w-/.test(token))
})

// What is left to fall through to the control: class and style are placed by
// hand, and the thumb-scoped `aria-*` goes to the thumb. `aria-hidden` stays
// here.
const rootAttrs = computed(() => {
  return Object.fromEntries(
    Object.entries(attrs).filter(
      ([key]) => key !== 'class' && key !== 'style' && !isThumbAria(key),
    ),
  )
})

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
  describedBy,
  descriptionId,
  errorMessageId,
  hasError,
  errorLines,
  showDescription,
  rendersDescription,
  dataAttrs,
} = useInputLabeling(props, {
  size: () => props.size,
  disabled: () => props.disabled,
  hasLabelSlot: () => Boolean(slots.label),
  hasDescriptionSlot: () => Boolean(slots.description),
})

/** A caller's `aria-labelledby` wins over the id generated from `label`. */
const thumbLabelledBy = computed(() => {
  const caller = attrs['aria-labelledby'] as string | undefined
  if (caller) return caller
  // A caller's `aria-label` is an explicit override, so the generated
  // reference has to step aside — it would win the name order otherwise and
  // the override would do nothing.
  if (attrs['aria-label']) return undefined
  return labelledBy.value
})

// reka puts `aria-disabled` on the root but not on the thumb, so without this
// the element carrying `role="slider"` announces no disabled state. Caller
// values survive when the prop is not set, same as the error attributes.
const thumbDisabled = computed(() => {
  if (props.disabled) return true
  return (attrs['aria-disabled'] as string | boolean | undefined) || undefined
})

// The `error` prop wins, but with no error a caller's own value has to survive
// rather than be deleted by the explicit binding.
const thumbErrorMessage = computed(() => {
  if (hasError.value) return errorMessageId.value
  return attrs['aria-errormessage'] as string | undefined
})

const thumbInvalid = computed(() => {
  if (hasError.value) return true
  return (attrs['aria-invalid'] as string | boolean | undefined) || undefined
})

// Merged, not replaced: a caller's `aria-describedby` must not drop the
// generated description and error ids.
const thumbDescribedBy = computed(() => {
  const ids = [
    describedBy.value,
    attrs['aria-describedby'] as string | undefined,
  ]
  const merged = ids.filter(Boolean).join(' ')
  return merged || undefined
})

// A range slider renders one `role="slider"` per value. Unnamed, reka already
// tells them apart ("Minimum"/"Maximum", or "Value N of M" past two — see
// `getLabel` in reka-ui). A name of ours overrides that and lands on every
// thumb at once, so it has to carry the qualifier itself. Same wording as
// reka's, so a user never meets two vocabularies.
const isRange = computed(() => sliderValue.value.length > 1)

function thumbPart(index: number): string {
  const count = sliderValue.value.length
  return count === 2
    ? ['minimum', 'maximum'][index]
    : `value ${index + 1} of ${count}`
}

function thumbPartId(index: number): string {
  return `${inputId.value}-thumb-${index}`
}

// The qualifier has to reach the name the same way the name arrives. Against a
// referenced label there is no string to append to — the text lives in an
// element we do not own — so append a second id instead: `aria-labelledby`
// takes a list and concatenates it. Reading the referenced element's text
// would work in a browser and break in SSR.
function thumbLabelledByFor(index: number): string | undefined {
  if (!thumbLabelledBy.value) return undefined
  return isRange.value
    ? `${thumbLabelledBy.value} ${thumbPartId(index)}`
    : thumbLabelledBy.value
}

function thumbNameFor(index: number): string | undefined {
  const callerLabel = attrs['aria-label'] as string | undefined
  if (!isRange.value) return callerLabel
  // A referenced name is qualified through `aria-labelledby`, which beats
  // `aria-label`, so setting one here would only delete the reference.
  if (thumbLabelledBy.value) return undefined
  // Nothing names this slider, so leave reka's own "Minimum"/"Maximum" in
  // place rather than restate it.
  if (!callerLabel) return undefined
  return `${callerLabel} ${thumbPart(index)}`
}

// Declared before `rootClasses`, which reads it.
const hasLabeling = computed(() => {
  return Boolean(
    props.label || slots.label || rendersDescription.value || hasError.value,
  )
})

const isBidirectional = computed(() => props.min < 0 && props.max > 0)

const bidirectionalRangeStyles = computed(() => {
  const { min, max } = props
  const range = max - min
  const zeroPos = -min / range
  const thumbPositions = sliderValue.value.map((v) => (v - min) / range)
  const allPositions =
    thumbPositions.length === 1 ? [zeroPos, thumbPositions[0]] : thumbPositions
  return {
    left: `${Math.min(...allPositions) * 100}%`,
    right: `${(1 - Math.max(...allPositions)) * 100}%`,
  }
})

const trackClasses = computed(() => {
  return [
    'relative grow rounded-4',
    props.size === 'md' ? 'h-1.5' : 'h-1',
    props.disabled ? 'bg-surface-gray-2' : 'bg-surface-gray-3',
  ]
})

const rangeClasses = computed(() => {
  return [
    'absolute h-full rounded-4',
    props.disabled ? 'bg-surface-gray-4' : 'bg-surface-gray-10',
  ]
})

const rootClasses = computed(() => {
  return [
    'relative flex select-none touch-none items-center',
    props.size === 'md' ? 'h-5' : 'h-4',
    // With labeling the wrapper takes the caller's class, so the control fills
    // it. Without, the caller's class lands here and a width of theirs wins.
    hasLabeling.value || !hasCallerWidth.value ? 'w-full' : null,
  ]
})

const thumbClasses = computed(() => {
  return [
    'rounded-full bg-surface-base shadow-md ring-gray-600/20 transition-shadow duration-200 ease-out hover:ring-[6px] focus:outline-none dark:bg-surface-gray-10 dark:ring-gray-100/20',
    props.size === 'md' ? 'size-5' : 'size-4',
    props.disabled
      ? 'cursor-not-allowed opacity-60 hover:ring-0'
      : 'cursor-pointer',
  ]
})

const onValueCommit = (value: SliderValue) => {
  emit('value-commit', value)
}
</script>

<template>
  <LabelingWrapper
    :enabled="hasLabeling"
    :wrapper-class="[
      'space-y-1.5',
      hasCallerWidth ? null : 'w-full',
      attrs.class,
    ]"
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
    <SliderRoot
      :id="inputId"
      v-model="sliderValue"
      :class="[rootClasses, hasLabeling ? null : normalizeClass(attrs.class)]"
      :style="hasLabeling ? null : (attrs.style as StyleValue)"
      :max="props.max"
      :min="props.min"
      :step="props.step"
      :disabled="props.disabled"
      data-slot="control"
      :inert="isHiddenFromAria || undefined"
      v-bind="{ ...dataAttrs, ...rootAttrs }"
      @value-commit="onValueCommit"
    >
      <SliderTrack :class="trackClasses">
        <SliderRange v-if="!isBidirectional" :class="rangeClasses" />
        <div
          v-else
          :class="rangeClasses"
          :style="bidirectionalRangeStyles"
          data-orientation="horizontal"
          :data-disabled="props.disabled ? '' : undefined"
        />
      </SliderTrack>

      <template v-for="(_, i) in sliderValue" :key="`slider-thumb-${i}`">
        <!-- The second half of a range thumb's referenced name. Rendered only
             when the name comes from an id, which is the one case the string
             qualifier cannot reach. -->
        <span
          v-if="isRange && thumbLabelledBy"
          :id="thumbPartId(i)"
          class="sr-only"
        >
          {{ thumbPart(i) }}
        </span>
        <SliderThumb
          :class="thumbClasses"
          v-bind="callerAria"
          :aria-label="thumbNameFor(i)"
          :aria-labelledby="thumbLabelledByFor(i)"
          :aria-describedby="thumbDescribedBy"
          :aria-errormessage="thumbErrorMessage"
          :aria-invalid="thumbInvalid"
          :aria-disabled="thumbDisabled"
        />
      </template>
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
