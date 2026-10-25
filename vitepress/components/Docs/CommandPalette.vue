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

import { Dialog, KeyboardShortcut, toast, useColorScheme } from 'frappe-ui'
import { pageMarkdown } from './pageMarkdown'
import type { SidebarItem, SidebarSection } from './sidebarList'

const open = defineModel<boolean>('open', { default: true })

const { theme } = useData()
const router = useRouter()

const filterText = ref('')

// Sidebar is supplied via themeConfig in the {text, items:[{text,link}]} shape.
// `useData()` types themeConfig as `any`, and VitePress' own `Sidebar` type is
// a union that does not describe what `defineDocsConfig` writes here.
const sidebarList = (theme.value.sidebar ?? []) as SidebarSection[]
const allItems = sidebarList.flatMap((section) =>
  section.items.map((item) => ({ ...item, section: section.text })),
)
const sectionOrder = sidebarList.map((s) => s.text)

watch(open, (isOpen) => {
  if (!isOpen) filterText.value = ''
})

const { toggleColorScheme } = useColorScheme()
async function copy(text: string, message: string) {
  try {
    await navigator.clipboard.writeText(text)
    toast.success(message)
  } catch {
    toast.error('Could not copy to the clipboard')
  }
}
const actions = [
  {
    id: 'theme',
    text: 'Toggle dark mode',
    run: toggleColorScheme,
  },
  {
    id: 'install',
    text: 'Copy install command',
    hint: 'npm install frappe-ui',
    run: () => copy('npm install frappe-ui', 'Install command copied'),
  },
  {
    id: 'markdown',
    text: 'Copy this page as Markdown',
    run: () => copy(pageMarkdown(), 'Page copied as Markdown'),
  },
  {
    id: 'github',
    text: 'Open frappe-ui on GitHub',
    run: () => window.open(theme.value.githubUrl, '_blank', 'noopener'),
  },
  {
    id: 'llms',
    text: 'Open llms.txt',
    run: () => window.open(withBase('/llms.txt'), '_blank', 'noopener'),
  },
]
const footerHints = [
  { combo: 'ArrowDown', altCombos: ['ArrowUp'], label: 'to navigate' },
  { combo: 'Enter', label: 'to select' },
  { combo: 'Mod+Enter', label: 'new tab' },
  { combo: 'Escape', label: 'to close' },
]

const matchedActions = computed(() => {
  const query = filterText.value.trim()
  if (!query) return actions
  return fuzzysort
    .go(query, actions, { key: 'text', threshold: 0.3 })
    .map((m) => m.obj)
})
function runAction(action: (typeof actions)[number]) {
  open.value = false
  action.run()
}

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

const hasResults = computed(
  () =>
    matchedActions.value.length > 0 ||
    groupedResults.value.some((g) => g.items.length > 0),
)

const highlightedLink = ref<string | null>(null)
// Actions share the list with links, as `action:<id>` values. Only links can
// open in a new tab.
const onHighlight = (payload: { value: unknown } | undefined) => {
  const value = payload?.value
  highlightedLink.value =
    typeof value === 'string' && !value.startsWith('action:') ? value : null
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
            v-if="matchedActions.length"
            class="mb-2 mt-4.5 first:mt-3"
          >
            <ListboxGroupLabel
              class="mb-2.5 block px-4.5 text-base text-ink-gray-5"
            >
              Actions
            </ListboxGroupLabel>
            <div
              v-for="action in matchedActions"
              :key="action.id"
              class="px-2.5"
            >
              <ListboxItem
                :value="`action:${action.id}`"
                class="flex w-full min-w-0 cursor-pointer items-center gap-2.5 rounded-4 px-2 py-2 text-base font-medium text-ink-gray-7 outline-none data-[highlighted]:bg-surface-gray-3"
                @select.prevent="runAction(action)"
              >
                {{ action.text }}
                <code
                  v-if="action.hint"
                  class="ml-auto rounded-1 bg-surface-gray-2 px-1.5 text-sm font-normal text-ink-gray-5"
                  >{{ action.hint }}</code
                >
              </ListboxItem>
            </div>
          </ListboxGroup>

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
                class="flex w-full min-w-0 items-center rounded-4 px-2 py-2 text-base font-medium text-ink-gray-7 outline-none data-[highlighted]:bg-surface-gray-3"
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
          class="mt-2 flex items-center justify-between border-t border-outline-gray-1 px-2.5 py-2 text-xs text-ink-gray-5 dark:border-outline-gray-2"
        >
          <div class="flex items-center gap-3">
            <div
              v-for="hint in footerHints"
              :key="hint.label"
              class="flex items-center gap-1.5"
            >
              <KeyboardShortcut
                :combo="hint.combo"
                :alt-combos="hint.altCombos"
                bg
              />
              <span class="whitespace-nowrap">{{ hint.label }}</span>
            </div>
          </div>
          <div class="flex items-center gap-1.5">
            <KeyboardShortcut combo="Mod+K" bg />
            <span class="whitespace-nowrap">to open</span>
          </div>
        </div>
      </ListboxRoot>
    </template>
  </Dialog>
</template>
