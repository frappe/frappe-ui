<template>
  <label
    v-if="label || $slots.default"
    :id="id"
    :for="forId"
    data-slot="label"
    :class="labelClasses"
  >
    <slot v-if="$slots.default" :required="!!required" />
    <template v-else>
      {{ label }}
      <RequiredIndicator :required="required" />
    </template>
  </label>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import RequiredIndicator from './RequiredIndicator.vue'

const props = withDefaults(
  defineProps<{
    id: string
    forId?: string
    label?: string
    required?: boolean
    color?: 'gray-6' | 'gray-7'
    /** Dims the label to match a disabled control. Overrides `color`. */
    disabled?: boolean
  }>(),
  {
    color: 'gray-6',
  },
)

const labelClasses = computed(() => {
  // Label type is fixed at 13px (`text-sm`). It does not follow the control's
  // `size`: a label reads the same whatever box sits under it, and the two
  // label implementations used to disagree (14px here, 12px/14px in
  // `FormLabel`).
  //
  // Disabled wins over `color` — a dimmed label is a state, not a choice, so
  // callers shouldn't have to remember to swap the colour themselves.
  return [
    'block text-sm',
    props.disabled
      ? 'text-ink-gray-4'
      : props.color === 'gray-7'
        ? 'text-ink-gray-7'
        : 'text-ink-gray-6',
  ]
})
</script>
