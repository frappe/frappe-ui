<template>
  <div
    data-slot="mobile-shell"
    class="fixed inset-0 flex touch-none flex-col overflow-hidden"
  >
    <!-- Pages teleport their headers here. Extra top padding clears the notch /
         status bar when running as an installed PWA (display-mode: standalone). -->
    <PageHeaderTarget
      ref="headerTarget"
      class="[@media(display-mode:standalone)]:pt-[env(safe-area-inset-top)]"
    />

    <!--
      Native momentum scroll (not ScrollArea's custom bar — a mobile surface
      wants the platform's own overscroll + inertia). Registered into the shared
      scroll-container registry so `shellScrollContainer` resolves it.
    -->
    <div
      ref="scroll"
      data-slot="mobile-shell-scroll"
      class="flex-1 overflow-y-auto overscroll-auto bg-surface-base [-webkit-overflow-scrolling:touch]"
    >
      <slot />
    </div>

    <slot name="nav" />
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  onBeforeUnmount,
  onMounted,
  provide,
  ref,
  useTemplateRef,
} from 'vue'
import PageHeaderTarget from '../PageHeader/PageHeaderTarget.vue'
import { pageHeaderTargetKey } from '../PageHeader/target'
import {
  registerShellScrollContainer,
  shellScrollElementKey,
  unregisterShellScrollContainer,
} from '../../composables/useShellScrolled'

defineSlots<{
  /** The routed page content, placed in the native-scrolling content area. */
  default?: () => any
  /** The bottom navigation — usually a `MobileNav`. */
  nav?: () => any
}>()

const scroll = useTemplateRef<HTMLElement>('scroll')
const headerTarget = ref<{ el: HTMLElement | null } | null>(null)

// SHELL-Q3: the shell owns both elements, so it hands them to its own subtree.
// The module registries stay as the fallback for what `inject` cannot reach.
provide(
  shellScrollElementKey,
  computed(() => scroll.value ?? null),
)
provide(
  pageHeaderTargetKey,
  computed(() => headerTarget.value?.el ?? null),
)

onMounted(() => scroll.value && registerShellScrollContainer(scroll.value))
onBeforeUnmount(
  () => scroll.value && unregisterShellScrollContainer(scroll.value),
)
</script>
