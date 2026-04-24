<script setup lang="ts">
import { TooltipProvider, TooltipRoot, TooltipTrigger } from 'reka-ui'
import TooltipBubble from './TooltipBubble.vue'
import { computed } from 'vue'
import type { TooltipProps } from './types'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<TooltipProps>(), {
  text: '',
  placement: 'top',
  hoverDelay: 0.5,
  arrowClass: 'fill-surface-gray-7',
  disabled: false,
})

const delayDuration = computed(() => props.hoverDelay * 1000)

defineSlots<{
  /**
   * Default trigger slot.
   * Wraps the element that the tooltip is attached to.
   */
  default?: () => any

  /**
   * Slot for fully custom tooltip body.
   * Replaces the default tooltip container entirely.
   */
  body?: () => any

  /**
   * Slot for tooltip content text.
   * Used inside the default tooltip body.
   */
  content?: () => any
}>()

</script>

<template>
  <slot v-if="disabled" />
  <TooltipProvider v-else :delayDuration="delayDuration">
    <TooltipRoot>
      <TooltipTrigger as-child>
        <slot />
      </TooltipTrigger>
      <TooltipBubble
        v-if="props.text || $slots.body || $slots.content"
        :side="props.placement"
        :text="props.text"
        :arrow-class="props.arrowClass"
      >
        <template v-if="$slots.body" #body>
          <slot name="body" />
        </template>
        <template v-if="$slots.content" #content>
          <slot name="content" />
        </template>
      </TooltipBubble>
    </TooltipRoot>
  </TooltipProvider>
</template>
