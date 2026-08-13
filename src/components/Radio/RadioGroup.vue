<template>
  <div>
    <InputLabel
      v-if="props.label || $slots.label"
      :id="labelId"
      :label="props.label"
      :required="props.required"
      color="gray-7"
      :disabled="props.disabled"
      class="select-none"
    >
      <template v-if="$slots.label" #default="slotProps">
        <slot name="label" v-bind="slotProps" />
      </template>
    </InputLabel>
    <RadioGroupRoot
      :model-value="model as AcceptableValue"
      @update:model-value="model = $event as RadioValue"
      :name="groupName"
      :disabled="props.disabled"
      :required="props.required"
      :orientation="props.orientation"
      :loop="props.loop"
      :aria-labelledby="labelledBy"
      :aria-describedby="describedBy"
      :aria-invalid="hasError || undefined"
      :aria-errormessage="hasError ? errorMessageId : undefined"
      :class="rootClasses"
      v-bind="dataAttrs"
    >
      <slot />
    </RadioGroupRoot>
    <div v-if="showDescription || hasError || $slots.description" class="mt-1">
      <InputDescription
        v-if="showDescription || $slots.description"
        :id="descriptionId"
        :description="props.description"
        :disabled="props.disabled"
      >
        <slot v-if="$slots.description" name="description" />
      </InputDescription>
      <InputError v-if="hasError" :id="errorMessageId" :lines="errorLines" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, provide, useSlots } from 'vue'
// reka-ui's AcceptableValue omits `boolean`, but the runtime never touches the
// declared type — the prop is untyped and values are compared with ohash's
// isEqual — so a yes/no radio works. Cast at the boundary to keep it.
import { RadioGroupRoot, type AcceptableValue } from 'reka-ui'
import { useId } from '../../utils/useId'
import { useInputLabeling } from '../../composables/useInputLabeling'
import InputLabel from '../InputLabeling/InputLabel.vue'
import InputDescription from '../InputLabeling/InputDescription.vue'
import InputError from '../InputLabeling/InputError.vue'
import { RadioGroupContextKey } from './types'
import type { RadioGroupProps, RadioValue } from './types'

const props = withDefaults(defineProps<RadioGroupProps>(), {
  size: 'sm',
  padded: false,
  disabled: false,
  orientation: 'vertical',
  loop: true,
})

const model = defineModel<RadioValue>()
const slots = useSlots()

defineSlots<{
  /** The `<Radio>` options. */
  default?: () => any
  /** Overrides the rendered group heading. Receives `{ required }`. */
  label?: (props: { required: boolean }) => any
  /** Overrides the rendered group description. */
  description?: () => any
}>()

// Every option renders a hidden input under this name so the group submits with
// a surrounding form. Callers rarely care what it is, only that it is unique.
const fallbackName = useId()
const groupName = computed(() => props.name ?? `radio-group-${fallbackName}`)

const {
  labelId,
  descriptionId,
  errorMessageId,
  labelledBy,
  describedBy,
  hasError,
  errorLines,
  showDescription,
  dataAttrs,
} = useInputLabeling(props, {
  size: () => props.size,
  disabled: () => props.disabled,
  hasLabelSlot: () => Boolean(slots.label),
  hasDescriptionSlot: () => Boolean(slots.description),
})

// The group owns the layout so options never have to space themselves. Padded
// rows sit flush (the surface itself provides the separation); default rows get
// a small gap.
const rootClasses = computed(() => {
  const stacked = props.orientation === 'vertical'
  const gap = props.padded ? '' : stacked ? 'gap-y-1.5' : 'gap-x-4'
  return [
    'flex',
    stacked ? 'flex-col' : 'flex-row flex-wrap items-center',
    gap,
    props.label || slots.label ? 'mt-1.5' : '',
  ]
})

provide(RadioGroupContextKey, {
  size: computed(() => props.size),
  padded: computed(() => props.padded),
  // reka-ui already merges this into the item's *behaviour*, but its styling
  // reads the context — without this a disabled group would look enabled.
  disabled: computed(() => props.disabled),
})
</script>
