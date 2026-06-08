<script setup lang="ts">
import { computed } from 'vue'
import { TabButtons } from 'frappe-ui'
import { useTheme, setTheme } from '../../composables/useTheme'

// The six shadow steps, all sat on one elevated surface so the scale reads as
// shadow-only. In light mode `surface-elevation-2` is white, so depth comes
// from the shadow; in dark mode it steps lighter than the page and carries the
// lift the (faded) shadow can't. Real per-component pairings live in the
// Surface pairing table.
const STEPS = ['sm', 'base', 'md', 'lg', 'xl', '2xl'] as const

// The switcher drives the global theme, so the page and these cards swap
// together, with no detached preview, and `bg-surface-*` resolves straight from
// the document's `data-theme`.
const globalTheme = useTheme()
const previewTheme = computed({
  get: () => globalTheme.value,
  set: (next) => setTheme(next),
})

const modeButtons = [
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' },
]
</script>

<template>
  <div>
    <div class="flex justify-end mb-3">
      <TabButtons :buttons="modeButtons" v-model="previewTheme" class="w-fit" />
    </div>

    <div class="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-8 py-4">
      <div v-for="step in STEPS" :key="step" class="grid gap-3">
        <div
          class="h-24 rounded-lg bg-surface-elevation-2"
          :class="`shadow-${step}`"
        ></div>
        <div class="grid gap-0.5">
          <span class="text-2xs font-mono text-ink-gray-7">shadow-{{ step }}</span>
          <span class="text-2xs font-mono text-ink-gray-5">--elevation-{{ step }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
