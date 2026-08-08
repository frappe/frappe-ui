<template>
  <PopoverRoot v-model:open="isOpen">
    <!--
      #trigger renders through reka's PopoverTrigger as-child, so click,
      keyboard and aria wiring come for free on whatever element the consumer
      passes.
    -->
    <PopoverTrigger ref="triggerRef" as-child data-slot="trigger">
      <slot name="trigger" v-bind="slotProps" />
    </PopoverTrigger>

    <PopoverPortal :to="portalTo">
      <PopoverContent
        data-slot="content"
        class="z-[100]"
        :side="side"
        :align="align"
        :side-offset="offset"
        :collision-padding="collisionPadding"
        :style="{
          minWidth: matchTriggerWidth
            ? 'var(--reka-popover-trigger-width)'
            : undefined,
        }"
        @interact-outside="onInteractOutside"
        @escape-key-down="onEscapeKeyDown"
      >
        <slot v-if="bare" v-bind="slotProps" />
        <PopoverPanel v-else>
          <slot v-bind="slotProps" />
        </PopoverPanel>
        <PopoverArrow
          v-if="arrow"
          data-slot="arrow"
          class="fill-surface-elevation-2"
        />
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  PopoverArrow,
  PopoverContent,
  PopoverPortal,
  PopoverRoot,
  PopoverTrigger,
} from 'reka-ui'
import PopoverPanel from '../shared/popover/PopoverPanel.vue'
import type { PopoverEmits, PopoverProps, PopoverSlotProps } from './types'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<PopoverProps>(), {
  open: undefined,
  side: 'bottom',
  align: 'start',
  offset: 4,
  portalTo: 'body',
  collisionPadding: 10,
  dismissible: true,
  matchTriggerWidth: false,
  bare: false,
  arrow: false,
})

const emit = defineEmits<PopoverEmits>()

// Controlled when the parent binds `open`, uncontrolled otherwise.
const controlled = computed(() => props.open !== undefined)
const uncontrolledOpen = ref(false)
// reka's PopoverTrigger, exposes the trigger DOM node via `$el`.
const triggerRef = ref<{ $el: Element } | null>(null)

const isOpen = computed<boolean>({
  get: () => (controlled.value ? Boolean(props.open) : uncontrolledOpen.value),
  set: (value: boolean) => {
    if (!controlled.value) {
      uncontrolledOpen.value = value
    }
    emit('update:open', value)
    if (value) emit('open')
    else emit('close')
  },
})

function open() {
  if (isOpen.value) return
  isOpen.value = true
}

function close() {
  if (!isOpen.value) return
  isOpen.value = false
}

function toggle(flag?: boolean | Event) {
  if (flag instanceof Event) flag = undefined
  if (flag == null) flag = !isOpen.value
  if (flag) open()
  else close()
}

defineExpose({ open, close })

// `open` is the state, not a method — the same word the rest of the family's
// trigger slots use (Dropdown, Select, MultiSelect, HoverCard, Sidebar). The
// trigger opens itself through reka's `as-child` wiring, so a slot-level
// `open()` had no callers; `toggle` covers the cases that need it by hand.
const slotProps = computed<PopoverSlotProps>(() => ({
  open: isOpen.value,
  close,
  toggle,
}))

// `dismissible` covers both user-initiated dismiss channels, per CONTEXT.md —
// outside click and Escape. Wiring only the first left `:dismissible="false"`
// closing on Escape anyway.
function onEscapeKeyDown(event: Event) {
  if (!props.dismissible) event.preventDefault()
}

function onInteractOutside(event: Event) {
  if (!props.dismissible) {
    event.preventDefault()
    return
  }
  // Prevent close-then-reopen flicker when clicking the trigger itself. The
  // trigger's own click already toggles the popover via reka's `onOpenToggle`,
  // so letting the dismissable layer close it too would race that toggle. We
  // suppress the outside-close and let the toggle decide the final state.
  const target = event.target as Element
  const triggerEl = triggerRef.value?.$el
  if (triggerEl && (triggerEl.contains(target) || triggerEl === target)) {
    event.preventDefault()
  }
}

defineSlots<{
  /** Trigger element. Rendered via reka PopoverTrigger as-child. */
  trigger?: (props: PopoverSlotProps) => any
  /** Popover content, rendered inside the shared panel shell unless `bare`. */
  default?: (props: PopoverSlotProps) => any
}>()
</script>
