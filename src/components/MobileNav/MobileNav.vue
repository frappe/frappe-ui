<template>
  <nav
    data-slot="mobile-nav"
    class="grid shrink-0 auto-cols-fr grid-flow-col border-t border-outline-gray-2 bg-surface-elevation-2 [@media(display-mode:standalone)]:pb-4"
  >
    <slot />
  </nav>
</template>

<script setup lang="ts">
// A bare grid frame: each MobileNavItem becomes one equal-width column
// (auto-cols-fr + grid-flow-col), so the bar adapts to any item count without
// hardcoding a column class. Bottom padding clears the home indicator in an
// installed PWA (display-mode: standalone).
</script>
