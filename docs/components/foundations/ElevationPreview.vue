<script setup lang="ts">
import { computed } from 'vue'
import { TabButtons } from 'frappe-ui'
import { useTheme, setTheme } from '../../composables/useTheme'
import effects from '../../../tailwind/generated/effects.json'

// The six shadow steps, all sat on one elevated surface so the scale reads as
// shadow-only. In light mode `surface-elevation-2` is white, so depth comes
// from the shadow; in dark mode it steps lighter than the page and carries the
// lift the (faded) shadow can't. Real per-component pairings live in the
// Surface pairing table.
const STEPS = ['sm', 'base', 'md', 'lg', 'xl', '2xl'] as const

const rows = STEPS.map((step) => ({
  name: step,
  value: effects.elevation.light[step],
}))

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

    <div class="grid divide-y divide-outline-gray-1">
      <div
        v-for="row in rows"
        :key="row.name"
        class="flex w-full items-center gap-4 py-4 text-left"
      >
        <div
          class="size-16 shrink-0 rounded-lg bg-surface-elevation-2"
          :class="`shadow-${row.name}`"
        ></div>
        <div class="grid gap-0.5 min-w-0 flex-1">
          <span class="text-sm font-mono text-ink-gray-8 truncate">
            shadow-{{ row.name }}
          </span>
          <span class="text-xs font-mono text-ink-gray-5 truncate">
            --elevation-{{ row.name }}
          </span>
        </div>
        <span
          class="max-w-[56%] shrink-0 break-words text-right text-xs font-mono leading-relaxed text-ink-gray-5"
        >
          {{ row.value }}
        </span>
      </div>
    </div>
  </div>
</template>
