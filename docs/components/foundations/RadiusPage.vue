<script setup lang="ts">
import { computed } from 'vue'
import radius from '../../../tailwind/generated/radius.json'

const NUMERIC_KEYS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
// Display order for the unified scale: numerics in order, then `full`.
const SCALE_KEYS = [...NUMERIC_KEYS, 'full']

// Map each alias (`rounded-sm`, `rounded-md`, `rounded`, …) to the numeric
// scale entry that shares its value. The page renders one row per scale
// step; aliases land alongside their numeric twin.
const ALIASES_BY_NUMERIC = computed(() => {
  const table = radius as Record<string, string>
  const aliases: Record<string, string[]> = {}
  const aliasKeys = Object.keys(table).filter(
    (k) => !NUMERIC_KEYS.includes(k) && k !== 'full',
  )
  for (const aliasKey of aliasKeys) {
    const value = table[aliasKey]
    const numeric = NUMERIC_KEYS.find((n) => table[n] === value)
    if (!numeric) continue
    const cls = aliasKey === 'DEFAULT' ? 'rounded' : `rounded-${aliasKey}`
    ;(aliases[numeric] ||= []).push(cls)
  }
  return aliases
})

const rows = computed(() =>
  SCALE_KEYS.filter((k) => k in radius).map((k) => ({
    name: k,
    value: (radius as Record<string, string>)[k],
    aliases: ALIASES_BY_NUMERIC.value[k] || [],
  })),
)
</script>

<template>
  <div class="grid gap-8">
    <section class="grid gap-4">
      <div class="grid divide-y divide-outline-gray-1">
        <div
          v-for="r in rows"
          :key="r.name"
          class="flex w-full items-center gap-4 py-3 text-left"
        >
          <div
            class="size-16 shrink-0 bg-surface-gray-3 border border-outline-gray-3"
            :style="{ borderRadius: r.value }"
          ></div>
          <div class="grid gap-1 min-w-0 flex-1">
            <span class="text-sm font-mono text-ink-gray-8 truncate">
              rounded-{{ r.name }}
            </span>
            <span class="text-xs font-mono text-ink-gray-5 truncate">
              --radius-{{ r.name }}
            </span>
          </div>
          <div
            v-if="r.aliases.length"
            class="flex flex-wrap gap-1.5 shrink-0 justify-end"
          >
            <span
              v-for="alias in r.aliases"
              :key="alias"
              class="text-2xs font-mono text-ink-gray-6 bg-surface-gray-2 rounded px-1.5 py-0.5"
            >
              {{ alias }}
            </span>
          </div>
          <span
            class="text-xs font-mono text-ink-gray-5 shrink-0 tabular-nums w-12 text-right"
          >
            {{ r.value }}
          </span>
        </div>
      </div>
    </section>
  </div>
</template>
