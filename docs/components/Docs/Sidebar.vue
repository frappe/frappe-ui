<script setup lang="ts">
import { state } from '../../state'
import { useData, useRoute } from 'vitepress'

import LucidePalette from '~icons/lucide/palette'
import LucideRows from '~icons/lucide/rows-3'
import LucideJson from '~icons/lucide/braces'
import LucideSquare from '~icons/lucide/square'
import LucideDb from '~icons/lucide/database-zap'
import LucideSettings from '~icons/lucide/settings'
import LucideBaseline from '~icons/lucide/baseline'
import LucideBlend from '~icons/lucide/blend'
import LucideRadius from '~icons/lucide/radius'
import ChevronRight from '~icons/lucide/chevron-right'
import LucideBox from '~icons/lucide/box'
import pkgJson from '../../../package.json'

import {
  ScrollAreaRoot,
  ScrollAreaViewport,
  ScrollAreaThumb,
  ScrollAreaScrollbar,
} from 'reka-ui'

const curVersion = pkgJson.version
const componentList = useData().theme.value.componentList
const componentItems = componentList.map((name) => ({
  text: name,
  icon: LucideBox,
  link: `/docs/components/${name.toLowerCase()}`,
}))

const list = [
  {
    text: 'Introduction',
    link: '/docs/introduction',
  },
  {
    text: 'Getting Started',
    link: '/docs',
  },

  {
    text: 'Espresso Design System',
    collapsed: false,
    items: [
      {
        text: 'Background Color',
        icon: LucidePalette,
        link: '/docs/design-system/background-color',
      },
      {
        text: 'Text Design',
        icon: LucideBaseline,
        link: '/docs/design-system/text',
      },
      {
        text: 'Border Color',
        icon: LucideSquare,
        link: '/docs/design-system/border-color',
      },

      {
        text: 'Drop Shadow',
        icon: LucideBlend,
        link: '/docs/design-system/drop-shadow',
      },
      {
        text: 'Border Radius',
        icon: LucideRadius,
        link: '/docs/design-system/border-radius',
      },
    ],
  },

  {
    text: 'Components',
    collapsed: false,
    items: componentItems,
  },

  {
    text: 'Data Fetching',
    collapsed: false,
    items: [
      {
        text: 'Resource',
        icon: LucideDb,
        link: '/docs/data-fetching/resource',
      },
      {
        text: 'List Resource',
        icon: LucideRows,
        link: '/docs/data-fetching/list-resource',
      },
      {
        text: 'Document Resource',
        icon: LucideJson,
        link: '/docs/data-fetching/document-resource',
      },
    ],
  },

  {
    text: 'Other',
    items: [
      {
        text: 'Utilities',
        icon: LucideSettings,
        link: '/docs/other/utilities',
      },
      {
        text: 'Directives',
        icon: LucideSettings,
        link: '/docs/other/directives',
      },
    ],
  },
]

state.sidebarList = list

const activeLink = (link: string) =>
  useRoute().path === link
    ? 'bg-surface-white dark:bg-surface-gray-1 shadow-sm'
    : 'text-ink-gray-8'

const linkClass = 'p-2 rounded'
</script>

<template>
  <aside
    class="bg-surface-gray-1 dark:bg-surface-white border-r flex flex-col p-3 h-screen pr-0 pt-1 min-w-fit sticky top-0 w-full"
  >
    <a
      class="hidden lg:flex items-center gap-2 p-2 py-3 mb-3"
      href="/"
    >
      <img src="/logo.svg" class="w-8" />
      <div class="flex flex-col gap-1 *:leading-none">
        <span class="text-base font-medium text-ink-gray-8">Frappe UI</span>
        <span class="text-sm text-ink-gray-6">v{{ curVersion }}</span>
      </div>
    </a>

    <ScrollAreaRoot
      class="relative overflow-hidden"
      style="--scrollbar-size: 10px"
      :scroll-hide-delay="0"
    >
      <ScrollAreaViewport class="w-full h-full">
        <nav class="flex flex-col pr-2">
          <template v-for="(item, i) in list" :key="item.text">
            <a
              v-if="!item.items"
              :href="item.link"
              :class="[
                linkClass,
                activeLink(item.link),
                list[i + 1].items ? 'mb-6' : '',
              ]"
            >
              {{ item.text }}
            </a>

            <details v-else class="group" :open="!item.collapsed">
              <summary
                class="list-none w-full flex items-center justify-between gap-2 whitespace-nowrap font-medium
                text-ink-gray-600 border-t p-3 pr-1 pl-2 group-open:text-ink-gray-800 cursor-pointer"
              >
                {{ item.text }}

                <ChevronRight
                  class="size-4 shrink-0 ml-5 transition-transform duration-200 group-open:rotate-90"
                />
              </summary>

              <div class="flex flex-col mb-6">
                <a
                  :href="child.link"
                  v-for="child in item.items"
                  :key="child.text"
                  class="inline-flex gap-2 items-center"
                  :class="[linkClass, activeLink(child.link)]"
                >
                  <component :is="child.icon" class="size-4" /> {{ child.text }}
                </a>
              </div>
            </details>
          </template>
        </nav>
      </ScrollAreaViewport>

      <ScrollAreaScrollbar
        class="flex select-none touch-none p-0.5 z-20 transition-colors duration-[160ms] ease-out data-[orientation=vertical]:w-2.5"
        orientation="vertical"
      >
        <ScrollAreaThumb
          class="flex-1 bg-surface-gray-3 rounded-[10px] relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]"
        />
      </ScrollAreaScrollbar>
    </ScrollAreaRoot>
  </aside>
</template>
