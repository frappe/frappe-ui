<script setup lang="ts">
// Navbar for the full-width pages (home, recipes): brand, search, site
// actions. Doc pages use the app-shell pair instead — the brand at the top of
// the Sidebar and Docs/Header.vue built on PageHeader. Consumers inject extra
// controls via the `#actions` slot, swap the brand via `#brand`, or replace
// search via `#search`.
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useData, withBase } from 'vitepress'

import Brand from './Brand.vue'
import SiteActions from './SiteActions.vue'
import Search from './Docs/Search.vue'

const { theme } = useData()

const docsLink = computed(
  () => theme.value.sidebar?.[0]?.items?.[0]?.link ?? '/',
)

// The header only needs a border once content sits behind it.
const scrolled = ref(false)
const onScroll = () => (scrolled.value = window.scrollY > 0)
onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <header
    class="sticky top-0 z-20 flex h-12 items-center gap-3 border-b bg-surface-base/80 backdrop-blur-[10px] px-4 sm:px-5"
    :class="scrolled ? 'border-outline-gray-1' : 'border-transparent'"
  >
    <slot name="brand">
      <Brand />
    </slot>

    <div class="flex flex-1 justify-center px-2">
      <slot name="search">
        <Search class="hidden w-full max-w-md md:flex" />
      </slot>
    </div>

    <nav class="flex items-center gap-2 sm:gap-3">
      <slot name="actions" />

      <a
        :href="withBase(docsLink)"
        class="hidden px-1 text-sm text-ink-gray-7 hover:text-ink-gray-9 md:block"
      >
        Docs
      </a>

      <SiteActions />
    </nav>
  </header>
</template>
