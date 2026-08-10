<script setup lang="ts">
import { ref } from 'vue'
import { MultiSelect } from 'frappe-ui'

const value = ref<string[]>([])

const options = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Blueberry', value: 'blueberry' },
  { label: 'Cherry', value: 'cherry' },
  { label: 'Grape', value: 'grape' },
  { label: 'Orange', value: 'orange' },
]

function clearSearch(setQuery: (value: string) => void, focus: () => void) {
  setQuery('')
  focus()
}
</script>

<template>
  <MultiSelect
    v-model="value"
    :options="options"
    placeholder="Select fruits"
    class="w-72"
  >
    <template #search-prefix>
      <span class="lucide-search size-4 shrink-0 text-ink-gray-5" />
    </template>

    <template #search-suffix="{ query, setQuery, focus }">
      <button
        v-if="query"
        type="button"
        aria-label="Clear search"
        class="grid size-5 shrink-0 place-items-center rounded-4 text-ink-gray-5 hover:bg-surface-gray-2 hover:text-ink-gray-8"
        @pointerdown.prevent
        @click="clearSearch(setQuery, focus)"
      >
        <span class="lucide-x size-3.5" />
      </button>
      <kbd
        v-else
        class="shrink-0 flex items-center justify-center rounded-1 size-5 border border-outline-gray-2 bg-surface-gray-1 text-p-xs text-ink-gray-5"
      >
        F
      </kbd>
    </template>
  </MultiSelect>
</template>
