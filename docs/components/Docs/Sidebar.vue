<script setup lang="ts">
import { state } from "../../state";
import { useData, useRoute } from "vitepress";

import LucidePalette from "~icons/lucide/palette";
import LucideRows from "~icons/lucide/rows-3";
import LucideJson from "~icons/lucide/braces";
import LucideSquare from "~icons/lucide/square";
import LucideDb from "~icons/lucide/database-zap";
import LucideSettings from "~icons/lucide/settings";
import LucideBaseline from "~icons/lucide/baseline";
import LucideCase from "~icons/lucide/case-sensitive";
import LucideBlend from "~icons/lucide/blend";
import LucideRadius from "~icons/lucide/radius";
import ChevronRight from "~icons/lucide/chevron-right";
import LucideBox from "~icons/lucide/box";

const componentList = useData().theme.value.componentList;
const componentItems = componentList.map((name) => ({
  text: name,
  icon: LucideBox,
  link: `/docs/components/${name.toLowerCase()}`,
}));

const list = [
  {
    text: "Introduction",
    link: "/docs/introduction",
  },
  {
    text: "Getting Started",
    link: "/docs",
  },

  {
    text: "Espresso Design System",
    collapsed: false,
    items: [
      {
        text: "Background Color",
        icon: LucidePalette,
        link: "/docs/design-system/background-color",
      },
      {
        text: "Text Color",
        icon: LucideBaseline,
        link: "/docs/design-system/text-color",
      },
      {
        text: "Border Color",
        icon: LucideSquare,
        link: "/docs/design-system/border-color",
      },
      {
        text: "Font Design",
        icon: LucideCase,
        link: "/docs/design-system/fonts",
      },
      {
        text: "Drop Shadow",
        icon: LucideBlend,
        link: "/docs/design-system/drop-shadow",
      },
      {
        text: "Border Radius",
        icon: LucideRadius,
        link: "/docs/design-system/border-radius",
      },
    ],
  },

  {
    text: "Components",
    collapsed: false,
    items: componentItems,
  },

  {
    text: "Data Fetching",
    collapsed: false,
    items: [
      {
        text: "Resource",
        icon: LucideDb,
        link: "/docs/data-fetching/resource",
      },
      {
        text: "List Resource",
        icon: LucideRows,
        link: "/docs/data-fetching/list-resource",
      },
      {
        text: "Document Resource",
        icon: LucideJson,
        link: "/docs/data-fetching/document-resource",
      },
    ],
  },

  {
    text: "Other",
    items: [
      {
        text: "Utilities",
        icon: LucideSettings,
        link: "/docs/other/utilities",
      },
      {
        text: "Directives",
        icon: LucideSettings,
        link: "/docs/other/directives",
      },
    ],
  },
];

state.sidebarList = list;

const activeLink = (link: string) =>
  useRoute().path === link
    ? "bg-surface-white dark:bg-surface-gray-1 shadow-sm"
    : "text-ink-gray-8";

const linkClass = "p-2 rounded";
</script>

<template>
  <aside
    class="scrollbar bg-surface-gray-1 dark:bg-surface-white border-r flex flex-col p-3 h-screen pr-0 pt-1 min-w-fit sticky top-0 w-full"
  >
    <a
      class="hidden lg:flex items-center gap-2 p-2 py-3 border-b mb-3 font-medium text-xl"
      href="/"
    >
      <img src="/logo.svg" class="w-6" />
      Frappe UI
    </a>

    <nav
      class="flex flex-col overflow-hidden hover:overflow-y-auto"
      style="scrollbar-gutter: stable"
    >
      <template v-for="(item, i) in list" :key="item.text">
        <a
          v-if="!item.items"
          :href="item.link"
          :class='
            [
              linkClass,
              activeLink(item.link),
              list[i + 1].items ? "mb-6" : "",
            ]
          '
        >
          {{ item.text }}
        </a>

        <details v-else class="group" :open="!item.collapsed">
          <summary
            class="list-none w-full flex items-center justify-between gap-2 whitespace-nowrap font-medium text-ink-gray-600 border-t p-3 pr-1 group-open:text-ink-gray-800 cursor-pointer"
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
  </aside>
</template>
