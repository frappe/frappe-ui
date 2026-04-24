<script setup lang="ts">
import { state } from '../../state'
import { useRoute, withBase } from 'vitepress'
import { useData } from 'vitepress'
import pkgJson from '../../../package.json'

import {
  ScrollAreaRoot,
  ScrollAreaViewport,
  ScrollAreaThumb,
  ScrollAreaScrollbar,
} from 'reka-ui'

const curVersion = pkgJson.version
const componentList = useData().theme.value.componentList
const componentItems = componentList.map((name: string) => ({
  text: name,
  link: `/docs/components/${name.toLowerCase()}`,
}))

const list = [
  {
    text: 'Getting Started',
    items: [
      { text: 'Overview', link: '/' },
      { text: 'Introduction', link: '/docs/introduction' },
      { text: 'Getting Started', link: '/docs/getting-started' },
    ],
  },
  {
    text: 'Design System',
    items: [
      {
        text: 'Background Color',
        link: '/docs/design-system/background-color',
      },
      { text: 'Text Design', link: '/docs/design-system/text' },
      { text: 'Border Color', link: '/docs/design-system/border-color' },
      { text: 'Drop Shadow', link: '/docs/design-system/drop-shadow' },
      { text: 'Border Radius', link: '/docs/design-system/border-radius' },
    ],
  },
  {
    text: 'Components',
    items: componentItems,
  },
  {
    text: 'Data Fetching',
    items: [
      { text: 'Resource', link: '/docs/data-fetching/resource' },
      { text: 'List Resource', link: '/docs/data-fetching/list-resource' },
      {
        text: 'Document Resource',
        link: '/docs/data-fetching/document-resource',
      },
    ],
  },
  {
    text: 'Other',
    items: [
      { text: 'Utilities', link: '/docs/other/utilities' },
      { text: 'Directives', link: '/docs/other/directives' },
    ],
  },
]

state.sidebarList = list

const route = useRoute()
const isActive = (link: string) => {
  if (link === '/') return route.path === '/' || route.path === '/index.html'
  return route.path === link
}
</script>

<template>
  <aside
    class="flex h-screen w-full min-w-fit flex-col border-r bg-surface-gray-1 pt-1 sticky top-0"
  >
    <div class="px-1">
      <a
        class="hidden items-center gap-2.5 px-2 py-2 lg:flex hover:bg-surface-gray-2 rounded transition-colors"
        :href="withBase('/')"
      >
        <img src="/logo.svg" class="w-7" />
        <div class="flex flex-col gap-1 *:leading-none">
          <span class="text-base font-medium text-ink-gray-8">Frappe UI</span>
          <span class="text-sm text-ink-gray-5">v{{ curVersion }}</span>
        </div>
      </a>
    </div>

    <ScrollAreaRoot
      class="relative overflow-hidden"
      style="--scrollbar-size: 10px"
      :scroll-hide-delay="0"
    >
      <ScrollAreaViewport class="h-full w-full">
        <nav class="flex flex-col gap-7 px-2 pb-10 pt-2">
          <div v-for="section in list" :key="section.text">
            <div class="px-2 text-sm flex items-center h-7 text-ink-gray-5">
              <!-- <span class="lucide-component mr-2"></span> -->
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
                    ? 'bg-surface-white shadow-sm text-ink-gray-8'
                    : 'text-ink-gray-6 hover:bg-surface-gray-2 hover:text-ink-gray-8'
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
