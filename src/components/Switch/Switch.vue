<template>
  <div class="flex flex-col">
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
      class="mt-1"
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
    'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-outline-gray-3',
    'disabled:cursor-not-allowed disabled:bg-surface-gray-3',
    model.value
      ? 'bg-surface-gray-7 enabled:hover:bg-surface-gray-6 active:bg-surface-gray-5 group-hover:enabled:bg-surface-gray-6'
      : 'bg-surface-gray-4 enabled:hover:bg-gray-400 active:bg-gray-500 group-hover:enabled:bg-gray-400',
    props.size === 'md' ? 'h-5 w-8 border-[3px]' : 'h-4 w-[26px] border-2',
  ]
})

const switchCircleClasses = computed(() => {
  return [
    'pointer-events-none inline-block transform rounded-full bg-surface-white shadow ring-0 transition duration-100 ease-in-out',
    props.size === 'md' ? 'h-3.5 w-3.5' : 'h-3 w-3',
    props.size === 'md'
      ? model.value
        ? 'translate-x-3 rtl:-translate-x-3'
        : 'translate-x-0'
      : model.value
        ? 'translate-x-2.5 rtl:-translate-x-2.5'
        : 'translate-x-0',
  ]
})

const iconClasses = 'me-2 size-4 flex-shrink-0 text-ink-gray-6'

const switchLabelClasses = computed(() => {
  return [
    'font-medium leading-normal',
    props.disabled && !props.description
      ? 'text-ink-gray-4'
      : 'text-ink-gray-8',
    props.size === 'md' ? 'text-lg' : 'text-base',
    props.labelClasses,
  ]
})

const switchGroupClasses = computed(() => {
  const hasLabel = props.label || slots.label
  const hasDescription = props.description || slots.description
  if (!hasLabel && !hasDescription) return undefined
  const classes = ['flex justify-between']
  if (!hasDescription) {
    classes.push(
      'group items-center gap-x-3 py-1.5 cursor-pointer rounded focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-outline-gray-3',
    )

    if (props.disabled) classes.push('cursor-not-allowed')
  } else {
    classes.push('items-start')
    classes.push(props.size === 'md' ? 'gap-x-3.5' : 'gap-x-2.5')
  }

  return classes
})
</script>
