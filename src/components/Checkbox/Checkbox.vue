<template>
  <div
    class="flex-col"
    :class="[props.variant === 'padded' ? 'flex' : 'inline-flex', containerClasses]"
    @click="onContainerClick"
  >
    <div
      class="rounded transition"
      :class="[
        vertical
          ? 'inline-flex flex-col items-center gap-1 text-center'
          : 'inline-flex items-center gap-2',
        rowClasses,
      ]"
    >
      <input
        ref="inputRef"
        class="rounded-sm mt-[1px]"
        :class="inputClasses"
        type="checkbox"
        :disabled="disabled"
        :id="inputId"
        :checked="checked"
        :required="required"
        :aria-required="required || undefined"
        :aria-invalid="hasError || undefined"
        :aria-errormessage="hasError ? errorMessageId : undefined"
        :aria-describedby="describedBy"
        data-slot="control"
        v-bind="{ ...dataAttrs, ...attrs }"
        @change="onChange"
      />
      <InputLabel
        v-if="props.label || $slots.label"
        :id="labelId"
        :for-id="inputId"
        :label="props.label"
        :required="props.required"
        :class="labelClasses"
      >
        <template v-if="$slots.label" #default="slotProps">
          <slot name="label" v-bind="slotProps" />
        </template>
      </InputLabel>
    </div>
    <div
      v-if="showDescription || hasError"
      :class="vertical ? 'mt-1 text-center' : 'ps-[1.35rem] mt-1'"
    >
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
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, useAttrs, watchEffect } from 'vue'
import { useInputLabeling } from '../../composables/useInputLabeling'
import { warnDeprecated } from '../../utils/warnDeprecated'
import InputLabel from '../InputLabeling/InputLabel.vue'
import InputDescription from '../InputLabeling/InputDescription.vue'
import InputError from '../InputLabeling/InputError.vue'
import type { CheckboxProps } from './types'

const props = withDefaults(defineProps<CheckboxProps>(), {
  size: 'sm',
  variant: 'default',
  orientation: 'horizontal',
  padding: false,
  indeterminate: false,
})

const model = defineModel<boolean | 1 | 0>()
const attrs = useAttrs()

watchEffect(() => {
  if (props.padding) {
    warnDeprecated('Checkbox.padding', 'variant="padded"')
  }
})

const checked = computed(() => Boolean(model.value))

// Vertical orientation (centered label below the control) is only supported in
// the default variant; the padded surface always lays the row out horizontally.
const vertical = computed(
  () => props.variant !== 'padded' && props.orientation === 'vertical',
)

// The `indeterminate` state can only be set via the DOM property, not HTML attribute.
const inputRef = ref<HTMLInputElement | null>(null)
watchEffect(() => {
  if (inputRef.value) {
    inputRef.value.indeterminate = props.indeterminate
  }
})

function onChange(e: Event) {
  const next = (e.target as HTMLInputElement).checked
  model.value = next
}

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
  dataAttrs,
} = useInputLabeling(props, {
  size: () => props.size,
  disabled: () => props.disabled,
  state: () =>
    props.indeterminate ? 'indeterminate' : checked.value ? 'checked' : 'unchecked',
})

const labelClasses = computed(() => {
  return [
    props.size === 'md' ? 'text-lg' : props.size === 'sm' ? 'text-base' : 'text-sm',
    'font-medium',
    props.disabled ? 'text-ink-gray-4 cursor-not-allowed' : 'text-ink-gray-8 cursor-pointer',
    'select-none',
  ]
})

const rowClasses = computed(() => {
  return {
    'px-2.5 py-1.5': props.padding && props.size === 'sm',
    'px-3 py-2': props.padding && props.size === 'md',
    'focus-within:bg-surface-gray-2 focus-within:ring-2 focus-within:ring-outline-gray-3 hover:bg-surface-gray-3 active:bg-surface-gray-4':
      props.padding && !props.disabled,
  }
})

// In the padded variant the whole row is a clickable surface. Mirrors the
// Switch padded variant: fixed-height compact rows (24/28/32px) with hover,
// active and keyboard-only focus states wrapping the control and label.
const containerClasses = computed(() => {
  if (props.variant !== 'padded') return undefined
  // A description or error makes the surface multi-line, so it grows with
  // vertical padding instead of the fixed compact height used for label-only rows.
  const hasDetail = showDescription.value || hasError.value
  const sizeClass = hasDetail
    ? props.size === 'md'
      ? 'px-3 py-2'
      : 'px-1.5 py-1.5'
    : props.size === 'md'
      ? 'h-8 px-3'
      : props.size === 'sm'
        ? 'h-7 px-1.5'
        : 'h-6 px-1.5'
  const classes = ['group rounded transition-colors', sizeClass]
  if (!hasDetail) classes.push('justify-center')
  classes.push(
    props.disabled
      ? 'cursor-not-allowed'
      : 'cursor-pointer hover:bg-surface-gray-3 active:bg-surface-gray-4 [&:has(:focus-visible)]:ring-2 [&:has(:focus-visible)]:ring-outline-gray-3',
  )
  return classes
})

const onContainerClick = (event: MouseEvent) => {
  if (props.variant !== 'padded' || props.disabled) return
  const target = event.target as HTMLElement
  // The input toggles itself; the label toggles it via `for`. Ignore both to
  // avoid double toggling and only handle clicks on the surrounding padding.
  if (target.closest('[data-slot="control"]')) return
  if (target.closest('[data-slot="label"]')) return
  model.value = !checked.value
}

const inputClasses = computed(() => {
  const sizeClasses =
    props.size === 'md'
      ? 'w-4 h-4'
      : props.size === 'sm'
        ? 'w-3.5 h-3.5'
        : 'w-[13px] h-[13px]'

  // The checked/indeterminate fill is painted by @tailwindcss/forms as
  // `background-color: currentColor`, so we drive the fill through the text
  // colour (as the original did with `text-ink-gray-9`) rather than fighting
  // forms' `:checked:focus` rule with `checked:bg-*`. currentColor points at the
  // Switch "on" tokens (10 / 9 / 8) via CSS vars — `surface-*` isn't a text
  // utility in this preset. Unchecked shows a surface-base fill + outline border;
  // forms clears the border on checked so the fill defines the box. The check/
  // dash glyph colour comes from the dark-mode preset override.
  if (props.disabled) {
    return [
      sizeClasses,
      'cursor-not-allowed bg-surface-base border-outline-gray-3',
      'text-[color:var(--surface-gray-5)]',
      'hover:shadow-none focus:ring-0 focus:ring-offset-0',
    ]
  }

  // In the padded variant the row drives hover; otherwise the control does.
  const padded = props.padding || props.variant === 'padded'
  return [
    sizeClasses,
    'cursor-pointer transition focus:ring-0 focus:ring-offset-0',
    // Unchecked — surface-base fill, outline scale: default 4 / hover 5 / active 6.
    'bg-surface-base border-outline-gray-4',
    // Checked fill (via currentColor): default 10 / hover 9 / active 8.
    'text-[color:var(--surface-gray-10)]',
    // Non-padded shows the global espresso ring on keyboard focus. forms sets a
    // transparent `:focus` outline that outranks the global `:focus-visible` rule,
    // so re-assert it with the themed `focus-ring` utility. (Padded shows the ring
    // on the row instead, via `[&:has(:focus-visible)]` on the container.)
    padded
      ? 'group-hover:border-outline-gray-5 checked:group-hover:text-[color:var(--surface-gray-9)]'
      : 'hover:border-outline-gray-5 hover:shadow-sm active:border-outline-gray-6 focus-visible:focus-ring checked:hover:text-[color:var(--surface-gray-9)] checked:active:text-[color:var(--surface-gray-8)]',
  ]
})
</script>
