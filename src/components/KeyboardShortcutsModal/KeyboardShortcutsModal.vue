<template>
  <Dialog
    v-model="showDialog"
    size="6xl"
    position="top"
    :padding-top="paddingTop"
  >
    <template #title>
      <div class="flex items-center pr-3">
        <h3 class="shrink-0 text-2xl font-semibold leading-6 text-ink-gray-9">
          {{ title }}
        </h3>
        <TextInput
          v-if="shouldShowSearch"
          v-model="searchQuery"
          type="text"
          class="ml-auto w-fit"
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
          <h3 class="mb-3 text-base font-medium tracking-wide text-ink-gray-8">
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
              <div
                v-for="(variant, variantIndex) in formatShortcutVariants(
                  shortcut,
                )"
                :key="`${shortcut.id.toString()}-${variantIndex}`"
                class="flex items-center gap-1"
              >
                <kbd
                  v-for="(part, i) in variant"
                  :key="`${variantIndex}-${i}`"
                  class="inline-flex h-6 min-w-6 items-center justify-center rounded border bg-surface-gray-2 px-1.5 py-0.5 font-medium text-ink-gray-7"
                  :class="{ 'text-xs': !part.isSymbol }"
                >
                  {{ part.label }}
                </kbd>
                <span
                  v-if="variantIndex < shortcut.keys.length - 1"
                  class="px-0.5 text-xs text-ink-gray-5"
                >
                  /
                </span>
              </div>
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
import TextInput from '../TextInput/TextInput.vue'

defineOptions({ name: 'KeyboardShortcutsModal' })

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

const showDialog = ref(false)
const searchQuery = ref('')
const activeShortcuts = getActiveShortcuts()

// Robust Mac detection (navigator.platform is deprecated)
const isMac = computed(() => {
  if (typeof navigator === 'undefined') return false
  const p =
    (navigator as Navigator & { userAgentData?: { platform?: string } })
      .userAgentData?.platform ??
    navigator.platform ??
    ''
  return (
    /Mac|iPod|iPhone|iPad/i.test(p) ||
    /Mac OS X|Macintosh/i.test(navigator.userAgent)
  )
})

const keyMap: Record<string, string> = {
  arrowup: '↑',
  arrowdown: '↓',
  arrowleft: '←',
  arrowright: '→',
  escape: 'Esc',
  backspace: '⌫',
  delete: 'Del',
  enter: '↵',
  ' ': 'Space',
  '\\': '\\',
  '=': '+',
  '-': '−',
}

function formatShortcutParts(config: {
  key: string
  ctrl?: boolean
  shift?: boolean
}): { label: string; isSymbol: boolean }[] {
  const parts: { label: string; isSymbol: boolean }[] = []
  if (config.ctrl)
    parts.push({ label: isMac.value ? '⌘' : 'Ctrl', isSymbol: isMac.value })
  if (config.shift)
    parts.push({ label: isMac.value ? '⇧' : 'Shift', isSymbol: isMac.value })
  const displayKey =
    keyMap[config.key.toLowerCase()] ?? config.key.toUpperCase()
  const isSymbolKey = /^[↑↓←→⌫↵−]$/.test(displayKey)
  parts.push({ label: displayKey, isSymbol: isSymbolKey })
  return parts
}

function formatShortcutVariants(
  shortcut: ActiveShortcut,
): { label: string; isSymbol: boolean }[][] {
  return shortcut.keys.map((key) =>
    formatShortcutParts({ key, ctrl: shortcut.ctrl, shift: shortcut.shift }),
  )
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
          const keyParts = formatShortcutVariants(shortcut)
            .flat()
            .map((part) => part.label.toLowerCase())
            .join(' ')
          return (
            shortcut.description.toLowerCase().includes(query) ||
            keyParts.includes(query)
          )
        })

    if (matchingShortcuts.length) filtered[group] = matchingShortcuts
  }

  return filtered
})

const hasVisibleShortcuts = computed(
  () => Object.keys(filteredGroupedShortcuts.value).length > 0,
)

defineExpose({ show: showDialog })
</script>
