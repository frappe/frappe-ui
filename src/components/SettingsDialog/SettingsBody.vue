<template>
  <!-- Scrolling region of a panel (auto-hide overlay scrollbar). -->
  <ScrollArea class="min-h-0 flex-1" viewport-class="px-8 pb-8">
    <slot />
  </ScrollArea>
</template>

<script setup lang="ts">
import { ScrollArea } from '../ScrollArea'
</script>
