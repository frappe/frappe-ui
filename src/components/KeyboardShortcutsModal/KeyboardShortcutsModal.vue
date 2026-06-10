<template>
  <Dialog
    v-model:open="open"
    size="5xl"
    position="top"
    :padding-top="paddingTop"
  >
    <template #title>
      <div class="flex items-center pr-2">
        <h3
          class="shrink-0 text-4xl-semibold leading-6 text-ink-gray-9 flex-1"
        >
          {{ title }}
        </h3>
        <TextInput
          v-if="shouldShowSearch"
          v-model="searchQuery"
          type="text"
          class="w-fit ml-2"
          placeholder="Search shortcuts"
        />
      </div>
    </template>
    <template #default>
      <div
        v-if="!activeShortcuts.length"
        class="h-[20vh] py-8 text-center text-sm text-ink-gray-5"
      >
        No keyboard shortcuts available on this page.
      </div>
      <div
        v-else-if="shouldShowSearch && !hasVisibleShortcuts"
        class="h-[20vh] py-8 text-center text-sm text-ink-gray-5"
      >
        No shortcuts match your search.
      </div>
      <div
        v-else
        class="grid max-h-[70vh] grid-cols-1 gap-8 gap-x-6 overflow-y-auto pr-1 md:grid-cols-2 xl:grid-cols-3"
      >
        <div
          v-for="(shortcuts, group) in filteredGroupedShortcuts"
          :key="group"
          class="space-y-1"
        >
          <h3 class="mb-3 text-base-medium tracking-wide text-ink-gray-8">
            {{ group }}
          </h3>
          <div
            v-for="shortcut in shortcuts"
            :key="shortcut.id.toString()"
            class="grid grid-cols-[1fr_auto] items-start gap-3 rounded py-0.5"
          >
            <span class="text-p-base text-ink-gray-6">
              {{ shortcut.description }}
            </span>
            <div class="flex shrink-0 items-center gap-1.5">
              <KeyboardShortcut
                :combo="toCombo(shortcut, shortcut.keys[0])"
                :alt-combos="
                  shortcut.keys.slice(1).map((k) => toCombo(shortcut, k))
                "
                bg
              />
            </div>
          </div>
        </div>
      </div>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  getActiveShortcuts,
  type ActiveShortcut,
} from '../../composables/useShortcut'
import Dialog from '../Dialog/Dialog.vue'
import KeyboardShortcut from '../KeyboardShortcut.vue'
import TextInput from '../TextInput/TextInput.vue'

defineOptions({ name: 'KeyboardShortcutsModal' })

const open = defineModel<boolean>('open', { default: false })

const props = withDefaults(
  defineProps<{
    /** Dialog title (default: "Keyboard Shortcuts"). */
    title?: string
    /** CSS value for top padding when position is top (default: "5vh"). */
    paddingTop?: string
    /**
     * Minimum number of shortcuts that must be registered before the search
     * input is shown (default: 20).
     */
    searchThreshold?: number
  }>(),
  {
    title: 'Keyboard Shortcuts',
    paddingTop: '5vh',
    searchThreshold: 20,
  },
)

const searchQuery = ref('')
const activeShortcuts = getActiveShortcuts()

/**
 * Converts a shortcut's modifiers and one of its keys into a combo string
 * that <KeyboardShortcut combo="..."> understands, e.g. "Mod+Shift+K".
 */
function toCombo(
  shortcut: { ctrl?: boolean; shift?: boolean; alt?: boolean },
  key: string,
): string {
  const parts: string[] = []
  if (shortcut.ctrl) parts.push('Mod')
  if (shortcut.shift) parts.push('Shift')
  if (shortcut.alt) parts.push('Alt')
  // Normalise special keys so they survive parseCombo's split('+') delimiter.
  const normalised = key === ' ' ? 'Space' : key === '+' ? 'Plus' : key
  parts.push(normalised)
  return parts.join('+')
}

const groupedShortcuts = computed(() => {
  const groups: Record<string, ActiveShortcut[]> = {}
  for (const shortcut of activeShortcuts.value) {
    if (!groups[shortcut.group]) groups[shortcut.group] = []
    groups[shortcut.group].push(shortcut)
  }
  return groups
})

const shouldShowSearch = computed(
  () => activeShortcuts.value.length > props.searchThreshold,
)

const filteredGroupedShortcuts = computed(() => {
  if (!shouldShowSearch.value || !searchQuery.value)
    return groupedShortcuts.value

  const query = searchQuery.value.toLowerCase()
  const filtered: Record<string, ActiveShortcut[]> = {}

  for (const [group, shortcuts] of Object.entries(groupedShortcuts.value)) {
    const groupMatches = group.toLowerCase().includes(query)
    const matchingShortcuts = groupMatches
      ? shortcuts
      : shortcuts.filter((shortcut) => {
          // Search by description or by any key in any of the combo variants
          const comboText = shortcut.keys
            .map((k) => toCombo(shortcut, k))
            .join(' ')
            .toLowerCase()
          return (
            shortcut.description.toLowerCase().includes(query) ||
            comboText.includes(query)
          )
        })

    if (matchingShortcuts.length) filtered[group] = matchingShortcuts
  }

  return filtered
})

const hasVisibleShortcuts = computed(
  () => Object.keys(filteredGroupedShortcuts.value).length > 0,
)
</script>
