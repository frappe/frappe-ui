<script setup lang="ts">
import { useData, useRoute, useRouter, withBase } from 'vitepress'
import { computed, ref, watch } from 'vue'
import fuzzysort from 'fuzzysort'

import { Dialog } from 'frappe-ui'
import { getSidebarList, type SidebarItem } from '../Docs/sidebarList'

const open = defineModel<boolean>('open', { default: true })

const { theme } = useData()
const route = useRoute()
const router = useRouter()

const filterText = ref('')
const activeIndex = ref(0)

const sidebarList = getSidebarList(theme.value.componentList ?? [])
const allItems = sidebarList.flatMap((section) =>
  section.items.map((item) => ({ ...item, section: section.text })),
)
const sectionOrder = sidebarList.map((s) => s.text)

watch(open, (isOpen) => {
  if (!isOpen) {
    filterText.value = ''
    activeIndex.value = 0
  }
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

const flatItems = computed(() =>
  groupedResults.value.flatMap((section) => section.items),
)

watch(filterText, () => {
  activeIndex.value = 0
})

watch(groupedResults, () => {
  if (activeIndex.value >= flatItems.value.length) {
    activeIndex.value = flatItems.value.length ? 0 : -1
  }
})

const move = (delta: number) => {
  const len = flatItems.value.length
  if (!len) return
  activeIndex.value = (activeIndex.value + delta + len) % len
}

const navigate = (item: SidebarItem, newTab = false) => {
  const url = withBase(item.link)
  if (newTab) {
    window.open(url, '_blank', 'noopener')
    return
  }
  router.go(url)
  open.value = false
}

const onEnter = (e: KeyboardEvent) => {
  const item = flatItems.value[activeIndex.value]
  if (!item) return
  navigate(item, e.metaKey || e.ctrlKey)
}

const onItemClick = (e: MouseEvent, item: SidebarItem) => {
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return
  e.preventDefault()
  navigate(item)
}

const isCurrent = (item: SidebarItem) => {
  const norm = (p: string) => p.replace(/\/+$/, '') || '/'
  return norm(route.path) === norm(withBase(item.link))
}

const indexOf = (item: SidebarItem) =>
  flatItems.value.findIndex((i) => i.link === item.link)

const vScrollActive = {
  updated(el: HTMLElement, { value }: { value: boolean }) {
    if (!value) return

    const container = el.closest('[data-results-scroll]') as HTMLElement | null
    if (!container) return

    const elRect = el.getBoundingClientRect()
    const cRect = container.getBoundingClientRect()

    const isVisible = elRect.top >= cRect.top && elRect.bottom <= cRect.bottom

    if (!isVisible) el.scrollIntoView({ block: 'nearest' })
  },
}
</script>

<template>
  <Dialog v-model:open="open" bare size="xl" position="top" padding-top="10vh">
    <template #default="{ close }">
      <div class="flex flex-col">
        <!-- input -->
        <div class="relative">
          <div class="absolute inset-y-0 left-0 flex items-center pl-4.5">
            <span class="lucide-search h-4 w-4 text-ink-gray-6" />
          </div>
          <input
            v-model="filterText"
            type="text"
            placeholder="Search documentation"
            class="w-full border-none bg-transparent py-3 pl-11.5 pr-4.5 text-base text-ink-gray-7 placeholder-ink-gray-4 focus:ring-0"
            @keydown.down.prevent="move(1)"
            @keydown.up.prevent="move(-1)"
            @keydown.enter.prevent="onEnter"
            autocomplete="off"
            autofocus
          />
        </div>

        <!-- results -->
        <div
          data-results-scroll
          class="max-h-96 overflow-auto border-t border-outline-gray-1 dark:border-outline-gray-2"
        >
          <div
            v-for="group in groupedResults"
            :key="group.text"
            class="mb-2 mt-4.5 first:mt-3"
          >
            <div class="mb-2.5 px-4.5 text-base text-ink-gray-5">
              {{ group.text }}
            </div>

            <div v-for="item in group.items" :key="item.link" class="px-2.5">
              <a
                :href="withBase(item.link)"
                :aria-selected="indexOf(item) === activeIndex"
                class="flex w-full min-w-0 items-center rounded px-2 py-2 text-base font-medium text-ink-gray-7"
                :class="
                  indexOf(item) === activeIndex ? 'bg-surface-gray-3' : ''
                "
                @mouseenter="activeIndex = indexOf(item)"
                @click="onItemClick($event, item)"
                v-scroll-active="indexOf(item) === activeIndex"
              >
                <span class="overflow-hidden text-ellipsis whitespace-nowrap">
                  {{ item.text }}
                </span>

                <span
                  v-if="isCurrent(item)"
                  class="ml-2 text-xs font-normal text-ink-gray-5"
                >
                  Current
                </span>
              </a>
            </div>
          </div>

          <div
            v-if="filterText && !flatItems.length"
            class="my-8 text-center text-base text-ink-gray-6"
          >
            No results for "<b class="text-ink-gray-9">{{ filterText }}</b
            >"
          </div>
        </div>

        <!-- footer -->
        <div
          class="mt-2 flex items-center justify-between border-t border-outline-gray-1 px-2.5 py-2 text-xs text-ink-gray-6 dark:border-outline-gray-2"
        >
          <div class="flex items-center gap-4">
            <div class="flex items-center gap-1">
              <kbd
                class="inline-flex items-center gap-0.5 rounded-sm bg-surface-gray-2 p-0.5 text-ink-gray-5"
              >
                <span class="lucide-arrow-down size-4" />
              </kbd>
              <kbd
                class="inline-flex items-center gap-0.5 rounded-sm bg-surface-gray-2 p-0.5 text-ink-gray-5"
              >
                <span class="lucide-arrow-up size-4" />
              </kbd>
              <span class="ml-1">to navigate</span>
            </div>
            <div class="flex items-center gap-1">
              <kbd
                class="inline-flex items-center gap-0.5 rounded-sm bg-surface-gray-2 p-0.5 text-ink-gray-5"
              >
                <span class="lucide-corner-down-left size-4" />
              </kbd>
              <span class="ml-1">to select</span>
            </div>
            <div class="flex items-center gap-1">
              <kbd
                class="inline-flex items-center gap-0.5 rounded-sm bg-surface-gray-2 p-0.5 text-ink-gray-5"
              >
                <span class="lucide-command w-3 h-3" />
                <span class="lucide-corner-down-left size-4" />
              </kbd>
              <span class="ml-1">new tab</span>
            </div>
            <div class="flex items-center gap-1">
              <kbd
                class="inline-flex items-center gap-0.5 rounded-sm bg-surface-gray-2 p-0.5 text-ink-gray-5 px-1 text-sm"
              >
                esc
              </kbd>
              <span class="ml-1">to close</span>
            </div>
          </div>
          <div class="flex items-center gap-1">
            <kbd
              class="inline-flex items-center gap-0.5 rounded-sm bg-surface-gray-2 p-0.5 text-ink-gray-5"
            >
              <span class="lucide-command w-3 h-3" />
              <span class="text-sm">K</span>
            </kbd>
            <span class="ml-1">to open</span>
          </div>
        </div>
      </div>
    </template>
  </Dialog>
</template>
