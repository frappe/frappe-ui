<script setup lang="ts">
import { type HTMLAttributes } from 'vue'
import {
  TooltipProvider,
  TooltipRoot,
  TooltipPortal,
  TooltipTrigger,
  TooltipContent,
  TooltipArrow,
  type TooltipContentProps,
} from 'radix-vue'
import { computed } from 'vue'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(
  defineProps<{
    text?: string
    hoverDelay?: number
    placement?: TooltipContentProps['side']
    arrowClass?: HTMLAttributes['class']
  }>(),
  {
    text: '',
    placement: 'top',
    hoverDelay: 0.5,
    arrowClass: 'fill-gray-900',
  }
)

const delayDuration = computed(() => props.hoverDelay * 1000)
</script>

<template>
  <TooltipProvider :delayDuration="delayDuration">
    <TooltipRoot>
      <TooltipTrigger as-child>
        <slot />
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent
          v-if="props.text || $slots.body"
          :side="props.placement"
          :side-offset="4"
        >
          <slot name="body">
            <div
              class="rounded bg-gray-900 px-2 py-1 text-xs text-white shadow-xl"
            >
              <div>{{ props.text }}</div>
            </div>
          </slot>
          <TooltipArrow :class="props.arrowClass" :width="8" :height="4" />
        </TooltipContent>
      </TooltipPortal>
    </TooltipRoot>
  </TooltipProvider>
</template>
