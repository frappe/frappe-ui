<script setup lang="ts">
import sidebarConfig from "../../.vitepress/sidebar";
import ChevronRight from "~icons/lucide/chevron-right";
import { useRoute } from "vitepress";

const activeLink = (link: string) => (
  useRoute().path === link
    ? "bg-surface-white dark:bg-surface-gray-1 shadow-sm"
    : "text-ink-gray-8"
);

const linkClass = "p-2 rounded";
</script>

<template>
  <aside
    class="
      scrollbar bg-surface-gray-1 dark:bg-surface-white z-50 border-r flex flex-col p-3 h-screen
      pr-0 pt-1 min-w-fit
      sticky top-0 w-full
    "
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
      <template v-for="(item, i) in sidebarConfig" :key="item.text">
        <a
          v-if="!item.items"
          :href="item.link"
          :class='
            [
              linkClass,
              activeLink(item.link),
              sidebarConfig[i + 1].items ? "mb-6" : "",
            ]
          '
        >
          {{ item.text }}
        </a>

        <details v-else class="group" :open="!item.collapsed">
          <summary
            class="
              list-none w-full
              flex items-center justify-between gap-2
              whitespace-nowrap font-medium
              text-ink-gray-600 border-t p-3 pr-1
              group-open:text-ink-gray-800 cursor-pointer
            "
          >
            {{ item.text }}

            <ChevronRight
              class="
                size-4 shrink-0 ml-5
                transition-transform duration-200
                group-open:rotate-90
              "
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
