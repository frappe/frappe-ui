<template>
  <PopoverRoot v-model:open="isOpen">
    <!--
      The content is positioned against the anchor: `reference` if given, else
      the trigger element. In `click` mode reka's PopoverTrigger adds click,
      keyboard and aria wiring to the trigger. In `manual` mode a bare Primitive
      adds nothing.
    -->
    <PopoverAnchor :reference="reference" as-child>
      <component
        :is="trigger === 'manual' ? Primitive : PopoverTrigger"
        ref="triggerRef"
        as-child
        data-slot="trigger"
      >
        <slot name="trigger" v-bind="slotProps" />
      </component>
    </PopoverAnchor>

    <PopoverPortal :to="portalTarget">
      <PopoverContent
        ref="contentRef"
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
        @open-auto-focus="onOpenAutoFocus"
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
import { computed, ref, watch } from 'vue'
import {
  PopoverAnchor,
  PopoverArrow,
  PopoverContent,
  PopoverPortal,
  PopoverRoot,
  PopoverTrigger,
  Primitive,
} from 'reka-ui'
import PopoverPanel from '../shared/popover/PopoverPanel.vue'
import { usePortalTarget } from '../../composables/usePortalTarget'
import type { PopoverEmits, PopoverProps, PopoverSlotProps } from './types'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<PopoverProps>(), {
  open: undefined,
  side: 'bottom',
  align: 'start',
  offset: 4,
  collisionPadding: 10,
  dismissible: true,
  autoFocus: true,
  trigger: 'click',
  matchTriggerWidth: false,
  bare: false,
  arrow: false,
})

const portalTarget = usePortalTarget(() => props.portalTo)

const emit = defineEmits<PopoverEmits>()

// Controlled when the parent binds `open`, uncontrolled otherwise.
const controlled = computed(() => props.open !== undefined)
const uncontrolledOpen = ref(false)
// reka's PopoverTrigger, exposes the trigger DOM node via `$el`.
const triggerRef = ref<{ $el: Element } | null>(null)
const contentRef = ref<{ $el: Element } | null>(null)

const isOpen = computed<boolean>({
  get: () => (controlled.value ? Boolean(props.open) : uncontrolledOpen.value),
  set: (value: boolean) => {
    if (!controlled.value) {
      uncontrolledOpen.value = value
    }
    emit('update:open', value)
  },
})

// `open` and `close` report the state the popover actually reached, not the one
// reka asked for. A controlled parent may decline the request — binding `:open`
// and honouring `update:open` only on the way down is how a consumer delays or
// suppresses opening — and a popover that never opened must not announce that it
// did, or whatever `@open` set up is never taken down by the `@close` that never
// comes. `update:open` above stays on the request: that IS the request.
//
// The default `pre` flush runs before the content renders and keeps the pair in
// its old order, after `update:open`.
watch(isOpen, (value) => (value ? emit('open') : emit('close')))

// PopoverContent keeps its template ref while its DOM mounts and unmounts, so
// the element is read on demand, not cached. `$el` is reka's positioning
// wrapper; the content root is the `data-slot` element inside it.
function getContentEl(): HTMLElement | null {
  const wrapper = contentRef.value?.$el
  if (!(wrapper instanceof HTMLElement)) return null
  return wrapper.querySelector<HTMLElement>('[data-slot="content"]')
}

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

defineExpose({
  open,
  close,
  get contentEl() {
    return getContentEl()
  },
})

// `open` is the state, not a method — the same word the rest of the family's
// trigger slots use (Dropdown, Select, MultiSelect, HoverCard, Sidebar). The
// trigger opens itself through reka's `as-child` wiring, so a slot-level
// `open()` had no callers; `toggle` covers the cases that need it by hand.
const slotProps = computed<PopoverSlotProps>(() => ({
  open: isOpen.value,
  close,
  toggle,
}))

// reka focuses the content on open. A panel driven by typing must leave the
// caret in the input, so `autoFocus: false` cancels that.
function onOpenAutoFocus(event: Event) {
  if (!props.autoFocus) event.preventDefault()
}

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
