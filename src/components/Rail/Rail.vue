<template>
  <div
    data-slot="rail"
    class="flex h-full w-[50px] shrink-0 flex-col items-center bg-surface-sidebar px-[11px] pb-3 pt-2.5"
  >
    <!-- One provider for the whole rail: hovering between items shows their
         tooltips instantly, with no per-item delay. -->
    <TooltipProvider :hover-delay="0">
      <slot />
    </TooltipProvider>
  </div>
</template>

<script setup lang="ts">
import TooltipProvider from '../Tooltip/TooltipProvider.vue'
</script>
