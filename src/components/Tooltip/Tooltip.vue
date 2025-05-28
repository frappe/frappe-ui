<script setup lang="ts">
import {
  TooltipProvider,
  TooltipRoot,
  TooltipPortal,
  TooltipTrigger,
  TooltipContent,
  TooltipArrow,
} from 'reka-ui'
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
