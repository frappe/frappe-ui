<template>
  <RadioGroupItem
    :id="inputId"
    :value="props.value as AcceptableValue"
    :disabled="props.disabled"
    :aria-labelledby="props.label || $slots.label ? labelId : undefined"
    :aria-describedby="hasDescription ? descriptionId : undefined"
    :class="rowClasses"
    data-slot="control"
    :data-size="size"
  >
    <span :class="circleClasses" aria-hidden="true" />
    <span class="flex flex-col items-start gap-0.5 text-start">
      <span
        v-if="props.label || $slots.label"
        :id="labelId"
        data-slot="label"
        :class="labelClasses"
      >
        <slot name="label">{{ props.label }}</slot>
      </span>
      <span
        v-if="hasDescription"
        :id="descriptionId"
        data-slot="description"
        :class="descriptionClasses"
      >
        <slot name="description">{{ props.description }}</slot>
      </span>
    </span>
  </RadioGroupItem>
</template>

<script lang="ts" setup>
import { computed, inject, useSlots } from 'vue'
// See RadioGroup.vue — AcceptableValue omits `boolean` at the type level only.
import { RadioGroupItem, type AcceptableValue } from 'reka-ui'
import { useId } from '../../utils/useId'
import { RadioGroupContextKey } from './types'
import type { RadioProps } from './types'

const props = withDefaults(defineProps<RadioProps>(), {
  disabled: false,
})

const slots = useSlots()

defineSlots<{
  /** Overrides the rendered label content. */
  label?: () => any
  /** Overrides the rendered description content. */
  description?: () => any
}>()

// `Radio` is only meaningful inside a `RadioGroup` — reka-ui's RadioGroupItem
// needs the root context for selection and roving focus. Fail loudly rather
// than rendering an option that silently never selects.
const group = inject(RadioGroupContextKey, null)
if (!group) {
  throw new Error('[frappe-ui] <Radio> must be used inside a <RadioGroup>.')
}

const size = computed(() => group.size.value)
const padded = computed(() => group.padded.value)
// A disabled group disables every option; an option can also disable itself.
const isDisabled = computed(() => group.disabled.value || props.disabled)

const fallbackId = useId()
const inputId = computed(() => props.id ?? fallbackId)
const labelId = computed(() => `${inputId.value}-label`)
const descriptionId = computed(() => `${inputId.value}-description`)
const hasDescription = computed(() =>
  Boolean(props.description || slots.description),
)

// The whole row is the control: reka-ui renders it as a `role="radio"` button,
// so hover, focus and the click target cover the label and description without
// any click forwarding. Padding just adds the surface.
const rowClasses = computed(() => {
  const classes = [
    'group flex items-start gap-2 rounded-4 text-start transition-colors',
    'focus:outline-none focus-visible:focus-ring',
    isDisabled.value ? 'cursor-not-allowed' : 'cursor-pointer',
  ]
  if (!padded.value) return classes

  // Rows with a description grow with vertical padding; label-only rows keep a
  // fixed compact height (24 / 28 / 32px) so lists stay evenly spaced.
  classes.push(
    hasDescription.value
      ? size.value === 'md'
        ? 'px-3 py-2'
        : 'px-1.5 py-1.5'
      : size.value === 'md'
        ? 'h-8 items-center px-3'
        : size.value === 'sm'
          ? 'h-7 items-center px-1.5'
          : 'h-6 items-center px-1.5',
  )
  if (!isDisabled.value) {
    classes.push('hover:bg-surface-gray-3 active:bg-surface-gray-4')
  }
  return classes
})

// The control is a plain span, so the selected state is drawn entirely with
// border width and colour: a thick ring whose surface-base centre is the hole.
// `data-state` lives on the RadioGroupItem button (the `group`), not here, so
// every checked style is written as `group-data-[state=checked]:`.
// frappe-ui scopes its tokens by property (`outline-*` → border, `surface-*` →
// background), so the selected ring colour — which lives on the surface scale,
// matching Checkbox and the Switch "on" state — is applied as an arbitrary
// border colour rather than via a `border-surface-*` utility that does not exist.
const circleClasses = computed(() => {
  // The row is `items-start`, so the circle is centred on the label's first
  // line (a fixed 14px/21px at every size) rather than on the whole row — a
  // description below must not drag it out of alignment. Offset is
  // (21 - circle height) / 2. Padded label-only rows centre themselves with
  // `items-center` and need no offset.
  const { control, offset } =
    size.value === 'md'
      ? {
          control: 'size-4 group-data-[state=checked]:border-[4.5px]',
          offset: 'mt-[2.5px]',
        }
      : size.value === 'sm'
        ? {
            control: 'size-3.5 group-data-[state=checked]:border-4',
            offset: 'mt-[3.5px]',
          }
        : {
            control: 'size-[13px] group-data-[state=checked]:border-[3.7px]',
            offset: 'mt-1',
          }

  const classes = [
    'box-border shrink-0 rounded-full border bg-surface-base transition-colors',
    hasDescription.value || !padded.value ? offset : '',
    control,
  ]

  if (isDisabled.value) {
    // Same disabled tokens as Checkbox: outline-gray-3 for the empty ring,
    // surface-gray-5 for the selected one, on a plain surface-base fill.
    classes.push(
      'border-outline-gray-3 bg-surface-base',
      'group-data-[state=checked]:border-[color:var(--surface-gray-5)]',
    )
    return classes
  }

  classes.push(
    // Unselected ring walks the outline scale on hover / active.
    'border-outline-gray-4 group-hover:border-outline-gray-5 group-active:border-outline-gray-6',
    // Selected ring walks the surface scale, matching Checkbox. Checked and
    // hover both sit on the same button, so they combine in one arbitrary group
    // selector — stacking `group-hover:group-data-[…]:` would instead ask for
    // two nested groups and never match.
    'group-data-[state=checked]:border-[color:var(--surface-gray-10)]',
    'group-[[data-state=checked]:hover]:border-[color:var(--surface-gray-9)]',
    'group-[[data-state=checked]:active]:border-[color:var(--surface-gray-8)]',
  )
  return classes
})

const labelClasses = computed(() => [
  'block text-base leading-normal select-none',
  isDisabled.value ? 'text-ink-gray-4' : 'text-ink-gray-7',
])

const descriptionClasses = computed(() => [
  'block text-sm leading-normal select-none',
  isDisabled.value ? 'text-ink-gray-3' : 'text-ink-gray-5',
])
</script>
