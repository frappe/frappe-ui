<template>
  <!-- Scrolling region of a panel (auto-hide overlay scrollbar). -->
  <ScrollArea ref="scrollArea" class="min-h-0 flex-1" viewport-class="px-[4.4rem] pb-16">
    <slot />
  </ScrollArea>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { ScrollArea } from '../ScrollArea'

const scrollArea = ref<InstanceType<typeof ScrollArea>>()

// Forward the scroll viewport element so a panel body can be virtualized while
// keeping this component's styled scrollbar (see ScrollArea.viewportElement).
defineExpose({
  viewportElement: computed(() => scrollArea.value?.viewportElement ?? null),
})
</script>
