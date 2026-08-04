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
  hoverDelay: 0.3,
  leaveDelay: 0.3,
  arrow: false,
})

const portalTarget = usePortalTarget(() => props.portalTo)

const open = defineModel<boolean>('open', { default: false })

// reka HoverCard delays are in milliseconds; the public API uses seconds to
// stay consistent with Tooltip.
const openDelay = computed(() => props.hoverDelay * 1000)
const closeDelay = computed(() => props.leaveDelay * 1000)

defineExpose<HoverCardExposed>({
  open: () => {
    open.value = true
  },
  close: () => {
    open.value = false
  },
})

defineSlots<{
  /** Trigger element. Rendered as-child so hover/focus a11y is auto-wired. */
  trigger?: (props: HoverCardSlotProps) => any
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
    <HoverCardPortal :to="portalTarget">
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
          The panel relies on the ancestor HoverCardContent's data-state for
          motion.
        -->
        <PopoverPanel>
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
