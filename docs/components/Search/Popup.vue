<script setup lang="ts">
import type { Ref } from 'vue'
import type { SearchResult } from 'minisearch'

import MiniSearch from 'minisearch'
import Mark from 'mark.js'

import { useData } from 'vitepress'
import { computedAsync, debouncedWatch } from '@vueuse/core'

import {
  markRaw,
  nextTick,
  onMounted,
  ref,
  shallowRef,
  watch,
  useTemplateRef,
} from 'vue'

import LucideX from '~icons/lucide/x'
import LucideSearch from '~icons/lucide/search'
import LucideCommand from '~icons/lucide/command'
import LucideArrowDown from '~icons/lucide/arrow-down'
import LucideEnter from '~icons/lucide/corner-down-left'

import LucideChevronRight from '~icons/lucide/chevron-right'

import { LRUCache } from './cache'

const emits = defineEmits<{ close: [] }>()

const { localeIndex } = useData()

const filterText = ref('')
const showNoResults = ref(false)
const inputRef = useTemplateRef<HTMLInputElement>('inputRef')

const resultsEl = shallowRef<HTMLElement>()
const searchIndexData = shallowRef<any>()
const results: Ref<(SearchResult & Result)[]> = shallowRef([])

const activeIndex = ref(-1)

interface Result {
  title: string
  titles: string[]
  text?: string
}

onMounted(() => {
  inputRef.value?.focus()

  // @ts-expect-error vitepress internal
  import('@localSearchIndex').then((m) => {
    searchIndexData.value = m.default
  })
})

const mark = computedAsync(async () => {
  if (!resultsEl.value) return
  return markRaw(new Mark(resultsEl.value))
}, null)

const searchIndex = computedAsync(async () =>
  markRaw(
    MiniSearch.loadJSON<Result>(
      (await searchIndexData.value?.[localeIndex.value]?.())?.default,
      {
        fields: ['title', 'titles', 'text'],
        storeFields: ['title', 'titles'],
        searchOptions: {
          fuzzy: 0.2,
          prefix: true,
          boost: { title: 4, text: 2, titles: 1 },
        },
      },
    ),
  ),
)

const cache = new LRUCache(16)

debouncedWatch(
  () => [searchIndex.value, filterText.value] as const,
  async ([index, query], old, onCleanup) => {
    if (old?.[0] !== index) cache.clear()

    let canceled = false
    onCleanup(() => (canceled = true))

    if (!index) return

    results.value = index.search(query).slice(0, 16) as any
    if (canceled) return

    const terms = new Set<string>()

    results.value = results.value.map((r) => {
      const [id, anchor] = r.id.split('#')
      const map = cache.get(id)
      const text = map?.get(anchor) ?? ''
      for (const term in r.match) terms.add(term)
      return { ...r, text }
    })

    await nextTick()
    if (canceled) return

    await new Promise<void>((resolve) => {
      mark.value?.unmark({
        done: () => {
          mark.value?.markRegExp(formMarkRegex(terms), { done: resolve })
        },
      })
    })

    showNoResults.value = true

    activeIndex.value = results.value.length ? 0 : -1
  },
  { debounce: 200, immediate: true },
)

watch(filterText, () => {
  showNoResults.value = false
  activeIndex.value = -1
})

const move = (delta: number) => {
  if (!results.value.length) return
  activeIndex.value =
    (activeIndex.value + delta + results.value.length) % results.value.length
}

const selectActive = () => {
  const item = results.value[activeIndex.value]
  if (!item) return
  window.location.href = item.id
  emits('close')
}

const formMarkRegex = (terms: Set<string>) => {
  return new RegExp(
    [...terms]
      .sort((a, b) => b.length - a.length)
      .map(
        (t) =>
          `(${t.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&').replace(/-/g, '\\x2d')})`,
      )
      .join('|'),
    'gi',
  )
}

const vScrollActive = {
  updated(el, { value }) {
    if (!value) return

    const container = el.parentElement
    if (!container) return

    const elRect = el.getBoundingClientRect()
    const cRect = container.getBoundingClientRect()

    const isVisible = elRect.top >= cRect.top && elRect.bottom <= cRect.bottom

    if (!isVisible) el.scrollIntoView({ block: 'nearest' })
  },
}
</script>

<template>
  <div
    class="fixed inset-0 z-100 flex items-start justify-center bg-black/50 backdrop-blur-sm"
    @click.self="emits('close')"
  >
    <div
      class="mt-[10vh] w-full max-w-2xl overflow-hidden rounded bg-surface-cards shadow-lg"
      @keydown.esc.prevent="emits('close')"
    >
      <!-- input -->
      <div class="flex gap-2 items-center border-b border-outline-gray-2 p-3">
        <LucideSearch class="size-4" />

        <input
          ref="inputRef"
          v-model="filterText"
          placeholder="Search documentation"
          class="w-full bg-transparent !outline-none !border-0 text-sm p-0 !ring-0"
          @keydown.down.prevent="move(1)"
          @keydown.up.prevent="move(-1)"
          @keydown.enter.prevent="selectActive"
          autofocus
        />

        <button
          class="text-muted-foreground hover:text-foreground"
          aria-label="Close"
          @click="emits('close')"
        >
          <LucideX class="size-4" />
        </button>
      </div>

      <!-- results -->
      <ul
        ref="resultsEl"
        class="max-h-[55vh] overflow-auto scrollbar"
        :class="{ 'border-b p-2': results.length > 0 }"
      >
        <a
          v-for="(p, i) in results"
          :key="p.id"
          :aria-selected="i === activeIndex"
          :href="p.id"
          class="flex gap-1 items-center text-ink-gray-6"
          :class="[
            'p-2 cursor-pointer text-sm rounded',
            i === activeIndex ? 'bg-surface-gray-1 text-ink-gray-9' : '',
          ]"
          @mouseenter="activeIndex = i"
          @click="emits('close')"
          v-scroll-active="i === activeIndex"
        >
          <template v-for="(t, index) in p.titles" :key="index">
            <span v-html="t" />
            <LucideChevronRight class="size-4" />
          </template>

          <span v-html="p.title" />
        </a>
      </ul>

      <div
        v-if="filterText && !results.length && showNoResults"
        class="my-8 text-center text-sm"
      >
        No results for "<b>{{ filterText }}</b
        >"
      </div>

      <!-- kb helpers -->
      <div
        class="flex items-center gap-2 text-ink-gray-6 [&>kbd]:bg-surface-gray-2 [&>kbd]:p-1 [&>kbd]:rounded-sm p-2"
      >
        <kbd> <LucideArrowDown class="size-4 text-ink-gray-5" /> </kbd>
        <kbd>
          <LucideArrowDown class="size-4 rotate-180 text-ink-gray-5" />
        </kbd>

        <span class="mr-3"> to navigate </span>
        <kbd> <LucideEnter class="size-4 text-ink-gray-5" /> </kbd>
        <span class="mr-3">to select</span>
        <kbd> esc </kbd>
        <span> to close</span>
        <kbd class="flex gap-1 items-center ml-auto">
          <LucideCommand class="size-4 text-ink-gray-5" />
          K
        </kbd>
        <span> to open</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
:deep(mark) {
  color: var(--ink-gray-9);
  font-weight: bold;
  background-color: transparent;
}
</style>
