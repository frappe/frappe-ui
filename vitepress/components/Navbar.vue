<script setup lang="ts">
// Default docs navbar — fully themeConfig-driven, so any consumer gets site
// chrome (brand, breadcrumbs, search, theme toggle, GitHub) for free. The
// shared Layout renders this in its `#navbar` slot by default; consumers can
// inject extra controls via the `#actions` slot, swap the brand via `#brand`,
// or replace search via `#search` — or override the whole `#navbar` slot.
import { computed } from 'vue'
import { useData, useRoute, withBase } from 'vitepress'
import { Button, Breadcrumbs } from 'frappe-ui'

import Search from './Docs/Search.vue'
import { isActiveLink } from './Docs/sidebarList'
import { setTheme, useTheme } from '../composables/useTheme'

// `isDocs` is true on prose pages — the sidebar shows the logo there, so the
// navbar renders breadcrumbs instead of the brand on large screens.
const props = defineProps<{ isDocs?: boolean }>()

const { theme, site } = useData()
const route = useRoute()

const name = computed(() => theme.value.name ?? '')
const logo = computed(() => theme.value.logo ?? '')
const githubUrl = computed(() => theme.value.githubUrl ?? '')
const docsLink = computed(
  () => theme.value.sidebar?.[0]?.items?.[0]?.link ?? '/',
)

// Breadcrumb trail for the active page: Section / Page.
const crumbs = computed(() => {
  if (!props.isDocs) return []
  const labels: { label: string; link?: string }[] = []
  for (const section of theme.value.sidebar ?? []) {
    if (!section.items) {
      labels.push({ label: section.text, link: section.link })
    } else {
      for (const item of section.items) {
        labels.push({ label: `${section.text}/${item.text}`, link: item.link })
      }
    }
  }
  const active = labels.find((x) =>
    isActiveLink(route.path, x.link, site.value.base),
  )?.label
  return active?.split('/').map((label) => ({ label })) ?? []
})

const currentTheme = useTheme()
const toggleTheme = () =>
  setTheme(currentTheme.value === 'dark' ? 'light' : 'dark')
</script>

<template>
  <header
    class="sticky top-0 z-20 flex h-12 items-center gap-3 border-b bg-surface-base px-4 sm:px-5"
  >
    <slot name="brand">
      <a
        v-if="logo || name"
        :href="withBase('/')"
        class="flex items-center gap-2.5 min-w-0"
        :class="{ 'lg:hidden': isDocs }"
      >
        <img
          v-if="logo"
          :src="withBase(logo)"
          class="w-6 shrink-0"
          :alt="name"
        />
        <span v-if="name" class="text-sm font-medium text-ink-gray-8 truncate">
          {{ name }}
        </span>
      </a>
    </slot>

    <Breadcrumbs
      v-if="isDocs"
      :items="crumbs"
      class="hidden min-w-0 lg:flex [&_span]:capitalize"
    />

    <nav class="ml-auto flex items-center gap-2 sm:gap-3">
      <slot name="actions" />

      <a
        v-if="!isDocs"
        :href="withBase(docsLink)"
        class="hidden px-1 text-sm text-ink-gray-7 hover:text-ink-gray-9 md:block"
      >
        Docs
      </a>

      <slot name="search">
        <Search class="hidden md:flex" />
      </slot>

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
