<script setup lang="ts">
// Figma: espresso-2.0 › References › modal 600 (34961:139266) — "modal new",
// variant search. frappe-ui's CommandPalette owns the dialog, query, keyboard
// and filtering; the <style> below only restyles its parts to the frame:
//   card      p 10, 12px between header, body and footer
//   header    ghost md search (32) + outline sm filter chips, 8px apart
//   rows      32px, 10px radius, 1px apart; group labels 13px medium gray-500
//   footer    #EDEDED top rule, 10px above 13px gray-500 hints
import { ref, watch } from 'vue'
import { Badge, Button } from '../../../src'
import {
  CommandPalette,
  CommandPaletteEmpty,
  CommandPaletteFooter,
  CommandPaletteGroup,
  CommandPaletteInput,
  CommandPaletteItem,
  CommandPaletteList,
} from '../../../experimental/CommandPalette'
import './modal.css'

withDefaults(defineProps<{ width?: '600' | '720' }>(), { width: '600' })

const open = defineModel<boolean>('open', { default: false })

const emit = defineEmits<{ select: [value: string] }>()

const filters = [
  { id: 'notebooks', label: 'Notebooks', icon: 'lucide-book-open' },
  { id: 'tables', label: 'Tables', icon: 'lucide-table-2' },
  { id: 'jobs', label: 'Jobs', icon: 'lucide-list-filter' },
  { id: 'assets', label: 'My assets', icon: 'lucide-user' },
]

const actions = [
  { id: 'create-folder', label: 'Create folder', icon: 'lucide-folder-plus', keys: '⌘ F' },
  { id: 'create-shared-folder', label: 'Create shared folder', icon: 'lucide-folder-open', keys: '⌘ S' },
  { id: 'create-file', label: 'Create file', icon: 'lucide-plus', keys: 'N' },
]

const recent = [
  { id: 'new-logo', label: 'New-logo references', date: '24 May' },
  { id: 'logo', label: 'Logo', date: '24 May' },
  { id: 'app-references', label: 'App references', date: '11 May' },
  { id: 'illustration', label: 'illustration', date: '30 Apr' },
]

const activeFilter = ref<string | null>(null)

watch(open, (isOpen) => {
  if (!isOpen) activeFilter.value = null
})

function toggleFilter(id: string) {
  activeFilter.value = activeFilter.value === id ? null : id
}
</script>

<template>
  <CommandPalette
    v-model:open="open"
    :class="['espresso-modal', `espresso-modal--${width}`, 'espresso-search']"
    @select="emit('select', $event as string)"
  >
    <!-- header: search + filter chips, 8px apart -->
    <div class="flex flex-col gap-2">
      <CommandPaletteInput placeholder="Search">
        <template #suffix>
          <Button variant="ghost" size="xs" label="Search settings">
            <template #icon>
              <span class="lucide-sliders-vertical size-3.5 text-ink-gray-4" />
            </template>
          </Button>
        </template>
      </CommandPaletteInput>

      <div class="flex items-center gap-1.5">
        <Button
          v-for="filter in filters"
          :key="filter.id"
          :variant="activeFilter === filter.id ? 'subtle' : 'outline'"
          size="sm"
          :aria-pressed="activeFilter === filter.id"
          @click="toggleFilter(filter.id)"
        >
          <template #prefix>
            <span :class="[filter.icon, 'size-4 text-ink-gray-7']" />
          </template>
          {{ filter.label }}
        </Button>
      </div>
    </div>

    <CommandPaletteList>
      <CommandPaletteGroup label="Quick actions">
        <CommandPaletteItem
          v-for="action in actions"
          :key="action.id"
          :value="action.id"
        >
          <template #prefix>
            <span :class="[action.icon, 'size-4 shrink-0 text-ink-gray-7']" />
          </template>
          {{ action.label }}
          <template #suffix>
            <Badge theme="gray" variant="subtle" size="md">{{ action.keys }}</Badge>
          </template>
        </CommandPaletteItem>
      </CommandPaletteGroup>

      <CommandPaletteGroup label="Recent searches">
        <CommandPaletteItem
          v-for="search in recent"
          :key="search.id"
          :value="search.id"
        >
          <template #prefix>
            <span class="lucide-refresh-cw size-4 shrink-0 text-ink-gray-7" />
          </template>
          {{ search.label }}
          <template #suffix>
            <span class="text-xs text-ink-gray-5">{{ search.date }}</span>
          </template>
        </CommandPaletteItem>
      </CommandPaletteGroup>
    </CommandPaletteList>

    <CommandPaletteEmpty>No results</CommandPaletteEmpty>

    <CommandPaletteFooter>
      <span class="flex items-center gap-1">
        <span class="lucide-arrow-up-down size-3.5" />Select
      </span>
      <span class="flex items-center gap-1">
        <span class="lucide-corner-down-left size-3.5" />Open
      </span>
      <span class="flex items-center gap-1">
        <span class="lucide-command size-3.5" />
        <span class="lucide-corner-down-left size-3.5" />Open in new tab
      </span>
    </CommandPaletteFooter>
  </CommandPalette>
</template>

<style>
/* CommandPalette's parts carry fixed classes; `data-slot` is their styling
   hook. Everything here is scoped to this modal. */
.espresso-search {
  @apply gap-3 p-2.5;
}

/* ghost md search: 32px, pl 8 · pr 4, 8px icon gap, no rule underneath */
.espresso-search [data-slot='command-palette-input'] {
  @apply h-8 gap-2 border-b-0 pl-2 pr-1;
}
.espresso-search [data-slot='command-palette-input'] > .lucide-search {
  @apply text-ink-gray-4;
}
.espresso-search [data-slot='command-palette-input'] input {
  @apply py-0 text-ink-gray-7;
}

/* groups sit 4px apart; rows 1px apart */
.espresso-search [data-slot='command-palette-list'] {
  @apply flex flex-col gap-1;
}
.espresso-search [data-slot='command-palette-group'] {
  @apply m-0 flex flex-col gap-px;
}
.espresso-search [data-slot='command-palette-group-label'] {
  @apply m-0 px-2 py-[8.5px] text-sm-medium text-ink-gray-4;
}

/* 32px row, 10px radius, 6px icon gap, 14px medium gray-800 */
.espresso-search [data-slot='command-palette-item'] {
  @apply mx-0 h-8 gap-1.5 rounded-5 px-2 py-0 text-ink-gray-7;
}

/* The empty-state live region stays mounted (so readers announce it); while
   it has nothing to say, take back the 12px gap it adds to the column. */
.espresso-search > [role='status']:not(:has(*)) {
  @apply -mt-3;
}

/* hints: #EDEDED rule, 10px above, 12px between items */
.espresso-search [data-slot='command-palette-footer'] {
  @apply gap-3 border-outline-gray-1 px-0 pb-0 pt-2.5 text-ink-gray-4;
}
</style>
