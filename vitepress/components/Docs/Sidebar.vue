<script setup lang="ts">
import { state } from '../../state'
import { useData, useRoute, withBase } from 'vitepress'
import { getSidebarList, isActiveLink } from './sidebarList'

import {
  ScrollAreaRoot,
  ScrollAreaViewport,
  ScrollAreaThumb,
  ScrollAreaScrollbar,
} from 'reka-ui'

const { site, theme } = useData()
// Data-driven sections: prefer `sections`, fall back to `sidebar`.
const list = getSidebarList(theme.value.sections ?? theme.value.sidebar ?? [])

state.sidebarList = list

const route = useRoute()
const isActive = (link: string) =>
  isActiveLink(route.path, link, site.value.base)
</script>

<template>
  <aside
    class="flex h-[calc(100vh-3rem)] w-full min-w-fit flex-col sticky top-12"
  >
    <ScrollAreaRoot
      class="relative overflow-hidden"
      style="--scrollbar-size: 10px"
      :scroll-hide-delay="0"
    >
      <ScrollAreaViewport class="h-full w-full">
        <!-- px-3 + the items' own pl-2 lands the labels on the navbar logo's
             left edge (header px-5), so the two share one left rail. -->
        <nav class="flex flex-col gap-7 px-3 pb-10 pt-2">
          <div v-for="section in list" :key="section.text">
            <div class="px-2 text-sm flex items-center h-7 text-ink-gray-5">
              {{ section.text }}
            </div>

            <div class="flex flex-col gap-0.5">
              <a
                v-for="item in section.items"
                :key="item.text"
                :href="withBase(item.link)"
                class="pl-2 flex h-7 items-center rounded text-sm transition-colors"
                :class="
                  isActive(item.link)
                    ? 'bg-surface-gray-2 text-ink-gray-8'
                    : 'text-ink-gray-6 hover:bg-surface-gray-1 hover:text-ink-gray-8'
                "
              >
                {{ item.text }}
              </a>
            </div>
          </div>
        </nav>
      </ScrollAreaViewport>

      <ScrollAreaScrollbar
        class="z-20 flex touch-none select-none p-0.5 transition-colors duration-[160ms] ease-out data-[orientation=vertical]:w-2.5"
        orientation="vertical"
      >
        <ScrollAreaThumb
          class="relative flex-1 rounded-[10px] bg-surface-gray-3 before:absolute before:left-1/2 before:top-1/2 before:h-full before:min-h-[44px] before:w-full before:min-w-[44px] before:-translate-x-1/2 before:-translate-y-1/2 before:content-['']"
        />
      </ScrollAreaScrollbar>
    </ScrollAreaRoot>
  </aside>
</template>
