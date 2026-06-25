<script setup lang="ts">
import {
  HoverCardArrow,
  HoverCardContent,
  HoverCardPortal,
  HoverCardRoot,
  HoverCardTrigger,
} from 'reka-ui'
import { computed } from 'vue'
import PopoverPanel from '../shared/popover/PopoverPanel.vue'
import type { HoverCardProps } from './types'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<HoverCardProps>(), {
  side: 'bottom',
  align: 'start',
  offset: 4,
  portalTo: 'body',
  collisionPadding: 10,
  hoverDelay: 0.3,
  leaveDelay: 0.3,
  arrow: false,
})

const open = defineModel<boolean>('open', { default: false })

// reka HoverCard delays are in milliseconds; the public API uses seconds to
// stay consistent with Tooltip.
const openDelay = computed(() => props.hoverDelay * 1000)
const closeDelay = computed(() => props.leaveDelay * 1000)

defineExpose({
  open: () => {
    open.value = true
  },
  close: () => {
    open.value = false
  },
})

defineSlots<{
  /** Trigger element. Rendered as-child so hover/focus a11y is auto-wired. */
  trigger?: (props: { open: boolean }) => any
  /** Card contents, rendered inside the standard PopoverPanel shell. */
  default?: () => any
}>()
</script>

<template>
  <HoverCardRoot
    v-model:open="open"
    :open-delay="openDelay"
    :close-delay="closeDelay"
  >
    <HoverCardTrigger as-child>
      <slot name="trigger" :open="open" />
    </HoverCardTrigger>
    <HoverCardPortal :to="portalTo">
      <HoverCardContent
        data-slot="content"
        class="z-[100]"
        :side="side"
        :align="align"
        :side-offset="offset"
        :collision-padding="collisionPadding"
        v-bind="$attrs"
      >
        <!--
          Hover opens always want the scale-from-trigger entrance, so motion is
          fixed to 'animated' rather than driven by usePopoverMotion (which keys
          on pointerdown and would classify a hover open as 'instant'). The
          panel relies on the ancestor HoverCardContent's data-state for motion.
        -->
        <PopoverPanel
          motion="animated"
          class="origin-[var(--reka-hover-card-content-transform-origin)]"
        >
          <slot />
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
