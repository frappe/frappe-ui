<template>
  <div class="flex flex-col" :class="containerClasses" @click="onContainerClick">
    <div :class="switchGroupClasses">
      <div class="flex flex-col gap-1">
        <div class="flex items-center">
          <span
            v-if="props.icon && typeof props.icon === 'string'"
            :class="[props.icon, iconClasses]"
            aria-hidden="true"
          />
          <component
            v-else-if="props.icon"
            :is="props.icon"
            :class="iconClasses"
          />
          <InputLabel
            v-if="props.label || $slots.label"
            :id="labelId"
            :for-id="inputId"
            :label="props.label"
            :required="props.required"
            :class="switchLabelClasses"
          >
            <template v-if="$slots.label" #default="slotProps">
              <slot name="label" v-bind="slotProps" />
            </template>
          </InputLabel>
        </div>
      </div>
      <SwitchRoot
        :id="inputId"
        v-model="model"
        :class="switchClasses"
        :disabled="props.disabled"
        :aria-required="props.required || undefined"
        :aria-invalid="hasError || undefined"
        :aria-errormessage="hasError ? errorMessageId : undefined"
        :aria-describedby="describedBy"
        data-slot="control"
        v-bind="dataAttrs"
      >
        <SwitchThumb :class="switchCircleClasses" />
      </SwitchRoot>
    </div>
    <div
      v-if="showDescription || hasError || $slots.description"
      :class="[errorSpacingClass, errorIndentClasses]"
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
import { computed, useAttrs, useSlots, watch, watchEffect } from 'vue'
import { SwitchRoot, SwitchThumb } from 'reka-ui'
import { useInputLabeling } from '../../composables/useInputLabeling'
import { warnDeprecated } from '../../utils/warnDeprecated'
import InputLabel from '../InputLabeling/InputLabel.vue'
import InputDescription from '../InputLabeling/InputDescription.vue'
import InputError from '../InputLabeling/InputError.vue'
import type { SwitchProps } from './types'

const props = withDefaults(defineProps<SwitchProps>(), {
  size: 'sm',
  variant: 'default',
  disabled: false,
  labelClasses: '',
})

const model = defineModel<boolean>({ default: false })
const attrs = useAttrs()
const slots = useSlots()

defineSlots<{
  /** Overrides the rendered label content. Receives `{ required }`. */
  label?: (props: { required: boolean }) => any
  /** Overrides the rendered description content. */
  description?: () => any
}>()

watch(model, (val) => {
  const onChange = attrs.onChange as
    | ((value: boolean) => void)
    | ((value: boolean) => void)[]
    | undefined
  if (!onChange) return
  warnDeprecated('Switch.change', 'update:modelValue / v-model')
  if (Array.isArray(onChange)) {
    onChange.forEach((h) => h(val))
  } else {
    onChange(val)
  }
})

watchEffect(() => {
  if (props.labelClasses) {
    warnDeprecated('Switch.labelClasses', 'data-* styling hooks')
  }
})

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
  state: () => (model.value ? 'checked' : 'unchecked'),
})

const switchClasses = computed(() => {
  return [
    'relative inline-flex flex-shrink-0 cursor-pointer rounded-full border-transparent transition-colors duration-100 ease-in-out items-center',
    // The focus ring is applied globally via :focus-visible. In the padded
    // variant it is shown on the row instead, so suppress it on the control.
    props.variant === 'padded' ? 'focus:outline-none focus:ring-0' : '',
    'disabled:cursor-not-allowed disabled:bg-surface-gray-3',
    model.value
      ? 'bg-surface-gray-10 enabled:hover:bg-surface-gray-9 active:bg-surface-gray-8 group-hover:enabled:bg-surface-gray-9'
      : 'bg-surface-gray-4 enabled:hover:bg-surface-gray-5 active:bg-surface-gray-6 group-hover:enabled:bg-surface-gray-5',
    props.size === 'md'
      ? 'h-5 w-8 border-[3px]'
      : props.size === 'sm'
        ? 'h-4 w-[26px] border-2'
        : 'h-3.5 w-[24px] border-2',
  ]
})

const switchCircleClasses = computed(() => {
  return [
    'pointer-events-none inline-block transform rounded-full bg-surface-base shadow ring-0 transition duration-100 ease-in-out',
    props.size === 'md' ? 'h-3.5 w-3.5' : props.size === 'sm' ? 'h-3 w-3' : 'h-2.5 w-2.5',
    props.size === 'md'
      ? model.value
        ? 'translate-x-3 rtl:-translate-x-3'
        : 'translate-x-0'
      : props.size === 'sm'
        ? model.value
          ? 'translate-x-2.5 rtl:-translate-x-2.5'
          : 'translate-x-0'
        : model.value
          ? 'translate-x-2.5 rtl:-translate-x-2.5'
          : 'translate-x-0',
  ]
})

const iconClasses = 'me-2 size-4 flex-shrink-0 text-ink-gray-6'

const switchLabelClasses = computed(() => {
  return [
    'font-medium leading-tight select-none',
    props.disabled && !props.description
      ? 'text-ink-gray-4 cursor-not-allowed'
      : 'text-ink-gray-8 cursor-pointer',
    props.size === 'md' ? 'text-lg' : props.size === 'sm' ? 'text-base' : 'text-sm',
    props.labelClasses,
  ]
})

const switchGroupClasses = computed(() => {
  const hasLabel = props.label || slots.label
  const hasDescription = props.description || slots.description
  if (!hasLabel && !hasDescription) return undefined

  // Auto placement: the switch leads label-only rows and trails rows that
  // carry a description. An explicit `switchPosition` always wins.
  // `flex-row-reverse` / `justify-*` are inline-axis aware, so this flips
  // correctly under RTL without any physical left/right values.
  const position = props.switchPosition ?? (hasDescription ? 'end' : 'start')
  const switchStart = position === 'start'

  if (hasDescription) {
    // Settings style: label + description on one side, switch on the other.
    return [
      'flex items-center',
      switchStart ? 'flex-row-reverse justify-end' : 'justify-between',
      props.size === 'md' ? 'gap-x-3.5' : 'gap-x-2.5',
    ]
  }

  // Inline label-only row.
  const classes = [
    'flex group items-center',
    switchStart
      ? 'flex-row-reverse justify-end gap-x-2.5'
      : 'justify-between gap-x-3',
  ]
  if (props.variant !== 'padded') {
    classes.push(
      'py-1.5 cursor-pointer rounded',
    )
    if (props.disabled) classes.push('cursor-not-allowed')
  }
  return classes
})

// Align the error/description text under the label, not the switch.
// Only needed when the switch leads the row (position = start); settings-style
// rows (switch at end) have the label on the leading side already.
const errorIndentClasses = computed(() => {
  const hasDescription = props.description || slots.description
  const position = props.switchPosition ?? (hasDescription ? 'end' : 'start')
  if (position !== 'start') return undefined
  // switch width + gap-x-2.5 (10 px)
  return props.size === 'md' ? 'ps-[42px]' : props.size === 'sm' ? 'ps-9' : 'ps-8'
})

// Label-only non-padded rows include py-1.5 on the switch group, which
// already provides ~6 px of breathing room — pull the error div up slightly
// so the total gap matches the other components (~4 px).
// Settings-style rows (hasDescription) have no inner padding so keep mt-1.
const errorSpacingClass = computed(() => {
  const hasDescription = props.description || slots.description
  // A description sits tight under the label; error-only rows keep a small gap.
  if (hasDescription) return 'mt-0.5'
  return props.variant !== 'padded' ? '-mt-0.5' : 'mt-1'
})

// In the padded variant the whole row is a clickable surface — padding,
// hover/active/focus states and the click target wrap the label, control and
// description together.
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
      : props.size === 'sm'
        ? 'px-2 py-1.5'
        : 'px-1.5 py-1.5'
    : props.size === 'md'
      ? 'h-8 px-3'
      : props.size === 'sm'
        ? 'h-7 px-2'
        : 'h-6 px-1.5'
  const classes = ['group rounded transition-colors', sizeClass]
  if (!hasDetail) classes.push('justify-center')
  // With the switch at the start the row hugs its content; at the end it spans
  // the full width so `justify-between` can push the switch to the right edge.
  const hasDescription = props.description || slots.description
  const position = props.switchPosition ?? (hasDescription ? 'end' : 'start')
  classes.push(position === 'start' ? 'w-fit' : 'w-full')
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
  // The control toggles itself via reka-ui; ignore to avoid double toggling.
  if (target.closest('[data-slot="control"]')) return
  // The label activates the control via its `for` attribute; ignore to avoid double toggling.
  if (target.closest('[data-slot="label"]')) return
  model.value = !model.value
}
</script>
