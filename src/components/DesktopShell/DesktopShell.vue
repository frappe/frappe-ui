<template>
  <div data-slot="desktop-shell" class="flex h-full">
    <slot name="rail" />
    <slot name="sidebar" />

    <div
      data-slot="desktop-shell-content"
      class="flex min-w-0 flex-1 flex-col overflow-hidden"
    >
      <!-- Pages teleport their headers here; it stays pinned above the scroll. -->
      <PageHeaderTarget ref="headerTarget" />

      <!--
        The scroll region. Registered into the shared scroll-container registry
        (via ScrollArea's exposed viewport element) so `shellScrollContainer`
        and `useShellScrolled()` resolve it with zero app wiring.
      -->
      <ScrollArea v-if="scroll" ref="scrollArea" class="min-h-0 flex-1">
        <slot />
      </ScrollArea>

      <!--
        scroll=false: the content area fills the remaining height and never
        page-scrolls, so inner panes own their own overflow — a list + detail
        split, or a horizontally-scrolling board whose columns scroll on their
        own. Without this apps fake it with `absolute inset-0` / hardcoded
        `h-[calc(100vh-3rem)]` / `[&>div]:h-full`.
      -->
      <div v-else class="flex min-h-0 flex-1 flex-col overflow-hidden">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, provide, ref, watch } from 'vue'
import ScrollArea from '../ScrollArea/ScrollArea.vue'
import PageHeaderTarget from '../PageHeader/PageHeaderTarget.vue'
import { pageHeaderTargetKey } from '../PageHeader/target'
import {
  registerShellScrollContainer,
  shellScrollElementKey,
  unregisterShellScrollContainer,
} from '../../composables/useShellScrolled'
import type { DesktopShellProps } from './types'

withDefaults(defineProps<DesktopShellProps>(), { scroll: true })

defineSlots<{
  /** The icon column — usually a `SidebarRail`. Omit it on shells that don't use one. */
  rail?: () => any
  /** The navigation panel — usually a `Sidebar`. Render it conditionally to hide it on routes that don't need it. */
  sidebar?: () => any
  /** The routed page content, placed in the scroll region (or the fixed-height pane when `scroll` is `false`). */
  default?: () => any
}>()

const scrollArea = ref<InstanceType<typeof ScrollArea> | null>(null)
const headerTarget = ref<{ el: HTMLElement | null } | null>(null)

// SHELL-Q3: the shell owns both elements, so it hands them to its own subtree.
// The module registries stay as the fallback for what `inject` cannot reach.
provide(
  shellScrollElementKey,
  computed(() => scrollArea.value?.viewportElement ?? null),
)
provide(
  pageHeaderTargetKey,
  computed(() => headerTarget.value?.el ?? null),
)

// Register the real scrolling viewport once ScrollArea exposes it, and follow it
// if it ever remounts. Unregister on teardown so a layout swap hands over to the
// other shell cleanly.
let registered: HTMLElement | null = null
watch(
  () => scrollArea.value?.viewportElement ?? null,
  (el) => {
    if (registered && registered !== el) {
      unregisterShellScrollContainer(registered)
      registered = null
    }
    if (el && el !== registered) {
      registerShellScrollContainer(el)
      registered = el
    }
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  if (registered) unregisterShellScrollContainer(registered)
})
</script>
