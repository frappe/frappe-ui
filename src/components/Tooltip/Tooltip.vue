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
} from 'reka-ui'
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
    disabled?: boolean
  }>(),
  {
    text: '',
    placement: 'top',
    hoverDelay: 0.5,
    arrowClass: 'fill-surface-gray-7',
    disabled: false,
  },
)

const delayDuration = computed(() => props.hoverDelay * 1000)
</script>

<template>
  <slot v-if="disabled" />
  <TooltipProvider v-else :delayDuration="delayDuration">
    <TooltipRoot>
      <TooltipTrigger as-child>
        <slot />
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent
          v-if="props.text || $slots.body"
          :side="props.placement"
          :side-offset="4"
          class="z-[100]"
        >
          <slot name="body">
            <div
              class="rounded bg-surface-gray-7 px-2 py-1 text-xs text-ink-white shadow-xl"
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
