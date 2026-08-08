<template>
  <!-- Scrolling region of a panel (auto-hide overlay scrollbar). -->
  <ScrollArea
    ref="scrollArea"
    class="min-h-0 flex-1"
    viewport-class="px-[4.4rem] pb-16"
  >
    <slot />
  </ScrollArea>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ScrollArea } from '../ScrollArea'
import type { SettingsBodyExposed } from './types'

defineOptions({ name: 'SettingsBody' })

const scrollArea = ref<InstanceType<typeof ScrollArea>>()

// Forward the scroll viewport element so a panel body can be virtualized while
// keeping this component's styled scrollbar (see ScrollArea.viewportElement).
// A getter, not a computed: defineExpose<T>() type-checks the object literal
// against SettingsBodyExposed's plain `HTMLElement | null` field, which a
// ComputedRef doesn't structurally match (imperative-api.md §2.3).
defineExpose<SettingsBodyExposed>({
  get viewportElement() {
    return scrollArea.value?.viewportElement ?? null
  },
})
</script>
