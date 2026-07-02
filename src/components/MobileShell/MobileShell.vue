<template>
  <div
    data-slot="mobile-shell"
    class="fixed inset-0 flex touch-none flex-col overflow-hidden"
  >
    <!-- Pages teleport their headers here. Extra top padding clears the notch /
         status bar when running as an installed PWA (display-mode: standalone). -->
    <PageHeaderTarget
      class="[@media(display-mode:standalone)]:pt-[env(safe-area-inset-top)]"
    />

    <!--
      Native momentum scroll (not ScrollArea's custom bar — a mobile surface
      wants the platform's own overscroll + inertia). Registered into the shared
      scroll-container registry so `useScrollContainer()` resolves it.
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
import { onBeforeUnmount, onMounted, useTemplateRef } from 'vue'
import PageHeaderTarget from '../PageHeader/PageHeaderTarget.vue'
import {
  registerScrollContainer,
  unregisterScrollContainer,
} from '../../composables/useScrollContainer'

const scroll = useTemplateRef<HTMLElement>('scroll')

onMounted(() => scroll.value && registerScrollContainer(scroll.value))
onBeforeUnmount(() => scroll.value && unregisterScrollContainer(scroll.value))
</script>
