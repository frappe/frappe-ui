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
import { inject, onBeforeUnmount, onMounted, ref } from 'vue'
import { useEventListener } from '@vueuse/core'
import { ScrollArea } from '../ScrollArea'
import { settingsPanelScrolledKey } from './context'
import type { SettingsBodyExposed } from './types'

defineOptions({ name: 'SettingsBody' })

const scrollArea = ref<InstanceType<typeof ScrollArea>>()
const scrolled = inject(settingsPanelScrolledKey, null)

onMounted(() => {
  const viewport = scrollArea.value?.viewportElement
  if (!scrolled || !viewport) return
  const sync = () => (scrolled.value = viewport.scrollTop > 0)
  sync()
  useEventListener(viewport, 'scroll', sync, { passive: true })
})

// The panel outlives this body when its tab is not selected.
onBeforeUnmount(() => {
  if (scrolled) scrolled.value = false
})

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
