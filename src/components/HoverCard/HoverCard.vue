<template>
  <HoverCardRoot>
    <HoverCardTrigger as-child>
      <slot />
    </HoverCardTrigger>
    
    <HoverCardPortal>
      <HoverCardContent 
        :class="[
          'z-50 rounded-lg bg-surface-modal shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none hover-card-content',
          contentClass
        ]"
      >
        <slot name="content" />
        
        <HoverCardArrow
          v-if="arrow"
          class="fill-surface-modal"
          :width="10"
          :height="5"
        />
      </HoverCardContent>
    </HoverCardPortal>
  </HoverCardRoot>
</template>

<script setup lang="ts">
import {
  HoverCardRoot,
  HoverCardTrigger,
  HoverCardPortal,
  HoverCardContent,
  HoverCardArrow,
} from 'reka-ui'

defineProps<{
  arrow?: boolean
  contentClass?: string
}>()
</script>

<style scoped>
@keyframes hover-card-in {
  from {
    opacity: 0;
    transform: scale(0.96);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes hover-card-out {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.96);
  }
}

:global(.hover-card-content[data-state='open']) {
  animation: hover-card-in 150ms ease-out;
}

:global(.hover-card-content[data-state='closed']) {
  animation: hover-card-out 100ms ease-in;
}
</style>
