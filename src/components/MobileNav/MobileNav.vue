<template>
  <nav
    data-slot="mobile-nav"
    class="grid shrink-0 auto-cols-fr grid-flow-col border-t border-outline-gray-2 bg-surface-elevation-2 [@media(display-mode:standalone)]:pb-[max(1rem,env(safe-area-inset-bottom))]"
  >
    <slot />
  </nav>
</template>

<script setup lang="ts">
// A bare grid frame: each MobileNavItem becomes one equal-width column
// (auto-cols-fr + grid-flow-col), so the bar adapts to any item count without
// hardcoding a column class. In an installed PWA (display-mode: standalone)
// the bar runs to the bottom edge and its padding clears the home indicator:
// the safe-area inset, or 1rem where the inset is smaller.

defineSlots<{
  /** One or more `MobileNavItem`s, each becoming an equal-width tab. */
  default?: () => any
}>()
</script>
