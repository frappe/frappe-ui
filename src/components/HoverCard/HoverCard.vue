<script setup lang="ts">
import {
  HoverCardArrow,
  HoverCardContent,
  HoverCardPortal,
  HoverCardRoot,
  HoverCardTrigger,
} from 'reka-ui'
import { computed, ref } from 'vue'
import PopoverPanel from '../shared/popover/PopoverPanel.vue'
import { usePortalTarget } from '../../composables/usePortalTarget'
import type {
  HoverCardExposed,
  HoverCardProps,
  HoverCardSlotProps,
} from './types'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<HoverCardProps>(), {
  side: 'bottom',
  align: 'start',
  offset: 4,
  collisionPadding: 10,
  hoverDelay: 300,
  leaveDelay: 300,
  arrow: false,
})

const portalTarget = usePortalTarget(() => props.portalTo)

const open = defineModel<boolean>('open', { default: false })

const openDelay = computed(() => props.hoverDelay)
const closeDelay = computed(() => props.leaveDelay)

const triggerRef = ref<{ $el: Element } | null>(null)

function setOpen(value: boolean) {
  open.value = value

  // Reka schedules an open when the pointer enters the content. If a content
  // control closes the card during that delay, the pending callback would
  // otherwise reopen it immediately. Re-apply the explicit close after the
  // configured open delay; a later explicit open cancels this callback.
  const request = ++openRequest
  if (!value && typeof window !== 'undefined') {
    window.setTimeout(() => {
      if (request === openRequest) open.value = false
    }, props.hoverDelay)
  }
}

let openRequest = 0

function close() {
  setOpen(false)
}

const slotProps = computed<HoverCardSlotProps>(() => ({
  open: open.value,
  setOpen,
  close,
}))

defineExpose<HoverCardExposed>({
  open: () => {
    open.value = true
  },
  close,
})

defineSlots<{
  /** Trigger element. Rendered as-child so hover/focus a11y is auto-wired. */
  trigger?: (props: HoverCardSlotProps) => any
  /** Card contents, rendered inside the standard PopoverPanel shell. */
  default?: (props: HoverCardSlotProps) => any
}>()

function onPointerDownOutside(event: Event) {
  const target = event.target
  const triggerEl = triggerRef.value?.$el
  if (target instanceof Node && triggerEl?.contains(target))
    event.preventDefault()
}
</script>

<template>
  <HoverCardRoot
    v-model:open="open"
    :open-delay="openDelay"
    :close-delay="closeDelay"
  >
    <HoverCardTrigger ref="triggerRef" as-child data-slot="trigger">
      <slot name="trigger" v-bind="slotProps" />
    </HoverCardTrigger>
    <HoverCardPortal :to="portalTarget">
      <HoverCardContent
        data-slot="content"
        class="z-[100]"
        :side="side"
        :align="align"
        :side-offset="offset"
        :collision-padding="collisionPadding"
        @pointer-down-outside="onPointerDownOutside"
      >
        <!--
          The panel relies on the ancestor HoverCardContent's data-state for
          motion.
        -->
        <PopoverPanel>
          <slot v-bind="slotProps" />
        </PopoverPanel>
        <HoverCardArrow
          v-if="arrow"
          data-slot="arrow"
          class="fill-surface-elevation-2"
        />
      </HoverCardContent>
    </HoverCardPortal>
  </HoverCardRoot>
</template>
