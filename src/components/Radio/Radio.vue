<template>
  <div
    class="flex-col"
    :class="[props.variant === 'padded' ? 'flex' : 'inline-flex', containerClasses]"
    @click="onContainerClick"
  >
    <div class="inline-flex gap-2 rounded transition">
      <input
        class="mt-[1px] appearance-none rounded-full border transition"
        :class="inputClasses"
        type="radio"
        :name="name"
        :value="props.value"
        :disabled="disabled"
        :id="inputId"
        :checked="checked"
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
        :class="labelClasses"
      >
        <template v-if="$slots.label" #default>
          <slot name="label" />
        </template>
      </InputLabel>
    </div>
    <div v-if="showDescription || hasError" class="ps-[1.35rem] mt-0.5">
      <InputDescription
        v-if="showDescription || $slots.description"
        :id="descriptionId"
        :description="props.description"
      >
        <slot v-if="$slots.description" name="description" />
      </InputDescription>
      <InputError v-if="hasError" :id="errorMessageId" :lines="errorLines" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, useAttrs, useSlots } from 'vue'
import { useInputLabeling } from '../../composables/useInputLabeling'
import InputLabel from '../InputLabeling/InputLabel.vue'
import InputDescription from '../InputLabeling/InputDescription.vue'
import InputError from '../InputLabeling/InputError.vue'
import type { RadioProps, RadioValue } from './types'

const props = withDefaults(defineProps<RadioProps>(), {
  size: 'sm',
  variant: 'default',
  disabled: false,
})

const model = defineModel<RadioValue>()
const attrs = useAttrs()
const slots = useSlots()

defineSlots<{
  /** Overrides the rendered label content. */
  label?: () => any
  /** Overrides the rendered description content. */
  description?: () => any
}>()

// A radio is selected when the group's value equals this radio's value.
const checked = computed(
  () => props.value !== undefined && model.value === props.value,
)

function onChange() {
  if (props.disabled) return
  model.value = props.value
}

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
  state: () => (checked.value ? 'checked' : 'unchecked'),
})

const labelClasses = computed(() => {
  return [
    props.size === 'md' ? 'text-lg' : props.size === 'sm' ? 'text-base' : 'text-sm',
    'font-medium leading-tight',
    props.disabled ? 'text-ink-gray-4 cursor-not-allowed' : 'text-ink-gray-8 cursor-pointer',
    'select-none',
  ]
})

// The control is a native radio with `appearance-none`. The selected state is
// a thick ring with a surface-base centre (per the Espresso designs): the border
// is the ring, the surface-base fill is the hole.
//
// Two wrinkles drive the class list:
//  1. frappe-ui's tokens are scoped by property (`outline-*` → border,
//     `surface-*` → background, `ink-*` → text), so the ring colour is projected
//     through `currentColor` + `border-current`. The unselected ring uses the
//     outline scale (4/5/6) and the selected ring the Switch "on" surface scale
//     (10/9/8) — matching Checkbox — via `text-[color:var(--token)]`.
//  2. `@tailwindcss/forms` repaints `:checked`, `:checked:hover` and
//     `:checked:focus` with a currentColor fill + transparent border, so each
//     is overridden back to a surface-base centre + currentColor ring.
const inputClasses = computed(() => {
  const sizeClass =
    props.size === 'md' ? 'size-4' : props.size === 'sm' ? 'size-3.5' : 'size-[13px]'
  // Selected ring thickness (per Espresso) — the surface-base centre is
  // what's left inside it.
  const ringWidth =
    props.size === 'md'
      ? 'checked:border-[4.5px]'
      : props.size === 'sm'
        ? 'checked:border-4'
        : 'checked:border-[3.7px]'

  if (props.disabled) {
    return [
      sizeClass,
      ringWidth,
      'cursor-not-allowed border-current bg-surface-gray-1 text-ink-gray-2',
      // No hover/focus lift — it's disabled.
      'hover:shadow-none hover:border-current focus:ring-0 focus:ring-offset-0',
      // Selected + disabled: light ring (outline-gray-1) with a muted grey
      // centre. Re-assert on :hover/:focus so the forms plugin can't repaint.
      'checked:border-outline-gray-1 checked:bg-none checked:bg-current checked:text-ink-gray-3',
      'checked:hover:border-outline-gray-1 checked:hover:bg-current checked:hover:text-ink-gray-3',
      'checked:focus:border-outline-gray-1 checked:focus:bg-current checked:focus:text-ink-gray-3',
    ]
  }

  return [
    sizeClass,
    ringWidth,
    'cursor-pointer border-current bg-surface-base',
    // Unselected ring: outline scale (default 4 / hover 5 / active 6), via currentColor.
    'text-[color:var(--outline-gray-4)] hover:text-[color:var(--outline-gray-5)] hover:shadow-sm active:text-[color:var(--outline-gray-6)]',
    // Selected ring: Switch "on" scale (default 10 / hover 9 / active 8), via currentColor.
    'checked:text-[color:var(--surface-gray-10)] checked:hover:text-[color:var(--surface-gray-9)] checked:active:text-[color:var(--surface-gray-8)]',
    // Re-assert ring + surface-base centre over the forms plugin on every :checked
    // interaction state (see note above) — without the :hover/:focus variants
    // the centre floods with the currentColor fill on hover/focus.
    'checked:bg-none',
    'checked:border-current checked:hover:border-current checked:focus:border-current',
    'checked:bg-surface-base checked:hover:bg-surface-base checked:focus:bg-surface-base',
    // The padded row owns the focus ring + hover; the bare control shows the
    // global espresso ring on keyboard focus. forms sets a transparent `:focus`
    // outline that outranks the global `:focus-visible` rule, so re-assert it
    // with the themed `focus-ring` utility.
    props.variant === 'padded'
      ? 'focus:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 group-hover:text-[color:var(--outline-gray-5)] checked:group-hover:text-[color:var(--surface-gray-9)]'
      : 'focus:ring-0 focus:ring-offset-0 focus-visible:focus-ring',
  ]
})

// In the padded variant the whole row is a clickable surface — padding,
// hover/active/focus states and the click target wrap the label and control.
const containerClasses = computed(() => {
  if (props.variant !== 'padded') return undefined
  // `group` lives on the outer surface so hovering anywhere in the padded
  // area — including the corners — drives the control's hover state too.
  // A description or error makes the surface multi-line, so it grows with
  // vertical padding instead of the fixed compact height used for label-only rows.
  const hasDetail = showDescription.value || hasError.value || !!slots.description
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
  // The control selects itself; the label selects it via `for`. Ignore both to
  // avoid double handling and only act on clicks on the surrounding padding.
  if (target.closest('[data-slot="control"]')) return
  if (target.closest('[data-slot="label"]')) return
  // Radios are select-only — clicking the active row keeps it selected.
  if (checked.value) return
  model.value = props.value
}
</script>
