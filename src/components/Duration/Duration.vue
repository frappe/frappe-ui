<template>
  <TextInput
    ref="inputRef"
    :id="id"
    :model-value="displayValue"
    :label="label"
    :description="description"
    :error="error || internalError"
    :required="required"
    :disabled="disabled"
    :size="size"
    :variant="variant"
    :placeholder="placeholderText"
    @focus="handleFocus"
    @blur="handleBlur"
    @input="handleInput"
    @keydown="handleKeydown"
  >
    <!-- INP-Q7: Duration renders a TextInput, so the labeling slots every other
         input accepts have to be forwarded or they silently render nothing. -->
    <template v-if="$slots.label" #label="slotProps">
      <slot name="label" v-bind="slotProps" />
    </template>
    <template v-if="$slots.description" #description>
      <slot name="description" />
    </template>
  </TextInput>
</template>

<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import { TextInput } from '../TextInput'
import { formatDuration, parseDuration, roundDuration } from './duration'
import type { DurationProps, DurationExposed } from './types'

const props = withDefaults(defineProps<DurationProps>(), {
  format: 'short',
  largestUnit: 'hour',
  smallestUnit: 'second',
})

const model = defineModel<number | null>({ default: null })

defineSlots<{
  /** Overrides the rendered label content. Receives `{ required }`. */
  label?: (props: { required: boolean }) => any
  /** Overrides the rendered description content. */
  description?: () => any
}>()

const inputRef = ref<InstanceType<typeof TextInput> | null>(null)
const isFocused = ref(false)
const editValue = ref('')
const focusValue = ref('')
const internalError = ref('')
const cancelled = ref(false)

const units = computed(() => ({
  largestUnit: props.largestUnit,
  smallestUnit: props.smallestUnit,
}))

const placeholderText = computed(
  () =>
    props.placeholder ??
    (props.smallestUnit === 'minute' ? '1h 30m' : '1h 30m 45s'),
)

const displayValue = computed(() =>
  isFocused.value || internalError.value
    ? editValue.value
    : formatDuration(model.value, props.format, units.value),
)

function handleFocus() {
  // Guard against redundant focus events while already editing so we don't
  // clobber the in-progress text or re-run the select(). After an invalid
  // commit isFocused is false, so re-focusing starts a fresh canonical edit.
  if (isFocused.value) return
  isFocused.value = true
  // Always edit in the canonical "1h 30m 45s" notation so the typed value
  // round-trips through parseDuration regardless of the display `format`.
  editValue.value = formatDuration(model.value, 'short', units.value)
  focusValue.value = editValue.value
  internalError.value = ''
  nextTick(() => inputRef.value?.inputElement?.select())
}

function handleInput(event: Event) {
  editValue.value = (event.target as HTMLInputElement).value
  internalError.value = ''
}

function handleBlur() {
  // Escape cancels the edit: skip the commit the blur would otherwise trigger
  // and leave the saved value untouched.
  if (cancelled.value) {
    cancelled.value = false
    isFocused.value = false
    internalError.value = ''
    return
  }
  commit()
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter') {
    event.preventDefault()
    inputRef.value?.inputElement?.blur()
  } else if (event.key === 'Escape') {
    cancelled.value = true
    inputRef.value?.inputElement?.blur()
  }
}

function commit() {
  const raw = editValue.value.trim()

  // The edit text may be rounded, so committing it unchanged would rewrite the value.
  if (raw === focusValue.value) {
    internalError.value = ''
    isFocused.value = false
    return
  }

  if (raw === '') {
    internalError.value = ''
    isFocused.value = false
    model.value = null
    return
  }

  const seconds = parseDuration(raw, units.value)
  if (seconds === null) {
    internalError.value =
      'Invalid format. Try: 1h 30m 45s, 1 hour 30 minutes, 1d 2h, 1:30:45, 90s'
    // Report the error and let focus leave. The rejected text stays visible
    // (displayValue tracks the error state) as a reminder, but they aren't
    // trapped in the field. Re-focusing restarts from the canonical saved
    // value, so the rejected text is discarded rather than edited.
    isFocused.value = false
    return
  }

  internalError.value = ''
  isFocused.value = false
  model.value = roundDuration(seconds, props.smallestUnit)
}

defineExpose<DurationExposed>({
  /** Moves focus to the input. */
  focus: (options) => inputRef.value?.focus(options),
})
</script>
