<script setup lang="ts">
// Default docs navbar — fully themeConfig-driven, so any consumer gets site
// chrome (brand, search, theme toggle, GitHub) for free. The
// shared Layout renders this in its `#navbar` slot by default; consumers can
// inject extra controls via the `#actions` slot, swap the brand via `#brand`,
// or replace search via `#search` — or override the whole `#navbar` slot.
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useData, withBase } from 'vitepress'
import { Button } from 'frappe-ui'

import Search from './Docs/Search.vue'
import { setTheme, useTheme } from '../composables/useTheme'

// `isDocs` is true on prose pages — it drops the "Docs" link.
defineProps<{ isDocs?: boolean }>()

const { theme } = useData()

const name = computed(() => theme.value.name ?? '')
const logo = computed(() => theme.value.logo ?? '')
const githubUrl = computed(() => theme.value.githubUrl ?? '')
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

const currentTheme = useTheme()
const toggleTheme = () =>
  setTheme(currentTheme.value === 'dark' ? 'light' : 'dark')
</script>

<template>
  <header
    class="sticky top-0 z-20 flex h-12 items-center gap-3 border-b bg-surface-base/80 backdrop-blur-[10px] px-4 sm:px-5"
    :class="scrolled ? 'border-outline-gray-1' : 'border-transparent'"
  >
    <slot name="brand">
      <a
        v-if="logo || name"
        :href="withBase('/')"
        class="flex items-center gap-1.5 min-w-0"
      >
        <img
          v-if="logo"
          :src="withBase(logo)"
          class="w-6 shrink-0"
          :alt="name"
        />
        <span
          v-if="name"
          class="text-lg-bold text-ink-gray-8 truncate tracking-[-0.01em]"
        >
          {{ name }}
        </span>
      </a>
    </slot>

    <div class="flex flex-1 justify-center px-2">
      <slot name="search">
        <Search class="hidden w-full max-w-md md:flex" />
      </slot>
    </div>

    <nav class="flex items-center gap-2 sm:gap-3">
      <slot name="actions" />

      <a
        v-if="!isDocs"
        :href="withBase(docsLink)"
        class="hidden px-1 text-sm text-ink-gray-7 hover:text-ink-gray-9 md:block"
      >
        Docs
      </a>

      <Button
        v-if="githubUrl"
        variant="ghost"
        :link="githubUrl"
        aria-label="GitHub repository"
      >
        <template #icon>
          <svg
            viewBox="0 0 16 16"
            class="h-4 w-4 fill-current"
            aria-hidden="true"
          >
            <path
              d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z"
            />
          </svg>
        </template>
      </Button>

      <Button variant="ghost" aria-label="Toggle theme" @click="toggleTheme">
        <template #icon>
          <span
            :class="currentTheme === 'dark' ? 'lucide-sun' : 'lucide-moon-star'"
            class="size-4"
          />
        </template>
      </Button>
    </nav>
  </header>
</template>
