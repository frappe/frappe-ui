<template>
  <Popover
    ref="popoverRef"
    v-model:open="open"
    trigger="manual"
    :auto-focus="false"
    :side="side"
    :align="align"
    :offset="offset"
    :reference="anchorEl"
  >
    <template #trigger>
      <div v-bind="$attrs" @keydown.down.prevent="onArrowDown">
        <slot name="trigger" v-bind="triggerSlotProps">
          <TextInput
            ref="textInputRef"
            v-model="inputValue"
            type="text"
            :id="id"
            :label="label"
            :description="description"
            :error="error"
            :required="required"
            :size="size"
            :variant="variant"
            :placeholder="placeholder"
            :disabled="disabled"
            :readonly="readonly"
            @focus="onFocus"
            @click="onClick"
            @blur="onBlur"
            @keydown.enter.prevent="onEnter"
          >
            <template v-if="$slots.prefix" #prefix>
              <slot name="prefix" v-bind="triggerSlotProps" />
            </template>
            <template #suffix>
              <slot name="suffix" v-bind="triggerSlotProps">
                <LucideChevronDown
                  class="h-4 w-4 cursor-pointer"
                  @mousedown.prevent="toggle"
                />
              </slot>
            </template>
          </TextInput>
        </slot>
      </div>
    </template>

    <slot :close="closePopover" />
  </Popover>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import Popover from '../../Popover/Popover.vue'
import { TextInput } from '../../TextInput'
import LucideChevronDown from '~icons/lucide/chevron-down'
import { useReactiveSlots } from '../../../composables/useReactiveSlots'
import type { PopoverExposed } from '../../Popover/types'
import type {
  PickerShellExposed,
  PickerShellProps,
  PickerShellSlots,
  PickerShellTriggerSlotProps,
} from './types'

const props = withDefaults(defineProps<PickerShellProps>(), {
  openOnFocus: false,
  openOnClick: true,
  required: false,
  disabled: false,
  readonly: false,
  displayLabel: '',
})

const emit = defineEmits<{
  (e: 'focus'): void
  (e: 'click', event: MouseEvent): void
  (e: 'blur'): void
  (e: 'enter'): void
  (e: 'open'): void
  (e: 'close'): void
  /** Signal that the parent should move keyboard focus into the popover
   *  content (e.g. into a calendar grid). Fired:
   *  - When the user presses ↓ on the trigger.
   *  - When the popover opens with a custom trigger (no `TextInput` to type
   *    into, so focus should jump straight into the content).
   *  The default trigger keeps focus on the `TextInput` for typing. */
  (e: 'requestFocus'): void
}>()

defineSlots<PickerShellSlots>()
const slots = useReactiveSlots<PickerShellSlots>()

defineOptions({ inheritAttrs: false })

const open = defineModel<boolean>('open', { default: false })
const inputValue = defineModel<string>('inputValue', { default: '' })
const typing = defineModel<boolean>('typing', { default: false })

const textInputRef = ref<InstanceType<typeof TextInput> | null>(null)
const popoverRef = ref<PopoverExposed | null>(null)

// Anchor to the `<input>` itself. Anchoring to the whole labelled field would
// put the panel below the description.
const anchorEl = computed(() => {
  if (slots.trigger) return undefined
  return textInputRef.value?.inputElement ?? undefined
})

// Same signature and semantics as `Popover`'s `toggle` slot prop: a bare call
// flips, a boolean sets, and a DOM event (from `@click="toggle"`) is ignored so
// the handler argument does not read as `true`.
function toggle(flag?: boolean | Event) {
  if (flag instanceof Event) flag = undefined
  open.value = flag ?? !open.value
}

function closePopover() {
  open.value = false
}

function onFocus() {
  typing.value = true
  if (props.openOnFocus && !open.value) open.value = true
  emit('focus')
}

function onClick(e: MouseEvent) {
  typing.value = true
  if (props.openOnClick && !open.value) open.value = true
  emit('click', e)
}

// Focus moving into the portalled panel fires blur on the input. The panel
// belongs to the input, so that is not a blur.
function onBlur(e: FocusEvent) {
  const next = e.relatedTarget as Node | null
  if (next && popoverRef.value?.contentEl?.contains(next)) return
  emit('blur')
  typing.value = false
}

function onEnter() {
  emit('enter')
  typing.value = false
}

function onArrowDown() {
  if (!open.value) open.value = true
  emit('requestFocus')
}

const triggerSlotProps = computed<PickerShellTriggerSlotProps>(() => ({
  toggle,
  open: open.value,
  displayLabel: props.displayLabel,
  inputValue: inputValue.value,
}))

const hasCustomTrigger = computed(() => !!slots.trigger)

watch(open, (val, prev) => {
  if (val === prev) return
  if (val) {
    emit('open')
    // Custom triggers (e.g. a button) have no typing context — once the
    // popover is open the user wants to interact with the content. Signal
    // the parent to move focus there. The default `TextInput` trigger
    // keeps its focus so the user can type, and only the explicit ↓
    // handler emits `requestFocus`.
    if (hasCustomTrigger.value) emit('requestFocus')
  } else {
    // Restore focus to the trigger input if the popover content had focus
    // (Esc, date selection in auto-close mode). Click-outside leaves focus
    // on the clicked element, so we skip in that case.
    const hadFocusInside = popoverRef.value?.contentEl?.contains(
      document.activeElement,
    )
    emit('close')
    if (hadFocusInside) {
      nextTick(() => textInputRef.value?.focus())
    }
  }
})

defineExpose<PickerShellExposed>({
  open: () => {
    open.value = true
  },
})
</script>
