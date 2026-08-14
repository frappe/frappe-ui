<script setup lang="ts">
import { computed } from 'vue'
import { state } from '../../state'
import { useData, useRoute, withBase } from 'vitepress'
import {
  isActiveLink,
  type SidebarItem,
  type SidebarSection,
} from './sidebarList'

import LucideLeft from '~icons/lucide/arrow-left'
import LucideRight from '~icons/lucide/arrow-right'

const route = useRoute()
const { frontmatter, site } = useData()

const visible = computed(() => frontmatter.value.nextprev ?? true)

// Through `defineDocsConfig` the declared `SidebarSection[]` is always right:
// `sidebar` is required there and it writes both `sidebar` and `sections` from
// that one value. The flat shape VitePress' own `sidebar` type admits is only
// reachable by a consumer hand-writing raw `themeConfig`, which bypasses that
// helper — Sidebar.vue forwards whatever it finds. This cast and branch cover
// only that case.
const entries = state.sidebarList as Array<SidebarSection | SidebarItem>

const linkInfos = entries.reduce<SidebarItem[]>((acc, cur) => {
  'items' in cur ? acc.push(...cur.items) : acc.push(cur)
  return acc
}, [])

const currentIndex = computed(() =>
  linkInfos.findIndex((x) => isActiveLink(route.path, x.link, site.value.base)),
)

const prevLink = computed(() => {
  const index = currentIndex.value
  if (index <= 0) return null
  return linkInfos[index - 1]
})

const nextLink = computed(() => {
  const index = currentIndex.value
  if (index === -1 || index === linkInfos.length - 1) return null
  return linkInfos[index + 1]
})

const subtleMdLink =
  'inline-flex items-center gap-2 ' +
  'h-8 px-2.5 rounded-4 ' +
  'text-base font-medium ' +
  'text-ink-gray-8 bg-surface-gray-2 ' +
  'hover:bg-surface-gray-3 active:bg-surface-gray-4 ' +
  'transition-colors ' +
  'focus:outline-none focus-visible:ring focus-visible:ring-outline-gray-3'
</script>

<template>
  <div class="flex justify-between gap-5 mt-10" v-if="visible">
    <a v-if="prevLink" :href="withBase(prevLink.link)" :class="subtleMdLink">
      <LucideLeft class="h-4 w-4" />
      {{ prevLink.text }}
    </a>

    <a v-if="nextLink" :href="withBase(nextLink.link)" :class="subtleMdLink">
      {{ nextLink.text }}
      <LucideRight class="h-4 w-4" />
    </a>
  </div>
</template>
