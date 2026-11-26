<script setup lang="ts">
import {
  Sidebar,
  SidebarCollapseToggle,
  SidebarHeader,
  SidebarItem,
} from '../src'
import FrappeLogo from './FrappeLogo.vue'
import * as pending from './pendingFrappeUIChanges'
import ThemeSwitcher from './ThemeSwitcher.vue'

defineProps<{
  /** The patterns, in the order the sidebar lists them. */
  pages: { path: string; href: string; label: string; icon: string }[]
  /** Which one is open. */
  current: string
}>()

const emit = defineEmits<{
  /** A sidebar item was chosen. The shell asks; the app does the moving. */
  open: [path: string]
}>()

// The rows stay real links — middle-click and "open in new tab" keep working —
// but a plain click is handled in place instead of reloading the page.
function choose(event: MouseEvent, path: string) {
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) {
    return
  }
  event.preventDefault()
  emit('open', path)
}
</script>

<template>
  <!--
    The playground is one page per pattern, reached from the sidebar. No
    router, so each item is a real link and the shell marks the open one.
  -->
  <div class="flex min-h-screen bg-surface-base">
    <!--
      The document scrolls, not the content pane: the sidebar sticks instead.
      That keeps every page's "On this page" rail listening to the one scroll
      it already knows about.
    -->
    <div class="sticky top-0 h-screen shrink-0">
      <Sidebar
        class="h-full border-r border-outline-gray-1"
        :class="[pending.sidebarTopPadding, pending.headerTextGap]"
      >
        <SidebarHeader title="Patterns" subtitle="Frappe UI">
          <!-- The real mark, in the 28px box the header keeps for it. -->
          <template #prefix><FrappeLogo class="h-full w-full" /></template>
        </SidebarHeader>

        <!--
          14px between the header and the first item, as the design sets it.
          SidebarHeader is a 48px region with its 40px row centred in it, so 4
          of those 14 are already there and the nav adds the other 10 — 6 of
          margin and 4 of padding.

          The split matters: `overflow-y-auto` makes this a clipping box, and
          the active item's `shadow-sm` reaches ~2px past its own top edge, so
          against a padding of zero the shadow was cut off square whenever the
          first item was the active one. The 4px of padding gives it room, and
          the margin drops by the same 4 so the gap itself doesn't move.

          Icons as the design marks them: a cog, a table, a pulse.
        -->
        <nav
          class="mt-1.5 flex flex-1 flex-col gap-0.5 overflow-y-auto px-2 py-1"
        >
          <SidebarItem
            v-for="page in pages"
            :key="page.path"
            :label="page.label"
            :icon="page.icon"
            :href="page.href"
            :active="page.path === current"
            @click="choose($event, page.path)"
          />
        </nav>

        <div class="px-2 pb-2">
          <SidebarCollapseToggle />
        </div>
      </Sidebar>
    </div>

    <main class="min-w-0 flex-1">
      <slot />
    </main>

    <!-- 20px off the bottom-right corner, where the design parks it. -->
    <div class="fixed bottom-5 right-5 z-20">
      <ThemeSwitcher />
    </div>
  </div>
</template>
