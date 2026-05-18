<script setup lang="ts">
import { useData, useRouter, withBase } from 'vitepress'
import { computed, ref, watch } from 'vue'
import fuzzysort from 'fuzzysort'
import {
  ListboxContent,
  ListboxFilter,
  ListboxGroup,
  ListboxGroupLabel,
  ListboxItem,
  ListboxRoot,
} from 'reka-ui'

import { Dialog } from 'frappe-ui'
import { getSidebarList, type SidebarItem } from '../Docs/sidebarList'

const open = defineModel<boolean>('open', { default: true })

const { theme } = useData()
const router = useRouter()

const filterText = ref('')

const sidebarList = getSidebarList(theme.value.componentList ?? [])
const allItems = sidebarList.flatMap((section) =>
  section.items.map((item) => ({ ...item, section: section.text })),
)
const sectionOrder = sidebarList.map((s) => s.text)

watch(open, (isOpen) => {
  if (!isOpen) filterText.value = ''
})

const groupedResults = computed(() => {
  const query = filterText.value.trim()
  if (!query) return sidebarList

  const matches = fuzzysort.go(query, allItems, {
    key: 'text',
    threshold: 0.3,
    limit: 50,
  })

  const bySection = new Map<string, SidebarItem[]>()
  for (const m of matches) {
    const item = m.obj
    if (!bySection.has(item.section)) bySection.set(item.section, [])
    bySection.get(item.section)!.push(item)
  }

  return sectionOrder
    .filter((name) => bySection.has(name))
    .map((name) => ({ text: name, items: bySection.get(name)! }))
})

const hasResults = computed(() =>
  groupedResults.value.some((g) => g.items.length > 0),
)

const highlightedLink = ref<string | null>(null)
const onHighlight = (payload: { value: unknown } | undefined) => {
  highlightedLink.value = typeof payload?.value === 'string' ? payload.value : null
}

const navigateTo = (item: SidebarItem) => {
  router.go(withBase(item.link))
  open.value = false
}

// Native click on the anchor: let the browser handle modifier-clicks
// (Cmd/Ctrl/Shift/middle-click) via the `href`; only intercept plain
// clicks to do SPA navigation. Keyboard Enter on the highlighted item
// reaches here too — Reka synthesises a `.click()` on the element,
// which has no modifiers, so it falls through to `navigateTo`.
const onItemClick = (e: MouseEvent, item: SidebarItem) => {
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return
  e.preventDefault()
  navigateTo(item)
}

const onFilterKeydown = (e: KeyboardEvent) => {
  if (e.key !== 'Enter') return
  if (!(e.metaKey || e.ctrlKey)) return
  const link = highlightedLink.value
  if (!link) return
  e.preventDefault()
  e.stopImmediatePropagation()
  window.open(withBase(link), '_blank', 'noopener')
}
</script>

<template>
  <Dialog v-model:open="open" bare size="xl" position="top" padding-top="10vh">
    <template #default>
      <ListboxRoot
        class="flex flex-col"
        highlight-on-hover
        :model-value="null"
        @highlight="onHighlight"
      >
        <!-- input -->
        <div class="relative">
          <div class="absolute inset-y-0 left-0 flex items-center pl-4.5">
            <span class="lucide-search h-4 w-4 text-ink-gray-6" />
          </div>
          <ListboxFilter
            v-model="filterText"
            auto-focus
            placeholder="Search documentation"
            class="w-full border-none bg-transparent py-3 pl-11.5 pr-4.5 text-base text-ink-gray-7 placeholder-ink-gray-4 focus:ring-0"
            autocomplete="off"
            @keydown="onFilterKeydown"
          />
        </div>

        <!-- results -->
        <ListboxContent
          class="max-h-96 overflow-auto border-t border-outline-gray-1 dark:border-outline-gray-2"
        >
          <ListboxGroup
            v-for="group in groupedResults"
            :key="group.text"
            class="mb-2 mt-4.5 first:mt-3"
          >
            <ListboxGroupLabel
              class="mb-2.5 block px-4.5 text-base text-ink-gray-5"
            >
              {{ group.text }}
            </ListboxGroupLabel>

            <div v-for="item in group.items" :key="item.link" class="px-2.5">
              <ListboxItem
                as="a"
                :value="item.link"
                :href="withBase(item.link)"
                class="flex w-full min-w-0 items-center rounded px-2 py-2 text-base font-medium text-ink-gray-7 outline-none data-[highlighted]:bg-surface-gray-3"
                @click="onItemClick($event, item)"
              >
                <span class="overflow-hidden text-ellipsis whitespace-nowrap">
                  {{ item.text }}
                </span>
              </ListboxItem>
            </div>
          </ListboxGroup>

          <div
            v-if="filterText && !hasResults"
            class="my-8 text-center text-base text-ink-gray-6"
          >
            No results for "<b class="text-ink-gray-9">{{ filterText }}</b
            >"
          </div>
        </ListboxContent>

        <!-- footer -->
        <div
          class="mt-2 flex items-center justify-between border-t border-outline-gray-1 px-2.5 py-2 text-xs text-ink-gray-6 dark:border-outline-gray-2"
        >
          <div class="flex items-center gap-4">
            <div class="flex items-center gap-1">
              <kbd
                class="inline-flex items-center gap-0.5 whitespace-nowrap rounded-sm bg-surface-gray-2 p-0.5 font-[inherit] text-[11px] font-medium leading-normal tracking-[0.02em] text-ink-gray-5"
              >
                <span class="lucide-arrow-down size-4" />
              </kbd>
              <kbd
                class="inline-flex items-center gap-0.5 whitespace-nowrap rounded-sm bg-surface-gray-2 p-0.5 font-[inherit] text-[11px] font-medium leading-normal tracking-[0.02em] text-ink-gray-5"
              >
                <span class="lucide-arrow-up size-4" />
              </kbd>
              <span class="ml-1">to navigate</span>
            </div>
            <div class="flex items-center gap-1">
              <kbd
                class="inline-flex items-center gap-0.5 whitespace-nowrap rounded-sm bg-surface-gray-2 p-0.5 font-[inherit] text-[11px] font-medium leading-normal tracking-[0.02em] text-ink-gray-5"
              >
                <span class="lucide-corner-down-left size-4" />
              </kbd>
              <span class="ml-1">to select</span>
            </div>
            <div class="flex items-center gap-1">
              <kbd
                class="inline-flex items-center gap-0.5 whitespace-nowrap rounded-sm bg-surface-gray-2 p-0.5 font-[inherit] text-[11px] font-medium leading-normal tracking-[0.02em] text-ink-gray-5"
              >
                <span class="lucide-command w-3 h-3" />
                <span class="lucide-corner-down-left size-4" />
              </kbd>
              <span class="ml-1">new tab</span>
            </div>
            <div class="flex items-center gap-1">
              <kbd
                class="inline-flex items-center gap-0.5 whitespace-nowrap rounded-sm bg-surface-gray-2 p-0.5 px-1 font-[inherit] font-medium leading-normal tracking-[0.02em] text-sm text-ink-gray-5"
              >
                esc
              </kbd>
              <span class="ml-1">to close</span>
            </div>
          </div>
          <div class="flex items-center gap-1">
            <kbd
              class="inline-flex items-center gap-0.5 whitespace-nowrap rounded-sm bg-surface-gray-2 p-0.5 font-[inherit] text-[11px] font-medium leading-normal tracking-[0.02em] text-ink-gray-5"
            >
              <span class="lucide-command w-3 h-3" />
              <span class="text-sm">K</span>
            </kbd>
            <span class="ml-1">to open</span>
          </div>
        </div>
      </ListboxRoot>
    </template>
  </Dialog>
</template>
