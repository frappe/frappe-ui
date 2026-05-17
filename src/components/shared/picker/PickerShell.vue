<template>
  <PopoverRoot v-model:open="open">
    <PopoverAnchor :reference="anchorEl" as-child>
      <div @keydown.down.prevent="onArrowDown">
        <slot name="trigger" v-bind="triggerSlotProps">
          <slot name="target" v-bind="triggerSlotProps">
            <TextInput
              ref="textInputRef"
              v-model="inputValue"
              type="text"
              :class="inputClass"
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
              @pointerdown="onPointerDown"
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
                    @mousedown.prevent="togglePopover"
                  />
                </slot>
              </template>
            </TextInput>
          </slot>
        </slot>
      </div>
    </PopoverAnchor>
    <PopoverPortal>
      <PopoverContent
        data-slot="content"
        data-selection
        class="z-[100]"
        :side="side"
        :align="align"
        :side-offset="offset"
        @open-auto-focus.prevent
        @interact-outside="onInteractOutside"
      >
        <div
          ref="popoverContentRef"
          data-slot="content-body"
          :data-motion="motion"
          :class="contentClass"
          style="transform-origin: var(--reka-popover-content-transform-origin)"
        >
          <slot :close="closePopover" />
        </div>
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import {
  PopoverAnchor,
  PopoverContent,
  PopoverPortal,
  PopoverRoot,
} from 'reka-ui'
import { TextInput } from '../../TextInput'
import LucideChevronDown from '~icons/lucide/chevron-down'
import { usePopoverMotion } from '../../../composables/usePopoverMotion'
import type { InputSize, InputVariant } from '../../../composables/inputTypes'
import type { FrappeUIError } from '../../../composables/useInputLabeling'
import '../selection/popoverMotion.css'

interface Props {
  // Positioning — already resolved by caller from side/align/placement.
  side: 'top' | 'right' | 'bottom' | 'left'
  align: 'start' | 'center' | 'end'
  offset: number

  // Behaviour
  openOnFocus?: boolean
  openOnClick?: boolean

  // TextInput pass-through
  id?: string
  label?: string
  description?: string
  error?: string | FrappeUIError
  required?: boolean
  size?: InputSize
  variant?: InputVariant
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  inputClass?: string | Array<string> | Record<string, boolean>

  // Display label exposed via trigger slot props for caller-rendered triggers.
  displayLabel?: string

  // Tailwind class string for the popover content body wrapper.
  contentClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  openOnFocus: false,
  openOnClick: true,
  required: false,
  disabled: false,
  readonly: false,
  displayLabel: '',
  contentClass: '',
})

const emit = defineEmits<{
  (e: 'focus'): void
  (e: 'click'): void
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

const slots = defineSlots<{
  trigger?: (props: TriggerSlotProps) => any
  target?: (props: TriggerSlotProps) => any
  prefix?: (props: TriggerSlotProps) => any
  suffix?: (props: TriggerSlotProps) => any
  default?: (props: { close: () => void }) => any
}>()

const open = defineModel<boolean>('open', { default: false })
const inputValue = defineModel<string>('inputValue', { default: '' })
const typing = defineModel<boolean>('typing', { default: false })

interface TriggerSlotProps {
  togglePopover: () => void
  isOpen: boolean
  displayLabel: string
  inputValue: string
}

// Anchor the popover at the input element itself (not the labeling wrapper),
// so it sits below the input rather than below the description text.
const textInputRef = ref<{ el: HTMLElement | null } | null>(null)
const popoverContentRef = ref<HTMLElement | null>(null)

const anchorEl = computed(() => {
  if (slots.trigger || slots.target) return undefined
  return textInputRef.value?.el ?? undefined
})

const { motion, onPointerDown: recordPointerDown } = usePopoverMotion(open)

function onPointerDown() {
  recordPointerDown()
}

function togglePopover() {
  open.value = !open.value
}

function closePopover() {
  open.value = false
}

// Reka treats anything outside `PopoverContent` as "outside" — including our
// own trigger — so a click on the input fires interact-outside and closes
// the popover, then the click handler reopens it. Suppress the close when
// the pointerdown originated inside the input's row (which holds the input
// and any suffix like the chevron); those elements have their own logic.
function onInteractOutside(event: Event) {
  const target = event.target as Node | null
  const triggerRow = textInputRef.value?.el?.parentElement
  if (target && triggerRow?.contains(target)) {
    event.preventDefault()
  }
}

function onFocus() {
  typing.value = true
  if (props.openOnFocus && !open.value) open.value = true
  emit('focus')
}

function onClick() {
  typing.value = true
  if (props.openOnClick && !open.value) open.value = true
  emit('click')
}

function onBlur(e: FocusEvent) {
  // Clicks inside the popover panel re-focus options; treat those as still-focused.
  const next = e.relatedTarget as Node | null
  if (next && popoverContentRef.value?.contains(next)) return
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

const triggerSlotProps = computed<TriggerSlotProps>(() => ({
  togglePopover,
  isOpen: open.value,
  displayLabel: props.displayLabel,
  inputValue: inputValue.value,
}))

const hasCustomTrigger = computed(() => !!(slots.trigger || slots.target))

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
    const hadFocusInside = popoverContentRef.value?.contains(
      document.activeElement,
    )
    emit('close')
    if (hadFocusInside) {
      nextTick(() => textInputRef.value?.el?.focus())
    }
  }
})

defineExpose({
  open: () => {
    open.value = true
  },
})
</script>
