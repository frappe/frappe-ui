<script setup lang="ts">
import effects from '../../../tailwind/tokens/effects.js'

// The six shadow steps, all sat on one elevated surface so the scale reads as
// shadow-only. In light mode `surface-elevation-2` is white, so depth comes
// from the shadow; in dark mode it is lighter than the page, which shows the
// depth the shadow can't. The page's table lists the pairs components use.
const STEPS = ['sm', 'base', 'md', 'lg', 'xl', '2xl'] as const

const rows = STEPS.map((step) => ({
  name: step,
  value: effects.elevation.light[step],
}))
</script>

<template>
  <div class="not-prose my-8">
    <div class="grid divide-y divide-outline-gray-1">
      <div
        v-for="row in rows"
        :key="row.name"
        class="flex w-full items-center gap-4 py-4 text-left"
      >
        <div
          class="size-16 shrink-0 rounded-6 bg-surface-elevation-2"
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
