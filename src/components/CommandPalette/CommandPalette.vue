<template>
  <Dialog
    v-model:open="show"
    size="xl"
    position="top"
    bare
    @after-leave="searchQuery = ''"
  >
    <div class="command-palette-dialog flex flex-col">
      <h2 class="sr-only">Command palette</h2>
      <div class="relative">
        <div class="relative">
          <div class="absolute inset-y-0 left-0 flex items-center pl-4.5">
            <span
              class="lucide-search h-4 w-4 text-ink-gray-6"
              aria-hidden="true"
            />
          </div>
          <input
            ref="inputRef"
            v-model="searchQuery"
            type="text"
            placeholder="Search"
            class="w-full border-none bg-transparent py-3 pl-11.5 pr-4.5 text-base text-ink-gray-7 placeholder-ink-gray-4 focus:ring-0"
            autocomplete="off"
            role="combobox"
            aria-autocomplete="list"
            :aria-expanded="show"
            :aria-controls="listId"
            :aria-activedescendant="activeItemId"
            @keydown="onInputKeydown"
          />
        </div>
        <div
          :id="listId"
          ref="scrollContainerRef"
          class="max-h-96 overflow-auto border-t border-outline-gray-1 dark:border-outline-gray-2"
          role="listbox"
          aria-label="Command palette results"
          @click="inputRef?.focus()"
        >
          <div
            v-for="group in displayedGroups"
            :key="getGroupKey(group)"
            class="mb-2 mt-4.5 first:mt-3"
            role="group"
            :aria-labelledby="getGroupId(group)"
          >
            <div
              v-if="!group.hideTitle"
              :id="getGroupId(group)"
              class="mb-2.5 px-4.5 text-base text-ink-gray-5"
            >
              {{ group.title }}
            </div>
            <div
              v-for="item in group.items"
              :key="getItemKey(item)"
              class="px-2.5"
              :class="{ 'pointer-events-none opacity-50': item.disabled }"
            >
              <div
                :id="getItemElementId(item)"
                class="rounded"
                :class="[item.isActive ? 'bg-surface-gray-3' : '']"
                role="option"
                :aria-selected="item.isActive ? 'true' : 'false'"
                @click="select(item)"
                @mousemove="activateOnMouseMove(item, $event)"
                :ref="
                  (el) => {
                    if (item.isActive) activeItemRef = el as HTMLDivElement
                  }
                "
              >
                <component
                  v-if="group.component"
                  :is="group.component"
                  :item="item"
                  :active="item.isActive"
                />
                <CommandPaletteItem
                  v-else
                  :item="item"
                  :active="item.isActive"
                />
              </div>
            </div>
          </div>
          <div
            v-if="!displayedGroups.length"
            class="px-4.5 py-6 text-base text-ink-gray-5"
          >
            No results found
          </div>
        </div>
      </div>
      <div
        class="mt-2 flex items-center justify-between border-t border-outline-gray-1 px-2.5 py-2 text-xs text-ink-gray-6 dark:border-outline-gray-2"
      >
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-1">
            <KeyboardShortcut bg>
              <span class="lucide-arrow-down size-4" aria-hidden="true" />
            </KeyboardShortcut>
            <KeyboardShortcut bg>
              <span class="lucide-arrow-up size-4" aria-hidden="true" />
            </KeyboardShortcut>
            <span class="ml-1">to navigate</span>
          </div>
          <div class="flex items-center gap-1">
            <KeyboardShortcut bg>
              <span class="lucide-corner-down-left size-4" aria-hidden="true" />
            </KeyboardShortcut>
            <span class="ml-1">to select</span>
          </div>
          <div class="flex items-center gap-1">
            <KeyboardShortcut bg>esc</KeyboardShortcut>
            <span class="ml-1">to close</span>
          </div>
        </div>
        <div class="flex items-center gap-1">
          <KeyboardShortcut bg ctrl>K</KeyboardShortcut>
          <span class="ml-1">to open</span>
        </div>
      </div>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import {
  computed,
  nextTick,
  onBeforeUnmount,
  ref,
  useTemplateRef,
  watch,
  type Component,
} from 'vue'
import { useEventListener } from '@vueuse/core'
import fuzzysort from 'fuzzysort'
import Dialog from '../Dialog/Dialog.vue'
import KeyboardShortcut from '../KeyboardShortcut.vue'
import CommandPaletteItem from './CommandPaletteItem.vue'

export interface CommandPaletteItem {
  name: string
  title: string
  description?: string
  suffix?: string
  search?: string
  aliases?: string[]
  icon?: Component | string
  disabled?: boolean
  defaultScore?: number
  scoreScale?: number
  isActive?: boolean
  [key: string]: any
}

export interface CommandPaletteGroup {
  id?: string
  title: string
  items: CommandPaletteItem[]
  component?: Component
  hideTitle?: boolean
}

const emit = defineEmits<{
  'update:show': [value: boolean]
  'update:searchQuery': [value: string]
  select: [item: CommandPaletteItem]
}>()

const props = withDefaults(
  defineProps<{
    show?: boolean
    searchQuery?: string
    groups?: CommandPaletteGroup[]
  }>(),
  {
    show: false,
    searchQuery: '',
    groups: () => [],
  },
)

const inputRef = useTemplateRef<HTMLInputElement>('inputRef')
const activeItemRef = ref<HTMLDivElement | null>(null)
const listId = 'command-palette-listbox'
const activeItemKey = ref<string | null>(null)

const show = computed({
  get: () => props.show,
  set: (value) => emit('update:show', value),
})

const searchQuery = computed({
  get: () => props.searchQuery,
  set: (value) => emit('update:searchQuery', value),
})

const filteredGroups = computed(() => getFilteredGroups(props.groups))

const activeItem = computed(() => {
  const selectable = getSelectableItems(filteredGroups.value)
  if (!selectable.length) return null
  return (
    selectable.find((item) => getItemKey(item) === activeItemKey.value) ||
    selectable[0]
  )
})

const activeItemId = computed(() =>
  activeItem.value ? getItemElementId(activeItem.value) : undefined,
)

const displayedGroups = computed(() =>
  filteredGroups.value.map((group) => ({
    ...group,
    items: group.items.map((item) => ({
      ...item,
      isActive:
        getItemKey(item) === activeItemKey.value ||
        (!activeItemKey.value && activeItem.value === item),
    })),
  })),
)

watch(activeItem, (item) => {
  activeItemKey.value = item ? getItemKey(item) : null
})

watch(show, (value) => {
  if (!value) return
  activeItemKey.value = null
  nextTick(() => inputRef.value?.focus())
})

function select(item: CommandPaletteItem) {
  if (item.disabled) return
  emit('select', item)
  show.value = false
}

function onInputKeydown(event: KeyboardEvent) {
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault()
    navigate(event.key === 'ArrowDown' ? 1 : -1)
    nextTick(scrollActiveItemIntoView)
    return
  }
  if (event.key === 'Enter') {
    event.preventDefault()
    event.stopPropagation()
    if (activeItem.value) select(activeItem.value)
    return
  }
  if (event.key === 'Escape') {
    show.value = false
  }
}

function navigate(direction: number) {
  const items = getSelectableItems(filteredGroups.value)
  if (!items.length) return

  const currentIndex = items.findIndex(
    (item) => getItemKey(item) === activeItemKey.value,
  )
  let nextIndex = currentIndex + direction
  if (nextIndex < 0) nextIndex = items.length - 1
  if (nextIndex >= items.length) nextIndex = 0

  activeItemKey.value = getItemKey(items[nextIndex])
}

function activateOnMouseMove(item: CommandPaletteItem, event: MouseEvent) {
  if (event.movementX === 0 && event.movementY === 0) return
  if (!item.disabled) activeItemKey.value = getItemKey(item)
}

function scrollActiveItemIntoView() {
  activeItemRef.value?.scrollIntoView({ block: 'nearest' })
}

function getFilteredGroups(groups: CommandPaletteGroup[]) {
  return groups
    .map((group) => ({
      ...group,
      items: getMatchingItems(group.items, searchQuery.value),
    }))
    .filter((group) => group.items.length > 0)
}

function getMatchingItems(items: CommandPaletteItem[], query: string) {
  const visibleItems = items
  if (!query) {
    return visibleItems
      .filter((item) => (item.defaultScore ?? 1) > 0)
      .sort((a, b) => (b.defaultScore ?? 1) - (a.defaultScore ?? 1))
      .map((item) => ({ ...item }))
  }

  return visibleItems
    .map((item) => getScoredItem(item, query))
    .filter((result): result is { item: CommandPaletteItem; score: number } =>
      Boolean(result),
    )
    .sort((a, b) => b.score - a.score)
    .map((result) => result.item)
}

function getScoredItem(item: CommandPaletteItem, query: string) {
  const candidates = [
    item.title,
    item.description,
    item.suffix,
    item.search,
    ...(item.aliases || []),
  ].filter(Boolean) as string[]

  let bestScore: number | null = null
  for (const candidate of candidates) {
    const result = fuzzysort.single(query, candidate)
    if (!result) continue

    const aliasPenalty = item.aliases?.includes(candidate) ? 50 : 0
    const score = result.score - aliasPenalty
    if (bestScore === null || score > bestScore) bestScore = score
  }

  if (bestScore === null || bestScore < -10000) return null
  return {
    item: { ...item },
    score: bestScore * (item.scoreScale ?? 1),
  }
}

function getSelectableItems(groups: CommandPaletteGroup[]) {
  return groups.flatMap((group) => group.items).filter((item) => !item.disabled)
}

function getItemKey(item: CommandPaletteItem) {
  return `${item.group || ''}:${item.doctype || ''}:${item.name}`
}

function getItemElementId(item: CommandPaletteItem) {
  return `command-palette-item-${slugifyId(getItemKey(item))}`
}

function getGroupKey(group: Pick<CommandPaletteGroup, 'id' | 'title'>) {
  return group.id || group.title
}

function getGroupId(group: Pick<CommandPaletteGroup, 'id' | 'title'>) {
  return `command-palette-group-${slugifyId(getGroupKey(group))}`
}

function slugifyId(value: string) {
  return value.replace(/[^A-Za-z0-9_-]/g, '-')
}

useEventListener(window, 'keydown', (event: KeyboardEvent) => {
  const target = event.target as HTMLElement | null
  if (
    event.key === 'k' &&
    (event.ctrlKey || event.metaKey) &&
    !target?.classList?.contains('ProseMirror')
  ) {
    show.value = true
    event.preventDefault()
  }
})

onBeforeUnmount(() => {
  show.value = false
})
</script>
