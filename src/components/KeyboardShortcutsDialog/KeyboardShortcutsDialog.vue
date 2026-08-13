<template>
  <Dialog
    v-model:open="open"
    size="5xl"
    position="top"
    :padding-top="paddingTop"
  >
    <template #title>
      <div class="flex items-center pr-2" data-slot="header">
        <h3
          class="shrink-0 text-3xl-semibold leading-6 text-ink-gray-9 flex-1"
          data-slot="title"
        >
          {{ title }}
        </h3>
        <div v-if="shouldShowSearch" class="w-fit ml-2" data-slot="search">
          <!-- A placeholder disappears as soon as the field has text, so the
               field carries its own name as well (P5). -->
          <TextInput
            v-model="searchQuery"
            type="text"
            placeholder="Search shortcuts"
            aria-label="Search shortcuts"
          />
        </div>
      </div>
    </template>
    <template #default>
      <slot :groups="filteredGroups">
        <div
          v-if="!groups.length"
          class="h-[20vh] py-8 text-center text-sm text-ink-gray-5"
          data-slot="empty"
          data-state="empty"
        >
          No keyboard shortcuts available on this page.
        </div>
        <div
          v-else-if="!filteredGroups.length"
          class="h-[20vh] py-8 text-center text-sm text-ink-gray-5"
          data-slot="empty"
          data-state="no-results"
        >
          No shortcuts match your search.
        </div>
        <div
          v-else
          class="grid max-h-[70vh] grid-cols-1 gap-8 gap-x-6 overflow-y-auto pr-1 md:grid-cols-2 xl:grid-cols-3"
          data-slot="groups"
        >
          <div
            v-for="group in filteredGroups"
            :key="group.name"
            class="space-y-1"
            data-slot="group"
          >
            <h3
              class="mb-3 text-base-medium tracking-wide text-ink-gray-8"
              data-slot="group-title"
            >
              {{ group.name }}
            </h3>
            <div
              v-for="shortcut in group.shortcuts"
              :key="shortcut.description"
              class="grid grid-cols-[1fr_auto] items-start gap-3 rounded-4 py-0.5"
              data-slot="shortcut"
            >
              <span class="text-p-base text-ink-gray-6" data-slot="description">
                {{ shortcut.description }}
              </span>
              <div
                class="flex shrink-0 items-center gap-1.5"
                data-slot="shortcut-keys"
              >
                <KeyboardShortcut
                  :combo="shortcut.combo"
                  :alt-combos="shortcut.altCombos"
                  bg
                />
              </div>
            </div>
          </div>
        </div>
      </slot>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import {
  getShortcutGroups,
  type KeyboardShortcutEntry,
  type KeyboardShortcutGroup,
} from '../../composables/useKeyboardShortcut'
import Dialog from '../Dialog/Dialog.vue'
import KeyboardShortcut from '../KeyboardShortcut/KeyboardShortcut.vue'
import {
  displayText,
  isMacPlatform,
  parseCombo,
} from '../../utils/keyboardShortcutCombo'
import TextInput from '../TextInput/TextInput.vue'
import type { KeyboardShortcutsDialogProps } from './types'

defineOptions({ name: 'KeyboardShortcutsDialog' })

const open = defineModel<boolean>('open', { default: false })

const props = withDefaults(defineProps<KeyboardShortcutsDialogProps>(), {
  title: 'Keyboard Shortcuts',
  paddingTop: '5vh',
  searchThreshold: 20,
})

defineSlots<{
  /** Replaces the default grid. Receives the grouped, enabled shortcuts the search leaves. */
  default?: (props: { groups: KeyboardShortcutGroup[] }) => any
}>()

const searchQuery = ref('')

// An `enabled` getter may read state Vue does not track, such as
// `document.activeElement`. A plain computed would answer from its cache and
// show a stale list on the second open, because the registry did not change.
// Reading this counter makes every open re-ask each getter.
const openCount = ref(0)

watch(open, (isOpen) => {
  if (isOpen) {
    openCount.value++
    return
  }
  // The dialog reopens on the full list. A query left over from the last
  // visit hides most of it, and the reader has no idea why.
  searchQuery.value = ''
})

const groups = computed(() => {
  openCount.value
  return getShortcutGroups()
})

const shortcutCount = computed(() =>
  groups.value.reduce((total, group) => total + group.shortcuts.length, 0),
)

const shouldShowSearch = computed(
  () => shortcutCount.value > props.searchThreshold,
)

const isMac = isMacPlatform()

// A row for `Mod+Slash` draws `Ctrl /`, so a reader who sees `/` types `/`.
// Searching the raw combo alone would answer "No shortcuts match your search".
// The row matches on what it shows as well as on the name behind it.
function searchTextFor(shortcut: KeyboardShortcutEntry): string {
  const combos = [shortcut.combo, ...shortcut.altCombos]
  const shown = combos.map((combo) =>
    displayText(parseCombo(combo, isMac)),
  )
  return [shortcut.description, ...combos, ...shown].join(' ').toLowerCase()
}

const filteredGroups = computed<KeyboardShortcutGroup[]>(() => {
  if (!shouldShowSearch.value || !searchQuery.value) return groups.value

  const query = searchQuery.value.toLowerCase()
  const matches: KeyboardShortcutGroup[] = []

  for (const group of groups.value) {
    if (group.name.toLowerCase().includes(query)) {
      matches.push(group)
      continue
    }
    const shortcuts = group.shortcuts.filter((shortcut) =>
      searchTextFor(shortcut).includes(query),
    )
    if (shortcuts.length) matches.push({ name: group.name, shortcuts })
  }

  return matches
})
</script>
