<script setup lang="ts">
import { state } from '../../state'
import { useData, useRoute, withBase } from 'vitepress'
import { ScrollArea } from 'frappe-ui'
import Brand from '../Brand.vue'
import Search from './Search.vue'
import { getSidebarList, isActiveLink } from './sidebarList'

const { site, theme } = useData()
// Data-driven sections: prefer `sections`, fall back to `sidebar`.
const list = getSidebarList(theme.value.sections ?? theme.value.sidebar ?? [])

state.sidebarList = list

const route = useRoute()
const isActive = (link: string) =>
  isActiveLink(route.path, link, site.value.base)
</script>

<template>
  <!-- Styled like frappe-ui's own Sidebar family: the `surface-sidebar` rail,
       SidebarLabel headings, and SidebarItem rows with the elevated active row.
       Plain markup rather than the components themselves — these are static
       <a> links, not router-driven items. -->
  <aside
    class="flex h-screen w-full flex-col sticky top-0 border-r border-outline-gray-1 bg-surface-sidebar"
  >
    <!-- The brand is the sidebar's header, the way an app's SidebarHeader is.
         48px tall so it lines up with the content column's PageHeader. -->
    <div class="flex h-12 shrink-0 items-center px-3">
      <Brand />
    </div>

    <!-- Search is navigation, so it lives in the rail with the links. Same
         px-3 gutter as the rows below; `outline` gives it a border so the
         gray field still reads as a field on the gray rail. -->
    <div class="shrink-0 px-3 pt-1 pb-2">
      <Search variant="outline" placeholder="Search" class="flex w-full" />
    </div>

    <!-- Padding lives on the viewport so the active row's shadow has room and
         overflow-hidden doesn't clip it. The brand, the search field and the
         row pills all sit on the same px-3 gutter. -->
    <ScrollArea class="min-h-0 flex-1" viewport-class="px-3 pt-2 pb-10">
      <nav class="flex flex-col gap-5">
        <div v-for="section in list" :key="section.text">
          <div class="flex h-7 items-center pl-2 text-base text-ink-gray-5">
            {{ section.text }}
          </div>

          <div class="flex flex-col gap-0.5">
            <a
              v-for="item in section.items"
              :key="item.text"
              :href="withBase(item.link)"
              :aria-current="isActive(item.link) ? 'page' : undefined"
              class="flex h-7 items-center rounded-4 pl-2 text-sm transition"
              :class="
                isActive(item.link)
                  ? 'bg-surface-elevation-3 text-ink-gray-8 shadow-sm'
                  : 'text-ink-gray-6 hover:bg-surface-gray-2'
              "
            >
              {{ item.text }}
            </a>
          </div>
        </div>
      </nav>
    </ScrollArea>
  </aside>
</template>
