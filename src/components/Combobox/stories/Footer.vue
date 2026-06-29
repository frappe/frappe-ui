<script setup lang="ts">
import { ref } from 'vue'
import { Combobox } from 'frappe-ui'

const value = ref('')

// A long list so the viewport scrolls — the footer should stay pinned to the
// bottom of the popover instead of scrolling away with the items (#717).
const countries = [
  'Argentina',
  'Australia',
  'Brazil',
  'Canada',
  'Denmark',
  'Egypt',
  'France',
  'Germany',
  'India',
  'Indonesia',
  'Japan',
  'Kenya',
  'Mexico',
  'Netherlands',
  'Norway',
  'Portugal',
  'Singapore',
  'Spain',
  'Sweden',
  'United Kingdom',
  'United States',
  'Vietnam',
]
</script>

<template>
  <div class="grid gap-3">
    <Combobox
      v-model="value"
      :options="countries"
      placeholder="Pick a country"
      open-on-focus
      class="w-64"
    >
      <template #footer="{ query, selectedOption, clearSelection, setOpen }">
        <div
          class="flex items-center justify-between border-t border-outline-gray-1 px-3 py-2 text-sm text-ink-gray-5"
        >
          <span v-if="query">
            Searching “<span class="text-ink-gray-7">{{ query }}</span
            >”
          </span>
          <span v-else>{{ countries.length }} countries</span>
          <button
            v-if="selectedOption"
            class="text-ink-gray-7 hover:text-ink-gray-8"
            @click="clearSelection"
          >
            Clear
          </button>
          <button
            v-else
            class="text-ink-gray-7 hover:text-ink-gray-8"
            @click="setOpen(false)"
          >
            Close
          </button>
        </div>
      </template>
    </Combobox>

    <div class="text-sm text-ink-gray-5">
      Selected: <code class="text-ink-gray-7">{{ value || 'None' }}</code>
    </div>
  </div>
</template>
